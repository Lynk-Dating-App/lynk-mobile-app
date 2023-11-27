import { Dimensions, Image, ImageBackground, Modal, Platform, RefreshControl, StyleSheet, TouchableOpacity } from "react-native"
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import { COLORS, FONT, SIZES, icons, images } from "../../constants";
import { BlurView } from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { capitalizeEachWord, capitalizeFirstLetter, location_km, wordBreaker } from "../../Utils/Generic";
import { useEffect, useState } from "react";
import _ from 'lodash';
import useAppSelector from "../../hook/useAppSelector";
import useAppDispatch from "../../hook/useAppDispatch";
import { getUserAction, likeUserAction, unLikeUserAction } from "../../store/actions/userAction";
import { clearFavUserStatus, clearGetUserStatus, clearLikeStatus, clearUnLikeStatus, setFromUserId } from "../../store/reducers/userReducer";
import Snackbar from "../../helpers/Snackbar";
import useUser from "../../hook/useUser";
import settings from "../../config/settings";

const { width, height } = Dimensions.get('window');

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
    const { fromUser } = useLocalSearchParams();
    const {user} = useUser();

    const userReducer = useAppSelector(state => state.userReducer);
    const dispatch = useAppDispatch();

    const imagesArray = [
        {src: images.girl2}, {src: images.girl3},
        {src: images.girl2}, {src: images.girl3},
        {src: images.girl3}
    ]

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

        if(userReducer.unlikeStatus === 'completed') {
          dispatch(setFromUserId(''))
          router.push('/(tabs)/one')
        } else if(userReducer.unlikeStatus === 'failed') {
            setIsError(true)
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
            setIsSuccess(true)
            setSuccess(`Successfully liked ${capitalizeFirstLetter(userData?.firstName)}'s profile.`)
            intervalId = setTimeout(() => {
                setIsSuccess(false)
                setSuccess('')
            },6000)
            dispatch(clearLikeStatus())
        } else if(userReducer.likeStatus === 'failed') {
            setIsError(true)
            setError(userReducer.unlikeError)
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

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={false} onRefresh={() => console.log('refresh')}/>}
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
                            onPress={() => dispatch(unLikeUserAction(userData?._id))}
                            style={styles.dislikeBtn}
                        >
                            <FontAwesome
                                name="close"
                                size={30}
                                color={'red'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => dispatch(likeUserAction(userData?._id))}
                            style={styles.likeBtn}
                        >
                            <FontAwesome
                                name="heart"
                                size={60}
                                color={'white'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => console.log('up')}
                            style={styles.dislikeBtn}
                        >
                            <FontAwesome
                                name="star"
                                size={30}
                                color={'green'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.section1}>
                        <View style={{display: 'flex', flexDirection: 'column'}}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontFamily: FONT.bold,
                                    fontSize: SIZES.xLarge
                                }}
                            >{capitalizeFirstLetter(userData?.firstName)}, {userData?.age}</Text>
                            <Text
                                style={{
                                    fontFamily: FONT.medium,
                                    fontSize: 14,
                                    color: COLORS.tertiary
                                }}
                            >{capitalizeFirstLetter(userData?.jobType)}</Text>
                        </View>
                        <TouchableOpacity onPress={() => console.log('chat')}
                            style={styles.sendBtn}
                        >
                            <FontAwesome
                                name='send'
                                size={20}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
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
                            >{capitalizeEachWord(wordBreaker(userData?.address, 3))}</Text>
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
                    <View style={styles.section3}>
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
                        {sentenceCount !== userData?.about.length && (<Text onPress={() => setSentenceCount(userData?.about.length)}
                            style={{
                                fontFamily: FONT.extraBold,
                                fontSize: 14,
                                color: COLORS.primary,
                                marginTop: 8
                            }}
                        >
                            Read more
                        </Text>)}
                    </View>
                    <View style={styles.section4}>
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
                    </View>
                    <View style={styles.gallery}>
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
        width: 70,
        height: 30,
        backgroundColor: COLORS.lightPrimary
    },
    container: {
        display: 'flex',
        height: 'auto',
        width: width
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
        borderColor: 'white'
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