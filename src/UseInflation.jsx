import React, { useState } from 'react';
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
import LoginModal from './Login';

const UseInflation = ({ 
  inflationRate,
  currencyRate,
  useInflation,
  setUseInflation,
  onInflationRateChange,
  onCurrencyRateChange,
  processedData,
  inputs,
  numberOfYearAccMP
}) => {
  const [openLoginModal, setOpenLoginModal] = useState(false);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          計劃易
        </Typography>
        <IconButton 
          onClick={() => setOpenLoginModal(true)}
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

      <LoginModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        maxWidth="sm"
        processedData={processedData}
        inputs={inputs}
        numberOfYearAccMP={numberOfYearAccMP}
        useInflation = {useInflation}
      />
      
      {/* Rest of the component remains the same */}
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