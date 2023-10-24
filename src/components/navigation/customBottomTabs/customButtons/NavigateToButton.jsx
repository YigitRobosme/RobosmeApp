import React from 'react';
import ConceptListView from './components/ConceptListView';
import { useTranslation } from 'react-i18next';

export default TabButtonNavigateTo = ({ navigation }) => {
    const { t } = useTranslation();
    return (
        <ConceptListView
            navigation={navigation}
            pageName={"NavigateTo"}
            pageSvgCode={"Bottom_Tab_Navigate_svg"}
            pageTitle={t("tabBar_NavigateTo_Title")}
        />
    )
}
