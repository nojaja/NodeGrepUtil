module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'sonarjs', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:sonarjs/recommended',
    'plugin:jsdoc/recommended'
  ],
  rules: {
    'sonarjs/cognitive-complexity': ['error', 10],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': ['error'],
    'jsdoc/require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: true
        },
        contexts: [
          'TSInterfaceDeclaration',
          'TSTypeAliasDeclaration'
        ]
      }
    ],
    'jsdoc/require-param': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/check-tag-names': ['error', { 
      definedTags: ['処理名', '処理概要', '実装理由'] 
    }]
  },
  env: {
    node: true,
    es2022: true
  }
};
