import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import AuthHOC from '../../components/Protected/AuthHOC';
import { COLORS } from '../../constants';
import { Text, View } from '../../components/Themed';

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

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary, //Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
        }
      }}
    >
      
      <Tabs.Screen
        name="one"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="sticky-note" color={color} />,
          headerLeft: () => (
            <Text>Discovery</Text>
            
            // <Link href="/modal" asChild>
            //   <Pressable>
            //     {({ pressed }) => (
            //       <FontAwesome
            //         name="info-circle"
            //         size={25}
            //         color={'black'}
            //         style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            //       />
            //     )}
            //   </Pressable>
            // </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />
        }}
      />
    </Tabs>
  );
}

export default AuthHOC(TabLayout)
