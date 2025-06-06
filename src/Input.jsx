import React from 'react';
import { Box, Typography, Select, MenuItem, TextField, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Input = ({ input, updateInput, disabled, isFirst,company }) => {
  const { t } = useTranslation();
  console.log("company={company}=",company)
  const expenseTypeOptions = [
    { value: 'tuition', label: t('expenseTypes.tuition') },
    { value: 'marriage', label: t('expenseTypes.marriage') },
    { value: 'business', label: t('expenseTypes.business') },
    { value: 'property', label: t('expenseTypes.property') },
    { value: 'retirement', label: t('expenseTypes.retirement') }
  ];

  const ageOptions = Array.from({ length: 100 }, (_, i) => i + 1);
  const toAgeOptions = input.fromAge ? ageOptions.filter(age => age >= input.fromAge) : ageOptions;

  const handleChange = (field) => (event) => {
    const newValue = event.target.value;
    if (field === 'fromAge') {
      const newFromAge = newValue;
      const currentToAge = input.toAge;
      let newToAge = currentToAge;
      if (newToAge === undefined || newToAge < newFromAge) {
        newToAge = newFromAge;
      }
      updateInput({ ...input, fromAge: newFromAge, toAge: newToAge });
    } else {
      updateInput({ ...input, [field]: newValue });
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const rawValue = value.replace(/[^\d.]/g, '');
    const parts = rawValue.split('.');
    let whole = parts[0] || '';
    const decimal = parts.length > 1 ? `.${parts[1].slice(0, 2)}` : '';
    if (whole) {
      whole = parseInt(whole, 10).toLocaleString('en-US');
    }
    const formattedValue = whole + decimal;
    if (value === '' || /^[0-9,]*\.?[0-9]*$/.test(value)) {
      updateInput({ ...input, yearlyWithdrawalAmount: formattedValue });
    }
  };

  return (
    <Box display="grid" gap={1} sx={{ gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mt: 2 }}>
      <Box>
        {isFirst && (
          <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            {t('Expense Type')}
          </Typography>
        )}
        <Select
          fullWidth
          variant="standard"
          value={input.expenseType || ''}
          onChange={handleChange('expenseType')}
          error={!input.expenseType}
          disabled={disabled}
        >
          {expenseTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        {isFirst && (
          <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            {t('From Age')}
          </Typography>
        )}
        <Select
          fullWidth
          variant="standard"
          value={input.fromAge || ''}
          onChange={handleChange('fromAge')}
          error={!input.fromAge}
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
        {isFirst && (
          <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            {t('To Age')}
          </Typography>
        )}
        <Select
          fullWidth
          variant="standard"
          value={input.toAge || ''}
          onChange={handleChange('toAge')}
          error={!input.toAge}
          disabled={disabled}
        >
          {toAgeOptions.map((age) => (
            <MenuItem key={age} value={age}>
              {age}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        {isFirst && (
          <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            {t('Yearly Withdrawal Amount')}
          </Typography>
        )}
        <TextField
          fullWidth
          variant="standard"
          value={input.yearlyWithdrawalAmount || ''}
          onChange={handleAmountChange}
          error={!input.yearlyWithdrawalAmount}
          disabled={disabled}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </Box>
    </Box>
  );
};

export default Input;