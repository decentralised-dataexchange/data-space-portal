import React from 'react';
import { Select, SelectProps, MenuItem, SelectChangeEvent, styled } from '@mui/material';

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: '8px 32px 8px 12px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    '&:focus': {
      borderRadius: '4px',
      borderColor: '#000',
      boxShadow: '0 0 0 1px #000',
    },
    '&:hover': {
      borderColor: '#000',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #000',
    boxShadow: '0 0 0 1px #000',
  },
  '& .MuiSvgIcon-root': {
    color: 'rgba(0, 0, 0, 0.54)',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&.MuiMenuItem-root': {
    padding: '8px 16px',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '&.Mui-selected': {
      backgroundColor: '#e0e0e0',
      '&:hover': {
        backgroundColor: '#e0e0e0',
      },
    },
  },
}));

interface CustomSelectProps extends Omit<SelectProps, 'onChange'> {
  options: Array<{ value: string | number; label: string }>;
  onChange?: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  ...props
}) => {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (onChange) {
      onChange(event.target.value as string);
    }
  };

  return (
    <StyledSelect
      value={value}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'select' }}
      {...props}
    >
      {options.map((option) => (
        <StyledMenuItem key={option.value} value={option.value}>
          {option.label}
        </StyledMenuItem>
      ))}
    </StyledSelect>
  );
};

export default CustomSelect;
