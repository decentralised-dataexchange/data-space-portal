import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import ConnectComponent from './Connect';
import ChooseComponent from './Choose';
import ConfirmComponent from './Confirm';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import '../../../public/sass/style.scss'
import './style.scss'
import { useTranslation } from 'react-i18next';
import { getDevice } from '../../utils/utils'

const AddCredentialComponent = ({ callRightSideDrawer }) => {
    const { isMobile } = getDevice();
    const { t } = useTranslation('translation');
    const contentArray = [
        {
            headerName: `${t('gettingStarted.connect')}`,
            component: <ConnectComponent callRightSideDrawer={callRightSideDrawer} />,

        },
        {
            headerName: `${t('gettingStarted.choose')}`,
            component: <ChooseComponent callRightSideDrawer={callRightSideDrawer} />,
        },
        {
            headerName: `${t('gettingStarted.confirm')}`,
            component: <ConfirmComponent callRightSideDrawer={callRightSideDrawer} />,
        }


    ]
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleAddComponent = (index) => {
        if (currentIndex < contentArray.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if(index == 2) {
            setCurrentIndex(0);
            callRightSideDrawer();
            sessionStorage.setItem('isVerify', 'true');
        }
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
                <Box onClick={callRightSideDrawer} sx={{ cursor: "pointer", paddingLeft: isMobile ? '0' : currentIndex ? '125px' : '140px' }}>
                    <CloseIcon />
                </Box>
            </Box>
            <Box className="contentContainer">{contentArray[currentIndex].component}</Box>
            <Box className="btnContainer">
                <Button className="btn cancelBtn" size="small"onClick={callRightSideDrawer}>
                    {t('common.cancel')}
                </Button>
                <Button onClick={() => handleAddComponent(currentIndex)} className="btn nextBtn" size="small" >
                    {currentIndex == 2 ? `${t('common.confirm')}` : `${t('common.next')}`}
                </Button>
            </Box>
        </Box>
    );
}

export default AddCredentialComponent;