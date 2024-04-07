import { Box, Checkbox, Grid, ListItem, ListItemText, Typography } from '@mui/material';
import React, { useState } from 'react';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import './style.scss'
import QrCodeIcon from '@mui/icons-material/QrCode';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../customHooks';

interface ChooseProps {
    callRightSideDrawer: () => void
}


const ChooseComponent = ({ callRightSideDrawer } : ChooseProps) => {
    const [ isChecked, setIsChecked ] = useState<boolean>(true);
    const { t } = useTranslation('translation');

    const handleChange = () => {
        setIsChecked(!isChecked)
    }

    const verificationTemplateObj = useAppSelector(
        (state) => state?.gettingStart?.verificationTemplate?.data
      );

    const { verificationTemplates } = verificationTemplateObj || [];

    return (
        <>
            <Box component="div" className='businessInfo'>
                <Typography className='mdc-typography--body2' gutterBottom component="div">{t('gettingStarted.chooseDescription')} </Typography>
                <Grid container alignItems="center" className='mt-4'>
                    <Grid item >
                        <AccountBalanceWalletOutlinedIcon fontSize='large' />
                    </Grid>
                    <Grid item>
                        <Typography className="ml-1" variant="body1">{`${t('gettingStarted.chooseWalletTitle')} ${verificationTemplates?.length > 0 && verificationTemplates[0]?.walletName}, ${verificationTemplates?.length > 0 && verificationTemplates[0]?.walletLocation}`}</Typography>
                    </Grid>
                </Grid>
                <Box className="itemContainer">
                    {
                        verificationTemplates?.length > 0 && verificationTemplates?.map((obj) => {
                            return (
                                <ListItem key={obj?.id}>
                                    <Checkbox
                                        disabled
                                        className='prl-30'
                                        color="primary"
                                        onChange={() => handleChange()}
                                        checked={isChecked}
                                    />
                                    <Box className="itemTextContainer">
                                        <ListItemText primary={
                                            <Grid container alignItems="center">
                                                <Grid item xs={10}>
                                                    <Typography className='title-font pb-10'>{obj?.verificationTemplateName}</Typography>
                                                    <Typography className='title-font' fontWeight="bold">{`${obj?.walletName}, ${obj?.walletLocation}`}</Typography>
                                                    <Typography className='title-font' fontStyle="italic">{`${t('gettingStarted.chooseWalletThree')} ${obj?.issuerName}, ${obj?.issuerLocation}`}</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <img 
                                                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                                        src={obj?.issuerLogoUrl}
                                                    />
                                                </Grid>
                                            </Grid>
                                        } />
                                    </Box>
                                </ListItem>
                            )
                        })
                    }
                </Box>
            </Box>
        </>
    );
}

export default ChooseComponent;



