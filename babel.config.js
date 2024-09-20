module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        alias: {
          // This needs to be mirrored in tsconfig.json
          '@components': './src/components',
          '@screens': './src/screens',
          '@assets/*': './src/assets/*',
          '@libs': './src/libs',
          '@const/*': './src/const/*',
          '@const': './src/const',
          '@models/*': './src/models/*',
          '@models': './src/models',
          '@utils': './src/utils',
          '@styles': './src/styles',
          '@context': './src/stores/context',
          '@ability': './src/defineAbility.ts',
          '@services': './src/services',
          '@stores': './src/stores',
          '@type/*': './src/type/*',
          '@hk': './src/hk',
          '@assets': './src/assets',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
