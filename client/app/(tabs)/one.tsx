import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  Dimensions, Image, 
  Platform,
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView, Text, View } from '../../components/Themed';
import { getTokenFromSecureStore, saveTokenToSecureStore } from '../../components/ExpoStore/SecureStore';
import settings from '../../config/settings';
import { router, useFocusEffect } from 'expo-router';
import useAppDispatch from '../../hook/useAppDispatch';
import useAppSelector from '../../hook/useAppSelector';
import { clearSignInStatus } from '../../store/reducers/authReducer';
import * as Location from 'expo-location';
import { COLORS, FONT, SIZES, icons, images } from '../../constants';
import ImageSwiper from '../../components/ImageSwiper/ImageSwiper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ReusableModal from '../../components/Modal/ReusableModal';
import Slider from '@react-native-community/slider';
import { stateLga } from '../../constants/states';
import { Select } from '../../components/AppInput/AppInput';
import AppBtn from '../../components/common/button/AppBtn';
import useMatch from '../../hook/useMatch';
import { decode as base64Decode } from 'base-64';
import * as BackgroundFetch from 'expo-background-fetch';
import { getMatchesAction, getUserNotificationsAction, rewindUnlikedUserAction } from '../../store/actions/userAction';
import socket from '../../config/socket';
import { 
  clearFavUserStatus, 
  clearGetAllUserNotificationStatus, 
  clearLikeStatus, clearUnLikeStatus, 
  clearUnLikeUserFrmMatchStatus, 
  setFromUserId, setOnlineUsers, 
  setSignInAfterSignUp, 
  setSignInAfterSignUp2
} from '../../store/reducers/userReducer';
import * as Notifications from 'expo-notifications';
import Snackbar from '../../helpers/Snackbar';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { INotification } from '@app-models';
import Swiper from 'react-native-deck-swiper';
import useUser from '../../hook/useUser';

const { height, width } = Dimensions.get('window');

interface Match {
  address: string;
  age: number;
  firstName: string;
  lastName: string;
  occupation: string;
  image: any;
  id: number;
  distance: number;
  userId: string;
  state: string;
  profileVisibility: boolean;
  gender?: string; 
  gallery: string[]
}

interface IFilter {
  state: string;
  minAge: number;
  maxAge: number;
  minDistance: number;
  maxDistance: number;
}

const LOCATION_TASK_NAME = 'background-location-task';
const BACKGROUND_FETCH_TASK = 'background-fetch-task';

// const requestForegroundPermissions = async () => {
//   const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
//   if (foregroundStatus === 'granted') {

//     // const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
//     // if (isTaskRegistered) {
//     //   console.log('Background location task is already registered.');
//     //   return;
//     // }

//     TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//       if (error) {
//         // Handle error if any
//         return;
//       }
//       if (data) {
//         const { locations }: any = data;
//         storeData('lastLocation', JSON.stringify(locations))
//         console.log('Background location:', locations[0].coords.latitude, locations[0].coords.longitude);
//           await axiosClient.put(`${API_ROOT}/update-user-location`, {
//           latitude: locations[0].coords.latitude,
//           longitude: locations[0].coords.longitude
//         });
//       }
//     });

//     await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//       accuracy: Location.Accuracy.Balanced,
//       timeInterval: 5000, 
//       distanceInterval: 0,
//       pausesUpdatesAutomatically: false, 
//       foregroundService: {
//         notificationTitle: 'Background Location',
//         notificationBody: 'Background location updates are running',
//       },
//     });

//     // Register the combined background task
//     // await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//     //   minimumInterval: 60 * 1, // 1 minutes, adjust as needed
//     //   stopOnTerminate: false,
//     //   startOnBoot: true
//     // });
//   }
// };

// const requestForegroundPermissions = async () => {
//   const { status } = await Location.requestForegroundPermissionsAsync();
//   if (status === 'granted') {
//     await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//       accuracy: Location.Accuracy.Balanced,
//       timeInterval: 5000, 
//       distanceInterval: 5,
//     });

//     // Register the combined background task
//     await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//       minimumInterval: 10, // 1 minutes, adjust as needed
//       stopOnTerminate: false,
//       startOnBoot: true,
//     });
//   }
// };

const requestForegroundPermissions = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === 'granted') {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000, // 5 seconds
      distanceInterval: 0, // 5 meters
    });
  }
};

const requestBackgroundPermissions = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === 'granted') {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000, // 60 seconds
      distanceInterval: 0, // 5 meters
    });
  }
  // const { status } = await Location.requestBackgroundPermissionsAsync();
  // if (status === 'granted') {
  //   await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
  //     accuracy: Location.Accuracy.Balanced,
  //     timeInterval: 5000, 
  //     distanceInterval: 5,
  //   });

  //   // Register the combined background task
  //   await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
  //     minimumInterval: 60, // 1 minutes, adjust as needed
  //     stopOnTerminate: false,
  //     startOnBoot: true,
  //   });
  // }
};

// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//   if (error) {
//     // Handle error if any
//     return;
//   }
//   if (data) {
//     const { locations }: any = data;
//     storeData('lastLocation', JSON.stringify(locations))
//     console.log('Background location:', locations[0].coords.latitude, locations[0].coords.longitude);
//   }
// });

// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async ({ error }) => {
//   if (error) {
//     console.error('Background fetch task error:', error);
//     return;
//   }
//   console.log('location task name send loc')
//   const storedLocationString = await retrieveData('lastLocation') 
//   if(storedLocationString) {
//     const storedLocation = JSON.parse(storedLocationString)
//     console.log(storedLocation, 'stored locations')

//     await axiosClient.put(`${API_ROOT}/update-user-location`, {
//       latitude: storedLocation[0].coords.latitude,
//       longitude: storedLocation[0].coords.longitude
//     });
//   }

//   // Return a successful result
//   return BackgroundFetch.BackgroundFetchResult.NewData;
// });

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const TabOneScreen = ({screenChange}: any) => {
  const [swipe, setSwipe] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [state, setState] = useState([]);
  const [_state, _setState] = useState('');
  const {matches} = useMatch();
  const [actualMatch, setActualMatch] = useState<Match[]>([]);
  const [filter, setFilter] = useState<IFilter>();
  const [finalData, setFinalData] = useState<any>([]);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [error, setError] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const { user } = useUser();

  const dispatch = useAppDispatch();
  const authReducer = useAppSelector(state => state.authReducer);
  const userReducer = useAppSelector(state => state.userReducer);

  const [rangeValues, setRangeValues] = useState({
    decrease: 0,
    increase: 0
  });
  const [rangeDisValues, setRangeDisValues] = useState({
    decrease: 0,
    increase: 0
  });

  const handleRangeDecChange = (values: any) => {
    setRangeValues({
      ...rangeValues, decrease: values
    });
  };
  const handleRangeIncChange = (values: any) => {
    setRangeValues({
      ...rangeValues, increase: values
    });
  };

  const handleRangeDisDecChange = (values: any) => {
    setRangeDisValues({
      ...rangeDisValues, decrease: values
    });
  };
  const handleRangeDisIncChange = (values: any) => {
    setRangeDisValues({
      ...rangeDisValues, increase: values
    });
  };

  const handleFilter = () => {
    const payload = {
      state: _state,
      minAge: rangeValues.decrease,
      maxAge: rangeValues.increase,
      minDistance: rangeDisValues.decrease,
      maxDistance: rangeDisValues.increase
    };
    setModalVisible(false)
    
    setFilter(payload)
  }

  const handleSwipeUp = () => {
    if(user?.subscription?.plan === 'red' || user?.subscription?.plan === 'black') {setIsError(true); return};
    setSwipe('up')
  }

  const handleReset = () => {
    const payload = {
      state: '',
      distance: null,
      minAge: null,
      maxAge: null,
      minDistance: null,
      maxDistance: null
    }
    setRangeDisValues({decrease: 0, increase: 0})
    setRangeValues({decrease: 0, increase: 0})
    _setState('')
    setModalVisible(false)
    setFilter(payload)
  };

  useEffect(() => {
    if(authReducer.signInStatus === 'completed') {
      dispatch(clearSignInStatus())
    }
  },[authReducer.signInStatus]);

  // useFocusEffect(
  //   useCallback(() => {
  //   (async () => {
  //       let { status } = await Location.requestForegroundPermissionsAsync();

  //       if (status !== 'granted') {
  //         return alertComponent(
  //           'Location',
  //           'Permission to access location was denied',
  //           'Ok',
  //           () => console.log('pressed')
  //         );
  //       };

        
  //       let location = await Location.getCurrentPositionAsync({});
  //       setLocation(location);
  //   })();
  //   }, [])
  // );

  useEffect(() => {
    const newState = [];
    for (let key in stateLga) {
      newState.push({
        label: key,
        value: key.toLowerCase(),
      });
    }
    setState(newState);
  }, [stateLga]);

  useEffect(() => {
    const mappedMatches = matches.map((match, index) => {
      return {
        firstName: match.firstName,
        lastName: match.lastName,
        age: match.age,
        occupation: match.jobType,
        address: match.address,
        userId: match._id,
        id: index + 1,
        image: match.profileImageUrl,
        distance: +match.distance,
        gender: match.gender,
        state: match.state,
        profileVisibility: match.profileVisibility,
        gallery: match.gallery
      };
    });

    setActualMatch(mappedMatches as Match[]);
  }, [matches]);  

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await getTokenFromSecureStore(settings.auth.admin);
            const payloadBase64 = data && data.split('.')[1];
            const decodedPayload = base64Decode(payloadBase64);
            const decodedPayloadJSON = JSON.parse(decodedPayload);

            if(decodedPayloadJSON.level < 2) {
              router.push('/auth/gender')
            } else {
              dispatch(setSignInAfterSignUp({
                emailOrPhone: '',
                password: ''
              }))
            }
        } catch (error) {
          console.error(error);
          // Handle the error (e.g., show an error message)
        }
      };

      fetchData();
    }, [])
  );

  useEffect(() => {
    const filteredData = actualMatch?.filter((item: Match) =>
      (!filter?.state || item.state.toLowerCase().includes(filter?.state)) &&
      (!filter?.minDistance || !filter?.maxDistance || (item.distance >= filter?.minDistance && item.distance <= filter?.maxDistance)) &&
      (!filter?.minAge || !filter?.maxAge || (item.age >= filter?.minAge && item.age <= filter?.maxAge))
    );

    setFinalData(filteredData);
  }, [filter, actualMatch]);

  useEffect(() => {
    console.log('fired location update')
    requestBackgroundPermissions()
    requestForegroundPermissions()

    return () => {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    };
  },[]);

  useEffect(() => {
    if(userReducer.likeStatus === 'completed') {
      const data = JSON.stringify(userReducer.likedUser)
      socket.emit('liked', data)
      if(userReducer.likedUser.likened === true) {
        router.push('/auth/modals/match')
      }
      // dispatch(getMatchesAction())
      dispatch(clearLikeStatus())
    }
  },[userReducer.likeStatus]);

  useEffect(() => {
    if(userReducer.unlikeStatus === 'completed') {
      const data = JSON.stringify(userReducer.unlikedUser)
      socket.emit('liked', data)

      // dispatch(getMatchesAction())
      dispatch(clearUnLikeStatus())
    }
  },[userReducer.unlikeStatus]);

  useEffect(() => {
    socket.on('likeDislike', (data) => {
      // showAlert(data.message);
      // appStateVisible === 'background' || appStateVisible === 'inactive' && 
      schedulePushNotification(data);
    });
  
    return () => {
      socket.off('likeDislike');
    };  
  }, [socket.connected]);

  useEffect(() => {
    socket.on('getOnlineUsers', (data) => {
      dispatch(setOnlineUsers(data))
    });

    return () => {
      socket.off('getOnlineUsers');
    }; 
  },[socket.connected]);
  
  const schedulePushNotification = async (data: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lynk",
        body: data.message,
        data: data,
        sound: 'default'
      },
      trigger: { seconds: 2 },
    });
  };

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      dispatch(setFromUserId(notification.request.content.data.fromUserId))
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      router.push({pathname: '/auth/single-user', params: {from: 'one-screen'}});
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if(userReducer.unlikeUserFrmMatchStatus === 'failed') {
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
    if(userReducer.favUserStatus === 'failed') {
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
    if(userReducer.getAllUserNotificationStatus === 'completed') {
      const notifications = userReducer.notifications.filter(notification => notification.status === false);
      const sorted = notifications.sort((a: any, b: any) => b.dateCreated - a.dateCreated);
      setNotifications(sorted)
      dispatch(clearGetAllUserNotificationStatus())
    } else if(userReducer.getAllUserNotificationStatus === 'failed') {
      dispatch(clearGetAllUserNotificationStatus())
    }
  },[userReducer.getAllUserNotificationStatus]);

  useEffect(() => {
    const checkToken = async () => {
      const id = await getTokenFromSecureStore(process.env.EXPO_PUBLIC_BIOMETRIC_LOGIN_KEY);
      if(id !== null && id !== user?._id) {
        saveTokenToSecureStore(process.env.EXPO_PUBLIC_BIOMETRIC_LOGIN_KEY, user?._id)
      }
    }
    
    checkToken()
  },[user]);

  useFocusEffect(
      useCallback(() => {
        dispatch(getUserNotificationsAction());
        dispatch(setSignInAfterSignUp2(false));
        dispatch(getMatchesAction())
    },[])
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.containerTop}>
        <Text style={styles.title}>
          Discovery
        </Text>
        <View
          style={tw`flex flex-row justify-center items-center gap-5`}
        >
          {userReducer.whichScreen !== 'fifth' && (<TouchableOpacity
            onPress={() => router.push('/auth/notifications')}
            style={{ marginTop: Platform.select({android: 20, ios: 10}) }}
          >
            <FontAwesome
              name='bell'
              size={25}
              color={COLORS.primary}
            />
            {notifications.length !== 0 && (<View
              style={[{
                width: 20,
                height: 20,
                backgroundColor: 'red',
                borderRadius: 50,
                position: 'absolute',
                marginLeft: 15
              }, tw`flex justify-center items-center`]}
            >
              <Text
                style={{
                  fontFamily: FONT.bold,
                  color: 'white',
                  fontSize: SIZES.small
                }}
              >{notifications.length > 9 ? '9+' : notifications.length}</Text>
            </View>)}
          </TouchableOpacity>)}

          <TouchableOpacity style={{marginTop: Platform.select({android: 20, ios: 10})}}
            onPress={() => 
              setModalVisible(true)
            }
          >
            <Image
              source={icons.btn_filter}
              style={{
                width: 35,
                height: 35
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.imgContainer}>
        {finalData.length > 0 ? 
          (
            <ImageSwiper swipe={swipe} setSwipe={setSwipe} data={finalData}/>
          ) : (
            <>
              <Swiper
                cards={[]}
                infinite={true}
                renderCard={(card: Match, index) => (
                  <View
                    style={{
                      height: 58/100 * height,
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Image
                      source={images.no_image_m}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 20,
                        borderColor: COLORS.gray2,
                        borderWidth: 0.3
                      }}
                      resizeMode='cover'
                    />
                    <View
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '50%',
                        borderRadius: 20,
                        display: 'flex',
                        justifyContent: 'space-between',
                        backgroundColor: 'transparent'
                      }}
                    >
                      <View />
                      <View
                        style={{
                          width: '100%',
                          height: 50,
                          backgroundColor: 'transparent',
                          paddingHorizontal: 20,
                          paddingVertical: 5
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONT.extraBold,
                            fontSize: SIZES.xLarge,
                            alignSelf: 'center',
                            elevation: 5,
                          }}
                        >No match found</Text>
                      </View>
                    </View>
                  </View>
                )}
                backgroundColor="transparent"
                cardVerticalMargin={30}
                showSecondCard={false}
                disableLeftSwipe
                disableRightSwipe
                disableBottomSwipe
                disableTopSwipe
              />
            </>
          )}
        <View
          style={{ 
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 65/100 * height,
            height: 'auto',
            gap: 30
          }}
        >
          <TouchableOpacity
            onPress={() => dispatch(rewindUnlikedUserAction())}
            style={styles.dislikeBtn}
          >
            <FontAwesome
              name="recycle"
              size={30}
              color={'green'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSwipe('left')}
            style={styles.dislikeBtn}
          >
            <FontAwesome
              name="close"
              size={30}
              color={'red'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSwipe('right')}
            style={styles.likeBtn}
          >
            <FontAwesome
              name="heart"
              size={30}
              color={'white'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSwipeUp()}
            style={styles.dislikeBtn}
          >
            <FontAwesome
              name="star"
              size={30}
              color={'green'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Snackbar
        isVisible={isError} 
        message={error || "You are not allowed to super like this user, Please upgrade your plan to purple or purple+."}
        onHide={() => setIsError(false)}
        type='error'
      />
      {modalVisible && (<ReusableModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            width: '100%',
            height: "auto"
          }}
          animationViewStyle={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
        }}
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
              fontSize: SIZES.xLarge,
            }}
          >Filters</Text>
          <View style={{display: 'flex', gap: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={handleReset}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontFamily: FONT.bold,
                  fontSize: SIZES.medium
                }}
            >Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
            >
            <Text
              style={{
                color: COLORS.primary,
                fontFamily: FONT.bold,
                fontSize: SIZES.medium
              }}
            >Close</Text>
            </TouchableOpacity>
            
          </View>
          
        </View>
        <View
          style={{
            marginTop: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20
          }}
        >
          {Array.isArray(state) && (
            <>
              <Select
                data={state}
                onValueChange={(text: string) => _setState(text)}
                value={_state}
                hasPLaceHolder={true}
                placeholderTop='State'
                showSelectError={false}
                selectWidth={80/100 * width}
                placeholderLabel='Select a state...'
                planType={user?.subscription?.plan}
              />
              <View
                style={{
                  alignSelf: 'center',
                  width: 80/100 * width,
                  marginTop: -18,
                  paddingHorizontal: 10
                }}
              >
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    fontFamily: FONT.bold,
                    fontSize: SIZES.xSmall,
                    color: 'red'
                  }}
                >Filtering by state is disabled. Please upgrade your plan to purple.</Text>
              </View>
            </>
          )}
          
          <View
            style={{
              width: 80/100 * width,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <Text
              style={{
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large,
              }}
            >Distance</Text>
            <Text
              style={{
                fontFamily: FONT.regular,
                fontSize: SIZES.medium,
              }}
            >{rangeDisValues.decrease} - {rangeDisValues.increase}km</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: 80/100 * width,
              gap: Platform.select({ios: -8, android: -35})
            }}
          >
            <Slider
              style={{
                width: Platform.select({ios: '50%', android: '60%'}),
              }}
              value={rangeDisValues.decrease}
              onValueChange={handleRangeDisDecChange}
              minimumValue={0}
              maximumValue={200}
              step={1}
              thumbTintColor={COLORS.primary}
              minimumTrackTintColor={COLORS.gray2}
              maximumTrackTintColor={COLORS.primary}
            />
            <Slider
              style={{
                width: Platform.select({ios: '50%', android: '60%'}),
                marginLeft: -8
              }}
              value={rangeDisValues.increase}
              onValueChange={handleRangeDisIncChange}
              minimumValue={rangeDisValues.decrease}
              maximumValue={400}
              step={1}
              thumbTintColor={COLORS.primary}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.gray2}
            />
          </View>

          <View
            style={{
              width: 80/100 * width,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <Text
              style={{
                fontFamily: FONT.extraBold,
                fontSize: SIZES.large,
              }}
            >Age</Text>
            <Text
              style={{
                fontFamily: FONT.regular,
                fontSize: SIZES.medium,
              }}
            >{rangeValues.decrease} - {rangeValues.increase}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: 80/100 * width,
              gap: Platform.select({ios: -8, android: -35})
            }}
          >
            <Slider
              style={{
                width: Platform.select({ios: '50%', android: '60%'})
              }}
              value={rangeValues.decrease}
              onValueChange={handleRangeDecChange}
              minimumValue={0}
              maximumValue={50}
              step={1}
              thumbTintColor={COLORS.primary}
              minimumTrackTintColor={COLORS.gray2}
              maximumTrackTintColor={COLORS.primary}
            />
            <Slider
              style={{
                width: Platform.select({ios: '50%', android: '60%'})
              }}
              value={rangeValues.increase}
              onValueChange={handleRangeIncChange}
              minimumValue={rangeValues.decrease}
              maximumValue={100}
              step={1}
              thumbTintColor={COLORS.primary}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.gray2}
            />
          </View>
          <AppBtn
            handlePress={handleFilter}
            isText={true}
            btnTitle={'Send'} 
            btnWidth={'80%'} 
            btnHeight={60} 
            btnBgColor={COLORS.primary}
            btnTextStyle={{
              fontSize: SIZES.medium,
              fontFamily: FONT.bold
            }}
            btnStyle={{
              marginTop: 20,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        </View>
      </ReusableModal>)}
      <StatusBar style='dark'/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: {
    height: height
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
    width: 60,
    height: 60,
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
  title: {
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.extraBold,
    marginTop: Platform.select({android: 30, ios: 0})
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  scrollViewContent: {
    flex: 1
  },
  containerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
    borderRadius: 20,
  },
});

export default TabOneScreen;