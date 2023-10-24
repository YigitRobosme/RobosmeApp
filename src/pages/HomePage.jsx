import React from "react";
import WebviewNavigation from "../components/navigation/Webview.navigation";

export default function HomePage({ route, navigation }) {
    return (
        <WebviewNavigation navigation={navigation} route={route} isPopup={false} />
    )
}