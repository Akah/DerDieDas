module.exports = {
    extends: '@react-native',
    parser: '@typescript-eslint/parser',
    ignorePatterns: ["*.config.js", "*-config.js", "index.js", ".eslintrc.js"],
    plugins: [
        'import',
        "jest",
    ],
    rules: {
        'prettier/prettier': 0,
        'indent': ['warn', 4, {
            'SwitchCase': 1,
        }],
        'import/no-unresolved': 'error',
        'complexity': ['warn', 10],
        '@typescript-eslint/no-floating-promises': ['error'],
        'no-void': ['off'],
    },
    'settings': {
        'import/resolver': {
            'typescript': {
                'project':  './tsconfig.json',
                'alwaysTryTypes': true,
            },
            node: true,

        },
        'import/parser': {
            '@typescript-eslint/parser': ['.tsx', '.ts'],
        },
    },
}
