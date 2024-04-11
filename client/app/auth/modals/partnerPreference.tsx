import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, ScrollView, Text, View } from "../../../components/Themed"
import { COLORS, FONT, SIZES } from "../../../constants";
import { Formik } from "formik";
import * as Yup from "yup";
import useAppSelector from "../../../hook/useAppSelector";
import useAppDispatch from "../../../hook/useAppDispatch";
import { alertComponent } from "../../../Utils/Generic";
import { getUserAction, updatePreferenceAction } from "../../../store/actions/userAction";
import AppInput, { Select } from "../../../components/AppInput/AppInput";
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

const heightValue = [
    {label: "1ft", value: "1"},
    {label: "2ft", value: "2"}, 
    {label: "3ft", value: "3"}, 
    {label: "4ft", value: "4"}, 
    {label: "5ft", value: "5"}, 
    {label: "6ft", value: "6"}, 
    {label: "7ft", value: "7"}, 
    {label: "8ft", value: "8"}, 
];

const ageValue = [
    {label: "18", value: "18"},
    {label: "19", value: "19"}, 
    {label: "20", value: "20"}, 
    {label: "21", value: "21"}, 
    {label: "22", value: "22"}, 
    {label: "23", value: "23"}, 
    {label: "24", value: "24"}, 
    {label: "25", value: "25"},
    {label: "26", value: "26"},
    {label: "27", value: "27"}, 
    {label: "28", value: "28"}, 
    {label: "29", value: "29"}, 
    {label: "30", value: "30"}, 
    {label: "31", value: "31"}, 
    {label: "32", value: "32"}, 
    {label: "33", value: "33"}, 
    {label: "34", value: "34"}, 
    {label: "35", value: "35"},
    {label: "36", value: "36"},
    {label: "37", value: "37"}, 
    {label: "38", value: "38"}, 
    {label: "39", value: "39"}, 
    {label: "40", value: "40"}, 
    {label: "41", value: "41"}, 
    {label: "42", value: "42"}, 
    {label: "43", value: "43"}, 
    {label: "44", value: "44"}, 
    {label: "45", value: "45"},
    {label: "46", value: "46"},
    {label: "47", value: "47"}, 
    {label: "48", value: "48"}, 
    {label: "49", value: "49"}, 
    {label: "50", value: "50"},
    {label: "51", value: "51"}, 
    {label: "52", value: "52"}, 
    {label: "53", value: "53"}, 
    {label: "54", value: "54"}, 
    {label: "55", value: "55"},
    {label: "56", value: "56"},
    {label: "57", value: "57"}, 
    {label: "58", value: "58"}, 
    {label: "59", value: "59"}, 
    {label: "60", value: "60"}, 
    {label: "61", value: "61"}, 
    {label: "62", value: "62"}, 
    {label: "63", value: "63"}, 
    {label: "64", value: "64"}, 
    {label: "65", value: "65"},
    {label: "66", value: "66"},
    {label: "67", value: "67"}, 
    {label: "68", value: "68"}, 
    {label: "69", value: "69"}, 
    {label: "70", value: "70"},  
    {label: "71", value: "71"}, 
    {label: "72", value: "72"}, 
    {label: "73", value: "73"}, 
    {label: "74", value: "74"}, 
    {label: "75", value: "75"},
    {label: "76", value: "76"},
    {label: "77", value: "77"}, 
    {label: "78", value: "78"}, 
    {label: "79", value: "79"}, 
    {label: "80", value: "80"}, 
]

const { width } = Dimensions.get('window');

const PartnerPreference = () => {

    const [error, setError] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);

    const userReducer = useAppSelector(state => state.userReducer);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleOnSubmit = (values: any) => {
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
    }
 
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
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 40,
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
                            flexDirection: 'row'
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
                        onSubmit={(value) => handleOnSubmit(value)}
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
                                    gap: 10
                                }}
                            >
                                {/* <AppInput
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
                                /> */}
                                <Select
                                    data={heightValue}
                                    onValueChange={handleChange('pMinHeight')}
                                    value={values.pMinHeight}
                                    hasPLaceHolder={true}
                                    placeholderTop='Min Height'
                                    showSelectError={false}
                                    selectError={errors.pMinHeight}
                                    placeholderLabel=''
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.medium,
                                        marginLeft: 5,
                                        color: COLORS.gray
                                    }}
                                    selectWidth={43/100 * width}
                                    style={{alignSelf: 'center'}}
                                />
                                <Select
                                    data={heightValue}
                                    onValueChange={handleChange('pMaxHeight')}
                                    value={values.pMaxHeight}
                                    hasPLaceHolder={true}
                                    placeholderTop='Max Height'
                                    showSelectError={false}
                                    selectError={errors.pMaxHeight}
                                    placeholderLabel=''
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.medium,
                                        marginLeft: 5,
                                        color: COLORS.gray
                                    }}
                                    selectWidth={43/100 * width}
                                    style={{alignSelf: 'center'}}
                                />
                                {/* <AppInput
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
                                /> */}
                                
                            </View>

                            <View 
                                style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 10
                                }}
                            >
                                <Select
                                    data={ageValue}
                                    onValueChange={handleChange('pMinAge')}
                                    value={values.pMinAge}
                                    hasPLaceHolder={true}
                                    placeholderTop='Min Age'
                                    showSelectError={false}
                                    selectError={errors.pMinAge}
                                    placeholderLabel=''
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.medium,
                                        marginLeft: 5,
                                        color: COLORS.gray
                                    }}
                                    selectWidth={43/100 * width}
                                    style={{alignSelf: 'center'}}
                                />
                                {/* <AppInput
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
                                /> */}
                                {/* <AppInput
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
                                /> */}
                                <Select
                                    data={ageValue}
                                    onValueChange={handleChange('pMaxAge')}
                                    value={values.pMaxAge}
                                    hasPLaceHolder={true}
                                    placeholderTop='Max Age'
                                    showSelectError={false}
                                    selectError={errors.pMaxAge}
                                    placeholderLabel=''
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.medium,
                                        marginLeft: 5,
                                        color: COLORS.gray
                                    }}
                                    selectWidth={43/100 * width}
                                    style={{alignSelf: 'center'}}
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