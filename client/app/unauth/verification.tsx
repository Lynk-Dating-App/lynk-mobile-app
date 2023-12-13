import React, { useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import AppBtn from "../../components/common/button/AppBtn";
import { useRouter } from "expo-router";
import { COLORS, FONT, SIZES, icons } from "../../constants";
import { retrieveData, storeData } from "../../components/LocalStorage/LocalStorage";
import { Phone } from "../../components/AppInput/AppInput";
import useAppDispatch from "../../hook/useAppDispatch";
import useAppSelector from "../../hook/useAppSelector";
import { clearSendSignUpTokenStatus } from "../../store/reducers/authReducer";
import { sendSignUpTokenAction } from "../../store/actions/authActions";
import Snackbar from "../../helpers/Snackbar";

const { width, height } = Dimensions.get('window');

const Verification = () => {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [formattedValue, setFormattedValue] = useState("");
    const [sendSignUpTokenError, setSendSignUpTokenError] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [userData, setUserData] = useState<any>(null)

    const dispatch = useAppDispatch();
    const authReducer = useAppSelector(state => state.authReducer);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await retrieveData('user-data');
            if (data) {
                const userData = JSON.parse(data)
                setData(userData);
            }
          } catch (error) {
            console.error(error);
            // Handle the error (e.g., show an error message)
          }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        const phone = formattedValue.startsWith('+') && (formattedValue.replace('+', ''))
        
        const payload = {
            ...data,
            phone
        }

        setUserData(JSON.stringify(payload))
        storeData('user-data', JSON.stringify(payload))

    },[formattedValue]);

    useEffect(() => {
        if(authReducer.sendSignUpTokenStatus === 'completed') {
            dispatch(clearSendSignUpTokenStatus());
            router.push({pathname: '/unauth/token-page', params: {user_data: userData}})
        } else if(authReducer.sendSignUpTokenStatus === 'failed') {
            setSendSignUpTokenError(true)
            setError(authReducer.sendSignUpTokenError)
            dispatch(clearSendSignUpTokenStatus());
        }
        
    }, [authReducer.sendSignUpTokenStatus]);

    return (
        <SafeAreaView style={{width: width, height: height, backgroundColor: 'transparent'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.backBtnContainer}>
                    <AppBtn
                        handlePress={() => router.back()}
                        isImage={true}
                        iconUrl={icons.backBtn}
                        dimension={35}
                    />
                </View>
                <View style={styles.container}>
                    <Text
                        style={{
                            fontFamily: FONT.extraBold,
                            fontSize: SIZES.xxLarge,
                            color: 'black',
                            marginTop: 70
                        }}
                    >
                        Enter mobile
                    </Text>
                    <Text
                        style={{
                            fontFamily: FONT.regular,
                            fontSize: SIZES.medium,
                            color: COLORS.tertiary
                        }}
                    >
                        {`Please enter your valid phone number. We will send you a 4-digit code to verify your account.`} 
                    </Text>
                    <Phone 
                        setFormattedValue={setFormattedValue}
                        containerStyle={styles.containerStyle}
                        textContainerStyle={styles.textContainerStyle}
                    />
                    <AppBtn
                        handlePress={() => {
                            dispatch(sendSignUpTokenAction({phone: formattedValue}))
                        }}
                        isText={true}
                        btnTitle={'Continue'} 
                        btnWidth={'100%'} 
                        btnHeight={60} 
                        btnBgColor={COLORS.primary}
                        btnTextStyle={{
                            fontSize: SIZES.medium,
                            fontFamily: FONT.bold
                        }}
                        btnStyle={{
                            marginBottom: Platform.select({android: 20, ios: 60}),
                            marginTop: 100,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        spinner={authReducer.sendSignUpTokenStatus === 'loading'}
                        spinnerColor='white'
                        spinnerStyle={{
                            marginLeft: 10
                        }}
                    />
                </View>
                <Snackbar 
                    isVisible={sendSignUpTokenError} 
                    message={error}
                    onHide={() => setSendSignUpTokenError(false)}
                    type='error'
                />
            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        paddingHorizontal: 20
    },
    backBtnContainer: {
        backgroundColor: 'transparent',
        width: width,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: 15,
        marginTop: Platform.select({ android: 45, ios: 25}),
        marginBottom: -10
    },
    containerStyle: {
        borderWidth: 0.3,
        borderColor: COLORS.gray2,
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 55,
        backgroundColor: 'transparent',
        width: '100%',
        marginTop: 30
    },
    textContainerStyle: {
        backgroundColor: 'transparent',
    }
})

export default Verification;