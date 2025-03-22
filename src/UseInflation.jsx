import React from 'react';
import { 
  Box,
  Collapse,
  FormControlLabel,
  Switch,
  TextField,
  Typography
} from '@mui/material';

const UseInflation = ({ 
  inflationRate,
  currencyRate,
  useInflation,
  setUseInflation,
  onInflationRateChange,
  onCurrencyRateChange
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Financial Adjustments
      </Typography>
      
     
      
      {/* Inflation Adjustment Section */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useInflation}
              onChange={(e) => setUseInflation(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Use Inflation Adjustment
            </Typography>
          }
          sx={{ mb: 1 }}
        />
        
        <Collapse in={useInflation}>
          <TextField
            fullWidth
            label="Inflation Rate (%)"
            type="number"
            value={inflationRate}
            onChange={(e) => onInflationRateChange(Number(e.target.value))}
            inputProps={{ min: 0, step: 0.1 }}
            variant="outlined"
            margin="normal"
          />
        </Collapse>

         {/* Currency Rate Field */}
      <TextField
        fullWidth
        label="Currency Rate"
        type="number"
        value={currencyRate}
        onChange={(e) => onCurrencyRateChange(Number(e.target.value))}
        inputProps={{ min: 0, step: 0.01 }}
        variant="outlined"
        margin="normal"
        sx={{ mb: 2 }}
      />
      </Box>
    </Box>
  );
};

export default UseInflation;