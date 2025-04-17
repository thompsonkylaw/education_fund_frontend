import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Typography, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OutputForm_1 from './OutputForm_1';
import OutputForm_2 from './OutputForm_2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  numOfRowInOutputForm_1, // Added prop
}) => {
  const [fontRegularData, setFontRegularData] = useState(null);
  const [fontBoldData, setFontBoldData] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isJsPDFEnabled, setIsJsPDFEnabled] = useState(false);

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

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const ageToAccMP = {};
  processedData.forEach((row) => {
    ageToAccMP[row.age] = row.accumulatedMP;
  });
  const traditionalTotalCost = ageToAccMP[100] || 0;

  const finalNotionalAmountNum = finalNotionalAmount ? parseFloat(finalNotionalAmount) : 0;
  const financingTotalCost = numberOfYearAccMP + finalNotionalAmountNum * currencyRate;

  const savingsAmount = traditionalTotalCost - financingTotalCost;
  const savingsPercentage = traditionalTotalCost > 0 ? (savingsAmount / traditionalTotalCost) * 100 : 0;
  const savingsInMillions = savingsAmount / 10000;

  const formattedSavingsPercentage = numberFormatter.format(Math.round(savingsPercentage));
  const formattedSavingsInMillions = numberFormatter.format(Math.round(savingsInMillions));
  const formattedCurrency1 = numberFormatter.format(Math.round(currency1 || 0));
  const formattedCurrency2 = numberFormatter.format(Math.round(currency2 || 0));
  const formattedTotalCost = numberFormatter.format(Math.round(financingTotalCost));

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

  const generatePDFWithJsPDF = () => {
    if (!fontsLoaded) {
      alert('字體正在加載中，請稍後再試');
      return;
    }

    const doc = new jsPDF({ unit: 'mm' });

    doc.addFileToVFS('NotoSansCJKtc-Regular.ttf', fontRegularData);
    doc.addFont('NotoSansCJKtc-Regular.ttf', 'NotoSansCJKtc', 'normal');
    doc.addFileToVFS('NotoSansCJKtc-Bold.ttf', fontBoldData);
    doc.addFont('NotoSansCJKtc-Bold.ttf', 'NotoSansCJKtc', 'bold');

    doc.setFont('NotoSansCJKtc', 'normal');

    doc.setFontSize(18);
    doc.text('Manulife 宏利', 14, 22);

    const leftX = 14;
    const rightX = 110;

    // Set card styling for traditional insurance
    doc.setDrawColor(42, 157, 143);
    doc.setLineWidth(0.5);
    const cardPadding = 5;
    const cardWidth = 85;
    const cardHeight = 50;
    const cardX = leftX + 5 - cardPadding;
    const cardY = 40 - cardPadding - 10;
    doc.rect(cardX, cardY, cardWidth, cardHeight);

    doc.setFontSize(14);
    doc.setTextColor(42, 157, 143);
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text('傳統醫療保費', leftX + 2, 32);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('NotoSansCJKtc', 'normal');
    doc.text('1. 逐年購買，住院賠錢，無事洗錢', leftX + 2, 42);
    doc.text('2. 年年加價，年輕時保費便宜', leftX + 2, 52);
    doc.text('3. 年長時保費遞增，退休後保費高昂', leftX + 2, 62);
    doc.text('4. 消費性產品', leftX + 2, 72);

    // Set card styling for financing insurance
    doc.setDrawColor(244, 162, 97);
    doc.setLineWidth(0.5);
    doc.rect(cardX + 96, cardY, cardWidth, cardHeight);

    doc.setFontSize(14);
    doc.setTextColor(244, 162, 97);
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text('醫療融資保費', rightX + 3, 32);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('NotoSansCJKtc', 'normal');
    doc.text(`1. 只需${numberOfYears}年完成終生醫療保衛`, rightX + 3, 42);
    doc.text(`2. 節省${formattedSavingsPercentage}%終身醫療保費$${formattedSavingsInMillions}萬`, rightX + 3, 52);
    doc.text('3. 全面終身醫療保障至100歲', rightX + 3, 62);
    doc.text('4. 有事賠錢，無事儲錢，戶口長期增值', rightX + 3, 72);

    doc.setFillColor(15, 17, 28);
    doc.rect(14, 80, 182, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text('實際操作 How does it work?', 105, 87, { align: 'center' });

    doc.setTextColor(0, 0, 0);

    const tablesStartY = 93;

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
          rangeStart === 100
            ? rows.push([`${rangeStart}歲`, `HKD $ ${numberFormatter.format(Math.round(value))}`])
            : rows.push([`${rangeStart} - ${rangeEnd} 歲`, `HKD $ ${numberFormatter.format(Math.round(value))}`]);
          lastAccMP = ageToAccMP[endAge];
          lastEndAge = endAge;
        }
      }

      if (lastEndAge < 100 && 100 in ageToAccMP) {
        const rangeStart = lastEndAge + 1;
        const rangeEnd = 100;
        const value = ageToAccMP[100] - lastAccMP;
        rangeStart === 100
          ? rows.push([`${rangeStart}歲`, `HKD $ ${numberFormatter.format(Math.round(value))}`])
          : rows.push([`${rangeStart} - ${rangeEnd} 歲`, `HKD $ ${numberFormatter.format(Math.round(value))}`]);
      }
    }

    autoTable(doc, {
      startY: tablesStartY,
      head: [['年齡範圍', '傳統醫療保費']],
      body: rows,
      theme: 'grid',
      styles: { font: 'NotoSansCJKtc', fontStyle: 'normal', fontSize: 10 },
      headStyles: { fontStyle: 'bold', fillColor: [42, 157, 143] },
      margin: { left: leftX, right: 110 },
    });

    const table1FinalY = doc.lastAutoTable.finalY;

    const outputForm2Rows = [];
    const firstRowEndAge = age + numberOfYears - 1;
    outputForm2Rows.push([`${age} - ${firstRowEndAge} 歲`, `首${numberOfYears}年平均每月 HKD $ ${numberFormatter.format(Math.round(financingTotalCost / numberOfYears / 12))}`]);

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

    // New row-adding logic: Add an extra row if less than numOfRowInOutputForm_1
    if (outputForm2Rows.length < numOfRowInOutputForm_1) {
      outputForm2Rows.push(["-", "-"]);
    }

    autoTable(doc, {
      startY: tablesStartY,
      head: [['年齡範圍', '醫療融資保費']],
      body: outputForm2Rows,
      theme: 'grid',
      styles: { font: 'NotoSansCJKtc', fontStyle: 'normal', fontSize: 10 },
      headStyles: { fontStyle: 'bold', fillColor: [244, 162, 97] },
      margin: { left: rightX, right: 14 },
    });

    const table2FinalY = doc.lastAutoTable.finalY;

    const yPosition = Math.max(table1FinalY + 10, table2FinalY + 10);

    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text(`總成本: HKD $ ${numberFormatter.format(Math.round(traditionalTotalCost))}`, leftX + 2, yPosition + 3);
    doc.text(`總成本: HKD $ ${formattedTotalCost}`, rightX + 2, yPosition + 3);

    doc.setFont('NotoSansCJKtc', 'normal');
    doc.text(`${age1} 歲戶口價值: HKD $ -`, leftX + 2, yPosition + 13);
    doc.text(`${age2} 歲戶口價值: HKD $ -`, leftX + 2, yPosition + 20);
    doc.text(`${age1} 歲戶口價值: HKD $ ${formattedCurrency1}`, rightX + 2, yPosition + 13);
    doc.text(`${age2} 歲戶口價值: HKD $ ${formattedCurrency2}`, rightX + 2, yPosition + 20);

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('NotoSansCJKtc', 'normal');
      doc.text(`頁面 ${i}/${totalPages}`, 190, 287, { align: 'right' });
    }

    const timestamp = getHongKongTimestamp();
    doc.save(`比較報告_${timestamp}.pdf`);
  };

  const generatePDFWithHtml2pdf = () => {
    const originalElement = document.getElementById('pdf-content');
    if (originalElement) {
      const clonedElement = originalElement.cloneNode(true);
      const wrapper = document.createElement('div');
      const header = document.createElement('div');

      header.style.textAlign = 'center';
      header.style.fontSize = '24px';
      header.style.marginBottom = '16px';
      header.style.marginTop = '0';
      header.textContent = 'Manulife 宏利';

      wrapper.style.fontSize = '80%';
      wrapper.style.marginTop = '-20px';
      wrapper.style.padding = '0';
      wrapper.style.position = 'relative';
      wrapper.style.top = '-10px';

      wrapper.appendChild(header);
      wrapper.appendChild(clonedElement);

      clonedElement.style.margin = '0';
      clonedElement.style.padding = '0';
      clonedElement.style.boxSizing = 'border-box';

      const timestamp = getHongKongTimestamp();
      html2pdf().from(wrapper).set({
        filename: `比較報告_${timestamp}.pdf`,
        margin: [0.1, 0.2, 0.2, 0.2],
        image: { type: 'jpeg', quality: 2 },
        html2canvas: { scale: 0.8, y: 0 },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' }
      }).save();
    }
  };

  const handleGeneratePDF = () => {
    if (!isJsPDFEnabled) {
      generatePDFWithJsPDF();
    } else {
      generatePDFWithHtml2pdf();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {/* <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton> */}
      </DialogTitle>
      <DialogContent>
        <div id="pdf-content">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ backgroundColor: 'rgb(42, 157, 143)', color: 'white', '& h3, & h5': { color: 'white' }, p: 2, position: 'relative' }}>
                <img src="/cross.png" alt="Cross" style={{ position: 'absolute', top: 20, right: 8, width: 50, height: 50 }} />
                <Typography variant="h3">傳統醫療保費</Typography>
                <Typography variant="h5">1. 逐年購買，住院賠錢，無事洗錢</Typography>
                <Typography variant="h5">2. 年年加價，年輕時保費便宜</Typography>
                <Typography variant="h5">3. 年長時保費遞增，退休後保費高昂</Typography>
                <Typography variant="h5">4. 消費性產品</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ backgroundColor: 'rgb(244, 162, 97)', p: 2, position: 'relative' }}>
                <img src="/tick.png" alt="Tick" style={{ position: 'absolute', top: 20, right: 8, width: 50, height: 50 }} />
                <Typography variant="h3">醫療融資保費</Typography>
                <Typography variant="h5">1. 只需{numberOfYears}年完成終生醫療保衛</Typography>
                <Typography variant="h5">2. 節省<span style={{ color: 'white' }}>{formattedSavingsPercentage}%</span>終身醫療保費<span style={{ color: 'white' }}>${formattedSavingsInMillions}萬</span></Typography>
                <Typography variant="h5">3. 全面終身醫療保障至100歲</Typography>
                <Typography variant="h5">4. 有事賠錢，無事儲錢，戶口長期增值</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'rgb(38, 70, 83)', color: 'white', p: 2, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: 'white !important' }}>實際操作 How does it work?</Typography>
              </Box>
            </Grid>
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
                numOfRowInOutputForm_1={numOfRowInOutputForm_1} // Pass the prop to OutputForm_2
              />
              <Typography variant="h4">{age1} 歲戶口價值: HKD $ {formattedCurrency1}</Typography>
              <Typography variant="h4">{age2} 歲戶口價值: HKD $ {formattedCurrency2}</Typography>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <FormControlLabel control={<Switch checked={isJsPDFEnabled} onChange={(e) => setIsJsPDFEnabled(e.target.checked)} />} label="使用 HTML" />
        <div className="pdf-button-container">
          <button className="pdf-button" onClick={handleGeneratePDF} title="導出為PDF" disabled={isJsPDFEnabled && !fontsLoaded}>📥 下載報告</button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ComparisonPopup;