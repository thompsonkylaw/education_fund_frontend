import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Typography, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OutputForm_1 from './OutputForm_1';
import OutputForm_2 from './OutputForm_2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2pdf from 'html2pdf.js';
import { useTranslation } from 'react-i18next';

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
  proposal,
  finalNotionalAmount,
  numOfRowInOutputForm_1,
  clientInfo,
  cashValueInfo,
  appBarColor
}) => {
  const { t, i18n } = useTranslation();
  const [fontRegularData, setFontRegularData] = useState(null);
  const [fontBoldData, setFontBoldData] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isJsPDFEnabled, setIsJsPDFEnabled] = useState(false);

  const currencyRate = proposal.target.currencyRate;

  const inputs = proposal.inputs.map(item => ({
    expenseType: item.expenseType,
    fromAge: item.fromAge,
    toAge: item.toAge,
    yearlyWithdrawalAmount: item.yearlyWithdrawalAmount,
  }));

  const age = proposal.target.age;
  const numberOfYears = proposal.target.numberOfYears;
  const processData = proposal.processData;
  let numberOfYearAccMP;
  if (processData.length > 0) {
    numberOfYearAccMP = processData[numberOfYears - 1].accExpenseInUSD;
  }

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
  processData.forEach((row) => {
    ageToAccMP[row.age] = row.accExpenseInHKD;
  });
  const traditionalTotalCost = ageToAccMP[100] || 0;

  const finalNotionalAmountNum = finalNotionalAmount ? parseFloat(finalNotionalAmount.replace(/,/g, '')) : 0;
  const financingTotalCost = numberOfYearAccMP + cashValueInfo.annual_premium * numberOfYears;

  const savingsAmount = traditionalTotalCost - financingTotalCost;
  const savingsPercentage = traditionalTotalCost > 0 ? (savingsAmount / traditionalTotalCost) * 100 : 0;

  let formattedSavings, formattedAccountValue1, formattedAccountValue2, formattedFinancingTotalCost, formattedTraditionalTotalCost;
  if (i18n.language === 'en') {
    const savingsInK = Math.round(savingsAmount / 1000);
    formattedSavings = numberFormatter.format(savingsInK) + 'K';
    const accountValue1InK = Math.round(currency1 / 1000);
    formattedAccountValue1 = numberFormatter.format(accountValue1InK) + 'K';
    const accountValue2InK = Math.round(currency2 / 1000);
    formattedAccountValue2 = numberFormatter.format(accountValue2InK) + 'K';
    const financingTotalCostInK = Math.round(financingTotalCost / 1000);
    formattedFinancingTotalCost = numberFormatter.format(financingTotalCostInK) + 'K';
    const traditionalTotalCostInK = Math.round(traditionalTotalCost / 1000);
    formattedTraditionalTotalCost = numberFormatter.format(traditionalTotalCostInK) + 'K';
  } else {
    const savingsInMillions = Math.round(savingsAmount / 10000);
    formattedSavings = numberFormatter.format(savingsInMillions) + (i18n.language === 'zh-CN' ? '万' : '萬');
    const accountValue1InMillions = Math.round(currency1 / 10000);
    formattedAccountValue1 = numberFormatter.format(accountValue1InMillions) + (i18n.language === 'zh-CN' ? '万' : '萬');
    const accountValue2InMillions = Math.round(currency2 / 10000);
    formattedAccountValue2 = numberFormatter.format(accountValue2InMillions) + (i18n.language === 'zh-CN' ? '万' : '萬');
    const financingTotalCostInMillions = Math.round(financingTotalCost / 10000);
    formattedFinancingTotalCost = numberFormatter.format(financingTotalCostInMillions) + (i18n.language === 'zh-CN' ? '万' : '萬');
    const traditionalTotalCostInMillions = Math.round(traditionalTotalCost / 10000);
    formattedTraditionalTotalCost = numberFormatter.format(traditionalTotalCostInMillions) + (i18n.language === 'zh-CN' ? '万' : '萬');
  }

  const formattedSavingsPercentage = numberFormatter.format(Math.round(savingsPercentage));

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

    let currentY = 15;

    doc.setFontSize(12);
    doc.setFont('NotoSansCJKtc', 'bold');

    const pageWidth = 210;
    const margin = 14;
    const contentWidth = pageWidth - 2 * margin;
    const fieldWidth = contentWidth / 4;

    const x1 = margin;
    const x2 = margin + fieldWidth;
    const x3 = margin + 2 * fieldWidth;
    const x4 = margin + 3 * fieldWidth;
    const currencyFormattedTraditionalTotalCost = numberFormatter.format(Math.round(traditionalTotalCost));
    const currencyFormattedFinancingTotalCost = numberFormatter.format(Math.round(financingTotalCost));

    doc.text(`${t('common.age')}: ${age || ''}`, x1, currentY);
    doc.text(`${t('common.numberOfYears')}: ${numberOfYears || ''}`, x2, currentY);
    const currencyFormattedFinancingTotalCostPerYear = currencyFormattedFinancingTotalCost / numberOfYears;
    doc.text(`${t('formattedFinancingTotalCostPerYear')}: ${currencyFormattedFinancingTotalCostPerYear || ''}`, x3, currentY);
    doc.text(`${t('formattedFinancingTotalCost')}: ${currencyFormattedFinancingTotalCost || ''}`, x4, currentY);

    currentY += 5;

    const formattedFinalNotionalAmount = finalNotionalAmount
      ? numberFormatter.format(parseFloat(finalNotionalAmount.replace(/,/g, '')))
      : '0';

    autoTable(doc, {
      startY: currentY,
      head: [
        [
          t('comparisonPopup.basicPlan'),
          t('comparisonPopup.premiumPaymentPeriod'),
          t('comparisonPopup.finalNotionalAmount'),
        ],
      ],
      body: [
        [
          clientInfo.basicPlan || '',
          clientInfo.premiumPaymentPeriod || '',
          clientInfo.basicPlanCurrency === "美元" ? 'USD$' + formattedFinalNotionalAmount : 'HKD$' + formattedFinalNotionalAmount,
        ],
      ],
      theme: 'grid',
      styles: { font: 'NotoSansCJKtc', fontStyle: 'normal', fontSize: 10 },
      headStyles: { fontStyle: 'bold', fillColor: appBarColor },
      margin: { left: 14, right: 14 },
    });

    currentY = doc.lastAutoTable.finalY + 5;

    const planTablesStartY = currentY;

    currentY += 5;

    const titleY = currentY + 7;
    const pointsY = titleY + 7;
    const cardY = titleY - 7;

    const leftX = 14;
    const rightX = 110;
    const textWidth = 80;

    doc.setDrawColor(42, 157, 143);
    doc.setLineWidth(0.5);
    const cardPadding = 5;
    const cardWidth = 85;
    const cardHeight = 35;
    const cardX = leftX + 5 - cardPadding;
    doc.rect(cardX, cardY, cardWidth, cardHeight);

    doc.setFontSize(14);
    doc.setTextColor(42, 157, 143);
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text(t('comparisonPopup.traditionalMedicalPremium'), leftX + 2, titleY);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('NotoSansCJKtc', 'normal');
    const traditionalPoints = [
      t('comparisonPopup.traditionalPoints.0'),
      t('comparisonPopup.traditionalPoints.1', { traditionalTotalCost: formattedTraditionalTotalCost }),
      t('comparisonPopup.traditionalPoints.2'),
      t('comparisonPopup.traditionalPoints.3'),
    ];
    traditionalPoints.forEach((point, index) => {
      doc.text(point, leftX + 2, pointsY + index * 8, { maxWidth: textWidth });
    });

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
      t('comparisonPopup.financingPoints.0', { premiumPaymentPeriod: clientInfo.premiumPaymentPeriod }),
      t('comparisonPopup.financingPoints.1', { savingsPercentage: formattedSavingsPercentage, savings: formattedSavings }),
      i18n.language === 'zh-CN'
        ? t('comparisonPopup.financingPoints.2')
        : t('comparisonPopup.financingPoints.2', { age: age1, formattedAccountValue: formattedAccountValue1 }),
      t('comparisonPopup.financingPoints.3'),
    ];
    financingPoints.forEach((point, index) => {
      doc.text(point, rightX + 3, pointsY + index * 8, { maxWidth: textWidth });
    });

    const howItWorksY = pointsY + 25;
    doc.setFillColor(15, 17, 28);
    doc.rect(14, howItWorksY, 182, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text(t('comparisonPopup.howItWorks'), 105, howItWorksY + 7, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    const tablesStartY = howItWorksY + 13;

    const tableRows = inputs.map(input => {
      const fromAge = parseInt(input.fromAge, 10);
      const toAge = parseInt(input.toAge, 10);
      const yearlyWithdrawalAmount = parseFloat(input.yearlyWithdrawalAmount.replace(/,/g, ''));
      const numberOfYears = toAge - fromAge + 1;
      const sumInUSD = yearlyWithdrawalAmount * numberOfYears;
      const sumInHKD = sumInUSD * currencyRate;
      const formattedSum = numberFormatter.format(Math.round(sumInHKD));
      const ageRange = `${fromAge} - ${toAge}`;
      return [
        t(`expenseTypes.${input.expenseType}`),
        ageRange,
        `HKD $ ${formattedSum}`
      ];
    });

    const totalSumInHKD = inputs.reduce((acc, input) => {
      const fromAge = parseInt(input.fromAge, 10);
      const toAge = parseInt(input.toAge, 10);
      const yearlyWithdrawalAmount = parseFloat(input.yearlyWithdrawalAmount.replace(/,/g, ''));
      const numberOfYears = toAge - fromAge + 1;
      const sumInUSD = yearlyWithdrawalAmount * numberOfYears;
      const sumInHKD = sumInUSD * currencyRate;
      return acc + sumInHKD;
    }, 0);
    const formattedTotal = numberFormatter.format(Math.round(totalSumInHKD));

    autoTable(doc, {
      startY: tablesStartY,
      head: [
        // [{ content: t('outputForm1.header'), colSpan: 3, styles: { halign: 'center', fillColor: [42, 157, 143] } }],
        [t('outputForm1.expenseType'), t('outputForm1.ageRange'), t('outputForm1.sumOfWithdrawal')]
      ],
      body: tableRows,
      // foot: [[{ content: t('outputForm1.footer', { total: formattedTotal }), colSpan: 3, styles: { halign: 'right' } }]],
      theme: 'grid',
      styles: { font: 'NotoSansCJKtc', fontStyle: 'normal', fontSize: 10 },
      headStyles: { fontStyle: 'bold',fillColor: [42, 157, 143] },
      // footStyles: { fillColor: [255, 255, 0], fontStyle: 'bold' },
      columnStyles: { 2: { halign: 'right' } },
      margin: { left: leftX, right: 110 },
    });

    const table1FinalY = doc.lastAutoTable.finalY;

    const outputForm2Rows = [];
    const firstRowEndAge = age + parseInt(clientInfo.premiumPaymentPeriod) - 1;
    outputForm2Rows.push([`${age} - ${firstRowEndAge} ${t('common.yearsOld')}`, t('outputForm2.firstRowValue', { premiumPaymentPeriod: clientInfo.premiumPaymentPeriod, averageMonthly: numberFormatter.format(Math.round(financingTotalCost / clientInfo.premiumPaymentPeriod / 12)) })]);

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

    const yPosition = Math.max(table1FinalY + 10, table2FinalY + 10) - 5;

    doc.setFont('NotoSansCJKtc', 'bold');
    doc.text(t('comparisonPopup.totalCost', { total: currencyFormattedTraditionalTotalCost }), leftX + 2, yPosition + 3);
    doc.text(t('formattedFinancingTotalCost', { total: currencyFormattedFinancingTotalCost }), rightX + 2, yPosition + 3);

    doc.setFont('NotoSansCJKtc', 'normal');
    doc.text(t('comparisonPopup.accountValueAtAge', { age: age1, value: '沒有價值' }), leftX + 2, yPosition + 11);
    doc.text(t('comparisonPopup.accountValueAtAge', { age: age2, value: '沒有價值' }), leftX + 2, yPosition + 18);
    doc.text(t('comparisonPopup.accountValueAtAge', { age: age1, value: formattedAccountValue1 }), rightX + 2, yPosition + 11);
    doc.text(t('comparisonPopup.accountValueAtAge', { age: age2, value: formattedAccountValue2 }), rightX + 2, yPosition + 18);

    const pageHeight = 297;
    const bottomMargin = 10;
    const disclaimerY = pageHeight - bottomMargin;
    doc.setFontSize(8);
    doc.setFont('NotoSansCJKtc', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(t('comparisonPopup.disclaimer'), pageWidth / 2, disclaimerY, { align: 'center', maxWidth: pageWidth - 2 * margin });

    const timestamp = getHongKongTimestamp();
    const pdfBlob = doc.output('blob');
    const pdfUrl = window.URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    setTimeout(() => {
      window.URL.revokeObjectURL(pdfUrl);
    }, 1000);
  };

  const generatePDFWithHtml2pdf = () => {
    const originalElement = document.getElementById('pdf-content');
    if (originalElement) {
      const clonedElement = originalElement.cloneNode(true);
      const wrapper = document.createElement('div');

      wrapper.style.fontSize = '80%';
      wrapper.style.marginTop = '0';
      wrapper.style.padding = '0';
      wrapper.style.position = 'relative';

      function wrapTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
          const span = document.createElement('span');
          span.className = 'shifted-text';
          span.style.transform = 'translateY(-15px)';
          span.style.display = 'inline';
          span.textContent = node.textContent;
          node.replaceWith(span);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          Array.from(node.childNodes).forEach(child => wrapTextNodes(child));
        }
      }

      wrapTextNodes(clonedElement);
      wrapper.appendChild(clonedElement);

      clonedElement.style.margin = '0';
      clonedElement.style.padding = '0';
      clonedElement.style.boxSizing = 'border-box';

      const timestamp = getHongKongTimestamp();
      setTimeout(() => {
        const shiftInPoints = 10;
        const pointsPerInch = 72;
        const shiftInInches = shiftInPoints / pointsPerInch;
        const adjustedTopMargin = 0.1 - shiftInInches;

        html2pdf().from(wrapper).set({
          margin: [0.5, 0.2, 0.2, 0.2],
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, y: 0 },
          jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' }
        }).output('blob').then((pdfBlob) => {
          const pdfUrl = window.URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, '_blank');
          setTimeout(() => {
            window.URL.revokeObjectURL(pdfUrl);
          }, 1000);
        });
      }, 1000);
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
      </DialogTitle>
      <DialogContent>
        <div id="pdf-content">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ backgroundColor: 'rgb(42, 157, 143)', color: 'white', '& h3, & h5': { color: 'white' }, p: 2, position: 'relative' }}>
                <img src="/cross.png" alt="Cross" style={{ position: 'absolute', top: 20, right: 8, width: 50, height: 50 }} />
                <Typography variant="h3">{t('comparisonPopup.traditionalMedicalPremium')}</Typography>
                <Typography variant="h5">{t('comparisonPopup.traditionalPoints.0')}</Typography>
                <Typography variant="h5">{t('comparisonPopup.traditionalPoints.1', { traditionalTotalCost: formattedTraditionalTotalCost })}</Typography>
                <Typography variant="h5">{t('comparisonPopup.traditionalPoints.2')}</Typography>
                <Typography variant="h5">{t('comparisonPopup.traditionalPoints.3')}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ backgroundColor: 'rgb(244, 162, 97)', p: 2, position: 'relative' }}>
                <img src="/tick.png" alt="Tick" style={{ position: 'absolute', top: 20, right: 8, width: 50, height: 50 }} />
                <Typography variant="h3">{t('comparisonPopup.financingMedicalPremium')}</Typography>
                <Typography variant="h5">{t('comparisonPopup.financingPoints.0', { premiumPaymentPeriod: clientInfo.premiumPaymentPeriod })}</Typography>
                <Typography variant="h5">{t('comparisonPopup.financingPoints.1', { savingsPercentage: formattedSavingsPercentage, savings: formattedSavings })}</Typography>
                {i18n.language === 'zh-CN' ? (
                  <Typography variant="h5">{t('comparisonPopup.financingPoints.2')}</Typography>
                ) : (
                  <Typography variant="h5">{t('comparisonPopup.financingPoints.2', { age: age1, formattedAccountValue: formattedAccountValue1 })}</Typography>
                )}
                <Typography variant="h5">{t('comparisonPopup.financingPoints.3')}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'rgb(38, 70, 83)', color: 'white', p: 2, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: 'white !important' }}>{t('comparisonPopup.howItWorks')}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <OutputForm_1 
                proposal={proposal}
                fontSizeMultiplier={1.5}
              />
              <Typography variant="h4">{t('comparisonPopup.accountValueAtAge', { age: age1, value: '-' })}</Typography>
              <Typography variant="h4">{t('comparisonPopup.accountValueAtAge', { age: age2, value: '-' })}</Typography>
            </Grid>
            <Grid item xs={6}>
              <OutputForm_2
                proposal={proposal}
                finalNotionalAmount={finalNotionalAmount}
                cashValueInfo={cashValueInfo}
              />
              <Typography variant="h4">{t('comparisonPopup.accountValueAtAge', { age: age1, value: formattedAccountValue1 })}</Typography>
              <Typography variant="h4">{t('comparisonPopup.accountValueAtAge', { age: age2, value: formattedAccountValue2 })}</Typography>
            </Grid>
          </Grid>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{t('comparisonPopup.disclaimer')}</Typography>
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        {/* <FormControlLabel
          control={<Switch checked={isJsPDFEnabled} onChange={(e) => setIsJsPDFEnabled(e.target.checked)} />}
          label={t('comparisonPopup.useHtml')}
        /> */}
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