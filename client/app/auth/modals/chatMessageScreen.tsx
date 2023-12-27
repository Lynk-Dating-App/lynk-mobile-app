import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, Text, View } from "../../../components/Themed";
import { ActivityIndicator, Dimensions, FlatList, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, FONT, SIZES, images } from "../../../constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useAppDispatch from "../../../hook/useAppDispatch";
import useAppSelector from "../../../hook/useAppSelector";
import AppInput from "../../../components/AppInput/AppInput";
import { clearCreateChatMessageStatus, clearGetChatMessagesStatus, setChatUsers, setNotification } from "../../../store/reducers/userReducer";
import { useRouter } from "expo-router";
import { createChatMessageAction, getChatMessagesAction } from "../../../store/actions/userAction";
import useUser from "../../../hook/useUser";
import { capitalizeFirstLetter, dateDifference } from "../../../Utils/Generic";
import settings from "../../../config/settings";
import socket from "../../../config/socket";

const { width } = Dimensions.get('window');

const ChatMessageScreen = () => {
    const {user} = useUser()
    const dispatch = useAppDispatch();
    const userReducer = useAppSelector(state => state.userReducer);
    const router = useRouter();
    const [input, setInput] = useState<string>('');
    const [imageModal, setImageModal] = useState<boolean>(false);
    const flatListRef = useRef(null);

    const renderHeader = () => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row', 
            justifyContent: 'flex-start', 
            alignItems: 'center',
            marginTop: Platform.select({ios: 30, android: 50}),
            borderBottomColor: COLORS.gray2,
            borderBottomWidth: 0.3,
            paddingBottom: 10,
            marginBottom: 10
          }}
        >
          <TouchableOpacity
            onPress={() => setImageModal(true)}
            disabled={userReducer.chatUsers?.profileImageUrl === ''}
          >
            <Image
              source={userReducer.chatUsers.profileImageUrl ? {uri: `${settings.api.baseURL}/${userReducer.chatUsers.profileImageUrl}`} : images.no_image_m}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginLeft: 10
              }}
            />
          </TouchableOpacity>
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
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 20
                }}
              >
                <Text
                  style={{
                    fontFamily: FONT.extraBold,
                    fontSize: SIZES.large,
                    marginBottom: -20
                  }}
                >
                  {capitalizeFirstLetter(userReducer.chatUsers.firstName)}
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: userReducer.onlineUsers.some(user => user.userId === userReducer.chatUsers._id) ? 'green' : 'red',
                      borderRadius: 50
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: FONT.regular,
                      color: COLORS.tertiary
                    }}
                  >{userReducer.onlineUsers.some(user => user.userId === userReducer.chatUsers._id) ? 'Online' : 'Offline'}</Text>
                </View>
              </View>
                
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  dispatch(setChatUsers(null))
                  router.push('/(tabs)/three')}}
              >
                <FontAwesome
                  name='close'
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
    );

    const renderInput = () => (
      <View
        style={styles.footerContainer}
      > 
        <AppInput
          placeholder={'Your message'}
          hasPLaceHolder={true}
          placeholderTop={''}
          value={input}
          style={{
            marginTop: -10,
            width: 75/100 * width,
            marginLeft: 20
          }}
          onChangeText={(text: string) => setInput(text)}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 15/100 * width,
            marginTop: 10,
            backgroundColor: COLORS.primary,
            borderRadius: 50,
            height: 50,
            marginRight: 20
          }}
        >
        <FontAwesome
          name="send"
          color="white"
          size={20}
        />
        </TouchableOpacity>
      </View>
    );

    useEffect(() => {
      if(userReducer.chatUsers) {
        dispatch(getChatMessagesAction(userReducer.chatUsers.chat._id))
      }
    },[userReducer.chatUsers]);
    
    useEffect(() => {
      if(userReducer.getChatMessagesStatus === 'completed') {
          dispatch(clearGetChatMessagesStatus())
          flatListRef.current?.scrollToEnd({ animated: true });
      } else if(userReducer.getChatMessagesStatus === 'failed') {
          console.log(userReducer.getChatMessagesError)
          dispatch(clearGetChatMessagesStatus())
      }
    },[userReducer.getChatMessagesStatus]);

    const handleSendMessage = () => {
      const payload = {
        chatId: userReducer.chatUsers.chat._id,
        senderId: user?._id,
        message: input,
        receiverId: userReducer.chatUsers._id
      }
      socket.emit('sendPrivateMessage', payload)
      setInput('')
    }

    useEffect(() => {
      socket.on('messageSentAck', (data) => {
        if(data) {
          dispatch(getChatMessagesAction(userReducer.chatUsers.chat._id))
        }
      });
    
      return () => {
        socket.off('messageSentAck');
      };  
    }, [socket.connected]);
  
    useEffect(() => {
      socket.on('receivePrivateMessage', (data) => {
        if(data) {
          dispatch(getChatMessagesAction(userReducer.chatUsers.chat._id))
        }
      });

      return () => {
        socket.off('receivePrivateMessage');
      };  
    }, [socket.connected]);
 
    return (
        <SafeAreaView style={{flex: 1}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{flex: 1}}
          >
            {renderHeader()}
            <FlatList
              data={userReducer.chatMessages}
              numColumns={1}
              ref={flatListRef}
              showsVerticalScrollIndicator={false} 
              style={{
                marginHorizontal: 10,
              }}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                {userReducer.getChatMessagesStatus !== 'loading' && (<Text
                  style={{
                    fontFamily: FONT.bold,
                    fontSize: SIZES.large
                  }}
                >No conversation available</Text>)}
              </View>
              )}
              renderItem={({ item, index }) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  marginHorizontal: 10
                }}
                key={item._id}
              >
                <View
                  style={{
                    display: 'flex',
                    justifyContent: item.senderId === user?._id ? 'flex-end' : 'flex-start',
                    alignItems: item.senderId === user?._id ? 'flex-end' : 'flex-start',
                    padding: 10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: item.senderId === user?._id ? 0 : 20,
                    borderBottomLeftRadius: item.senderId === user?._id ? 20 : 0,
                    width: 'auto',
                    maxWidth: 60/100 * width,
                    height: 'auto',
                    alignSelf: item.senderId === user?._id ? 'flex-end' : 'flex-start',
                    marginBottom: 10,
                    backgroundColor: item.senderId !== user?._id ? COLORS.gray : COLORS.gray2
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONT.regular,
                      fontSize: SIZES.medium,
                    }}
                  >{item.message}</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    marginTop: -10,
                    marginBottom: 20,
                    flexDirection: 'row',
                    justifyContent: item.senderId !== user?._id ? 'flex-start' : 'flex-end',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                <Text
                  style={{
                    fontFamily: FONT.regular,
                    fontSize: SIZES.small,
                    color: COLORS.tertiary
                  }}
                >{dateDifference(item.createdAt)}</Text>
                {(item.receiverStatus === 'read' && item.senderId === user?._id) && <FontAwesome 
                  name='check'
                  size={15}
                  color={COLORS.primary}
                />}
                </View>
              </View>
              )}
              ListFooterComponent={() => (
              userReducer.getChatMessagesStatus === 'loading' && (
                  <View
                      style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginVertical: 30
                      }}
                  >
                      <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
              )
              )}
            />
            {renderInput()}
          </KeyboardAvoidingView>
          <Modal
            visible={imageModal}
            transparent={true}
            onRequestClose={() => setImageModal(false)}
          >
              <View style={{ 
                      flex: 1, 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)' 
                  }}
              >
                  
                  <Image
                      source={{uri: `${settings.api.baseURL}/${userReducer.chatUsers.profileImageUrl}`}}
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
                          marginTop: Platform.select({ios: -330, android: -380}),
                          marginRight: 30,
                          backgroundColor: 'transparent',
                          flexDirection: 'row',
                          gap: 20
                      }}
                  >
                      <TouchableOpacity 
                          onPress={() => setImageModal(false)}
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    close: {
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary
    },
    footerContainer: {
      display: 'flex',
      marginBottom: 5,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 20
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

export default ChatMessageScreen;