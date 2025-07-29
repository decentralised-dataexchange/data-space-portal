import React from 'react';
import { Select, SelectProps, MenuItem, SelectChangeEvent, styled } from '@mui/material';

const StyledSelect = styled(Select)(({ theme }) => ({
  '&.MuiInputBase-root': {
    width: '100%',
    fontSize: '14px',
    minHeight: '32px',
    '& .MuiSelect-select': {
      padding: '6px 32px 6px 12px',
      minHeight: '32px',
      height: '32px',
      lineHeight: '1.5',
      boxSizing: 'border-box',
      borderRadius: '4px',
      border: '1px solid #e0e0e0',
      backgroundColor: '#fff',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      '&:focus': {
        borderRadius: '4px',
        borderColor: '#000',
        boxShadow: '0 0 0 1px #000',
      },
      '&:hover': {
        borderColor: '#000',
      },
      '&.Mui-disabled': {
        backgroundColor: 'transparent',
        WebkitTextFillColor: 'inherit',
      },
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
    right: '8px',
  },
  '& .MuiSelect-iconOutlined': {
    right: '8px',
  },
  '&.Mui-disabled': {
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiSelect-select': {
      paddingRight: '32px',
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&.MuiMenuItem-root': {
    padding: '8px 16px',
    fontSize: '14px',
    minHeight: '32px',
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
