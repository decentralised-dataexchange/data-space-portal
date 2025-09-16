"use client";
import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { useTranslations } from "next-intl";

interface CopyButtonProps {
  text: string;
  size?: "small" | "medium" | "large";
  onCopied?: () => void;
}

export default function CopyButton({ text, size = "small", onCopied }: CopyButtonProps) {
  const t = useTranslations();
  const [copiedOpen, setCopiedOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedOpen(true);
      if (onCopied) onCopied();
      setTimeout(() => setCopiedOpen(false), 1500);
    } catch (e) {
      // noop
    }
  };

  return (
    <Tooltip
      title={t("common.copied")}
      open={copiedOpen}
      disableHoverListener
      disableFocusListener
      disableTouchListener
      placement="top"
    >
      <span>
        <Button
          onClick={handleCopy}
          size={size}
          variant="text"
          startIcon={<FileCopyOutlinedIcon sx={{ fontSize: 16, color: "#808080" }} />}
          sx={{
            color: "#808080",
            display: "flex",
            alignItems: "center !important",
            // Override any global uppercase with !important
            textTransform: "none !important",
            "&, & *": { textTransform: "none !important" },
            "&:hover": { backgroundColor: "transparent" },
            minWidth: 0,
            padding: 0,
            margin: 1,
          }}
        >
          {t("common.copy")}
        </Button>
      </span>
    </Tooltip>
  );
}
