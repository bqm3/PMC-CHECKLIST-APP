
import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window');

export const COLORS = {
    bg_main: '#2d5991',
    bg_white: 'white',
    text_main: 'white',

    bg_active: '#2d5991',
    bg_not_active: '#4285da',

    bg_button: '#4CB9CE'
}

export const SIZES = {
    borderRadius: 12,
    padding: 16,
    height: height,
    width: width,
}