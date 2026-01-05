"use client";

import { useState, KeyboardEvent } from "react";
import {
  Box,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Plus } from "@phosphor-icons/react";

interface TagEditorProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxTags?: number;
}

export function TagEditor({
  tags,
  onTagsChange,
  isLoading = false,
  disabled = false,
  placeholder = "Add a tag...",
  maxTags = 10,
}: TagEditorProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim().toLowerCase();
    if (
      trimmedValue &&
      !tags.includes(trimmedValue) &&
      tags.length < maxTags
    ) {
      onTagsChange([...tags, trimmedValue]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToDelete));
  };

  const isDisabled = disabled || isLoading;

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <TextField
          size="small"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              endAdornment: isLoading ? (
                <CircularProgress size={20} />
              ) : null,
            },
          }}
        />
        <IconButton
          onClick={handleAddTag}
          disabled={isDisabled || !inputValue.trim() || tags.length >= maxTags}
          color="primary"
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            height: 40,
            width: 40,
          }}
        >
          <Plus size={20} />
        </IconButton>
      </Box>

      {tags.length >= maxTags && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          Maximum {maxTags} tags allowed
        </Typography>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={`#${tag}`}
            size="small"
            onDelete={isDisabled ? undefined : () => handleDeleteTag(tag)}
            variant="outlined"
            sx={{
              borderRadius: "4px",
              borderColor: "#cfd9de",
              color: "#536471",
              backgroundColor: "transparent",
              "& .MuiChip-deleteIcon": {
                color: "#536471",
                "&:hover": {
                  color: "#1d9bf0",
                },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default TagEditor;
