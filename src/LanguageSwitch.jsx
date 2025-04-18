import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Radio, RadioGroup, FormControlLabel, Button, Card, Box, Dialog } from '@mui/material';
import Setting from './Setting';

function LanguageSwitch({ setAppBarColor, appBarColor }) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
            <RadioGroup
              row
              aria-label="language"
              name="language"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              sx={{ flex: 1, display: 'flex', justifyContent: 'space-evenly' }}
            >
              <FormControlLabel
                value="en"
                control={<Radio sx={{ color: appBarColor, '&.Mui-checked': { color: appBarColor } }} />}
                label="English"
              />
              <FormControlLabel
                value="zh-HK"
                control={<Radio sx={{ color: appBarColor, '&.Mui-checked': { color: appBarColor } }} />}
                label="繁體中文"
              />
              <FormControlLabel
                value="zh-CN"
                control={<Radio sx={{ color: appBarColor, '&.Mui-checked': { color: appBarColor } }} />}
                label="简體中文"
              />
            </RadioGroup>
          </Box>
        </Grid>
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleOpenSettings}>{t('Settings')}</Button>
          </Box>
        </Grid>
      </Grid>
      <Dialog open={settingsOpen} onClose={handleCloseSettings}>
        <Setting setAppBarColor={setAppBarColor} onClose={handleCloseSettings} />
      </Dialog>
    </Card>
  );
}

export default LanguageSwitch;