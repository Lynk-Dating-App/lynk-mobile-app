import React from "react";
import { Dimensions, Image, ImageBackground, Platform, StyleSheet } from "react-native";
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import { COLORS, FONT, SIZES, icons, images } from "../../constants";
import { useRouter } from "expo-router";
import AppBtn from "../../components/common/button/AppBtn";

const { width, height } = Dimensions.get('window');

const SignUpPage = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={images.signUpImage}
      style={styles.image}
    >
      <SafeAreaView style={{backgroundColor: 'transparent', height: height}}>
        <ScrollView showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: 'transparent'
          }}
        >
          <View style={styles.backBtnContainer}>
            <AppBtn
              handlePress={() => router.back()}
              isImage={true}
              iconUrl={icons.backBtn}
              dimension={35}
            />
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              style={{
                width: '30%',
                height: '100%'
              }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.container}>
            <Text
              style={{
                fontSize: SIZES.large,
                color: 'black',
                fontFamily: FONT.bold,
                marginBottom: 20,
                marginTop: 15
              }}
            />
            <AppBtn 
              handlePress={() => {
                router.push('/unauth/create-account')
              }}
              isText={true}
              btnTitle={'Sign up'} 
              btnWidth={'80%'} 
              btnHeight={60} 
              btnBgColor={COLORS.primary}
              btnTextStyle={{
                fontSize: SIZES.medium,
                fontFamily: FONT.bold
              }}
              btnStyle={{
                marginBottom: 20
              }}
            />
            {/* <AppBtn 
              handlePress={() => {
                router.push('/unauth/create-account')
              }}
              isText={true}
              btnTitle={'Sign up'} 
              btnWidth={'80%'} 
              btnHeight={60} 
              btnBgColor={'white'}
              btnTextStyle={{
                fontSize: SIZES.medium,
                fontFamily: FONT.bold,
                color: COLORS.primary
              }}
            /> */}
          </View>

          <View
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 70
            }}
          >
            <View style={styles.separator}/>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                marginHorizontal: 20
              }}
            >
              <Text style={{color: 'black', fontFamily: FONT.medium, fontSize: SIZES.small}}>or sign up</Text>
              <Text style={{color: 'black', fontFamily: FONT.medium, fontSize: SIZES.small}}>with</Text>
            </View>
            <View style={styles.separator}/>
          </View>

          <View style={styles.socialContainer}>
            <AppBtn
              handlePress={() => router.back()}
              isImage={true}
              iconUrl={icons.FBIcon}
              dimension={45}
            />
            <AppBtn
              handlePress={() => router.back()}
              isImage={true}
              iconUrl={icons.googleIcon}
              dimension={45}
            />
            <AppBtn
              handlePress={() => router.back()}
              isImage={true}
              iconUrl={icons.appleIcon}
              dimension={45}
            />
          </View>

          <View
            style={{
              backgroundColor: 'transparent',
              width: '100%', height: 'auto',
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', flexDirection: 'row',
              gap: 20, marginTop: 80
            }}
          >
            <Text 
              onPress={() => console.log('terms')}
              style={{
                color: COLORS.primary, 
                fontFamily: FONT.regular, 
                fontSize: SIZES.medium
              }}
            >Terms of use</Text>
            <Text
              onPress={() => console.log('policy')}
              style={{
                color: COLORS.primary, 
                fontFamily: FONT.regular, 
                fontSize: SIZES.medium
              }}
            >Privacy Policy</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    justifyContent: 'center',
    height: height
  },
  logoContainer: {
    width: '100%',
    height: '20%',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  container: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center"
  },
  backBtnContainer: {
    backgroundColor: 'transparent',
    width: width,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 15,
    marginTop: Platform.select({ios: 25, android: 60}),
    marginBottom: 50
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '40%',
    backgroundColor: COLORS.gray2
  },
  socialContainer: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
    backgroundColor: 'transparent'
  }
});

export default SignUpPage;