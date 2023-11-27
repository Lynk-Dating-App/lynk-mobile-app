import React from 'react';
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
import { setPhotoUri } from '../../../store/reducers/userReducer';

const { height, width } = Dimensions.get('window');

export default function ForgotPasswordModal() {
  const router = useRouter();
  const { user } = useUser();

  const userReducer = useAppSelector(state => state.userReducer);
  const dispatch = useAppDispatch();

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
            source={userReducer.photoUri !== ''
                    ? {uri: `${settings.api.baseURL}/${userReducer.photoUri}`} 
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
              marginLeft: -80
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
              dispatch(setPhotoUri(''))
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
                dispatch(setPhotoUri(''))
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
