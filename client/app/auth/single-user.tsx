import { 
    ActivityIndicator, 
    Dimensions, Image, 
    ImageBackground, 
    Modal, Platform, 
    RefreshControl, 
    StyleSheet, 
    TouchableOpacity 
} from "react-native"
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import { COLORS, FONT, SIZES, icons } from "../../constants";
import { BlurView } from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
    capitalizeEachWord, 
    capitalizeFirstLetter, 
    characterBreaker, 
    location_km, 
    wordBreaker 
} from "../../Utils/Generic";
import { useEffect, useState } from "react";
import _ from 'lodash';
import useAppSelector from "../../hook/useAppSelector";
import useAppDispatch from "../../hook/useAppDispatch";
import { 
    createChatAction, 
    favUserAction, 
    getUserAction, 
    likeUserAction, 
    unLikeFrmMatchAction, 
    unLikeUserAction 
} from "../../store/actions/userAction";
import { 
    clearCreateChatStatus, 
    clearFavUserStatus, 
    clearGetUserStatus, 
    clearLikeStatus, 
    clearUnLikeStatus, 
    clearUnLikeUserFrmMatchStatus, 
    setFromUserId, 
    setPhotoUri 
} from "../../store/reducers/userReducer";
import Snackbar from "../../helpers/Snackbar";
import useUser from "../../hook/useUser";
import settings from "../../config/settings";
import axiosClient from '../../config/axiosClient';
import ReusableModal from "../../components/Modal/ReusableModal";
import AppBtn from "../../components/common/button/AppBtn";
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');
const API_ROOT = settings.api.rest;

const SingleUser = () => {
    const router = useRouter();
    const [sentenceCount, setSentenceCount] = useState<number>(20);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
    const [image, setImage] = useState<any>([]);
    const [isUploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
    const [userData, setUserData] = useState<any | null>(null);
    const [error, setError] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [canChat, setCanChat] = useState<boolean>(false);
    const [likeLoading, setLikeLoading] = useState<boolean>(false);
    const { from } = useLocalSearchParams();
    const {user} = useUser();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [brkDesc, setBrkDesc] = useState<number>(100);

    const userReducer = useAppSelector(state => state.userReducer);
    const dispatch = useAppDispatch();

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

    const handleChat = async () => {
        dispatch(createChatAction({firstId: user?._id, secondId: userData?._id}))
    }

    const like = async () => {
        let intervalId: NodeJS.Timeout;
        setLikeLoading(true)
        try {
            const response = await axiosClient.put(`${API_ROOT}/like-user/${userData?._id}`);
            if(response.data.code === 200) {
                dispatch(setPhotoUri({photo: userData?.profileImageUrl, userId: userData?._id}))
                setCanChat(response.data.result.likened)
                setIsSuccess(true)
                setSuccess(`Successfully liked ${capitalizeFirstLetter(userData?.firstName)}'s profile.`)
                intervalId = setTimeout(() => {
                    setIsSuccess(false)
                    setSuccess('')
                },6000)
            }

            setLikeLoading(false)
        } catch (error) {
            setIsError(true)
            setError(error.response.data.message)
            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000)
            setLikeLoading(false)
        }

        clearInterval(intervalId)
        
    }

    useEffect(() => {
        const imgWithDimensions = userData?.gallery.map((img: any, index: number) => ({
            src: img,
            width: index < 2 ? 40/100 * width : 26/100 * width,
            height: index < 2 ? 200 : 120
        }));

        // Check if dimensions have changed before updating state
        if (!_.isEqual(imgWithDimensions, image)) {
            setImage(imgWithDimensions);
        }
    }, [userData, image]);

    useEffect(() => {
        const userId = userReducer.fromUserId;
        dispatch(getUserAction(userId))
    },[userReducer.fromUserId]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(userReducer.getUserStatus === 'completed') {
            setUserData(userReducer.user);
            dispatch(clearGetUserStatus());
        } else if (userReducer.getUserStatus === 'failed') {
            userReducer.getUserError !== undefined && setIsError(true)
            userReducer.getUserError !== undefined && setError(userReducer.getUserError)
            setTimeout(() => {
                setIsError(false)
                setError('')
            },6000)
            dispatch(clearGetUserStatus());
        }

        return () => {
            clearInterval(intervalId)
        }
    },[userReducer.getUserStatus]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(userReducer.unlikeUserFrmMatchStatus === 'completed') {
          dispatch(setFromUserId(''))
          router.push('/(tabs)/one')
        } else if(userReducer.unlikeUserFrmMatchStatus === 'failed') {
            setIsError(true)
            setError(userReducer.unlikeUserFrmMatchError)
            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000)
            dispatch(clearUnLikeUserFrmMatchStatus())
        }

        return () => {
            clearInterval(intervalId);
        }
    },[userReducer.unlikeUserFrmMatchStatus]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(userReducer.unlikeStatus === 'completed') {
          dispatch(setFromUserId(''))
          router.back()
          setOpenModal(false)
        } else if(userReducer.unlikeStatus === 'failed') {
            setIsError(true)
            setOpenModal(false)
            setError(userReducer.unlikeError)
            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000)
            dispatch(clearUnLikeStatus())
        }

        return () => {
            clearInterval(intervalId);
        }
    },[userReducer.unlikeStatus]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(userReducer.likeStatus === 'completed') {
            dispatch(setPhotoUri({photo: userData?.profileImageUrl, userId: userData?._id}))
            setIsSuccess(true)
            setSuccess(`Successfully liked ${capitalizeFirstLetter(userData?.firstName)}'s profile.`)
            intervalId = setTimeout(() => {
                setIsSuccess(false)
                setSuccess('')
            },6000)
            dispatch(clearLikeStatus())
        } else if(userReducer.likeStatus === 'failed') {
            setIsError(true)
            setError(userReducer.likeError)
            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000)
            dispatch(clearLikeStatus())
        }

        return () => {
            clearInterval(intervalId);
        }
    },[userReducer.likeStatus]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(userReducer.favUserStatus === 'completed') {
            setIsSuccess(true)
            setSuccess(`Successfully added ${capitalizeFirstLetter(userData?.firstName)} to favourites.`)
            intervalId = setTimeout(() => {
                setIsSuccess(false)
                setSuccess('')
            },6000)
            dispatch(clearFavUserStatus())
        } else if(userReducer.favUserStatus === 'failed') {
            setIsError(true)
            setError(userReducer.favUserError)
            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000)
            dispatch(clearFavUserStatus())
        }

        return () => {
            clearInterval(intervalId);
        }
    },[userReducer.favUserStatus]);

    useEffect(() => {
        if(userData?.likedUsers?.includes(user?._id) && user?.likedUsers?.includes(userData?._id)) {
            setCanChat(true)
        }
    },[userData, user]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(userReducer.createChatStatus === 'completed') {
            router.push('/(tabs)/three')
            dispatch(clearCreateChatStatus())
        } else if(userReducer.createChatStatus === 'failed') {
            setIsError(true)
            setError(userReducer.createChatError)

            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000)
            dispatch(clearCreateChatStatus())
        }

        return () => {
            clearInterval(intervalId);
        }
    },[userReducer.createChatStatus]);

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={userReducer.getUserStatus === 'loading'} onRefresh={() => getUserAction(userReducer.fromUserId)}/>}
            >
                <ImageBackground
                    source={{uri: `${settings.api.baseURL}/${userData?.profileImageUrl}`}}
                    style={{
                        width: width,
                        height: 50/100 * height
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            router.back()
                            dispatch(setFromUserId(''))
                        }}
                    >
                        <BlurView intensity={100} style={styles.backButton}>
                            <FontAwesome 
                                name='angle-left'
                                size={25}
                                color={COLORS.primary}
                            />
                        </BlurView>
                    </TouchableOpacity>
                </ImageBackground>
                
                <View style={styles.container2}>
                    <View style={styles.likesContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                from === 'one-screen' && dispatch(unLikeFrmMatchAction(userData?._id))
                                from === 'like-screen' && setOpenModal(true)
                            }}
                            style={styles.dislikeBtn}
                        >
                            {userReducer.unlikeUserFrmMatchStatus !== 'loading' && (<FontAwesome
                                name="close"
                                size={30}
                                color={'red'}
                            />)}
                            {userReducer.unlikeUserFrmMatchStatus === 'loading' && (<ActivityIndicator size={'small'} color={COLORS.primary}/>)}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => dispatch(likeUserAction(userData._id))}
                            style={styles.likeBtn}
                        >
                            {!likeLoading && (<FontAwesome
                                name="heart"
                                size={60}
                                color={'white'}
                            />)}
                            {likeLoading && (<ActivityIndicator size={'large'} color={'white'}/>)}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => dispatch(favUserAction(userData?._id))}
                            style={styles.dislikeBtn}
                        >
                            {userReducer.favUserStatus !== 'loading' && (<FontAwesome
                                name="star"
                                size={30}
                                color={'green'}
                            />)}
                            {userReducer.favUserStatus === 'loading' && (<ActivityIndicator size={'small'} color={COLORS.primary}/>)}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.section1}>
                        <View style={{display: 'flex', flexDirection: 'column'}}>
                            <View style={tw`flex flex-row`}>
                                <Text
                                    style={{
                                        color: 'black',
                                        fontFamily: FONT.bold,
                                        fontSize: SIZES.xLarge
                                    }}
                                >{capitalizeFirstLetter(userData?.firstName)}, {userData?.age}</Text>
                                <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 50,
                                        backgroundColor: userData?.planType === "premium" ? COLORS.primary : userData?.planType
                                    }}
                                />
                            </View>
                            
                            <Text
                                style={{
                                    fontFamily: FONT.medium,
                                    fontSize: 14,
                                    color: COLORS.tertiary
                                }}
                            >{capitalizeFirstLetter(userData?.jobType)}</Text>
                        </View>
                        <TouchableOpacity onPress={handleChat}
                            style={styles.sendBtn}
                            disabled={!canChat}
                        >
                            {userReducer.createChatStatus !== 'loading' && (<FontAwesome
                                name='send'
                                size={20}
                                color={!canChat ? COLORS.gray : COLORS.primary}
                            />)}
                            {userReducer.createChatStatus === 'loading' && <ActivityIndicator color={COLORS.primary}/>}
                        </TouchableOpacity>
                    </View>

                    {userData?.jobDescription && (<View style={styles.section3}>
                        <Text
                            style={{
                            fontFamily: FONT.bold,
                            fontSize: SIZES.medium
                            }}
                        >
                            Job Description
                        </Text>
                        
                        <Text
                            style={{
                                color: COLORS.tertiary,
                                fontFamily: FONT.medium,
                                fontSize: SIZES.small
                            }}
                        >
                            {characterBreaker(capitalizeFirstLetter(userData?.jobDescription), brkDesc)}{brkDesc < userData?.jobDescription?.length ? '...' : ''}
                        </Text>
                        {brkDesc < userData?.jobDescription?.length && (<TouchableOpacity 
                            onPress={() => setBrkDesc(userData?.jobDescription?.length)}
                        >
                        <Text
                            style={{
                                fontFamily: FONT.extraBold,
                                fontSize: 14,
                                color: COLORS.primary,
                                marginTop: 8
                            }}
                        >Read more</Text>
                        </TouchableOpacity>)}
                    </View>)}

                    <View style={styles.section2}>
                        <View style={{display: 'flex', flexDirection: 'column'}}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontFamily: FONT.bold,
                                    fontSize: SIZES.medium
                                }}
                            >Location</Text>
                            <Text
                                style={{
                                    fontFamily: FONT.medium,
                                    fontSize: SIZES.small,
                                    color: COLORS.tertiary
                                }}
                            >{userData?.address ? capitalizeEachWord(wordBreaker(userData?.address, 3)) : ''}</Text>
                        </View>
                        <View style={styles.location}>
                            <Image
                                source={icons.location_pin_colord}
                                style={{
                                    width: 14,
                                    height: 14
                                }}
                            />
                            <Text style={{
                                color: COLORS.primary,
                                fontFamily: FONT.extraBold,
                                fontSize: 14
                            }}>&nbsp;{Math.ceil(location_km(
                                userData?.location.coordinates[1],
                                userData?.location.coordinates[0],
                                user?.location.coordinates[1],
                                user?.location.coordinates[0]
                            ))} km</Text>
                        </View>
                    </View>

                    {userData?.about && (<View style={styles.section3}>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium
                            }}
                        >About</Text>
                        <Text
                            style={{
                                color: COLORS.tertiary,
                                fontFamily: FONT.medium,
                                fontSize: SIZES.small
                            }}
                        >
                            {capitalizeFirstLetter(wordBreaker(userData?.about, sentenceCount))}{sentenceCount !== userData?.about.length && '...'}
                        </Text>
                        {sentenceCount !== userData?.about?.length && (<Text onPress={() => setSentenceCount(userData?.about?.length)}
                            style={{
                                fontFamily: FONT.extraBold,
                                fontSize: 14,
                                color: COLORS.primary,
                                marginTop: 8
                            }}
                        >
                            Read more
                        </Text>)}
                    </View>)}

                    {userData?.interests.length > 0 && (<View style={styles.section4}>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium,
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
                            {userData?.interests.length > 0 
                                ? userData?.interests.map((interest: string, index: number) => (
                                    <View style={styles.interests} key={index}>
                                        <Text
                                            style={{
                                                fontFamily: FONT.bold,
                                                fontSize: SIZES.medium,
                                                color: COLORS.primary
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
                    </View>)}

                    {userData?.religion && (<View style={styles.section4}>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium,
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
                            {userData?.religion
                                ? ( <View style={styles.interests}>
                                        <Text
                                            style={{
                                                fontFamily: FONT.bold,
                                                fontSize: SIZES.medium,
                                                color: COLORS.primary
                                            }}
                                        >
                                            { userData?.religion }
                                        </Text>
                                    </View>
                                ) : (
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
                    </View>)}

                    {userData?.religiousInvolvement && (<View style={styles.section4}>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium,
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
                            {userData?.religiousInvolvement
                                ? ( <View style={styles.interests}>
                                        <Text
                                            style={{
                                                fontFamily: FONT.bold,
                                                fontSize: SIZES.medium,
                                                color: COLORS.primary
                                            }}
                                        >
                                            { userData?.religiousInvolvement }
                                        </Text>
                                    </View>
                                ) : (
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
                    </View>)}

                    {userData?.personalityTemperament && (<View style={styles.section4}>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium,
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
                            {userData?.personalityTemperament
                                ? ( <View style={styles.interests}>
                                        <Text
                                            style={{
                                                fontFamily: FONT.bold,
                                                fontSize: SIZES.medium,
                                                color: COLORS.primary
                                            }}
                                        >
                                            { userData?.personalityTemperament }
                                        </Text>
                                    </View>
                                ) : (
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
                    </View>)}

                    {userData?.sexualPreference && (<View style={styles.section4}>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium,
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
                            {userData?.sexualPreference
                                ? ( <View style={styles.interests}>
                                        <Text
                                            style={{
                                                fontFamily: FONT.bold,
                                                fontSize: SIZES.medium,
                                                color: COLORS.primary
                                            }}
                                        >
                                            { userData?.sexualPreference }
                                        </Text>
                                    </View>
                                ) : (
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
                    </View>)}

                    {userData?.relationshipPreference && (<View style={styles.section4}>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium,
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
                            {userData?.relationshipPreference
                                ? ( <View style={styles.interests}>
                                        <Text
                                            style={{
                                                fontFamily: FONT.bold,
                                                fontSize: SIZES.medium,
                                                color: COLORS.primary
                                            }}
                                        >
                                            { userData?.relationshipPreference }
                                        </Text>
                                    </View>
                                ) : (
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
                    </View>)}

                    {userData?.gallery.length > 0 && (<View style={styles.gallery}>
                        <Text
                            style={{
                                color: 'black',
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium,
                                marginBottom: 10,
                                marginTop: 20,
                                alignSelf: 'flex-start'
                            }}
                        >Gallery</Text>
                        {userData?.gallery.length > 0 
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
                                        fontSize: SIZES.small,
                                        color: COLORS.tertiary,
                                        alignSelf: 'flex-start'
                                    }}
                                >No record found</Text>
                            )
                        }
                    </View>)}
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
                                borderRadius: 20
                            }}
                        />
                    ) : (
                        <Text>Upload Image Modal (Implement your logic)</Text>
                    )}
                    <View
                        style={{
                            position: 'absolute',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-start',
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            gap: 20,
                            width: '90%', 
                            height: '60%',
                            paddingHorizontal: 20,
                            paddingVertical: 20
                        }}
                    >
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
            <ReusableModal
                modalVisible={openModal}
                setModalVisible={setOpenModal}
                style={{
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 20,
                    width: '90%',
                    height: '50%'
                }}
                animationViewStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                modalHeightKeyboardClose={'50%'}
                modalHeightKeyboardOpen={Platform.select({ios: '50%', android: '55%'})}
            >
                <View
                    style={{
                        backgroundColor: 'transparent',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        marginTop: 10, marginRight: 10
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setOpenModal(false)
                        }}
                    >
                        <FontAwesome
                            name="close"
                            size={20}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    <Text 
                        style={{
                            color: 'black',
                            fontFamily: FONT.regular,
                            fontSize: SIZES.medium,
                            alignSelf: 'center',
                            textAlign: 'center'
                        }}
                    >
                        {`You are about to unlike ${capitalizeFirstLetter(userData?.firstName)}'s profile. Please note that this action is irreversible, and once done, you won't be able to restore the previous state.`}
                    </Text>
                    <View 
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: 10, marginTop: 30
                        }}
                    >
                        <AppBtn
                            handlePress={() => setOpenModal(false)}
                            isText={true}
                            btnTitle={'Cancel'} 
                            btnWidth={'40%'} 
                            btnHeight={60} 
                            btnBgColor={COLORS.primary}
                            btnTextStyle={{
                                fontSize: SIZES.medium,
                                fontFamily: FONT.bold
                            }}
                            btnStyle={{
                                marginBottom: 10,
                                marginTop: 30,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        />
                        <AppBtn
                            handlePress={() => dispatch(unLikeUserAction(userData?._id))}
                            isText={true}
                            btnTitle={'Okay'} 
                            btnWidth={'40%'} 
                            btnHeight={60} 
                            btnBgColor={COLORS.primary}
                            btnTextStyle={{
                                fontSize: SIZES.medium,
                                fontFamily: FONT.bold
                            }}
                            btnStyle={{
                                marginBottom: 10,
                                marginTop: 30,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            spinner={userReducer.unlikeStatus === 'loading'}
                            spinnerColor='white'
                            spinnerStyle={{
                                marginLeft: 10
                            }}
                        />
                    </View>
                </View>
            </ReusableModal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    gallery: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        marginTop: 20
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
    likesContainer: {
        backgroundColor: 'transparent',
        width: 'auto',
        display: 'flex',
        flexDirection: 'row',
        gap: 40,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20
    },
    section1: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 30,
        marginTop: 50
    },
    section2: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 30,
        marginTop: 20
    },
    section3: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginHorizontal: 30,
        marginTop: 20
    },
    section4: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginHorizontal: 30,
        marginTop: 20
    },
    sendBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 0.3,
        borderColor: COLORS.gray2,
        width: 40,
        height: 40
    },
    location: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        borderWidth: 0.3,
        borderColor: COLORS.gray2,
        minWidth: 70,
        width: 'auto',
        maxWidth: 120,
        height: 30,
        backgroundColor: COLORS.lightPrimary,
        paddingHorizontal: 4
    },
    container: {
        display: 'flex',
        height: 'auto',
        width: width,
        // marginTop: Platform.select({android: 30, ios: 0})
    },
    backButton: {
        width: 35,
        height: 35,
        overflow: 'hidden',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.select({android: 50, ios: 20}),
        marginLeft: 20,
        borderWidth: 0.3,
        borderColor: 'white',
    },
    container2: {
        width: width,
        height: 'auto',
        borderStartEndRadius: 30,
        borderStartStartRadius: 30,
        marginTop: -30,
        backgroundColor: 'white',
        paddingBottom: 40
    },
    dislikeBtn: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // Android shadow
        elevation: 5,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    likeBtn: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // Android shadow
        elevation: 5,
        // iOS shadow
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
    },
})

export default SingleUser