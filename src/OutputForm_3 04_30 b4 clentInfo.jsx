import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextField, Box, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import ComparisonPopup from './ComparisonPopup';


// Custom currency input component
const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  const { t } = useTranslation();
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.floatValue,
          },
        });
      }}
      thousandSeparator
      prefix="$"
      decimalScale={0}
      fixedDecimalScale
      allowNegative={false}
    />
  );
});

const OutputForm_3 = ({ processedData, numberOfYears, numberOfYearAccMP, finalNotionalAmount, age, currencyRate, setFinalNotionalAmount, numOfRowInOutputForm_1, cashValueInfo,plan1Inputs,plan2Inputs }) => {
  const { t } = useTranslation();

  const [age1, setAge1] = useState(cashValueInfo.age_1);
  const [age2, setAge2] = useState(cashValueInfo.age_2);
  const [currency1, setCurrency1] = useState(cashValueInfo.age_1_cash_value);
  const [currency2, setCurrency2] = useState(cashValueInfo.age_2_cash_value);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    setAge1(cashValueInfo.age_1);
    setAge2(cashValueInfo.age_2);
    setCurrency1(cashValueInfo.age_1_cash_value);
    setCurrency2(cashValueInfo.age_2_cash_value);
  }, [cashValueInfo]);

  const handleOpenPopup = () => setOpenPopup(true);
  const handleClosePopup = () => setOpenPopup(false);

  const reset = () => {
    if (window.confirm(t('outputForm3.resetConfirmation'))) {
      setFinalNotionalAmount(null);
      setAge1(cashValueInfo.age_1);
      setAge2(cashValueInfo.age_2);
      setCurrency1(cashValueInfo.age_1_cash_value);
      setCurrency2(cashValueInfo.age_2_cash_value);
    }
  };

  return (
    <Box>
      <Typography
        sx={{
          backgroundColor: 'rgb(231, 111, 81)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          padding: '10px',
          textAlign: 'center',
        }}
      >
        {t('cash_value')}
      </Typography>
      <TextField
        id="input_text_field_17"      
        disabled={true}
        label={t('outputForm3.ageLabel')}
        type="number"
        value={age1}
        onChange={(e) => setAge1(e.target.value)}
        sx={{ m: 1, width: 80 }}
      />
      <TextField
        disabled={true}
        id="input_text_field_10"
        label={t('outputForm3.accountValueLabel')}
        value={currency1}
        onChange={(e) => setCurrency1(e.target.value)}
        InputProps={{
          inputComponent: NumberFormatCustom,
        }}
        sx={{ m: 1, width: 180 }}
      />
      <TextField
        id="input_text_field_18"      
        disabled={true}
        label={t('outputForm3.ageLabel')}
        type="number"
        value={age2}
        onChange={(e) => setAge2(e.target.value)}
        sx={{ m: 1, width: 80 }}
      />
      <TextField
        disabled={true}
        id="input_text_field_11"
        label={t('outputForm3.accountValueLabel')}
        value={currency2}
        onChange={(e) => setCurrency2(e.target.value)}
        InputProps={{
          inputComponent: NumberFormatCustom,
        }}
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
          },
        }}
      >
        {t('outputForm3.resetButton')}
      </Button>
      <ComparisonPopup
        open={openPopup}
        onClose={handleClosePopup}
        age1={Number(age1)}
        age2={Number(age2)}
        currency1={Number(currency1)}
        currency2={Number(currency2)}
        processedData={processedData}
        numberOfYears={numberOfYears}
        numberOfYearAccMP={numberOfYearAccMP}
        finalNotionalAmount={finalNotionalAmount}
        age={age}
        currencyRate={currencyRate}
        numOfRowInOutputForm_1={numOfRowInOutputForm_1}
        plan1Inputs = {plan1Inputs}
        plan2Inputs = {plan2Inputs}
      />
    </Box>
  );
};

export default OutputForm_3;