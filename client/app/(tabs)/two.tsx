import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Platform, RefreshControl, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { SafeAreaView, Text, View } from '../../components/Themed';
import { COLORS, FONT, SIZES } from '../../constants';
import { BlurView } from 'expo-blur';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import settings from '../../config/settings';
import { capitalizeFirstLetter } from '../../Utils/Generic';
import useUser from '../../hook/useUser';
import axiosClient from '../../config/axiosClient';
import { useFocusEffect, useRouter } from 'expo-router';
import useAppDispatch from '../../hook/useAppDispatch';
import useAppSelector from '../../hook/useAppSelector';
import { favUserAction, likeUserAction, unLikeUserAction } from '../../store/actions/userAction';
import { clearFavUserStatus, clearLikeStatus, clearUnLikeStatus, setFromUserId, setPhotoUri } from '../../store/reducers/userReducer';
import Snackbar from '../../helpers/Snackbar';
import { IMatch } from '@app-models';
import tw from 'twrnc';

const { width } = Dimensions.get('window');
const API_ROOT = settings.api.rest;

export default function TabTwoScreen() {
  const { user } = useUser();
  const [fetchedUsers, setFetchedUsers] = useState<any | null>([]);
  const dispatch = useAppDispatch();
  const userReducer = useAppSelector(state => state.userReducer);
  const [error, setError] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const router = useRouter()

  const fetchLikedUsers = async (id: any) => {
    setIsLoading(true)
    try {
      const response = await axiosClient.get(`${API_ROOT}/users-matched-liked-users/${id}`);
      setFetchedUsers(response.data.results);
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching liked users:', error);
      setIsLoading(false)
    }
  };

  const handleViewUser = (item: IMatch) => {
    if(item.profileVisibility === false) return
    dispatch(setFromUserId(item._id))
    router.push({pathname: '/auth/single-user', params: {from: 'like-screen'}})
  }

  const handleUnlike = (item: IMatch) => {
    if(!userReducer.loggedInuser?.likedUsers.includes(item._id)) return
    setName(item.firstName)
    dispatch(unLikeUserAction(item._id))
  }

  useFocusEffect(
    useCallback(() => {
      if(user?._id !== undefined) {
        fetchLikedUsers(user?._id);
      }
    }, [user?._id])
  )

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.likeStatus === 'completed') {
      fetchLikedUsers(user?._id);
      setIsSuccess(true)
      setSuccess(`Successfully liked ${capitalizeFirstLetter(name)}'s profile.`)
      intervalId = setTimeout(() => {
        setIsSuccess(false)
        setSuccess('')
        setName('')
      },6000)
      dispatch(clearLikeStatus())
    }

    return () => {
      clearInterval(intervalId)
    }
  },[userReducer.likeStatus]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.favUserStatus === 'completed') {
      fetchLikedUsers(user?._id);
      setIsSuccess(true)
      setSuccess(`Successfully added ${capitalizeFirstLetter(name)} to favourites.`)
      intervalId = setTimeout(() => {
        setIsSuccess(false)
        setSuccess('')
        setName('')
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
      clearInterval(intervalId)
    }
  },[userReducer.favUserStatus]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.unlikeStatus === 'completed') {
      fetchLikedUsers(user?._id);
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

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if(userReducer.likeStatus === 'failed') {
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
    if(userReducer.unlikeStatus === 'failed') {
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isLoading} 
            onRefresh={() => fetchLikedUsers(user?._id)}
          />
        }
        data={fetchedUsers}
        numColumns={2}
        showsVerticalScrollIndicator={false} 
        style={{
          marginHorizontal: 10,
        }}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
           {!isLoading && fetchedUsers.length === 0 && (<Text
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
              onPress={() => handleViewUser(item)}
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
            {!item.profileVisibility && (<BlurView
              intensity={30}
              style={[{
                position: 'absolute',
                height: '100%',
                width: '100%',
                borderRadius: 20,
                overflow: 'hidden'
              }, tw`flex justify-center items-center flex-col`]}
            >
              <FontAwesome
                name='eye-slash'
                size={80}
                color={'white'}
              />
              <Text
                style={{
                  fontFamily: FONT.bold,
                  fontSize: SIZES.small,
                  color: COLORS.white
                }}
              >{`You can not view ${capitalizeFirstLetter(item?.firstName)}'s profile.`}</Text>
            </BlurView>)}
            <BlurView intensity={50} style={styles.blurView}>
              <TouchableHighlight
                disabled={!userReducer.loggedInuser?.likedUsers.includes(item._id)}
                onPress={() => handleUnlike(item)}
                underlayColor={COLORS.primary}
                style={styles.unlike}
              >
                <FontAwesome
                  name='close'
                  size={25}
                  color={userReducer.loggedInuser?.likedUsers.includes(item._id) ? 'white' : COLORS.primary}
                />
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  setName(item.firstName)
                  dispatch(favUserAction(item._id))
                }}
                underlayColor={COLORS.primary}
                style={styles.fav}
              >
                <FontAwesome
                  name='star'
                  size={25}
                  color={'green'}
                />
              </TouchableHighlight>
              <TouchableHighlight 
                onPress={() => {
                  // setPushedId((prevState: string) => [...prevState, item._id]);
                  setName(item.firstName)
                  dispatch(setPhotoUri({photo: item.profileImageUrl, userId: item._id}))
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
              >Likes</Text>
              <Text
                style={{
                  fontFamily: FONT.regular,
                  fontSize: SIZES.large,
                  color: COLORS.tertiary,
                  marginVertical: 10
                }}
              >
                This is a list of people who have liked you and your matches.
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
  );
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
      width: '35%',
      borderRightColor: 'white',
      borderRightWidth: 1
    },
    fav: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '30%',
      borderRightColor: 'white',
      borderRightWidth: 1
    },
    like: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '35%'
    },
    imageContainer: {
      flex: 1,
      height: 250,
      margin: 5,
      justifyContent: 'flex-start',
      alignItems: 'center',
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
    blurView: {
      position: 'absolute',
      alignSelf: 'flex-end',
      width: '100%',
      borderBottomStartRadius: 20,
      borderBottomEndRadius: 20,
      height: '20%',
      overflow: 'hidden',
      flexDirection: 'row'
    }
})
