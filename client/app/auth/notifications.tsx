import { ActivityIndicator, Dimensions, FlatList, Platform, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import { COLORS, FONT, SIZES } from "../../constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import useAppDispatch from "../../hook/useAppDispatch";
import useAppSelector from "../../hook/useAppSelector";
import tw from 'twrnc';
import { dateDifference } from "../../Utils/Generic";
import { useEffect, useState } from "react";
import { getUserNotificationsAction, updateNotificationAction } from "../../store/actions/userAction";
import { clearUpdateNotificationStatus } from "../../store/reducers/userReducer";

const { width } = Dimensions.get('window');

export default function Notifications() {

    const [notificationId, setNotificationId] = useState<string>('');

    const router = useRouter();
    const dispatch = useAppDispatch();
    const userReducer = useAppSelector(state => state.userReducer);

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
                    onPress={() => router.push('/(tabs)/one')}
                >
                <FontAwesome
                    name='angle-left'
                    size={30}
                    color={COLORS.primary}
                />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: FONT.extraBold,
                        fontSize: SIZES.large,
                        alignSelf: 'center'
                    }}
                >
                    Notification center
                </Text>
            </View>
          </View>
        </View>
    );

    useEffect(() => {
        if(userReducer.updateNotificationStatus === 'completed') {
            dispatch(getUserNotificationsAction())
            router.push({pathname: '/auth/single-notification', params: {notificationId: notificationId}})
            dispatch(clearUpdateNotificationStatus())
        }
    },[userReducer.updateNotificationStatus]);

    return (
        <SafeAreaView style={{flex: 1}}>
            {renderHeader()}
            <FlatList
              data={userReducer.notifications}
              numColumns={1}
              showsVerticalScrollIndicator={false} 
              style={{
                marginHorizontal: 10,
              }}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                {userReducer.getAllUserNotificationStatus !== 'loading' && (<Text
                  style={{
                    fontFamily: FONT.bold,
                    fontSize: SIZES.large
                  }}
                >No notifications found.</Text>)}
              </View>
              )}
              renderItem={({ item, index }) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  marginHorizontal: 10
                }}
                key={item._id}
              >
                <TouchableOpacity
                    style={[{
                    },tw`flex flex-row justify-start items-start mb-5`]}
                    onPress={() => {
                        dispatch(updateNotificationAction({notificationId: item?._id}))
                        setNotificationId(item?._id)
                        // router.push({pathname: '/auth/single-notification', params: {notificationId: item._id}})
                    }}
                >
                    <View
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '80%'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: FONT.bold,
                                fontSize: SIZES.medium,
                                color: item?.status === true ? COLORS.gray : 'black'
                            }}
                        >{item?.notification}
                        </Text>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '20%', gap: 10
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: FONT.regular,
                                fontSize: SIZES.small,
                                color: COLORS.gray
                            }}
                        >
                            {dateDifference(item?.createdAt)}
                        </Text>
                        {/* <View 
                            style={{
                                height: 10,
                                width: 10,
                                borderRadius: 50,
                                backgroundColor: COLORS.lightPrimary
                            }}
                        /> */}
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                        width: '100%',
                        height: 0.5,
                        marginBottom: 20,
                        backgroundColor: COLORS.gray2
                    }}
                />
              </View>
              )}
              ListFooterComponent={() => (
              userReducer.getChatMessagesStatus === 'loading' && (
                  <View
                      style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginVertical: 30
                      }}
                  >
                      <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
              )
              )}
            />
        </SafeAreaView>
    )
}

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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})