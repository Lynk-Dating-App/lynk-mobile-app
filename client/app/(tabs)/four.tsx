import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, Dimensions, Image, 
  ImageBackground, KeyboardAvoidingView, 
  Modal, Platform, RefreshControl, 
  StyleSheet, Switch, TouchableOpacity 
} from 'react-native';
import { SafeAreaView, ScrollView, Text, View } from '../../components/Themed';
import useUser from '../../hook/useUser';
import useAppSelector from '../../hook/useAppSelector';
import useAppDispatch from '../../hook/useAppDispatch';
import { 
  deactivateAccountAction, deleteGalleryImageAction, 
  getUserAction, saveGalleryImageAction, toggleProfileVisibilityAction, 
  updatePreferenceAction, updateProfileImageAction 
} from '../../store/actions/userAction';
import AppInput from '../../components/AppInput/AppInput';
import { COLORS, FONT, SIZES, icons, images } from '../../constants';
import * as ImagePicker from 'expo-image-picker';
import { capitalizeEachWord, capitalizeFirstLetter, extractFileNameFromUri, wordBreaker } from '../../Utils/Generic';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { characterBreaker } from '../../Utils/Generic';
import _ from 'lodash';
import settings from '../../config/settings';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import ReusableModal from '../../components/Modal/ReusableModal';
import { Formik } from 'formik';
import * as Yup from "yup";
import AppBtn from '../../components/common/button/AppBtn';
import Snackbar from '../../helpers/Snackbar';
import { clearDeactivateAccountStatus, clearDeleteImageFromGalleryStatus, clearSaveImageToGalleryStatus, clearToggleProfileVisibilityStatus, clearUpdatePreferenceStatus, clearUploadUserProfileImageStatus } from '../../store/reducers/userReducer';
import { clearSubscribeStatus } from '../../store/reducers/subscriptionReducer';
import tw from 'twrnc';
import { removeTokenFromSecureStore } from '../../components/ExpoStore/SecureStore';

const {width, height} = Dimensions.get('window');
const religion = [
  {value: "Christianity", label: "Christianity"}, {value: "Islam", label: "Islam"}, 
  {value: "Confusionist", label: "Confusionist"}, {value: "Buddhism", label: "Buddhism"},
  {value: "Hinduism", label: "Hinduism"}, {value: "None", label: "None"}, {value: "Others", label: "Others"}
]
const religiousInvolvement = [
  {value: "Not religious", label: "Not religious"}, 
  {value: "Moderately religious", label: "Moderately religious"}, 
  {value: "Very religious", label: "Very religious"}
]
const education = [
  {value: "HND", label: "HND"}, 
  {value: "Bsc/Ba", label: "Bsc/Ba"}, 
  {value: "Msc./Mba", label: "Msc./Mba"}, 
  {value: "Phd", label: "Phd"}, {value: "Others", label: "Others"}
];
const sexualPreference = [
  {value: "Threesome", label: "Threesome"}, 
  {value: "Oral", label: "Oral"}, {value: "BDSM", label: "BDSM"}, 
  {value: "Others", label: "Others"}
]
const relationshipPreference = [
  {value: "Long term", label: "Long term"}, 
  {value: "Short term", label: "Short term"}, 
  {value: "Just for fun", label: "Just for fun"}
]
const personalityTemperament = [
  {value: "Mild", label: "Mild"}, 
  {value: "Average", label: "Average"},
  {value: "Hot", label: "Hot"}
]
const socials = [
  {id: 1, value: "facebook", image: icons.fbook}, 
  {id: 2, value: "twitter", image: icons.twitter2},
  {id: 3, value: "snap", image: icons.snap},
  {id: 4, value: "ig", image: icons.ig},
  {id: 5, value: "tiktok", image: icons.tiktok},
]
const handles = [
  {id: 1, value: "facebook", handle: "fb@com"}, 
  {id: 2, value: "twitter", handle: "icons.twitter2"},
  {id: 3, value: "snap", handle: "icons.snap"},
  {id: 4, value: "ig", handle: "icons.ig"},
  {id: 5, value: "tiktok", handle: "icons.tiktok"},
]

const schema = Yup.object().shape({
  pMinHeight: Yup.string().required().label("minimum height"),
  pMaxHeight: Yup.string().required().label("maximum height"),
  pMinAge: Yup.string().required().label("minimum age"),
  pMaxAge: Yup.string().required().label("maximum age"),
  pAbout: Yup.string().required().label("about")
});

export default function TabFourScreen() {
  const { user } = useUser();
  const [imagePreview, setImagePreview] = useState(null);
  const [brkAddress, setBrkAddress] = useState<number>(5);
  const [brkAbout, setBrkAbout] = useState<number>(80);
  const [brkDesc, setBrkDesc] = useState<number>(100);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [image, setImage] = useState<any>([]);
  const [isUploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [officeAddressBrk, setOfficeAddressBrk] = useState(20);
  const [officeNameBrk, setOfficeNameBrk] = useState(10);
  const [imageUri, setImageUri] = useState(null);
  const [galleryImageUri, setImageGalleryUri] = useState(null);
  const [imageArray, setImageArray] = useState<string[]>([]);
  const [deactivateAccount, setDeactivateAccount] = useState<boolean>(false);
  const [confirmDeactivation, setConfirmDeactivation] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState(false);

  const userReducer = useAppSelector(state => state.userReducer);
  const subscriptionReducer = useAppSelector(state => state.subscriptionReducer);
  const dispatch = useAppDispatch();

  const openImagePicker = async (type: string) => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      };
  
      const result = await ImagePicker.launchImageLibraryAsync(options);
  
      if (!result.canceled) {
        // Use the assets array to get the image URI
        const imageUri = result.assets?.[0];
        
        if (imageUri) {
          type === 'progileImage' ? setImageUri(imageUri) : setImageGalleryUri(imageUri)
          type === 'progileImage' && setImagePreview(imageUri)
        } else {
          console.log('No image URI found in the assets array.');
        }
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

  const renderImage = (image: any, index: number) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleImagePress(index)}
    >
      <Image
        key={index}
        source={{uri: `${settings.api.baseURL}/${image.src}`}}
        style={{ 
          width: image.width,
          height: image.height,
          borderRadius: 8
        }}
      />
    </TouchableOpacity>
  );

  const handleImagePress = (index: number) => {
    if (image[index]) {
      setSelectedImageIndex(index);
      setUploadModalVisible(true);
    } else {
      console.log('Open modal for image upload');
    }
  };

  const handleLogout = async () => {
    await removeTokenFromSecureStore(settings.auth.admin);
    router.push('/unauth/login')
  };

  const toggleProfileVisibility = () => {
    dispatch(toggleProfileVisibilityAction())
  };

  useEffect(() => {
    const imgWithDimensions = imageArray?.map((img: any, index: number) => ({
      src: img,
      width: index < 2 ? 40/100 * width : 26/100 * width,
      height: index < 2 ? 200 : 120
    }));

    // Check if dimensions have changed before updating state
    if (!_.isEqual(imgWithDimensions, image)) {
        setImage(imgWithDimensions);
    }
  }, [imageArray, image]);

  useEffect(() => {
    setImageArray(user?.gallery.filter((image: string) => image))
  },[user])

  useEffect(() => {
    const intervalId: NodeJS.Timeout = setTimeout(() => {
      setIsError(false)
      setError('')
    },6000);

    return () => {
      clearInterval(intervalId);
    }
  },[isError, error]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.updatePreferenceStatus === 'completed') {
      setModalVisible(false);
      dispatch(clearUpdatePreferenceStatus())
    } else if(userReducer.updatePreferenceStatus === 'failed') { 
      setIsError(true)
      setError(userReducer.updatePreferenceError)

      intervalId = setTimeout(() => {
        setIsError(false)
        setError('')
      },6000);
      dispatch(clearUpdatePreferenceStatus())
    }

    return () => {
      clearInterval(intervalId);
    }
  },[userReducer.updatePreferenceStatus]);

  useEffect(() => {
    if(imageUri !== null) {
      const profileImageUrl = {
        uri: imageUri.uri,
        name: imageUri.fileName || extractFileNameFromUri(imageUri.uri),
        type: `${imageUri.type}/${imageUri.uri.split('.')[1]}`,
        size: imageUri.fileSize
      } 

      dispatch(updateProfileImageAction({profileImageUrl}))
    }
  },[imageUri]);

  useEffect(() => {
    if(galleryImageUri !== null) {
      const profileImageUrl = {
        uri: galleryImageUri.uri,
        name: galleryImageUri.fileName || extractFileNameFromUri(galleryImageUri.uri),
        type: `${galleryImageUri.type}/${galleryImageUri.uri.split('.')[1]}`,
        size: galleryImageUri.fileSize
      } 

      dispatch(saveGalleryImageAction({profileImageUrl}))
    }
  },[galleryImageUri]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.saveImageToGalleryStatus === 'completed') {
      dispatch(clearSaveImageToGalleryStatus())
      imageArray.push(userReducer.savedImage)

      setImageGalleryUri(null)
    } else if(userReducer.saveImageToGalleryStatus === 'failed') {
      setIsError(true)
      setError(userReducer.saveImageToGalleryError)
      setImageGalleryUri(null)

      intervalId = setTimeout(() => {
        setIsError(false)
        setError('')
      },6000);
      dispatch(clearSaveImageToGalleryStatus())
    }

    return () => {
      clearInterval(intervalId);
    }
  },[userReducer.saveImageToGalleryStatus]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.deleteImageFromGalleryStatus === 'completed') {
      
      image.splice(selectedImageIndex, 1);
      setUploadModalVisible(false)
      dispatch(clearDeleteImageFromGalleryStatus())
    } else if(userReducer.deleteImageFromGalleryStatus === 'failed') {
      setIsError(true)
      setError(userReducer.deleteImageFromGalleryError)
      setImageGalleryUri(null)

      intervalId = setTimeout(() => {
        setIsError(false)
        setError('')
      },6000);
      dispatch(clearDeleteImageFromGalleryStatus())
    }

    return () => {
      clearInterval(intervalId);
    }
  },[userReducer.deleteImageFromGalleryStatus]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.uploadUserProfileImageStatus === 'completed') {
      dispatch(clearUploadUserProfileImageStatus())
      dispatch(getUserAction(user?._id))
      setImageUri(null)
    } else if(userReducer.uploadUserProfileImageStatus === 'failed') {
      setIsError(true)
      setError(userReducer.uploadUserProfileImageError)
      setImageUri(null)

      intervalId = setTimeout(() => {
        setIsError(false)
        setError('')
      },6000);
      dispatch(clearUploadUserProfileImageStatus())
    }

    return () => {
      clearInterval(intervalId);
    }
  },[userReducer.uploadUserProfileImageStatus]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(subscriptionReducer.subscribeStatus === 'completed') {

      setIsSuccess(true)
      setSuccess("Your subscription was successful.")

      intervalId = setTimeout(() => {
        setIsSuccess(false)
        setSuccess('')
      },6000);
      dispatch(clearSubscribeStatus())
    }

    return () => {
      clearInterval(intervalId);
    }
  },[subscriptionReducer.subscribeStatus]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.deactivateAccountStatus === 'completed') {
      handleLogout();
      // dispatch(clearDeactivateAccountStatus());
    } else if(userReducer.deactivateAccountStatus === 'failed') {
      setIsError(true)
      setError(userReducer.deactivateAccountError)

      intervalId = setTimeout(() => {
        setIsError(false)
        setError('')
      },6000);
      dispatch(clearDeactivateAccountStatus())
    }

    return () => {
      clearInterval(intervalId);
    }
  },[userReducer.deactivateAccountStatus]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.toggleProfileVisibilityStatus === 'completed') {
      setIsEnabled(userReducer.profileVisible)
      setIsSuccess(true)
      setSuccess(userReducer.profileVisible
                  ? "Profile visibility is enabled, allowing other users to view your profile." 
                  : "Profile visibility is disabled.")

      intervalId = setTimeout(() => {
        setIsSuccess(false)
        setSuccess('')
      },6000);
      dispatch(clearToggleProfileVisibilityStatus());
    } else if(userReducer.toggleProfileVisibilityStatus === 'failed') {
      setIsError(true)
      setError(userReducer.toggleProfileVisibilityError)

      intervalId = setTimeout(() => {
        setIsError(false)
        setError('')
      },6000);
    }

    return () => {
      clearInterval(intervalId)
    }
  },[userReducer.toggleProfileVisibilityStatus]);

  useEffect(() => {
    setIsEnabled(user?.profileVisibility)
  },[user])

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false} 
        contentContainerStyle={{
          display: 'flex', 
          paddingTop: Platform.select({android: 20, ios: 0}), 
          height: 'auto'
        }}
        refreshControl={<RefreshControl refreshing={userReducer.getUserStatus === 'loading'} onRefresh={() => dispatch(getUserAction(user?._id))}/>}
      >
        <ImageBackground
          source={{uri: `${settings.api.baseURL}/${user?.profileImageUrl}`}}
          style={{
              width: width,
              height: 50/100 * height
          }}
        />
        <View style={styles.container}>
          <View 
            style={{
              backgroundColor: 'transparent',
              marginTop: -50,
              position: 'relative',
              marginBottom: 170
            }}
          >
            <View>
              {imagePreview === null && (<Image
                  source={!user?.profileImageUrl 
                            ? images.no_image_m
                            : {uri: `${settings.api.baseURL}/${user?.profileImageUrl}`}}
                  resizeMode='cover'
                  //@ts-ignore
                  style={{
                      height: 120,
                      width: 120,
                      alignSelf: 'center',
                      borderRadius: 30,
                      position: 'absolute',
                      zIndex: 1,
                      borderColor: COLORS.gray2,
                      borderWidth: 0.3
                  }}
              />)}
              {imagePreview !== null && (<Image
                source={imagePreview}
                resizeMode='cover'
                //@ts-ignore
                style={{
                    height: 120,
                    width: 120,
                    alignSelf: 'center',
                    borderRadius: 30,
                    position: 'absolute',
                    zIndex: 1,
                }}
              />)}
            </View>
            <TouchableOpacity onPressIn={() => openImagePicker('progileImage')}>
              {userReducer.uploadUserProfileImageStatus === 'loading' 
                  ? <ActivityIndicator
                      style={{
                        position: 'absolute',
                        marginTop: 95,
                        marginLeft: 220,
                        zIndex: 2,
                        backgroundColor: COLORS.primary,
                        height: 40,
                        width: 40,
                        borderRadius: 50,
                      }}
                    />
                  : <Image
                      source={icons.cameraIcon}
                      resizeMode='cover'
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 50,
                        position: 'absolute',
                        marginTop: 95,
                        marginLeft: 220,
                        zIndex: 2
                      }}
                    />
              }
            </TouchableOpacity>
          </View>

          <View style={styles.section1}>
            <View style={styles.subSection}>
              <Text
                style={{
                  fontFamily: FONT.extraBold,
                  fontSize: user?.firstName.length + user?.lastName.length > 10 ? SIZES.xLarge : SIZES.xxLarge
                }}
              >{capitalizeFirstLetter(user?.firstName)} {`${capitalizeFirstLetter(user?.lastName)},`} {user?.age}
              </Text>
              <Text
                style={{
                  fontFamily: FONT.regular,
                  fontSize: user?.jobType.length > 10 ? SIZES.large : SIZES.xLarge,
                  color: COLORS.tertiary
                }}
              >
                {capitalizeEachWord(user?.jobType)}
              </Text>
              {userReducer.loggedInuser?.planType !== 'black' && (<View style={[{
                  alignSelf: 'flex-start',
                  marginTop: Platform.select({ios: 15, android: 0})
                }, tw`flex flex-row justify-center items-center gap-2`]}>
                {userReducer.toggleProfileVisibilityStatus !== 'loading' && (<Switch
                  trackColor={{false: COLORS.gray2, true: COLORS.lightPrimary}}
                  thumbColor={isEnabled ? COLORS.primary : COLORS.gray}
                  ios_backgroundColor={COLORS.gray2}
                  onValueChange={toggleProfileVisibility}
                  value={isEnabled}
                  style={{
                    marginLeft: Platform.select({android: -10, ios: 0})
                  }}
                />)}
                {userReducer.toggleProfileVisibilityStatus === 'loading' && <ActivityIndicator color={COLORS.primary}/>}
              </View>)}
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push('/auth/edit-user-detail')
              }}
              style={styles.editBtnWrapper}
            >
              <FontAwesome
                name='pencil'
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: "center",
              flexDirection: 'row', gap: 12,
              marginHorizontal: 20
            }}
          >
            <TouchableOpacity style={styles.superLikeSection}
              onPress={() => router.push('/auth/favourites')}
            >
              <FontAwesome
                name='star'
                color={'green'}
                size={40}
              />
              <Text
                style={{
                  fontFamily: FONT.medium,
                  fontSize: 14
                }}
              >{`${user?.favourites.length} Super Likes`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.superLikeSection}>
              <Image
                source={icons.boost}
                style={{
                  width: 40,
                  height: 40
                }}
                resizeMode='contain'
              />
              <Text
                style={{
                  fontFamily: FONT.medium,
                  fontSize: 14
                }}
              >Upgrade Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.superLikeSection}
              onPress={() => router.push('/auth/billing')}
            >
              <Image
                source={icons.sub}
                style={{
                  width: 40,
                  height: 40
                }}
                resizeMode='contain'
              />
              <Text
                style={{
                  fontFamily: FONT.medium,
                  fontSize: 14
                }}
              >Subscriptions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section2}>
            <Text
              style={{
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large
              }}
            >
              Bio
            </Text>
            <Text
              style={{
                fontFamily: FONT.regular,
                fontSize: 18,
                color: COLORS.tertiary
              }}
            >
              {characterBreaker(capitalizeFirstLetter(user?.about), brkAbout)}{brkAbout !== user?.about.length && '...'}
            </Text>
            {brkAbout !== user?.about.length && (<TouchableOpacity 
              onPress={() => setBrkAbout(user?.about.length)}
            >
              <Text
                style={{
                  fontFamily: FONT.bold,
                  fontSize: SIZES.medium,
                  color: COLORS.primary,
                  marginTop: 5
                }}
              >See more</Text>
            </TouchableOpacity>)}
          </View>

          <View style={styles.section2}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Text
                style={{
                  fontFamily: FONT.extraBold,
                  fontSize: SIZES.large
                }}
              >
                Job Description
              </Text>
              <Text
                onPress={() => router.push('/auth/modals/job-description')}
                style={{
                  fontFamily: FONT.extraBold,
                  fontSize: SIZES.medium,
                  color: COLORS.primary
                }}
              >
                Edit
              </Text>
            </View>
            
            <Text
              style={{
                fontFamily: FONT.regular,
                fontSize: 18,
                color: COLORS.tertiary
              }}
            >
              {characterBreaker(capitalizeFirstLetter(user?.jobDescription), brkDesc)}{brkDesc < user?.jobDescription && user?.jobDescription?.length ? '...' : ''}
            </Text>
            {brkDesc < user?.jobDescription?.length && (<TouchableOpacity 
              onPress={() => setBrkDesc(user?.jobDescription?.length)}
            >
              <Text
                style={{
                  fontFamily: FONT.bold,
                  fontSize: SIZES.medium,
                  color: COLORS.primary,
                  marginTop: 5
                }}
              >See more</Text>
            </TouchableOpacity>)}
          </View>

          <View style={styles.section2}>
            <Text
              style={{
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large
              }}
            >
              Address
            </Text>
            <Text
              style={{
                fontFamily: FONT.regular,
                fontSize: 18,
                color: COLORS.tertiary
              }}
            >
              {wordBreaker(capitalizeEachWord(user?.address), brkAddress)}{brkAddress < user?.address?.length ? '...' : ''}
            </Text>
            {brkAddress < user?.address?.length && (<TouchableOpacity 
              onPress={() => setBrkAddress(user?.address?.length)}
            >
              <Text
                style={{
                  fontFamily: FONT.bold,
                  fontSize: SIZES.medium,
                  color: COLORS.primary,
                  marginTop: 5
                }}
              >See more</Text>
            </TouchableOpacity>)}
          </View>

          <View style={styles.section2}>
            <Text
              style={{
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large
              }}
            >
              Office Name
            </Text>
            <Text
              style={{
                fontFamily: FONT.regular,
                fontSize: 18,
                color: COLORS.tertiary
              }}
            >
              {user?.officeName
                ? `${characterBreaker(capitalizeFirstLetter(user?.officeName), officeNameBrk)}${officeNameBrk < user?.officeName?.length ? '...' : ''}`
                : ''}
            </Text>
            {officeNameBrk < user?.officeName?.length && (<TouchableOpacity 
              onPress={() => setOfficeNameBrk(user?.officeName?.length)}
            >
              <Text
                style={{
                  fontFamily: FONT.bold,
                  fontSize: SIZES.medium,
                  color: COLORS.primary,
                  marginTop: 5
                }}
              >See more</Text>
            </TouchableOpacity>)}
          </View>

          <View style={styles.section2}>
            <Text
              style={{
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large
              }}
            >
              Office Address
            </Text>
            <Text
              style={{
                fontFamily: FONT.regular,
                fontSize: 18,
                color: COLORS.tertiary
              }}
            >
              {user?.officeAddress !== null
                ? `${characterBreaker(capitalizeFirstLetter(user?.officeAddress), officeAddressBrk)}${officeAddressBrk < user?.officeAddress?.length ? '...' : ''}`
                : ''}
            </Text>
            {officeAddressBrk < user?.officeAddress?.length && (<TouchableOpacity 
              onPress={() => setOfficeAddressBrk(user?.officeAddress?.length)}
            >
              <Text
                style={{
                  fontFamily: FONT.bold,
                  fontSize: SIZES.medium,
                  color: COLORS.primary,
                  marginTop: 5
                }}
              >See more</Text>
            </TouchableOpacity>)}
          </View>

          <View style={styles.section3}>
            <Text
              style={{
                color: 'black',
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large,
                marginBottom: 5
              }}
            >Interests</Text>
            <View 
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
            {user?.interests?.length > 0 
              ? user?.interests.map((interest: string, index: number) => (
                <View style={[styles.interests, {backgroundColor: COLORS.primary}]} key={index}>
                  <Text
                    style={{
                      fontFamily: FONT.bold,
                      fontSize: SIZES.medium,
                      color: "white"
                    }}
                  >
                    { interest }
                  </Text>
                </View>
              )) : (
                <Text
                  style={{
                    fontFamily: FONT.medium,
                    fontSize: SIZES.small,
                    color: COLORS.tertiary
                  }}
                >No record found</Text>
              )
            }
            </View>
          </View>

          <View style={styles.section3}>
            <Text
              style={{
                color: 'black',
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large,
                marginBottom: 5
              }}
            >Religion</Text>
            <View 
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
            {religion?.length > 0 
              ? religion.map((religion: any, index: number) => (
                <View 
                  style={[
                    styles.religion, { backgroundColor: religion.value === user?.religion ? COLORS.primary : 'white' }
                  ]} key={index}>
                  <Text
                    style={{
                      fontFamily: FONT.bold,
                      fontSize: SIZES.medium,
                      color: religion.value === user?.religion ? 'white' : COLORS.gray2
                    }}
                  >
                    { religion.value }
                  </Text>
                </View>
              )) : (
                <Text
                  style={{
                    fontFamily: FONT.medium,
                    fontSize: SIZES.small,
                    color: COLORS.tertiary
                  }}
                >No record found</Text>
              )
            }
            </View>
          </View>

          <View style={styles.section3}>
            <Text
              style={{
                color: 'black',
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large,
                marginBottom: 5
              }}
            >Religious Involvement</Text>
            <View 
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
            {religiousInvolvement?.length > 0 
              ? religiousInvolvement.map((involvement: any, index: number) => (
                <View 
                  style={[
                    styles.religiousInvolvement, { backgroundColor: involvement.value === user?.religiousInvolvement ? COLORS.primary : 'white' }
                  ]} key={index}>
                  <Text
                    style={{
                      fontFamily: FONT.bold,
                      fontSize: SIZES.medium,
                      color: involvement.value === user?.religiousInvolvement ? 'white' : COLORS.gray2,
                      textAlign: 'center'
                    }}
                  >
                    { involvement.value }
                  </Text>
                </View>
              )) : (
                <Text
                  style={{
                    fontFamily: FONT.medium,
                    fontSize: SIZES.small,
                    color: COLORS.tertiary
                  }}
                >No record found</Text>
              )
            }
            </View>
          </View>

          <View style={styles.section3}>
            <Text
              style={{
                color: 'black',
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large,
                marginBottom: 5
              }}
            >Level of Education</Text>
            <View 
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
            {education?.length > 0 
              ? education.map((education: any, index: number) => (
                <View 
                  style={[
                    styles.religion, { backgroundColor: education.value === user?.education ? COLORS.primary : 'white' }
                  ]} key={index}>
                  <Text
                    style={{
                      fontFamily: FONT.bold,
                      fontSize: SIZES.medium,
                      color: education.value === user?.education ? 'white' : COLORS.gray2
                    }}
                  >
                    { education.value }
                  </Text>
                </View>
              )) : (
                <Text
                  style={{
                    fontFamily: FONT.medium,
                    fontSize: SIZES.small,
                    color: COLORS.tertiary
                  }}
                >No record found</Text>
              )
            }
            </View>
          </View>

          <View style={styles.section3}>
            <Text
              style={{
                color: 'black',
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large,
                marginBottom: 5
              }}
            >Sexual Preference</Text>
            <View 
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
            {sexualPreference?.length > 0 
              ? sexualPreference.map((sex: any, index: number) => (
                <View 
                  style={[styles.sexualPreference, { backgroundColor: sex.value === user?.sexualPreference ? COLORS.primary : 'white' }]} 
                  key={index}
                >
                  <Text
                    style={{
                      fontFamily: FONT.bold,
                      fontSize: SIZES.medium,
                      color: sex.value === user?.sexualPreference ? 'white' : COLORS.gray2
                    }}
                  >
                    { sex.value }
                  </Text>
                </View>
              )) : (
                <Text
                  style={{
                    fontFamily: FONT.medium,
                    fontSize: SIZES.small,
                    color: COLORS.tertiary
                  }}
                >No record found</Text>
              )
            }
            </View>
          </View>

          <View style={styles.section3}>
            <Text
              style={{
                color: 'black',
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large,
                marginBottom: 5
              }}
            >Relationship Preference</Text>
            <View 
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
            {relationshipPreference?.length > 0 
              ? relationshipPreference.map((relationship: any, index: number) => (
                <View 
                  style={[styles.sexualPreference, { backgroundColor: relationship.value === user?.relationshipPreference ? COLORS.primary : 'white' }]} 
                  key={index}
                >
                  <Text
                    style={{
                      fontFamily: FONT.bold,
                      fontSize: SIZES.medium,
                      color: relationship.value === user?.relationshipPreference ? 'white' : COLORS.gray2
                    }}
                  >
                    { relationship.value }
                  </Text>
                </View>
              )) : (
                <Text
                  style={{
                    fontFamily: FONT.medium,
                    fontSize: SIZES.small,
                    color: COLORS.tertiary
                  }}
                >No record found</Text>
              )
            }
            </View>
          </View>

          <View style={styles.section3}>
            <Text
              style={{
                color: 'black',
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large,
                marginBottom: 5
              }}
            >Personality Temperament</Text>
            <View 
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
            {personalityTemperament?.length > 0 
              ? personalityTemperament.map((personality: any, index: number) => (
                <View 
                  style={[styles.sexualPreference, { backgroundColor: personality.value === user?.personalityTemperament ? COLORS.primary : 'white' }]} 
                  key={index}
                >
                  <Text
                    style={{
                      fontFamily: FONT.bold,
                      fontSize: SIZES.medium,
                      color: personality.value === user?.personalityTemperament ? 'white' : COLORS.gray2
                    }}
                  >
                    { personality.value }
                  </Text>
                </View>
              )) : (
                <Text
                  style={{
                    fontFamily: FONT.medium,
                    fontSize: SIZES.small,
                    color: COLORS.tertiary
                  }}
                >No record found</Text>
              )
            }
            </View>
          </View>

          {/* <View style={styles.section3}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%'
              }}
            >
              <Text
                style={{
                  fontFamily: FONT.extraBold,
                  fontSize: SIZES.large
                }}
              >Social Media Handles</Text>
              <Text
                onPress={() => console.log('sociala')}
                style={{
                  fontFamily: FONT.extraBold,
                  fontSize: SIZES.medium,
                  color: COLORS.primary
                }}
              >
                Edit
              </Text>
            </View>
            
            <View
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                gap: 10
              }}
            >
              {socials.map((data) => (
                <View key={data.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    source={data.image}
                    style={{
                      height: 20,
                      width: 20, 
                      marginRight: 5
                    }}
                  />
                  <Text 
                    style={{
                      fontFamily: FONT.bold,
                      fontSize: SIZES.medium,
                    }}
                  >{data.value}</Text>
                  
                  <View
                    style={{
                      height: 20,
                      width: 1.5,
                      backgroundColor: COLORS.gray2
                    }}
                  ></View>
                </View>
              ))}
            </View>
            
          </View> */}

          <View style={styles.section2}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%'
              }}
            >
              <Text
                style={{
                  fontFamily: FONT.extraBold,
                  fontSize: SIZES.large
                }}
              >
                Partner Preference
              </Text>
            </View>
            
            <Text
              style={{
                fontFamily: FONT.regular,
                fontSize: SIZES.medium,
                color: COLORS.tertiary
              }}
            >
              This is what you want in a propective partner...
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5
              }}
            >
              <Text
                style={{
                  fontFamily: FONT.extraBold,
                  fontSize: SIZES.medium,
                  color: COLORS.primary
                }}
              >View</Text>
            </TouchableOpacity>
            <View>

            </View>
          </View>

          <View style={[styles.gallery, {marginTop: 20}]}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: 'black',
                  fontFamily: FONT.extraBold,
                  fontSize: SIZES.large,
                  marginBottom: 5,
                  alignSelf: 'flex-start'
                }}
              >Gallery</Text>
              {user?.gallery.length !== 5 && (<TouchableOpacity
                onPressIn={() => openImagePicker('gallery')}
              >
                {userReducer.saveImageToGalleryStatus !== 'loading' && (<Text
                  style={{
                    fontFamily: FONT.bold,
                    fontSize: SIZES.medium,
                    color: COLORS.primary
                  }}
                >upload</Text>)}
                {userReducer.saveImageToGalleryStatus === 'loading' && <ActivityIndicator color={COLORS.primary}/>}
              </TouchableOpacity>)}
            </View>
            
            {user?.gallery.length > 0 
                ? (<>
                    <View style={styles.firstImageSet} >
                      {image?.slice(0,2).map(renderImage)}
                    </View>
                    <View style={styles.secondImageSet} >
                      {image?.slice(2).map((img: any, index: number) => renderImage(img, index + 2))}
                    </View>
                  </>
                ) : (
                    <Text
                      style={{
                        fontFamily: FONT.medium,
                        fontSize: SIZES.medium,
                        color: COLORS.tertiary,
                        alignSelf: 'flex-start'
                      }}
                    >No record found</Text>
                )
            }
          </View>

          <View style={styles.section3}>
           <Text
              style={{
                color: 'black',
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large,
                marginBottom: 12
              }}
            >Accounts & Settings</Text>
            <View
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 8,
                flexDirection: 'column'
              }}
            >
              <TouchableOpacity
                onPress={() => router.push('/auth/privacy-security')}
              >
                <Text
                  style={{
                    fontFamily: FONT.bold,
                    fontSize: SIZES.medium
                  }}
                >
                  Settings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/auth/billing')}
              >
                <Text
                  style={{
                    fontFamily: FONT.bold,
                    fontSize: SIZES.medium
                  }}
                >
                  Billing & Payment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDeactivateAccount(true)}>
                <Text
                  style={{
                    fontFamily: FONT.bold,
                    fontSize: SIZES.medium
                  }}
                >
                  Deactivate Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={isUploadModalVisible}
        transparent={true}
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)' 
          }}
        >
          {selectedImageIndex !== -1 && image[selectedImageIndex] ? (
              <Image
                  source={{uri: `${settings.api.baseURL}/${image[selectedImageIndex].src}`}}
                  style={{ 
                      width: '90%', 
                      height: '60%',
                      position: 'absolute',
                      borderRadius: 20
                  }}
              />
          ) : (
            <Text>Upload Image Modal (Implement your logic)</Text>
          )}
          <View
            style={{
              position: 'relative',
              alignSelf: 'flex-end',
              marginTop: Platform.select({ios: -330, android: -380}),
              marginRight: 30,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              gap: 20
            }}
          >
            <TouchableOpacity 
              onPress={() => {
                dispatch(deleteGalleryImageAction({photo: user?.gallery[selectedImageIndex]}))
              }}
              style={styles.delete}
            >
              {userReducer.deleteImageFromGalleryStatus !== 'loading' && (<FontAwesome
                name="trash"
                size={20}
                color={'white'}
              />)}
              {userReducer.deleteImageFromGalleryStatus === 'loading' && <ActivityIndicator color='white' />}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setUploadModalVisible(false)}
              style={styles.close}
            >
              <Text style={{
                color: 'white',
                fontFamily: FONT.bold
              }}>Close</Text>
            </TouchableOpacity>
          </View>
            
        </View>
      </Modal>

      {modalVisible && (<ReusableModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopStartRadius: 30,
              borderTopEndRadius: 30,
              width: '100%',
              height: Platform.select({android: '80%', ios: '90%'})
            }}
            animationViewStyle={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{
              display: 'flex', 
              paddingTop: Platform.select({android: 20, ios: 0}), 
              height: 'auto'
            }}
          >
            <KeyboardAvoidingView
              style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            >
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 100
                }}
              >
                <Text
                  style={{
                    fontFamily: FONT.extraBold,
                    fontSize: SIZES.large,
                  }}
                >Partner Preference</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                >
                <FontAwesome
                  name="close"
                  size={30}
                  color={COLORS.primary}
                />
                </TouchableOpacity>
              </View>
              <Formik
                initialValues={{ 
                  pAbout: user?.preference?.pAbout || '',
                  pMinAge: user?.preference?.pMinAge || '',
                  pMaxAge: user?.preference?.pMaxAge || '',
                  pMinHeight: user?.preference?.pMinHeight || '',
                  pMaxHeight: user?.preference?.pMaxHeight || '',
                }}
                validationSchema={schema}
                onSubmit={(values: any) => {
                  if(+values.pMinHeight > +values.pMaxHeight) {
                    setIsError(true)
                    setError('Min height cannot be greater than Max height.')
                    return
                  }

                  if(+values.pMinAge > +values.pMaxAge) {
                    setIsError(true)
                    setError('Min age cannot be greater than Max age.')
                    return
                  }

                  const payload = {
                    preference: {
                      ...values
                    }
                  }

                  dispatch(updatePreferenceAction(payload))
                }}
              >
                {({ handleChange, handleSubmit, values, errors, touched }) => (
                    <View style={styles.formContainer}>
                      <AppInput
                        placeholder={''}
                        hasPLaceHolder={true}
                        placeholderTop={'About'}
                        value={values.pAbout}
                        style={{
                          width: 90/100 * width,
                          height: 150,
                          borderColor: errors.pAbout ? 'red' : COLORS.gray2
                        }}
                        headerStyle={{
                          fontFamily: FONT.semiBold,
                          fontSize: SIZES.medium,
                          marginLeft: 10,
                          color: COLORS.gray
                        }}
                        errorTextStyle={{
                          marginLeft: 10
                        }}
                        onChangeText={handleChange('pAbout')}
                        multiline={true}
                        showError={false}
                        error={errors.pAbout}
                        touched={touched.pAbout}
                      />
                      
                      <View 
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 20
                        }}
                      >
                        <AppInput
                          placeholder={''}
                          hasPLaceHolder={true}
                          placeholderTop={'Min Height'}
                          value={values.pMinHeight}
                          style={{
                            width: 43/100 * width,
                            borderColor: errors.pMinHeight ? 'red' : COLORS.gray2
                          }}
                          headerStyle={{
                            fontFamily: FONT.semiBold,
                            fontSize: SIZES.medium,
                            marginLeft: 10,
                            color: COLORS.gray
                          }}
                          errorTextStyle={{
                              marginLeft: 1
                          }}
                          onChangeText={handleChange('pMinHeight')}
                          error={errors.pMinHeight}
                          touched={touched.pMinHeight}
                          keyboardType="numeric"
                          showError={false}
                        />
                        <AppInput
                          placeholder={''}
                          hasPLaceHolder={true}
                          placeholderTop={'Max Height'}
                          value={values.pMaxHeight}
                          style={{
                            width: 43/100 * width,
                            borderColor: errors.pMaxHeight ? 'red' : COLORS.gray2
                          }}
                          headerStyle={{
                            fontFamily: FONT.semiBold,
                            fontSize: SIZES.medium,
                            marginLeft: 10,
                            color: COLORS.gray
                          }}
                          errorTextStyle={{
                              marginLeft: 1
                          }}
                          onChangeText={handleChange('pMaxHeight')}
                          error={errors.pMaxHeight}
                          touched={touched.pMaxHeight}
                          keyboardType="numeric"
                          showError={false}
                        />
                        
                      </View>

                      <View 
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 20
                        }}
                      >
                        <AppInput
                          placeholder={''}
                          hasPLaceHolder={true}
                          placeholderTop={'Min Age'}
                          value={values.pMinAge}
                          style={{
                            width: 43/100 * width,
                            borderColor: errors.pMinAge ? 'red' : COLORS.gray2
                          }}
                          headerStyle={{
                            fontFamily: FONT.semiBold,
                            fontSize: SIZES.medium,
                            marginLeft: 10,
                            color: COLORS.gray
                          }}
                          errorTextStyle={{
                            marginLeft: 1
                          }}
                          onChangeText={handleChange('pMinAge')}
                          error={errors.pMinAge}
                          touched={touched.pMinAge}
                          keyboardType="numeric"
                          showError={false}
                        />
                        <AppInput
                          placeholder={''}
                          hasPLaceHolder={true}
                          placeholderTop={'Max Age'}
                          value={values.pMaxAge}
                          style={{
                            width: 43/100 * width,
                            borderColor: errors.pMaxAge ? 'red' : COLORS.gray2
                          }}
                          headerStyle={{
                            fontFamily: FONT.semiBold,
                            fontSize: SIZES.medium,
                            marginLeft: 10,
                            color: COLORS.gray
                          }}
                          errorTextStyle={{
                            marginLeft: 1
                          }}
                          onChangeText={handleChange('pMaxAge')}
                          error={errors.pMaxAge}
                          touched={touched.pMaxAge}
                          keyboardType="numeric"
                          showError={false}
                        />
                      </View>
                      <AppBtn
                        handlePress={() => handleSubmit()}
                        isText={true}
                        btnTitle={'Save'} 
                        btnWidth={'90%'} 
                        btnHeight={60} 
                        btnBgColor={COLORS.primary}
                        btnTextStyle={{
                            fontSize: SIZES.medium,
                            fontFamily: FONT.bold
                        }}
                        btnStyle={{
                            marginBottom: 20,
                            marginTop: 40,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}
                        spinner={userReducer.updatePreferenceStatus === 'loading'}
                        spinnerColor='white'
                        spinnerStyle={{
                          marginLeft: 10
                        }}
                      />
                    </View>
                )}
              </Formik>
            </KeyboardAvoidingView>
          </ScrollView>
        </ReusableModal>)}

        {deactivateAccount && (<ReusableModal
            modalVisible={deactivateAccount}
            setModalVisible={setModalVisible}
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopStartRadius: 30,
              borderTopEndRadius: 30,
              borderBottomStartRadius: 30,
              borderBottomEndRadius: 30,
              width: '95%',
              height: 'auto'
            }}
            animationViewStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{
              display: 'flex', 
              paddingTop: Platform.select({android: 20, ios: 0}), 
              height: 'auto'
            }}
          >
            <KeyboardAvoidingView
              style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            >
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 100
                }}
              >
                <Text
                  style={{
                    fontFamily: FONT.extraBold,
                    fontSize: SIZES.large,
                  }}
                >Deactivate Account</Text>
                <TouchableOpacity
                  onPress={() => {
                    setConfirmDeactivation('')
                    setDeactivateAccount(false)
                  }}
                >
                <FontAwesome
                  name="close"
                  size={30}
                  color={COLORS.primary}
                />
                </TouchableOpacity>
              </View>
              <View style={tw`flex justify-center flex-col items-center mt-5`}>
                <Text
                  style={{
                    fontFamily: FONT.semiBold,
                    fontSize: SIZES.medium,
                    marginBottom: 10
                  }}
                >
                  {`You are on the verge of permanently deactivating your account, and this action cannot be undone.`}
                </Text>
                <View style={tw`flex flex-row flex-wrap`}>
                  <Text
                    style={{
                      fontFamily: FONT.semiBold,
                      fontSize: SIZES.medium
                    }}
                  >
                    To confirm, type {" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONT.extraBold,
                      color: COLORS.primary,
                      fontSize: SIZES.medium
                    }}
                  >{`"${user?.email}"`}</Text>
                  <Text
                    style={{
                      fontFamily: FONT.semiBold,
                      fontSize: SIZES.medium
                    }}
                  >
                    {" "} in the box
                  </Text>
                  
                </View>
                
                <AppInput
                  placeholder={''}
                  hasPLaceHolder={true}
                  placeholderTop={''}
                  value={confirmDeactivation}
                  style={{
                    width: 80/100 * width,
                    borderColor: COLORS.gray
                  }}
                  headerStyle={{
                    fontFamily: FONT.semiBold,
                    fontSize: SIZES.medium,
                    marginLeft: 10,
                    color: COLORS.gray
                  }}
                  errorTextStyle={{
                    marginLeft: 1
                  }}
                  onChangeText={(text: string) => setConfirmDeactivation(text)}
                  showError={false}
                />
                <AppBtn
                  isDisabled={confirmDeactivation !== user?.email}
                  handlePress={() => dispatch(deactivateAccountAction({userId: user?._id}))}
                  isText={true}
                  btnTitle={'Deactivate'} 
                  btnWidth={'90%'} 
                  btnHeight={60} 
                  btnBgColor={COLORS.primary}
                  btnTextStyle={{
                    fontSize: SIZES.medium,
                    fontFamily: FONT.bold
                  }}
                  btnStyle={{
                    marginBottom: 20,
                    marginTop: 40,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    backgroundColor: confirmDeactivation !== user?.email ? COLORS.gray2 : COLORS.primary
                  }}
                  spinner={userReducer.deactivateAccountStatus === 'loading'}
                  spinnerColor='white'
                  spinnerStyle={{
                    marginLeft: 10
                  }}
                />
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </ReusableModal>)}
      
      <Snackbar
        isVisible={isError} 
        message={error}
        onHide={() => setIsError(false)}
        type='error'
      />
      <Snackbar
        isVisible={isSuccess} 
        message={success}
        onHide={() => setIsSuccess(false)}
        type='success'
      />
      <StatusBar backgroundColor='white' style='dark'/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  delete: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary
  },
  formContainer: {
    flex: 1,
    gap: 20,
    marginTop: 60,
    marginBottom: 40
  },
  superLikeSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1E1E2',
    width: 27/100 * width,
    marginTop: 30,
    borderRadius: 20,
    height: 100, gap: 2
  },
  close: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary
  },
  firstImageSet: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5, marginBottom: 5,
  },
  secondImageSet: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5, marginBottom: 10
  },
  gallery: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10
  },
  section3: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginHorizontal: 20,
    marginTop: 30
  },
  interests: {
    width: 40/100 * width,
    height: 40,
    borderRadius: 10,
    borderColor: COLORS.primary,
    borderWidth: 1.3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  religiousInvolvement: {
    width: 40/100 * width,
    height: 'auto',
    minHeight: 40,
    borderRadius: 10,
    borderColor: COLORS.gray2,
    borderWidth: 1.3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  religion: {
    width: 40/100 * width,
    height: 40,
    borderRadius: 10,
    borderColor: COLORS.gray2,
    borderWidth: 1.3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sexualPreference: {
    width: 40/100 * width,
    height: 40,
    borderRadius: 10,
    borderColor: COLORS.gray2,
    borderWidth: 1.3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  section2: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginTop: 30
  },
  editBtnWrapper: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderWidth: 0.3,
    borderColor: COLORS.gray,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subSection: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  section1: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    flexDirection: 'row'
  },
  container: {
    width: width,
    height: 'auto',
    paddingBottom: 40,
    backgroundColor: 'white',
    borderStartStartRadius: 40,
    borderStartEndRadius: 40,
    marginTop: -50
  }
});
