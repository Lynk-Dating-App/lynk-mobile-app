import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AppBtn from '../components/common/button/AppBtn';
import { COLORS, FONT, SIZES, icons } from '../constants';
import { Provider } from "react-redux";
import store from '../store';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { retrieveData, storeData } from '../components/LocalStorage/LocalStorage';
import axiosClient from '../config/axiosClient';
import settings from '../config/settings';

const LOCATION_TASK_NAME = 'background-location-task';
const BACKGROUND_FETCH_TASK = 'background-fetch-task';
const API_ROOT = settings.api.rest;

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    // Handle error if any
    return;
  }
  if (data) {
    const { locations }: any = data;
    // Process the location data here
    console.log('Background location:', locations[0].coords.latitude, locations[0].coords.longitude);
    // Save the location data to the database
    await axiosClient.put(`${API_ROOT}/update-user-location`, {
      latitude: locations[0].coords.latitude,
      longitude: locations[0].coords.longitude
    });
  }
});

// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//   if (error) {
//     // Handle error if any
//     return;
//   }
//   if (data) {
//     const { locations }: any = data;
//     storeData('lastLocation', JSON.stringify(locations))
//     console.log('Background location:', locations[0].coords.latitude, locations[0].coords.longitude);
//   }

//   return BackgroundFetch.BackgroundFetchResult.NewData;
// });

// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async ({ error }) => {
//   if (error) {
//     console.error('Background fetch task error:', error);
//     return;
//   }
//   console.log('location task name send loc')
//   const storedLocationString = await retrieveData('lastLocation') 
//   if(storedLocationString) {
//     const storedLocation = JSON.parse(storedLocationString)
//     console.log(storedLocation, 'stored locations')

//     await axiosClient.put(`${API_ROOT}/update-user-location`, {
//       latitude: storedLocation[0].coords.latitude,
//       longitude: storedLocation[0].coords.longitude
//     });
//   }

//   // Return a successful result
//   return BackgroundFetch.BackgroundFetchResult.NewData;
// });

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ManropeBold: require('../assets/fonts/Manrope-Bold.ttf'),
    ManropeExtraBold: require('../assets/fonts/Manrope-ExtraBold.ttf'),
    ManropeExtraLight: require('../assets/fonts/Manrope-ExtraLight.ttf'),
    ManropeLight: require('../assets/fonts/Manrope-Light.ttf'),
    ManropeMedium: require('../assets/fonts/Manrope-Medium.ttf'),
    ManropeRegular: require('../assets/fonts/Manrope-Regular.ttf'),
    ManropeSemiBold: require('../assets/fonts/Manrope-SemiBold.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <Stack>
          <Stack.Screen name="index" options={{ 
            headerShown: false,
          }}/>
          <Stack.Screen name="(tabs)"
            options={{ 
              headerShown: false,
              headerTitle: '',
              headerShadowVisible: false,
              headerStyle: { backgroundColor: COLORS.lightWhite },
            }} 
          />
          <Stack.Screen 
            name="auth/modals/match" 
            options={{ 
              // presentation: 'fullScreenModal', 
              headerShown: false,
              contentStyle: { 
                margin: 0, 
                padding: 0, }
            }}
          />
          <Stack.Screen name="unauth/sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="unauth/create-account"
            options={{ 
              headerShown: true, 
              headerTitle: '',
              headerStyle: { backgroundColor: COLORS.lightWhite },
              headerShadowVisible: false,
              headerLeft: () => (
                <AppBtn
                  handlePress={() => router.back()}
                  isImage={true}
                  iconUrl={icons.backBtn}
                  dimension={35}
                />
            ),
            }} 
          />
          <Stack.Screen name="unauth/login" options={{ headerShown: false }} />
          <Stack.Screen name="unauth/verification" options={{ headerShown: false }} />
          <Stack.Screen name="unauth/token-page" options={{ headerShown: false }} />
          <Stack.Screen name="auth/gender" options={{ headerShown: false }} />
          <Stack.Screen name="auth/interests" options={{ headerShown: false }} />
          <Stack.Screen name="auth/profile-detail" 
            options={{
              headerShown: true, 
              headerTitle: '',
              headerStyle: { backgroundColor: COLORS.lightWhite },
              headerShadowVisible: false,
              headerLeft: () => (
                <AppBtn
                  handlePress={() => router.back()}
                  isImage={true}
                  iconUrl={icons.backBtn}
                  dimension={35}
                />
            ),
            }} 
          />
          <Stack.Screen name="auth/about" 
            options={{ 
              headerShown: true, 
              headerTitle: '',
              headerStyle: { backgroundColor: COLORS.lightWhite },
              headerShadowVisible: false,
              headerLeft: () => (
                <AppBtn
                  handlePress={() => router.back()}
                  isImage={true}
                  iconUrl={icons.backBtn}
                  dimension={35}
                />
            ),
            }} 
          />
          <Stack.Screen name="auth/gallery" options={{ headerShown: false }} />
          <Stack.Screen name="auth/notification" options={{ headerShown: false }} />
          <Stack.Screen name="auth/single-user" options={{ headerShown: false }} />
          <Stack.Screen name="auth/notifications" options={{ headerShown: false }} />
          <Stack.Screen name="auth/single-notification" options={{ headerShown: false }} />
          <Stack.Screen 
            name="auth/modals/chatMessageScreen" 
            options={{ 
              presentation: 'fullScreenModal', 
              headerShown: false,
              contentStyle: { 
                margin: 0, 
                padding: 0, }
            }}
          />
          <Stack.Screen 
            name="auth/modals/planScreen" 
            options={{ 
              presentation: 'modal',
              contentStyle: { 
                margin: 0, 
                padding: 0, },
              headerShown: true,
              headerShadowVisible: false,
              headerTitle: '',
              headerTitleStyle: {
                fontFamily: FONT.bold,
                fontSize: SIZES.xLarge,
              },
              headerLeft: () => (
                <AppBtn
                  handlePress={() => router.back()}
                  isImage={true}
                  iconUrl={icons.backBtn}
                  dimension={35}
                  btnStyle={{
                    marginTop: 20
                  }}
                />
              ),
            }}
          />
          <Stack.Screen name="auth/favourites" 
            options={{ 
              headerShown: true, 
              headerTitle: '',
              headerStyle: { backgroundColor: COLORS.lightWhite },
              headerShadowVisible: false,
              headerLeft: () => (
                <AppBtn
                  handlePress={() => router.back()}
                  isImage={true}
                  iconUrl={icons.backBtn}
                  dimension={35}
                />
            ),
            }} 
          />
          <Stack.Screen name="auth/edit-user-detail" 
            options={{ 
              headerShown: true, 
              headerTitle: '',
              headerStyle: { backgroundColor: COLORS.lightWhite },
              headerShadowVisible: false,
              headerLeft: () => (
                <AppBtn
                  handlePress={() => router.back()}
                  isImage={true}
                  iconUrl={icons.backBtn}
                  dimension={35}
                />
            ),
            }} 
          />
          <Stack.Screen 
            name="auth/modals/job-description" 
            options={{ 
              presentation: 'modal', 
              headerShown: false,
              contentStyle: { 
                margin: 0, 
                padding: 0
              }
            }}
          />
          <Stack.Screen 
            name="auth/modals/partnerPreference" 
            options={{ 
              presentation: 'modal', 
              headerShown: false,
              contentStyle: { 
                margin: 0, 
                padding: 0
              }
            }}
          />
          <Stack.Screen name="auth/billing" 
            options={{ 
              headerShown: true, 
              headerTitle: '',
              headerStyle: { backgroundColor: COLORS.lightWhite },
              headerShadowVisible: false,
              headerLeft: () => (
                <AppBtn
                  handlePress={() => router.back()}
                  isImage={true}
                  iconUrl={icons.backBtn}
                  dimension={35}
                />
            ),
            }} 
          />
          <Stack.Screen name="auth/privacy-security" 
            options={{ 
              headerShown: true, 
              headerTitle: '',
              headerStyle: { backgroundColor: COLORS.lightWhite },
              headerShadowVisible: false,
              headerLeft: () => (
                <AppBtn
                  handlePress={() => router.back()}
                  isImage={true}
                  iconUrl={icons.backBtn}
                  dimension={35}
                />
            ),
            }} 
          />
        </Stack>
      </Provider>
    </ThemeProvider>
  );
}
