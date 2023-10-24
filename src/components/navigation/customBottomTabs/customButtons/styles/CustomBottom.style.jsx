import { Dimensions } from 'react-native'
import RobosmeCSS from '../../../../../assets/styles/robosme.style';

const { width } = Dimensions.get('window');
export const Bottom_Tab_Style = {
    mainContainer: {
        position: 'absolute',
        bottom: 18,
        display: "flex",
        backgroundColor: "#F6FAFF",
        flexDirection: 'row',
        borderRadius: 30,
        width: "77%",
        height: "6.5%",
        marginLeft: width * 0.04,
        paddingVertical: "0.5rem",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4.59,
        elevation: 5,
        zIndex: 999999999999
    },
    mainItemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 0,
        borderRadius: 1,
        borderColor: "#333B42",
        zIndex: 9999
    },
    icon: {
        width: "1.7rem",
        aspectRatio: 1,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 0,
        paddingVertical: 0,
        opacity: 1
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        paddingBottom: 10,
        height: 250,
        borderTopRightRadius: 17,
        borderTopLeftRadius: 17,
        width: "100%",
        height: "90%",
        overflow: "scroll"
    },
    contentTitle: {
        fontSize: 20,
        fontWeight: "700",
        // color: "#1C3DB4",
        color: "#2E68D9",
        marginBottom: 12,
    },
    itemText: {
        width: "100%",
        paddingVertical: 10,
        fontSize: 14,
        fontWeight: "400"
    },
    contentView: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    buttonStyle: {
        padding: 0,
        margin: 0,
        marginTop: -2,
        backgroundColor: "transparent",
    },
    textInput: {
        marginVertical: RobosmeCSS.VerticalScale(8),
        marginRight: RobosmeCSS.HorizontalScale(8),
    },
    label: {
        fontFamily: 'sans-serif',
        color: "#000000",
        fontSize: 13,
        fontWeight: "500",
        letterSpacing: 0.5,
        marginTop: 0
    },
    closeButton: {
        width: "100%",
        backgroundColor: "#2E68D9",
    }
}