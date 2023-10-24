import React, { useContext, useState, useEffect, useRef } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Button, Keyboard, Dimensions } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { HeaderBackButton } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import { UserContext } from "../../context/user.context";
import CookieManager from '@react-native-cookies/cookies';
import Loading from "../loading/Loading";

export default function WebViewPage({ route, navigation, mainPage = true, isPopup = false }) {
    let userData = useContext(UserContext),
        url = userData.siteURL,
        SITE_URL = userData.siteURL;

    if (!url.includes("https://")) {
        url = "https://" + url;
    }

    const [loading, setLoading] = useState(true);
    const [loginPage, setLoginPage] = useState(true);
    const noneURLs = [`${url}media/pdf/test1.pdf#toolbar=0`, "about:blank"];

    const webViewRef = useRef();

    let currentY;

    useEffect(() => {
        CookieManager.clearAll()
            .then((success) => {
                // console.log('CookieManager.clearAll =>', success);
            });

        CookieManager.set(SITE_URL, {
            name: 'AdminToken',
            value: userData.userToken,
            path: '/',
            version: '1',
            expires: '2094-05-30T12:30:00.00-05:00',
        }).then((done) => {
            CookieManager.set(SITE_URL, {
                name: 'UserLanguage',
                value: userData.currentLanguage?.toString(),
                path: '/',
                version: '1',
                expires: '2094-05-30T12:30:00.00-05:00',
            }).then((done) => {
                webViewRef.current.reload();
            });
        })
    }, []);

    if (route.params?.url) {
        url = route.params.url;
        if (url) {
            url = url.toString();
            if (url.includes("&closeAfterSave=true")) {
                url = url.replace("&closeAfterSave=true", "");
            }
        }
        else {
            return false;
        }
    }

    function onPressUrlActions(e, i) {
        if (e && e.url && noneURLs.includes(e.url)) {
            return false;
        }

        setLoginPage(url.includes("User/Login"));
        userData.setLoggedIn(!e.url.endsWith("User/Login"));

        if (e.url.includes("closeAfterSave") || !e.url.includes(userData.siteURL)) {
            userData.setWebviewRef(userData.webviewRef + 1);
            navigation.push("DetailPage", {
                url: e.url
            });
            return false;
        }
        else {
            userData.setWebviewURL(e.url);
            return true;
        }
    }

    async function handleLoading(isLoading = false, delay = 0) {
        let newPromise = new Promise((resolve) => {
            setTimeout(() => {
                resolve(setLoading(isLoading))
            }, delay);
        });
        let returnVal = await newPromise;

        return returnVal;
    }

    const handleOnScroll = (e) => {
        currentY = e.nativeEvent.contentOffset.y;
    }

    const handleTouchStart = (event) => {
        const { pageX, pageY } = event.nativeEvent;
    }

    const handleTouchEnd = (event) => {
        const { pageX, pageY } = event.nativeEvent;
    }

    const handleMessage = (message) => {
        if (message == "modalOpen") {
            userData.setTabBarVisible(false);
        }
        else if (message == "modalClose") {
            userData.setTabBarVisible(true);
        }
        else {
            // console.log("Message to App: ", message);
        }
    }

    const popupJavascript = `
        $("#TopBar").hide();
        $(".subscription__badge-top").hide();
        $(".gdetail.sticky .gdetail-body .nav-tabs").css("top", "102px")
        $("#kt_wrapper.subscription--badge-top-visible:has(.subscription__badge-top)").css("padding-top", 0);
        $(".gdetail#formGeneratorMainContainer #headerPart").css("top", 0);
    `;

    const { width } = Dimensions.get('window');
    const injectedJavaScript = `
        (function() {

            ${route.params?.extraJS}

            const closeBtn = document.querySelector("span.topbarbuttons_closebtn");
            if(closeBtn){
                closeBtn.style.position = "sticky";
                closeBtn.style.bottom = "-10px";
                closeBtn.style.zIndex = "9999999";
                closeBtn.style.order = "9999999";
            }

            $(document).on('show.bs.modal', '.modal', function () {
                window.ReactNativeWebView?.postMessage("modalOpen");
            });

            $(document).on('hide.bs.modal', '.modal', function () {
                window.ReactNativeWebView?.postMessage("modalClose");
            });

            $(".menu-nav.mt-auto.settingsmenu-btn-wrapper").css({
                "visibility": "hidden",
                "padding-top": "50px"
            })

            $("#topbarbuttons_toggle").css({
                "width": "13%",
                "max-width": "6rem",
                "height": "auto",
                "aspect-ratio": "1",
                "right": "3%"
            });

            $(".gdetail .builder-wrapper .builder-header .topbarbuttons_closebtn").css({
                "padding-right": "9%",
            })

            ${!(mainPage && !isPopup) && popupJavascript}
        })();
    `;

    useEffect(() => {
        if ((mainPage ? userData.webviewURL : url).includes(userData.siteURL + "/User/Login?url")) {
            console.log("login page redirect");
            userData.setWebviewURL(userData.siteURL);
            // userData.setUserToken("Deleted");
            // userData.setCurrentPage("Login");
            // userData.setLoggedIn(false);
        }
    }, [userData.webviewURL])

    return (
        <>
            <SafeAreaView
                style={{
                    marginTop: ((mainPage && !isPopup) || route.params?.selectedPage) ? StatusBar.currentHeight : 0,
                    ...styles.container
                }}
            >
                {
                    loading && (
                        <Loading
                            BackgroundColor={"rgba(255, 255, 255, 1)"}
                            MarginTop={0}
                        />
                    )
                }
                <WebView
                    style={{ flex: 1 }}
                    ref={(ref) => { webViewRef.current = ref }}
                    key={userData.webviewRef}
                    source={{
                        uri: mainPage ? userData.webviewURL : url,
                    }}
                    userAgent="RobosmeApp"
                    textZoom={100}
                    useWebView2={true}
                    // onTouchStart={(e) => { handleTouchStart(e) }}
                    // onTouchEnd={(e) => { handleTouchEnd(e) }}
                    nestedScrollEnabled
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    cacheEnabled={true}
                    injectedJavaScript={injectedJavaScript}
                    sharedCookiesEnabled={true}
                    javaScriptEnabledAndroid={true}
                    bounces={false}
                    setSupportMultipleWindows={false}
                    useWebKit={true}
                    onLoadStart={() => { handleLoading(true, 0) }}
                    onMessage={(message) => handleMessage(message.nativeEvent?.data)}
                    onLoadEnd={(e) => {
                        // setTimeout(() => {
                        //     console.log("send message")
                        //     webViewRef.current.postMessage("Message to Web");
                        // }, 2000);


                        // setLoading(false);
                        handleLoading(false, route.params?.loadingSettings?.delay);

                        if (mainPage && !loginPage) {
                            navigation.setOptions({
                                headerShown: false,
                                headerTitleAlign: "center",
                                headerLeft: () => (
                                    title &&
                                    <Button
                                        onPress={() => navigation.goBack()}
                                        title="<"
                                        color="#fff"
                                    />
                                ),
                            });
                        }
                    }}
                    onShouldStartLoadWithRequest={e => {
                        return onPressUrlActions(e, "3");
                    }}
                />
            </SafeAreaView>
            <ExpoStatusBar backgroundColor="#253858" style="light" />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
        // backgroundColor: "#253858"
    },
});