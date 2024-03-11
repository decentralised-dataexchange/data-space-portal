import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, ListItem, ListItemText, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import './style.scss'
import { CheckBox } from '@mui/icons-material';
import CachedIcon from '@mui/icons-material/Cached';

const listItemData = () => {
    return (
        <>

        </>
    )
}

const ChooseComponent = ({ callRightSideDrawer }) => {
    const [credentialArray, setcredentialArray] = useState([]);



    return (
        <>
            <Box component="div" className='businessInfo'>
                <Typography gutterBottom component="div">Your business is currently unverified.Add credentials from the connected wallet to verify your business. </Typography>
                <Grid container alignItems="center" className='mt-4'>
                    <Grid item >
                        <AccountBalanceWalletOutlinedIcon fontSize='large' />
                    </Grid>
                    <Grid item>
                        <Typography className="ml-2" variant="body1">CONNECTED WALLET: BYGG AB, SWEDEN</Typography>
                    </Grid>
                </Grid>
                <Box className="itemContainer">
                    <ListItem>
                        <Checkbox
                            color="primary"
                        />
                        <Box className="itemTextContainer">
                            <ListItemText primary={
                                <Grid container alignItems="center">
                                    <Grid item xs={11}>
                                        <Typography>CERTIFICATION OF REGISTRATION</Typography>
                                        <Typography fontWeight="bold">North Health Innovation AB</Typography>
                                        <Typography fontStyle="italic">Issues by: Bolagsverket, Sweden</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CachedIcon />
                                    </Grid>
                                </Grid>
                            } />
                        </Box>
                    </ListItem>
                </Box>
            </Box>
        </>
    );
}

export default ChooseComponent;



