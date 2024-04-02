import React, {
    Dispatch,
    SetStateAction,
  } from "react";
  import { useForm, FormProvider, useFieldArray } from "react-hook-form";
  
  import { Drawer, Typography, Button, Box, Avatar } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import { Purpose } from "./Purpose";
  import { Version } from "./Version";
  import { DataExchangeModeFormControl } from "./DataExchangeMode";
  import { PurposeDescription } from "./PurposeDescription";


  import DefaultBanner from "../../assets/OrganisationDefaultBanner.jpg";
  import DefaultLogo from "../../assets/OrganisationDefaultLogo.png";
  
  import DataAgreementPersonalDataTable from "../dataAgreements/DataAgreementPersonalDataTable";
  import DataAgreementPolicy from "../dataAgreements/DataAgreementPolicy";
  import DPIAConfigurations from "../dataAgreements/DPIAConfiguration";
  import DataSchemaModal from "./dataSchemaModal";
  
  import { DataAgreementPayload } from "../dataAgreements/DataAgreementActions";
  import { HttpService } from "../../service/HTTPService";
  

  import { LawfullBasisOfProcessingFormControll } from "../dataAgreements/LawfullBasisOfProcessing";
  import { OrganizationDetailsCRUDContext } from "../../contexts/organizationDetailsCrud";
  import SnackbarComponent from "../notification";
  import { isFormDataChanged } from "../../utils/isFormDataChanged";
  import { useTranslation } from "react-i18next";
import { defaultCoverImage, defaultLogoImg } from "../../utils/defalultImages";
import { ConnectedAgreement } from "./ConnectedAgreement";
import DataSharingRestriction from "./DataSharingRestriction";
  
  interface Props {
    open: boolean;
    handleClick: Dispatch<SetStateAction<boolean>>;
    mode: string;
    successCallback?: any;
    resourceName?: string;
    selectededDataAgreementFromDataAgreement?: any;
    dataAgrreementRevisionIdForSelectedRecord?: string | undefined;
    setSelectedDropdownValue?: any;
  }
  
  let defaultValue = {
    Name: "",
    Description: "",
    Version: "1.0.0",
    AttributeType: "null",
    LawfulBasisOfProcessing: "consent",
    PolicyURL: "https://igrant.io/policy.html",
    Jurisdiction: "London, GB",
    IndustryScope: "Retail",
    StorageLocation: "Europe",
    dataRetentionPeriodDays: 0,
    Restriction: "Europe",
    Shared3PP: false,
    DpiaDate: new Date().toISOString().slice(0, 16),
    DpiaSummaryURL: "https://privacyant.se/dpia_results.html",
    dataAttributes: [{ attributeName: "", attributeDescription: "" }],
  };
  
  export default function ViewDataAgreementModal(props: Props) {
    const {
      open,
      handleClick,
      mode,
      successCallback,
      resourceName,
      selectededDataAgreementFromDataAgreement,
      dataAgrreementRevisionIdForSelectedRecord,
      setSelectedDropdownValue,
    } = props;
    const { t } = useTranslation("translation");
    
  
    return (
      <>
        <Drawer anchor="right" open={open}>
          <Box className="dd-modal-container">
              <form>
                <Box className="dd-modal-header">
                  <Box pl={2}>
                    <Typography color="#F3F3F6">
                    Edit Data Agreement: User Data for Third Parties
                    </Typography>
                    {mode !== "Create" && (
                      <Typography color="#F3F3F6">
                        654cf0db9684ed907ce07c5f
                      </Typography>
                    )}
                  </Box>
                  <CloseIcon
                    onClick={handleClick}
                    sx={{
                      paddingRight: 2,
                      cursor: "pointer",
                      color: "#F3F3F6",
                    }}
                  />
                </Box>
                <Box className='dd-modal-banner-container'>
                    <Box
                    style={{ height: "150px", width: "100%" }}
                    component="img"
                    alt="Banner"
                    src={defaultCoverImage}
                    />
              </Box>
              <Box sx={{ marginBottom: "60px" }}>
                <Avatar
                  src={defaultLogoImg}
                  style={{
                    position: "absolute",
                    marginLeft: 50,
                    marginTop: "-65px",
                    width: "110px",
                    height: "110px",
                    border: "solid white 6px",
                  }}
                />
              </Box>

              <Box className='dd-modal-details'>
                <Box p={1.5}>
                  <Typography variant="h6" fontWeight="bold">
                    National ID
                  </Typography>
                  <Typography>
                    Sweden
                  </Typography>
                  <Typography variant="subtitle1" mt={3}>
                    {t("common.overView")}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="#9F9F9F"
                    mt={1}
                    sx={{ wordWrap: "breakWord" }}
                  >
                    For Queries about how we are managing your data please contact the Data Protection Officer.
                  </Typography>

                  <ConnectedAgreement open={true} mode={""} />
                  <Typography
                        style={{
                          fontSize: "14px",
                          textDecoration: "underline",
                          color: "grey",
                          marginTop: "5px",
                          cursor: "not-allowed",
                        }}
                      >
                        (View Data Disclosure Agreement)
                      </Typography>

                  <DataExchangeModeFormControl
                      open={props.open}
                      mode={props.mode}
                      selectededDataAgreementFromDataAgreement={
                        selectededDataAgreementFromDataAgreement
                      }
                    />
                    
                    <Purpose open={props.open} mode={props.mode} />

                    <Version />

                    <DataSharingRestriction />

                    {/* <LawfullBasisOfProcessingFormControll
                      open={props.open}
                      mode={props.mode}
                    /> */}

                  {/* <Box mt={2}> */}
                    {/* <Purpose open={props.open} mode={props.mode} /> */}

                    {/* <Version /> */}

                    {/* <DataExchangeModeFormControl
                      open={props.open}
                      mode={props.mode}
                      selectededDataAgreementFromDataAgreement={
                        selectededDataAgreementFromDataAgreement
                      }
                    /> */}

                    {/* Required for future purpose in enterprise dashboard */}
                    {/* <Typography
                        style={{
                          fontSize: "14px",
                          textDecoration: "underline",
                          color: "grey",
                          marginTop: "-7px",
                          cursor: "not-allowed",
                        }}
                      >
                        (Choose existing schemas)
                      </Typography> */}

                    {/* <PurposeDescription open={props.open} mode={props.mode} />

                    <LawfullBasisOfProcessingFormControll
                      open={props.open}
                      mode={props.mode}
                    />

                    <Typography variant="subtitle1">
                      {t("dataAgreements.dataPolicyConfigurations")}
                      <span style={{ color: "rgba(224, 7, 7, 0.986)" }}>*</span>
                    </Typography>
                    <DataAgreementPolicy mode={mode} />

                    <Typography variant="subtitle1">
                      {t("dataAgreements.DPIAConfigurations")}
                    </Typography>
                    <DPIAConfigurations mode={mode} />
                  </Box>

                  <DataAgreementPersonalDataTable
                    mode={mode}
                    append={append}
                    fields={fields}
                    remove={remove}
                    formController={control}
                  /> */}
                </Box> 
              </Box>
              </form>
          </Box>
        </Drawer>
      </>
    );
  }
  