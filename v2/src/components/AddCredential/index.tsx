import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
// import ConnectComponent from './Connect';
import ChooseComponent from './Choose';
import ConfirmComponent from './Confirm';
import CloseIcon from '@mui/icons-material/Close';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import '@/assets/sass/style.scss'
import { useTranslations } from 'next-intl';

import { useCreateVerification, useReadVerificationWithPolling } from '@/custom-hooks/verification' // consolidated hooks  
import Loader from "@/components/common/Loader";
import './style.scss'
import { useAppSelector } from '@/custom-hooks/store';

interface AddCredentialProps {
    callRightSideDrawer: () => void;
    isVerify: boolean;
}

const AddCredentialComponent = ({ callRightSideDrawer, isVerify }: AddCredentialProps) => {
    const t = useTranslations();
    
    const [isLoader, setLoader] = useState(false);
  const { mutate: createVerification } = useCreateVerification();
  // select templates
  const verificationTemplates = useAppSelector(
    (state) => state.gettingStart.verificationTemplate.data as any[]
  );
  const defaultTemplateId = verificationTemplates?.[0]?.id;
  const { mutate: readVerification } = useReadVerificationWithPolling();
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
            component: <ConfirmComponent />, 
        }


    ]
    const [currentIndex, setCurrentIndex] = useState(isVerify ? 1 : 0);

    const startPoll = (verification: any) => {
        const isVerified = obj.verification?.presentationState;
        if(isVerified != 'verified') {
            setTimeout(() => {
                readVerification(verification.id)
            }, 5000);
        } else if(isVerified == 'verified') {
            setLoader(false)
            setCurrentIndex(0);
            callRightSideDrawer();
        }
    }

    const handleAddComponent = () => {
        if (!defaultTemplateId) {
            console.error('No verification template selected');
            return;
        }
        createVerification(defaultTemplateId, { onSuccess: startPoll });
        setLoader(true);
    };

    const handleBack = () => {
        setCurrentIndex(prev => prev - 1);
    }

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
              <CloseIcon
                onClick={callRightSideDrawer}
                fontSize='large'
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
            {currentIndex == 0 ? <Button
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
            </Button> : ''
            }
          </Box>
        </Box>
    );
}

export default AddCredentialComponent;