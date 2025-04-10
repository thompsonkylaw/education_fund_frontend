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

const Input = ({ inputs, setInputs, appBarColor }) => {
  const { t } = useTranslation();

  // Options for NumberOfYear
  const numberOfYearsOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  // Handle input changes
  const handleChange = (field) => (event) => {
    setInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  // Update dependent fields when Plan changes
  useEffect(() => {
    if (inputs.plan) {
      const categories = manulife_medical_plan_catagoary[inputs.plan] || [];
      const currencies = manulife_medical_plan_currency[inputs.plan] || [];
      const sexualities = manulife_medical_plan_sexuality[inputs.plan] || [];
      const wards = manulife_medical_plan_ward[inputs.plan] || [];
      const effectiveDates = manulife_medical_plan_effective_date[inputs.plan] || [];

      setInputs(prev => ({
        ...prev,
        planCategory: categories[0] || '',
        effectiveDate: effectiveDates[0] || '',
        currency: currencies[0] || '',
        sexuality: sexualities[0] || '',
        ward: wards[0] || '',
      }));
    }
  }, [inputs.plan, setInputs]);

  // Update Plan_Option when Plan, Plan_Category, or Currency changes
  useEffect(() => {
    if (inputs.plan && inputs.planCategory && inputs.currency) {
      const optionData = manulife_medical_plan_option[inputs.plan];
      let options = [];
      if (Array.isArray(optionData)) {
        options = optionData;
      } else if (optionData && optionData[inputs.planCategory] && optionData[inputs.planCategory][inputs.currency]) {
        options = optionData[inputs.planCategory][inputs.currency];
      }
      setInputs(prev => ({ ...prev, planOption: options[0] || '' }));
    }
  }, [inputs.plan, inputs.planCategory, inputs.currency, setInputs]);

  // Update planFileName in state when relevant fields change
  useEffect(() => {
    const { plan, planCategory, effectiveDate, currency, sexuality, ward } = inputs;
    if (plan && planCategory && effectiveDate && currency && sexuality && ward) {
      let planFileName = `${plan}_${planCategory}_${effectiveDate}_${currency}_${sexuality}_${ward}`;
      planFileName = planFileName.replace(/\//g, ''); // Remove slashes if needed
      setInputs(prev => ({ ...prev, planFileName }));
    }
  }, [inputs.plan, inputs.planCategory, inputs.effectiveDate, inputs.currency, inputs.sexuality, inputs.ward, setInputs]);

  // Compute options for Plan_Option
  const planOptionOptions = () => {
    const optionData = manulife_medical_plan_option[inputs.plan] || {};
    if (Array.isArray(optionData)) {
      return optionData;
    } else if (
      inputs.planCategory &&
      inputs.currency &&
      optionData[inputs.planCategory] &&
      optionData[inputs.planCategory][inputs.currency]
    ) {
      return optionData[inputs.planCategory][inputs.currency];
    }
    return [];
  };

  return (
    <Box display="grid" gap={1}>
      <Card elevation={1}>
        <CardContent>
          {/* First Row: Plan, Plan_Category, Effective_Date, Currency */}
          <Box display="grid" gap={1} sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' } }}>
            {/* Plan */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Plan')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.plan || ''}
                onChange={handleChange('plan')}
              >
                {manulife_medical_plan.map((plan, index) => (
                  <MenuItem key={plan} value={plan}>
                    {`${index + 1}. ${plan}`}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Plan_Category */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Plan Category')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.planCategory || ''}
                onChange={handleChange('planCategory')}
              >
                {(manulife_medical_plan_catagoary[inputs.plan] || []).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Effective_Date (Read-Only) */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Effective Date')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.effectiveDate || ''}
                disabled
              >
                <MenuItem value={inputs.effectiveDate || ''}>
                  {inputs.effectiveDate || ''}
                </MenuItem>
              </Select>
            </Box>

            {/* Currency */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Currency')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.currency || ''}
                onChange={handleChange('currency')}
              >
                {(manulife_medical_plan_currency[inputs.plan] || []).map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          {/* Second Row: Sexuality, Ward, Plan_Option, Age, NumberOfYear */}
          <Box display="grid" gap={1} sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' } }}>
            {/* Sexuality */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Sexuality')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.sexuality || ''}
                onChange={handleChange('sexuality')}
              >
                {(manulife_medical_plan_sexuality[inputs.plan] || []).map((sex) => (
                  <MenuItem key={sex} value={sex}>
                    {sex}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Ward */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Ward')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.ward || ''}
                onChange={handleChange('ward')}
              >
                {(manulife_medical_plan_ward[inputs.plan] || []).map((ward) => (
                  <MenuItem key={ward} value={ward}>
                    {ward}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Plan_Option */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Plan Option')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.planOption || ''}
                onChange={handleChange('planOption')}
              >
                {planOptionOptions().map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Age */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Age')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.age || 0}
                onChange={handleChange('age')}
              >
                {Array.from({ length: 121 }, (_, i) => i).map((age) => (
                  <MenuItem key={age} value={age}>
                    {age}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* NumberOfYear */}
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Number of Year')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.numberOfYears || 15}
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