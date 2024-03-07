import React, { useState } from 'react';
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";

import BreadCrumb from "../../components/Breadcrumbs";
import OrgCoverImageUpload from "../../component/OrganisationDetails/OrgCoverImageUpload";

import OrganisationDetailsContainer from "../../component/OrganisationDetails/OrgDetailsContainer";
import DrawerComponent from '../../component/Drawer';
import AddCredentialComponent from '../AddCredential';
// import { OrganizationDetailsCRUDContext } from "../../contexts/organizationDetailsCrud";
// import { useTranslation } from "react-i18next";

const Container = styled("div")(({ theme }) => ({
  margin: "58px 15px 0px 15px",
  paddingBottom: "50px",
  [theme.breakpoints.down("sm")]: {
    margin: "52px 0 10px 0",
  },
}));

const DetailsContainer = styled("div")({
  height: "auto",
  width: "100%",
  borderRadius: 2,
  backgroundColor: "#FFFFF",
  padding: 10,
});

const Item = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f7f6f6",
  padding: theme.spacing(1),
  justifyContent: "center",
  color: "#0000",
  height: 90,
  borderRadius: 7,
  border: "1px solid grey",
}));

const GettingStarted = () => {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState('1')
    const [openRightSideDrawer, setOpenRightSideDrawer] = useState(false)

    const handleChange = (event) => {
        setSelectedValue(event.target.value)
    }

//   const {
//     organisationDetails,
//     logoImageBase64,
//     coverImageBase64,
//     setOrganisationDetails,
//     setCoverImageBase64,
//     setLogoImageBase64,
//   } = useContext(OrganizationDetailsCRUDContext);

//   const handleEdit = () => {
//     setEditMode(!editMode);
//   };


  return (
      <Container>
        {/* <BreadCrumb Link={t("sidebar.gettingStarted")} /> */}
        <OrgCoverImageUpload
          editMode={false}
          coverImageBase64={'logoImageBase64'}
          setCoverImageBase64={'logoImageBase64'}
        />
        <OrganisationDetailsContainer
              editMode={false}
              logoImageBase64={'logoImageBase64'}
              organisationDetails={'organisationDetails'}
              handleEdit={() => { } }
              organisationDetails={'setOrganisationDetails'}
              logoImageBase64={'setOrganisationDetails'}
              setOganisationDetails={() => { } } 
              setLogoImageBase64={() => { } } 
         />

        <DetailsContainer sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Item
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/dataagreement")}
              >
                <Typography variant="body1" color="grey">
                Prepare DataDisclosure Agreements
                </Typography>
              </Item>
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Item
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/developerapi")}
              >
                <Typography variant="body1" color="grey">
                Manage Accounts
                </Typography>
              </Item>
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Item
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/manageadmin")}
              >
                <Typography variant="body1" color="grey">
                Developer Documentations 
                </Typography>
              </Item>
            </Grid>
          </Grid>
        </DetailsContainer>
      </Container>
  );
};

export default GettingStarted;
