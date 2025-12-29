const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
 
const config = getDefaultConfig(path.dirname);
 
module.exports = withNativeWind(config, { input: './app/global.css' })