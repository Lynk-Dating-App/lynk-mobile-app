//@ts-nocheck
import { StyleSheet } from "react-native";

import { SIZES } from "../../../constants";

const styles = StyleSheet.create({
  btnContainer: (btnWidth, btnHeight, btnBgColor) => ({
    width: btnWidth,
    height: btnHeight,
    backgroundColor: btnBgColor,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  }),
  btnImg: (dimension) => ({
    width: dimension,
    height: dimension,
    borderRadius: SIZES.small / 1.25,
  }),
});

export default styles;