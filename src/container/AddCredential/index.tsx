import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
// import ConnectComponent from './Connect';
import ChooseComponent from './Choose';
import ConfirmComponent from './Confirm';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import '../../../public/sass/style.scss'
import './style.scss'
import { useTranslation } from 'react-i18next';
import { getDevice } from '../../utils/utils'
import { useAppDispatch, useAppSelector  } from '../../customHooks';
import { createVerificationAction, readVerificationAction } from '../../redux/actionCreators/gettingStart'
import loader from '../../../public/img/loader.svg';

const AddCredentialComponent = ({ callRightSideDrawer, isVerify }) => {
    const { isMobile } = getDevice();
    const { t } = useTranslation('translation');
    const dispatch = useAppDispatch();
    const [isLoader, setLoader] = useState(false);
    const contentArray = [
        // {
        //     headerName: `${t('gettingStarted.connect')}`,
        //     component: <ConnectComponent callRightSideDrawer={callRightSideDrawer} />,

        // },
        {
            headerName: `${t('gettingStarted.choose')}`,
            component: <ChooseComponent callRightSideDrawer={callRightSideDrawer} />,
        },
        {
            headerName: `${t('gettingStarted.confirm')}`,
            component: <ConfirmComponent callRightSideDrawer={callRightSideDrawer} />,
        }


    ]
    const [currentIndex, setCurrentIndex] = useState(isVerify ? 1 : 0);

    const startPoll = (obj) => {
        const isVerified = obj.verification?.presentationState;
        if(isVerified != 'verified') {
            setTimeout(() => {
                dispatch(readVerificationAction(startPoll))
            }, 5000);
        } else if(isVerified == 'verified') {
            setLoader(false)
            setCurrentIndex(0);
            callRightSideDrawer();
        }
    }

    const handleAddComponent = (index) => {
        dispatch(createVerificationAction(startPoll));
        setLoader(true);
    };

    const handleBack = (index) => {
        setCurrentIndex(currentIndex - 1);
    }

    return (
        <Box
            role="presentation"
            className="drawerContent"
        >
            <Box className="titleContainer">
                <Box component={"span"} alignItems="center">{currentIndex ? <ArrowBackIosNewIcon sx={{ cursor: "pointer" }} onClick={() => handleBack(currentIndex)} /> :'' }</Box>
                <Typography className='walletHeader'>{t('gettingStarted.connectWalletTitle')} - {contentArray[currentIndex].headerName}</Typography>
                <Box onClick={callRightSideDrawer} sx={{ cursor: "pointer", paddingLeft: isMobile ? '0' : currentIndex ? '210px' : '240px' }}>
                    <CloseIcon />
                </Box>
            </Box>
            <Box className="contentContainer">{contentArray[currentIndex].component}</Box>
            <Box className="btnContainer">
                <Button className="btn cancelBtn" size="small"onClick={callRightSideDrawer}>
                    {t('common.cancel')}
                </Button>
                {currentIndex ==0 ? <Button onClick={() => handleAddComponent(currentIndex)} className="btn nextBtn" size="small" >
                    {isLoader ? 'loading...' : `${t('common.confirm')}`}
                </Button> : ''
                }   
            </Box>
        </Box>
    );
}

export default AddCredentialComponent;