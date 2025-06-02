import React from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Setting = ({ setAppBarColor, onClose, setCompany, selectedCurrency, setSelectedCurrency }) => {
  const { t } = useTranslation();
  const colors = ['#009739', '#E4002B', '#FFCD00', '#00008F', '#004A9F', '#ed1b2e', '#e67e22'];
  let companyName;

  const handleColorSelect = (color) => {
    setAppBarColor(color);
    if (color === '#009739') {
      setCompany('Manulife');
      companyName = 'Manulife';
    } else if (color === '#E4002B') {
      setCompany('AIA');
    } else if (color === '#FFCD00') {
      setCompany('Sunlife');
    } else if (color === '#00008F') {
      setCompany('AXA');
    } else if (color === '#004A9F') {
      setCompany('Chubb');
    } else if (color === '#ed1b2e') {
      setCompany('Prudential');
    } else if (color === '#e67e22') {
      setCompany('FWD');
    }
    onClose();
  };

  return (
    <>
      <DialogTitle>Settings v1.0.8</DialogTitle>
      <DialogContent>
        <Box>
          {colors.map((color) => (
            <Button
              key={color}
              onClick={() => handleColorSelect(color)}
              style={{
                backgroundColor: color,
                color: color === '#FFCD00' ? 'black' : 'white',
                margin: '5px',
                minWidth: '80px',
              }}
            >
              {color}
            </Button>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">{t('currencySelection')}</Typography>
          <RadioGroup
            row
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            <FormControlLabel value="HKD" control={<Radio />} label={t('currency.HKD')} />
            <FormControlLabel value="RMB" control={<Radio />} label={t('currency.RMB')} />
          </RadioGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </>
  );
};

export default Setting;