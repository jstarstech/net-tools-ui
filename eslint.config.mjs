import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.vue'],
    rules: {
      // Turn on other rules that you need.
      '@typescript-eslint/require-array-sort-compare': 'error'
    }
  },
  skipFormatting,
  ...vueTsEslintConfig({ extends: ['recommendedTypeChecked'] }),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.vue'],
    rules: {
      // Turn off the recommended rules that you don't need.
      '@typescript-eslint/no-redundant-type-constituents': 'off'
    }
  }
]
