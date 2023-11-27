/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import React from 'react';
import { 
  Text as DefaultText, 
  useColorScheme, 
  View as DefaultView,
  SafeAreaView as DefaultSafeAreaView,
  ScrollView as DefaultScrollView
} from 'react-native';

import Colors from '../constants/Colors';
import { COLORS } from '../constants';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type SafeAreaViewProps = ThemeProps & DefaultSafeAreaView['props'];
export type ScrollViewProps = ThemeProps & DefaultScrollView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: 'black', dark: 'black' }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: 'transparent', dark: 'transparent' }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function SafeAreaView(props: SafeAreaViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: 'transparent', dark: 'transparent' }, 'background');

  return <DefaultSafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: 'transparent', dark: 'transparent' }, 'background');

  return <DefaultScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}
