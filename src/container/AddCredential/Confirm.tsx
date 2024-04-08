import { Avatar, Box, Typography } from '@mui/material';
import BasicTable from '../../component/Table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../customHooks';
import { defaultCoverImage, defaultLogoImg } from '../../utils/defalultImages';


const ConfirmComponent = ({ callRightSideDrawer }) => {
    const { t } = useTranslation('translation');
    const gettingStartData = useAppSelector(
        (state) => state?.gettingStart?.data
      );
    const { coverImageUrl, logoUrl, location, description, name } = gettingStartData?.dataSource;
    const verifyConnectionObj = useAppSelector(
        (state) => state?.gettingStart?.verifyConnection.data?.verification?.presentationRecord
    );
    const values = verifyConnectionObj?.presentation?.requested_proof?.revealed_attrs;

    const keys = verifyConnectionObj?.presentation_request && Object.keys(verifyConnectionObj?.presentation_request?.requested_attributes)
    let tableObj = {};

    keys.map((i) => {
        tableObj[verifyConnectionObj?.presentation_request?.requested_attributes[i]?.name] = values[i]?.raw  
    });

    const tableData = []
    Object.keys(tableObj).map((key) => {
        tableData.push({ attribute: key, value: tableObj[key] })
    });
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

                    <Box className="dd-modal-details" style={{ paddingBottom: "80px" }}>
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

                            <Box className='confirmTable'>
                                <BasicTable 
                                    isColumnWise={true} 
                                    tableData={tableData}
                                    customTableHeadClass={"mui-table-bordered"}
                                    customTableBodyClass={"mui-table-bordered"}
                                />
                            </Box>
                        </Box>
                    </Box>
                </form>
            </Box>
        </>
    );
}

export default ConfirmComponent;