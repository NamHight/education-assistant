'use client';
import { createTheme } from '@mui/material/styles';
import getMPTheme from './theme/getMPTheme';
import { themeCalendar } from './theme/themeCelendar';

const lightTheme = createTheme(getMPTheme('light'));
const darkTheme = createTheme(getMPTheme('dark'));
const celendarTheme = createTheme(themeCalendar);
const theme = {
  light: lightTheme,
  dark: darkTheme,
  celendar: celendarTheme,
};

export default theme;
