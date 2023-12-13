import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "../../../components/Themed";
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, FONT, SIZES } from "../../../constants";
import { Formik } from "formik";
import AppInput, { Select } from "../../../components/AppInput/AppInput";
import AppBtn from "../../../components/common/button/AppBtn";
import useAppDispatch from "../../../hook/useAppDispatch";
import useAppSelector from "../../../hook/useAppSelector";
import * as Yup from "yup";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import useVarious from "../../../hook/useVarious";
import { clearAddJobStatus, clearChangeJobStatus } from "../../../store/reducers/userReducer";
import Snackbar from "../../../helpers/Snackbar";
import ReusableModal from "../../../components/Modal/ReusableModal";
import { capitalizeEachWord } from "../../../Utils/Generic";
import { addJobAction } from "../../../store/actions/userAction";
import { changeJobAction } from "../../../store/actions/userAction";
import { getUserAction } from "../../../store/actions/userAction";

const { width } = Dimensions.get('window');

export default function JobDescription () {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const { jobsData } = useVarious();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const userReducer = useAppSelector(state => state.userReducer);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        if(userReducer.addJobStatus === 'completed') {
          setModalVisible(false);
          setIsSuccess(true)
          setSuccess(userReducer.addJobSuccess)
    
          intervalId = setTimeout(() => {
            setIsSuccess(false)
            setSuccess('')
            setModalVisible(false);
          },6000);
          dispatch(clearAddJobStatus())

        } else if(userReducer.addJobStatus === 'failed') {
          setIsError(true)
          setError(userReducer.addJobError)
          intervalId = setTimeout(() => {
            setIsError(false)
            setError('')
          },6000);
          dispatch(clearAddJobStatus())
        }
    
        return () => {
          clearInterval(intervalId);
        }
    },[userReducer.addJobStatus]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        if(userReducer.changeJobStatus === 'completed') {
            dispatch(getUserAction(userReducer.loggedInuser?._id))
            dispatch(clearChangeJobStatus())
            router.push('/(tabs)/four')
        } else if(userReducer.changeJobStatus === 'failed') {
            setIsError(true)
            setError(userReducer.changeJobError)

            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000);
            dispatch(clearChangeJobStatus())
        }
    
        return () => {
          clearInterval(intervalId);
        }
    },[userReducer.changeJobStatus]);

    useEffect(() => {
        const intervalId = setTimeout(() => {
            setError('')
            setSuccess('')
        },6000);

        return () => {
            clearInterval(intervalId);
        }
    },[error, success])

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{
                    display: 'flex', 
                    paddingTop: Platform.select({android: 20, ios: 0}),
                    height: 'auto'
                }}
            >
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior='padding'
                >
                    <View
                        style={{
                            display: 'flex',
                            justifyContent: "flex-start",
                            alignItems: 'flex-start',
                            marginTop: 20,
                            marginLeft: 20,
                            marginBottom: 40
                        }}
                    >
                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPress={() => {
                            router.back()}}
                        >
                            <FontAwesome
                                name='angle-left'
                                size={20}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                alignSelf: 'center',
                                fontFamily: FONT.extraBold,
                                fontSize: SIZES.large,
                                marginTop: 10
                            }}
                        >Job Description</Text>
                    </View>
                    <Formik
                        initialValues={{ 
                            jobType: userReducer.loggedInuser.jobType || '',
                            jobDescription: userReducer.loggedInuser.jobDescription || ''
                        }}
                        validationSchema={
                            Yup.object().shape({
                                jobType: Yup.string().required().label("job type"),
                                jobDescription: Yup.string().required().label("job description"),
                            })
                        }
                        onSubmit={(values: any) => {
                            dispatch(changeJobAction(values))
                        }}
                    >
                        {({ handleChange, handleSubmit, values, errors, touched }) => (
                            <View style={styles.formContainer}>
                                <View 
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                {Array.isArray(jobsData) && (
                                    <Select
                                        data={jobsData}
                                        onValueChange={handleChange('jobType')}
                                        value={values.jobType}
                                        hasPLaceHolder={true}
                                        placeholderTop='Job Type'
                                        headerStyle={{
                                            fontFamily: FONT.semiBold,
                                            fontSize: SIZES.small,
                                            marginLeft: 5,
                                            color: COLORS.gray
                                        }}
                                        showSelectError={false}
                                        selectError={errors.jobType}
                                        placeholderLabel='Select an occupation...'
                                    />)}
                                    <View
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-start',
                                            width: 90/100 * width,
                                            flexDirection: 'row',
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        <Text
                                            style={{
                                            fontFamily: FONT.regular,
                                            fontSize: SIZES.small,
                                            color: COLORS.gray,
                                            marginLeft: 10
                                            }}
                                        >If your occupation is not in the list, click on </Text>
                                        <Text
                                            onPress={() => setModalVisible(true)}
                                            style={{
                                                fontFamily: FONT.extraBold,
                                                fontSize: SIZES.small,
                                                color: COLORS.primary,
                                                marginLeft: 10
                                            }}
                                        >add occupation</Text>
                                    </View>
                                </View>
                                <AppInput
                                    placeholder={''}
                                    hasPLaceHolder={true}
                                    placeholderTop={'Job Description'}
                                    value={values.jobDescription}
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.small,
                                        marginLeft: 30,
                                        color: COLORS.gray
                                    }}
                                    style={{
                                        width: 90/100 * width,
                                        height: 150,
                                        borderColor: errors.jobDescription ? 'red' : COLORS.gray2
                                    }}
                                    errorTextStyle={{
                                        marginLeft: 10
                                    }}
                                    onChangeText={handleChange('jobDescription')}
                                    multiline={true}
                                    showError={false}
                                    error={errors.jobDescription}
                                    touched={touched.jobDescription}
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
                                        marginTop: 20,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center'
                                    }}
                                    spinner={userReducer.changeJobStatus === 'loading'}
                                    spinnerColor='white'
                                    spinnerStyle={{
                                        marginLeft: 10
                                    }}
                                />
                            </View>
                        )}
                    </Formik>
                    {Platform.OS === 'ios' && (<Text
                            style={{
                                alignSelf: 'center',
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium,
                                color: 'green',
                                textAlign: 'center',
                                width: '80%'
                            }}
                        >{success}</Text>)}
                </KeyboardAvoidingView>
            </ScrollView>

            {modalVisible && (<ReusableModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderTopStartRadius:20,
                    borderTopEndRadius:20,
                    borderBottomStartRadius:20,
                    borderBottomEndRadius:20,
                    width: '90%',
                    height: Platform.select({android: '70%', ios: '60%'})
                }}
                animationViewStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={{
                        display: 'flex', 
                        paddingTop: Platform.select({android: 20, ios: 0}), 
                        height: 'auto'
                    }}
                >
                    <KeyboardAvoidingView
                        style={{flex: 1}}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row',
                                marginBottom: 30
                            }}
                        >
                            <Text
                                style={{
                                fontFamily: FONT.extraBold,
                                fontSize: SIZES.large,
                                }}
                            >Add occupation</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <FontAwesome
                                    name="close"
                                    size={30}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                        </View>
                        <Formik
                            initialValues={{ 
                                name: ''
                            }}
                            validationSchema={
                                Yup.object().shape({
                                name: Yup.string().required().label("job type")
                                })
                            }
                            onSubmit={(values: any) => {
                                const payload = {
                                    name: capitalizeEachWord(values.name)
                                }
                                dispatch(addJobAction(payload))
                            }}
                        >
                            {({ handleChange, handleSubmit, values, errors, touched }) => (
                                <View style={styles.formContainer}>
                                    <AppInput
                                        placeholder={''}
                                        hasPLaceHolder={true}
                                        placeholderTop={'Job Name'}
                                        value={values.jobType}
                                        style={{
                                            width: '95%',
                                            borderColor: errors.jobType ? 'red' : COLORS.gray2
                                        }}
                                        headerStyle={{
                                            fontFamily: FONT.semiBold,
                                            fontSize: SIZES.medium,
                                            marginLeft: 10,
                                            color: COLORS.gray
                                        }}
                                        errorTextStyle={{
                                            marginLeft: 1
                                        }}
                                        onChangeText={handleChange('name')}
                                        error={errors.jobType}
                                        touched={touched.jobType}
                                        showError={false}
                                    />
                                    <AppBtn
                                        handlePress={() => handleSubmit()}
                                        isText={true}
                                        btnTitle={'Save'} 
                                        btnWidth={'95%'} 
                                        btnHeight={60} 
                                        btnBgColor={COLORS.primary}
                                        btnTextStyle={{
                                            fontSize: SIZES.medium,
                                            fontFamily: FONT.bold
                                        }}
                                        btnStyle={{
                                            marginBottom: 20,
                                            marginTop: 40,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center'
                                        }}
                                        spinner={userReducer.addJobStatus === 'loading'}
                                        spinnerColor='white'
                                        spinnerStyle={{
                                            marginLeft: 10
                                        }}
                                    />
                                </View>
                            )}
                        </Formik>
                        {Platform.OS === 'ios' && (<Text
                            style={{
                                alignSelf: 'center',
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium,
                                color: 'red'
                            }}
                        >{error}</Text>)}
                    </KeyboardAvoidingView>
                </ScrollView>
            </ReusableModal>)}

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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        gap: 20,
        marginBottom: 50
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        borderWidth: 0.3,
        borderColor: COLORS.gray2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
})