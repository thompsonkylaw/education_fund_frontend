import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OutputForm_1 from './OutputForm_1';
import OutputForm_2 from './OutputForm_2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Number formatter for HKD values without decimal places
const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ComparisonPopup_PDF = ({
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
  // State for font data and loading status
  const [fontRegularData, setFontRegularData] = useState(null);
  const [fontBoldData, setFontBoldData] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts when component mounts
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const [regularResponse, boldResponse] = await Promise.all([
          fetch('/font/NotoSansCJKtc-Regular.ttf'),
          fetch('/font/NotoSansCJKtc-Bold.ttf'),
        ]);
        if (!regularResponse.ok || !boldResponse.ok) throw new Error('Failed to fetch fonts');
        const [regularBuffer, boldBuffer] = await Promise.all([
          regularResponse.arrayBuffer(),
          boldResponse.arrayBuffer(),
        ]);
        const regularBase64 = arrayBufferToBase64(regularBuffer);
        const boldBase64 = arrayBufferToBase64(boldBuffer);
        setFontRegularData(regularBase64);
        setFontBoldData(boldBase64);
        setFontsLoaded(true);
      } catch (error) {
        console.error('Failed to load fonts:', error);
      }
    };
    loadFonts();
  }, []);

  // Convert ArrayBuffer to base64 string
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

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

  // Calculate total cost and average monthly for OutputForm_2
  const totalCost = financingTotalCost;
  const averageMonthly = totalCost / numberOfYears / 12;
  const formattedTotalCost = numberFormatter.format(Math.round(totalCost));
  const formattedAverageMonthly = numberFormatter.format(Math.round(averageMonthly));

  const generatePDF = () => {
    // Check if fonts are loaded
    if (!fontsLoaded) {
      alert('字體正在加載中，請稍後再試');
      return;
    }
  
    const doc = new jsPDF();
  
    // Add fonts to VFS and register them
    doc.addFileToVFS('NotoSansCJKtc-Regular.ttf', fontRegularData);
    doc.addFont('NotoSansCJKtc-Regular.ttf', 'NotoSansCJKtc', 'normal');
    doc.addFileToVFS('NotoSansCJKtc-Bold.ttf', fontBoldData);
    doc.addFont('NotoSansCJKtc-Bold.ttf', 'NotoSansCJKtc', 'bold');
  
    // Set default font
    doc.setFont('NotoSansCJKtc', 'normal');
  
    // Add title
    doc.setFontSize(18);
    doc.text('Comparison', 14, 22);
  
    // Add teal box content (Traditional Medical Insurance)
    doc.setFontSize(14);
    doc.setTextColor(42, 157, 143); // Teal color
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text('傳統醫療保費', 14, 32);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.setFont('NotoSansCJKtc', 'normal');
    doc.text('1. 逐年購買，住院賠錢，無事洗錢', 14, 42);
    doc.text('2. 年年加價，年輕時保費便宜', 14, 52);
    doc.text('3. 年長時保費遞增，退休後保費高昂', 14, 62);
    doc.text('4. 消費性產品', 14, 72);
  
    // Add orange box content (Medical Financing Premium)
    doc.setFontSize(14);
    doc.setTextColor(244, 162, 97); // Orange color
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text('醫療融資保費', 100, 32);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.setFont('NotoSansCJKtc', 'normal');
    doc.text(`1. 只需${numberOfYears}年完成終生醫療保衛`, 100, 42);
    doc.text(`2. 節省${formattedSavingsPercentage}%終身醫療保費$${formattedSavingsInMillions}萬`, 100, 52);
    doc.text('3. 全面終身醫療保障至100歲', 100, 62);
    doc.text('4. 有事賠錢，無事儲錢，戶口長期增值', 100, 72);
  
    // Add dark blue box
    doc.setFillColor(38, 70, 83); // Dark blue
    doc.rect(14, 82, 182, 10, 'F');
    doc.setTextColor(255, 255, 255); // White color
    doc.setFontSize(14);
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text('實際操作 How does it work?', 14, 90);
  
    // Reset text color to black
    doc.setTextColor(0, 0, 0);
  
    // Define common startY for both tables
    const tablesStartY = 100;
  
    // Prepare rows for OutputForm_1 (Traditional Medical Insurance)
    const startAge = age;
    const decadeEndAges = [];
    let currentAge = startAge + 9;
    while (currentAge <= 100) {
      if (currentAge in ageToAccMP) {
        decadeEndAges.push(currentAge);
      }
      currentAge += 10;
    }
    if (decadeEndAges.length > 0 && decadeEndAges[decadeEndAges.length - 1] < 100 && 100 in ageToAccMP) {
      decadeEndAges.push(100);
    }
  
    const rows = [];
    if (startAge + 9 in ageToAccMP) {
      const firstEndAge = startAge + 9;
      rows.push([`${startAge} - ${firstEndAge} 歲`, `HKD $ ${numberFormatter.format(Math.round(ageToAccMP[firstEndAge]))}`]);
  
      let lastAccMP = ageToAccMP[firstEndAge];
      let lastEndAge = firstEndAge;
  
      for (let i = 0; i < decadeEndAges.length; i++) {
        const endAge = decadeEndAges[i];
        if (endAge > lastEndAge) {
          const rangeStart = lastEndAge + 1;
          const rangeEnd = endAge;
          const value = ageToAccMP[endAge] - lastAccMP;
          rows.push([`${rangeStart} - ${rangeEnd} 歲`, `HKD $ ${numberFormatter.format(Math.round(value))}`]);
          lastAccMP = ageToAccMP[endAge];
          lastEndAge = endAge;
        }
      }
  
      if (lastEndAge < 100 && 100 in ageToAccMP) {
        const rangeStart = lastEndAge + 1;
        const rangeEnd = 100;
        const value = ageToAccMP[100] - lastAccMP;
        rows.push([`${rangeStart} - ${rangeEnd} 歲`, `HKD $ ${numberFormatter.format(Math.round(value))}`]);
      }
    }
  
    // Draw first table (OutputForm_1)
    autoTable(doc, {
      startY: tablesStartY,
      head: [['年齡範圍', '累積醫療保費']], // Age Range, Accumulated Medical Premium
      body: rows,
      theme: 'grid',
      styles: { font: 'NotoSansCJKtc', fontStyle: 'normal', fontSize: 10 },
      headStyles: { fontStyle: 'bold' },
      margin: { left: 10, right: 110 }, // Width: 210 - 10 - 110 = 90mm
    });
  
    const table1FinalY = doc.lastAutoTable.finalY;
  
    // Add total cost below first table
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text(`總成本: HKD $ ${numberFormatter.format(Math.round(traditionalTotalCost))}`, 14, table1FinalY + 5);
  
    // Prepare rows for OutputForm_2 (Medical Financing Premium)
    const outputForm2Rows = [];
    const firstRowEndAge = age + numberOfYears - 1;
    outputForm2Rows.push([`${age} - ${firstRowEndAge} 歲`, `首${numberOfYears}年平均每月 HKD $ ${formattedAverageMonthly}`]);
  
    let lastRowLastAge = firstRowEndAge;
    while (lastRowLastAge < 100) {
      if (lastRowLastAge + 1 < 90) {
        const startAge = lastRowLastAge + 1;
        const endAge = lastRowLastAge + 10;
        outputForm2Rows.push([`${startAge} - ${endAge} 歲`, "HKD $ -"]);
        lastRowLastAge = endAge;
      } else {
        const startAge = lastRowLastAge + 1;
        outputForm2Rows.push([`${startAge} - 100 歲`, "HKD $ -"]);
        lastRowLastAge = 100;
      }
    }
  
    // Draw second table (OutputForm_2)
    autoTable(doc, {
      startY: tablesStartY,
      head: [['年齡範圍', '醫療融資保費']], // Age Range, Medical Financing Premium
      body: outputForm2Rows,
      theme: 'grid',
      styles: { font: 'NotoSansCJKtc', fontStyle: 'normal', fontSize: 10 },
      headStyles: { fontStyle: 'bold' },
      margin: { left: 110, right: 10 }, // Width: 210 - 110 - 10 = 90mm
      
    });
  
    const table2FinalY = doc.lastAutoTable.finalY;
  
    // Add total cost below second table
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text(`總成本: HKD $ ${formattedTotalCost}`, 114, table2FinalY + 5);
  
    // Set yPosition for account values below both tables
    const yPosition = Math.max(table1FinalY + 10, table2FinalY + 10);
  
    // Add account values
    doc.setFont('NotoSansCJKtc', 'normal');
    doc.text(`${age1} 歲戶口價值: HKD $ -`, 14, yPosition);
    doc.text(`${age2} 歲戶口價值: HKD $ -`, 14, yPosition + 10);
    doc.text(`${age1} 歲戶口價值: HKD $ ${formattedCurrency1}`, 100, yPosition);
    doc.text(`${age2} 歲戶口價值: HKD $ ${formattedCurrency2}`, 100, yPosition + 10);
  
    // Add page numbers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('NotoSansCJKtc', 'normal');
      doc.text(`頁面 ${i}/${totalPages}`, 190 - 10, 287, { align: 'right' });
    }
  
    // Generate timestamp for filename
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
  
    // Save the PDF with timestamped filename
    doc.save(`比較報告_${getHongKongTimestamp()}.pdf`);
  };

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
          {/* Left Box (Teal) */}
          <Grid item xs={6}>
            <Box sx={{ backgroundColor: 'rgb(42, 157, 143)', color: 'white', p: 2, position: 'relative' }}>
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
            <Box sx={{ backgroundColor: 'rgb(244, 162, 97)', p: 2, position: 'relative' }}>
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
            <Box sx={{ backgroundColor: 'rgb(38, 70, 83)', color: 'white', p: 2, textAlign: 'center' }}>
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
        <div className="pdf-button-container">
          <button
            className="pdf-button"
            onClick={generatePDF}
            title="導出為PDF"
            disabled={!fontsLoaded}
          >
            📥 保存報告
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ComparisonPopup_PDF;