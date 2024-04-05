import React, { useState } from 'react';
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { VisibilityOutlined, UploadOutlined, DeleteOutlineOutlined } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material';
import './style.scss';
import VersionDropdown from '../../component/VersionDropDown';
import { useTranslation } from 'react-i18next';
import ViewDataAgreementModal from './ViewDDAgreementModal';
import DeleteModal from './generalModal';

const actionIcons = (selectedData) => {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenViewDDA, setIsOpenViewDDA] = useState(false);

  const { t } = useTranslation('translation');
  return (
    <>
      <Box className="actionBtnContainer pointer d-flex-center">
        <Tooltip title={t("dataAgreements.tooltipPublished")} placement="top">
          <UploadOutlined sx={{ color: 'rgb(185, 185, 185)', fontSize: '1.25rem', cursor: "no-drop" }} />
        </Tooltip>
        <Tooltip title={t("dataAgreements.tooltipView")} placement="top">
          <VisibilityOutlined sx={{ color: 'rgb(185, 185, 185)', fontSize: '1.25rem', cursor: "pointer" }} onClick={() => setIsOpenViewDDA(true)}/>
        </Tooltip>
        <Tooltip title={t("dataAgreements.tooltipDelete")} placement="top">
          <DeleteOutlineOutlined sx={{ color: 'rgb(185, 185, 185)', fontSize: '1.25rem', cursor: "pointer"}} onClick={() => setIsOpenDelete(true)}/>
        </Tooltip>
    </Box>

    <ViewDataAgreementModal 
        open={isOpenViewDDA}
        setOpen={setIsOpenViewDDA} 
        mode={''} 
        selectedData={selectedData}
    />
    <DeleteModal 
        open={isOpenDelete} 
        setOpen={setIsOpenDelete} 
        confirmText={''} 
        headerText={''} 
        modalDescriptionText={undefined} 
        resourceName={''} confirmButtonText={''} 
    />
    </>
  )
}

const TableData = (data) => {
  return data?.map((agreement) => ({
    purpose: agreement.purpose,
    version: <VersionDropdown key={agreement.id} record={agreement} />,
    lawfulBasis: agreement.lawfulBasis,
    status: agreement.status,
    actions: (agreement) => actionIcons(agreement) 
  }));
};



const TableHead  =  [
    {
      title: "Usage purpose",
      field: "purpose",
      headerWidth: "25%",
    },
    {
      field: "version",
      title: "Version",
    },
    {
      field: "status",
      title: "Status",
    },
    {
      field: "lawfulBasis",
      title: "Lawful Basis of Processing",
      headerWidth: "20%",
    },
    {
      cell: actionIcons,
      title: "",
    }
  ];
  
  export { TableHead, TableData  };