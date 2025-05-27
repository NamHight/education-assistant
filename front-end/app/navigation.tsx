import { Person, Work } from '@mui/icons-material';
import { type Navigation } from '@toolpad/core/AppProvider';

export const NAVIGATION: Navigation = [
  {
    segment: '/',
    title: 'Dashboard',
    icon: <Work />,
    pattern: `/:rest*`,
  },
  {
    segment: 'users',
    title: 'Users',
    icon: <Work />,
    pattern: `users/:rest*`,
  },
]