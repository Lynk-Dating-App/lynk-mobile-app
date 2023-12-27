import { Dimensions, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import { COLORS, FONT, SIZES, icons } from "../../constants";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import AppInput, { Select } from "../../components/AppInput/AppInput";
import { MultiSelect } from 'react-native-element-dropdown';
import AppBtn from "../../components/common/button/AppBtn";
import useAppSelector from "../../hook/useAppSelector";
import { Formik } from "formik";
import useAppDispatch from "../../hook/useAppDispatch";
import { getUserAction, updateUserAction } from "../../store/actions/userAction";
import { useRouter } from "expo-router";
import Snackbar from "../../helpers/Snackbar";
import { clearUpdateUserStatus } from "../../store/reducers/userReducer";
import { stateLga } from "../../constants/states";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import InputHeader from "../../components/InputHeader/InputHeader";
import { alertComponent } from "../../Utils/Generic";

const interests = [
    { label: 'Photography', value: 'Photography'},
    { label: 'Shopping', value: 'Shopping'},
    { label: 'Karaoke', value: 'Karaoke'},
    { label: 'Yoga', value: 'Yoga'},
    { label: 'Cooking', value: 'Cooking'},
    { label: 'Tennis', value: 'Tennis'},
    { label: 'Run', value: 'Run'},
    { label: 'Swimming', value: 'Swimming'},
    { label: 'Art', value: 'Art'},
    { label: 'Travelling', value: 'Travelling'},
    { label: 'Extreme', value: 'Extreme'},
    { label: 'Music', value: 'Music'},
    { label: 'Drink', value: 'Drink'},
    { label: 'Video games', value: 'Video games'}
];

const personalityTemperament = [
    {value: "Mild", label: "Mild"}, 
    {value: "Average", label: "Average"},
    {value: "Hot", label: "Hot"}
];

const religion = [
    {value: "Christianity", label: "Christianity"}, {value: "Islam", label: "Islam"}, 
    {value: "Confusionist", label: "Confusionist"}, {value: "Buddhism", label: "Buddhism"},
    {value: "Hinduism", label: "Hinduism"}, {value: "None", label: "None"}, {value: "Others", label: "Others"}
];

const relationshipPreference = [
    {value: "Long term", label: "Long term"}, 
    {value: "Short term", label: "Short term"}, 
    {value: "Just for fun", label: "Just for fun"}
];

const sexualPreference = [
    {value: "Threesome", label: "Threesome"}, 
    {value: "Oral", label: "Oral"}, {value: "BDSM", label: "BDSM"}, 
    {value: "Others", label: "Others"}
];

const religiousInvolvement = [
    {value: "Not religious", label: "Not religious"}, 
    {value: "Moderately religious", label: "Moderately religious"}, 
    {value: "Very religious", label: "Very religious"}
];

const education = [
    {value: "HND", label: "HND"}, 
    {value: "Bsc/Ba", label: "Bsc/Ba"}, 
    {value: "Msc./Mba", label: "Msc./Mba"}, 
    {value: "Phd", label: "Phd"}, {value: "Others", label: "Others"}
];

const schema2 = Yup.object().shape({
    firstName: Yup.string().required().label("first name"),
    lastName: Yup.string().required().label("last name"),
    dob: Yup.date().required().label("dob"),
    height: Yup.string().required().label("height"),
    state: Yup.string().required().label("state"),
    about: Yup.string().required().label("about"),
    address: Yup.string().required().label("address"),
    officeName: Yup.string().optional().label("office name"),
    officeAddress: Yup.string().optional().label("office address"),
    religion: Yup.string().optional().label("religion"),
    religiousInvolvement: Yup.string().optional().label("religion involvement"),
    sexualPreference: Yup.string().optional().label("sexual preference"),
    relationshipPreference: Yup.string().optional().label("relationship preference"),
    personalityTemperament: Yup.string().optional().label("personality temperament"),
});

const { width } = Dimensions.get('window');

export default function EditUserDetail () {
    const [selectedItem, setSelectedItem] = useState([]);
    const [error, setError] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [state, setState] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const router = useRouter()
    const dispatch = useAppDispatch();
    const userReducer = useAppSelector(state => state.userReducer);

    const onSelectedItemsChange = (item: any) => {
        setSelectedItem(item);
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    useEffect(() => {
        setSelectedItem(userReducer.loggedInuser?.interests)
    },[userReducer.loggedInuser]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(userReducer.updateUserStatus === 'completed') {
            router.back()
            dispatch(getUserAction(userReducer.loggedInuser._id));
            dispatch(clearUpdateUserStatus());
        } else if(userReducer.updateUserStatus === 'failed') {

            setIsError(true)
            setError(userReducer.updateUserError)
        
            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000);

            dispatch(clearUpdateUserStatus());
        }

        return () => {
            clearInterval(intervalId);
        }
    },[userReducer.updateUserStatus]);

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
        setSelectedDate(new Date(userReducer.loggedInuser?.dob))
    },[]);

    return(
        <SafeAreaView>
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
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                >
                    <View
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginVertical: 20,
                            marginLeft: 20
                        }}
                    >
                        <Text
                            style={{
                            fontFamily: FONT.extraBold,
                            fontSize: SIZES.large,
                            }}
                        >Edit details</Text>
                    </View>
                    <Formik
                        initialValues={{ 
                            firstName: userReducer.loggedInuser?.firstName || '',
                            lastName: userReducer.loggedInuser?.lastName || '',
                            dob: userReducer.loggedInuser?.dob || '',
                            height: userReducer.loggedInuser?.height || '',
                            state: userReducer.loggedInuser?.state || '',
                            address: userReducer.loggedInuser?.address || '',
                            about: userReducer.loggedInuser?.about || '',
                            officeName: userReducer.loggedInuser?.officeName || '',
                            officeAddress: userReducer.loggedInuser?.officeAddress || '',
                            religion: userReducer.loggedInuser?.religion || '',
                            religiousInvolvement: userReducer.loggedInuser?.religiousInvolvement || '',
                            sexualPreference: userReducer.loggedInuser?.sexualPreference || '',
                            relationshipPreference: userReducer.loggedInuser?.relationshipPreference || '',
                            personalityTemperament: userReducer.loggedInuser?.personalityTemperament || '',
                            education: userReducer.loggedInuser?.education || ''
                        }}
                        validationSchema={schema2}
                        onSubmit={(values: any) => {
                            const age = new Date().getFullYear() - new Date(values.dob).getFullYear();
                            if(age < 16) {
                                return alertComponent(
                                    'Age Limit',
                                    'Age can not be less than 16.',
                                    'Cancel',
                                    ()=>console.log('pressed')
                                );
                            }
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
                                interests: selectedItem
                            }
                            dispatch(updateUserAction(payload));
                        }}
                    >
                    {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View style={styles.formContainer}>
                            <View 
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                            <AppInput
                                placeholder={'First Name'}
                                hasPLaceHolder={true}
                                placeholderTop={'First Name'}
                                value={values.firstName}
                                style={{
                                    width: 43/100 * width,
                                    borderColor: errors.firstName ? 'red' : COLORS.gray2
                                }}
                                headerStyle={{
                                    fontFamily: FONT.semiBold,
                                    fontSize: SIZES.small,
                                    marginLeft: 5,
                                    color: COLORS.gray
                                }}
                                errorTextStyle={{
                                marginLeft: 1
                                }}
                                onChangeText={handleChange('firstName')}
                                error={errors.firstName}
                                touched={touched.firstName}
                                showError={false}
                            />
                            <AppInput
                                placeholder={'Last Name'}
                                hasPLaceHolder={true}
                                placeholderTop={'Last Name'}
                                value={values.lastName}
                                headerStyle={{
                                fontFamily: FONT.semiBold,
                                fontSize: SIZES.small,
                                marginLeft: 5,
                                color: COLORS.gray
                                }}
                                style={{
                                    width: 43/100 * width,
                                    borderColor: errors.lastName ? 'red' : COLORS.gray2
                                }}
                                errorTextStyle={{
                                    marginLeft: 1
                                }}
                                onChangeText={handleChange('lastName')}
                                error={errors.lastName}
                                touched={touched.lastName}
                                showError={false}
                            />
                            </View>

                            {Array.isArray(education) && (
                                <Select
                                    data={education}
                                    onValueChange={handleChange('education')}
                                    value={values.education}
                                    hasPLaceHolder={true}
                                    placeholderTop='Education'
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.small,
                                        marginLeft: 5,
                                        color: COLORS.gray
                                    }}
                                    showSelectError={false}
                                    selectError={errors.education}
                                    placeholderLabel='Select an item...'
                                    style={{alignSelf: 'center'}}
                                />)}

                            <AppInput
                                placeholder={''}
                                hasPLaceHolder={true}
                                placeholderTop={'About'}
                                value={values.about}
                                headerStyle={{
                                    fontFamily: FONT.semiBold,
                                    fontSize: SIZES.small,
                                    marginLeft: 30,
                                    color: COLORS.gray
                                }}
                                style={{
                                    width: 90/100 * width,
                                    height: 150,
                                    borderColor: errors.about ? 'red' : COLORS.gray2
                                }}
                                errorTextStyle={{
                                    marginLeft: 10
                                }}
                                onChangeText={handleChange('about')}
                                multiline={true}
                                showError={false}
                                error={errors.about}
                                touched={touched.about}
                            />

                            <View 
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 20, alignSelf: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        width: '43%',
                                    }}
                                >
                                <InputHeader text={"Date of birth"} 
                                    style={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.small,
                                        marginLeft: 10,
                                        color: COLORS.gray
                                    }}
                                />
                                    <TouchableOpacity
                                        onPress={showDatePicker}
                                        style={{
                                            width: '100%',
                                            alignSelf: 'center',
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            gap: 10,
                                            height: 55,
                                            borderWidth: 0.3,
                                            borderColor: COLORS.gray2,
                                            borderRadius: 15,
                                            paddingHorizontal: 10,
                                            marginRight: -10,
                                            backgroundColor: '#fafafc'
                                        }}
                                    >
                                        <Image
                                            source={icons.Calendar}
                                            resizeMode='cover'
                                            style={{
                                                height: 15,
                                                width: 15
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: FONT.regular,
                                            }}
                                        >{selectedDate.toDateString() !== new Date().toDateString() ? selectedDate.toDateString() : 'Choose birthday date'}</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <AppInput
                                    placeholder={''}
                                    hasPLaceHolder={true}
                                    placeholderTop={'Height'}
                                    value={values.height}
                                    style={{
                                        width: 43/100 * width,
                                        borderColor: errors.height ? 'red' : COLORS.gray2
                                    }}
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.small,
                                        marginLeft: 10,
                                        color: COLORS.gray
                                    }}
                                    errorTextStyle={{
                                        marginLeft: 1
                                    }}
                                    onChangeText={handleChange('height')}
                                    error={errors.height}
                                    touched={touched.height}
                                    keyboardType="numeric"
                                    showError={false}
                                />
                            </View>

                            {Array.isArray(state) && (
                                <Select
                                    data={state}
                                    onValueChange={handleChange('state')}
                                    value={values.state}
                                    hasPLaceHolder={true}
                                    placeholderTop='State'
                                    showSelectError={false}
                                    selectError={errors.state}
                                    placeholderLabel='Select a state...'
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.small,
                                        marginLeft: 10,
                                        color: COLORS.gray
                                    }}
                                    selectWidth={90/100 * width}
                                    style={{alignSelf: 'center'}}
                                />
                            )}
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                display="inline"
                                date={selectedDate}
                                onConfirm={Platform.OS === 'android' ? (date) => {
                                    setFieldValue('dob', date)
                                    setSelectedDate(date)
                                    hideDatePicker()
                                } : () => console.log('android')}
                                onCancel={() => {
                                    hideDatePicker()
                                }}
                                onChange={Platform.OS === 'ios' ? (date) => {
                                    setFieldValue('dob', date)
                                    setSelectedDate(date)
                                    // hideDatePicker()
                                } : undefined}
                                buttonTextColorIOS={'white'}
                                customConfirmButtonIOS={() => (
                                    <AppBtn
                                        handlePress={hideDatePicker}
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
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center'
                                        }}
                                    />
                                )}
                                pickerContainerStyleIOS={{
                                    borderRadius: 10,
                                    padding: 4
                                }}
                            />

                            <AppInput
                                placeholder={''}
                                hasPLaceHolder={true}
                                placeholderTop={'Address'}
                                value={values.address}
                                style={{
                                    width: 90/100 * width,
                                    height: 100,
                                    borderColor: errors.address ? 'red' : COLORS.gray2
                                }}
                                headerStyle={{
                                    fontFamily: FONT.semiBold,
                                    fontSize: SIZES.small,
                                    marginLeft: 30,
                                    color: COLORS.gray
                                }}
                                errorTextStyle={{
                                    marginLeft: 10
                                }}
                                onChangeText={handleChange('address')}
                                multiline={true}
                                showError={false}
                                error={errors.address}
                                touched={touched.address}
                            />

                            <AppInput
                                placeholder={''}
                                hasPLaceHolder={true}
                                placeholderTop={'Office Name'}
                                value={values.officeName}
                                style={{
                                    width: 90/100 * width,
                                    borderColor: errors.officeName ? 'red' : COLORS.gray2
                                }}
                                headerStyle={{
                                    fontFamily: FONT.semiBold,
                                    fontSize: SIZES.small,
                                    marginLeft: 30,
                                    color: COLORS.gray
                                }}
                                errorTextStyle={{
                                    marginLeft: 1
                                }}
                                onChangeText={handleChange('officeName')}
                                error={errors.officeName}
                                touched={touched.officeName}
                                showError={false}
                            />

                            <AppInput
                                placeholder={''}
                                hasPLaceHolder={true}
                                placeholderTop={'Office Address'}
                                value={values.officeAddress}
                                style={{
                                    width: 90/100 * width,
                                    height: 100,
                                    borderColor: errors.officeAddress ? 'red' : COLORS.gray2
                                }}
                                headerStyle={{
                                    fontFamily: FONT.semiBold,
                                    fontSize: SIZES.small,
                                    marginLeft: 30,
                                    color: COLORS.gray
                                }}
                                errorTextStyle={{
                                    marginLeft: 10
                                }}
                                onChangeText={handleChange('officeAddress')}
                                multiline={true}
                                showError={false}
                                error={errors.officeAddress}
                                touched={touched.officeAddress}
                            />

                            <View 
                                style={{
                                    width: 90/100 * width,
                                    borderWidth: 0.3,
                                    alignSelf: 'center',
                                    padding: 10,
                                    height: 'auto',
                                    borderColor: COLORS.gray2,
                                    borderRadius: 15,
                                    backgroundColor: '#fafafc'
                                }}
                            >
                                <MultiSelect
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    search
                                    data={interests}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select interests"
                                    searchPlaceholder="Search..."
                                    value={selectedItem}
                                    onChange={item => {
                                        setSelectedItem(item);
                                    }}
                                    renderLeftIcon={() => (
                                        <AntDesign
                                            style={styles.icon}
                                            color="black"
                                            name="Safety"
                                            size={20}
                                        />
                                    )}
                                    selectedStyle={styles.selectedStyle}
                                />
                            </View>

                            <View 
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                            {Array.isArray(religion) && (
                                <Select
                                    data={religion}
                                    onValueChange={handleChange('religion')}
                                    value={values.religion}
                                    hasPLaceHolder={true}
                                    placeholderTop='Religion'
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.small,
                                        marginLeft: 5,
                                        color: COLORS.gray
                                    }}
                                    showSelectError={false}
                                    selectError={errors.religion}
                                    placeholderLabel='Select an religion...'
                                />)}
                            {Array.isArray(religiousInvolvement) && (
                                <Select
                                    data={religiousInvolvement}
                                    onValueChange={handleChange('religiousInvolvement')}
                                    value={values.religiousInvolvement}
                                    hasPLaceHolder={true}
                                    placeholderTop='Religion Involvement'
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.small,
                                        marginLeft: 5,
                                        color: COLORS.gray
                                    }}
                                    showSelectError={false}
                                    selectError={errors.religiousInvolvement}
                                    placeholderLabel='Select an item...'
                                />)}
                            </View>

                            <View 
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                            {Array.isArray(sexualPreference) && (
                                <Select
                                    data={sexualPreference}
                                    onValueChange={handleChange('sexualPreference')}
                                    value={values.sexualPreference}
                                    hasPLaceHolder={true}
                                    placeholderTop='Sexual preference'
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.small,
                                        marginLeft: 5,
                                        color: COLORS.gray
                                    }}
                                    showSelectError={false}
                                    selectError={errors.sexualPreference}
                                    placeholderLabel='Select an sexual preference...'
                                />)}
                            {Array.isArray(relationshipPreference) && (
                                <Select
                                    data={relationshipPreference}
                                    onValueChange={handleChange('relationshipPreference')}
                                    value={values.relationshipPreference}
                                    hasPLaceHolder={true}
                                    placeholderTop='Relationship preference'
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.small,
                                        marginLeft: 5,
                                        color: COLORS.gray
                                    }}
                                    showSelectError={false}
                                    selectError={errors.relationshipPreference}
                                    placeholderLabel='Select an item...'
                                />)}
                            </View>

                            <View 
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                            {Array.isArray(personalityTemperament) && (
                                <Select
                                    data={personalityTemperament}
                                    onValueChange={handleChange('personalityTemperament')}
                                    value={values.personalityTemperament}
                                    hasPLaceHolder={true}
                                    placeholderTop='Personality temperament'
                                    headerStyle={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.small,
                                        marginLeft: 5,
                                        color: COLORS.gray
                                    }}
                                    showSelectError={false}
                                    selectError={errors.personalityTemperament}
                                    placeholderLabel='Select an item...'
                                />)}
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
                                spinner={userReducer.updateUserStatus === 'loading'}
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
        gap: 20
    },
    containerStyle: {
        borderWidth: 0.3,
        borderColor: COLORS.gray2,
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 55,
        backgroundColor: 'white',
        width: 90/100 * width,
        marginLeft: 5,
        alignSelf: 'center'
    },
    textContainerStyle: {
        backgroundColor: 'white',
    },
    dropdown: {
        height: 50,
        backgroundColor: 'transparent',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 14,
        color: 'white',
        fontFamily: FONT.regular
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      icon: {
        marginRight: 5,
      },
      selectedStyle: {
        borderRadius: 12,
        backgroundColor: COLORS.primary
      },
})