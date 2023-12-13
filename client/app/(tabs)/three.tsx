import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, Text, View } from '../../components/Themed';
import useUser from '../../hook/useUser';
import useAppDispatch from '../../hook/useAppDispatch';
import useAppSelector from '../../hook/useAppSelector';
import { findUserChatsAction } from '../../store/actions/userAction';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS, FONT, SIZES, images } from '../../constants';
import AppInput from '../../components/AppInput/AppInput';
import settings from '../../config/settings';
import { capitalizeFirstLetter, characterBreaker, dateDifference } from '../../Utils/Generic';
import { setChatUsers } from '../../store/reducers/userReducer';
import socket from '../../config/socket';

const { width } = Dimensions.get('window');

export default function TabThreeScreen() {

  const router = useRouter();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const userReducer = useAppSelector(state => state.userReducer);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredData = userReducer.chatMembers.filter((item: any) =>
    item.firstName?.toLowerCase().includes(searchQuery)
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(findUserChatsAction(userReducer.loggedInuser._id))
    },[])
  );

  useEffect(() => {
    socket.on('messageSentAck', (data) => {
      if(data) {
        dispatch(findUserChatsAction(userReducer.loggedInuser._id))
      }
    });
  
    return () => {
      socket.off('messageSentAck');
    };  
  }, [socket.connected]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.headContainer}>
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
      <FlatList
        data={filteredData}
        numColumns={1}
        showsVerticalScrollIndicator={false} 
        style={{
            marginHorizontal: 10,
        }}
        keyExtractor={(item) => item._id}
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
            <TouchableOpacity style={styles.container} key={item?._id}
              onPress={() => {
                router.push('/auth/modals/chatMessageScreen')
                dispatch(setChatUsers(item))
              }}
            >
              <Image 
                source={item?.profileImageUrl ? {uri: `${settings.api.baseURL}/${item?.profileImageUrl}`} : images.no_image_m}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  marginLeft: 20,
                  borderWidth: 2,
                  borderColor: userReducer.onlineUsers.some(user => user.userId === item._id) ? COLORS.primary : 'transparent'
                }}
              />
              
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
    marginBottom: 20,
    marginHorizontal: 20
  }
})
