import React, {useState} from "react";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import OrgLogoImageUpload from "../../component/OrganisationDetails/OrgLogoImageUpload";
import DrawerComponent from "../../component/Drawer";
import AddCredentialComponent from "../../container/AddCredential";
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
  const [ formValue, setFormValue ] = useState({'orgName': 'Organisation Name', 'location': 'Sweden', 'policyUrl': 'https://igrant.io/policy.html', 'description': `${(t('gettingStarted.descriptionPlaceholder'))}`})
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

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormValue({
    ...formValue,
    [name]: value,
  });
}
  
const isVerify = sessionStorage.getItem('isVerify');
  return (
    <DetailsContainer sx={{ flexGrow: 1 }} className="gettingStarted">
      <DrawerComponent
            openRightSideDrawer={openRightSideDrawer}
            callRightSideDrawer={callRightSideDrawer}>
            <AddCredentialComponent isVerify={isVerify} callRightSideDrawer={callRightSideDrawer} />
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
            {editMode ? (
            <>
            <Box sx={{ display: "flex", alignItems: 'center'}} mb={"11px"} mt={"-2px"}>
              <TextField
                autoFocus
                value={formValue.orgName}
                defaultValue={organisationDetails.name}
                onChange={(e) => handleChange(e)}
                variant="standard"
                // label={false}
                placeholder={t("gettingStarted.organisationName")}
                fullWidth
                name='orgName'
                style={{
                  ...editStyleEnable,
                  marginTop: "0.9px",
                  fontSize: "0.875rem !important"
                }}
                InputProps={{
                  disableUnderline: true,
                  style: { fontSize: 20, fontWeight: "bold", marginTop:"-4px" },
                }}
              />
            </Box>
              <Typography
                color="#9F9F9F"
                variant="body2"
                height="23px"
                style={{ marginTop: "10px" }}
              >
                {t("gettingStarted.sector")} Public
              </Typography>
              <TextField
                variant="standard"
                // label={false}
                value={formValue.location}
                name='location'
                onChange={(e) => handleChange(e)}
                placeholder={t("gettingStarted.location")}
                fullWidth
                style={{ ...editStyleEnable, marginTop: "-4px" }}
                InputProps={{
                  disableUnderline: true,
                  style: { fontSize: 14 },
                }}
              />
              <TextField
                variant="standard"
                // label={false}
                // value={organisationPolicyURL}
                onChange={(e) => handleChange(e)}
                placeholder={t("common.policyUrl")}
                value={formValue.policyUrl}
                fullWidth
                name='policyUrl'
                style={{ ...editStyleEnable }}
                  InputProps={{
                    disableUnderline: true,
                    style: { fontSize: 14 },
                  }}
              />
            </>
          ) : 
              <>
              <Box sx={{ display: "flex", alignItems: 'center'}}  mt={"-7px"} >
                  <Typography variant="h6" fontWeight="bold">
                    {organisationDetails?.name}
                  </Typography>
                  {isVerify ? <CheckCircleIcon className="verify" /> : <DoNotDisturbOnIcon className="no-verify" /> }
                  <p className={isVerify ? 'view-credential' : 'add-credential'} onClick={callRightSideDrawer}>
                  {isVerify ? (t('gettingStarted.viewCredential')) : (t('gettingStarted.addCredential')) }
                  </p>
              </Box>
                <Typography variant="body2" height="23px">
                {(t('gettingStarted.sector'))} Public
                </Typography>
                <Typography variant="body2" height="23px">
                 {organisationDetails?.sector}
                </Typography>
                <Typography variant="body2" height="23px">
                  {organisationDetails?.policyUrl}
                </Typography>
              </>
            }
          </Box>
        </Grid>
        <Grid>
          {editMode ? (
            <Box
              sx={{
                textAlign: { xs: "left", sm: "right" },
                marginTop: { xs: "-40px", sm: "0px" },
                paddingTop: "8px"
              }}
            >
              <Button
                onClick={handleEdit}
                style={buttonStyle}
                variant="outlined"
                sx={{
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                  color: "black",
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                // onClick={handleSave}
                style={buttonStyle}
                variant="outlined"
                sx={{
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                  color: "black",
                }}
              >
                {t("common.save")}
              </Button>
            </Box>
          ) : <Typography
                onClick={handleEdit}
                sx={{
                  cursor: "pointer",
                  textAlign: { xs: "left", sm: "right" },
                  marginTop: { xs: "14px", sm: "0px" },
                  padding: "10px"
                }}
              >
                {t("common.edit")}
              </Typography>}
          </Grid>
      </Grid>
       <Box sx={{ minHeight: 100, maxHeight: 160, overflow: "auto", marginTop: "50px"}}>
       <Typography variant="h6" fontWeight="bold" >{t('gettingStarted.overView')}</Typography>
          {editMode ? (
            <TextField
              variant="standard"
              value={(t('gettingStarted.descriptionPlaceholder'))}
              // onChange={(e) => setOrganisationOverView(e.target.value)}
              multiline={true}
              // defaultValue={organisationDetails.description}
              label={false}
              placeholder={(t('gettingStarted.descriptionPlaceholder'))}
              fullWidth
              style={{ marginTop: "-4px" }}
              InputProps={{
                disableUnderline: true,
                style: { fontSize: 14 },
              }}
            />
          ) : (
            <>
              <Box>
                <p className="txtOverview" >{organisationDetails?.description}</p>
              </Box>
            </>
          )}
        </Box>
    </DetailsContainer>
  );
};

export default OrganisationDetailsContainer;
