import { View, Text, SafeAreaView, Keyboard, TouchableWithoutFeedback, ImageBackground, Alert, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Button, TextInput, Provider, MD3LightTheme as DefaultTheme, PaperProvider, Checkbox } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import RobosmeCSS from "../assets/styles/robosme.style";
import { UserContext } from "../context/user.context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SvgGenerator from "../components/utils/SvgGenerator";
import Spacer from "../components/utils/Spacer";
import '../assets/i18n/i18n';
import { useTranslation } from 'react-i18next';
import EStyleSheet from 'react-native-extended-stylesheet';
import CustomTextInput from "../components/input/TextInput.component";

export default function Login() {
    const { t } = useTranslation();

    const [passwordView, setPasswordView] = useState(true);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [submitProgress, setSubmitProgress] = useState(false);
    const [userInfo, setUserInfo] = useState({
        organization: "",
        password: "",
        email: "",
    });

    const [inputValidation, setInputValidation] = useState({
        organization: false,
        password: false,
        email: false,
        emailText: false
    })

    let customContext = useContext(UserContext);

    const [region, setRegion] = useState("eu");
    const [showDropdown, setShowDropdown] = useState(false);
    const regionList = [{ label: "eu", value: "eu" }, { label: "tr", value: "tr" }];

    const handleOnchange = (val, name) => {
        setUserInfo({
            ...userInfo,
            [name]: val
        });
    }

    const handleInputValidation = (forgotPassword = false) => {
        let inputs = Object.keys(userInfo);
        let finalVals = {};
        let returnVal = true;

        inputs.map(input => {
            finalVals[input] = userInfo[input] == "";

            if (userInfo[input] == "") {
                if (forgotPassword && input == "password") {
                    finalVals[input] = false;
                }
                else {
                    returnVal = false;
                }
            }
            else if (input == "email") {
                let isMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userInfo.email);

                if (!isMail) {
                    finalVals["email"] = true;
                    finalVals["emailText"] = true;

                    returnVal = false;
                }
                else {
                    finalVals["emailText"] = false;
                }
            }
        });

        setInputValidation(finalVals);

        return returnVal;
    }

    const handleSubmit = async () => {
        setSubmitProgress(true);
        Keyboard.dismiss();
        let validation = handleInputValidation(forgotPassword);
        if (!validation) {
            setSubmitProgress(false);
            return null;
        }

        let errorFirstStep = false;
        customContext.setOrganizationName(userInfo.organization);
        customContext.setRegionName(region);

        let apiUrlPromise = new Promise((resolve) => {
            resolve(customContext.generateUrls(userInfo.organization, region, "api"));
        });
        let newUrl = await apiUrlPromise;

        if (!forgotPassword) {
            //Login
            fetch(newUrl + "/api/SystemUser/Login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    // "UserName": "super@robokobi.com",
                    // "Password": "r9:w7#3Tz*g6"
                    "UserName": "testuser@robosme.com",
                    "Password": "tZ3*4x2!e"
                })
            })
                .then(response => {
                    if (response.status == "200") {
                        return response.json();
                    }
                    else {
                        errorFirstStep = true;
                        Alert.alert(t("alert_wrongOrgOrRegion_title"), t("alert_wrongOrgOrRegion_body"), [{ text: t("global_okay"), onPress: () => { } }]);
                    }
                })
                .then(json => {
                    if (json && json.Data) {
                        let userToken = encodeURIComponent(json.Data);
                        userToken = encodeURI(userToken);
                        // console.log(userToken);

                        customContext.setUserToken(userToken);
                        customContext.setLoggedIn(true);
                    }
                    else {
                        if (!errorFirstStep) {
                            Alert.alert(t("alert_wrongMailOrPass_title"), t("alert_wrongMailOrPass_body"), [{ text: t("global_okay"), onPress: () => { } }]);
                        }
                    }
                    setSubmitProgress(false);
                    return json;
                })
                .catch(error => {
                    Alert.alert(t("error"), t("login_fetch_error"), [{ text: t("global_okay"), onPress: () => { } }]);
                    console.error("error: ", error);
                    setSubmitProgress(false);
                });
        }
        else {
            //Forgot Password
            fetch(newUrl + "/api/SystemUser/CheckSystemUser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    "Email": "super@robokobi.com"
                })
            })
                .then(response => {
                    if (response.status == "200") {
                        return response.json();
                    }
                    else {
                        errorFirstStep = true;
                        Alert.alert(t("alert_forgotPass_userNotFound_title"), t("alert_forgotPass_userNotFound_body"), [{ text: t("global_okay"), onPress: () => { } }]);

                        setSubmitProgress(false);
                        return null;
                    }
                })
                .then(async json => {
                    if (json && json.Success) {
                        //Email fetch
                        //---
                        let newPromiseSecond = new Promise((resolve) => {
                            resolve(customContext.generateUrls(userInfo.organization, region, "site"));
                        });
                        let newUrlSecond = await newPromiseSecond;

                        const formData = new FormData();
                        formData.append("Email", "super@robokobi.com");
                        formData.append("OrganizationName", "dev");
                        formData.append("TemplateType", "7");
                        fetch(newUrlSecond + "/User/DynamicMailSend", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            body: formData
                        })
                            .then(response => {
                                if (response.status == "200") {
                                    return response.json();
                                }
                                else {
                                    errorFirstStep = true;
                                    Alert.alert(t("alert_forgotPass_userNotFound_title"), t("alert_forgotPass_userNotFound_body"), [{ text: t("global_okay"), onPress: () => { } }]);
                                }
                            })
                            .then(json => {
                                if (json && json.Success) {
                                    Alert.alert(t("alert_forgotPass_mailSend_title"), t("alert_forgotPass_mailSend_body"), [{ text: t("global_okay"), onPress: () => { } }]);

                                    setSubmitProgress(false);
                                    setForgotPassword(false);
                                }
                            })
                    }
                    else {
                        if (!errorFirstStep) {
                            errorFirstStep = true;
                            Alert.alert(t("alert_forgotPass_userNotFound_title"), t("alert_forgotPass_userNotFound_body"), [{ text: 'Tamam', onPress: () => { } }]);
                        }
                        setSubmitProgress(false);
                    }

                    return json;
                })
                .catch(error => {
                    Alert.alert(t("error"), t("login_fetch_error"), [{ text: t("global_okay"), onPress: () => { } }]);
                    console.error("error: ", error);
                    setSubmitProgress(false);
                });
        }
    }

    useEffect(() => {
        // console.log(userInfo);
        // customContext.setOrganizationName(userInfo.organization);
    }, [userInfo]);

    return (
        <PaperProvider settings={{ rippleEffectEnabled: false }}>
            <SafeAreaView style={{ ...styles.container, }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ImageBackground style={styles.backgroundLogo} source={require("../assets/images/robosme_background_1.png")} >
                        <KeyboardAwareScrollView style={{ flex: 1, height: "100%", width: "100%" }} keyboardShouldPersistTaps="handled" >
                            <View style={styles.mainContainer}>
                                <View>
                                    <SvgGenerator svgPath={"Robosme_Logo_1"} />
                                    <SvgGenerator svgPath={t("login_crmToWin_svg")} style={{ marginTop: 11 }} />
                                </View>
                                <Spacer style={{ height: 35 }} />
                                <View>
                                    <Text style={styles.signInTitle} >
                                        {!forgotPassword ? t("login_signIn_title") : t("changePassword_title")}
                                    </Text>
                                    <Text style={styles.signInText} adjustsFontSizeToFit={true} numberOfLines={2} >
                                        {!forgotPassword ? t("login_signIn_text") : t("changePassword_text")}
                                    </Text>
                                </View>
                                <Spacer style={{ height: 30 }} />
                                <View>
                                    <View style={styles.flexInputContainer}>
                                        <View style={{ flex: 1, width: "50%", marginRight: 15 }}>
                                            <CustomTextInput
                                                onChangeText={val => handleOnchange(val, "organization")}
                                                value={userInfo.organization}
                                                label={null}
                                                mode="outlined"
                                                outlineColor={"transparent"}
                                                activeOutlineColor={"transparent"}
                                                style={[styles.textInput]}
                                                inputMode="text"
                                                helperShow={inputValidation.organization}
                                                helperText={t("login_organization_validation")}
                                                labelStyle={styles.label}
                                                labelText={t("login_organization")}
                                                autoCapitalize={"none"}
                                            />
                                        </View>

                                        <View style={{ flex: 1, width: "50%" }}>
                                            <Text style={styles.label}>{t("login_region")}</Text>
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
                                                    style: [styles.textInput],
                                                    outlineStyle: ({
                                                        borderWidth: 1,
                                                        borderColor: "white",
                                                        borderRadius: 4
                                                    })
                                                }}
                                                visible={false}
                                                label={null}
                                                mode={"outlined"}
                                                // visible={showDropdown}
                                                showDropDown={() => setShowDropdown(true)}
                                                onDismiss={() => setShowDropdown(false)}
                                                value={region}
                                                setValue={setRegion}
                                                list={regionList}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <CustomTextInput
                                            onChangeText={val => handleOnchange(val, "email")}
                                            value={userInfo.email}
                                            label={null}
                                            mode="outlined"
                                            outlineColor={RobosmeCSS.Colors.$grayBorder_color}
                                            activeOutlineColor={RobosmeCSS.Colors.$blue_color}
                                            style={styles.textInput}
                                            inputMode="email"
                                            helperShow={inputValidation.email}
                                            helperText={inputValidation.emailText ? t("login_email_validation_2") : t("login_email_validation")}
                                            labelStyle={styles.label}
                                            labelText={t("login_email")}
                                            autoCapitalize={"none"}
                                        />
                                    </View>
                                    {
                                        !forgotPassword && (
                                            <View>
                                                <CustomTextInput
                                                    onChangeText={val => handleOnchange(val, "password")}
                                                    value={userInfo.password}
                                                    label={null}
                                                    mode="outlined"
                                                    outlineColor={RobosmeCSS.Colors.$grayBorder_color}
                                                    activeOutlineColor={RobosmeCSS.Colors.$blue_color}
                                                    style={styles.textInput}
                                                    secureTextEntryActive={true}
                                                    helperShow={inputValidation.password}
                                                    helperText={t("login_password_validation")}
                                                    labelStyle={styles.label}
                                                    labelText={t("login_password")}
                                                />
                                            </View>
                                        )
                                    }
                                    <Button
                                        disabled={submitProgress}
                                        mode="outlined"
                                        textColor={RobosmeCSS.Colors.$white_color}
                                        labelStyle={styles.btnLoginText}
                                        style={styles.btnLogin}
                                        onPress={() => {
                                            handleSubmit()
                                        }}
                                    >
                                        {!forgotPassword ? t("login_signIn_button") : t("changePassword_button")}
                                    </Button>
                                    <View>
                                        <Pressable
                                            onPress={() => {
                                                setForgotPassword(!forgotPassword);
                                                setInputValidation({
                                                    email: false,
                                                    organization: false,
                                                    password: false
                                                });
                                                setUserInfo({
                                                    email: "",
                                                    organization: "",
                                                    password: ""
                                                })
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: "400",
                                                    letterSpacing: 0.5,
                                                    marginTop: 20,
                                                    color: "white"
                                                }}
                                            >
                                                {forgotPassword ? t("changePassword_cancel") : t("login_forgotPassword")}
                                            </Text>
                                        </Pressable>
                                    </View>
                                    <Spacer style={{ height: 40 }} />
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            </SafeAreaView>
            <ExpoStatusBar style="auto" />
        </PaperProvider>
    );
}

const styles = EStyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignSelf: "center",
        paddingHorizontal: "10%",
        paddingTop: "7rem",
        maxWidth: "50rem",
        // paddingTop: "30%",
        // paddingHorizontal: RobosmeCSS.HorizontalScale(40),
        // paddingTop: RobosmeCSS.VerticalScale(50),
        // paddingTop: RobosmeCSS.VerticalScale(90),
        // paddingBottom: RobosmeCSS.VerticalScale(10),
    },
    backgroundLogo: {
        flex: 1,
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        backgroundColor: RobosmeCSS.Colors.$light_blue_color,
    },
    textInput: {
        marginVertical: 9,
        fontSize: "0.9rem",
        height: "2.8rem",
        // marginVertical: RobosmeCSS.VerticalScale(8),
        // fontSize: 14,
        // height: 45,
    },
    btnLogin: {
        backgroundColor: RobosmeCSS.Colors.$robosme_purple,
        borderColor: "transparent",
        marginTop: "1.5rem",
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        // marginTop: RobosmeCSS.VerticalScale(15),
        // borderRadius: RobosmeCSS.ModerateScale(5),
    },
    // btnLoginText: {
    //     fontWeight: "700",
    //     // fontSize: RobosmeCSS.ModerateScale(16),
    //     fontSize: 16,
    //     letterSpacing: 1,
    // },
    flexInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center"
    },
    label: {
        color: "white",
        display: "flex",
        justifyContent: "flex-end",
        height: "1.2rem",
        fontSize: "0.8rem",
        marginTop: "0.3rem",
        marginBottom: "-0.2rem"
        // height: 20,
    },
    signInTitle: {
        fontSize: "2rem",
        fontWeight: "900",
        color: "white",
        // fontSize: 24,
        // fontSize: RobosmeCSS.FontSizeHelper(26),
    },
    signInText: {
        fontSize: 14,
        fontSize: "1rem",
        fontWeight: "400",
        color: "white",
        letterSpacing: 0.16,
        marginTop: 5,
        marginTop: "0.2rem",
        // fontSize: RobosmeCSS.FontSizeHelper(16),
    }
});