import { Box, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const ConfirmComponent = ({ callRightSideDrawer }) => {
    const [credentialArray, setcredentialArray] = useState([]);

    return (
        <>
            <Box component="div" className='businessInfo'>
                <Typography gutterBottom component="div">Your business is currently unverified. Choose confirm to verify your business. </Typography>
            </Box>
        </>
    );
}

export default ConfirmComponent;



