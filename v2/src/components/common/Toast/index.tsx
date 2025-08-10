import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

export type ToastProps = {
  open: boolean;
  message: string;
  severity?: AlertColor; // 'success' | 'info' | 'warning' | 'error'
  onClose: () => void;
  autoHideDuration?: number;
};

const Toast: React.FC<ToastProps> = ({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 4000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ zIndex: 1700 }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
