import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select, MenuItem, TextField, FormControl, InputLabel, Box } from '@mui/material';
import ComparisonPopup from './ComparisonPopup';

const OutputForm_3 = ({ processedData, numberOfYears, numberOfYearAccMP, finalNotionalAmount, age, currencyRate, setFinalNotionalAmount, numOfRowInOutputForm_1 }) => {
  const { t } = useTranslation();
  const [age1, setAge1] = useState(65);
  const [age2, setAge2] = useState(85);
  const [currency1, setCurrency1] = useState('');
  const [currency2, setCurrency2] = useState('');
  const [openPopup, setOpenPopup] = useState(false);

  const handleOpenPopup = () => setOpenPopup(true);
  const handleClosePopup = () => setOpenPopup(false);
  const reset = () => {
    if (window.confirm(t('outputForm3.resetConfirmation'))) {
      setFinalNotionalAmount(null);
      setAge1(65);
      setAge2(85);
      setCurrency1('');
      setCurrency2('');
    }
  };

  const ageOptions = Array.from({ length: 100 - 18 + 1 }, (_, i) => 18 + i);

  return (
    <Box>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel>{t('outputForm3.ageLabel')}</InputLabel>
        <Select value={age1} onChange={(e) => setAge1(e.target.value)}>
          {ageOptions.map((age) => (
            <MenuItem key={age} value={age}>
              {age}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label={t('outputForm3.accountValueLabel')}
        type="number"
        value={currency1}
        onChange={(e) => setCurrency1(e.target.value)}
        sx={{ m: 1, width: 180 }}
      />

      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel>{t('outputForm3.ageLabel')}</InputLabel>
        <Select value={age2} onChange={(e) => setAge2(e.target.value)}>
          {ageOptions.map((age) => (
            <MenuItem key={age} value={age}>
              {age}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label={t('outputForm3.accountValueLabel')}
        type="number"
        value={currency2}
        onChange={(e) => setCurrency2(e.target.value)}
        sx={{ m: 1, width: 180 }}
      />

      <Button variant="contained" onClick={handleOpenPopup} sx={{ m: 1 }}>
        {t('outputForm3.compareButton')}
      </Button>
      
      <Button 
        variant="contained" 
        onClick={reset} 
        sx={{ 
          m: 1, 
          backgroundColor: 'error.main',
          '&:hover': {
            backgroundColor: 'error.dark',
          }
        }}
      >
        {t('outputForm3.resetButton')}
      </Button>
      
      <ComparisonPopup
        open={openPopup}
        onClose={handleClosePopup}
        age1={age1}
        age2={age2}
        currency1={currency1}
        currency2={currency2}
        processedData={processedData}
        numberOfYears={numberOfYears}
        numberOfYearAccMP={numberOfYearAccMP}
        finalNotionalAmount={finalNotionalAmount}
        age={age}
        currencyRate={currencyRate}
        numOfRowInOutputForm_1={numOfRowInOutputForm_1}
      />
    </Box>
  );
};

export default OutputForm_3;