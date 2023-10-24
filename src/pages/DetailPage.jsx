import React from "react";
import WebViewPage from "../components/webview/WebViewPage";

export default function DetailPage({ route, navigation }) {
    return (
        <WebViewPage route={route} navigation={navigation} mainPage={false} isPopup={true} />
    )
}