import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Image, useColorScheme } from 'react-native';
import AuthHOC from '../../components/Protected/AuthHOC';
import { COLORS, FONT, SIZES, icons } from '../../constants';
import { Text, View } from '../../components/Themed';
import useAppSelector from '../../hook/useAppSelector';
import useAppDispatch from '../../hook/useAppDispatch';
import { findUserChatsAction } from '../../store/actions/userAction';
import socket from '../../config/socket';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) 
{
  return <FontAwesome size={28} style={{ marginBottom: -20 }} {...props} />;
}

const TabLayout = () => {
  const colorScheme = useColorScheme();
  const userReducer = useAppSelector(state => state.userReducer);
  const dispatch = useAppDispatch();

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

  return (
    <Tabs
      screenOptions={({ route }) => ({
        gestureEnabled: false,
        tabBarActiveTintColor: COLORS.primary, //Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#ADAFBB',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F3F3F3'
        }
      })}
    >
      
      <Tabs.Screen
        name="one"
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) => {
            return focused ? (
              <View style={{
                backgroundColor: 'transparent',
                borderTopColor: COLORS.primary,
                borderTopWidth: 1, 
                height: '100%', width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <Image
                  source={icons.cards1}
                  style={{
                    width: 28,
                    height: 28,
                    marginTop: 15
                  }}
                />
              </View>
            ) : (
              <View style={{
                backgroundColor: 'transparent',
                height: '100%', width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <Image
                  source={icons.cards2}
                  style={{
                    width: 28,
                    height: 28,
                    marginTop: 15
                  }}
                />
              </View>
            )
          },
          headerLeft: () => (
            <Text>Discovery</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) => {
            return focused ? (
              <View style={{
                backgroundColor: 'transparent',
                borderTopColor: COLORS.primary,
                borderTopWidth: 1, 
                height: '100%', width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <TabBarIcon name="heart" color={color} />
              </View>
            ) : (
              <View style={{
                backgroundColor: 'transparent',
                height: '100%', width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <TabBarIcon name="heart" color={color} />
              </View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: '',
          tabBarBadge: userReducer.countUnreadMessages > 20 ? `${userReducer.countUnreadMessages}+` : userReducer.countUnreadMessages,
          tabBarBadgeStyle: {
            height: 20,
            marginTop: 7,
            marginLeft: -5,
            borderWidth: 2,
            borderColor: userReducer.countUnreadMessages === 0 ? 'transparent' : COLORS.white,
            fontFamily: FONT.bold,
            fontSize: SIZES.small,
            alignSelf: 'center',
            color: userReducer.countUnreadMessages === 0 ? 'transparent' : COLORS.white,
            backgroundColor: userReducer.countUnreadMessages === 0 ? 'transparent' : 'red',
          },
          tabBarIcon: ({ focused, color }) => {
            return focused ? (
              <View style={{
                backgroundColor: 'transparent',
                borderTopColor: COLORS.primary,
                borderTopWidth: 1, 
                height: '100%', width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <TabBarIcon name="comments" color={color} />
              </View>
            ) : (
              <View style={{
                backgroundColor: 'transparent',
                height: '100%', width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <TabBarIcon name="comments" color={color} />
              </View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) => {
            return focused ? (
              <View style={{
                backgroundColor: 'transparent',
                borderTopColor: COLORS.primary,
                borderTopWidth: 1, 
                height: '100%', width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <TabBarIcon name="user" color={color} />
              </View>
            ) : (
              <View style={{
                backgroundColor: 'transparent',
                height: '100%', width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <TabBarIcon name="user" color={color} />
              </View>
            )
          }
        }}
      />
       <Tabs.Screen
        name="five"
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) => {
            return focused ? (
              <View style={{
                backgroundColor: 'transparent',
                borderTopColor: COLORS.primary,
                borderTopWidth: 1, 
                height: '100%', width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <TabBarIcon name="chrome" color={color} />
              </View>
            ) : (
              <View style={{
                backgroundColor: 'transparent',
                height: '100%', width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <TabBarIcon name="chrome" color={color} />
              </View>
            )
          }
        }}
      />
    </Tabs>
  );
}

export default AuthHOC(TabLayout)