import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed"
import { Alert, Dimensions, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants';
import { Formik } from 'formik';
import * as Yup from "yup";
import AppInput, { Select } from '../../components/AppInput/AppInput';
import AppBtn from '../../components/common/button/AppBtn';
import { useRouter } from 'expo-router';
import useVarious from '../../hook/useVarious';
import { stateLga } from '../../constants/states';
import { removeData, retrieveData } from '../../components/LocalStorage/LocalStorage';
import useAppDispatch from '../../hook/useAppDispatch';
import useAppSelector from '../../hook/useAppSelector';
import { clearSignInStatus, clearUpdateProfileDetailStatus } from '../../store/reducers/authReducer';
import { updateProfileDetailAction } from '../../store/actions/authActions';
import Snackbar from '../../helpers/Snackbar';
import ReusableModal from '../../components/Modal/ReusableModal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { capitalizeEachWord } from '../../Utils/Generic';
import { addJobAction } from '../../store/actions/userAction';
import { clearAddJobStatus } from '../../store/reducers/userReducer';

const { width } = Dimensions.get('window');

const schema = Yup.object().shape({
    height: Yup.string().required().label("height"),
    build: Yup.string().label("build"),
    occupation: Yup.string().required().label("occupation"),
    bio: Yup.string().label("bio"),
    // age: Yup.string().required().label("age"),
    state: Yup.string().required().label("state"),
});

const builds = [
    { label: 'Slim', value: 'slim' },
    { label: 'Athletic', value: 'athletic' },
    { label: 'Chubby', value: 'chubby' },
]

const heightValues = [
    { label: '1ft', value: '1' },
    { label: '2ft', value: '2' },
    { label: '3ft', value: '3' },
    { label: '4ft', value: '4' },
    { label: '5ft', value: '5' },
    { label: '6ft', value: '6' },
    { label: '7ft', value: '7' },
    { label: '8ft', value: '8' }
]

const About = () => {
    const router = useRouter();
    const { jobsData, setReload } = useVarious();
    const [state, setState] = useState([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [data, setData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const authReducer = useAppSelector(state => state.authReducer);
    const userReducer = useAppSelector(state => state.userReducer);

    const handleSubmit = (values: any) => {
        if(/[a-zA-Z,;!@#$%^&*()_+{}\[\]:;<>,?\\/`~"' ]/.test(values.height)) {
            return alertComponent(
                'Height',
                'Invalid height. Only numbers and period(.) sign are allowed.',
                'Cancel',
                ()=>console.log('pressed')
            );
        }

        const payload = {
            ...values,
            ...data,
        }

        dispatch(updateProfileDetailAction(payload))
    };

    const alertComponent = (title: string, mess: string, btnTxt: string, btnFunc: any) => {
        return Alert.alert(title, mess, [
            {
              text: btnTxt,
              onPress: btnFunc
            }
        ]);
      };

    useEffect(() => {
        const newState = [];
        for (let key in stateLga) {
          newState.push({
            label: key,
            value: key.toLowerCase(),
          });
        }
        setState(newState);
    }, [stateLga]);

    useEffect(() => {
        const fetchData = async () => {
            try {
            const data = await retrieveData('profile-data');
            if (data) {
                const resource = JSON.parse(data)
                setData(resource)
            }
            } catch (error) {
            console.error(error);
            // Handle the error (e.g., show an error message)
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        if(authReducer.updateProfileDetailStatus === 'completed') {
            removeData("profile-data")
            router.push('/auth/gallery')
            dispatch(clearSignInStatus())
            dispatch(clearUpdateProfileDetailStatus())
        } else if(authReducer.updateProfileDetailStatus === 'failed') {
            setIsError(true)
            setError(authReducer.updateProfileDetailError)
            dispatch(clearUpdateProfileDetailStatus())
        }

    },[authReducer.updateProfileDetailStatus]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        if(userReducer.addJobStatus === 'completed') {
          setModalVisible(false);
          setReload(true);
        //   setIsSuccess(true)
        //   setSuccess(userReducer.addJobSuccess)
    
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
        if (success !== '' || error !== '') {
          return alertComponent(
            '',
            success || error,
            'Ok',
            () => console.log('pressed')
          );
        };
    },[success, error]);

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
            <KeyboardAvoidingView
                style={styles.containerKey}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView showsVerticalScrollIndicator={false}
                    style={{
                        paddingHorizontal: 20
                    }}
                >
                    <Text
                        style={{
                            color: 'black',
                            fontFamily: FONT.extraBold,
                            fontSize: SIZES.xLarge,
                            marginTop: 20,
                            marginLeft: 5,
                            marginBottom: 40
                        }}
                    >
                        Tell us about you
                    </Text>
                    <Formik
                        initialValues={{ 
                            height: '', 
                            build: '', 
                            occupation: '',
                            bio: '',
                            // age: '',
                            state: ''
                        }}
                        validationSchema={schema}
                        onSubmit={(values) => handleSubmit(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View style={styles.formContainer}>
                                {/* <AppInput
                                    placeholder={'Height'}
                                    hasPLaceHolder={true}
                                    placeholderTop={'Height'}
                                    value={values.height}
                                    style={{
                                        width: 90/100 * width,
                                        borderColor: errors.height ? 'red' : COLORS.gray2
                                    }}
                                    headerStyle={{
                                        marginLeft: 10
                                    }}
                                    errorTextStyle={{
                                        marginLeft: 10
                                    }}
                                    onChangeText={handleChange('height')}
                                    // onBlur={handleBlur('height')}
                                    error={errors.height}
                                    touched={touched.height}
                                    keyboardType="numeric"
                                    showError={false}
                                /> */}
                                 <Select
                                    data={heightValues}
                                    onValueChange={handleChange('height')}
                                    value={values.height}
                                    hasPLaceHolder={true}
                                    placeholderTop='Height'
                                    showSelectError={false}
                                    placeholderLabel='Select height...'
                                />

                                <Select
                                    data={builds}
                                    onValueChange={handleChange('build')}
                                    value={values.build}
                                    hasPLaceHolder={true}
                                    placeholderTop='Build'
                                    showSelectError={false}
                                    placeholderLabel='Select an option...'
                                />

                                {Array.isArray(jobsData) && (
                                <Select
                                    data={jobsData}
                                    onValueChange={handleChange('occupation')}
                                    value={values.occupation}
                                    hasPLaceHolder={true}
                                    placeholderTop='Occupation'
                                    showSelectError={false}
                                    selectError={errors.occupation}
                                    placeholderLabel='Select an occupation...'
                                />)}
                                <View
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        width: 90/100 * width,
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        marginTop: -15,
                                        marginBottom: 10
                                    }}
                                >
                                    <Text
                                        style={{
                                        fontFamily: FONT.regular,
                                        fontSize: SIZES.small,
                                        color: COLORS.gray,
                                        marginLeft: 10
                                        }}
                                    >If your occupation is not in the list, click</Text>
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

                                <View 
                                    style={{
                                        backgroundColor: 'transparent',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 10
                                    }}
                                >
                                    {Array.isArray(state) && (
                                    <Select
                                        data={state}
                                        onValueChange={handleChange('state')}
                                        value={values.state}
                                        hasPLaceHolder={true}
                                        placeholderTop='State'
                                        showSelectError={false}
                                        selectError={errors.state}
                                        selectWidth={width}
                                        placeholderLabel='Select a state...'
                                    />)}
                                    {/* <AppInput
                                        placeholder={'Age'}
                                        hasPLaceHolder={true}
                                        placeholderTop={'Age'}
                                        value={values.age}
                                        style={{
                                            width: 35/100 * width,
                                            borderColor: errors.age ? 'red' : COLORS.gray2
                                        }}
                                        headerStyle={{
                                            marginLeft: 10
                                        }}
                                        errorTextStyle={{
                                            marginLeft: 1
                                        }}
                                        onChangeText={handleChange('age')}
                                        error={errors.age}
                                        touched={touched.age}
                                        keyboardType="numeric"
                                        showError={false}
                                    /> */}
                                </View>
                                
                                <AppInput
                                    placeholder={'Bio'}
                                    hasPLaceHolder={true}
                                    placeholderTop={'Bio'}
                                    value={values.bio}
                                    style={{
                                        width: 90/100 * width,
                                        height: 150,
                                        borderColor: errors.bio ? 'red' : COLORS.gray2
                                    }}
                                    headerStyle={{
                                        marginLeft: 10
                                    }}
                                    errorTextStyle={{
                                        marginLeft: 10
                                    }}
                                    onChangeText={handleChange('bio')}
                                    multiline={true}
                                    showError={false}
                                    error={errors.bio}
                                    touched={touched.bio}
                                />
                                <AppBtn
                                    handlePress={() => handleSubmit()}
                                    isText={true}
                                    btnTitle={'Continue'} 
                                    btnWidth={'90%'} 
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
                                    spinner={authReducer.updateProfileDetailStatus === 'loading'}
                                    spinnerColor='white'
                                    spinnerStyle={{
                                        marginLeft: 10
                                    }}
                                />
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
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
                    height: 'auto'
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
                        // height: 'auto'
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
                                    name: capitalizeEachWord(values.name.replace(/[^\w\s]/g, '').trim())
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
    containerKey: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        gap: 20,
        backgroundColor: 'transparent',
        marginTop: 10,
        marginBottom: 100
    },
})

export default About;