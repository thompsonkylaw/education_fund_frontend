import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Typography, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OutputForm_1 from './OutputForm_1';
import OutputForm_2 from './OutputForm_2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2pdf from 'html2pdf.js';
import { useTranslation } from 'react-i18next';

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
  numOfRowInOutputForm_1,
  plan1Inputs,
  plan2Inputs,
  clientInfo
}) => {
  const { t } = useTranslation();
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

  const finalNotionalAmountNum = finalNotionalAmount ? parseFloat(finalNotionalAmount.replace(/,/g, '')) : 0;
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
      alert(t('comparisonPopup.loadingFonts'));
      return;
    }

    const doc = new jsPDF({ unit: 'mm' });

    doc.addFileToVFS('NotoSansCJKtc-Regular.ttf', fontRegularData);
    doc.addFont('NotoSansCJKtc-Regular.ttf', 'NotoSansCJKtc', 'normal');
    doc.addFileToVFS('NotoSansCJKtc-Bold.ttf', fontBoldData);
    doc.addFont('NotoSansCJKtc-Bold.ttf', 'NotoSansCJKtc', 'bold');

    doc.setFont('NotoSansCJKtc', 'normal');

    // Define starting Y for plan details tables
    const startY = 15;

    // Determine margins based on whether Plan 2 exists
    const plan1Margin = plan2Inputs ? { left: 14, right: 110 } : { left: 14, right: 14 };
    const plan2Margin = { left: 110, right: 14 };

    // Add Plan 1 Details
    autoTable(doc, {
      startY: startY,
      head: [[t('comparisonPopup.plan1Details'), '']],
      body: [
        [t('common.company'), plan1Inputs.company],
        [t('common.plan'), plan1Inputs.plan],
        [t('common.planCategory'), plan1Inputs.planCategory],
        // [t('common.effectiveDate'), plan1Inputs.effectiveDate],
        // [t('common.currency'), plan1Inputs.currency],
        [t('common.sexuality'), plan1Inputs.sexuality],
        [t('common.ward'), plan1Inputs.ward],
        [t('common.planOption'), plan1Inputs.planOption],
        [t('common.age'), plan1Inputs.age.toString()],
        [t('common.numberOfYears'), plan1Inputs.numberOfYears.toString()],
        // [t('common.inflationRate'), `${plan1Inputs.inflationRate}%`],
        // [t('common.currencyRate'), plan1Inputs.currencyRate.toString()],
      ],
      theme: 'grid',
      styles: { font: 'NotoSansCJKtc', fontStyle: 'normal', fontSize: 10 },
      headStyles: { fontStyle: 'bold', fillColor: '#009739' },
      margin: plan1Margin,
    });

    let currentY = doc.lastAutoTable.finalY;

    // Add Plan 2 Details if available
    if (plan2Inputs) {
      autoTable(doc, {
        startY: startY,
        head: [[t('comparisonPopup.plan2Details'), '']],
        body: [
          [t('common.company'), plan2Inputs.company],
          [t('common.plan'), plan2Inputs.plan],
          [t('common.planCategory'), plan2Inputs.planCategory],
          // [t('common.effectiveDate'), plan2Inputs.effectiveDate],
          // [t('common.currency'), plan2Inputs.currency],
          [t('common.sexuality'), plan2Inputs.sexuality],
          [t('common.ward'), plan2Inputs.ward],
          [t('common.planOption'), plan2Inputs.planOption],
          [t('common.age'), plan2Inputs.age.toString()],
          [t('common.numberOfYears'), plan2Inputs.numberOfYears.toString()],
          // [t('common.inflationRate'), `${plan2Inputs.inflationRate}%`],
          // [t('common.currencyRate'), plan2Inputs.currencyRate.toString()],
        ],
        theme: 'grid',
        styles: { font: 'NotoSansCJKtc', fontStyle: 'normal', fontSize: 10 },
        headStyles: { fontStyle: 'bold', fillColor: '#009739' },
        margin: plan2Margin,
      });
      currentY = Math.max(currentY, doc.lastAutoTable.finalY);
    }

    // Add space after tables
    currentY += 5;

    // Proceed with the rest of the content
    const titleY = currentY + 10;
    const pointsY = titleY + 10;
    const cardY = titleY - 7;

    const leftX = 14;
    const rightX = 110;
    const textWidth = 80;

    // Traditional insurance section
    doc.setDrawColor(42, 157, 143);
    doc.setLineWidth(0.5);
    const cardPadding = 5;
    const cardWidth = 85;
    const cardHeight = 50;
    const cardX = leftX + 5 - cardPadding;
    doc.rect(cardX, cardY, cardWidth, cardHeight);

    doc.setFontSize(14);
    doc.setTextColor(42, 157, 143);
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text(t('comparisonPopup.traditionalMedicalPremium'), leftX + 2, titleY);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('NotoSansCJKtc', 'normal');
    const traditionalPoints = t('comparisonPopup.traditionalPoints', { returnObjects: true });
    traditionalPoints.forEach((point, index) => {
      doc.text(point, leftX + 2, pointsY + index * 10, { maxWidth: textWidth });
    });

    // Financing insurance section
    doc.setDrawColor(244, 162, 97);
    doc.rect(cardX + 96, cardY, cardWidth, cardHeight);

    doc.setFontSize(14);
    doc.setTextColor(244, 162, 97);
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text(t('comparisonPopup.financingMedicalPremium'), rightX + 3, titleY);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('NotoSansCJKtc', 'normal');
    const financingPoints = [
      t('comparisonPopup.financingPoints.0', { numberOfYears }),
      t('comparisonPopup.financingPoints.1', { savingsPercentage: formattedSavingsPercentage, savingsInMillions: formattedSavingsInMillions }),
      t('comparisonPopup.financingPoints.2'),
      t('comparisonPopup.financingPoints.3'),
    ];
    financingPoints.forEach((point, index) => {
      doc.text(point, rightX + 3, pointsY + index * 10, { maxWidth: textWidth });
    });

    // How it works section
    const howItWorksY = pointsY + 38;
    doc.setFillColor(15, 17, 28);
    doc.rect(14, howItWorksY, 182, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text(t('comparisonPopup.howItWorks'), 105, howItWorksY + 7, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    const tablesStartY = howItWorksY + 13;

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
      rows.push([`${startAge} - ${firstEndAge} ${t('common.yearsOld')}`, `HKD $ ${numberFormatter.format(Math.round(ageToAccMP[firstEndAge]))}`]);

      let lastAccMP = ageToAccMP[firstEndAge];
      let lastEndAge = firstEndAge;

      for (let i = 0; i < decadeEndAges.length; i++) {
        const endAge = decadeEndAges[i];
        if (endAge > lastEndAge) {
          const rangeStart = lastEndAge + 1;
          const rangeEnd = endAge;
          const value = ageToAccMP[endAge] - lastAccMP;
          rangeStart === 100
            ? rows.push([`${rangeStart}${t('common.yearsOld')}`, `HKD $ ${numberFormatter.format(Math.round(value))}`])
            : rows.push([`${rangeStart} - ${rangeEnd} ${t('common.yearsOld')}`, `HKD $ ${numberFormatter.format(Math.round(value))}`]);
          lastAccMP = ageToAccMP[endAge];
          lastEndAge = endAge;
        }
      }

      if (lastEndAge < 100 && 100 in ageToAccMP) {
        const rangeStart = lastEndAge + 1;
        const rangeEnd = 100;
        const value = ageToAccMP[100] - lastAccMP;
        rangeStart === 100
          ? rows.push([`${rangeStart}${t('common.yearsOld')}`, `HKD $ ${numberFormatter.format(Math.round(value))}`])
          : rows.push([`${rangeStart} - ${rangeEnd} ${t('common.yearsOld')}`, `HKD $ ${numberFormatter.format(Math.round(value))}`]);
      }
    }

    autoTable(doc, {
      startY: tablesStartY,
      head: [[t('comparisonPopup.ageRange'), t('comparisonPopup.traditionalMedicalPremiumTable')]],
      body: rows,
      theme: 'grid',
      styles: { font: 'NotoSansCJKtc', fontStyle: 'normal', fontSize: 10 },
      headStyles: { fontStyle: 'bold', fillColor: [42, 157, 143] },
      margin: { left: leftX, right: 110 },
    });

    const table1FinalY = doc.lastAutoTable.finalY;

    const outputForm2Rows = [];
    const firstRowEndAge = age + numberOfYears - 1;
    outputForm2Rows.push([`${age} - ${firstRowEndAge} ${t('common.yearsOld')}`, t('outputForm2.firstRowValue', { numberOfYears, averageMonthly: numberFormatter.format(Math.round(financingTotalCost / numberOfYears / 12)) })]);

    let lastRowLastAge = firstRowEndAge;
    while (lastRowLastAge < 100) {
      if (lastRowLastAge + 1 < 90) {
        const startAge = lastRowLastAge + 1;
        const endAge = lastRowLastAge + 10;
        outputForm2Rows.push([`${startAge} - ${endAge} ${t('common.yearsOld')}`, t('common.hkdZero')]);
        lastRowLastAge = endAge;
      } else {
        const startAge = lastRowLastAge + 1;
        outputForm2Rows.push([`${startAge} - 100 ${t('common.yearsOld')}`, t('common.hkdZero')]);
        lastRowLastAge = 100;
      }
    }

    if (outputForm2Rows.length < numOfRowInOutputForm_1) {
      outputForm2Rows.push(['-', '-']);
    }

    autoTable(doc, {
      startY: tablesStartY,
      head: [[t('comparisonPopup.ageRange'), t('comparisonPopup.financingMedicalPremiumTable')]],
      body: outputForm2Rows,
      theme: 'grid',
      styles: { font: 'NotoSansCJKtc', fontStyle: 'normal', fontSize: 10 },
      headStyles: { fontStyle: 'bold', fillColor: [244, 162, 97] },
      margin: { left: rightX, right: 14 },
    });

    const table2FinalY = doc.lastAutoTable.finalY;

    const yPosition = Math.max(table1FinalY + 10, table2FinalY + 10);

    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text(t('comparisonPopup.totalCost', { total: numberFormatter.format(Math.round(traditionalTotalCost)) }), leftX + 2, yPosition + 3);
    doc.text(t('comparisonPopup.totalCost', { total: formattedTotalCost }), rightX + 2, yPosition + 3);

    doc.setFont('NotoSansCJKtc', 'normal');
    doc.text(t('comparisonPopup.accountValueAtAge', { age: age1, value: '沒有價值' }), leftX + 2, yPosition + 13);
    doc.text(t('comparisonPopup.accountValueAtAge', { age: age2, value: '沒有價值' }), leftX + 2, yPosition + 20);
    doc.text(t('comparisonPopup.accountValueAtAge', { age: age1, value: formattedCurrency1 }), rightX + 2, yPosition + 13);
    doc.text(t('comparisonPopup.accountValueAtAge', { age: age2, value: formattedCurrency2 }), rightX + 2, yPosition + 20);

    // const totalPages = doc.getNumberOfPages();
    // for (let i = 1; i <= totalPages; i++) {
    //   doc.setPage(i);
    //   doc.setFontSize(10);
    //   doc.setFont('NotoSansCJKtc', 'normal');
    //   doc.text(t('comparisonPopup.page', { current: i, total: totalPages }), 190, 287, { align: 'right' });
    // }

    const timestamp = getHongKongTimestamp();
    doc.save(`${t('comparisonPopup.downloadReport')}_${timestamp}.pdf`);
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
      header.textContent = t('comparisonPopup.title');

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
        filename: `${t('comparisonPopup.downloadReport')}_${timestamp}.pdf`,
        margin: [0.1, 0.2, 0.2, 0.2],
        image: { type: 'jpeg', quality: 2 },
        html2canvas: { scale: 0.8, y: 0 },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' },
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
                <Typography variant="h3">{t('comparisonPopup.traditionalMedicalPremium')}</Typography>
                {t('comparisonPopup.traditionalPoints', { returnObjects: true }).map((point, index) => (
                  <Typography variant="h5" key={index}>{point}</Typography>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ backgroundColor: 'rgb(244, 162, 97)', p: 2, position: 'relative' }}>
                <img src="/tick.png" alt="Tick" style={{ position: 'absolute', top: 20, right: 8, width: 50, height: 50 }} />
                <Typography variant="h3">{t('comparisonPopup.financingMedicalPremium')}</Typography>
                <Typography variant="h5">{t('comparisonPopup.financingPoints.0', { numberOfYears })}</Typography>
                <Typography variant="h5">
                  {t('comparisonPopup.financingPoints.1', { savingsPercentage: formattedSavingsPercentage, savingsInMillions: formattedSavingsInMillions })}
                </Typography>
                <Typography variant="h5">{t('comparisonPopup.financingPoints.2')}</Typography>
                <Typography variant="h5">{t('comparisonPopup.financingPoints.3')}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'rgb(38, 70, 83)', color: 'white', p: 2, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: 'white !important' }}>{t('comparisonPopup.howItWorks')}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <OutputForm_1 processedData={processedData} age={age} currencyRate={currencyRate} fontSizeMultiplier={1.5} />
              <Typography variant="h4">{t('comparisonPopup.accountValueAtAge', { age: age1, value: '-' })}</Typography>
              <Typography variant="h4">{t('comparisonPopup.accountValueAtAge', { age: age2, value: '-' })}</Typography>
            </Grid>
            <Grid item xs={6}>
              <OutputForm_2
                age={age}
                numberOfYears={numberOfYears}
                numberOfYearAccMP={numberOfYearAccMP}
                finalNotionalAmount={finalNotionalAmount}
                currencyRate={currencyRate}
                fontSizeMultiplier={1.5}
                numOfRowInOutputForm_1={numOfRowInOutputForm_1}
              />
              <Typography variant="h4">{t('comparisonPopup.accountValueAtAge', { age: age1, value: formattedCurrency1 })}</Typography>
              <Typography variant="h4">{t('comparisonPopup.accountValueAtAge', { age: age2, value: formattedCurrency2 })}</Typography>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          control={<Switch checked={isJsPDFEnabled} onChange={(e) => setIsJsPDFEnabled(e.target.checked)} />}
          label={t('comparisonPopup.useHtml')}
        />
        <div className="pdf-button-container">
          <button
            className="pdf-button"
            onClick={handleGeneratePDF}
            title={t('comparisonPopup.downloadReport')}
            disabled={isJsPDFEnabled && !fontsLoaded}
          >
            📥 {t('comparisonPopup.downloadReport')}
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ComparisonPopup;