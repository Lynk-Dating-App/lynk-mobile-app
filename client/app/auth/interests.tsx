import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, Text, View } from "../../components/Themed";
import AppBtn from "../../components/common/button/AppBtn";
import { useRouter } from "expo-router";
import { COLORS, FONT, SIZES, icons } from "../../constants";
import { retrieveData, storeData } from "../../components/LocalStorage/LocalStorage";

const interests = [
    {value: 'Photography', icon: icons.camera, iconWhite: icons.cameraWhite},
    {value: 'Shopping', icon: icons.bag, iconWhite: icons.bag_white},
    {value: 'Karaoke', icon: icons.music, iconWhite: icons.music_white},
    {value: 'Yoga', icon: icons.viencharts, iconWhite: icons.viencharts_white},
    {value: 'Cooking', icon: icons.noodles, iconWhite: icons.noodles_white},
    {value: 'Tennis', icon: icons.tennis, iconWhite: icons.tennis_white},
    {value: 'Run', icon: icons.sport, iconWhite: icons.sport_white},
    {value: 'Swimming', icon: icons.ripple, iconWhite: icons.ripple_white},
    {value: 'Art', icon: icons.platte, iconWhite: icons.platte_white},
    {value: 'Travelling', icon: icons.outdoor, iconWhite: icons.outdoor_white},
    {value: 'Extreme', icon: icons.parachute, iconWhite: icons.parachute_white},
    {value: 'Music', icon: icons.music, iconWhite: icons.music_white},
    {value: 'Drink', icon: icons.goblet, iconWhite: icons.goblet_white},
    {value: 'Video games', icon: icons.game, iconWhite: icons.game_white}
]

const Interests = () => {
    const router = useRouter();
    const [activeInterests, setActiveInterests] = useState<string[]>([]);
    const [gender, setGender] = useState<any>(null);

    const handleActive = (name: string) => {
        // Toggle the selection of interests
        setActiveInterests((active) =>
            active.includes(name)
                ? active.filter((item) => item !== name)
                : [...active, name]
        );
    };

    const data = interests.map((interest, index) => ({
        key: String(index),
        interest,
    }));

    const handleData = () => {
        const payload = {
            gender: gender.gender,
            interests: activeInterests
        }
        storeData("profile-data", JSON.stringify(payload))
        router.push('/auth/profile-detail')
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await retrieveData('profile-data');
            if (data) {
                const gender = JSON.parse(data)
                setGender(gender);
            }
          } catch (error) {
            console.error(error);
            // Handle the error (e.g., show an error message)
          }
        };
    
        fetchData();
    }, []);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
            <FlatList
                data={data}
                numColumns={2}
                showsVerticalScrollIndicator={false} 
                style={{
                    marginHorizontal: 10,
                    backgroundColor: 'transparent'
                }}
                keyExtractor={(item) => item.key}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => handleActive(item.interest.value)}
                        style={{
                            flex: 1,
                            height: 60,
                            margin: 10,
                            backgroundColor: activeInterests.includes(item.interest.value) ? COLORS.primary : 'transparent',
                            borderWidth: 1,
                            borderColor: COLORS.gray2,
                            borderRadius: 20,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                            flexDirection: 'row',
                            gap: 10,
                        }}
                    >
                        {/* <FontAwesome
                            name={item.interest.icon as any}
                            size={20}
                            color={active === index ? 'white' : COLORS.primary}
                        /> */}
                        <Image
                            source={activeInterests.includes(item.interest.value) ? item.interest.iconWhite : item.interest.icon }
                            resizeMode='cover'
                            //@ts-ignore
                            style={{
                                height: 20,
                                width: 20
                            }}
                        />
                        <Text
                            style={{
                            color: activeInterests.includes(item.interest.value) ? 'white' : 'black',
                            fontFamily: FONT.bold,
                            fontSize: SIZES.small,
                            }}
                        >
                            {item.interest.value}
                        </Text>
                    </TouchableOpacity>
                )}
                ListHeaderComponent={() => (
                    <>
                        <View style={styles.backBtnContainer}>
                            <AppBtn
                                handlePress={() => router.back()}
                                isImage={true}
                                iconUrl={icons.backBtn}
                                dimension={35}
                            />
                            <Text
                                onPress={() => router.push('/auth/profile-detail')}
                                style={{
                                    fontFamily: FONT.bold,
                                    color: COLORS.primary,
                                    fontSize: SIZES.medium,
                                    marginRight: 30
                                }}
                            >
                                Skip
                            </Text>
                        </View>
                        <View style={styles.container}>
                            <Text
                                style={{
                                    marginTop: 40,
                                    fontFamily: FONT.extraBold,
                                    fontSize: SIZES.xxLarge,
                                    color: 'black', marginBottom: 10
                                }}
                            >
                                Your interests
                            </Text>
                            <Text
                                style={{
                                    fontFamily: FONT.regular,
                                    fontSize: SIZES.medium,
                                    color: COLORS.tertiary,
                                    marginBottom: 20
                                }}
                            >
                                Select a few of your interests and let everyone know what you’re passionate about
                            </Text>
                            
                        </View>
                    </>
                )}
                ListFooterComponent={() => (
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 60
                        }}
                    >
                        <AppBtn 
                            handlePress={handleData}
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
                                marginBottom: 20
                            }}
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        paddingHorizontal: 20
    },
    backBtnContainer: {
        backgroundColor: 'transparent',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginTop: 25,
        marginBottom: -10
    },
})

export default Interests;