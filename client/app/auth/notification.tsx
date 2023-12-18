import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from '../../components/Themed';
import { COLORS, FONT, SIZES, images } from '../../constants';
import { useRouter } from 'expo-router';
import { Image, StyleSheet } from 'react-native';
import AppBtn from '../../components/common/button/AppBtn';
import * as Notifications from 'expo-notifications';
//@ts-ignore
import { PROJECT_ID } from '@env'; 
import { Platform } from 'react-native';
import useAppDispatch from '../../hook/useAppDispatch';
import { setSignInAfterSignUp2 } from '../../store/reducers/userReducer';

const Notification = () => {
    const projectId = PROJECT_ID;
    const router = useRouter();
    const dispatch = useAppDispatch();
    
    const registerForPushNotificationsAsync = async () => {
        try {
        //   const { status } = await Notifications.getPermissionsAsync();
    
        //   if (status !== 'granted') {
        //     const { status: newStatus } = await Notifications.requestPermissionsAsync();
        //     if (newStatus !== 'granted') {
        //       console.log('Permission to receive push notifications denied');
        //       return;
        //     }
        //   }
            let token: string;

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            // Learn more about projectId:
            // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            console.log('Push token:', token);
            dispatch(setSignInAfterSignUp2(true))
    
        //   const { data: token } = await Notifications.getExpoPushTokenAsync({
        //     projectId
        //   });
          
        } catch (error) {
          console.error('Error registering for push notifications:', error);
        }
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.backBtnContainer}>
                <Text/>
                <Text
                    onPress={() => {
                        router.push('/unauth/login')
                        dispatch(setSignInAfterSignUp2(true))
                    }}
                    style={{
                        fontFamily: FONT.bold,
                        color: COLORS.primary,
                        fontSize: SIZES.medium,
                        marginRight: 30
                    }}
                >
                    Skip
                </Text>
            </View>
            <View style={styles.container}>
                <Image
                    source={images.chat}
                    resizeMode='cover'
                    //@ts-ignore
                    style={{
                        height: 250,
                        width: 250,
                    }}
                />
                <Text
                    style={{
                        fontFamily: FONT.bold,
                        fontSize: SIZES.xLarge,
                        color: 'black',
                        marginTop: 20
                    }}
                >
                    Enable Notification
                </Text>
                <Text
                    style={{
                        fontFamily: FONT.regular,
                        fontSize: SIZES.medium,
                        color: COLORS.tertiary,
                        textAlign: 'center',
                        marginTop: 6
                    }}
                >
                    Get push-notification when you get the match or receive a message.
                </Text>
                <AppBtn
                    handlePress={async () => {
                        registerForPushNotificationsAsync()
                        // await removeTokenFromSecureStore(settings.auth.admin);
                        router.push('/unauth/login')
                    }}
                    isText={true}
                    btnTitle={'I want to be notified'} 
                    btnWidth={'90%'} 
                    btnHeight={60} 
                    btnBgColor={COLORS.primary}
                    btnTextStyle={{
                        fontSize: SIZES.medium,
                        fontFamily: FONT.bold
                    }}
                    btnStyle={{
                        marginBottom: 20,
                        marginTop: 100
                    }}
                />
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backBtnContainer: {
        backgroundColor: 'transparent',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginTop: 25,
    },
})

export default Notification;