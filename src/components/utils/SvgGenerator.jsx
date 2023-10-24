import React from 'react'
import { SvgCss } from 'react-native-svg';
import * as AllSVGs from '../../assets/svg/svg_library';

export default function SvgGenerator({ ...param }) {
    return (
        <SvgCss
            xml={AllSVGs[param.svgPath]}
            // preserveAspectRatio='none'
            {...param}
        />
    )
}