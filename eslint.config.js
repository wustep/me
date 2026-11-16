import { config } from '@fisch0920/config/eslint'

export default [
  ...config,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'react/prop-types': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/prefer-global-this': 'off',
      'no-process-env': 'off',
      'array-callback-return': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'classnames',
              message: "Use `cn` from '@/lib/utils' instead of classnames."
            },
            {
              name: 'next/font/google',
              message:
                'Self-host fonts with next/font/local instead (see lib/fonts/files/README.md): fetching from Google Fonts at build time can fail the Turbopack build.'
            }
          ]
        }
      ]
    }
  }
]
