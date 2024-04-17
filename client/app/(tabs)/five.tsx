import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import tw from 'twrnc';
import { ActivityIndicator, ImageBackground } from "react-native";
import { COLORS, FONT, SIZES, images } from "../../constants";
import { Image } from "react-native";
import TabOneScreen from "./one";
import { useFocusEffect } from "expo-router";
import useAppDispatch from "../../hook/useAppDispatch";
import { setWhichScreen } from "../../store/reducers/userReducer";

export default function TabFourScreen() {
    const [isloading, setIsloading] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setIsloading(true);
    },[]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if(isloading) {
            intervalId = setTimeout(() => {
                setIsloading(false)
            }, 5000)
        }

        return() => {
            clearInterval(intervalId)
        }
    },[isloading]);

    useFocusEffect(
        useCallback(() => {
         dispatch(setWhichScreen('fifth'))
      },[])
    );

    return (
        <SafeAreaView style={{flex: 1}}>
            {isloading && (<ImageBackground
                source={images.reyes}
                style={[{
                    flex: 1,
                }, tw`flex justify-center items-center`]}
            >
                <Text
                    style={{
                        fontFamily: FONT.bold,
                        fontSize: SIZES.large,
                        marginBottom: 10,
                        color: 'white'
                    }}
                >Welcome to</Text>
                <Image
                    source={images.Reyes_text}
                    style={{
                        width: 150,
                        height: 60,
                        marginBottom: 30
                    }}
                />
                <ActivityIndicator color='white' size="small"/>
            </ImageBackground>)}
            {!isloading && (
            <View
                style={[{
                    flex: 1,
                }, tw`flex justify-center items-center`]}
            >
                <Text
                    style={{
                        fontFamily: FONT.bold,
                        fontSize: SIZES.large,
                        marginBottom: 10,
                        color: COLORS.primary
                    }}
                >Coming Soon</Text>
                {/* <TabOneScreen /> */}
            </View>)}
        </SafeAreaView>
    )
}