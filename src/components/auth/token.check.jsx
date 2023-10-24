import { View, Text } from 'react-native'
import React from 'react'
import { UserContext } from "../../context/user.context";

export default function TokenCheck() {
  let userData = useContext(UserContext),
    url = userData.siteURL,
    SITE_URL = userData.siteURL;

  return (
    <View>
      <Text>TokenCheck</Text>
    </View>
  )
}