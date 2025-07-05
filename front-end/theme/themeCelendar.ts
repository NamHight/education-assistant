import { ThemeOptions } from '@mui/material';
import type {} from '@mui/x-date-pickers/themeAugmentation';
export const themeCalendar: ThemeOptions = {
  components: {
    MuiDatePicker: {
      defaultProps: {
        displayWeekNumber: true
      }
    },
    MuiDateRangeCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f0f0f0'
        }
      }
    }
  }
};
