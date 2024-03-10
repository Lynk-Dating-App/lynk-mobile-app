import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, Platform, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Text, View } from '../Themed';
import { FONT, SIZES, icons, images } from '../../constants';
import { BlurView } from 'expo-blur';
import useAppDispatch from '../../hook/useAppDispatch';
import useAppSelector from '../../hook/useAppSelector';
import { favUserAction, likeUserAction, unLikeFrmMatchAction } from '../../store/actions/userAction';
import { clearRewindUnlikeUserStatus, clearUnLikeUserFrmMatchStatus, setFromUserId, setPhotoUri } from '../../store/reducers/userReducer';
import { capitalizeEachWord, capitalizeFirstLetter, wordBreaker } from '../../Utils/Generic';
import settings from '../../config/settings';
import { useRouter } from 'expo-router';
import Snackbar from '../../helpers/Snackbar';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
  gender: string;
  state: string;
  profileVisibility: boolean;
  gallery: string[]
}

const { height } = Dimensions.get('window');

interface IProps {
  swipe: string;
  setSwipe: any;
  data: any;
}

const ImageSwiper = ({swipe, setSwipe, data}: IProps) => {
  const [index, setIndex] = useState<number>(-1);
  const swiperRef = useRef(null);
  const router = useRouter();
  const [success, setSuccess] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [position, setPosition] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisLiked, setIsDisLiked] = useState(false);
  const [newData, setNewData] = useState<any[]>([]);
  const [unlikedId, setUnlikedId] = useState('');
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>('')

  const dispatch = useAppDispatch()
  const userReducer = useAppSelector(state => state.userReducer);

  const startAnimation = () => {
    setIsAnimating(true);

    Animated.timing(animatedValue, {
      toValue: 4,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSwipeLeft = () => {
    swiperRef.current.swipeLeft();
  };

  const handleSwipeRight = () => {
    swiperRef.current.swipeRight();
  };

  const handleSwipeUp = () => {
    swiperRef.current.swipeTop();
  };

  const next = () => {
    if (swiperRef.current) {
      const currentIndex = swiperRef.current.state.firstCardIndex;
      swiperRef.current.jumpToCardIndex(currentIndex + 1);
    }
  };

  const onSwiping = (index: number, position: number) => {
    setPosition(index)
  };

  const onSwipedAborted = () => {
    setPosition(0)
  };
  const previous = () => {
    if (swiperRef.current) {
      const currentIndex = swiperRef.current.state.secondCardIndex;
      swiperRef.current.jumpToCardIndex(currentIndex);
    }
  };

  useEffect(() => {
    if(swipe === 'left') {
      handleSwipeLeft()
    } else if(swipe === 'right') {
      handleSwipeRight()
    } else if(swipe === 'up') {
      handleSwipeUp()
    } 
    // else if(swipe === 'bottom') {
    //   handleSwipeBottom()
    // }

    return () => {
      setSwipe('')
    }
  },[swipe]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.favUserStatus === 'failed') {
      setIsSuccess(true)
      setSuccess(userReducer.favUserError)
      intervalId = setTimeout(() => {
        setSuccess('')
      },6000)
    };

    return () => {
      clearInterval(intervalId);
    }
  },[userReducer.favUserStatus]);

  useEffect(() => {
    if(userReducer.likeStatus === 'completed') {
      setIsLiked(true)
      startAnimation()
    }
  },[userReducer.likeStatus]);

  useEffect(() => {
    if(userReducer.unlikeUserFrmMatchStatus === 'completed') {
      setIsDisLiked(true)
      startAnimation()
    }

    dispatch(clearUnLikeUserFrmMatchStatus())
  },[userReducer.unlikeUserFrmMatchStatus]);

  const status = useMemo(() => {
    return (
      userReducer.likeStatus === 'loading' ||
      data.length === 0 ||
      userReducer.favUserStatus === 'loading' ||
      userReducer.unlikeUserFrmMatchStatus === 'loading'
    );
  }, [
    userReducer.likeStatus,
    data,
    userReducer.favUserStatus,
    userReducer.unlikeUserFrmMatchStatus
  ]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if(isAnimating) {
      intervalId = setTimeout(() => {
        setIsAnimating(false)
        setIsDisLiked(false)
        setIsLiked(false)
      },2000)
    }

    return () => {
      clearInterval(intervalId);
    }
  },[isAnimating]);

  useEffect(() => {
    if(userReducer.rewindUnlikedUserStatus === 'completed') {
      const _data = [...data, { ...userReducer.rewindedUser, id: data.length + 1 }]
      setNewData(_data)
      dispatch(clearRewindUnlikeUserStatus());
      swiperRef.current.jumpToCardIndex(newData.length - 1);
    }
  },[userReducer.rewindUnlikedUserStatus]);

  useEffect(() => {
    if(userReducer.rewindUnlikedUserStatus === 'failed') {
      setIsError(true)
      setError(userReducer.rewindUnlikedUserError)
      dispatch(clearRewindUnlikeUserStatus());
    }
  },[userReducer.rewindUnlikedUserStatus]);

  useEffect(() => {
    setNewData([...data])
  },[data]);

  useEffect(() => {
    if(userReducer.unlikeUserFrmMatchStatus === 'completed') {
      const filteredArray = newData.filter((item) => item.userId !== unlikedId);
      setNewData([...filteredArray]);
      dispatch(clearUnLikeUserFrmMatchStatus());
    }
  },[userReducer.unlikeUserFrmMatchStatus]);

  return (
    <>
      <Swiper
        onSwiping={onSwiping}
        onSwipedAborted={onSwipedAborted}
        ref={swiperRef}
        cards={newData}
        infinite={true}
        renderCard={(card: Match, index) => {
          return (
            <>
              <View key={index}
                  style={{
                    height: 58/100 * height,
                    backgroundColor: 'transparent'
                  }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 20
                  }}
                >
                  <Image
                    source={card?.image === undefined 
                      ? card?.gender === 'male' ? images.no_image_m : images.no_image_f
                      : {uri: `${settings.api.baseURL}/${card?.image}`}}
                    // source={card?.gallery.length === 0 
                    //           ? card?.image
                    //           : { uri: `${settings.api.baseURL}/${card?.gallery[currentIndex]}` }}
                    style={{
                      width: '100%',
                      height: '73%',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20
                    }}
                    resizeMode='cover'
                  />
                </View>
                
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: 20,
                    display: 'flex',
                    backgroundColor: 'transparent'
                  }}
                >
                  <View
                    style={{
                      height: '73%',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        backgroundColor: 'transparent'
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: '30%'
                        }}
                        onPress={previous}
                        activeOpacity={1}
                      >
                        <View
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            height: '20%'
                          }}
                        >
                          {card?.distance !== 0 && (<BlurView intensity={100}
                            style={{
                              width: 90,
                              height: 35,
                              paddingHorizontal: 2,
                              marginLeft: 30,
                              marginTop: 20,
                              borderRadius: 10,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              overflow: 'hidden',
                              flexDirection: 'row'
                            }}
                          >
                            <Image
                              source={icons.location_pin}
                              style={{
                                width: 14,
                                height: 14
                              }}
                            />
                            <Text style={{
                              color: 'white',
                              fontFamily: FONT.extraBold,
                              fontSize: 14
                            }}>&nbsp;&nbsp;{card?.distance} km</Text>
                          </BlurView>)}
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: '40%'
                        }}
                        onPress={() => {
                          if(data.length === 0) return;
                          dispatch(setFromUserId(card.userId))
                          router.push({pathname: '/auth/single-user', params: {from: 'one-screen'}})
                        }}
                      />
                      <TouchableOpacity
                        style={{
                          width: '30%'
                        }}
                        onPress={next}
                      />
                    </View>
                  </View>
                  
                  <View
                    style={{
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                      width: '100%',
                      height: Platform.select({android: 125, ios: 110}),
                      backgroundColor: '#191919',
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                      flex: 1, gap: 2
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: FONT.extraBold,
                        fontSize: card?.firstName?.length + card?.lastName?.length > 8 ? SIZES.xLarge : SIZES.xxLarge,
                        elevation: 5,
                      }}
                    >{capitalizeFirstLetter(card?.firstName)} {`${capitalizeFirstLetter(card?.lastName)},`} {card?.age}</Text>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: FONT.semiBold,
                        fontSize: SIZES.medium
                      }}
                    >{capitalizeEachWord(card?.occupation)}</Text>
                    {card?.address && (<Text
                        style={{
                          color: 'white',
                          fontFamily: FONT.semiBold,
                          fontSize: 14
                        }}
                      >{wordBreaker(capitalizeEachWord(card?.address), 4)}</Text>)}
                  </View>
                </View>
              </View>
            </>
        )}}
        cardIndex={0}
        backgroundColor="transparent"
        stackSize={3}
        cardVerticalMargin={30}
        showSecondCard={true}
        onSwipedLeft={(cardIndex) => {
          setUnlikedId(data[cardIndex].userId)
          dispatch(unLikeFrmMatchAction(data[cardIndex].userId))
        }}
        onSwipedRight={(cardIndex) => {
          dispatch(setPhotoUri({photo: data[cardIndex].image, userId: data[cardIndex].userId}))
          dispatch(likeUserAction(data[cardIndex].userId))
        }}
        onSwipedTop={(cardIndex) => dispatch(favUserAction(data[cardIndex].userId))}
        onSwiped={(cardIndex) => setIndex(cardIndex)}
        // onSwipedBottom={() => console.log('bottom')}
        // onTapCard={(cardIndex) => {
        //   console.log('tapped')
        //   setCurrentIndex(prevIndex => prevIndex < data[currentIndex]?.gallery.length - 1 ? prevIndex + 1 : prevIndex);
        //   if(data.length === 0) return;
        //   dispatch(setFromUserId(data[cardIndex].userId))
        //   router.push({pathname: '/auth/single-user', params: {from: 'one-screen'}})
        // }}
        stackSeparation={-17}
        disableLeftSwipe={status}
        disableRightSwipe={status}
        disableBottomSwipe
        disableTopSwipe
      />
      {isAnimating && (<Animated.View
        style={{
          height: 58/100 * height,
          backgroundColor: 'transparent',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ],
        }}
      >
        {isLiked && (<FontAwesome
          name={"thumbs-up"}
          size={100}
          color={"#3688FF"}
        />)}
        {isDisLiked && (<FontAwesome
          name={"thumbs-down"}
          size={100}
          color={"red"}
        />)}
      </Animated.View>)}
      <Snackbar
        isVisible={isSuccess} 
        message={success}
        onHide={() => setIsSuccess(false)}
        type='success'
      />

      <Snackbar
        isVisible={isError} 
        message={error}
        onHide={() => setIsError(false)}
        type='error'
      />
    </>
  );
};
  
export default ImageSwiper;
  