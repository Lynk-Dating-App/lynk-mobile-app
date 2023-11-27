import React, { FC } from "react";
import { Text } from "../Themed";
import { StyleSheet } from "react-native";
import { FONT, SIZES } from "../../constants";

interface IProps {
  text: string;
  style?: any;
  onClick?: any
}
const InputHeader: FC<IProps> = ({ text, style, onClick }) => {
  return (
    <Text
      onPress={onClick}
      style={[styles.text, style]}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
    text: {
        fontSize: SIZES.medium,
        fontFamily: FONT.medium,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        color: 'black',
        marginBottom: 8
    }
})

export default InputHeader;