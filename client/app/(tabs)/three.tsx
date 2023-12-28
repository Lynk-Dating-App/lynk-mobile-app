import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, Text, View } from '../../components/Themed';
import useUser from '../../hook/useUser';
import useAppDispatch from '../../hook/useAppDispatch';
import useAppSelector from '../../hook/useAppSelector';
import { createChatAction, findUserChatsAction, getLikedAndLikedByUsersAction } from '../../store/actions/userAction';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS, FONT, SIZES, images } from '../../constants';
import AppInput from '../../components/AppInput/AppInput';
import settings from '../../config/settings';
import { capitalizeFirstLetter, characterBreaker, dateDifference } from '../../Utils/Generic';
import { clearCreateChatStatus, clearGetLikedAndLikedByUsersStatus, setChatUsers, setOnlineUsers } from '../../store/reducers/userReducer';
import socket from '../../config/socket';
import tw from 'twrnc';
import Snackbar from '../../helpers/Snackbar';

const { width } = Dimensions.get('window');

export default function TabThreeScreen() {

  const router = useRouter();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const userReducer = useAppSelector(state => state.userReducer);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const filteredData = userReducer.chatMembers.filter((item: any) =>
    item.firstName?.toLowerCase().includes(searchQuery)
  );

  const handleChat = async (id: string) => {
    dispatch(createChatAction({firstId: user?._id, secondId: id}))
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleChat(item.key)}
      style={tw`flex justify-center flex-column items-center gap-3`}>
       <View 
        style={[{
          marginHorizontal: 10,
          backgroundColor: userReducer.onlineUsers.find((data) => data.userId === item.key) ? COLORS.primary : COLORS.gray2,
          borderRadius: 50
        },tw`flex justify-center items-center h-20 w-20`]}
      >
        <View
          style={[{
            borderRadius: 50,
            borderWidth: 3,
            borderColor: COLORS.white
          },tw`flex justify-center items-center h-19 w-19`]}
        >
          <Image
            source={item?.profileImage ? {uri: `${settings.api.baseURL}/${item?.profileImage}`} : images.no_image_m}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 50
            }}
          />
        </View>
      </View>
      <Text
        style={{
          fontFamily: FONT.bold,
          fontSize: SIZES.medium
        }}
      >{item?.firstName.length > 10 ? capitalizeFirstLetter(characterBreaker(item?.firstName, 10)) : capitalizeFirstLetter(item?.firstName)}</Text>
    </TouchableOpacity>
   
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(findUserChatsAction(userReducer.loggedInuser?._id))
      dispatch(getLikedAndLikedByUsersAction());
    },[userReducer.loggedInuser])
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.createChatStatus === 'completed') {
        dispatch(findUserChatsAction(userReducer.loggedInuser?._id))
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

  useEffect(() => {
    socket.on('messageSentAck', (data) => {
      if(data) {
        dispatch(findUserChatsAction(userReducer.loggedInuser?._id))
      }
    });
  
    return () => {
      socket.off('messageSentAck');
    };  
  }, [socket.connected]);

  useEffect(() => {
    if(userReducer.getLikedAndLikedByUsersStatus === 'completed') {
      dispatch(clearGetLikedAndLikedByUsersStatus())
    }
  },[userReducer.getLikedAndLikedByUsersStatus]);

  useEffect(() => {
    socket.on('getOnlineUsers', (data) => {
      dispatch(setOnlineUsers(data))
    });

    return () => {
      socket.off('getOnlineUsers');
    }; 
  },[socket.connected]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.headContainer, {marginBottom: userReducer.likedAndLikedByUsers.length > 0 ? -5 : 20}]}>
        <Text
          style={{
            fontFamily: FONT.bold,
            fontSize: SIZES.xxLarge
          }}
        >Messages</Text>
        <AppInput
          placeholder='Search'
          hasPLaceHolder={true}
          value={searchQuery}
          placeholderTop=''
          style={{
            width: 85/100 * width,
            marginBottom: 20
          }}
          onChangeText={(text: string) => setSearchQuery(text.toLowerCase())}
        />
      </View>
      {userReducer.likedAndLikedByUsers?.length > 0 && (<FlatList
        data={userReducer?.likedAndLikedByUsers}
        horizontal={true}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={tw`flex justify-center items-center`}
        style={[{
          height: 0,
          marginHorizontal: 20
        }]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />)}
      
      <FlatList
        data={filteredData}
        numColumns={1}
        showsVerticalScrollIndicator={false} 
        style={{
          marginHorizontal: 10,
        }}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
          <Text
              style={{
                fontFamily: FONT.bold,
                fontSize: SIZES.large
              }}
            >No data available</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              gap: 20
            }}
          >
            <TouchableOpacity 
              style={styles.container}
              key={item?._id}
              onPress={() => {
                router.push('/auth/modals/chatMessageScreen')
                dispatch(setChatUsers(item))
              }}
            >
              <View
                style={[{
                  width: 60,
                  height: 60,
                  backgroundColor: userReducer.onlineUsers.find((data) => data.userId === item._id) ? COLORS.primary : COLORS.gray2,
                  borderRadius: 50,
                  marginLeft: 20
                },tw`flex justify-center items-center`]}
              >
                <Image 
                  source={item?.profileImageUrl ? {uri: `${settings.api.baseURL}/${item?.profileImageUrl}`} : images.no_image_m}
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 50,
                    borderWidth: 3,
                    borderColor: COLORS.white
                  }}
                />
              </View>
                
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 10
                  }}
                >
                  <View style={styles.section1}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FONT.bold,
                          fontSize: SIZES.large
                        }}
                      >
                        {item?.firstName.length > 8
                          ? `${characterBreaker(capitalizeFirstLetter(item?.firstName), 8)}...`
                          : capitalizeFirstLetter(item?.firstName)}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: FONT.regular,
                        fontSize: SIZES.medium,
                        color: COLORS.tertiary
                      }}
                    >
                      {item.chatDate === null ? '' : dateDifference(item.chatDate)}
                    </Text>
                  </View>
                  <View style={styles.section1}>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: 2
                      }}
                    >
                      {item.senderId === user?._id && <Text
                        style={{
                          fontFamily: FONT.regular,
                          fontSize: SIZES.medium,
                          color: COLORS.gray
                        }}
                      >
                        {`You:`}
                      </Text>}
                      <Text
                      style={{
                        fontFamily: FONT.regular,
                        fontSize: SIZES.medium
                      }}
                    >
                      {item.lastMessage.length > 20 
                        ? `${characterBreaker(item.lastMessage, 20)}....`
                        : item.lastMessage
                      }
                    </Text>
                    </View>
                    
                    {(item.senderId !== user?._id && item.totalUnreadMessages > 0) && (<View
                      style={{
                        width: 25,
                        height: 25,
                        backgroundColor: COLORS.primary,
                        borderRadius: 50,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FONT.bold,
                          fontSize: SIZES.medium,
                          color: 'white'
                        }}
                      >
                        {item.totalUnreadMessages}
                      </Text>
                    </View>)}
                    {item.totalUnreadMessages < 1 && <View />}
                    
                  </View>
                </View>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View style={{
                backgroundColor: '#DBDBDB',
                width: 70/100 * width,
                height: 1
              }}/>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          userReducer.getUserByIdsStatus === 'loading' && (
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    display: 'flex',
    marginBottom: 5
  },
  section1: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: COLORS.gray2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    height: 'auto',
    margin: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  headContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: Platform.select({android: 50, ios: 20}),
    marginHorizontal: 20,
    zIndex: 1
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20
  }
})
