import React from 'react'
import { TouchableOpacity, Image, ActivityIndicator } from 'react-native'

import styles from './ButtonStyle.style'
import { Text } from '../../Themed'

interface IProps {
  iconUrl?: any,
  dimension?: number,
  handlePress?: any,
  isText?: boolean,
  isImage?: boolean,
  btnTitle?: string,
  btnTextStyle?: any,
  btnWidth?: any,
  btnHeight?: any,
  btnBgColor?: string,
  btnStyle?: any,
  spinner?: boolean,
  spinnerSize?: any,
  spinnerColor?: string,
  spinnerStyle?: any,
  isDisabled?: boolean
}

const AppBtn = ({ 
  iconUrl, dimension, 
  handlePress, isText = false,
  isImage = false,
  btnTitle, btnTextStyle, btnStyle,
  btnWidth, btnHeight, btnBgColor, spinner = false,
  spinnerColor, spinnerSize, spinnerStyle, isDisabled = false
}: IProps) => {
  return (
    //@ts-ignore
    <TouchableOpacity style={[styles.btnContainer(btnWidth, btnHeight, btnBgColor), btnStyle]} onPress={handlePress}
      disabled={spinner || isDisabled}
    >
      {isImage && (<Image 
        source={iconUrl}
        resizeMode='cover'
        //@ts-ignore
        style={styles.btnImg(dimension)}
      />)}
      {isText && (<Text style={[btnTextStyle, {color: 'white'}]}>{btnTitle}</Text>)}
      {spinner && (
        <ActivityIndicator size={spinnerSize} color={spinnerColor} style={spinnerStyle} />
      )}
    </TouchableOpacity>
  )
}

export const AppBtn2 = ({ 
  iconUrl, dimension, 
  handlePress, isText = false,
  isImage = false,
  btnTitle, btnTextStyle, btnStyle,
  btnWidth, btnHeight, btnBgColor, spinner = false,
  spinnerColor, spinnerSize, spinnerStyle, isDisabled = false
}: IProps) => {
  return (
    //@ts-ignore
    <TouchableOpacity style={[styles.btnContainer(btnWidth, btnHeight, btnBgColor), btnStyle]} onPress={handlePress}
      disabled={spinner || isDisabled}
    >
      {isImage && (<Image 
        source={iconUrl}
        resizeMode='cover'
        //@ts-ignore
        style={styles.btnImg(dimension)}
      />)}
      {isText && (<Text style={[btnTextStyle]}>{btnTitle}</Text>)}
      {spinner && (
        <ActivityIndicator size={spinnerSize} color={spinnerColor} style={spinnerStyle} />
      )}
    </TouchableOpacity>
  )
}

export default AppBtn