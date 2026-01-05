"use client";

import { Box } from "@mui/material";

interface TagChipsProps {
  tags: string[];
  size?: "small" | "medium";
  maxDisplay?: number;
  onDelete?: (tag: string) => void;
}

export function TagChips({
  tags,
  size = "small",
  maxDisplay,
}: TagChipsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const remainingCount = maxDisplay ? Math.max(0, tags.length - maxDisplay) : 0;

  const fontSize = size === "small" ? "13px" : "14px";

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
      {displayTags.map((tag) => (
        <Box
          key={tag}
          component="span"
          sx={{
            fontSize,
            color: "#536471",
            fontWeight: 400,
            cursor: "default",
            border: "1px solid #cfd9de",
            borderRadius: "4px",
            padding: "2px 8px",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.03)",
            },
          }}
        >
          #{tag}
        </Box>
      ))}
      {remainingCount > 0 && (
        <Box
          component="span"
          sx={{
            fontSize,
            color: "#536471",
            fontWeight: 400,
            border: "1px solid #cfd9de",
            borderRadius: "4px",
            padding: "2px 8px",
            backgroundColor: "rgba(0, 0, 0, 0.03)",
          }}
        >
          +{remainingCount} more
        </Box>
      )}
    </Box>
  );
}

export default TagChips;
