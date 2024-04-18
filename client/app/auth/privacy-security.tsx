import { Alert, Animated, Dimensions, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import tw from 'twrnc'
import useUser from "../../hook/useUser";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { COLORS, FONT, SIZES } from "../../constants";
import AppInput, { Phone } from "../../components/AppInput/AppInput";
import ReusableModal from "../../components/Modal/ReusableModal";
import AppBtn from "../../components/common/button/AppBtn";
import useAppSelector from "../../hook/useAppSelector";
import useAppDispatch from "../../hook/useAppDispatch";
import { changePasswordAction, updateUserEmailPhoneAction } from "../../store/actions/userAction";
import { useNavigation, useRouter } from "expo-router";
import { clearChangePasswordStatus, clearUpdateUserEmailPhoneStatus } from "../../store/reducers/userReducer";
import { removeTokenFromSecureStore, saveTokenToSecureStore } from "../../components/ExpoStore/SecureStore";
import settings from "../../config/settings";
import Snackbar from "../../helpers/Snackbar";
import { Formik } from "formik";
import * as Yup from "yup";
import { getTokenFromSecureStore } from "../../components/ExpoStore/SecureStore";
import * as LocalAuthentication from 'expo-local-authentication';

const { width } = Dimensions.get("window");
const schema = Yup.object().shape({
    currentPassword: Yup.string()
        .matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/,
            'Password does not meet requirement.'
        )
        .required('Password is required')
        .label('Current Password'),
    password: Yup.string()
        .matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/,
            'Password does not meet requirement.'
        )
        .required('Password is required')
        .label('Password'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Confirm password and password do not match ')
        .required('Confirm password is required')
        .label('Confirm Password'),
});

export default function PrivacySecurity () {
    const [formattedValue, setFormattedValue] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [showEmail, setShowEmail] = useState<boolean>(false);
    const [changePhone, setChangePhone]= useState<boolean>(false);
    const [changeEmail, setChangeEmail]= useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');
    const [changePassword, setChangePassword] = useState<boolean>(false);
    const [activateBiometric, setActivateBiometric] = useState<boolean>(false);
    const [biometricId, setBiometricId] = useState<string>('');
    const [biometricStatus, setBiometricStatus] = useState<string>('');
    const [isBiometricSuccess, setIsBiometricSuccess] = useState<boolean>(false);
    const { getState } = useNavigation();
    const screenName = getState().routes.at(-1)?.name;

    const router = useRouter();
    const userReducer = useAppSelector(state => state.userReducer);
    const dispatch = useAppDispatch();

    const { user } = useUser();

    const handleChangePhone = () => {
        const phone = formattedValue.startsWith('+') && (formattedValue.replace('+', ''));

        dispatch(updateUserEmailPhoneAction({ phone: phone }));
    };

    const handleChangeEmail = () => {
        dispatch(updateUserEmailPhoneAction({ email: email.toLowerCase() }));
    };

    const handleLogout = async () => {
        await removeTokenFromSecureStore(settings.auth.admin);
        router.push('/unauth/login')
    }

    const fallBackToDefaultAuth = () => {
        console.log('fall back to password auth')
    }

    const alertComponent = (title: string, mess: string, btnTxt: string, btnFunc: any) => {
        return Alert.alert(title, mess, [
            {
                text: btnTxt,
                onPress: btnFunc
            }
        ]);
    };

    const handleSendIdToKeychain = async () => {
        setBiometricStatus("loading")
        // check if hardware supports biometric
        const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
  
        //fallback to default auth method (pass) if biometric is not available
        if(!isBiometricAvailable)
            return alertComponent(
                'You cannot use this feature',
                'Biometric Auth not Supported',
                'Ok',
                () => fallBackToDefaultAuth()
            );
  
            // check biometric types available (fingerprint, facial, iris recognition)
            let supportedBiometrics: any;
            if(isBiometricAvailable)
                supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync()
  
            // check biometric are saved locally in users device
            const savedBiometrics = await LocalAuthentication.isEnrolledAsync()
            if(!savedBiometrics)
                return alertComponent(
                    'Biometric record not found',
                    'Kindly enroll a biometric record and attempt the action once more.',
                    'Ok',
                    () => fallBackToDefaultAuth()
                );
  
            //authenthenticate with biometric
            const biometricAuth = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login with biometric',
                cancelLabel: 'cancel',
                disableDeviceFallback: true
            })
  
            //Log the user in on success
            if(biometricAuth) {
                if(biometricId === null) {
                    saveTokenToSecureStore(process.env.EXPO_PUBLIC_BIOMETRIC_LOGIN_KEY, userReducer.loggedInuser?._id)
                    setBiometricStatus("completed")
                } else {
                    removeTokenFromSecureStore(process.env.EXPO_PUBLIC_BIOMETRIC_LOGIN_KEY)
                    setBiometricStatus("completed")
                }
            }
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(biometricStatus === "completed") {

            setIsBiometricSuccess(true)
            setBiometricStatus("Successful.")

            intervalId = setTimeout(() => {
                setIsBiometricSuccess(false)
                setBiometricStatus("")
            },6000)
        }

        return () => {
            clearInterval(intervalId);
        }
    },[biometricStatus])

    useEffect(() => {
        const checkToken = async () => {
            const id = await getTokenFromSecureStore(process.env.EXPO_PUBLIC_BIOMETRIC_LOGIN_KEY);
            setBiometricId(id)
        }
        
        checkToken()
    },[biometricStatus]);
console.log(error, isError, 'err')
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(userReducer.updateUserEmailPhoneStatus === 'completed') {
            setChangeEmail(false)
            setChangePhone(false)
            handleLogout()
            dispatch(clearUpdateUserEmailPhoneStatus());
        } else if(userReducer.updateUserEmailPhoneStatus === 'failed') {

            setIsError(true)
            setError(userReducer.updateUserEmailPhoneError)
        
            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000);

            dispatch(clearUpdateUserEmailPhoneStatus());
        }

        return () => {
            clearInterval(intervalId);
        }
    },[userReducer.updateUserEmailPhoneStatus]);

    useEffect(() => {
        const phone = user?.phone.replace('234', '0')
        setEmail(user?.email)
        setPhone(phone)
    },[user]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(userReducer.changePasswordStatus === 'completed') {

            setChangePassword(false)

            setIsSuccess(true)
            setSuccess(userReducer.changePasswordSuccess)
        
            intervalId = setTimeout(() => {
                setIsSuccess(false)
                setSuccess('')
            },6000);

            dispatch(clearChangePasswordStatus())
        } else if(userReducer.changePasswordStatus === 'failed') {
            setIsError(true)
            setError(userReducer.changePasswordError)
        
            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000);
            dispatch(clearChangePasswordStatus())
        }

        return () => {
            clearInterval(intervalId);
        }
    },[userReducer.changePasswordStatus]);

    return (
        <SafeAreaView style={{flex: 1}}>
            <View 
                style={[styles.container, tw`mx-5 my-5`]}
            >
                <View style={[tw`flex justify-center flex-col`]}>
                    <View style={[{width: width}, tw`flex justify-center flex-col`]}>
                        <Text
                            style={{
                                fontFamily: FONT.extraBold,
                                fontSize: SIZES.xLarge,
                                marginBottom: 20
                            }}
                        >
                            Privacy & Security
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false}
                            style={styles.subContainer}>
                                <View style={[{}, tw`flex justify-start flex-row mb-2`]}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowEmail(!showEmail)
                                        }}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: '90%'
                                        }}
                                    >
                                        <View
                                            style={[{width: '100%'}, tw`flex justify-between flex-row`]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: FONT.semiBold,
                                                    fontSize: 18,
                                                    color: showEmail ? COLORS.gray2 : 'black',
                                                    alignSelf: 'flex-start'
                                                }}
                                            >Edit email or phone number</Text>
                                            <FontAwesome
                                                name={showEmail ? 'minus' : 'plus'}
                                                size={15}
                                                style={tw`mt-1.5`}
                                            />
                                        </View>
                                        {!showEmail && (<Text
                                            style={{
                                                fontFamily: FONT.regular,
                                                fontSize: 14,
                                                color: COLORS.gray,
                                                alignSelf: 'flex-start'
                                            }}
                                        >
                                            {`Change your email and password here.`}
                                        </Text>)}
                                    </TouchableOpacity>
                                </View>
                               {showEmail && (<View
                                    style={styles.subWrapper}
                                >
                                    <View style={tw`flex flex-col justify-start`}>
                                        <AppInput
                                            placeholder={""}
                                            hasPLaceHolder={true}
                                            placeholderTop={'Email'}
                                            value={email}
                                            style={{
                                                width: '90%',
                                                borderColor: COLORS.gray2,
                                                alignSelf: 'flex-start'
                                            }}
                                            headerStyle={{
                                                fontFamily: FONT.semiBold,
                                                fontSize: SIZES.medium,
                                                color: COLORS.gray
                                            }}
                                            errorTextStyle={{
                                                marginLeft: 1
                                            }}
                                            showError={false}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setChangeEmail(true)}
                                        >
                                            <Text
                                                style={[{
                                                    fontFamily: FONT.bold,
                                                    color: COLORS.primary
                                                }, tw`mb-6 mt-1`]}
                                            >Change email</Text>
                                        </TouchableOpacity>
                                        
                                        <AppInput
                                            placeholder={""}
                                            hasPLaceHolder={true}
                                            placeholderTop={'Phone'}
                                            value={phone}
                                            style={{
                                                width: "90%",
                                                borderColor: COLORS.gray2,
                                                alignSelf: 'flex-start'
                                            }}
                                            headerStyle={{
                                                fontFamily: FONT.semiBold,
                                                fontSize: SIZES.medium,
                                                color: COLORS.gray
                                            }}
                                            errorTextStyle={{
                                            marginLeft: 1
                                            }}
                                            showError={false}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setChangePhone(true)}
                                        >
                                            <Text
                                                style={[{
                                                    fontFamily: FONT.bold,
                                                    color: COLORS.primary
                                                }, tw`mb-6 mt-1`]}
                                            >Change phone</Text>
                                        </TouchableOpacity>
                                        
                                    </View>
                                </View>)}

                                <View style={{height: 0.3, width: '90%', backgroundColor: COLORS.gray2, marginVertical: 10}}/>

                                <View style={tw`flex justify-start flex-row mt-2 mb-2`}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setChangePassword(!changePassword)
                                        }}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: '90%'
                                        }}
                                    >
                                        <View
                                            style={[{width: '100%'}, tw`flex justify-between flex-row`]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: FONT.semiBold,
                                                    fontSize: 18,
                                                    color: changePassword ? COLORS.gray2 : 'black'
                                                }}
                                            >Change password</Text>
                                            <FontAwesome
                                                name={changePassword ? 'minus' : 'plus'}
                                                size={15}
                                                style={tw`mt-1.5`}
                                            />
                                        </View>
                                        {!changePassword && (<Text
                                            style={{
                                                fontFamily: FONT.regular,
                                                fontSize: 14,
                                                color: COLORS.gray,
                                                alignSelf: 'flex-start'
                                            }}
                                        >
                                            {`Change your account password.`}
                                        </Text>)}
                                    </TouchableOpacity>
                                </View>
                                {changePassword && (<View
                                    style={styles.subWrapper}
                                >
                                    <Formik
                                        initialValues={{ currentPassword: '', password: '', confirmPassword: '' }}
                                        validationSchema={schema}
                                        onSubmit={(values) => dispatch(changePasswordAction(values))}
                                    >
                                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                            <View style={tw`flex flex-col justify-start gap-2 w-[90%]`}>
                                                <AppInput
                                                    placeholder='Current password'
                                                    hasPLaceHolder={true}
                                                    placeholderTop=''
                                                    value={values.currentPassword}
                                                    style={{
                                                        width: "100%",
                                                        alignSelf: 'flex-start'
                                                    }}
                                                    showPassIconStyle={{
                                                        paddingRight: 10
                                                    }}
                                                    secureTextEntry={true}
                                                    onChangeText={handleChange('currentPassword')}
                                                    onBlur={handleBlur('currentPassword')}
                                                    error={errors.currentPassword}
                                                    touched={touched.currentPassword}
                                                />
                                                <AppInput
                                                    placeholder='New password'
                                                    hasPLaceHolder={true}
                                                    placeholderTop=''
                                                    value={values.password}
                                                    style={{
                                                        width: "100%",
                                                        alignSelf: 'flex-start'
                                                    }}
                                                    showPassIconStyle={{
                                                        paddingRight: 10
                                                    }}
                                                    secureTextEntry={true}
                                                    onChangeText={handleChange('password')}
                                                    onBlur={handleBlur('password')}
                                                    error={errors.password}
                                                    touched={touched.password}
                                                />
                                                <AppInput
                                                    placeholder='Confirm password'
                                                    hasPLaceHolder={true}
                                                    placeholderTop=''
                                                    value={values.confirmPassword}
                                                    style={{
                                                        width: "100%",
                                                        alignSelf: 'flex-start'
                                                    }}
                                                    showPassIconStyle={{
                                                        paddingRight: 10
                                                    }}
                                                    secureTextEntry={true}
                                                    onChangeText={handleChange('confirmPassword')}
                                                    onBlur={handleBlur('confirmPassword')}
                                                    error={errors.confirmPassword}
                                                    touched={touched.confirmPassword}
                                                />
                                                <AppBtn
                                                    handlePress={() => handleSubmit()}
                                                    isText={true}
                                                    btnTitle={'Save'} 
                                                    btnWidth={'90%'} 
                                                    btnHeight={60} 
                                                    btnBgColor={COLORS.primary}
                                                    btnTextStyle={{
                                                        fontSize: SIZES.medium,
                                                        fontFamily: FONT.bold
                                                    }}
                                                    btnStyle={{
                                                        marginBottom: 20,
                                                        marginTop: 20,
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        alignSelf: 'center'
                                                    }}
                                                    spinner={userReducer.changePasswordStatus === 'loading'}
                                                    spinnerColor='white'
                                                    spinnerStyle={{
                                                        marginLeft: 10
                                                    }}
                                                />
                                            </View>
                                        )}
                                    </Formik>
                                </View>)}

                                <View style={{height: 0.5, width: '90%', backgroundColor: COLORS.gray2, marginVertical: 10}}/>

                                <View style={tw`flex justify-start flex-row mt-2 mb-10`}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setActivateBiometric(!activateBiometric)
                                        }}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: '90%'
                                        }}
                                    >
                                        <View
                                            style={[{width: '100%'}, tw`flex justify-between flex-row`]}
                                        >
                                        <Text
                                            style={{
                                                fontFamily: FONT.semiBold,
                                                fontSize: 18,
                                                color: activateBiometric ? COLORS.gray2 : 'black'
                                            }}
                                        >Activate login with biometric</Text>
                                        <FontAwesome
                                            name={activateBiometric ? 'minus' : 'plus'}
                                            size={15}
                                            style={tw`mt-1.5`}
                                        />
                                        </View>
                                        {!activateBiometric && (<Text
                                            style={{
                                                fontFamily: FONT.regular,
                                                fontSize: 14,
                                                color: COLORS.gray,
                                                alignSelf: 'flex-start'
                                            }}
                                        >
                                            {`Enable biometric authentication, and subsequently log in using the registered facial or fingerprint recognition on your device.`}
                                        </Text>)}
                                    </TouchableOpacity>
                                </View>
                                {activateBiometric && (<View
                                    style={styles.subWrapper}
                                >
                                    <Text
                                        style={{
                                            fontFamily: FONT.semiBold,
                                            fontSize: 14,
                                            color: COLORS.tertiary,
                                            // alignSelf: 'flex-start',
                                            textAlign: 'left',
                                            width: '90%'
                                        }}
                                    >
                                        {`This will allow you to sign in using either the facial recognition or fingerprint authentication registered on your device. You have the option to deactivate it at any time.`}
                                    </Text>
                                    <AppBtn
                                        handlePress={() => handleSendIdToKeychain()}
                                        isText={true}
                                        btnTitle={biometricId === null ? 'Activate' : 'Deactivate'} 
                                        btnWidth={'50%'} 
                                        btnHeight={60} 
                                        btnBgColor={biometricId === null ? 'green' : 'red'}
                                        btnTextStyle={{
                                            fontSize: SIZES.medium,
                                            fontFamily: FONT.bold
                                        }}
                                        btnStyle={{
                                            marginBottom: 20,
                                            marginTop: 30,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'flex-start'
                                        }}
                                        spinner={userReducer.changePasswordStatus === 'loading'}
                                        spinnerColor='white'
                                        spinnerStyle={{
                                            marginLeft: 10
                                        }}
                                    />
                                </View>)}

                                <TouchableOpacity
                                    style={[{
                                        backgroundColor: "white",
                                        width: '90%',
                                        borderRadius: 10,
                                        height: 50,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        paddingLeft: 10,
                                        marginBottom: 5,
                                        marginLeft: 2,
                                        borderColor: COLORS.gray2,
                                        elevation: 5, // Android shadow
                                        shadowColor: '#000', // iOS shadow
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 2,
                                    }]}
                                    onPress={handleLogout}
                                >
                                    <Text
                                        style={{
                                            color: 'red',
                                            fontFamily: FONT.bold,
                                            fontSize: SIZES.medium
                                        }}
                                    >
                                        Signout
                                    </Text>
                                </TouchableOpacity>

                                <ReusableModal
                                    modalVisible={changeEmail}
                                    setModalVisible={setChangeEmail}
                                    style={{
                                        backgroundColor: 'white',
                                        padding: 20,
                                        borderRadius: 20,
                                        height: 300
                                    }}
                                    animationViewStyle={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: 'transparent',
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'flex-end'
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFormattedValue("")
                                                setChangeEmail(false)
                                            }}
                                        >
                                            <FontAwesome
                                                name="close"
                                                size={20}
                                                color={COLORS.primary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: 'transparent',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flex: 1
                                        }}
                                    >
                                        <Text 
                                            style={{
                                                color: 'black',
                                                fontFamily: FONT.bold,
                                                fontSize: SIZES.medium,
                                                alignSelf: 'center',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Enter a new email.
                                        </Text>
                                        <Text 
                                            style={{
                                                color: 'red',
                                                fontFamily: FONT.light,
                                                fontSize: SIZES.small,
                                                alignSelf: 'center',
                                                textAlign: 'center',
                                                width: '80%',
                                                marginBottom: 10
                                            }}
                                        >
                                            Please note: you would be logged out and required to log in again.
                                        </Text>
                                        
                                        <AppInput
                                            placeholder={""}
                                            hasPLaceHolder={true}
                                            placeholderTop={''}
                                            value={email}
                                            style={{
                                                width: 80/100 * width,
                                                borderColor: COLORS.gray2,
                                                alignSelf: 'flex-start'
                                            }}
                                            headerStyle={{
                                                fontFamily: FONT.semiBold,
                                                fontSize: SIZES.medium,
                                                color: COLORS.gray
                                            }}
                                            errorTextStyle={{
                                            marginLeft: 1
                                            }}
                                            showError={false}
                                            onChangeText={(text: string) => setEmail(text)}
                                        />
                                        
                                        <AppBtn
                                            handlePress={handleChangeEmail}
                                            isText={true}
                                            btnTitle={'Send'} 
                                            btnWidth={'80%'} 
                                            btnHeight={60} 
                                            btnBgColor={COLORS.primary}
                                            btnTextStyle={{
                                                fontSize: SIZES.medium,
                                                fontFamily: FONT.bold
                                            }}
                                            btnStyle={{
                                                marginBottom: 10,
                                                marginTop: 30,
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                            spinner={userReducer.updateUserEmailPhoneStatus === 'loading'}
                                            spinnerColor='white'
                                            spinnerStyle={{
                                                marginLeft: 10
                                            }}
                                        />
                                    </View>
                                    
                                </ReusableModal>

                                <ReusableModal
                                    modalVisible={changePhone}
                                    setModalVisible={setChangePhone}
                                    style={{
                                        backgroundColor: 'white',
                                        padding: 20,
                                        borderRadius: 20,
                                        height: 300,
                                        width: 350
                                    }}
                                    animationViewStyle={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: 'transparent',
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'flex-end'
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFormattedValue("")
                                                setChangePhone(false)
                                            }}
                                        >
                                            <FontAwesome
                                                name="close"
                                                size={20}
                                                color={COLORS.primary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: 'transparent',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flex: 1
                                        }}
                                    >
                                        <Text 
                                            style={{
                                                color: 'black',
                                                fontFamily: FONT.regular,
                                                fontSize: 14,
                                                alignSelf: 'center',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Enter a new phone number.
                                        </Text>
                                        <Text 
                                            style={{
                                                color: 'red',
                                                fontFamily: FONT.light,
                                                fontSize: SIZES.small,
                                                alignSelf: 'center',
                                                textAlign: 'center',
                                                width: '80%',
                                                marginBottom: 10
                                            }}
                                        >
                                            Please note: you would be logged out and required to log in again.
                                        </Text>
                                        <Phone
                                            setFormattedValue={setFormattedValue}
                                            containerStyle={styles.containerStyle}
                                            textContainerStyle={styles.textContainerStyle}
                                        />
                                        
                                        <AppBtn
                                            handlePress={handleChangePhone}
                                            isText={true}
                                            btnTitle={'Send'} 
                                            btnWidth={'80%'} 
                                            btnHeight={60} 
                                            btnBgColor={COLORS.primary}
                                            btnTextStyle={{
                                                fontSize: SIZES.medium,
                                                fontFamily: FONT.bold
                                            }}
                                            btnStyle={{
                                                marginBottom: 10,
                                                marginTop: 30,
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                            spinner={userReducer.updateUserEmailPhoneStatus === 'loading'}
                                            spinnerColor='white'
                                            spinnerStyle={{
                                                marginLeft: 10
                                            }}
                                        />
                                    </View>
                                    
                                </ReusableModal>

                                <Snackbar
                                    isVisible={isError} 
                                    message={error}
                                    onHide={() => setIsError(false)}
                                    type='error'
                                />
                                <Snackbar
                                    isVisible={isSuccess} 
                                    message={success}
                                    onHide={() => setIsSuccess(false)}
                                    type='success'
                                />
                                <Snackbar
                                    isVisible={isBiometricSuccess} 
                                    message={biometricStatus}
                                    onHide={() => setIsBiometricSuccess(false)}
                                    type='success'
                                />
                                
                        </ScrollView>
                    </View>
                    
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: 'auto',
        width: width
    },
    subContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: 10,
    },
    subWrapper: {
        display: 'flex',
        height: 'auto',
        paddingHorizontal: 10,
        marginTop: 20,
        paddingBottom: 20
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