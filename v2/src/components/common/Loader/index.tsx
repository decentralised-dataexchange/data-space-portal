import React from 'react';
import { CircularProgress, Stack } from '@mui/material';
import './style.scss'

type LoaderProps = {
  isBtnLoader?: boolean;
}

const Loader = ({
  isBtnLoader
}: LoaderProps) => (
      <Stack alignItems="center" className={isBtnLoader ? '' : 'loader'}>
        <CircularProgress color="inherit" size={isBtnLoader ? '25px' : '40px'}/>
      </Stack>
);

export default Loader;
