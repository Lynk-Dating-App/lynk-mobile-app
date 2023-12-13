import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "../Themed";
import { Dimensions, TextInput, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";
import InputHeader from "../InputHeader/InputHeader";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import PhoneInput from "react-native-phone-number-input";
import RNPickerSelect from 'react-native-picker-select';

const { width } = Dimensions.get('window');

interface IAppInputProps {
    placeholderTop: string;
    hasPLaceHolder: boolean;
    placeholder: string;
    value?: any;
    onChangeText?: any;
    className?: any;
    type?: string;
    disabled?: boolean
    name?: any
    onBlur?: any
    min?: string;
    keyboardType?: any;
    autoCapitalize?: any;
    autoCorrect?: boolean;
    multiline?: boolean;
    editable?: boolean;
    style?: any;
    maxLength?: any;
    returnKeyType?: any;
    leftImg?: any;
    secureTextEntry?: boolean;
    touched?: any;
    error?: any;
    headerStyle?: any;
    errorTextStyle?: any;
    showError?: boolean;
    onSubmitEditing?: any;
    showPassIconStyle?: any;
}

interface IPhoneProps {
  setFormattedValue: any,
  containerStyle?: any,
  textContainerStyle?: any,
  formattedValue?: string
}

interface SelectProps {
  onValueChange: any;
  value: any;
  data: any;
  style?: any;
  hasPLaceHolder: boolean,
  placeholderTop: string,
  headerStyle?: any,
  selectError?: any,
  showSelectError?: boolean,
  selectWidth?: any,
  placeholder?: any,
  placeholderLabel: string
}

const AppInput = ({
  placeholderTop,
  hasPLaceHolder,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  multiline = false,
  editable = true,
  style,
  maxLength,
  returnKeyType,
  onBlur,
  secureTextEntry = false,
  touched, error,
  headerStyle, errorTextStyle,
  showError = true,
  onSubmitEditing,
  showPassIconStyle
}: IAppInputProps) => {

  const [pwdfield, setPwdfield] = useState(false);
  const togglePassword = (e: any, _: any) => {
      e.preventDefault();

      setPwdfield((state) => !state);
  };

  useEffect(() => {
    if(secureTextEntry) {
      setPwdfield(true)
    }
  },[secureTextEntry])

  return (
    <View style={{backgroundColor: 'transparent'}}>
      {hasPLaceHolder && <InputHeader text={placeholderTop} style={headerStyle} />}

      <View style={styles.container}>
        <TextInput
          onBlur={onBlur}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          editable={editable}
          style={[styles.textField, style]}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          secureTextEntry={pwdfield ? true : false}
          onSubmitEditing={onSubmitEditing}
        />
          {secureTextEntry && (
            <TouchableOpacity onPress={(e) => togglePassword(e, !pwdfield)}
              style={[{
                position: 'absolute', 
                alignSelf: 'flex-end'
              }, showPassIconStyle]}
            >
              {pwdfield ? (
                <FontAwesome
                    name="eye-slash"
                    size={20}
                    color={'#333333'}
                />
                ) : (
                  <FontAwesome
                    name="eye"
                    size={20}
                    color={'#333333'}
                  />
              )}
            </TouchableOpacity>
          )}
      </View>
      {touched && error && showError ? (<Text style={[styles.errorText, errorTextStyle]}>{error}</Text>) : null}
    </View>
  );
};

export const Phone = ({
  setFormattedValue, 
  containerStyle, 
  textContainerStyle
}: IPhoneProps) => {
  const [value, setValue] = useState("");
  const phoneInput = useRef<PhoneInput>(null);

  return (
    <>
      <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="NG"
        layout="first"
        onChangeText={(text) => {
          setValue(text);
        }}
        onChangeFormattedText={(text) => {
          setFormattedValue(text);
        }}
        withDarkTheme={false}
        withShadow={false}
        autoFocus
        containerStyle={containerStyle}
        textContainerStyle={textContainerStyle}
      />
    </>
  )
}

export const Select = ({
  onValueChange, 
  value, data,
  hasPLaceHolder,
  placeholderTop,
  headerStyle,
  selectError,
  showSelectError = true,
  selectWidth = 90/100 * width,
  placeholderLabel,
  style
}: SelectProps) => {

  const placeholder = {
    label: placeholderLabel,
    value: placeholderLabel,
    color: '#9EA0A4',
  };
  return (
    <View
      style={[{
        backgroundColor: 'transparent',
        paddingLeft: 5
      }, style]}
    >
      {hasPLaceHolder && <InputHeader text={placeholderTop} style={headerStyle} />}
      <RNPickerSelect
        onValueChange={onValueChange}
        items={data}
        itemKey={value}
        value={value}
        placeholder={placeholder}
        style={{
          inputAndroid: {
            height: 55,
            fontFamily: FONT.regular,
            borderWidth: 0.3,
            borderColor: selectError ? 'red' : COLORS.gray2,
            borderRadius: 15,
            paddingHorizontal: 10,
            width: selectWidth,
            backgroundColor: "#fafafc"
          },
          inputIOS: {
            height: 55,
            fontFamily: FONT.regular,
            borderWidth: 0.3,
            borderColor: selectError ? 'red' : COLORS.gray2,
            borderRadius: 15,
            paddingHorizontal: 10,
            width: selectWidth,
            backgroundColor: "#fafafc"
          }
        }}

        // Icon={() => <FontAwesome name="chevron-down" size={24} color="black" />}
      />
      {selectError && showSelectError ? (<Text style={[styles.errorText]}>{selectError}</Text>) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  errorText: {
    fontFamily: FONT.regular,
    color: 'red',
    fontSize: SIZES.small
  },
  textField: {
    height: 55,
    fontFamily: FONT.regular,
    borderWidth: 0.3,
    borderColor: COLORS.gray2,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginRight: -10,
    backgroundColor: '#fafafc'
  },
  container: {
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  }
})

  export default AppInput;