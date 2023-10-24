import { View, Text, SafeAreaView, StatusBar, StyleSheet, Image, Keyboard, TouchableWithoutFeedback, ImageBackground, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Button, TextInput, Provider, MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import RobosmeCSS from "../assets/styles/robosme.style";
import { UserContext } from "../context/user.context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Login() {
    const [passwordView, setPasswordView] = useState(true);
    const [userInfo, setUserInfo] = useState({
        organization: "",
        email: "",
        password: ""
    });

    let customContext = useContext(UserContext);

    const [region, setRegion] = useState("eu");
    const [showDropdown, setShowDropdown] = useState(false);
    const regionList = [
        {
            label: "eu",
            value: "eu",
        },
        {
            label: "tr",
            value: "tr",
        }
    ];

    const handleOnchange = (val, name) => {
        setUserInfo({
            ...userInfo,
            [name]: val
        });
    }

    // let apiURL = "https://devapi.robokobi.net/api/SystemUser/Login";
    const handleSubmit = async () => {
        let errorFirstStep = false;
        customContext.setOrganizationName(userInfo.organization);
        customContext.setRegionName(region);

        let newPromise = new Promise((resolve) => {
            resolve(customContext.generateUrls(userInfo.organization, region, "api"));
        });

        let newApiUrl = await newPromise;

        fetch(newApiUrl + "/api/SystemUser/Login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                "UserName": "super@robokobi.com",
                "Password": "r9:w7#3Tz*g6"
            })
        })
            .then(response => {
                // console.log("POST RESPONSE: " + JSON.stringify(response));
                if (response.status == "200") {
                    return response.json();
                }
                else {
                    errorFirstStep = true;
                    Alert.alert(
                        "Hatalı Giriş",
                        "Girmiş olduğunuz Organizasyon Adı veya Bölge yanlıştır. Lütfen tekrar deneyin.",
                        [
                            {
                                text: 'Tamam',
                                onPress: () => { }
                            }
                        ]
                    );
                }
            })
            .then(json => {
                if (json && json.Data) {
                    // console.log(json.Data);

                    let userToken = encodeURIComponent(json.Data);
                    userToken = encodeURI(userToken);
                    // console.log(userToken);

                    customContext.setUserToken(userToken);
                    customContext.setLoggedIn(true);
                }
                else {
                    if (!errorFirstStep) {
                        Alert.alert(
                            "Hatalı Giriş",
                            "E-posta veya Şifre yanlış. Lütfen tekrar deneyin.",
                            [
                                {
                                    text: 'Tamam',
                                    onPress: () => { }
                                }
                            ]
                        );
                    }
                }
                return json;
            })
            .catch(error => {
                // console.error("error: ", error);
            });

        // console.log("apiURL", newApiUrl)
    }

    useEffect(() => {
        // console.log(userInfo);
        // customContext.setOrganizationName(userInfo.organization);
    }, [userInfo]);

    return (
        <PaperProvider settings={{ rippleEffectEnabled: false }}>
            <SafeAreaView style={{ marginTop: StatusBar.currentHeight, ...styles.container, }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <KeyboardAwareScrollView
                        style={{ flex: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.mainContainer}>
                            <View style={styles.textContainer}>
                                <ImageBackground style={styles.backgroundLogo} source={require("../assets/images/logo.png")} >
                                    <Text style={styles.textTitle}>Hoş geldiniz</Text>
                                    <Image style={styles.logo} source={require("../assets/images/robokobi_logo.png")} />
                                </ImageBackground>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.loginText}>Giriş Yap</Text>
                                <View style={styles.flexInputContainer}>
                                    <TextInput
                                        onChangeText={val => handleOnchange(val, "organization")}
                                        value={userInfo.subDomain}
                                        label="Organizasyon adı"
                                        mode="outlined"
                                        outlineColor={RobosmeCSS.Colors.$grayBorder_color}
                                        activeOutlineColor={RobosmeCSS.Colors.$blue_color}
                                        style={styles.textInput}
                                        inputMode="text"
                                    />
                                    <DropDown
                                        inputProps={{
                                            disabled: true,
                                            disableRipple: true,
                                            right: (
                                                <TextInput.Icon
                                                    icon={'chevron-down'}
                                                    onPress={() =>
                                                        setPasswordView(!passwordView)
                                                    }
                                                />
                                            ),
                                            style: styles.textInput,
                                            outlineStyle: ({

                                            })
                                        }}
                                        visible={false}
                                        label={"Bölge"}
                                        mode={"outlined"}
                                        // visible={showDropdown}
                                        showDropDown={() => setShowDropdown(true)}
                                        onDismiss={() => setShowDropdown(false)}
                                        value={region}
                                        setValue={setRegion}
                                        list={regionList}
                                    />
                                </View>
                                <TextInput
                                    onChangeText={val => handleOnchange(val, "email")}
                                    value={userInfo.name}
                                    label="E-posta"
                                    mode="outlined"
                                    outlineColor={RobosmeCSS.Colors.$grayBorder_color}
                                    activeOutlineColor={RobosmeCSS.Colors.$blue_color}
                                    style={styles.textInput}
                                    inputMode="email"
                                />
                                <TextInput
                                    onChangeText={val => handleOnchange(val, "password")}
                                    value={userInfo.password}
                                    label="Şifre"
                                    mode="outlined"
                                    outlineColor={RobosmeCSS.Colors.$grayBorder_color}
                                    activeOutlineColor={RobosmeCSS.Colors.$blue_color}
                                    style={styles.textInput}
                                    secureTextEntry={passwordView}
                                    right={
                                        <TextInput.Icon
                                            icon={passwordView ? 'eye' : 'eye-off'}
                                            onPress={() =>
                                                setPasswordView(!passwordView)
                                            }
                                        />
                                    }
                                />
                                <Button
                                    mode="outlined"
                                    textColor={RobosmeCSS.Colors.$white_color}
                                    labelStyle={styles.btnLoginText}
                                    style={styles.btnLogin}
                                    onPress={() => { handleSubmit() }}
                                >
                                    Giriş Yap
                                </Button>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </TouchableWithoutFeedback>
            </SafeAreaView>
            <ExpoStatusBar style="auto" />
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: RobosmeCSS.Colors.$light_blue_color,
    },
    loginText: {
        width: "100%",
        fontSize: RobosmeCSS.ModerateScale(25),
        fontWeight: "500",
        textAlign: "left",
        marginTop: RobosmeCSS.VerticalScale(20),
        marginBottom: RobosmeCSS.VerticalScale(10)
    },
    inputContainer: {
        marginHorizontal: RobosmeCSS.HorizontalScale(15),
        height: "100%"
    },
    mainContainer: {
    },
    textContainer: {
        // backgroundColor: RobosmeCSS.Colors.$dark_blue_color,
        // paddingHorizontal: 30,
        // paddingVertical: 40,
        // paddingTop: 15,
    },
    textTitle: {
        color: RobosmeCSS.Colors.$white_color,
        fontSize: RobosmeCSS.ModerateScale(25),
        fontWeight: "500"
    },
    backgroundLogo: {
        resizeMode: "contain",
        paddingHorizontal: RobosmeCSS.HorizontalScale(25),
        paddingVertical: RobosmeCSS.VerticalScale(35),
        paddingTop: RobosmeCSS.VerticalScale(20)
    },
    logo: {
        width: "60%",
        height: RobosmeCSS.VerticalScale(60),
        resizeMode: "contain",
        marginTop: RobosmeCSS.VerticalScale(5),
        marginLeft: RobosmeCSS.HorizontalScale(3)
    },
    textInput: {
        marginVertical: RobosmeCSS.VerticalScale(8),
        marginRight: RobosmeCSS.HorizontalScale(8),
        minWidth: "48%"
    },
    btnLogin: {
        backgroundColor: RobosmeCSS.Colors.$blue_color,
        marginTop: RobosmeCSS.VerticalScale(15),
        borderRadius: RobosmeCSS.ModerateScale(5),
        display: "flex",
        justifyContent: "center",
    },
    btnLoginText: {
        fontWeight: "700",
        fontSize: RobosmeCSS.ModerateScale(16),
        letterSpacing: 1,
    },
    flexInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center"
    }
});