import React, {useState} from "react";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import OrgLogoImageUpload from "../../component/OrganisationDetails/OrgLogoImageUpload";
import DrawerComponent from "../../component/Drawer";
import AddCredentialComponent from "../../container/AddCredential";
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import './style.scss';
import { useTranslation } from "react-i18next";

const DetailsContainer = styled("div")({
  height: "auto",
  width: "100%",
  borderRadius: 2,
  backgroundColor: "#FFFFF",
  padding: 10,
});

const editStyleEnable: React.CSSProperties = {
  borderWidth: 1,
  borderBottomStyle: "solid",
  borderBottomColor: "#DFE0E1",
  height: 23,
};

const buttonStyle = {
  height: 30,
  width: 100,
  borderRadius: 0,
  border: "1px solid #DFDFDF",
};

type Props = {
  editMode: boolean;
  logoImageBase64: string | undefined;
  organisationDetails: any;
  handleEdit: () => void;
  setOganisationDetails: React.Dispatch<React.SetStateAction<any>>;
  setLogoImageBase64: React.Dispatch<React.SetStateAction<any>>;
};

const OrganisationDetailsContainer = (props: Props) => {
  const { t } = useTranslation('translation');
  const [openRightSideDrawer, setOpenRightSideDrawer] = useState(false)
  const {
    editMode,
    logoImageBase64,
    organisationDetails,
    handleEdit,
    setOganisationDetails,
    setLogoImageBase64,
  } = props;

  const callRightSideDrawer = () => {
    setOpenRightSideDrawer(!openRightSideDrawer)
}
  

  return (
    <DetailsContainer sx={{ flexGrow: 1 }}>
      <DrawerComponent
            openRightSideDrawer={openRightSideDrawer}
            callRightSideDrawer={callRightSideDrawer}>
            <AddCredentialComponent callRightSideDrawer={callRightSideDrawer} />
        </DrawerComponent>
      <Grid
        sx={{
          display: { xs: "grid", sm: "flex" },
          justifyContent: "space-between",
          paddingLeft: { xs: "0", sm: "50px" },
        }}
      >
        <Grid
          sx={{
            height: { xs: "auto", sm: "90px" },
            display: { xs: "grid", sm: "flex" },
            width: "auto",
          }}
        >
          <OrgLogoImageUpload
            editMode={editMode}
            logoImageBase64={logoImageBase64}
            setLogoImageBase64={setLogoImageBase64}
          />

          <Box
            sx={{
              marginLeft: { xs: "0", sm: "30px" },
              marginTop:
                editMode === true
                  ? { xs: "-150px", sm: "0px" }
                  : { xs: "9px", sm: "0px" },
            }}
          >
              <>
              <Box sx={{ display: "flex", alignItems: 'center'}}>
                  <Typography variant="h6" fontWeight="bold" mt={"-4px"}>
                    {t('gettingStarted.organisationName')}
                  </Typography>
                  <DoNotDisturbOnIcon className="no-verify" />
                  <p className="add-credential" onClick={callRightSideDrawer}>
                  {(t('gettingStarted.addCredential'))}
                  </p>
                  <p className="edit" onClick={() => {}}>
                    {(t('gettingStarted.edit'))}
                  </p>
              </Box>
                <Typography variant="body2" height="23px">
                {(t('gettingStarted.sector'))}
                </Typography>
                <Typography variant="body2" height="23px">
                {(t('gettingStarted.location'))}
                </Typography>
                <Typography variant="body2" height="23px">
                {(t('gettingStarted.policyUrl'))}
                </Typography>
              </>
          </Box>
        </Grid>
      </Grid>
      <Box>
        <Typography variant="h6" fontWeight="bold" >{t('gettingStarted.overView')}</Typography>
        <Box className="pt-20">
          <Typography className="txtOverview" >{(t('gettingStarted.descriptionPlaceholder'))}</Typography>
        </Box>
      </Box>
    </DetailsContainer>
  );
};

export default OrganisationDetailsContainer;
