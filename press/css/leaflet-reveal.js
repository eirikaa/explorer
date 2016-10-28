import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "map": {
        "width": 960,
        "height": 480
    },
    "reveal leaflet-container leaflet-fade-anim leaflet-tile": {
        "WebkitTransition": "opacity 0.2s linear",
        "MozTransition": "opacity 0.2s linear",
        "OTransition": "opacity 0.2s linear",
        "transition": "opacity 0.2s linear"
    },
    "reveal leaflet-container leaflet-fade-anim leaflet-popup": {
        "WebkitTransition": "opacity 0.2s linear",
        "MozTransition": "opacity 0.2s linear",
        "OTransition": "opacity 0.2s linear",
        "transition": "opacity 0.2s linear"
    },
    "reveal leaflet-container": {
        "font": "12px/1.5 \"Helvetica Neue\", Arial, Helvetica, sans-serif"
    },
    "reveal leaflet-container img": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "background": "none",
        "border": "none",
        "boxShadow": "none",
        "maxHeight": "inherit"
    },
    "reveal leaflet-container leaflet-popup-tip-container": {
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto"
    },
    "reveal leaflet-container leaflet-popup-content-wrapper": {
        "paddingTop": 1,
        "paddingRight": 1,
        "paddingBottom": 1,
        "paddingLeft": 1,
        "marginTop": "inherit",
        "marginRight": "inherit",
        "marginBottom": "inherit",
        "marginLeft": "inherit"
    },
    "reveal leaflet-container leaflet-popup-content": {
        "marginTop": 13,
        "marginRight": 19,
        "marginBottom": 13,
        "marginLeft": 19,
        "lineHeight": 1.4,
        "color": "#333"
    },
    "reveal leaflet-container leaflet-popup-content h3": {
        "color": "#333"
    },
    "reveal leaflet-container leaflet-popup-tip": {
        "paddingTop": 1,
        "paddingRight": 1,
        "paddingBottom": 1,
        "paddingLeft": 1,
        "marginTop": -10,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto"
    },
    "reveal leaflet-popup-content h2": {
        "color": "#333"
    },
    "reveal leaflet-container leaflet-popup-content pre": {
        "fontSize": 14,
        "width": "100%",
        "boxShadow": "none"
    }
});