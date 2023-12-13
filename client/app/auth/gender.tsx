import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, ScrollView, Text, View } from "../../components/Themed";
import AppBtn from "../../components/common/button/AppBtn";
import { COLORS, FONT, SIZES } from "../../constants";
import { useRouter } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getTokenFromSecureStore } from "../../components/ExpoStore/SecureStore";
import settings from "../../config/settings";
import { jwtDecode } from "jwt-decode";
import { decode as base64Decode } from 'base-64';
import { storeData } from "../../components/LocalStorage/LocalStorage";
// import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get('window');
const genderData = ['Male', 'Female']

const Gender = () => {
    const router = useRouter();
    const [gender, setGender] = useState<string>('');
    const [active, setActive] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleActive = (index: number) => {
        setActive(index)
        if(index === 0) {
            setGender('male')
        } else if (index === 1) {
            setGender('female')
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getTokenFromSecureStore(settings.auth.admin);
            if (data) {
                
                const payloadBase64 = data.split('.')[1];
                const decodedPayload = base64Decode(payloadBase64);
                const decodedPayloadJSON = JSON.parse(decodedPayload);

                console.log('Decoded Payload:', decodedPayloadJSON.level);

            }
          } catch (error) {
            console.error(error);
            // Handle the error (e.g., show an error message)
          }
        };
    
        fetchData();
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text
                        style={{
                            marginTop: 80,
                            fontFamily: FONT.extraBold,
                            fontSize: SIZES.xxLarge,
                            color: 'black', marginBottom: 150
                        }}
                    >
                        Gender
                    </Text>
                    {
                        genderData.map((gender, index) => {
                            return (
                                <View
                                    key={index}
                                    style={{
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => handleActive(index)}
                                        style={{
                                            width: '90%',
                                            height: 60,
                                            backgroundColor: active === index ? COLORS.primary :'transparent',
                                            borderWidth: 1,
                                            borderColor: COLORS.tertiary,
                                            borderRadius: 20,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingHorizontal: 20, marginBottom: 20,
                                            alignSelf: 'center',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: active === index ? 'white' : 'black',
                                                fontFamily: FONT.bold,
                                                fontSize: SIZES.medium
                                            }}
                                        >{ gender }</Text>
                                        {active === index && (<FontAwesome
                                            name="check"
                                            size={20}
                                            color={'white'}
                                        />)}
                                    </TouchableOpacity>
                                    
                                </View>
                            )
                        })
                    }
                </View>
                {/* {!isLoading && <ActivityIndicator size="large" color={'black'} />} */}
                {/* <Spinner
                    visible={false}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                /> */}
            </ScrollView>
            <View
                style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'flex-end',
                    alignSelf: 'center',
                    width: '80%'
                }}
            >
                <AppBtn 
                    handlePress={() => {
                        storeData('profile-data', JSON.stringify({gender: gender}))
                        router.push('/auth/interests')
                    }}
                    isText={true}
                    btnTitle={'Continue'} 
                    btnWidth={'100%'} 
                    btnHeight={60} 
                    btnBgColor={COLORS.primary}
                    btnTextStyle={{
                        fontSize: SIZES.medium,
                        fontFamily: FONT.bold
                    }}
                    btnStyle={{
                        marginBottom: 20
                    }}
                    isDisabled={gender === ''}
                />
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        paddingHorizontal: 20,
        zIndex: 5
    },
    backBtnContainer: {
        backgroundColor: 'transparent',
        width: width,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 15,
        marginTop: 25,
    },
})

export default Gender;