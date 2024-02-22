import React, { useEffect, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, SafeAreaView, ScrollView } from '../../components/Themed';
import AppBtn from '../../components/common/button/AppBtn';
import { useRouter } from 'expo-router';
import { COLORS, FONT, SIZES } from '../../constants';
import AppInput from '../../components/AppInput/AppInput';
import { Formik } from 'formik';
import * as Yup from "yup";
import { storeData } from '../../components/LocalStorage/LocalStorage';
import useAppDispatch from '../../hook/useAppDispatch';
import useAppSelector from '../../hook/useAppSelector';
import { isUserExistAction } from '../../store/actions/authActions';
import { clearUserExistStatus } from '../../store/reducers/authReducer';
import Snackbar from '../../helpers/Snackbar';

const { width } = Dimensions.get('window');

const accountWithEmail = Yup.object().shape({
    email: Yup.string().email().required().label("Email"),
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

const CreateAccount = () => {
    const router = useRouter();
    const [agree, setAgree] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const dispatch = useAppDispatch();
    const authReducer = useAppSelector(state => state.authReducer);

    const handleSubmit = async (values: any) => {
        const payload = {
            ...values,
            email: values.email.toLowerCase()
        }

        dispatch(isUserExistAction({email: payload.email}))
        storeData('user-data', JSON.stringify(payload))
    }

    useEffect(() => {
        if(authReducer.userExistStatus === 'completed') {
            router.push('/unauth/verification')
            dispatch(clearUserExistStatus())
        } else if(authReducer.userExistStatus === 'failed') {
            setIsError(true)
            setError(authReducer.userExistError)
            dispatch(clearUserExistStatus())
        }

    },[authReducer.userExistStatus]);

    return (
        <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <Text
                            style={{
                                fontFamily: FONT.bold,
                                fontSize: SIZES.large,
                                color: 'black',
                                marginTop: 20
                            }}
                        >
                            Create account
                        </Text>

                        <Formik
                            initialValues={{ email: '', password: '', confirmPassword: '' }}
                            validationSchema={accountWithEmail}
                            onSubmit={(values) => {
                                handleSubmit(values)
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View style={styles.formContainer}>
                                    <AppInput
                                        placeholder={'Your email'}
                                        hasPLaceHolder={true}
                                        placeholderTop={'Email'}
                                        value={values.email.trim()}
                                        style={{
                                            width: 80/100 * width
                                        }}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        error={errors.email}
                                        touched={touched.email}
                                        showError={true}
                                    />
                                    <AppInput
                                        placeholder='Password'
                                        hasPLaceHolder={true}
                                        placeholderTop='Password'
                                        value={values.password}
                                        style={{
                                            width: 80/100 * width
                                        }}
                                        secureTextEntry={true}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        error={errors.password}
                                        touched={touched.password}
                                        showError={true}
                                    />
                                    <AppInput
                                        placeholder='Confirm password'
                                        hasPLaceHolder={true}
                                        placeholderTop='Confirm password'
                                        value={values.confirmPassword}
                                        style={{
                                            width: 80/100 * width
                                        }}
                                        secureTextEntry={true}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                        error={errors.confirmPassword}
                                        touched={touched.confirmPassword}
                                        showError={true}
                                    />

                                    <View style={styles.agreeBtn}>
                                        <TouchableOpacity
                                            onPress={() => setAgree(!agree)}
                                        >
                                            {agree ? (
                                                <View style={styles.agree}>
                                                    <View 
                                                        style={{
                                                            width: 14,
                                                            height: 14,
                                                            borderRadius: 6,
                                                            backgroundColor: COLORS.primary
                                                        }}
                                                    />
                                                </View>
                                            ) : (
                                                <View style={styles.disagree} />
                                            )}
                                        </TouchableOpacity>

                                        <Text
                                            style={{
                                                fontFamily: FONT.medium,
                                                fontSize: 14,
                                                color: COLORS.tertiary
                                            }}
                                        >I accept the terms and privacy policy</Text>
                                    </View>

                                    <View
                                        style={{
                                            backgroundColor: 'transparent',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <AppBtn
                                            handlePress={() => {
                                                agree ? handleSubmit() : null
                                            }}
                                            isText={true}
                                            btnTitle={'Sign up'} 
                                            btnWidth={'100%'} 
                                            btnHeight={60} 
                                            btnBgColor={agree ? COLORS.primary : "#6e4244"}
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
                                                alignItems: 'center'
                                            }}
                                            spinner={authReducer.userExistStatus === 'loading'}
                                            spinnerColor='white'
                                            spinnerStyle={{
                                                marginLeft: 10
                                            }}
                                            isDisabled={(
                                                !agree 
                                                || errors.email !== undefined
                                                || errors.password !== undefined
                                                || errors.confirmPassword !== undefined
                                                || values.email === ''
                                                || values.password === ''
                                                || values.confirmPassword === ''
                                            ) ? true : false}
                                        />
                                    </View>
                                </View>
                            )}
                        </Formik>

                        <View
                            style={{
                                backgroundColor: 'transparent',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: FONT.medium,
                                    fontSize: 14,
                                    color: COLORS.tertiary
                                }}
                            >Already have an account?</Text>
                            <Text
                                onPress={() => {
                                    router.push('/unauth/login')}}
                                style={{
                                    fontFamily: FONT.bold,
                                    fontSize: 14,
                                    color: COLORS.primary,
                                    marginLeft: 2
                                }}
                            >Sign In</Text>
                        </View>
                        
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <Snackbar
                isVisible={isError} 
                message={error}
                onHide={() => setIsError(false)}
                type='error'
            />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        width: width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 80
    },
    agreeBtn: {
        backgroundColor: 'transparent',
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20
    },
    backBtnContainer: {
        backgroundColor: 'transparent',
        width: width,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: 15,
        marginTop: 25,
        marginBottom: 10
    },
    formContainer: {
        display: 'flex',
        gap: 20,
        marginTop: 40
    },
    agree: {
        width: 20,
        height: 18,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.3,
        borderColor: COLORS.primary,
        borderRadius: 5,
        backgroundColor: 'transparent',
    },
    disagree: {
        width: 20,
        height: 18,
        borderWidth: 0.3,
        borderColor: COLORS.tertiary,
        borderRadius: 5,
        backgroundColor: 'transparent',
    }
})

export default CreateAccount;