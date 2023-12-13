import { ActivityIndicator, Dimensions, FlatList, Image, Platform, RefreshControl, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import Snackbar from "../../helpers/Snackbar";
import { COLORS, FONT, SIZES } from "../../constants";
import settings from "../../config/settings";
import { capitalizeFirstLetter } from "../../Utils/Generic";
import { BlurView } from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useAppDispatch from "../../hook/useAppDispatch";
import useAppSelector from "../../hook/useAppSelector";
import { useEffect, useState } from "react";
import { fetchFavUsersAction, likeUserAction, unLikeUserAction } from "../../store/actions/userAction";
import { clearFavUserStatus, clearLikeStatus, clearUnLikeStatus, setFromUserId } from "../../store/reducers/userReducer";
import { useRouter } from "expo-router";

const {width} = Dimensions.get('window')

const Favourites = () => {

    const userReducer = useAppSelector(state => state.userReducer);
    const dispatch = useAppDispatch();
    const [error, setError] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const router = useRouter()

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(userReducer.favUserStatus === 'completed') {
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
    },[userReducer.favUserStatus])

    useEffect(() => {
        dispatch(fetchFavUsersAction())
    },[]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        if(userReducer.likeStatus === 'completed') {
          dispatch(fetchFavUsersAction())
          setIsSuccess(true)
          setSuccess(`Successfully liked ${capitalizeFirstLetter(name)}'s profile.`)
          intervalId = setTimeout(() => {
            setIsSuccess(false)
            setSuccess('')
            setName('')
          },6000)
          dispatch(clearLikeStatus())
        } else if(userReducer.likeStatus === 'failed') {
            setIsError(true)
            setError(userReducer.likeError)
            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000)
        }
    
        return () => {
          clearInterval(intervalId)
        }
      },[userReducer.likeStatus]);
    
      useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        if(userReducer.unlikeStatus === 'completed') {
          dispatch(fetchFavUsersAction())
          setIsSuccess(true)
          setSuccess(`Successfully unliked ${capitalizeFirstLetter(name)}'s profile.`)
          intervalId = setTimeout(() => {
            setIsSuccess(false)
            setSuccess('')
            setName('')
          },6000)
          dispatch(clearUnLikeStatus())
        }
    
        return () => {
          clearInterval(intervalId)
        }
      },[userReducer.unlikeStatus]);

    return (
        <SafeAreaView style={{flex: 1}}>
            {/* <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={false} onRefresh={() => console.log('refresh')}/>}
            >
                <Text>Favourites</Text>
            </ScrollView> */}

            <FlatList
                data={userReducer.favUsers}
                numColumns={2}
                showsVerticalScrollIndicator={false} 
                style={{
                marginHorizontal: 10,
                }}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                {!isLoading && userReducer.favUsers.length === 0 && (<Text
                    style={{
                        fontFamily: FONT.bold,
                        fontSize: SIZES.large
                    }}
                    >No data available</Text>)}
                </View>
                )}
                renderItem={({ item, index }) => (
                <View style={styles.imageContainer} key={item._id}>
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(setFromUserId(item._id))
                            router.push({pathname: '/auth/single-user', params: {from: 'favourite-screen'}})
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 20,
                            overflow: 'hidden'
                        }}
                    >

                        <Image
                            source={{uri: `${settings.api.baseURL}/${item.profileImageUrl}`}}
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                        />
                    </TouchableOpacity>
                    <View
                        style={{
                            position: 'absolute',
                            height: '13%',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-end',
                            alignSelf: 'flex-start',
                            marginTop: 160,
                            backgroundColor: 'transparent'
                        }}
                    >
                        <Text
                            style={{
                            fontFamily: FONT.extraBold,
                            fontSize: SIZES.large,
                            color: 'white',
                            marginLeft: 10
                            }}
                        >{capitalizeFirstLetter(item.firstName)}, {item.age}</Text>
                    </View>
                    <BlurView intensity={50} style={styles.blurView}>
                    <TouchableHighlight
                        onPress={() => {
                        setName(item.firstName)
                        dispatch(unLikeUserAction(item._id))
                        }}
                        underlayColor={COLORS.primary}
                        style={styles.unlike}
                    >
                        <FontAwesome
                            name='close'
                            size={25}
                            color={'white'}
                        />
                    </TouchableHighlight>
                    <TouchableHighlight 
                        onPress={() => {
                        // setPushedId((prevState: string) => [...prevState, item._id]);
                        setName(item.firstName)
                        dispatch(likeUserAction(item._id))
                        }}
                        underlayColor={COLORS.primary}
                        disabled={item.isMatch}
                        style={styles.like}
                    >
                        <FontAwesome
                        name='heart'
                        size={25}
                        color={item.isMatch ? COLORS.primary : 'white'}
                        />
                    </TouchableHighlight>
                    </BlurView>
                </View>
                )}
                ListHeaderComponent={() => (
                    <View style={styles.headContainer}>
                    <Text
                        style={{
                        fontFamily: FONT.bold,
                        fontSize: SIZES.xxLarge
                        }}
                    >Super likes</Text>
                    <Text
                        style={{
                        fontFamily: FONT.regular,
                        fontSize: SIZES.large,
                        color: COLORS.tertiary,
                        marginVertical: 10
                        }}
                    >
                        This is a list of your super liked people.
                    </Text>
                    </View>
                )}
                ListFooterComponent={() => (
                isLoading && (
                    <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 30
                    }}
                    >
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text
                        style={{
                        fontFamily: FONT.bold,
                        fontSize: SIZES.medium
                        }}
                    >Loading...</Text>
                    </View>
                )
                )}
            />
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
    container: {
        display: 'flex',
        height: 'auto',
        width: width
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    unlike: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        borderRightColor: 'white',
        borderRightWidth: 1
    },
    like: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%'
    },
    imageContainer: {
        flex: 1,
        height: 250,
        margin: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    blurView: {
        position: 'absolute',
        alignSelf: 'flex-end',
        width: '100%',
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
        height: '20%',
        overflow: 'hidden',
        flexDirection: 'row'
    },
    headContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: Platform.select({android: 50, ios: 20}),
        marginBottom: 20,
        marginHorizontal: 10
    },
})

export default Favourites;