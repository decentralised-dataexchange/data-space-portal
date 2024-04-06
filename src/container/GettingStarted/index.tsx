
import React, { useEffect, useState } from 'react';
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import OrgCoverImageUpload from "../../component/OrganisationDetails/OrgCoverImageUpload";
import OrganisationDetailsContainer from "../../component/OrganisationDetails/OrgDetailsContainer";
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from "../../customHooks";
import { gettingStartAction, listConnectionAction } from '../../redux/actionCreators/gettingStart';

const Container = styled("div")(({ theme }) => ({
  margin: "0px 15px 0px 15px",
  paddingBottom: "50px",
  [theme.breakpoints.down("sm")]: {
    margin: "52px 0 10px 0",
  },
}));

const DetailsContainer = styled("div")({
  height: "auto",
  width: 'auto',
  borderRadius: 2,
  backgroundColor: "#FFFFF",
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
  const [editMode, setEditMode] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('translation');
  const navigate = useNavigate();

  const gettingStartData = useAppSelector(
    (state) => state?.gettingStart?.data
  );

  const listConnections = useAppSelector(
    (state) => state?.gettingStart?.listConnection?.data
  );

  const isEnableAddCredential = listConnections?.connections?.length > 0 && listConnections?.connections[0]?.connectionState == 'active';

  useEffect(() => {
    !gettingStartData && dispatch(gettingStartAction());
    !listConnections && dispatch(listConnectionAction(10, 0, false));
  }, []);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  return (
      <Container className='pageContainer'>
        <OrgCoverImageUpload
          editMode={editMode}
          coverImageBase64={'logoImageBase64'}
          setCoverImageBase64={'logoImageBase64'}
        />
        <OrganisationDetailsContainer
              editMode={editMode}
              logoImageBase64={'logoImageBase64'}
              handleEdit={() => { handleEdit() } }
              isEnableAddCredential={isEnableAddCredential}
              organisationDetails={gettingStartData?.dataSource}
              setOganisationDetails={() => { } } 
              setLogoImageBase64={() => { } } 
         />

        <DetailsContainer sx={{ flexGrow: 1, marginTop: "15px" }}>
          <Grid container spacing={2}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <Item
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/${t("route.dd-agreements")}`)}
              >
                <Typography variant="body1" color="grey">
                  {t('gettingStarted.prepareDA')}
                </Typography>
              </Item>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <Item
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/${t("route.manageAdmin")}`)}
              >
                <Typography variant="body1" color="grey">
                {t('gettingStarted.manageAccount')}
                </Typography>
              </Item>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <Item
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/${t("route.developerApis")}`)}
              >
                <Typography variant="body1" color="grey">
                  {t('gettingStarted.developerDocumentation')} 
                </Typography>
              </Item>
            </Grid>
          </Grid>
        </DetailsContainer>
      </Container>
  );
};

export default GettingStarted;
