import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, Dimensions, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import AppBtn from "../../components/common/button/AppBtn";
import { COLORS, FONT, SIZES, icons } from "../../constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import OTPTextView from 'react-native-otp-textinput';
import useAppSelector from "../../hook/useAppSelector";
import { sendSignUpTokenAction, signUpAction, validateSignUpTokenAction } from "../../store/actions/authActions";
import useAppDispatch from "../../hook/useAppDispatch";
import { clearSendSignUpTokenStatus, clearSignUpStatus, clearValidateSignUpTokenStatus } from "../../store/reducers/authReducer";
import { removeData } from "../../components/LocalStorage/LocalStorage";

const { width, height } = Dimensions.get('window');

const TokenPage = () => {
    const router = useRouter();
    const [otp, setOtp] = useState<string>('');
    const [count, setCount] = useState<number>(120);
    const { user_data } = useLocalSearchParams();
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string>('');
    const userData = JSON.parse(user_data as any);

    const dispatch = useAppDispatch();
    const authReducer = useAppSelector(state => state.authReducer);

    const otpRef = useRef<any>(null);

    const handleOtp = () => {
        dispatch(validateSignUpTokenAction({token: otp}))
    };

    const formatTime = (time: any) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        if(otp.length === 4) {
            handleOtp()
        }
    },[otp]);

    useEffect(() => {
        const intervalId = setTimeout(() => {
            if (count > 0) {
              setCount(count - 1);
            }
          }, 1000);
      
          return () => {
            clearTimeout(intervalId);
          };
    },[count]);

    useEffect(() => {
        if(authReducer.sendSignUpTokenStatus === 'completed') {
            setCount(120)
            setStatus('success')
        } else if(authReducer.sendSignUpTokenStatus === 'failed') {
            setStatus('failed')
            setError(authReducer.sendSignUpTokenError)
        }
        
        return () => {
            dispatch(clearSendSignUpTokenStatus());
            setTimeout(() => {
                setStatus('')
            },5000);
        }
    }, [authReducer.sendSignUpTokenStatus]);

    useEffect(() => {
        if(authReducer.validateSignUpTokenStatus === 'completed') {
            dispatch(signUpAction(userData));
            dispatch(clearValidateSignUpTokenStatus());
        } else if(authReducer.validateSignUpTokenStatus === 'failed') {
            setStatus('failed')
            setError(authReducer.validateSignUpTokenError)
            dispatch(clearValidateSignUpTokenStatus());
        }
        
        return () => {
            setTimeout(() => {
                setStatus('')
            },5000);
        }
    }, [authReducer.validateSignUpTokenStatus, dispatch]);

    useEffect(() => {
        if(authReducer.signUpStatus === 'completed') {
            router.push('/auth/gender')
            removeData('user_data')
            dispatch(clearSignUpStatus());
        } else if(authReducer.signUpStatus === 'failed') {
            setStatus('failed')
            setError(authReducer.signUpError)
            dispatch(clearSignUpStatus());
        }
        
        return () => {
            setTimeout(() => {
                setStatus('')
            },5000);
        }
    }, [authReducer.signUpStatus]);

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
                            fontFamily: FONT.bold,
                            color: 'black',
                            fontSize: SIZES.xxLarge,
                            marginTop: 60
                        }}
                    >
                        {formatTime(count)}
                    </Text>
                    <Text
                        style={{
                            alignSelf: 'center',
                            color: COLORS.tertiary,
                            fontFamily: FONT.regular,
                            fontSize: SIZES.medium,
                            marginTop: 10
                        }}
                    >
                        Type the verification code
                    </Text>
                    <Text
                        style={{
                            alignSelf: 'center',
                            color: COLORS.tertiary,
                            fontFamily: FONT.regular,
                            fontSize: SIZES.medium
                        }}
                    >
                       we’ve sent you
                    </Text>

                    <View style={styles.tokenContainer}>
                        <OTPTextView
                            ref={otpRef}
                            textInputStyle={{
                                height: 60,
                                width: 60, 
                                borderWidth: 1,
                                borderRadius: 10
                            }}
                            tintColor={COLORS.primary}
                            handleTextChange={(otp) => setOtp(otp)}
                            inputCount={4}
                            keyboardType="numeric"
                            autoFocus
                        />
                    </View>
                    <Text
                        onPress={() => {
                            setOtp('')
                            dispatch(sendSignUpTokenAction({phone: userData.phone}))
                        }}
                        style={{
                            alignSelf: 'center',
                            color: COLORS.primary,
                            fontFamily: FONT.bold,
                            fontSize: SIZES.medium,
                            marginTop: 100,
                            marginBottom: 50
                        }}
                        // disabled={count > 1}
                    >Send again</Text>
                </View>
                {(authReducer.signUpStatus === 'loading' || authReducer.validateSignUpTokenStatus === 'loading')
                && (<ActivityIndicator size="large" color={'black'} />)}
                {status !== '' && (<Text
                    style={{
                        color: status === 'success' ? '#006600' : '#FF4C4C',
                        alignSelf: 'center',
                        marginTop: 20,
                        fontFamily: FONT.regular,
                        fontSize: 14
                    }}
                >
                    {status === 'failed' ? error : 'A token has been sent to your phone.'}
                </Text>)}
            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    tokenContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        marginTop: 60
    },
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backBtnContainer: {
        backgroundColor: 'transparent',
        width: width,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: 15,
        marginTop: 35,
        marginBottom: -10
    },
})

export default TokenPage;