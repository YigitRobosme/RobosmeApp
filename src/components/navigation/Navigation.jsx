import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "../../pages/HomePage"
import DetailPage from "../../pages/DetailPage"
// import Login from "../../pages/Login"
import Login from "../../pages/Login_v2";
import { UserContext } from "../../context/user.context";

// import { Platform, View, Text } from "react-native";
// import 'react-native-gesture-handler';
// import Drawer_component from "./src/components/menu/Drawer/Drawer_component";
// import DeviceInfo from "react-native-device-info";
// import 'expo-dev-client';
// import PhoneDetect from "./src/components/PhoneDetect"


export default function Navigation() {
    const Stack = createNativeStackNavigator();
    // const [loggedIn, setLoggedIn] = useState(false);

    const data = useContext(UserContext);

    const webViewSettings = {
        // headerShown: false,
        headerStyle: {
            backgroundColor: "#253858",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
            fontWeight: "bold",
        },
        gestureEnabled: false,
        swipeEnabled: false
    };

    // console.log(`- OS: ${Platform.OS}
    //   - Version: ${Platform.constants.osVersion}`);

    return (
        <>
            {data.loggedIn ? (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="HomePage">
                        <Stack.Screen
                            name="HomePage"
                            component={HomePage}
                            options={{
                                title: "",
                                headerShown: false,
                                ...webViewSettings,
                            }}
                        />
                        <Stack.Screen
                            name="DetailPage"
                            component={DetailPage}
                            options={{
                                title: "",
                                headerBackTitle: "Back",
                                presentation: "modal",
                                headerShown: true,
                                ...webViewSettings,
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            ) : (
                <Login />
            )}
        </>
    )
}