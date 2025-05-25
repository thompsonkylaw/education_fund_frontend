import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box,
  Collapse,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Login_Manulife from './Login_Manulife';
import Login_FWD from './Login_FWD';
import Login_AXA from './Login_AXA';
import Login_Prudential from './Login_Prudential';
import Login_Chubb from './Login_Chubb';
import Login_Sunlife from './Login_Sunlife';
import Login_AIA from './Login_AIA';

const UseInflation = ({ 
  inflationRate,
  currencyRate,
  useInflation,
  setUseInflation,
  onInflationRateChange,
  onCurrencyRateChange,
  processedData,
  inputs,
  numberOfYearAccMP,
  setFinalNotionalAmount,
  disabled,
  cashValueInfo,
  setCashValueInfo,
  clientInfo,
  setClientInfo,
  company
}) => {
  const { t } = useTranslation();
  const [openLoginModal, setOpenLoginModal] = useState(false);

  // Define a mapping of company names to their login components
  const loginComponents = {
    'Manulife': Login_Manulife,
    'FWD': Login_FWD,
    'AXA': Login_AXA,
    'Prudential': Login_Prudential,
    'Chubb': Login_Chubb,
    'Sunlife': Login_Sunlife,
    'AIA': Login_AIA
  };

  // Select the login component based on the company prop, defaulting to Login
  const SelectedLogin = loginComponents[company] || Login;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('useInflation.title')}
        </Typography>
        <IconButton 
          onClick={(e) => {
            setOpenLoginModal(true);
            e.currentTarget.blur(); // Remove focus to make the circle disappear
          }}
          sx={{ 
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Render the dynamically selected login component */}
      <SelectedLogin
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        processedData={processedData}
        inputs={inputs}
        numberOfYearAccMP={numberOfYearAccMP}
        useInflation={useInflation}
        setFinalNotionalAmount={setFinalNotionalAmount}
        disabled={disabled}
        cashValueInfo={cashValueInfo}
        setCashValueInfo={setCashValueInfo}
        clientInfo={clientInfo}
        setClientInfo={setClientInfo}
        company={company}
      />
      
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useInflation}
              onChange={(e) => setUseInflation(e.target.checked)}
              color="primary"
              disabled={disabled}
            />
          }
          label={
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {t('useInflation.useInflationAdjustment')}
            </Typography>
          }
          sx={{ mb: 1 }}
        />
        
        <Collapse in={useInflation}>
          <TextField
            id="input_text_field_8"
            fullWidth
            label={t('useInflation.inflationRate')}
            type="number"
            value={inflationRate}
            onChange={(e) => onInflationRateChange(Number(e.target.value))}
            inputProps={{ min: 0, step: 0.1 }}
            variant="outlined"
            margin="normal"
            disabled={disabled}
          />
        </Collapse>

        <TextField
          id="input_text_field_9"
          fullWidth
          label={t('useInflation.currencyRate')}
          type="number"
          value={currencyRate}
          onChange={(e) => onCurrencyRateChange(Number(e.target.value))}
          inputProps={{ min: 0, step: 0.01 }}
          variant="outlined"
          margin="normal"
          sx={{ mb: 2 }}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
};

export default UseInflation;