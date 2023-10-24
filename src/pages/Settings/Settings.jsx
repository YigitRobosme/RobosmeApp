import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useContext } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UserContext } from "../../context/user.context";
import SvgGenerator from '../../components/utils/SvgGenerator';
import { useTranslation } from 'react-i18next';

export default function Settings({ navigation }) {
    const { t } = useTranslation();
    const userData = useContext(UserContext);
    const menuList = [
        {
            name: "language",
            title: "page_settings_language_title",
            iconName: "Right_Arrow",
            iconColor: "#B5B2C9",
            iconWidth: 18,
            iconHeight: 18,
        },
        {
            name: "privacy",
            title: "page_settings_privacy_title",
            iconName: "Right_Arrow",
            iconColor: "#B5B2C9",
            iconWidth: 18,
            iconHeight: 18,
        },
        {
            name: "logout",
            title: "page_settings_logout_title",
            iconName: "Exit_Arrow",
            iconColor: "#2E68D9",
            iconWidth: 24,
            iconHeight: 24,
            onPressAction: () => {
                userData.setUserToken("Deleted");
                userData.setCurrentPage("Login");
                userData.setLoggedIn(false);
            }
        }
    ]

    return (
        <View style={styles.mainContainer}>
            <View style={styles.customHeader}>
                <Text style={styles.customHeaderText}>
                    {t("page_settings_name")}
                </Text>
            </View>
            <KeyboardAwareScrollView >
                {menuList.map((x, i) => {
                    return (
                        <View key={i} style={styles.itemContainer}>
                            <Pressable
                                style={styles.item}
                                onPress={() => {
                                    if (typeof x.onPressAction == "function") {
                                        x.onPressAction();
                                    }
                                    else {
                                        navigation.push("DetailsPage", {
                                            type: x.name,
                                            title: x.title
                                        });
                                    }
                                }}
                            >
                                <Text style={styles.text}>
                                    {t(x.title)}
                                </Text>
                                <SvgGenerator
                                    svgPath={x.iconName}
                                    fill={x.iconColor}
                                    width={x.iconWidth}
                                    height={x.iconHeight}
                                    style={{
                                        position: "absolute",
                                        right: 0
                                    }}
                                />
                            </Pressable>
                        </View>
                    )
                })}
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#fff",
        height: "100%"
    },
    itemContainer: {
        marginBottom: 1,
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#E1DFEE",
    },
    item: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    text: {
        fontSize: 15,
        fontFamily: "roboto",
        fontWeight: "400",
        letterSpacing: 0.39
    },
    arrow: {
        fontSize: 20,
        position: "absolute",
        right: 0,
        marginTop: -5,
        color: "#000",
        fontWeight: "400"
    },
    customHeader: {
        height: 120,
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