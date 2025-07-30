import { Avatar, Box, Button, Typography, IconButton } from '@mui/material';
import React, { useState } from 'react';
import ChooseComponent from './Choose';
import ConfirmComponent from './Confirm';
import '@/assets/sass/style.scss'
import { useTranslations } from 'next-intl';

import { useCreateVerification, useReadVerificationWithPolling, useVerificationTemplates } from '@/custom-hooks/verification'
import Loader from "@/components/common/Loader";
import './style.scss'
import { X, Eye, EyeClosed } from '@phosphor-icons/react';
import RightSidebar from '@/components/common/RightSidebar';
import { useAppSelector } from '@/custom-hooks/store';
import { defaultCoverImage, defaultLogoImg } from '@/constants/defalultImages';

interface AddCredentialProps {
  callRightSideDrawer: () => void;
  isVerify: boolean;
}

const AddCredentialComponent = ({ callRightSideDrawer, isVerify }: AddCredentialProps) => {
  const t = useTranslations();
  const [isLoader, setLoader] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(isVerify ? 1 : 0);
  const [showValues, setShowValues] = useState(false);
  
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
      component: <ConfirmComponent showValues={showValues} setShowValues={setShowValues} />,
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

  // Define header content
  const headerContent = (
    <Typography variant="h6" color="inherit">
      {currentIndex > 0 ? `${t('gettingStarted.viewCredential')}` : `${t('gettingStarted.connectWalletTitle')} ${contentArray[currentIndex].headerName}`}
    </Typography>
  );

  // Define footer content
  const footerContent = (
    <>
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
      {currentIndex === 0 && (
        <Button
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
        </Button>
      )}
    </>
  );

  // Get data source metadata for banner and header
  const gettingStartData = useAppSelector((state: any) => state.gettingStart.data);
  const { coverImageUrl, logoUrl, name } = gettingStartData?.dataSource || {};

  // Define header content
  const headerContentValue = (
    <Box sx={{ width: "100%" }}>
      <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '20px', color: '#F3F3F6' }}>
        {currentIndex > 0 ? `${t('gettingStarted.viewCredential')}` : `${t('gettingStarted.connectWalletTitle')} ${contentArray[currentIndex].headerName}`}
      </Typography>
    </Box>
  );

  // Define banner content
  const bannerContent = (
    <>
      <Box
        component="img"
        alt="Banner"
        src={coverImageUrl || defaultCoverImage}
        sx={{ height: 194, width: '100%', objectFit: 'cover' }}
      />
      <Box sx={{ position: "relative", height: '65px', marginTop: '-65px' }}>
        <Avatar
          src={logoUrl || defaultLogoImg}
          sx={{
            position: 'absolute',
            left: 50,
            top: 0,
            width: 110,
            height: 110,
            border: '6px solid white'
          }}
        />
      </Box>
    </>
  );

  return (
    <RightSidebar
      open={true}
      onClose={callRightSideDrawer}
      headerContent={headerContentValue}
      bannerContent={bannerContent}
      showBanner={true}
      footerContent={footerContent}
      width={594}
      maxWidth={594}
      height="100%"
      hideCloseButton={true}
    >
      <Box sx={{ p: 2 }}>
        {contentArray[currentIndex].component}
      </Box>
    </RightSidebar>
  );
};

export default AddCredentialComponent;