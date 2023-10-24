import { View, Text, Image } from 'react-native'
import React from 'react'

export default function Loading({ ...params }) {
    return (
        <View style={{ position: "absolute", zIndex: 1, flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: params.BackgroundColor, marginTop: params.MarginTop }}>
            <Image
                source={require('../../assets/images/loader.gif')}
            />
        </View>
    )
}