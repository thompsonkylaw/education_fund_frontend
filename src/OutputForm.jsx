import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const OutputForm = ({ numberOfYears, numberOfYearAccMP }) => {
  const { t } = useTranslation();
  // console.log("numberOfYears",numberOfYears);
  // console.log("numberOfYearAccMP",numberOfYearAccMP);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body1" component="div" sx={{ fontWeight: 500 }}>
      {t('medicalTotal', {
            years: numberOfYears,
            total: numberOfYearAccMP.toFixed(0)
        })}
      </Typography>
    </Box>
  );
};

export default OutputForm;