import React from 'react';
import { Box, Card, CardContent, MenuItem, Typography, InputLabel, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ManulifeMedicalPlan from './dropdown/manulife/manulife_medical_plan';
import DeductibleOptions from './dropdown/manulife/deductible_options';

const Input = ({ inputs, setInputs, appBarColor }) => {
  const { t } = useTranslation();

  const handleChange = (field) => (event) => {
    setInputs(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Generate years from 2024 to 2034
  const years = Array.from({ length: 11 }, (_, i) => 2024 + i);

  return (
    <Box display="grid" gap={1}>
      <Card elevation={1}>
        <CardContent>
          <Box display="grid" gap={1} sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' } }}>
            {/* Year Selection */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Year')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.year}
                onChange={handleChange('year')}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Plan Selection */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Plan')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.plan}
                onChange={handleChange('plan')}
              >
                {ManulifeMedicalPlan.map((plan) => (
                  <MenuItem key={plan} value={plan}>
                    {plan}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Age Selection */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Age')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.age}
                onChange={handleChange('age')}
              >
                {Array.from({ length: 121 }, (_, i) => i + 1).map((age) => (
                  <MenuItem key={age} value={age}>
                    {age}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Deductible Selection */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Deductible')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.deductible}
                onChange={handleChange('deductible')}
                disabled={!inputs.plan}
              >
                {DeductibleOptions[inputs.plan]?.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Number of Years Selection */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Number of Year')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.numberOfYears}
                onChange={handleChange('numberOfYears')}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Input;