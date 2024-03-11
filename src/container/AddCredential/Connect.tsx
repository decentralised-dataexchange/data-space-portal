import { Box, Button, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const ConnectComponent = ({ callRightSideDrawer }) => {
    const [credentialArray, setcredentialArray] = useState([]);

    return (
        <>
            <Box component="div" className='businessInfo'>
                <Typography gutterBottom component="div">Your business is currently unverified. Verify your business by adding credentials from the list of valid issuers. Select your issuers and continue. </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Country</InputLabel>
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            // id="demo-simple-select-outlined"
                            // label="Label"
                        >
                            <MenuItem value={10}>Sweden</MenuItem>
                            <MenuItem value={20}>Sweden 2</MenuItem>
                            <MenuItem value={30}>Sweden 3</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Trusted Issuers</InputLabel>
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            // id="demo-simple-select-outlined"
                            // label="Label"
                        >
                            <MenuItem value={10}>Bolagsverket</MenuItem>
                            <MenuItem value={20}>Bolagsverket 2</MenuItem>
                            <MenuItem value={30}>Bolagsverket 3</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Box className="walletContainer">
                <Typography gutterBottom variant="h6">Select your wallet source and share</Typography>
                <Box className="walletInfo">
                    <FormControl component="fieldset">
                        <RadioGroup row value={1}   >
                            <FormControlLabel value={1} control={<Radio />} label="Cloud Wallet" labelPlacement='end' />
                            <FormControlLabel value={2} control={<Radio />} label="Mobile Wallet" labelPlacement='end' />
                        </RadioGroup>
                    </FormControl>
                    <Box component="div">
                        <Typography gutterBottom component="div">Paste the connection invitation and share your proof of business credentials on </Typography>
                        <TextField
                            className="businessJustifiation"
                            label="Your Text"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default ConnectComponent;



