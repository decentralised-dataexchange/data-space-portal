import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import ConnectComponent from './Connect';
import ChooseComponent from './Choose';
import ConfirmComponent from './Confirm';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import '../../../public/sass/style.scss'
import './style.scss'

const AddCredentialComponent = ({ callRightSideDrawer }) => {

    const contentArray = [
        {
            headerName: 'CONNECT',
            component: <ConnectComponent callRightSideDrawer={callRightSideDrawer} />,
        },
        {
            headerName: 'CHOOSE',
            component: <ChooseComponent callRightSideDrawer={callRightSideDrawer} />,
        },
        {
            headerName: 'CONFIRM',
            component: <ConfirmComponent callRightSideDrawer={callRightSideDrawer} />,
        }


    ]
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleAddComponent = () => {
        if (currentIndex < contentArray.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <Box
            role="presentation"
            className="drawerContent"
        >
            <Box className="titleContainer">
                <Box>
                    <Typography variant="h5">
                        <Box component={"span"} alignItems="center"><ArrowBackIosNewIcon /></Box> ADD CREDENTIAL - {contentArray[currentIndex].headerName}</Typography>
                </Box>
                <Box onClick={callRightSideDrawer} sx={{ cursor: "pointer" }}>
                    <CloseIcon />
                </Box>
            </Box>
            <Box className="contentConatainer">{contentArray[currentIndex].component}</Box>
            <Box className="btnContainer">
                <Button className="btn cancelBtn" size="small" >
                    Cancel
                </Button>
                <Button onClick={handleAddComponent} className="btn nextBtn" size="small" >
                    {currentIndex == 2 ? 'Confirm' : 'Next'}
                </Button>
            </Box>
        </Box>
    );
}

export default AddCredentialComponent;



