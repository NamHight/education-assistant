import { Typography } from '@mui/material';

interface MessageErrorProps {
  message?: string;
}

const MessageError = ({ message }: MessageErrorProps) => {
  return (
    <Typography component='span' className={'text-sm text-red-600'}>
      {message}
    </Typography>
  );
};

export default MessageError;
