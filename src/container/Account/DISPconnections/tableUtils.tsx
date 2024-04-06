import React, { useState } from 'react';
import {  DeleteOutlineOutlined } from '@mui/icons-material'
import { Box, Tooltip, Typography } from '@mui/material';
import './style.scss';
import { useTranslation } from 'react-i18next';
import GeneralModal from "../../../component/Modals/generalModal";
import { doApiDelete } from "../../../utils/fetchWrapper";
import { ENDPOINTS } from "../../../utils/apiEndpoints"
import { useAppDispatch } from '../../../customHooks';
import { listConnectionAction } from '../../../redux/actionCreators/gettingStart';

const actionIcons = (props) => {
  const { t } = useTranslation('translation');
  const dispatch = useAppDispatch()
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const handleOpen = () => {
    setIsOpenDelete(true);
  }

  const handleSubmit = () => {
    const uri = ENDPOINTS.deleteConnection(props.id);
    doApiDelete(uri).then((res) => {
      dispatch(listConnectionAction(10, 0, true));
      setIsOpenDelete(false);
    })
  }

  return (
    <>
      <Box className="actionBtnContainer pointer d-flex-center" sx={{ cursor: "pointer" }} onClick={() => handleOpen()}>
        <Tooltip title={t("developerAPIs.tooltipDelete")} placement="top">
          <DeleteOutlineOutlined sx={{ color: 'rgb(185, 185, 185)', fontSize: '1.25rem'}} />
        </Tooltip>
    </Box>
    <GeneralModal
      open={isOpenDelete}
      setOpen={setIsOpenDelete}
      confirmText={t("dispConnection.delete")}
      headerText={`${t("dispConnection.headerText")}  ${props.connection_id}`}
      modalDescriptionText={
        <Typography variant="body1">
          You are about to delete an existing data disclosure agreement.
          Please type <b>DELETE</b> to confirm and click DELETE. This action
          is not reversible.
        </Typography>
      }
      handleSubmit={handleSubmit}
      confirmButtonText={"DELETE"}
      selectedData={''}
      setRefetchTable={''}
      refetchTable={''}
    />
    </>
  )
}

const TableHead =  [
    {
      title: "DISP Label",
      field: "their_label",
      headerWidth: "25%",
    },
    {
      field: "created_at",
      title: "Connected on",
    },
    {
      field: "connection_id",
      title: "Connection ID",
    },
    {
      cell: actionIcons,
      title: "",
    }
  ];
  
  export { TableHead  };