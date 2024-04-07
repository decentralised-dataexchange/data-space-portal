import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../customHooks";
import { gettingStartAction } from "../../redux/actionCreators/gettingStart";
import ViewDataAgreementModalInner from "./ViewDDAgreementModalInner";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mode: string;
  selectedData: any;
}

export default function ViewDataAgreementModal(props: Props) {
  const { open, setOpen, mode, selectedData } = props;
  const { t } = useTranslation("translation");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(gettingStartAction());
  }, []);

  const gettingStartData = useAppSelector(
    (state) => state?.gettingStart?.data?.dataSource
  );

  return (
    <ViewDataAgreementModalInner 
      open={open} 
      setOpen={setOpen} 
      mode={mode} 
      selectedData={selectedData} 
      dataSourceName={gettingStartData?.name} 
      dataSourceLocation={gettingStartData?.location} 
      dataSourceDescription={gettingStartData?.description}
      logoImage={gettingStartData?.logoUrl}
      coverImage={gettingStartData?.coverImageUrl}
    />
  );
}
