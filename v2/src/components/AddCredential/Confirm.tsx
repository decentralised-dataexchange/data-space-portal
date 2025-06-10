"use client"
import { Avatar, Box, Typography } from '@mui/material';
import React, { useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/custom-hooks/store';
import { defaultCoverImage, defaultLogoImg } from '@/constants/defalultImages';
import { DataAttributeCardForDDA } from './dataAttributeCardCredentials';
import CloseIcon from '@mui/icons-material/Close';

interface ConfirmProps {
    callRightSideDrawer: () => void
}

const ConfirmComponent = ({ callRightSideDrawer }: ConfirmProps) => {
    const t = useTranslations();
    const gettingStartData = useAppSelector(
        (state) => state?.gettingStart?.data
    );
    
    // Add safe destructuring with defaults
    const { coverImageUrl, logoUrl, location, description, name } = gettingStartData?.dataSource || {};
    
    // Use the correct property name 'verification' instead of 'verifyConnection'
    const verifyConnectionObj = useAppSelector(
        (state) => state?.gettingStart?.verification?.data?.verification?.presentationRecord
    );
    
    // Add a fallback path to check both possible data structures
    const fallbackVerifyConnectionObj = useAppSelector(
        (state) => state?.gettingStart?.data?.verification?.presentationRecord
    );
    
    // Use the first available data source
    const effectiveVerifyConnectionObj = verifyConnectionObj || fallbackVerifyConnectionObj;
    
    // Log which data source we're using
    useEffect(() => {
        console.log('Primary verification path available:', !!verifyConnectionObj);
        console.log('Fallback verification path available:', !!fallbackVerifyConnectionObj);
        console.log('Using effective verification object:', !!effectiveVerifyConnectionObj);
    }, [verifyConnectionObj, fallbackVerifyConnectionObj, effectiveVerifyConnectionObj]);
    
    const values = effectiveVerifyConnectionObj?.presentation?.requested_proof?.revealed_attrs;

    const tableData = useMemo(() => {
        // Add more comprehensive null checks
        if (!effectiveVerifyConnectionObj?.presentation_request?.requested_attributes) {
            console.log('No presentation request or requested attributes found');
            return [];
        }
        
        try {
            const keys = Object.keys(effectiveVerifyConnectionObj.presentation_request.requested_attributes);
            const tableObj: Record<string, string> = {};
            
            keys.forEach((i) => {
                const name = effectiveVerifyConnectionObj.presentation_request.requested_attributes[i]?.name;
                if (name && values?.[i]?.raw) {
                    tableObj[name] = values[i].raw;
                }
            });
            
            const result = Object.keys(tableObj).map((key) => ({ 
                attribute: key, 
                value: tableObj[key] 
            }));
            
            return result;
        } catch (error) {
            console.error('Error processing verification data:', error);
            return [];
        }
    }, [effectiveVerifyConnectionObj, values]);
    
    // Add debug logging for credential data
    useEffect(() => {
        console.log('DEBUG CREDENTIAL DATA:');
        console.log('verifyConnectionObj (primary path):', verifyConnectionObj);
        console.log('fallbackVerifyConnectionObj (fallback path):', fallbackVerifyConnectionObj);
        console.log('effectiveVerifyConnectionObj (used):', effectiveVerifyConnectionObj);
        console.log('values:', values);
        console.log('tableData:', tableData);
    }, [verifyConnectionObj, fallbackVerifyConnectionObj, effectiveVerifyConnectionObj, values, tableData]);
   
    

    return (
        <>
            <Box className="dd-modal-container">
                <form>
                    <Box className="dd-modal-banner-container">
                        <Box
                            style={{ height: "150px", width: "100%" }}
                            component="img"
                            alt="Banner"
                            src={coverImageUrl ? coverImageUrl : defaultCoverImage}
                        />
                        </Box>
                    <Box sx={{ marginBottom: "60px" }}>
                        <Avatar
                            src={logoUrl ? logoUrl : defaultLogoImg}
                            style={{
                            position: "absolute",
                            marginLeft: 50,
                            marginTop: "-65px",
                            width: "110px",
                            height: "110px",
                            border: "solid white 6px",
                            }}
                        />
                    </Box>

                    <Box className="dd-modal-details" style={{ paddingBottom: "120px" }}>
                        <Box p={1.5}>
                            <Typography variant="h6" fontWeight="bold">
                            {name}
                            </Typography>
                            <Typography color="#9F9F9F">
                            {location}
                            </Typography>
                            <Typography variant="subtitle1" mt={3}>
                            {t("common.overView")}
                            </Typography>
                            <Typography
                            variant="subtitle2"
                            color="#9F9F9F"
                            mt={1}
                            sx={{ wordWrap: "breakWord" }}
                            >
                            {description}
                            </Typography>

                            <Typography color="grey" mt={3} variant="subtitle1">
                                {t('common.certificateOfRegistration')}
                            </Typography>

                            <DataAttributeCardForDDA  selectedData={tableData}/>

                            <Box className='confirmTable'>
                                {/* <BasicTable 
                                    isColumnWise={true} 
                                    tableData={tableData}
                                    customTableHeadClass={"mui-table-bordered"}
                                    customTableBodyClass={"mui-table-bordered"}
                                /> */}
                            </Box>
                        </Box>
                    </Box>
                </form>
            </Box>
        </>
    );
}

export default ConfirmComponent;