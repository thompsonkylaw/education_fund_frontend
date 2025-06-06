import React from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Target = ({ target, updateTarget,disabled,company }) => {
  const { t } = useTranslation();
  const numberOfYearsOptions = Array.from({ length: 20 }, (_, i) => i + 1);
  const ageOptions = company === "Prudential"
    ? Array.from({ length: 120 }, (_, i) => i + 1) // 1 to 120 for Prudential
    : Array.from({ length: 121 }, (_, i) => i);
    
  const handleChange = (field) => (event) => {
    updateTarget({ ...target, [field]: event.target.value });
  };
  return (
    <Box display="grid" gap={1} sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
      <Box>
        <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
          {t('Age')}
        </Typography>
        <Select
          fullWidth
          variant="standard"
          value={target.age || 0}
          onChange={handleChange('age')}
          error={target.age === 0}
          disabled={disabled}
        >
          {ageOptions.map((age) => (
            <MenuItem key={age} value={age}>
              {age}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
          {t('Number of Year')}
        </Typography>
        <Select
          fullWidth
          variant="standard"
          value={target.numberOfYears || 15}
          onChange={handleChange('numberOfYears')}
          error={!target.numberOfYears}
          disabled={disabled}
        >
          {numberOfYearsOptions.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default Target;