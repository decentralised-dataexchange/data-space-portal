import React, { useEffect, useState } from "react";
import BasicTable from "../../component/Table";
import { TableData, TableHead } from "./tableUtils";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import "./style.scss";
import { useTranslation } from "react-i18next";
import { HttpService } from "../../service/HttpService";
import DDAtable from "./ddaTable";
import ViewDataAgreementModal from "./ViewDDAgreementModal";
import GeneralModal from "./generalModal";
import ListDDAModal from "./listDDAModal";

const DDAgreements = () => {
  const [selectedFilterValue, setSelectedFilterValue] = useState("all");
  const [limit, setLimit] = useState(10);
  const [offsetValue, setOffsetValue] = useState(0);
  
  const [dataDisclosureAgreements, setDataDisclosureAgreements] =
    useState<any>();
  const { t } = useTranslation("translation");

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenPublish, setIsOpenPublish] = useState(false);
  const [isOpenViewDDA, setIsOpenViewDDA] = useState(false);
  const [selectedDDA, setSelectedDDA] = useState<any>();
  const [refetchTable, setRefetchTable] = useState(false);

  useEffect(() => {
    HttpService.listDataDisclosureAgreements(
      selectedFilterValue,
      limit,
      offsetValue
    ).then((res) => {
      setDataDisclosureAgreements(res);
    });
  }, [selectedFilterValue, limit, offsetValue, refetchTable]);

  const handleChange = (value: any) => {
    if (value === "complete") {
      setSelectedFilterValue("listed");
    } else if (value === "all") {
      setSelectedFilterValue("all");
    }
    setRefetchTable(!refetchTable);
  };

  const handlePageChange = (event, newPage) => {
    setOffsetValue(newPage * limit);
  };

  const handleRowsPerPageChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setOffsetValue(0);
  };

  return (
    <>
      <Box sx={{ margin: "15px 10px" }} className="dd-container">
        <Box className="d-flex space-between">
          <span className="dd-titleTxt">{t("dataAgreements.title")}</span>
          <Box component="div">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="all"
                name="radio-buttons-group"
                row
              >
                <FormControlLabel
                  value="all"
                  onChange={() => handleChange("all")}
                  control={<Radio name="all" color="default" size="small" />}
                  label={
                    <Typography variant="body2">{t("common.all")}</Typography>
                  }
                />
                <FormControlLabel
                  value="complete"
                  onChange={() => handleChange("complete")}
                  control={
                    <Radio name="complete" color="default" size="small" />
                  }
                  label={
                    <Typography variant="body2">
                      {t("dataAgreements.list")}
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ marginTop: "16px" }}>
          {t("dataAgreements.pageDescription")}
        </Typography>
        <Box sx={{ marginTop: "16px" }}>
          <DDAtable
            setIsOpenViewDDA={setIsOpenViewDDA}
            setSelectedDDA={setSelectedDDA}
            tabledata={dataDisclosureAgreements}
            setIsOpenDelete={setIsOpenDelete}
            setIsOpenPublish={setIsOpenPublish}
            limit={limit}
            offset={offsetValue}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Box>

        <ViewDataAgreementModal
          open={isOpenViewDDA}
          setOpen={setIsOpenViewDDA}
          mode={""}
          selectedData={selectedDDA}
        />
        <GeneralModal
          open={isOpenDelete}
          setOpen={setIsOpenDelete}
          confirmText={"DELETE"}
          headerText={"Delete Data Disclosure Agreement"}
          modalDescriptionText={
            <Typography variant="body1">
              You are about to delete an existing data disclosure agreement.
              Please type <b>DELETE</b> to confirm and click DELETE. This action
              is not reversible.
            </Typography>
          }
          resourceName={"dataDisclosureAgreements"}
          confirmButtonText={"DELETE"}
          selectedData={selectedDDA}
          setRefetchTable={setRefetchTable}
          refetchTable={refetchTable}
        />
        <ListDDAModal
          open={isOpenPublish}
          setOpen={setIsOpenPublish}
          headerText={"Publish Data Disclosure Agreement"}
          resourceName={"dataDisclosureAgreements"}
          confirmButtonText={"PUBLISH"}
          selectedData={selectedDDA}
          setRefetchTable={setRefetchTable}
          refetchTable={refetchTable}
        />
      </Box>
    </>
  );
};

export default DDAgreements;
