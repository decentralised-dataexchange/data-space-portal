import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTranslation } from "react-i18next";

const LanguageSelector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { t, i18n } = useTranslation("translation");
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleChange = (value: any) => {
    i18n.changeLanguage(value);
    localStorage.setItem("i18nextLng", value);
    setOpen(false);
  };

  return (
    <>
      <Button
        ref={anchorRef}
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={{ textTransform: "none", padding: 0, color: "#808080", fontSize:"12px" }}
      >
        {t("common.language")}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="top-start"
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleToggle}>
            <Menu
              id="dropdown-menu"
              anchorEl={anchorRef.current}
              keepMounted
              open={open}
              onClose={handleToggle}
              TransitionProps={TransitionProps}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <MenuItem style={{fontSize:"12px"}} onClick={() => handleChange("en")}>English</MenuItem>
              <MenuItem style={{fontSize:"12px"}} onClick={() => handleChange("sv")}>Swedish</MenuItem>
              <MenuItem style={{fontSize:"12px"}} onClick={() => handleChange("fi")}>Finnish</MenuItem>
            </Menu>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default LanguageSelector;
