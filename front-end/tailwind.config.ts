import type { Config } from 'tailwindcss';
import { scrollbarPlugins } from './scrollbarPlugin';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        foreground: '#171717',
        'AppBar-background': '#ffffff',
        'education-blue': '#1f61a9',
        'ciBlue-1': '#e9f2fb',
        'ciBlue-2': '#e1edfa',
        'education-theme-blue': '#1c5fa7',
        'education-blue-light': '#73b1f4',
        'education-green': '#a6cc17',
        'education-green-dark': '#7c9911',
        'education-black': '#333333',
        'education-gray': '#c2baad',
        'education-danger': '#af1c10',
        'education-blue-light-1': '#3b87db',
        'education-blue-light-2': '#7cafe7',
        'education-blue-light-3': '#bed7f3',
        'education-blue-light-4': '#e8f1fb',
        'education-blue-light-5': '#f6f9fc',
        'education-blue-light-6': '#66CCFF',
        'education-blue-dark-1': '#17497f',
        'education-blue-dark-2': '#103055',
        'education-blue-dark-3': '#08182a',
        'education-blue-100': '#f6f9fd',
        'education-blue-200': '#ecf4fc',
        'education-blue-500': '#acccf0',
        'education-blue-700': '#4a92de',
        'education-blue-800': '#2574ca',
        'education-blue-1100': '#091d33',
        'education-green-light-2': '#d9f180',
        'education-green-light-4': '#f0f9cc',
        'education-green-dark-1': '#7c9911',
        'education-green-dark-2': '#53660c',
        'education-green-dark-3': '#293306',
        'education-green-100': '#f6fce0',
        'education-green-200': '#edf8c5',
        'education-green-600': '#95b915',
        'education-green-700': '#7c9a11',
        'education-green-800': '#657c0e',
        'education-green-900': '#54670c',
        'education-theme-light-on-surface': '#1a1c1e',
        'grayscale-300': '#eaeaea',
        'gray-02': '#373d3f',
        'gray-1': '#fbfbfb',
        'gray-2': '#f9f9f9',
        'gray-3': '#f3f3f3',
        'gray-4': '#1d1d1d',
        'gray-5': '#f4f4f4',
        'gray-6': '#a7afb2',
        'gray-8': '#737373',
        'gray-10': '#e8e8e8',
        'gray-20': '#d2d2d2',
        'gray-30': '#bbbbbb',
        'gray-40': '#a4a4a4',
        'gray-50': '#8d8d8d',
        'gray-60': '#767676',
        'gray-80': '#494949',
        'gray-90': '#333333',
        'gray-scale-200': '#e8e8e8',
        'gray-scale-300': '#dcdcdc',
        'gray-scale-1000': '#595959',
        'ghost-white': '#fafaff',
        'eerie-black': '#1c1c1c',
        'eerie-black-00': '#000000',
        'eerie-black-5': '#1c1c1c0d',
        'eerie-black-20': '#1c1c1c33',
        'eerie-black-30': '#1b1a1e',
        'eerie-black-40': '#1c1c1c66',
        'eerie-black-65': '#1c1c1ca6',
        'education-gray-100': '#f1f3f4',
        'education-gray-200': '#e6e8ea',
        'education-gray-300': '#d9dde0',
        'education-gray-400': '#cbd0d5',
        'education-gray-500': '#bdc3c9',
        'education-gray-600': '#adb5bc',
        'education-gray-700': '#9aa4ad',
        'education-gray-800': '#85919c',
        'education-gray-900': '#6d7a86',
        'education-gray-1000': '#595959',
        'education-gray-1100': '#1a1d20',
        'ciGray-1000': '#515a62',
        'ciBlue-900': '#1f61a9',
        white: '#ffffff',
        'eerie-black-90': 'rgba(28, 28, 28, 0.9)',
        'orange-light': '#f8e8bf',
        'orange-dark': '#753e00',
        'cultured-gray': '#eef0f2',
        'red-error': '#af1c10',
        warning: '#f2bb2e',
        'warning-dark': '#9b6907'
      }
    }
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: any }) {
      // mock các thuộc tính tái sử dụng
      scrollbarPlugins({ addUtilities });

      addUtilities({
        '.card-glass-effect-1': {
          'box-shadow': '0px 4px 8px 0px rgba(0,0,0,0.05)',
          'backdrop-filter': 'blur(8px)',
          position: 'relative',
          'z-index': 10
        },
        '.card-glass-effect-2': {
          'box-shadow': '0px -4px 8px 0px rgba(0,0,0,0.05)',
          'backdrop-filter': 'blur(8px)',
          position: 'relative',
          'z-index': 10,
          padding: '0px 0px 8px 0px'
        }
      });
    },
    require('tailwindcss-animate')
  ]
} satisfies Config;
