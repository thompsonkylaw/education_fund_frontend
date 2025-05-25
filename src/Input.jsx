import React, { useEffect } from 'react';
import { Box, Card, CardContent, MenuItem, Typography, Select, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import manulife_medical_plan from './dropdown/manulife/1_manulife_medical_plan';
import manulife_medical_plan_catagoary from './dropdown/manulife/2_manulife_medical_plan_catagoary';
import manulife_medical_plan_effective_date from './dropdown/manulife/3_manulife_medical_plan_effective_date';
import manulife_medical_plan_currency from './dropdown/manulife/4_manulife_medical_plan_currency';
import manulife_medical_plan_sexuality from './dropdown/manulife/5_manulife_medical_plan_sexuality';
import manulife_medical_plan_ward from './dropdown/manulife/6_manulife_medical_plan_ward';
import manulife_medical_plan_option from './dropdown/manulife/7_manulife_medical_plan_option';

const Input = ({ inputs, setInputs, appBarColor, disabled, showSecondPlan, onToggleSecondPlan }) => {
  const { t } = useTranslation();

  const companies = ['Manulife'];

  const numberOfYearsOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  const handleChange = (field) => (event) => {
    setInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

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

  useEffect(() => {
    const { company, plan, planCategory, effectiveDate, currency, sexuality, ward } = inputs;
    if (company && plan && planCategory && effectiveDate && currency && sexuality && ward) {
      let planFileName = `${plan}_${planCategory}_${effectiveDate}_${currency}_${sexuality}_${ward}`;
      planFileName = planFileName.replace(/\//g, '');
      setInputs(prev => ({ ...prev, planFileName }));
    }
  }, [inputs.company, inputs.plan, inputs.planCategory, inputs.effectiveDate, inputs.currency, inputs.sexuality, inputs.ward, setInputs]);

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
      <Card elevation={1} sx={{ position: 'relative', minHeight: 180 }}>
        <CardContent>
          <Box display="grid" gap={1} sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' } }}>
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Company')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.company || ''}
                onChange={handleChange('company')}
                disabled={disabled}
              >
                {companies.map((company) => (
                  <MenuItem key={company} value={company}>
                    {company}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Plan')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.plan || ''}
                onChange={handleChange('plan')}
                disabled={disabled}
              >
                {manulife_medical_plan.map((plan, index) => (
                  <MenuItem key={plan} value={plan}>
                    {`${index + 1}. ${plan}`}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Plan Category')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.planCategory || ''}
                onChange={handleChange('planCategory')}
                disabled={disabled}
              >
                {(manulife_medical_plan_catagoary[inputs.plan] || []).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </Box>
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
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Currency')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.currency || ''}
                onChange={handleChange('currency')}
                disabled={disabled}
              >
                {(manulife_medical_plan_currency[inputs.plan] || []).map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          <Box display="grid" gap={1} sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' } }}>
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Sexuality')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.sexuality || ''}
                onChange={handleChange('sexuality')}
                disabled={disabled}
              >
                {(manulife_medical_plan_sexuality[inputs.plan] || []).map((sex) => (
                  <MenuItem key={sex} value={sex}>
                    {sex}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Ward')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.ward || ''}
                onChange={handleChange('ward')}
                disabled={disabled}
              >
                {(manulife_medical_plan_ward[inputs.plan] || []).map((ward) => (
                  <MenuItem key={ward} value={ward}>
                    {ward}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Plan Option')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.planOption || ''}
                onChange={handleChange('planOption')}
                disabled={disabled}
              >
                {planOptionOptions().map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Age')}
              </Typography>
              <Select
                fullWidth
                variant="standard"
                value={inputs.age || 0}
                onChange={handleChange('age')}
                disabled={disabled}
              >
                {Array.from({ length: 121 }, (_, i) => i).map((age) => (
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
                value={inputs.numberOfYears || 15}
                onChange={handleChange('numberOfYears')}
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
        </CardContent>
        <Tooltip title={showSecondPlan ? t('Remove Second Plan') : t('Add Second Plan')}>
          <IconButton
            onClick={(e) => {
              onToggleSecondPlan();
              e.currentTarget.blur();
            }}
            disabled={disabled}
            sx={{
              position: 'absolute',
              bottom: 5,
              right: 15,
              backgroundColor: showSecondPlan ? appBarColor : appBarColor,
              color: 'white',
              '&:hover': {
                backgroundColor: showSecondPlan ? appBarColor : appBarColor,
              },
              '&.Mui-disabled': {
                backgroundColor: 'grey.400',
                color: 'white',
              },
              width: 25,
              height: 25,
              borderRadius: '50%',
            }}
            aria-label={showSecondPlan ? t('Remove') : t('Add')}
          >
            {showSecondPlan ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        </Tooltip>
      </Card>
    </Box>
  );
};

export default Input;