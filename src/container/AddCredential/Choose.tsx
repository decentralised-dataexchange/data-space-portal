import { Box, Checkbox, Grid, ListItem, ListItemText, Typography } from '@mui/material';
import React from 'react';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import './style.scss'
import QrCodeIcon from '@mui/icons-material/QrCode';
import { useTranslation } from 'react-i18next';


const ChooseComponent = ({ callRightSideDrawer }) => {
    const { t } = useTranslation('translation');
    return (
        <>
            <Box component="div" className='businessInfo'>
                <Typography className='mdc-typography--body2' gutterBottom component="div">{t('gettingStarted.chooseDescription')} </Typography>
                <Grid container alignItems="center" className='mt-4'>
                    <Grid item >
                        <AccountBalanceWalletOutlinedIcon fontSize='large' />
                    </Grid>
                    <Grid item>
                        <Typography className="ml-2" variant="body1">{t('gettingStarted.chooseWalletTitle')}</Typography>
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
                                        <Typography>{t('common.certificateOfRegistration')}</Typography>
                                        <Typography fontWeight="bold">{t('gettingStarted.chooseWalletTitle')}</Typography>
                                        <Typography fontStyle="italic">{t('gettingStarted.chooseWalletThree')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <QrCodeIcon color="success"/>
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



