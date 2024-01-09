import { useEffect, useRef, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "../../../components/Themed";
import { getPlansAction } from "../../../store/actions/userAction";
import { COLORS, FONT, SIZES } from "../../../constants";
import useAppDispatch from "../../../hook/useAppDispatch";
import useAppSelector from "../../../hook/useAppSelector";
import { Dimensions, StyleSheet } from "react-native";
import { capitalizeFirstLetter } from "../../../Utils/Generic";
import { TouchableOpacity } from "react-native";
import Snackbar from "../../../helpers/Snackbar";
import { useRouter } from "expo-router";
import { clearSubscribeStatus } from "../../../store/reducers/subscriptionReducer";
import { Paystack } from "react-native-paystack-webview";
//@ts-ignore
import { BILLING_EMAIL, PAYSTACK_PK } from '@env';
import { subscriptionAction } from "../../../store/actions/subscriptionAction";

const { width } = Dimensions.get("window");

const PlanScreen = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [amount, setAmount] = useState<string>('');
    const [planType, setPlanType] = useState<string>('');
    const [error, setError] = useState('');
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    const paystackWebViewRef = useRef<any>(); 

    const dispatch = useAppDispatch();
    const userReducer = useAppSelector(state => state.userReducer);
    const subscriptionReducer = useAppSelector(state => state.subscriptionReducer);

    const blackBenefit = () => (
        <>
            <Text
                style={{
                    fontFamily: FONT.semiBold,
                    fontSize: 14,
                    color: COLORS.gray
                }}
            >
                Send and receive messages but to only fellow black plan users.
            </Text>
            <Text
                style={{
                    fontFamily: FONT.semiBold,
                    fontSize: 14,
                    color: COLORS.gray
                }}
            >
                Can see everyone’s profile picture in Colors Purple and Red (if they have elected to show).
            </Text>
        </>
    );

    const redBenefit = () => (
        <>
            <Text
                style={{
                    fontFamily: FONT.semiBold,
                    fontSize: 14,
                    color: COLORS.gray
                }}
            >
                Send and receive messages but to only profiles with Color Black and Red.
            </Text>
            <Text
                style={{
                    fontFamily: FONT.semiBold,
                    fontSize: 14,
                    color: COLORS.gray
                }}
            >
                 Can see everyone’s profile picture in Colors Black, Red and Purple Badge (if they have elected to show) only.
            </Text>
        </>
    );

    const purpleBenefit = () => (
        <>
            <Text
                style={{
                    fontFamily: FONT.semiBold,
                    fontSize: 14,
                    color: COLORS.gray
                }}
            >
                Send and receive messages from and to, black, red and purple.
            </Text>
            <Text
                style={{
                    fontFamily: FONT.semiBold,
                    fontSize: 14,
                    color: COLORS.gray
                }}
            >
                Can see everyone’s profile picture (if they have elected to show). 
            </Text>
        </>
    );

    const premiumBenefit = () => (
        <>
            <Text
                style={{
                    fontFamily: FONT.semiBold,
                    fontSize: 14,
                    color: COLORS.gray
                }}
            >
                The is not a plan but a monthly fee to be paid by only the purple plan users, for maintenance.
            </Text>
        </>
    );

    const handleSubscribe = (plan: any, index: number) => {
        if(plan.name === userReducer.loggedInuser?.planType) return;
        if(plan.name === 'red' && userReducer.loggedInuser?.planType === 'purple') return; 
        if(plan.name === 'red' || plan.name === 'purple' && userReducer.loggedInuser?.planType === 'premium') return; 
        if(plan.name === 'premium' && userReducer.loggedInuser?.planType !== 'purple') return;               
        setAmount(plan.price)
        setSelectedIndex(index)
        setPlanType(plan.name)
        paystackWebViewRef.current.startTransaction()
    }

    useEffect(() => {
        dispatch(getPlansAction())
    },[]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(subscriptionReducer.subscribeStatus === 'completed') {
            setPlanType('')
            setAmount('')
            setSelectedIndex(-1)
            router.back()
        } else if(subscriptionReducer.subscribeStatus === 'failed') {
            setIsError(true)
            setError(subscriptionReducer.subscribeError)
            setPlanType('')
            setAmount('')
            setSelectedIndex(-1)

            intervalId = setTimeout(() => {
                setIsError(false)
                setError('')
            },6000);

            dispatch(clearSubscribeStatus())
        }

        return () => {
            clearInterval(intervalId);
        }
        
    },[subscriptionReducer.subscribeStatus]);

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView showsVerticalScrollIndicator={false}
                style={styles.subContainer}>
                {userReducer.plans.map((plan, index) => (
                    <View
                        style={[{
                            marginBottom: index === 3 && 30
                        }, styles.subWrapper]}
                        key={plan._id}
                    >
                        <View style={styles.section1}>
                            <Text
                                style={{
                                    fontFamily: FONT.bold,
                                    fontSize: SIZES.large,
                                }}
                            >{capitalizeFirstLetter(plan.name)} plan</Text>
                            <View style={{
                                width: 20,
                                height: 20,
                                borderWidth: 1,
                                borderColor: COLORS.gray2,
                                borderRadius: 20,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View
                                    style={{
                                        width: 13,
                                        height: 13,
                                        borderRadius: 20,
                                        backgroundColor: userReducer.loggedInuser?.planType === plan.name && 'green'//COLORS.primary
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                flexDirection: 'row'
                            }}
                        >
                            <View
                                style={{
                                    width: 140,
                                    height: 30,
                                    backgroundColor: plan.name === 'black' 
                                                        ? 'black' 
                                                        : plan.name === 'red'
                                                            ? '#B20101' 
                                                            : plan.name === 'purple'
                                                                ? '#400C60' : COLORS.primary,
                                    borderRadius: 20,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingVertical: 2,
                                    marginVertical: 20
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.medium,
                                        color: 'white'
                                    }}
                                >{capitalizeFirstLetter(plan.name)} Access</Text>
                            </View>
                            {plan.name !== 'black' && (<TouchableOpacity
                                onPress={() => handleSubscribe(plan, index)}
                                disabled={userReducer.loggedInuser?.planType === plan.name}
                                style={{
                                    backgroundColor: userReducer.loggedInuser?.planType === "black" || userReducer.loggedInuser?.planType === "red"
                                                        ? COLORS.tertiary
                                                        : userReducer.loggedInuser?.planType === "purple" && plan.name === "red"
                                                            ? COLORS.gray
                                                            : userReducer.loggedInuser?.planType === "purple" && plan.name === "premium"
                                                                ? COLORS.tertiary
                                                                : userReducer.loggedInuser?.planType === "premium" && plan.name === "red" || plan.name === "purple"
                                                                    ? COLORS.gray
                                                                    : '',
                                    padding: 5,
                                    borderRadius: 10
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: FONT.bold,
                                        fontSize: SIZES.small,
                                        color: "white"
                                    }}
                                >{selectedIndex === index && subscriptionReducer.subscribeStatus === 'loading' ? 'Loading...' : 'Subscribe'}</Text>
                            </TouchableOpacity>)}
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-end',
                                gap: 5, marginBottom: 20
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: FONT.bold,
                                    fontSize: SIZES.xxLarge,
                                    color: COLORS.tertiary
                                }}
                            >
                                NGN{plan.price || 0}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: FONT.regular,
                                    fontSize: SIZES.medium,
                                    color: COLORS.tertiary
                                }}
                            >
                                {plan.name === 'black' 
                                    ? '' 
                                    : plan.name === 'premium'
                                        ? 'Monthly' : 'One time'}
                            </Text>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                gap: 5
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: FONT.extraBold,
                                    fontSize: SIZES.large,
                                    marginBottom: 2
                                }}
                            >Benefits</Text>
                            {plan.name === 'black' && blackBenefit()}
                            {plan.name === 'red' && redBenefit()}
                            {plan.name === 'purple' && purpleBenefit()}
                            {plan.name === 'premium' && premiumBenefit()}
                        </View>
                    </View>
                ))
                }
            </ScrollView>

            <Paystack
                paystackKey={ PAYSTACK_PK }
                billingEmail={ BILLING_EMAIL }
                amount={amount}
                onCancel={(e) => {
                    setAmount('')
                }}
                onSuccess={(res) => {
                    const payload = {
                        reference: res.data.transactionRef.reference,
                        planType: planType
                    };
                    dispatch(subscriptionAction(payload))
                }}
                ref={paystackWebViewRef}
                activityIndicatorColor={'transparent'}
                billingName="Lynk"
                channels={["card"]}
            />

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
    section1: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E7E7E7',
        paddingBottom: 20
    },
    subWrapper: {
        display: 'flex',
        borderColor: '#E7E7E7',
        borderWidth: 1,
        borderRadius: 10,
        height: 'auto',
        paddingHorizontal: 10,
        marginHorizontal: 20,
        marginTop: 40,
        paddingBottom: 20
    },
    subContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    currentPlan: {
        height: 60,
        borderWidth: 1,
        borderColor: '#E7E7E7',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10, flexDirection: 'row',
        paddingHorizontal: 10
    },
    currentCard: {
        height: 60,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10, flexDirection: 'row',
        paddingHorizontal: 10,
        marginTop: 10
    },
    container: {
        display: 'flex',
        height: 'auto',
        width: width
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 40,
        height: 'auto'
    },
    sub: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    }
})

export default PlanScreen;