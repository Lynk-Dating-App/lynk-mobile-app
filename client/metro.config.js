// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Add the following lines to integrate react-native-dotenv
require('dotenv').config(); // Make sure this line is added
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx');

module.exports = config;
