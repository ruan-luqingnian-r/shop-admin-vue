module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "quotes": [0, "single"],	// 禁用引号检查	引号类型 `` "" ''
    "semi": 0,  				// 禁用分号检查	[1, "always"]: 需要分号, [2, "never"]: 不加分号, 0: 禁用此项
    "vue/html-self-closing": "off",
    "vue/no-parsing-error": [2, {
      "x-invalid-end-tag": true,
    }],
    "indent": "off",			// 禁用缩进检查

  },
  // 注意，plugins 里别忘了加 vue 选项
  plugins: [
    'html',
    'vue'
  ]
}
