import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, Platform, StyleSheet } from 'react-native';
import { SafeAreaView, ScrollView, Text, View } from '../../../components/Themed';
import { COLORS, FONT, SIZES, images } from '../../../constants';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AppBtn, { AppBtn2 } from '../../../components/common/button/AppBtn';
import { useRouter } from 'expo-router';
import useUser from '../../../hook/useUser';
import useAppSelector from '../../../hook/useAppSelector';
import settings from '../../../config/settings';
import useAppDispatch from '../../../hook/useAppDispatch';
import { clearCreateChatStatus, setPhotoUri } from '../../../store/reducers/userReducer';
import { createChatAction } from '../../../store/actions/userAction';
import Snackbar from '../../../helpers/Snackbar';

const { height, width } = Dimensions.get('window');

export default function ForgotPasswordModal() {
  const router = useRouter();
  const { user } = useUser();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const userReducer = useAppSelector(state => state.userReducer);
  const dispatch = useAppDispatch();

  const handleChat = async () => {
    dispatch(createChatAction({firstId: user?._id, secondId: userReducer.photoUri.userId}))
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(userReducer.createChatStatus === 'completed') {
        router.push('/(tabs)/three')
        dispatch(clearCreateChatStatus())
        dispatch(setPhotoUri({photo: '', userId: ''}))
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: width,
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: Platform.select({android: 50})
        }}
      >
        <View style={{marginTop: 40}}>
          <Image
            source={userReducer.photoUri.photo !== ''
                    ? {uri: `${settings.api.baseURL}/${userReducer.photoUri.photo}`} 
                    : images.no_image_m}
            style={{
              width: 150,
              height: 250,
              borderRadius: 20,
              position: 'relative',
              transform: [{ rotate: '15deg' }],
              marginRight: -80
            }}
          />
          <View
            style={{
              position: 'absolute',
              transform: [{ rotate: '-15deg' }],
              marginTop: 120,
              marginLeft: -80,
              backgroundColor: 'transparent'
            }}
          >
            <Image
              source={user?.profileImageUrl !== undefined  ? {uri: `${settings.api.baseURL}/${user?.profileImageUrl}`} : images.no_image_m}
              style={{
                width: 150,
                height: 250,
                borderRadius: 20
              }}
            />
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'white',
                width: 50,
                height: 50,
                borderRadius: 50,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 120,
                marginTop: 60
              }}
            >
              <FontAwesome
                name="heart"
                size={30}
                color={COLORS.primary}
              />
            </View>
          </View>
        </View>

        <View style={styles.container2}>
          <Text
            style={{
              fontFamily: FONT.bold,
              fontSize: SIZES.xxLarge,
              color: COLORS.primary,
              marginTop: 150
            }}
          >It's a match!</Text>
          <Text
            style={{
              fontFamily: FONT.regular,
              fontSize: 14,
              color: COLORS.tertiary
            }}
          >
            Start a conversation now with each other
          </Text>
          <AppBtn
            handlePress={() => {
              handleChat()
              // dispatch(setPhotoUri({photo: '', userId: ''}))
            }}
            isText={true}
            btnTitle={'Say hello'} 
            btnWidth={'80%'} 
            btnHeight={60} 
            btnBgColor={COLORS.primary}
            btnTextStyle={{
                fontSize: SIZES.medium,
                fontFamily: FONT.bold
            }}
            btnStyle={{
              marginBottom: 10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40
            }}
            />
            <AppBtn2
              handlePress={() => {
                dispatch(setPhotoUri({photo: '', userId: ''}))
                router.push('/(tabs)/one')
              }}
              isText={true}
              btnTitle={'Keep swiping'} 
              btnWidth={'80%'} 
              btnHeight={60} 
              btnBgColor={'#DACFD0'}
              btnTextStyle={{
                fontSize: SIZES.medium,
                fontFamily: FONT.bold,
                color: COLORS.primary
              }}
              btnStyle={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20
              }}
            />
        </View>
        <Snackbar
          isVisible={isError} 
          message={error}
          onHide={() => setIsError(false)}
          type='error'
        />
        <StatusBar style={Platform.OS === 'ios' ? 'auto' : 'auto'} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  container2: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
