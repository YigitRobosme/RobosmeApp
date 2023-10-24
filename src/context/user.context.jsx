import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
    organizationName: null,
    regionName: null,
    email: null,
    password: null,
    apiURL: null,
    siteURL: null,
    siteName: null,
    userToken: null,
    loggedIn: null,
    tabBarVisible: null,
    currentLanguage: null,
    webviewRef: null,
    webviewLoad: null,
    webviewURL: null,
    currentPage: null,
    setCurrentPage: () => { },
    setWebviewURL: () => { },
    setWebviewLoad: () => { },
    setWebviewRef: () => { },
    setCurrentLanguage: () => { },
    setTabBarVisible: () => { },
    setLoggedIn: () => { },
    setUserToken: () => { },
    setOrganizationName: () => { },
    setRegionName: () => { },
    setEmail: () => { },
    setPassword: () => { },
    setApiURL: () => { },
    setSiteURL: () => { },
    generateUrls: (org = "", region = "", returnName = "api") => { },
});


export const UserProvider = ({ children }) => {
    const [organizationName, setOrganizationName] = useState("");
    const [regionName, setRegionName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [apiURL, setApiURL] = useState("");
    const [siteURL, setSiteURL] = useState("https://dev.robokobi.net");
    const [siteName, setSiteName] = useState("robokobi.net");
    const [userToken, setUserToken] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [tabBarVisible, setTabBarVisible] = useState(true);
    const [currentLanguage, setCurrentLanguage] = useState("en");
    const [webviewRef, setWebviewRef] = useState(0);
    const [webviewLoad, setWebviewLoad] = useState(false);
    const [currentPage, setCurrentPage] = useState("");
    const [webviewURL, setWebviewURL] = useState("");

    const generateUrls = (org = "", region = "", returnName = "api") => {
        org = org || organizationName;
        region = region || regionName;

        if (org && region) {
            let newApiURL = "",
                newSiteURL = "";

            org = org.toLowerCase();

            if (org == "dev" || org == "test") {
                newApiURL = `https://${org}api.${siteName}`;
                newSiteURL = `https://${org}.${siteName}`;
            }
            else if (org == "local") {
                newApiURL = `https://devapi.${siteName}`;
                newSiteURL = `https://localhost:5001/`;
            }
            else {
                newApiURL = `https://${org}api.${region}.${siteName}`;
                newSiteURL = `https://${org}.${region}.${siteName}`;
            }

            setApiURL(newApiURL);
            setSiteURL(newSiteURL);
            setWebviewURL(newSiteURL);

            if (returnName == "api") {
                return newApiURL;
            }
            else {
                return newSiteURL;
            }
        }

        return apiURL;
    }

    const value = {
        organizationName,
        regionName,
        email,
        password,
        apiURL,
        siteURL,
        userToken,
        loggedIn,
        tabBarVisible,
        currentLanguage,
        webviewRef,
        webviewLoad,
        webviewURL,
        currentPage,
        setCurrentPage,
        setWebviewURL,
        setWebviewLoad,
        setWebviewRef,
        setCurrentLanguage,
        setTabBarVisible,
        setLoggedIn,
        setUserToken,
        setOrganizationName,
        setRegionName,
        setEmail,
        setPassword,
        setApiURL,
        setSiteURL,
        generateUrls
    };

    useEffect(() => {
        generateUrls();
        // console.log(siteURL, apiURL)
    }, [organizationName, regionName]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};