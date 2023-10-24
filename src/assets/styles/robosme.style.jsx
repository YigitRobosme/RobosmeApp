import { Dimensions, Platform, PixelRatio } from 'react-native';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 380;

export function normalize(size) {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export const Colors = {
    $logo_color: "#FF5433",
    $dark_color: "#363B44",
    $white_color: "#ffffff",
    $gray_color: "#F4F5F6",
    $yellow_color: "#FEC70A",
    $orange_color: "#FF8754",
    $salmon_color: "#FFAF83",
    $red_color: "#FD6A6A",
    $light_blue_color: "#e2eefa",
    $blue_color: "#1c3db4",
    $dark_blue_color: "#3532A7",
    $green_color: "#34D74E",
    $grayBorder_color: "#EBEBEC",
    $black_color: "#000000",
    $robosme_purple: "#984FB7"
}

export const ScreenSize = {
    $desktop: "1280px",
    $desktop_sm: "1024px",
    $table_large: "991px",
    $table_width: "768px",
    $table_width_sm: "640px",
    $phone_width: "480px",
    $phone_width_sm: "320px"
}

export const DefaultFontProps = {
    $font_color: "#363B44",
    $font_size: "14px",
    $font_weight: "400",
    $font_lineHeight: "22px"
}

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

//Width, Horizontal Margins/Paddings etc.
const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
//Height, Vertical Margins/Paddings, Line height etc.
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
//Font, Border Radius etc.
const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;
export { horizontalScale, verticalScale, moderateScale };

const RobosmeCSS = {
    Colors: Colors,
    ScreenSize: ScreenSize,
    DefaultFontProps: DefaultFontProps,
    FontSizeHelper: normalize,
    HorizontalScale: horizontalScale,
    VerticalScale: verticalScale,
    ModerateScale: moderateScale
};

export default RobosmeCSS