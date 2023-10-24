import React, { useEffect } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, BackHandler } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from './Settings'
import Details from './Details';
import '../../assets/i18n/i18n'
import { useTranslation } from 'react-i18next';

export default function Settings_Navigation() {
    const Stack = createNativeStackNavigator();
    const { t } = useTranslation();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            return true;
        });
        return () => backHandler.remove();
    }, []);

    return (
        <>
            <SafeAreaView
                style={{
                    marginTop: StatusBar.currentHeight,
                    ...styles.container
                }}
            >
                <Stack.Navigator initialRouteName="SettingsPage" screenOptions={{
                    gestureEnabled: false,
                }}>
                    <Stack.Screen
                        name="SettingsPage"
                        component={Settings}
                        options={{
                            headerShown: false,
                            title: t("page_settings_name"),
                            headerTitleAlign: "center",
                            headerTitleStyle: {
                                fontSize: 18,
                                color: "#000",
                                fontWeight: "500",
                                height: 20
                            },
                            iconName: "Bottom_Tab_Wheel_svg"
                        }}
                    />
                    <Stack.Screen
                        name="DetailsPage"
                        component={Details}
                        options={{
                            headerShown: false,
                            title: "",
                            headerBackTitle: "Back",
                            presentation: "modal",
                        }}
                    />
                </Stack.Navigator>
            </SafeAreaView>

        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#253858"
    },
});