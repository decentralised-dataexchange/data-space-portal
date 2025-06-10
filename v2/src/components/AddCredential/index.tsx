"use client"
import { Box, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
// import ConnectComponent from './Connect';
import ChooseComponent from './Choose';
import ConfirmComponent from './Confirm';
import CloseIcon from '@mui/icons-material/Close';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import '@/assets/sass/style.scss'
import './style.scss'
import { useTranslations } from 'next-intl';
import { useCreateVerificationWithPolling, useReadVerificationWithPolling, useGetVerification } from '@/custom-hooks/gettingStarted';
import Loader from '@/components/common/Loader';

interface AddCredentialProps {
  callRightSideDrawer: () => void;
  isVerify: boolean;
}

const AddCredentialComponent = ({ callRightSideDrawer, isVerify }: AddCredentialProps) => {
  const t = useTranslations();
  const [isLoader, setLoader] = useState(false);

  // Use React Query hooks for verification actions
  const createVerificationMutation = useCreateVerificationWithPolling();
  const readVerificationMutation = useReadVerificationWithPolling();
  const { refetch: fetchVerification } = useGetVerification();

  // Fetch verification data when the modal opens for viewing credentials
  useEffect(() => {
    if (isVerify) {
      console.log('Fetching verification data for viewing credentials');
      fetchVerification();
    }
  }, [isVerify, fetchVerification]);

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

  const startPoll = (obj: any) => {
    const isVerified = obj.verification?.presentationState;
    if (isVerified !== 'verified') {
      setTimeout(() => {
        readVerificationMutation.mutate(startPoll);
      }, 5000);
    } else if (isVerified === 'verified') {
      setLoader(false);
      setCurrentIndex(0);
      callRightSideDrawer();
    }
  }

  const handleAddComponent = (index: number) => {
    createVerificationMutation.mutate(startPoll);
    setLoader(true);
  };

  // const handleBack = (index) => {
  //     setCurrentIndex(currentIndex - 1);
  // }

  return (
    <Box
      role="presentation"
      className="drawerContent"
    >
      <Box className="dd-modal-header" sx={{ backgroundColor: '#03182b' }}>
        <Box pl={2} className="dd-modal-header-content">
          <Typography className="dd-modal-header-text" sx={{ color: '#F3F3F6', fontWeight: 500 }}>
            {currentIndex > 0 ? `${t('gettingStarted.viewCredential')}` : t('gettingStarted.connectWalletTitle') + contentArray[currentIndex].headerName}
          </Typography>
          <CloseIcon
            onClick={callRightSideDrawer}
            sx={{
              cursor: "pointer",
              color: "#F3F3F6",
            }}
          />
        </Box>
      </Box>
      <Box>{contentArray[currentIndex].component}</Box>
      <Box className="modal-footer">
        <Button
          onClick={() => !isLoader && callRightSideDrawer()}
          className="delete-btn"
          sx={{
            height: 36,
            minWidth: 100,
            borderRadius: 0,
            border: "1px solid #DFDFDF",
            cursor: isLoader ? "not-allowed" : "pointer",
            color: isLoader ? "#6D7676" : "black",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
            },
          }}
          variant="outlined"
        >
          {t('common.close')}
        </Button>
        {currentIndex === 0 ? <Button
          className="delete-btn"
          onClick={() => !isLoader && handleAddComponent(currentIndex)}
          variant="outlined"
          sx={{
            height: 36,
            minWidth: 100,
            borderRadius: 0,
            border: "1px solid #DFDFDF",
            marginLeft: "10px",
            cursor: isLoader ? "not-allowed" : "pointer",
            color: isLoader ? "#6D7676" : "black",
            "&:hover": {
              backgroundColor: isLoader ? "#6D7676" : "black",
              color: "white",
            },
          }}
        >
          {isLoader ? <Loader isBtnLoader={true} /> : `${t('common.confirm')}`}
        </Button> : ''
        }
      </Box>
    </Box>
  );
}

export default AddCredentialComponent;