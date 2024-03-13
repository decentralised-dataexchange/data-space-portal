import { Box, Button, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ConnectComponent = ({ callRightSideDrawer }) => {

    const { t } = useTranslation('translation');
    const [credentialArray, setcredentialArray] = useState([]);

    return (
        <>
            <Box component="div" className='businessInfo'>
                <Typography gutterBottom component="div">{t('gettingStarted.connectDescription')}</Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">{t('gettingStarted.country')}</InputLabel>
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            labelId="demo-simple-select-outlined-label"
                        >
                            <MenuItem value={10}>Sweden</MenuItem>
                            <MenuItem value={20}>Sweden 2</MenuItem>
                            <MenuItem value={30}>Sweden 3</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">{t('gettingStarted.trustedIssuers')}</InputLabel>
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            labelId="demo-simple-select-outlined-label"
                        >
                            <MenuItem value={10}>Bolagsverket</MenuItem>
                            <MenuItem value={20}>Bolagsverket 2</MenuItem>
                            <MenuItem value={30}>Bolagsverket 3</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Box className="walletContainer">
                <Typography gutterBottom variant="h6">{t('gettingStarted.walletTitle')}</Typography>
                <Box className="walletInfo">
                    <FormControl component="fieldset">
                        <RadioGroup row value={1}   >
                            <FormControlLabel value={1} control={<Radio />} label={t('gettingStarted.cloudWallet')} labelPlacement='end' />
                            <FormControlLabel value={2} control={<Radio />} label={t('gettingStarted.mobileWallet')} labelPlacement='end' />
                        </RadioGroup>
                    </FormControl>
                    <Box component="div">
                        <Typography gutterBottom component="div">{t('gettingStarted.walletDescription')}</Typography>
                        <TextField
                            className="businessJustifiation"
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default ConnectComponent;



