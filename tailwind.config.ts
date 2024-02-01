import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['bumblebee'],
          neutral: '#36393e',
          'base-100': '#e7e5e4'
        }
      },
      {
        dark: {
          primary: '#f9d72f',

          secondary: '#e0a82e',

          accent: '#dc8850',

          neutral: '#36393e',

          'base-100': '#424549',

          info: '#3abff8',

          success: '#36d399',

          warning: '#fbbd23',

          error: '#f87272'
        }
      }
    ]
  }
};
export default config;
