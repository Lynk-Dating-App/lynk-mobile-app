import { ActivityIndicator, Dimensions, FlatList, Platform, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, Text, View } from "../../components/Themed";
import { COLORS, FONT, SIZES } from "../../constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect, useRouter } from "expo-router";
import useAppDispatch from "../../hook/useAppDispatch";
import useAppSelector from "../../hook/useAppSelector";
import tw from 'twrnc';
import { dateDifference } from "../../Utils/Generic";
import { useCallback, useEffect, useState } from "react";
import { getUserNotificationsAction, updateNotificationAction, deleteUserNotificationAction } from "../../store/actions/userAction";
import { clearUpdateNotificationStatus } from "../../store/reducers/userReducer";
import { SwipeListView } from 'react-native-swipe-list-view';
import { clearGetAllUserNotificationStatus } from "../../store/reducers/userReducer";
import { clearDeleteUserNotificationStatus } from "../../store/reducers/userReducer";

const { width } = Dimensions.get('window');

export default function Notifications() {

    const [notificationId, setNotificationId] = useState<string>('');
    const [rowData, setRowData] = useState<any>({
        rowData: null,
        rowKey: ''
    })

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

    const onRowDidOpen = (rowKey: any) => {
        console.log('This row opened', rowKey);
    };
    const closeRow = (rowMap: any, rowKey: any) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteNotification = (rowMap: any, rowKey: any) => {
        setRowData({rowMap, rowKey})
        dispatch(deleteUserNotificationAction({notificationId: rowKey}))
    }

    useFocusEffect(
        useCallback(() => {
            dispatch(getUserNotificationsAction())
        },[])
    )
    
    useEffect(() => {
        if(userReducer.updateNotificationStatus === 'completed') {
            dispatch(getUserNotificationsAction())
            router.push({pathname: '/auth/single-notification', params: {notificationId: notificationId}})
            dispatch(clearUpdateNotificationStatus())
        }
    },[userReducer.updateNotificationStatus]);

    useEffect(() => {
        if(userReducer.deleteUserNotificationStatus === 'completed') {
            rowData.rowMap[rowData.rowKey].closeRow();
            dispatch(getUserNotificationsAction());
            dispatch(clearDeleteUserNotificationStatus())
        } else if(userReducer.deleteUserNotificationStatus === 'failed') {

        }
    },[userReducer.deleteUserNotificationStatus]);

    useEffect(() => {
        if(userReducer.getAllUserNotificationStatus === 'completed') {
            setRowData({rowMap: null, rowKey: ''})
            dispatch(clearGetAllUserNotificationStatus())
        }
    },[userReducer.getAllUserNotificationStatus]);
    console.log(userReducer.deleteUserNotificationStatus, 'row data')

    return (
        <SafeAreaView style={{flex: 1}}>
            {renderHeader()}
            <SwipeListView
              refreshControl={
                <RefreshControl 
                    refreshing={userReducer.getMatchesStatus === 'loading'} 
                    onRefresh={() => dispatch(getUserNotificationsAction())}
                />
              }
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
            //   onRowDidOpen={onRowDidOpen}
              renderHiddenItem={(data, rowMap) => (
                <View
                    style={styles.rowBack}
                >
                    <Text></Text>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        onPress={() => closeRow(rowMap, data.item._id)}
                    >
                        <FontAwesome
                            color={COLORS.primary}
                            size={30}
                            name="close"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnRight]}
                        onPress={() => deleteNotification(rowMap, data.item._id)}
                    >
                        {userReducer.deleteUserNotificationStatus !== 'loading' && (<FontAwesome
                            color={COLORS.lightPrimary}
                            size={30}
                            name="trash"
                        />)}
                        {userReducer.deleteUserNotificationStatus === 'loading' && (<ActivityIndicator color={COLORS.white}/>)}
                    </TouchableOpacity>
                    
                </View>
                )}
                leftOpenValue={0}
                rightOpenValue={-160}
            
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
              renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  paddingLeft: 10,
                  height: 70,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                key={item._id}
              >
                <TouchableOpacity
                    style={[{

                    },tw`flex flex-row justify-between items-center my-5`]}
                    onPress={() => {
                        dispatch(updateNotificationAction({notificationId: item?._id}))
                        setNotificationId(item?._id)
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
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                        width: '100%',
                        height: 0.5,
                        // marginTop: 30,
                        backgroundColor: COLORS.lightPrimary
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
    rowBack: {
        alignItems: 'center',
        // backgroundColor: '#DDD',
        flex: 1,
        // display: 'flex',
        marginTop: 10,
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backTextWhite: {
        color: '#FFF',
    },
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
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: COLORS.lightPrimary,
        right: 80,
        borderRadius: 10
    },
    backRightBtnRight: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        right: 0,
    },
})