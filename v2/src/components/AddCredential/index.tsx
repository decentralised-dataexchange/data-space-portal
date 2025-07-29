import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import ChooseComponent from './Choose';
import ConfirmComponent from './Confirm';
import '@/assets/sass/style.scss'
import { useTranslations } from 'next-intl';

import { useCreateVerification, useReadVerificationWithPolling, useVerificationTemplates } from '@/custom-hooks/verification'
import Loader from "@/components/common/Loader";
import './style.scss'
import { XIcon } from '@phosphor-icons/react';

interface AddCredentialProps {
  callRightSideDrawer: () => void;
  isVerify: boolean;
}

const AddCredentialComponent = ({ callRightSideDrawer, isVerify }: AddCredentialProps) => {
  const t = useTranslations();
  const [isLoader, setLoader] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(isVerify ? 1 : 0);
  
  // Load templates using the consolidated verification hooks
  const { data: templates } = useVerificationTemplates();
  const defaultTemplateId = templates?.[0]?.id;
  
  // Setup mutation hooks
  const { mutate: createVerification } = useCreateVerification();
  const { mutate: readVerification } = useReadVerificationWithPolling();

  // Content for the two steps
  const contentArray = [
    {
      headerName: `${t('gettingStarted.choose')}`,
      component: <ChooseComponent callRightSideDrawer={callRightSideDrawer} />,
    },
    {
      headerName: `${t('gettingStarted.confirm')}`,
      component: <ConfirmComponent />,
    }
  ];

  // Poll for verification status updates
  const startPoll = (verification: any) => {
    const isVerified = verification.status;
    
    if (isVerified !== 'verified') {
      // Continue polling until verified
      setTimeout(() => {
        readVerification(verification.id, { onSuccess: startPoll });
      }, 5000);
    } else {
      // Verification complete, close the modal
      setLoader(false);
      setCurrentIndex(0);
      callRightSideDrawer();
    }
  };

  // Handle the "Add Credential" button click
  const handleAddComponent = () => {
    if (!defaultTemplateId) {
      console.error('No verification template selected');
      return;
    }
    createVerification(defaultTemplateId, { onSuccess: startPoll });
    setLoader(true);
  };

  // Handle back button click
  const handleBack = () => {
    setCurrentIndex((prev: number) => prev - 1);
  };

  return (
    <Box
      role="presentation"
      className="drawerContent"
    >
      <Box className="dd-modal-header">
        <Box pl={2} style={{ width: "90%" }}>
          <Typography className="dd-modal-header-text">
            {currentIndex > 0 ? `${t('gettingStarted.viewCredential')}` : `${t('gettingStarted.connectWalletTitle')} ${contentArray[currentIndex].headerName}`}
          </Typography>
        </Box>
        <XIcon
          size={22}
          onClick={callRightSideDrawer}
          sx={{
            paddingRight: 2,
            cursor: "pointer",
            color: "white",
          }}
        />
      </Box>
      <Box>{contentArray[currentIndex].component}</Box>
      <Box className="modal-footer">
        <Button
          onClick={isLoader ? undefined : callRightSideDrawer}
          className="delete-btn"
          sx={{
            marginRight: "10px",
            cursor: isLoader ? "not-allowed" : "pointer",
            color: isLoader ? "#6D7676" : "black",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
            },
          }}
          variant="outlined"
        >
          {"Close"}
        </Button>
        {currentIndex === 0 && <Button
          className="delete-btn"
          onClick={isLoader ? undefined : handleAddComponent}
          variant="outlined"
          sx={{
            marginRight: "20px",
            cursor: isLoader ? "not-allowed" : "pointer",
            color: isLoader ? "#6D7676" : "black",
            "&:hover": {
              backgroundColor: isLoader ? "#6D7676" : "black",
              color: "white",
            },
          }}
        >
          {isLoader ? <Loader isBtnLoader={true} /> : `${t('common.confirm')}`}
        </Button>}
      </Box>
    </Box>
  );
};

export default AddCredentialComponent;