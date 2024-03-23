import React from 'react';
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { VisibilityOutlined, UploadOutlined, DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material';
import './style.scss';
import { useTranslation } from 'react-i18next';

const actionIcons = () => {
  const { t } = useTranslation('translation');
  return (
    <>
      <Box className="actionBtnContainer pointer d-flex-center" sx={{ cursor: "pointer" }}>
        <Tooltip title={t("dataAgreements.tooltipDelete")} placement="top">
          <DeleteOutlineOutlined sx={{ color: 'rgb(185, 185, 185)', fontSize: '1.25rem'}} />
        </Tooltip>
    </Box>
    </>
  )
}

const TableData =  [
  {
    dispLabel: "",
    connectedOn: "",
    connectionID: ""
  },
]

const TableHead =  [
    {
      title: "DISP Label",
      field: "dispLabel",
      headerWidth: "25%",
    },
    {
      field: "connectedOn",
      title: "Connected on",
    },
    {
      field: "connectionID",
      title: "Connection ID",
    },
    {
      cell: actionIcons,
      title: "",
    }
  ];
  
  export { TableHead, TableData  };