import React, {useEffect, useState} from "react";

import {
  Grid,
  Typography,
  Box,
  Tooltip,
  Alert,
  Button,
  Snackbar,
  TextField,
  FormControl,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import BasicTable from '../../../component/Table';
import { TableHead } from './tableUtils'
import { formatISODateToLocalString } from '../../../utils/utils';
import './style.scss';
import { useAppSelector, useAppDispatch } from '../../../customHooks';
import { listConnectionAction } from "../../../redux/actionCreators/gettingStart";
import { doApiPost } from '../../../utils/fetchWrapper';
import { ENDPOINTS } from "../../../utils/apiEndpoints"
import CloseIcon from "@mui/icons-material/Close";


const Container = styled("div")(({ theme }) => ({
  margin: "0px 15px 0px 15px",
  paddingBottom: "50px",
  [theme.breakpoints.down("sm")]: {
    margin: "10px",
  },
}));

const HeaderContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginTop: "10px",
});

const DetailsContainer = styled("div")({
  height: "auto",
  width: "100%",
  borderRadius: 2,
});

const Item = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  padding: 10,
  paddingLeft: 20,
  height: "auto",
  borderRadius: 2,
  border: "1px solid #CECECE",
}));

const DispConnection = () => {
  const dispatch = useAppDispatch();
  const listConnections = useAppSelector(
    (state) => state?.gettingStart?.listConnection?.data
  );

  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const { connections, pagination } = listConnections && listConnections || {};

  useEffect(() => {
    !connections && dispatch(listConnectionAction(limit, offset, true));
  }, []);

  useEffect(() => {
    dispatch(listConnectionAction(limit, offset, true))
  }, [limit, offset]);

  const handlePageChange = (event, newPage) => {
    setOffset(newPage * limit);
  };

  const handleRowsPerPageChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setOffset(0);
  };

  const TableData =  []
  connections?.length > 0 && connections.map((obj) => {
    const { connectionRecord } = obj;
    obj?.connectionRecord.connection_id ? TableData.push(
      {
      id: obj?.id,
      their_label: connectionRecord?.their_label,
      created_at: connectionRecord?.created_at && formatISODateToLocalString(connectionRecord?.created_at),
      connection_id: connectionRecord?.connection_id
    }) : ''
  });
  const [invitationUrl, setInvitationUrl] = useState<string>('');
  

  const [showAPI, setShowAPI] = useState(false);
  const { t } = useTranslation("translation");

  const handleCopy = () => {
    if (showAPI) {
      navigator.clipboard.writeText(invitationUrl);
    }
  };

const createConnection = () => {
  const uri = ENDPOINTS.createConnection();
  doApiPost(uri).then((res) => {
    setInvitationUrl(res?.connection?.invitationUrl);
  });
}

useEffect(() => { 
  invitationUrl && setShowAPI(true);
}, [invitationUrl]);
  

  const ScopeField = (props: any) => {
    const record = useRecordContext(props);
    if (!record || !props.source) {
      return null;
    }
    let scopes = record[props.source];
    return (
      <Box style={{ display: "flex" }}>
        {scopes.map((scope: any, i: number) => {
          if (i + 1 === scopes.length) {
            return (
              <Typography variant="body2">
                {capitalizeFirstLetter(scope)}{" "}
              </Typography>
            );
          } else {
            return (
              <Typography variant="body2" style={{ marginRight: 7 }}>
                {capitalizeFirstLetter(scope)},{" "}
              </Typography>
            );
          }
        })}
      </Box>
    );
  };

  return (
    <Container className="dd-container">
      <DetailsContainer sx={{ flexGrow: 1 }}>
      <Snackbar
        open={showAPI}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        style={{ top: 100 }}
      >
        <Alert
          icon={<></>}
          sx={{
            width: "100%",
            background: "#E5E4E4",
            color: "black",
            display: "flex",
            alignItems: "center",
          }}
          onClose={() => setShowAPI(false)}
          action={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                color="inherit"
                size="small"
                style={{ fontWeight: "bold" }}
                onClick={handleCopy}
              >
                {t("developerAPIs.copy")}
              </Button>
              <Button
                color="inherit"
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => setShowAPI(false)}
              >
                <CloseIcon />
              </Button>
            </Box>
          }
        >
          {t("developerAPIs.apiKeyCopyMessage")}
        </Alert>
      </Snackbar>
        <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box style={{ display: "flex", alignItems: "center" }} mt={1}>
              <Typography color="black" variant="subtitle1" fontWeight="bold">
                {t("dispConnection.headerText")}
              </Typography>
              <Tooltip title={t("developerAPIs.createConnection")} placement="top">
                <AddCircleOutlineOutlinedIcon
                  onClick={() => {
                    createConnection()
                  }}
                  style={{
                    cursor: "pointer",
                    marginLeft: "7px",
                  }}
                />
              </Tooltip>
            </Box>
        </Grid>
        <Box className="d-flex-between">
        <Typography variant="body2" mt={2.25} mb={1}>
        {t("dispConnection.titleText")}
        </Typography>  
          {/* <FormControl>
            <Grid container spacing={2} alignItems="center">
              <Grid item lg={11} md={12} sm={12} xs={12}>
                <TextField
                  size="small"
                  className='searchField'
                  variant="outlined"
                  placeholder="search..."
                  // onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item lg={1} md={12} sm={12} xs={12}>
                <InfoIcon  sx={{ cursor: 'pointer'}}/>
              </Grid>
            </Grid>
          </FormControl> */}
        </Box> 
        <Box sx={{ marginTop: '16px'}}>
            <BasicTable tableData={TableData} tableField={TableHead}/>
            {TableData?.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={pagination?.totalItems}
                rowsPerPage={limit}
                page={Math.floor(offset / limit)}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            )}
        </Box>

      </DetailsContainer>

    </Container>
  );
};

export default DispConnection;
