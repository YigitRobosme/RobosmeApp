import { View, Text, TouchableWithoutFeedback, StyleSheet, Image, ImageBackground, Pressable, StatusBar } from 'react-native'
import React, { useContext } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UserContext } from "../../context/user.context";
import { useTranslation } from 'react-i18next';
import CookieManager from '@react-native-cookies/cookies';
import SvgGenerator from '../../components/utils/SvgGenerator';
import { useEffect } from 'react';
import WebViewPage from '../../components/webview/WebViewPage';
import EStyleSheet from 'react-native-extended-stylesheet';
import Loading from '../../components/loading/Loading';

export default function Details({ route, navigation }) {
    let userData = useContext(UserContext);
    const { t, i18n } = useTranslation();
    const pageType = route?.params?.type;
    const pageTitle = route?.params?.title;
    const languages = [
        {
            name: "tr",
            title: "Türkçe",
            iconName: "Tick",
            iconColor: "#2E68D9",
            iconWidth: 16,
            iconHeight: 16,
        },
        {
            name: "en",
            title: "English",
            iconName: "Tick",
            iconColor: "#2E68D9",
            iconWidth: 16,
            iconHeight: 16,
        },
    ];

    useEffect(() => {
        // navigation.setOptions({
        //     title: t(pageTitle),
        //     headerTitleAlign: "center",
        // });
    }, [userData.currentLanguage])

    const handleCookiesAndLanguage = (language = "tr") => {
        i18n
            .changeLanguage(language)
            .then(() => {
                userData.setCurrentLanguage(language);
                CookieManager.clearAll();
                CookieManager.set(userData.siteURL, {
                    path: '/',
                    secure: true,
                    name: 'AdminToken',
                    value: userData.userToken,
                    version: '1',
                    expires: '2094-05-30T12:30:00.00-05:00',
                });
                CookieManager.set(userData.siteURL, {
                    path: '/',
                    secure: true,
                    name: 'UserLanguage',
                    value: language,
                    version: userData.webviewRef + 1,
                    expires: '2094-05-30T12:30:00.00-05:00',
                }).then((done) => {
                    userData.setWebviewRef(userData.webviewRef + 1);
                    userData.setWebviewLoad(true);
                });
            })
            .catch(err => console.log(err));
    }

    function LanguageDetail() {
        return (
            <KeyboardAwareScrollView style={{ backgroundColor: "#fff" }}>
                <View>
                    {/* <Text style={styles.title}>
                        {t("page_settings_changeLanguage")}
                    </Text> */}
                    <View style={styles.languageView}>
                        {
                            languages.map((x, i) => {
                                return (
                                    <TouchableWithoutFeedback key={i} onPress={() => handleCookiesAndLanguage(x.name)}>
                                        <View style={styles.languageItem}>
                                            <Text style={[styles.languageTitle, {
                                                color: userData.currentLanguage == x.name ? "#2E68D9" : "#000000",
                                                fontWeight: userData.currentLanguage == x.name ? "600" : "400",
                                            }]}>
                                                {x.title}
                                            </Text>
                                            {userData.currentLanguage == x.name && (
                                                <SvgGenerator
                                                    svgPath={x.iconName}
                                                    fill={x.iconColor}
                                                    width={x.iconWidth}
                                                    height={x.iconHeight}
                                                    style={{
                                                        position: "absolute",
                                                        right: 0,
                                                        paddingHorizontal: 30
                                                    }}
                                                />
                                            )}
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            })
                        }
                    </View>
                </View>
            </KeyboardAwareScrollView>
        )
    }

    function PrivacyLegacy() {
        route.params.selectedPage = "Privacy";
        route.params.url = "https://robosme.com/kvkk-genel-aydinlatma-metni";
        route.params.extraJS = `
            $("section.content-page").css("padding-top", 0);
            $(".content-page__title").css("padding-top", 0);
            $("header#header").css("display", "none");
            $(".cookie-consent").css("display", "none");
        `;
        route.params.loadingSettings = { delay: 2000 }
        return (
            <View style={{ flex: 1, height: "100%", marginTop: -StatusBar.currentHeight, }}>
                <WebViewPage route={route} navigation={navigation} mainPage={false} />
            </View>
        )
    }

    return (
        <View style={{
            flex: 1,
            height: "100%",
            backgroundColor: "#fff"
        }}>
            <Pressable
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#F3F3F3",
                    paddingVertical: 15,
                    paddingHorizontal: 25,
                }}
                onPress={() => navigation.goBack()}>
                <SvgGenerator
                    svgPath={"Back_Arrow"}
                    fill={"#2E68D9"}
                    width={12}
                    height={12}
                    style={{
                        flex: 1,
                        // marginTop: 5,
                        marginRight: 5
                    }}
                />
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ fontSize: 15, fontWeight: "500", height: 20 }}>
                    {t("page_back_button")}
                </Text>
            </Pressable>
            {pageType != "privacy" && (
                <View style={styles.customHeader}>
                    <Text style={styles.customHeaderText}>
                        {t(pageTitle)}
                    </Text>
                </View>
            )}
            {
                pageType == "language" && <LanguageDetail />
            }
            {
                pageType == "privacy" && <PrivacyLegacy />
            }
        </View>
    )
}

const styles = EStyleSheet.create({
    languageView: {
        flex: 1,
        backgroundColor: "#fff"
        // flexDirection: "row",
        // flexWrap: "wrap",
        // justifyContent: "center"
    },
    languageItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderBottomColor: "#aeaeae",
        borderBottomWidth: 1
    },
    languageTitle: {
        fontSize: 14,
    },
    title: {
        paddingTop: 15,
        paddingBottom: 5,
        width: "100%",
        textAlign: "center",
        fontSize: 15,
        letterSpacing: 0.3,
        fontFamily: "sans",
        fontWeight: "900"
    },
    backgroundLogo: {
        flex: 1,
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    customHeader: {
        height: 70,
        justifyContent: "flex-end",
        alignContent: "center",
        paddingBottom: 15,
        paddingLeft: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#E1DFEE"
    },
    customHeaderText: {
        fontSize: 21,
        fontFamily: "roboto",
        fontWeight: "700"
    }
})