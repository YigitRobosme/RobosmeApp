import React, { useState } from "react"
import { TextInput, HelperText } from "react-native-paper";
import { Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import SvgGenerator from "../utils/SvgGenerator";

export default function CustomTextInput({ ...params }) {
    const [passwordView, setPasswordView] = useState(true);
    const [text, setText] = useState(params.value);
    const onChangeText = (text) => {
        setText(text);
    }

    return (
        <>
            {
                params.labelText &&
                <View style={styles.title}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[params.labelStyle, { color: params.helperShow ? "red" : "white" }]}>
                        {params.labelText}
                    </Text>
                </View>
            }
            <TextInput
                value={params.value}
                label={params.label}
                autoCapitalize={params.autoCapitalize}
                mode={params.mode}
                outlineColor={params.outlineColor}
                activeOutlineColor={params.activeOutlineColor}
                style={params.style}
                inputMode={params.inputMode}
                secureTextEntry={params.secureTextEntryActive ? passwordView : false}
                onChangeText={(val) => {
                    onChangeText(val);
                    { params.onChangeText && params.onChangeText(val) }
                }}
                right={
                    params.secureTextEntryActive ?
                        <TextInput.Icon
                            icon={passwordView ? 'eye' : 'eye-off'}
                            onPress={() =>
                                setPasswordView(!passwordView)
                            }
                        /> :
                        params.rightIcon ?
                            <TextInput.Icon
                                icon={params.rightIcon}
                                color={"#2E68D9"}
                                onPress={() =>
                                    setPasswordView(!passwordView)
                                }
                            /> :
                            null
                }
            />
            {
                params.helperShow &&
                <HelperText style={{ paddingLeft: 0, marginTop: -8 }} type="error" visible={true}>
                    {params.helperText}
                </HelperText>
            }
        </>
    )
}

const styles = EStyleSheet.create({});