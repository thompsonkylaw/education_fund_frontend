import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Grid, Typography,IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OutputForm_1 from './OutputForm_1';
import OutputForm_2 from './OutputForm_2';

// Number formatter for HKD values without decimal places
const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ComparisonPopup = ({
  open,
  onClose,
  age1,
  age2,
  currency1,
  currency2,
  processedData,
  numberOfYears,
  numberOfYearAccMP,
  finalNotionalAmount,
  age,
  currencyRate,
}) => {
  // Calculate traditional total cost (ageToAccMP[100])
  const ageToAccMP = {};
  processedData.forEach((row) => {
    ageToAccMP[row.age] = row.accumulatedMP;
  });
  const traditionalTotalCost = ageToAccMP[100] || 0;

  // Calculate financing total cost
  const finalNotionalAmountNum = finalNotionalAmount ? parseFloat(finalNotionalAmount) : 0;
  const financingTotalCost = numberOfYearAccMP + finalNotionalAmountNum * currencyRate;

  // Calculate savings
  const savingsAmount = traditionalTotalCost - financingTotalCost;
  const savingsPercentage = traditionalTotalCost > 0 ? (savingsAmount / traditionalTotalCost) * 100 : 0;
  const savingsInMillions = savingsAmount / 10000; // Convert to millions

  // Format numbers
  const formattedSavingsPercentage = numberFormatter.format(Math.round(savingsPercentage));
  const formattedSavingsInMillions = numberFormatter.format(Math.round(savingsInMillions));
  const formattedCurrency1 = numberFormatter.format(Math.round(currency1 || 0));
  const formattedCurrency2 = numberFormatter.format(Math.round(currency2 || 0));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        Comparison
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* First Row: Two Boxes */}
          {/* Left Box (Teal) */}
          <Grid item xs={6}>
            <Box sx={{ backgroundColor: 'teal', color: 'white', p: 2, position: 'relative' }}>
              <img
                src="/cross.png"
                alt="Cross"
                style={{ position: 'absolute', top: 20, right: 8, width: 50, height: 50 }}
              />
              <Typography variant="h3">傳統醫療保費</Typography>
              <Typography variant="h5">1. 逐年購買，住院賠錢，無事洗錢</Typography>
              <Typography variant="h5">2. 年年加價，年輕時保費便宜</Typography>
              <Typography variant="h5">3. 年長時保費遞增，退休後保費高昂</Typography>
              <Typography variant="h5">4. 消費性產品</Typography>
            </Box>
          </Grid>

          {/* Right Box (Checklist) */}
          <Grid item xs={6}>
            <Box sx={{ backgroundColor: 'orange', p: 2, position: 'relative' }}>
              <img
                src="/tick.png"
                alt="Tick"
                style={{ position: 'absolute', top: 20, right: 8, width: 50, height: 50 }}
              />
              <Typography variant="h3">醫療融資保費</Typography>
              <Typography variant="h5">1. 只需{numberOfYears}年完成終生醫療保衛</Typography>
              <Typography variant="h5">
                2. 節省{formattedSavingsPercentage}%終身醫療保費${formattedSavingsInMillions}萬
              </Typography>
              <Typography variant="h5">3. 全面終身醫療保障至100歲</Typography>
              <Typography variant="h5">4. 有事賠錢，無事儲錢，戶口長期增值</Typography>
            </Box>
          </Grid>

          {/* Dark Blue Box */}
          <Grid item xs={12}>
            <Box sx={{ backgroundColor: "#0F111CFF", color: 'white', p: 2, textAlign: 'center' }}>
              <Typography variant="h3">實際操作 How does it work?</Typography>
            </Box>
          </Grid>

          {/* Tables */}
          <Grid item xs={6}>
            <OutputForm_1 processedData={processedData} age={age} currencyRate={currencyRate} fontSizeMultiplier={1.5} />
            <Typography variant="h4">{age1} 歲戶口價值: HKD $ -</Typography>
            <Typography variant="h4">{age2} 歲戶口價值: HKD $ -</Typography>
          </Grid>
          <Grid item xs={6}>
            <OutputForm_2
              age={age}
              numberOfYears={numberOfYears}
              numberOfYearAccMP={numberOfYearAccMP}
              finalNotionalAmount={finalNotionalAmount}
              currencyRate={currencyRate}
              fontSizeMultiplier={1.5}
            />
            <Typography variant="h4">{age1} 歲戶口價值: HKD $ {formattedCurrency1}</Typography>
            <Typography variant="h4">{age2} 歲戶口價值: HKD $ {formattedCurrency2}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComparisonPopup;