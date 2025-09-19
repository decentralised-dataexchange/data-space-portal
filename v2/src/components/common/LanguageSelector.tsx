"use client"
import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const LanguageSelector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleChange = (locale: string) => {
    // Get current path and remove the locale part
    const pathnameParts = window.location.pathname.split("/");
    // Remove first empty string (from leading slash) and current locale
    pathnameParts.splice(0, 2);
    // Construct new path with new locale
    const newPath = `/${locale}${pathnameParts.length > 0 ? '/' + pathnameParts.join('/') : ''}`;
    
    // Navigate to the new locale path
    router.push(newPath);
    // Optionally store language preference
    localStorage.setItem("preferredLanguage", locale);
    setOpen(false);
  };

  return (
    <>
      <Button
        ref={anchorRef}
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={{ textTransform: "capitalize !important", padding: 0, color: "#808080", fontSize: "12px" }}
      >
        {t('common.language')}
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
              <MenuItem style={{ fontSize: "12px" }} onClick={() => handleChange("en")}>English</MenuItem>
              <MenuItem style={{ fontSize: "12px" }} onClick={() => handleChange("sv")}>Swedish</MenuItem>
              <MenuItem style={{ fontSize: "12px" }} onClick={() => handleChange("fi")}>Finnish</MenuItem>
            </Menu>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default LanguageSelector;
