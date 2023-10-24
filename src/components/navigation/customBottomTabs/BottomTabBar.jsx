import React, { useEffect, useContext } from 'react';
import { View, Pressable, Dimensions, StyleSheet, Text, Keyboard } from 'react-native'
import { UserContext } from '../../../context/user.context';
import TabButtonNavigateTo from './customButtons/NavigateToButton';
import TabButtonQuickCreate from './customButtons/QuickCreate';
import SvgGenerator from '../../utils/SvgGenerator';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Bottom_Tab_Style } from './customButtons/styles/CustomBottom.style';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
export default function TabBar({ state, descriptors, navigation }) {
    const userData = useContext(UserContext);
    // const tabbarWidth = useSharedValue(width * 0.77);
    const tabbarWidth = useSharedValue("77%");
    const tabbarMl = useSharedValue(width * 0.04);
    const tabbarOpacity = useSharedValue(0);
    const tabbarBottom = useSharedValue(18);
    const iconOpacity = useSharedValue(1);

    const widthConfig = {
        duration: 500,
        // easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        // easing: Easing.linear,
        // easing: Easing.elastic(1),
        easing: Easing.inOut(Easing.ease),
    };
    const widthAnimation = useAnimatedStyle(() => {
        return {
            width: withTiming(tabbarWidth.value, widthConfig),
            marginLeft: withTiming(tabbarMl.value, widthConfig)
        };
    });

    const opacityConfig = {
        duration: 800,
        easing: Easing.linear,
    };
    const opacityAnimation = useAnimatedStyle(() => {
        return {
            opacity: withTiming(tabbarOpacity.value, opacityConfig),
            bottom: withTiming(tabbarBottom.value, opacityConfig),
        };
    });
    const opacityIconAnimation = useAnimatedStyle(() => {
        return {
            opacity: withTiming(iconOpacity.value, opacityConfig),
        };
    });

    useEffect(() => {
        if (!userData.tabBarVisible) {
            tabbarOpacity.value = 0;
            tabbarBottom.value = -40;
        }
        else {
            tabbarOpacity.value = 1;
            tabbarBottom.value = 18;
        }
    }, [userData.tabBarVisible]);

    useEffect(() => {
        if (userData.currentPage == "Settings") {
            tabbarWidth.value = "13%";
            tabbarMl.value = width * 0.43;
            iconOpacity.value = 0;
        }
        else {
            tabbarWidth.value = "77%";
            tabbarMl.value = width * 0.04;
            iconOpacity.value = 1;
        }
    }, [userData.currentPage]);

    return (
        <Animated.View style={[styles.mainContainer, widthAnimation, opacityAnimation]}>
            {state.routes.map((route, index) => {
                if (route.name == "Navigate") {
                    return userData.currentPage != "Settings" ?
                        (
                            <View key={index} style={[styles.mainItemContainer]}>
                                <TabButtonNavigateTo navigation={navigation} />
                            </View>
                        )
                        :
                        null
                }
                else if (route.name == "Quick Create") {
                    return userData.currentPage != "Settings" ?
                        (
                            <View key={index} style={styles.mainItemContainer}>
                                <TabButtonQuickCreate navigation={navigation} />
                            </View>
                        )
                        :
                        null
                }
                else if (route.name == "Settings") {
                    if (userData.currentPage == "Settings") {
                        return null;
                    }
                }

                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = (e) => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                        userData.setCurrentPage(route.name);
                    }
                    else if (isFocused && route.name == "MainPage") {
                        userData.setWebviewURL(userData.siteURL);
                    }
                };

                return (
                    <View key={index} style={styles.mainItemContainer}>
                        <Pressable
                            onPress={onPress}
                            style={{ backgroundColor: isFocused ? "transparent" : "transparent", borderRadius: 10, paddingHorizontal: 0, paddingVertical: 0 }}>
                            <Animated.View style={[styles.iconContainer, route.name != "MainPage" ? opacityIconAnimation : null]}>
                                <SvgGenerator
                                    svgPath={options.iconName}
                                    fill={isFocused ? "#2E68D9" : "#2E68D9"}
                                    style={[styles.icon]}
                                />
                                {/* <Text style={[styles.label, { color: isFocused ? "black" : "black" }]} >
                                    {label}
                                </Text> */}
                            </Animated.View>
                        </Pressable>
                    </View>
                );
            })}
        </Animated.View>
    );
}

const styles = EStyleSheet.create(Bottom_Tab_Style);