import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import AppBtn from "../../components/common/button/AppBtn";
import { COLORS, FONT, SIZES, icons, images } from "../../constants";
import { useRouter } from "expo-router";
import { 
    ActivityIndicator,
    Dimensions, Image, 
    KeyboardAvoidingView, 
    Modal, Platform, 
    StyleSheet, 
    TouchableOpacity
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AppInput from "../../components/AppInput/AppInput";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { retrieveData, storeData } from "../../components/LocalStorage/LocalStorage";
import Snackbar from "../../helpers/Snackbar";
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { alertComponent, extractFileNameFromUri } from "../../Utils/Generic";
import * as FileSystem from 'expo-file-system';
import useAppDispatch from "../../hook/useAppDispatch";
import { updateProfileImageAction } from "../../store/actions/userAction";
import useAppSelector from "../../hook/useAppSelector";

const { width } = Dimensions.get('window');

const schema = Yup.object().shape({
    firstName: Yup.string().required().label("First Name"),
    lastName: Yup.string().required().label("Last Name"),
    dob: Yup.date().required().label("Date of birth"),
});

const ProfileDetail = () => {
    const router = useRouter();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [viewImage, setViewImage] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState(null);

    const dispatch = useAppDispatch();
    const userReducer = useAppSelector(state => state.userReducer);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    // const openImagePicker = async () => {
    //     try {
    //       const options: ImagePicker.ImagePickerOptions = {
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //       };
      
    //       const result = await ImagePicker.launchImageLibraryAsync(options);
      
    //       if (!result.canceled) {
    //         // Use the assets array to get the image URI
    //         const imageUri = result.assets?.[0];
            
    //         if (imageUri) {
    //             setImagePreview(imageUri)
    //         } else {
    //           console.log('No image URI found in the assets array.');
    //         }
    //       }
    //     } catch (error) {
    //       console.error('Error picking an image:', error);
    //     }
    // };

    const openImagePicker = async () => {
        try {
          const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
          };
      
          const result = await ImagePicker.launchImageLibraryAsync(options);
          
          if (result.canceled) {
            return alertComponent(
              'Image',
              'Upload cancelled',
              'Ok',
              () => console.log('pressed')
            )
          }
      
          if (!result.canceled) {
            const imageUri = result.assets?.[0];
    
            if (imageUri) {
    
              const fileInfo = await FileSystem.getInfoAsync(imageUri.uri);
              
              const maxFileSize = 1 * 1024 * 1024; //1 MB
              if (fileInfo.exists) {
                if(fileInfo.size > maxFileSize) {
                    return alertComponent(
                      'Image size',
                      'Selected image exceeds the maximum allowed size. Image size should not be more that 1MB',
                      'Ok',
                      () => console.log('pressed')
                    );
                }
              }
    
              handleImageProfile(imageUri);
              setImagePreview(imageUri)
              
            } else {
              console.log('No image URI found in the assets array.');
            }
          }
        } catch (error) {
          console.error('Error picking an image:', error);
          return alertComponent(
            'Image',
            'Upload failed',
            'Ok',
            () => console.log('pressed')
          );
        }
    };

    const handleImageProfile = async (pickerResult: any) => {
    const profileImageUrl = {
        uri: pickerResult.uri,
        name: pickerResult.fileName || extractFileNameFromUri(pickerResult.uri),
        type: `${pickerResult.type}/${pickerResult.uri.split('.')[1]}`
    };

    dispatch(updateProfileImageAction({ profileImageUrl }));
    };

    const handleSubmit = (values: any) => {
        if(values.dob.toDateString() === new Date().toDateString() || 
        new Date(values.dob) > new Date()) {
            setIsError(true)
            setError("Invalid date")
            return 
        };

        const payload = {
            ...values,
            ...data
        }
        
        if(payload.profileImageUrl === "") {
            setIsError(true)
            setError("Profile image is required.")
            return 
        }

        storeData("profile-data", JSON.stringify(payload))
        router.push('/auth/about')
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await retrieveData('profile-data');
            if (data) {
                const resource = JSON.parse(data)
                setData(resource)
            }
          } catch (error) {
            console.error(error);
            // Handle the error (e.g., show an error message)
          }
        };
    
        fetchData();
    }, []);

    // const onProgress = (event: any) => {
    //     const loaded = event.nativeEvent.loaded;
    //     const total = event.nativeEvent.total;
    
    //     // Calculate progress percentage
    //     const progress = (loaded / total) * 100;
    
    //     // Do something with the progress value (e.g., update a progress bar)
    //     setLoadingProgress(progress);
    // };

    return (
        <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView
                style={styles.containerKey}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView showsVerticalScrollIndicator={false}
                    style={{
                        paddingHorizontal: 20
                    }}
                >
                    <Text
                        style={{
                            color: 'black',
                            fontFamily: FONT.extraBold,
                            fontSize: SIZES.xLarge,
                            paddingTop: 20,
                            marginLeft: 5
                        }}
                    >
                        Profile details
                    </Text>
                    <View 
                        style={{
                            backgroundColor: 'transparent',
                            marginTop: 40,
                            position: 'relative',
                            marginBottom: 170
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setViewImage(true)}
                            disabled={imagePreview === null}
                        >
                            {imagePreview === null && (<Image
                                source={data?.gender === "male" 
                                            ? images.no_image_m
                                            : images.no_image_f
                                        }
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
                        </TouchableOpacity>
                        <TouchableOpacity onPressIn={openImagePicker}>
                            {userReducer.uploadUserProfileImageStatus === 'loading' 
                                ? <ActivityIndicator color={'white'}
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
                    
                    <Formik
                        initialValues={{ firstName: '', lastName: '', dob: new Date() }}
                        validationSchema={schema}
                        onSubmit={(values) => handleSubmit(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                            <View style={styles.formContainer}>
                                <AppInput
                                    placeholder={'Your firstName'}
                                    hasPLaceHolder={true}
                                    placeholderTop={'First Name'}
                                    value={values.firstName}
                                    style={{
                                        width: 80/100 * width
                                    }}
                                    headerStyle={{
                                        marginLeft: 30
                                    }}
                                    errorTextStyle={{
                                        marginLeft: 30
                                    }}
                                    onChangeText={handleChange('firstName')}
                                    onBlur={handleBlur('firstName')}
                                    error={errors.firstName}
                                    touched={touched.firstName}
                                />
                                <AppInput
                                    placeholder={'Your lastName'}
                                    hasPLaceHolder={true}
                                    placeholderTop={'Last Name'}
                                    value={values.lastName}
                                    style={{
                                        width: 80/100 * width
                                    }}
                                    headerStyle={{
                                        marginLeft: 30
                                    }}
                                    errorTextStyle={{
                                        marginLeft: 30
                                    }}
                                    onChangeText={handleChange('lastName')}
                                    onBlur={handleBlur('lastName')}
                                    error={errors.lastName}
                                    touched={touched.lastName}
                                />
                                <TouchableOpacity
                                    onPress={showDatePicker}
                                    style={{
                                        backgroundColor: '#DACFD0',
                                        width: '90%',
                                        alignSelf: 'center',
                                        borderRadius: 15,
                                        height: 66,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: 20
                                    }}
                                >
                                    <Image 
                                        source={icons.Calendar}
                                        resizeMode='cover'
                                        //@ts-ignore
                                        style={{
                                            height: 20,
                                            width: 20
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: COLORS.primary,
                                            fontFamily: FONT.bold,
                                            fontSize: SIZES.medium
                                        }}
                                    >{selectedDate.toDateString() !== new Date().toDateString() ? selectedDate.toDateString() : 'Choose birthday date'}</Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    display="inline"
                                    date={selectedDate}
                                    onConfirm={Platform.OS === 'android' ? (date) => {
                                        setFieldValue('dob', date)
                                        setSelectedDate(date)
                                        hideDatePicker()
                                    } : () => console.log('android')}
                                    onCancel={() => {
                                        hideDatePicker()
                                    }}
                                    onChange={Platform.OS === 'ios' ? (date) => {
                                        setFieldValue('dob', date)
                                        setSelectedDate(date)
                                        // hideDatePicker()
                                    } : undefined}
                                    buttonTextColorIOS={'white'}
                                    customConfirmButtonIOS={() => (
                                        <AppBtn
                                            handlePress={hideDatePicker}
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
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                alignSelf: 'center'
                                            }}
                                        />
                                    )}
                                    pickerContainerStyleIOS={{
                                        borderRadius: 10,
                                        padding: 4
                                    }}
                                />
                                <AppBtn
                                    handlePress={() => handleSubmit()}
                                    isText={true}
                                    btnTitle={'Continue'} 
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
                                />
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
            <Snackbar
                isVisible={isError} 
                message={error}
                onHide={() => setIsError(false)}
                type='error'
            />
            {/* Modal for image upload or viewing */}
            <Modal
                visible={viewImage}
                transparent={true}
                onRequestClose={() => setViewImage(false)}
            >
                <View style={{ 
                        flex: 1, 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <Image
                        source={imagePreview}
                        style={{ 
                            width: '90%', 
                            height: '60%',
                            position: 'absolute',
                            borderRadius: 20
                        }}
                    />
                    <View
                        style={{
                            position: 'relative',
                            alignSelf: 'flex-end',
                            marginTop: -430,
                            marginRight: 30,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            gap: 20
                        }}
                    >
                        <TouchableOpacity 
                            onPress={() => setViewImage(false)}
                            style={styles.close}
                        >
                            <FontAwesome
                                name="close"
                                size={20}
                                color={'white'}
                            />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </Modal>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        paddingHorizontal: 20
    },
    containerKey: {
        flex: 1,
    },
    backBtnContainer: {
        backgroundColor: 'transparent',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: -10
    },
    formContainer: {
        flex: 1,
        gap: 20,
        backgroundColor: 'transparent',
        marginTop: 10,
        marginBottom: 100
    },
    close: {
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary
    }
})

export default ProfileDetail;