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
import DeleteModal from './DeleteModal';

const actionIcons = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const handleClick = (isDelete) => {
    isDelete ? setIsOpenDelete(!isOpenDelete) : setIsOpen(!isOpen);
}
  const { t } = useTranslation('translation');
  return (
    <>
      <Box className="actionBtnContainer pointer d-flex-center">
        <Tooltip title={t("dataAgreements.tooltipPublished")} placement="top">
          <UploadOutlined sx={{ color: 'rgb(185, 185, 185)', fontSize: '1.25rem', cursor: "no-drop" }} />
        </Tooltip>
        <Tooltip title={t("dataAgreements.tooltipView")} placement="top">
          <VisibilityOutlined sx={{ color: 'rgb(185, 185, 185)', fontSize: '1.25rem', cursor: "pointer" }} onClick={handleClick}/>
        </Tooltip>
        {/* <Tooltip title={t("dataAgreements.tooltipEdit")} placement="top">
          <EditOutlined sx={{ color: 'rgb(185, 185, 185)', fontSize: '1.25rem', cursor: "pointer" }} />
        </Tooltip> */}
        <Tooltip title={t("dataAgreements.tooltipDelete")} placement="top">
          <DeleteOutlineOutlined sx={{ color: 'rgb(185, 185, 185)', fontSize: '1.25rem', cursor: "pointer"}} onClick={() => handleClick('delete')}/>
        </Tooltip>
    </Box>

    <ViewDataAgreementModal 
        open={isOpen}
        handleClick={handleClick}
        mode={''} 
    />
    <DeleteModal 
        open={isOpenDelete} 
        setOpen={handleClick} 
        confirmText={''} 
        headerText={''} 
        modalDescriptionText={undefined} 
        resourceName={''} confirmButtonText={''} 
    />
    </>
  )
}

const TableData =  [
  {
    purpose: "Registration data",
    version: <VersionDropdown key={undefined} record={undefined} selectedValue={undefined} setSelectedValue={undefined} setSelectedDropdownDataAgreementValue={undefined} />,
    lawfulProcess: "Contractual purpose",
    status: "Listed",
    ddexchange: "Data exchange"
  },
]

const TableHead =  [
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
      field: "ddexchange",
      title: "Data Exchange",
    },
    {
      field: "status",
      title: "Status",
    },
    {
      field: "lawfulProcess",
      title: "Lawful Basis of Processing",
      headerWidth: "20%",
    },
    {
      cell: actionIcons,
      title: "",
    }
  ];
  
  export { TableHead, TableData  };