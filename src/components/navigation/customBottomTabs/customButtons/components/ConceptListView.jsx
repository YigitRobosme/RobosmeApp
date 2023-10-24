import React, { useState, useEffect, useContext } from 'react';
import { View, Pressable } from "react-native";
import { Button, Text } from 'react-native-elements';
import Modal from 'react-native-modal';
import CustomTextInput from "../../../../../components/input/TextInput.component";
import RobosmeCSS from '../../../../../assets/styles/robosme.style';
import SvgGenerator from '../../../../utils/SvgGenerator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UserContext } from '../../../../../context/user.context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Bottom_Tab_Style } from '../styles/CustomBottom.style';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';

export default ConceptListView = ({ navigation, pageName, pageSvgCode, pageTitle }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState("");
    const userData = useContext(UserContext);
    const [conceptList, setConceptList] = useState([]);
    const [conceptListSearch, setConceptListSearch] = useState([]);

    useEffect(() => {
        let tempArray = conceptList.filter((x) => {
            let lower1 = x.Title.toLowerCase(),
                lower2 = search?.toLowerCase();

            return lower1.includes(lower2);
        });
        setConceptListSearch(tempArray);
    }, [search]);

    function getConceptList() {
        const apiUrl = `${userData.apiURL}/api/Concept/GetDynamicList`;

        let newToken;
        if (userData.userToken) {
            newToken = decodeURI(userData.userToken);
            newToken = decodeURIComponent(newToken);
        }

        const query = `{
                        "Query": {
                            "SelectItemList": [
                                {
                                    "PropertyName": "Title"
                                },
                                {
                                    "PropertyName": "SystemName"
                                }
                            ],
                            "CriteriaItemList": [
                                {
                                    "PropertyName": "Status",
                                    "Value": 1,
                                    "ConditionOperator": 0
                                },
                                {
                                    "PropertyName": "IsIntermediateConcept",
                                    "Value": false,
                                    "ConditionOperator": 0
                                }
                            ],
                            "OrderItemList": [
                                {
                                    "PropertyName": "Title",
                                    "IsAscending": true
                                }
                            ],
                            "UseAnd": true
                        },
                        "Token": "${newToken}"
                    }`;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: query
        })
            .then(response => {
                if (response.status == "200") {
                    return response.json();
                }
            })
            .then(json => {
                if (json && json.DataList && json.DataList.length) {
                    setConceptList(json.DataList);
                    setConceptListSearch(json.DataList);
                }

                return json;
            })
            .catch(error => {
                console.error("error: ", error);
            });
    }

    useEffect(() => {
        getConceptList();
    }, []);

    const customIconOpacity = useSharedValue(0);
    const config = {
        duration: 800,
        easing: Easing.linear,
    };
    const opacityAnimation = useAnimatedStyle(() => {
        return {
            opacity: withTiming(customIconOpacity.value, config),
        };
    });
    useEffect(() => {
        if (userData.currentPage == "Settings") {
            customIconOpacity.value = 0;
        }
        else {
            customIconOpacity.value = 1;
        }
    }, [userData.currentPage]);

    return (
        <>
            <Pressable
                onPress={() => { setModalVisible(true) }}
                style={{ borderRadius: 10, paddingHorizontal: 0 }}>
                <Animated.View style={[styles.iconContainer, opacityAnimation]}>
                    <SvgGenerator
                        svgPath={pageSvgCode}
                        fill={"#2E68D9"}
                        style={[styles.icon]}
                    />
                </Animated.View>
            </Pressable>


            <View style={styles.container}>
                <Modal
                    propagateSwipe={true}
                    backdropOpacity={0.3}
                    isVisible={modalVisible}
                    onBackdropPress={() => {
                        setSearch("");
                        setModalVisible(false);
                    }}
                    style={styles.contentView}
                    onSwipeComplete={() => {
                        setSearch("");
                        setModalVisible(false);
                    }}
                // swipeDirection="down"
                >
                    <View style={styles.content}>
                        <Text style={styles.contentTitle}>{pageTitle}</Text>
                        <KeyboardAwareScrollView persistentScrollbar={true} keyboardShouldPersistTaps="handled">
                            {
                                conceptListSearch.map((p, i) => {
                                    return (
                                        <Pressable key={i} onPress={() => {
                                            if (pageName == "NavigateTo") {
                                                userData.setWebviewURL(`${userData.siteURL}/Global?dataType=${p.SystemName}&alias=concept`);
                                            }
                                            else if (pageName == "QuickCreate") {
                                                userData.setWebviewURL(`${userData.siteURL}/Global/generatedDetail?dataType=form&concept=${p.SystemName}`);
                                            }

                                            setModalVisible(false);
                                            setSearch("");
                                        }}>
                                            <Text style={styles.itemText}>
                                                {p.Title}
                                            </Text>
                                        </Pressable>
                                    )
                                })
                            }
                        </KeyboardAwareScrollView>
                        <CustomTextInput
                            onChangeText={val => setSearch(val)}
                            value={search}
                            label="Search Concept"
                            mode="outlined"
                            outlineColor={RobosmeCSS.Colors.$grayBorder_color}
                            activeOutlineColor={RobosmeCSS.Colors.$blue_color}
                            style={styles.textInput}
                            inputMode="search"
                            rightIcon={"magnify"}
                        />
                        <Button
                            onPress={() => {
                                setModalVisible(false);
                            }}
                            title={"Close"}
                            buttonStyle={styles.closeButton}
                        />
                    </View>
                </Modal >
            </View >
        </>
    );
}

const styles = EStyleSheet.create(Bottom_Tab_Style);