import { View, Text, Button, Icon, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WebViewPage from '../webview/WebViewPage';
import CardVisitReader from '../utils/CardVisitReader';
import Settings_Navigation from '../../pages/Settings/Settings_Navigation';
import Map from '../utils/Map';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TabButtonNavigateTo from './customBottomTabs/customButtons/NavigateToButton'
import { color } from 'react-native-elements/dist/helpers';
import { UserContext } from '../../context/user.context';
import TabBar from './customBottomTabs/BottomTabBar';
import '../../assets/i18n/i18n';
import { useTranslation } from 'react-i18next';

var NavigateComponent, HomeComponent, QuickCreateComponent;
NavigateComponent = HomeComponent = QuickCreateComponent = () => {
    return null
}


export default function WebviewNavigation() {
    const { t } = useTranslation();

    const Tab = createBottomTabNavigator();
    const userData = useContext(UserContext);
    let isTabVisible = userData.tabBarVisible;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarStyle: {
                    // position: "absolute",
                    // bottom: 0,
                    backgroundColor: isTabVisible ? "rgba(6, 49, 99, 0.5)" : "rgb(6, 49, 99)",
                    shadowColor: isTabVisible ? "rgba(6, 49, 99, 0.5)" : "rgb(6, 49, 99)",
                    borderColor: isTabVisible ? "rgba(6, 49, 99, 0.5)" : "rgb(6, 49, 99)",
                    opacity: isTabVisible ? 0.33 : 1
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Robosme') {
                        // iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
                        iconName = focused ? 'home' : 'home-outline';
                    }
                    else if (route.name === 'Scan') {
                        // iconName = focused ? 'ios-list' : 'ios-list-outline';
                        iconName = focused ? 'scan' : 'scan-outline';
                    }
                    else if (route.name === 'Map') {
                        iconName = focused ? 'map' : 'map-outline';
                    }
                    else if (route.name === 'Logout') {
                        iconName = focused ? 'arrow-redo-circle' : 'arrow-redo-circle-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'gray',
            })}
            tabBar={props => <TabBar {...props} />}
        >
            {/* <Tab.Screen
                name="Home"
                component={WebViewPage}
                options={{
                    headerShown: false
                }}
            /> */}
            <Tab.Screen
                name="MainPage"
                component={WebViewPage}
                tabPress={() => { }}
                options={{
                    headerShown: false,
                    title: "Home",
                    iconName: "Bottom_Tab_Home_svg",
                    gestureEnabled: false,
                    swipeEnabled: false
                }}
            />
            <Tab.Screen
                name="Navigate"
                component={NavigateComponent}
                options={{
                    title: "Navigate",
                    tabBarButton: () => (<TabButtonNavigateTo />),
                    tabBarBadge: 3,
                    iconName: "Bottom_Tab_Navigate_svg",
                    gestureEnabled: false,
                    swipeEnabled: false
                }}
            />
            <Tab.Screen
                name="Quick Create"
                component={QuickCreateComponent}
                options={{
                    tabBarBadge: 3,
                    iconName: "Bottom_Tab_CreateQuick_svg",
                    gestureEnabled: false,
                    swipeEnabled: false
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings_Navigation}
                options={{
                    headerShown: false,
                    title: t("page_settings_name"),
                    headerTitleAlign: "center",
                    headerStyle: {
                        height: 75,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,
                        elevation: 3,
                    },
                    headerTitleStyle: {
                        fontSize: 21,
                        color: "#2E68D9",
                        fontWeight: "900",
                    },
                    iconName: "Bottom_Tab_Wheel_svg",
                    gestureEnabled: false,
                    swipeEnabled: false
                }}
            />
            {/* <Tab.Screen
                    name="Robosme"
                    component={WebViewPage}
                    tabPress={() => {
                        console.log("selaam")
                    }}
                    options={{
                        headerShown: false,
                        title: "Home",
                        iconName: "Bottom_Tab_Home_svg"
                    }}
                />
            <Tab.Screen
                name="Scan"
                component={CardVisitReader}
                options={{
                    title: "Scan",
                    iconName: "Bottom_Tab_Scan_svg"
                }}
            />
            <Tab.Screen
                name="Map"
                component={Map}
                options={{
                    tabBarBadge: 3,
                    iconName: "Bottom_Tab_Map_svg"
                }}
            />
            <Tab.Screen
                name="Logout"
                component={TabButtonNavigateTo}
                // component={LogoutComponent}
                listeners={{
                    tabPress: e => {
                        // Prevent default action
                        e.preventDefault();

                        //Any custom code here
                    },
                }}
                options={{
                }}
            /> */}
        </Tab.Navigator>
    )
}