import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, ScrollView, Text, View } from "../../../components/Themed"
import { COLORS, FONT, SIZES } from "../../../constants";
import { Formik } from "formik";
import * as Yup from "yup";
import useAppSelector from "../../../hook/useAppSelector";
import useAppDispatch from "../../../hook/useAppDispatch";
import { alertComponent } from "../../../Utils/Generic";
import { getUserAction, updatePreferenceAction } from "../../../store/actions/userAction";
import AppInput from "../../../components/AppInput/AppInput";
import AppBtn from "../../../components/common/button/AppBtn";
import { useEffect, useState } from "react";
import { clearUpdatePreferenceStatus } from "../../../store/reducers/userReducer";
import Snackbar from "../../../helpers/Snackbar";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const schema = Yup.object().shape({
    pMinHeight: Yup.string().required().label("minimum height"),
    pMaxHeight: Yup.string().required().label("maximum height"),
    pMinAge: Yup.string().required().label("minimum age"),
    pMaxAge: Yup.string().required().label("maximum age"),
    pAbout: Yup.string().required().label("about")
});

const { width } = Dimensions.get('window');

const PartnerPreference = () => {

    const [error, setError] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);

    const userReducer = useAppSelector(state => state.userReducer);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        if(userReducer.updatePreferenceStatus === 'completed') {
          dispatch(getUserAction(userReducer.loggedInuser?._id))
          dispatch(clearUpdatePreferenceStatus());
          router.back()
        } else if(userReducer.updatePreferenceStatus === 'failed') { 
          setIsError(true)
          setError(userReducer.updatePreferenceError)
    
          intervalId = setTimeout(() => {
            setIsError(false)
            setError('')
          },6000);
          dispatch(clearUpdatePreferenceStatus())
        }
    
        return () => {
          clearInterval(intervalId);
        }
    },[userReducer.updatePreferenceStatus]);

    return (
        <SafeAreaView style={{flex: 1}}> 
            <ScrollView
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{
                display: 'flex', 
                paddingTop: Platform.select({android: 20, ios: 0}), 
                    height: 'auto'
                }}
                style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderTopStartRadius: 30,
                    borderTopEndRadius: 30,
                    width: '100%',
                    height: Platform.select({android: '80%', ios: '90%'})
                }}
            >
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                >
                    <View
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: 100,
                            paddingRight: 20
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: FONT.extraBold,
                                fontSize: SIZES.xLarge,
                            }}
                        >Partner Preference</Text>
                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPress={() => {
                            router.back()}}
                        >
                            <FontAwesome
                                name='close'
                                size={20}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                    <Formik
                        initialValues={{ 
                            pAbout: userReducer.loggedInuser?.preference?.pAbout || '',
                            pMinAge: userReducer.loggedInuser?.preference?.pMinAge || '',
                            pMaxAge: userReducer.loggedInuser?.preference?.pMaxAge || '',
                            pMinHeight: userReducer.loggedInuser?.preference?.pMinHeight || '',
                            pMaxHeight: userReducer.loggedInuser?.preference?.pMaxHeight || '',
                        }}
                        validationSchema={schema}
                        onSubmit={(values: any) => {
                        const minHeight = values.pMinHeight.trim();
                        const maxHeight = values.pMaxHeight.trim();
                        const minAge = values.pMinAge.trim();
                        const maxAge = values.pMaxAge.trim();

                        if(+minHeight > +maxHeight) {
                            return alertComponent(
                            'Height',
                            'Min height cannot be greater than Max height.',
                            'Cancel',
                            ()=>console.log('pressed')
                            );
                        }

                        if(+minAge > +maxAge) {
                            return alertComponent(
                            'Age',
                            'Min age cannot be greater than Max age.',
                            'Cancel',
                            ()=>console.log('pressed')
                            );
                        }

                        if(/[a-zA-Z,;!@#$%^&*()_+{}\[\]:;<>,?\\/`~"' \s]/.test(minHeight) ||
                            /[a-zA-Z,;!@#$%^&*()_+{}\[\]:;<>,?\\/`~"' \s]/.test(maxHeight)
                        ) {
                            return alertComponent(
                            'Height',
                            'Invalid height. Only numbers and periodd(.) sign are allowed.',
                            'Cancel',
                            ()=>console.log('pressed')
                            );
                        }

                        if(/[a-zA-Z,;!@#$%^&*()_+{}\[\]:;<>,?\\/`~"'.\s]/.test(minAge) ||
                            /[a-zA-Z,;!@#$%^&*()_+{}\[\]:;<>,?\\/`~"'.\s]/.test(maxAge)
                        ) {
                            return alertComponent(
                            'Age',
                            'Invalid Age. Only numbers are allowed.',
                            'Cancel',
                            ()=>console.log('pressed')
                            );
                        }

                        const payload = {
                            preference: {
                            ...values
                            }
                        }

                        dispatch(updatePreferenceAction(payload))
                        }}
                    >
                        {({ handleChange, handleSubmit, values, errors, touched }) => (
                            <View style={styles.formContainer}>
                            <AppInput
                                placeholder={''}
                                hasPLaceHolder={true}
                                placeholderTop={'About'}
                                value={values.pAbout}
                                style={{
                                    width: 90/100 * width,
                                    alignSelf: 'center',
                                    height: 150,
                                    marginRight: 5,
                                    borderColor: errors.pAbout ? 'red' : COLORS.gray2
                                }}
                                headerStyle={{
                                    fontFamily: FONT.semiBold,
                                    fontSize: SIZES.medium,
                                    marginLeft: 5,
                                    color: COLORS.gray
                                }}
                                errorTextStyle={{
                                    marginLeft: 5
                                }}
                                onChangeText={handleChange('pAbout')}
                                multiline={true}
                                showError={false}
                                error={errors.pAbout}
                                touched={touched.pAbout}
                            />
                            
                            <View 
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 20
                                }}
                            >
                                <AppInput
                                    placeholder={''}
                                    hasPLaceHolder={true}
                                    placeholderTop={'Min Height'}
                                    value={values.pMinHeight}
                                    style={{
                                        width: 43/100 * width,
                                        borderColor: errors.pMinHeight ? 'red' : COLORS.gray2
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
                                    onChangeText={handleChange('pMinHeight')}
                                    error={errors.pMinHeight}
                                    touched={touched.pMinHeight}
                                    keyboardType="numeric"
                                    showError={false}
                                />
                                <AppInput
                                placeholder={''}
                                hasPLaceHolder={true}
                                placeholderTop={'Max Height'}
                                value={values.pMaxHeight}
                                style={{
                                    width: 43/100 * width,
                                    borderColor: errors.pMaxHeight ? 'red' : COLORS.gray2
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
                                onChangeText={handleChange('pMaxHeight')}
                                error={errors.pMaxHeight}
                                touched={touched.pMaxHeight}
                                keyboardType="numeric"
                                showError={false}
                                />
                                
                            </View>

                            <View 
                                style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 20
                                }}
                            >
                                <AppInput
                                placeholder={''}
                                hasPLaceHolder={true}
                                placeholderTop={'Min Age'}
                                value={values.pMinAge}
                                style={{
                                    width: 43/100 * width,
                                    borderColor: errors.pMinAge ? 'red' : COLORS.gray2
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
                                onChangeText={handleChange('pMinAge')}
                                error={errors.pMinAge}
                                touched={touched.pMinAge}
                                keyboardType="numeric"
                                showError={false}
                                />
                                <AppInput
                                placeholder={''}
                                hasPLaceHolder={true}
                                placeholderTop={'Max Age'}
                                value={values.pMaxAge}
                                style={{
                                    width: 43/100 * width,
                                    borderColor: errors.pMaxAge ? 'red' : COLORS.gray2
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
                                onChangeText={handleChange('pMaxAge')}
                                error={errors.pMaxAge}
                                touched={touched.pMaxAge}
                                keyboardType="numeric"
                                showError={false}
                                />
                            </View>
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
                                    marginTop: 40,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center'
                                }}
                                spinner={userReducer.updatePreferenceStatus === 'loading'}
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
            <Snackbar
                isVisible={isError} 
                message={error}
                onHide={() => setIsError(false)}
                type='error'
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    formContainer: {
      flex: 1,
      gap: 20,
      marginTop: 30,
      marginBottom: 40
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        borderWidth: 0.3,
        borderColor: COLORS.gray2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default PartnerPreference;