import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, Platform, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Text, View } from '../Themed';
import { COLORS, FONT, SIZES, icons, images } from '../../constants';
import { BlurView } from 'expo-blur';
import useAppDispatch from '../../hook/useAppDispatch';
import useAppSelector from '../../hook/useAppSelector';
import { favUserAction, likeUserAction, unLikeFrmMatchAction } from '../../store/actions/userAction';
import { setFromUserId, setPhotoUri } from '../../store/reducers/userReducer';
import { capitalizeEachWord, capitalizeFirstLetter, wordBreaker } from '../../Utils/Generic';
import settings from '../../config/settings';
import { useRouter } from 'expo-router';
import Snackbar from '../../helpers/Snackbar';
import tw from 'twrnc';

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

  const dispatch = useAppDispatch()
  const userReducer = useAppSelector(state => state.userReducer);

  const handleSwipeLeft = () => {
    swiperRef.current.swipeLeft();
  };

  const handleSwipeRight = () => {
    swiperRef.current.swipeRight();
  };

  const handleSwipeUp = () => {
    swiperRef.current.swipeTop();
  };

  const handleSwipeBottom = () => {
    swiperRef.current.swipeBottom();
  }

  useEffect(() => {
    if(swipe === 'left') {
      handleSwipeLeft()
    } else if(swipe === 'right') {
      handleSwipeRight()
    } else if(swipe === 'up') {
      handleSwipeUp()
    } else if(swipe === 'bottom') {
      handleSwipeBottom()
    }

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
  },[userReducer.favUserStatus])

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

  return (
    <>
      <Swiper
        ref={swiperRef}
        cards={data}
        infinite={true}
        // keyExtractor={(item) => item.userId}
        renderCard={(card: Match, index) => (
          data.length > 0 
          ? (<View key={index}
              style={{
                height: 58/100 * height,
                backgroundColor: 'transparent'
              }}
          >
            <Image
              source={card?.image === undefined 
                        ? card?.gender === 'male' ? images.no_image_m : images.no_image_f
                        : {uri: `${settings.api.baseURL}/${card?.image}`}}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 20
              }}
              resizeMode='cover'
            />
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: 20,
                display: 'flex',
                // justifyContent: 'space-between',
                backgroundColor: 'transparent'
              }}
            >
              <View
                style={{
                  height: '75%',
                  backgroundColor: 'transparent'
                }}
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
                  <TouchableOpacity
                    onPress={() => setSwipe('bottom')}
                    style={{
                      padding: 5,
                      borderRadius: 20,
                      width: 40,
                      height: 30,
                      marginLeft: 30,
                      marginRight: 30,
                      marginTop: 20,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONT.bold,
                        fontSize: SIZES.small,
                        color: COLORS.primary
                      }}
                    >Skip</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1
                  }}
                  onPress={() => {
                    if(data.length === 0) return;
                    dispatch(setFromUserId(card.userId))
                    router.push({pathname: '/auth/single-user', params: {from: 'one-screen'}})
                  }}
                />
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
                  flex: 1
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
                <Text
                  style={{
                    color: 'white',
                    fontFamily: FONT.semiBold,
                    fontSize: SIZES.medium
                  }}
                >{wordBreaker(capitalizeEachWord(card?.address), 4)}</Text>
                {/* <TouchableOpacity
                  onPress={() => {
                    dispatch(setFromUserId(card?.userId))
                    router.push({pathname: '/auth/single-user', params: {from: 'one-screen'}})}}
                  style={[{
                    backgroundColor: 'white',
                    borderRadius: 5,
                    marginTop: 15,
                    marginBottom: 10,
                    width: 100
                  }, tw`flex justify-center items-center`]}
                >
                  <Text
                    style={{
                      fontFamily: FONT.bold,
                      color: COLORS.primary
                    }}
                  >
                    View profile
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
             </View>)
          : (
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
                    // borderBottomLeftRadius: 20,
                    // borderBottomRightRadius: 20,
                    width: '100%',
                    height: 50,
                    backgroundColor: 'transparent',
                    paddingHorizontal: 20,
                    paddingVertical: 5
                  }}
                >
                  <Text
                    style={{
                      // color: 'blac',
                      fontFamily: FONT.extraBold,
                      fontSize: SIZES.xLarge,
                      alignSelf: 'center',
                      elevation: 5,
                    }}
                  >No match found</Text>
                  {/* <Text
                    style={{
                      color: 'white',
                      fontFamily: FONT.semiBold,
                      fontSize: SIZES.medium
                    }}
                  >Hello</Text> */}
                  {/* <Text
                    style={{
                      color: 'white',
                      fontFamily: FONT.semiBold,
                      fontSize: SIZES.medium
                    }}
                  ></Text> */}
                </View>
              </View>
            </View>
          )
        )}
        cardIndex={0}
        backgroundColor="transparent"
        stackSize={3}
        cardVerticalMargin={30}
        showSecondCard={true}
        onSwipedLeft={(cardIndex) => {
          dispatch(unLikeFrmMatchAction(data[cardIndex].userId))
        }}
        onSwipedRight={(cardIndex) => {
          dispatch(setPhotoUri({photo: data[cardIndex].image, userId: data[cardIndex].userId}))
          dispatch(likeUserAction(data[cardIndex].userId))
        }}
        onSwipedTop={(cardIndex) => dispatch(favUserAction(data[cardIndex].userId))}
        onSwiped={(cardIndex) => setIndex(cardIndex)}
        onSwipedBottom={() => console.log('bottom')}
        // onTapCard={(cardIndex) => {
        //   if(data.length === 0) return;
        //   dispatch(setFromUserId(data[cardIndex].userId))
        //   router.push({pathname: '/auth/single-user', params: {from: 'one-screen'}})
        // }}
        stackSeparation={-17}
        disableLeftSwipe={status}
        disableRightSwipe={status}
        disableBottomSwipe={status}
        disableTopSwipe={status}
      />
      <Snackbar
        isVisible={isSuccess} 
        message={success}
        onHide={() => setIsSuccess(false)}
        type='success'
      />
    </>
  );
};
  
export default ImageSwiper;
  