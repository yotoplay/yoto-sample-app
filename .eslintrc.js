module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    parserOptions: {
        sourceType: 'module',
        'ecmaVersion': 2020,
        ecmaFeatures: {
            jsx: true
        }
    },
    parser: '@typescript-eslint/parser',
    settings: {
        react: {
            version: '17.0.2'
        }
    },
    env: {
        browser: true,
        node: true,
        es2020: true,
        jest: true
    },
    plugins: [
        'react',
        'react-hooks',
    ],
    rules: {
        'no-console': 'off',
        indent: 2,
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        'space-infix-ops': ['error'],
        eqeqeq: ['error', 'always', { 'null': 'ignore' }],
        'object-curly-spacing': ['error', 'always'],
        'prefer-template': ['error'],
        'template-curly-spacing': ['error'],
        'react-hooks/rules-of-hooks': ['error'],
        'react-hooks/exhaustive-deps': ['warn'],
        'react/display-name': 'off'
    },
    globals: {
        NodeJS: true
    }
};