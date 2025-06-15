import React from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Setting = ({ setAppBarColor, onClose, setCompany, selectedCurrency, setSelectedCurrency }) => {
  const { t } = useTranslation();

  const colorCompanyMap = [
    { color: '#009739', company: 'Manulife' },
    { color: '#E4002B', company: 'AIA' },
    { color: '#FFCD00', company: 'Sunlife' },
    { color: '#00008F', company: 'AXA' },
    { color: '#004A9F', company: 'Chubb' },
    { color: '#ed1b2e', company: 'Prudential' },
    { color: '#e67e22', company: 'FWD' },
  ];
  //for proposal
  //add IsCFP
  //fix appbar
  //setusername delay
  return (
    <>
      <DialogTitle>Settings v3.2.0</DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {colorCompanyMap.map(({ color, company }) => (
            <Button
              key={color}
              onClick={() => {
                setAppBarColor(color);
                setCompany(company);
                onClose();
              }}
              sx={{
                backgroundColor: color,
                color: color === '#FFCD00' ? 'black' : 'white', // Black text for yellow, white for others
                width: '120px', // Fixed width for uniformity
                margin: '5px', // Maintain original spacing
              }}
            >
              {company}
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