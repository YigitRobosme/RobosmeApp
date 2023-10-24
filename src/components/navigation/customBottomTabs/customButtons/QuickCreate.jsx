import React from 'react';
import ConceptListView from './components/ConceptListView';
import { useTranslation } from 'react-i18next';

export default TabButtonQuickCreate = ({ navigation }) => {
    const { t } = useTranslation();
    return (
        <ConceptListView
            navigation={navigation}
            pageName={"QuickCreate"}
            pageSvgCode={"Bottom_Tab_CreateQuick_svg"}
            pageTitle={t("tabBar_QuickCreate_Title")}
        />
    )
}
