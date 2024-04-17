import { Animated, Dimensions, Platform, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import { COLORS, FONT, SIZES, icons, images } from "../../constants";
import { Image } from "react-native";
import { useEffect, useRef, useState } from "react";
import useAppDispatch from "../../hook/useAppDispatch";
import { getLoggedInUserAction, getPlansAction, getUserByIdsAction, toggleAutoRenewalAction } from "../../store/actions/userAction";
import useAppSelector from "../../hook/useAppSelector";
import { alertComponent, capitalizeFirstLetter } from "../../Utils/Generic";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { subscriptionAction } from "../../store/actions/subscriptionAction";
import { clearSubscribeStatus } from "../../store/reducers/subscriptionReducer";
import Snackbar from "../../helpers/Snackbar";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import  { Paystack }  from 'react-native-paystack-webview';
import Tooltip from 'react-native-walkthrough-tooltip';
import tw from 'twrnc';
import { clearToggleAutoRenewalStatus } from "../../store/reducers/userReducer";
import useUser from "../../hook/useUser";

const { width } = Dimensions.get("window");

export default function Billing () {
    const [showSub, setShowSub] = useState<boolean>(false);
    const [error, setError] = useState('');
    const [isError, setIsError] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [amount, setAmount] = useState<string>('');
    const [planType, setPlanType] = useState<string>('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [toolTip, setTooltip] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    const paystackWebViewRef = useRef<any>(); 
    
    const animatedValue = new Animated.Value(0);
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

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });
    
    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const handleSubscribe = (plan: any, index: number) => {
        if(userReducer.loggedInuser?.verify !== 'active') {
            return alertComponent(
                'Not verified',
                'Your account is not verified, Kindly verify your account.',
                'Okay',
                () => {}
            )
        }
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
        if (showSub) {
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
    }, [showSub]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if(subscriptionReducer.subscribeStatus === 'completed') {
            // if (Platform.OS !== 'web') {
            //     WebBrowser.openBrowserAsync(subscriptionReducer.transaction?.authorizationUrl as string);
            // }
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

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        if(userReducer.toggleAutoRenewalStatus === 'completed') {
          setIsEnabled(userReducer.autoRenewal)
          dispatch(getLoggedInUserAction())

          alertComponent(
            'Plan renewal',
            !isEnabled
                ? "Auto renewal is enabled." 
                : "Auto renewal is disabled.",
            'Okay',
            () => {console.log('pressed')}
            )

          dispatch(clearToggleAutoRenewalStatus());
        } else if(userReducer.toggleAutoRenewalStatus === 'failed') {
          setIsError(true)
          setError(userReducer.toggleAutoRenewalError)
    
          intervalId = setTimeout(() => {
            setIsError(false)
            setError('')
          },6000);
        }
    
        return () => {
          clearInterval(intervalId)
        }
      },[userReducer.toggleAutoRenewalStatus]);
    
      useEffect(() => {
        setIsEnabled(user?.autoRenewal)
      },[user]);

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    {/* <View
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginBottom: 60,
                            marginTop: 40,
                            width: '100%'
                        }}
                    >
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: FONT.regular,
                                    fontSize: SIZES.large,
                                    marginBottom: 5, marginLeft: 2
                                }}
                            >Payment</Text>
                            <Text
                                style={{
                                    fontFamily: FONT.regular,
                                    fontSize: SIZES.medium,
                                    color: 'red',
                                    marginBottom: 5, marginLeft: 2
                                }}
                            >Change</Text>
                        </View>
                        <View style={styles.currentCard}>
                            <Image 
                                source={images.visa}
                                style={{
                                    width: 70,
                                    height: 50,
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: FONT.semiBold,
                                    fontSize: SIZES.large
                                }}
                            >**** **** **** 1234</Text>
                        </View>
                    </View> */}
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginBottom: 30,
                            width: '100%'
                        }}
                    >
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: FONT.regular,
                                    fontSize: SIZES.medium,
                                    marginBottom: 5, marginLeft: 2
                                }}
                            >Subscription</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowSub(!showSub)
                                    // router.push('/auth/modals/planScreen')
                                }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 8,
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: FONT.regular,
                                        fontSize: SIZES.medium,
                                        color: 'red',
                                        marginBottom: 5, marginLeft: 2
                                    }}
                                >Change</Text>
                                <FontAwesome
                                    name={showSub ? 'arrow-up' : 'arrow-down'}
                                    size={15}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.currentPlan}>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: 10
                                }}
                            >
                                <Image 
                                    source={icons.subscription}
                                    style={{
                                        width: 40,
                                        height: 40
                                    }}
                                />
                                <Text
                                    style={{
                                        fontFamily: FONT.semiBold,
                                        fontSize: SIZES.large
                                    }}
                                >{capitalizeFirstLetter(userReducer.loggedInuser?.planType)} plan</Text>
                            </View>
                            {userReducer.loggedInuser?.planType === 'premium' && (<View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    paddingHorizontal: 10
                                }}
                            >
                                <View
                                    style={tw`flex flex-row gap-2`}
                                >
                                    <Text
                                        style={{
                                            fontFamily: FONT.bold
                                        }}
                                    >Plan renewal</Text>
                                    <Tooltip
                                        isVisible={toolTip}
                                        content={
                                            <Text
                                            style={{
                                                fontFamily: FONT.regular,
                                                fontSize: SIZES.medium
                                            }}
                                            >
                                                Enable/Disable auto renewal of your plan when it expires. 
                                            </Text>
                                        }
                                        placement="bottom"
                                        onClose={() => setTooltip(false)}
                                        >
                                        <TouchableOpacity
                                            onPress={() => setTooltip(true)}
                                            style={[{
                                            borderWidth: 0.3,
                                            borderColor: COLORS.gray,
                                            borderRadius: 50,
                                            width: 20, height: 20
                                            },tw`flex justify-center items-center`]}
                                        >
                                            <FontAwesome
                                                name='info'
                                                color={COLORS.primary}
                                            />
                                        </TouchableOpacity>
                                        </Tooltip>
                                </View>
                                <FontAwesome
                                    name={isEnabled ? 'toggle-on' : 'toggle-off'}
                                    size={30}
                                    color={isEnabled ? 'green' : COLORS.primary}
                                    onPress={() => dispatch(toggleAutoRenewalAction())}
                                />
                            </View>)}
                        </View>
                    </View>
                    
                    {showSub && (<ScrollView showsVerticalScrollIndicator={false}
                        style={styles.subContainer}>
                        {userReducer.plans.map((plan, index) => (
                            <Animated.View
                                style={[{
                                    opacity,
                                    transform: [{ translateY }],
                                    marginBottom: index === 3 && 300
                                }, styles.subWrapper]}
                                key={plan._id}
                            >
                                <View style={styles.section1}>
                                    <Text
                                        style={{
                                            fontFamily: FONT.bold,
                                            fontSize: SIZES.large,
                                        }}
                                    >{capitalizeFirstLetter(plan.name === "premium" ? "Premium plus" : `${plan.name} plan`)}</Text>
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
                                                backgroundColor: userReducer.loggedInuser?.planType === plan.name && 'green'
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
                                            width: plan.name === "premium" ? 180 : 140,
                                            height: 30,
                                            backgroundColor: plan.name === 'black' 
                                                                ? 'black' 
                                                                : plan.name === 'red'
                                                                    ? '#B20101' 
                                                                    : plan.name === 'purple'
                                                                        ? '#400C60' : COLORS.premiumPlan,
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
                                        >{capitalizeFirstLetter(plan.name === "premium" ? "Premium Plus" : plan.name)} Access</Text>
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
                            </Animated.View>
                        ))
                        }
                    </ScrollView>)}
                </View>
            </View>

            <Paystack
                paystackKey={ process.env.EXPO_PUBLIC_PAYSTACK_PK }
                billingEmail={ process.env.EXPO_PUBLIC_BILLING_EMAIL }
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
            />

            <Snackbar
                isVisible={isError} 
                message={error}
                onHide={() => setIsError(false)}
                type='error'
            />
            <StatusBar backgroundColor='white' style='dark'/>
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
        marginTop: 20,
        paddingBottom: 20
    },
    subContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    currentPlan: {
        minHeight: 60,
        height: 'auto',
        borderWidth: 1,
        borderColor: '#E7E7E7',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 2, flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 5
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