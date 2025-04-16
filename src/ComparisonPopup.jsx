import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OutputForm_1 from './OutputForm_1';
import OutputForm_2 from './OutputForm_2';
import html2pdf from 'html2pdf.js';

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
  const formattedTotalCost = numberFormatter.format(Math.round(financingTotalCost));

  // Timestamp function for filename
  const getHongKongTimestamp = () => {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Hong_Kong',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const [
      { value: month },,
      { value: day },,
      { value: year },,
      { value: hour },,
      { value: minute },,
      { value: second },
    ] = formatter.formatToParts(now);
    return `${year}${month}${day}_${hour}${minute}${second}`;
  };

  // Generate PDF using html2pdf.js
  const generatePDF = () => {
    const originalElement = document.getElementById('pdf-content');
    if (originalElement) {
      // Clone the element
      const clonedElement = originalElement.cloneNode(true);

      // Create a wrapper div for the PDF content
      const wrapper = document.createElement('div');
      
      // Add the header "宏利保險" only for the PDF
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.fontSize = '24px'; // Adjust as needed
      header.style.marginBottom = '16px';
      header.textContent = '宏利保險';
      wrapper.appendChild(header);

      // Append the cloned content to the wrapper
      wrapper.appendChild(clonedElement);

      // Reduce font size for the entire PDF content
      wrapper.style.fontSize = '80%'; // Reduces font size to 80% of original

      const timestamp = getHongKongTimestamp();
      html2pdf().from(wrapper).set({
        filename: `比較報告_${timestamp}.pdf`,
        margin: [0.2, 0.2, 0.2, 0.2], // Reduced margins in inches
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 0.8 }, // Scale down the content
        jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' } // Use A3 format for larger page
      }).save();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">

      <DialogContent>
        <div id="pdf-content">

          <Grid container spacing={2}>
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

            {/* Right Box (Orange) */}
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
              <Box sx={{ backgroundColor: '#0F111CFF', color: 'white', p: 2, textAlign: 'center' }}>
                <Typography variant="h3">實際操作 How does it work?</Typography>
              </Box>
            </Grid>

            {/* Tables with Total Costs */}
            <Grid item xs={6}>
              <OutputForm_1 processedData={processedData} age={age} currencyRate={currencyRate} fontSizeMultiplier={1.5} />
              {/* <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                總成本: HKD $ {numberFormatter.format(Math.round(traditionalTotalCost))}
              </Typography> */}
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
              {/* <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                總成本: HKD $ {formattedTotalCost}
              </Typography> */}
              <Typography variant="h4">{age1} 歲戶口價值: HKD $ {formattedCurrency1}</Typography>
              <Typography variant="h4">{age2} 歲戶口價值: HKD $ {formattedCurrency2}</Typography>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <div className="pdf-button-container">
          <button
            className="pdf-button"
            onClick={generatePDF}
            title="導出為PDF"
          >
            📥 保存報告
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ComparisonPopup;