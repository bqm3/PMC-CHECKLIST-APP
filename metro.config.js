const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);

// Cấu hình transformer
config.transformer = {
  ...config.transformer,
  experimentalImportSupport: false,
  inlineRequires: true,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
  minifierConfig: {
    keep_classnames: true, // FIX typeorm
    keep_fnames: true, // FIX typeorm
    mangle: {
      keep_classnames: true, // FIX typeorm
      keep_fnames: true, // FIX typeorm
    },
    output: {
      ascii_only: true,
      quote_style: 3,
      wrap_iife: true,
    },
    sourceMap: {
      includeSources: false,
    },
    toplevel: false,
    compress: {
      reduce_funcs: false,
    },
  },
};

// Cấu hình resolver
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts.filter((ext) => ext !== "svg"), "db"],
  sourceExts: [...config.resolver.sourceExts, "svg", "jsx", "js", "ts", "tsx", "cjs", "json"],
};

module.exports = config;