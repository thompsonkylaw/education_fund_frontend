import React, { useEffect } from 'react';
import { Box, Card, CardContent, MenuItem, Typography, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import manulife_medical_plan from './dropdown/manulife/1_manulife_medical_plan';
import manulife_medical_plan_catagoary from './dropdown/manulife/2_manulife_medical_plan_catagoary';
import manulife_medical_plan_effective_date from './dropdown/manulife/3_manulife_medical_plan_effective_date';
import manulife_medical_plan_currency from './dropdown/manulife/4_manulife_medical_plan_currency';
import manulife_medical_plan_sexuality from './dropdown/manulife/5_manulife_medical_plan_sexuality';
import manulife_medical_plan_ward from './dropdown/manulife/6_manulife_medical_plan_ward';
import manulife_medical_plan_option from './dropdown/manulife/7_manulife_medical_plan_option';
import DeductibleOptions from './dropdown/manulife/deductible_options';

const Input = ({ inputs, setInputs, appBarColor }) => {
  const { t } = useTranslation();

  // Set default value for numberOfYears to 15 if not already set
  useEffect(() => {
    if (!inputs.numberOfYears) {
      setInputs(prev => ({ ...prev, numberOfYears: 15 }));
    }
  }, [inputs, setInputs]);

  // Handle changes to input fields
  const handleChange = (field) => (event) => {
    setInputs(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Generate years from 2024 to 2034
  const years = Array.from({ length: 11 }, (_, i) => 2024 + i);

  // Specific options for "Number of Years"
  const numberOfYearsOptions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

  return (
    <Box display="grid" gap={1}>
      <Card elevation={1}>
        <CardContent>
          <Box display="grid" gap={1} sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' } }}>
  
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
                {manulife_medical_plan.map((plan) => (
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
                {Array.from({ length: 121 }, (_, i) => i).map((age) => (
                  <MenuItem key={age} value={age}>
                    {age}
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
                {numberOfYearsOptions.map((year) => (
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