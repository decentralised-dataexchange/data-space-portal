import React, {useState} from "react";

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
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import BasicTable from '../../../component/Table';
import { TableData, TableHead } from './tableUtils'
import './style.scss';


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

const DeveloperAPIs = () => {
    const [showAPI, setShowAPI] = useState(false);
  const { t } = useTranslation("translation");

//   const handleCopy = () => {
//     if (showAPI) {
//       navigator.clipboard.writeText(apiKeyValue);
//     }
//   };
  

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
    <Container>
      <DetailsContainer sx={{ flexGrow: 1 }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box style={{ display: "flex", alignItems: "center" }} mt={1}>
              <Typography color="black" variant="subtitle1" fontWeight="bold">
              Data Intermediation Service Provider Connections
              </Typography>
              <Tooltip title={t("developerAPIs.createConnection")} placement="top">
                <AddCircleOutlineOutlinedIcon
                  onClick={() => {
                    setOpenEditPersonalDataModal(true);
                    setShowAPI(false);
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
          Manages connections towards your organisations
        </Typography>  
          <FormControl>
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
          </FormControl>
        </Box> 
        <Box sx={{ marginTop: '16px'}}>
            <BasicTable tableData={TableData} tableField={TableHead}/>
        </Box>

      </DetailsContainer>

    </Container>
  );
};

export default DeveloperAPIs;
