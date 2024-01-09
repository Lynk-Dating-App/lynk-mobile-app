import { 
    ActivityIndicator, 
    Dimensions, Image, 
    Platform, 
    RefreshControl, 
    TouchableOpacity 
} from "react-native";
import {
    SafeAreaView, 
    ScrollView, 
    Text, View 
} from "../../components/Themed";
import { COLORS, FONT, SIZES, images } from "../../constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import useAppSelector from "../../hook/useAppSelector";
import useAppDispatch from "../../hook/useAppDispatch";
import { getSingleNotificationAction } from "../../store/actions/userAction";
import { useEffect } from "react";
import settings from "../../config/settings";
import { BlurView } from "expo-blur";
import AppBtn from "../../components/common/button/AppBtn";
import { setFromUserId, setNotificationId } from "../../store/reducers/userReducer";

const { width } = Dimensions.get('window');

export default function SingleNotification() {
    const router = useRouter();
    const userReducer = useAppSelector(state => state.userReducer);
    const dispatch = useAppDispatch();

    const renderHeader = () => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row', 
            justifyContent: 'flex-start', 
            alignItems: 'center',
            marginTop: Platform.select({ios: 30, android: 50}),
            borderBottomColor: COLORS.gray2,
            borderBottomWidth: 0.3,
            paddingBottom: 10,
            marginBottom: 10
          }}
        >
          <View
            style={{
              flex: 1,
              marginHorizontal: 10
            }}
          >
            <View style={styles.section1}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => {
                        dispatch(setNotificationId(''))
                        router.back()
                    }}
                >
                <FontAwesome
                    name='angle-left'
                    size={30}
                    color={COLORS.primary}
                />
                </TouchableOpacity>
            </View>
          </View>
        </View>
    );

    useEffect(() => {
        dispatch(getSingleNotificationAction({notificationId: userReducer.notificationId}))
    },[userReducer.notificationId]);

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={userReducer.getSingleNotificationStatus === 'loading'} 
                onRefresh={() => dispatch(getSingleNotificationAction({notificationId: userReducer.notificationId}))}/>}
            >
                <>
                    { renderHeader() }
                        {userReducer.notificationObject?.message === undefined
                            ? (<>
                                <View
                                    style={{
                                        marginHorizontal: 10,
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Image
                                        source={userReducer.notificationObject?.user?.profileImageUrl === null || userReducer.notificationObject?.user?.profileImageUrl === undefined
                                                    ? images.no_image_m : {uri: `${settings.api.baseURL}/${userReducer.notificationObject?.user?.profileImageUrl}`}}
                                        style={{
                                            height: 350,
                                            width: 300,
                                            borderRadius: 10
                                        }}
                                    />
                                    <BlurView
                                        intensity={100}
                                        style={{
                                            position: "absolute",
                                            width: 300,
                                            height: 100,
                                            overflow: 'hidden',
                                            marginBottom: 10
                                        }}
                                    >
                                        {userReducer.notificationObject !== undefined && <Text
                                            style={{
                                                fontFamily: FONT.extraBold,
                                                fontSize: SIZES.xxLarge,
                                                paddingHorizontal: 10,
                                                color: 'white'
                                            }}
                                        >
                                            {`${userReducer.notificationObject?.name},`} {userReducer.notificationObject?.user.age}
                                        </Text>}
                                        {userReducer.notificationObject === undefined && <ActivityIndicator />}
                                        <Text
                                            style={{
                                                fontFamily: FONT.semiBold,
                                                fontSize: SIZES.large,
                                                paddingHorizontal: 10,
                                                color: 'white',
                                                flexWrap: 'wrap'
                                            }}
                                        >{userReducer.notificationObject?.user.address}</Text>
                                    </BlurView>
                                </View>
                                <AppBtn
                                    handlePress={() => {
                                        dispatch(setFromUserId(userReducer.notificationObject.senderId))
                                        router.push({pathname: '/auth/single-user', params: {from: 'one-screen'}});
                                    }}
                                    isText={true}
                                    btnTitle={'View Profile'} 
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
                                        alignItems: 'center',
                                        alignSelf: 'center'
                                    }}
                                />
                            </>
                            ) : (
                                <View
                                    style={{
                                        marginHorizontal: 10,
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: FONT.bold,
                                            fontSize: SIZES.xLarge
                                        }}
                                    >
                                        Congratualtions!
                                    </Text>
                                    <Image
                                        source={images.congrats}
                                        style={{
                                            width: 350,
                                            height: 300
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: FONT.regular,
                                            fontSize: SIZES.medium,
                                            textAlign: 'center',
                                            marginTop: 10
                                        }}
                                    >
                                        {userReducer.notificationObject?.message}
                                    </Text>
                                </View>
                            )}
                </>
            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: 'auto',
        width: width
    },
    section1: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        gap: 40
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
        alignSelf: 'flex-start'
    },
});