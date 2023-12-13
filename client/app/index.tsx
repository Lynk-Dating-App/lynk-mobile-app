import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import { SafeAreaView, ScrollView, Text, View } from '../components/Themed';
import { useRouter } from 'expo-router';
import AppBtn from '../components/common/button/AppBtn';
import { COLORS, FONT, SIZES, images } from '../constants';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { getTokenFromSecureStore } from '../components/ExpoStore/SecureStore';
import settings from '../config/settings';

const { width, height } = Dimensions.get('window');

const imageUri1 = Image.resolveAssetSource(images.guy1).uri;
const imageUri2 = Image.resolveAssetSource(images.girl2).uri;
const imageUri3 = Image.resolveAssetSource(images.girl3).uri;

const imagesArray = [
  { id: 1, uri: imageUri1 },
  { id: 2, uri: imageUri2 },
  { id: 3, uri: imageUri3 }
];

export default function IntroScreen() {
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const router = useRouter();

  const renderImage = ({ item }: any) => {
    return (
    <View key={item.id} style={{
      backgroundColor: 'transparent'
    }}>
      <Image source={{ uri: item.uri }} style={styles.image} />
    </View>
  )};

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const jwtToken = await getTokenFromSecureStore(settings.auth.admin);
        if(!!jwtToken) router.push('/(tabs)/one')
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.imgContainer}>
            <Carousel
              data={imagesArray}
              renderItem={renderImage}
              sliderWidth={400}
              itemWidth={250}
              firstItem={1}
              onSnapToItem={(index) => setActiveSlide(index)}
            />
          </View>
          <Text 
            style={{
              color: COLORS.primary,
              fontFamily: FONT.bold,
              fontSize: SIZES.xLarge,
              marginTop: 20,
              marginBottom: 10
            }}
          >Algorithm</Text>
          <View 
            style={{
              marginBottom: 5, 
              backgroundColor: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text 
              style={{
                color: COLORS.tertiary,
                fontFamily: FONT.light,
                fontSize: 14
              }}
            >Users going through a vetting process to</Text>
            <Text 
              style={{
                color: COLORS.tertiary,
                fontFamily: FONT.light,
                fontSize: 14
              }}
            >ensure you never match with bots.</Text>
          </View>

          <View style={styles.paginationContainer}>
            <Pagination
              dotsLength={imagesArray.length}
              activeDotIndex={activeSlide}
              dotStyle={styles.paginationDot}
              inactiveDotStyle={styles.paginationDotInactive}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
          <AppBtn 
            handlePress={() => router.push('/unauth/sign-up')}
            isText={true}
            btnTitle={'Create Account'} 
            btnWidth={'60%'} 
            btnHeight={50} 
            btnBgColor={COLORS.primary}
            btnTextStyle={{
              fontSize: SIZES.medium,
              fontFamily: FONT.regular
            }}
          />
          <View
            style={styles.bottomTextContainer}
          >
            <Text 
              style={{
                color: COLORS.tertiary,
                fontFamily: FONT.light,
                fontSize: SIZES.small
              }}
            >Already have an account? </Text>
            <Text 
              onPress={() => router.push('/unauth/login')}
              style={{
                color: COLORS.primary,
                fontFamily: FONT.bold,
                fontSize: SIZES.small
              }}
            >Sign In</Text>
          </View>
          
        </View>
          {/* <Link href="/sign-up" asChild>
            <Pressable>
              {({ pressed }) => (
                  <FontAwesome
                      name="info-circle"
                      size={25}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
              )}
            </Pressable>
          </Link> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    width: width,
    height: height
  },
  imgContainer: {
    width: '100%', 
    height: '50%', 
    backgroundColor: 'transparent',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  bottomTextContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginTop: 5,
    marginBottom: 30
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  paginationContainer: {
    paddingVertical: 5,
    backgroundColor: 'transparent'
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  paginationDotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.tertiary,
  }
});
