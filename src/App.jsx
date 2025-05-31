//bj
import React, { useState, useCallback, useEffect } from 'react';
import { ThemeProvider, createTheme, AppBar, Toolbar, IconButton, Typography, Container, Grid, Box, Card } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import Proposal from './Proposal';
import UseInflation from './UseInflation';
import LanguageSwitch from './LanguageSwitch';
import OutputForm_2 from './OutputForm_2';
import OutputForm_3 from './OutputForm_3';
import OutputForm_1 from './OutputForm_1';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

const App = () => {
  const IsProduction_Login = true;
  const { t } = useTranslation();

  const [proposals, setProposals] = useState(() => {
    const saved = localStorage.getItem('proposals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved proposals:', e);
      }
    }
    return [
      {
        target: { age: 6, numberOfYears: 5, currencyRate: 7.85, inflationRate: 2 },
        inputs: [{ expenseType: 'tuition', fromAge: '19', toAge: '22', yearlyWithdrawalAmount: '50,000' }],
        processData: []
      }
    ];
  });

  const [inflationRate, setInflationRate] = useState(() => {
    const savedProposals = localStorage.getItem('proposals');
    if (savedProposals) {
      try {
        const parsed = JSON.parse(savedProposals);
        return parsed[0]?.target.inflationRate ?? 1.5;
      } catch (e) {
        console.error('Error parsing saved proposals for inflationRate:', e);
      }
    }
    return 1.5;
  });

  const [currencyRate, setCurrencyRate] = useState(() => {
    const savedProposals = localStorage.getItem('proposals');
    if (savedProposals) {
      try {
        const parsed = JSON.parse(savedProposals);
        return parsed[0]?.target.currencyRate ?? 7.85;
      } catch (e) {
        console.error('Error parsing saved proposals for currencyRate:', e);
      }
    }
    return 7.85;
  });

  const [useInflation, setUseInflation] = useState(false);
  const [appBarColor, setAppBarColor] = useState('green');
  const [company, setCompany] = useState('Manulife');
  const [finalNotionalAmount, setFinalNotionalAmount] = useState(null);
  const [cashValueInfo, setCashValueInfo] = useState({
    age_1: 65,
    age_2: 85,
    age_1_cash_value: 0,
    age_2_cash_value: 0,
    annual_premium: 0
  });
  const [clientInfo, setClientInfo] = useState({
    surname: "VIP",
    givenName: "VIP",
    chineseName: "",
    basicPlan: '宏摯傳承保障計劃(GS)',
    premiumPaymentPeriod: '15',
    basicPlanCurrency: '美元'
  });
  const [pdfBase64, setpdfBase64] = useState();
  const [filename, setfilename] = useState();

  useEffect(() => {
    localStorage.setItem('proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    setProposals(prevProposals =>
      prevProposals.map(proposal => ({
        ...proposal,
        target: { ...proposal.target, currencyRate }
      }))
    );
  }, [currencyRate]);

  useEffect(() => {
    setProposals(prevProposals =>
      prevProposals.map(proposal => ({
        ...proposal,
        target: { ...proposal.target, inflationRate }
      }))
    );
  }, [inflationRate]);

  const addProposal = () => {
    if (proposals.length < 6) {
      setProposals([
        ...proposals,
        {
          target: { age: 5, numberOfYears: 15, currencyRate: currencyRate, inflationRate: inflationRate },
          inputs: [{ expenseType: '', fromAge: '', toAge: '', yearlyWithdrawalAmount: '' }],
          processData: []
        }
      ]);
    }
  };

  const removeProposal = () => {
    if (proposals.length > 1) {
      setProposals(proposals.slice(0, -1));
    }
  };

  const updateProposalTarget = (proposalIndex, newTarget) => {
    setProposals(prev => {
      const newProposals = [...prev];
      newProposals[proposalIndex] = {
        ...newProposals[proposalIndex],
        target: newTarget
      };
      return newProposals;
    });
  };

  const addInputToProposal = (proposalIndex) => {
    if (proposals[proposalIndex].inputs.length < 5) {
      setProposals(prev => {
        const newProposals = [...prev];
        const proposal = newProposals[proposalIndex];
        const lastInput = proposal.inputs[proposal.inputs.length - 1];
        const newFromAge = lastInput ? Number(lastInput.toAge) + 1 : '';
        const newInputs = [
          ...proposal.inputs,
          { expenseType: '', fromAge: newFromAge, toAge: '', yearlyWithdrawalAmount: '' }
        ];
        newProposals[proposalIndex] = {
          ...proposal,
          inputs: newInputs
        };
        return newProposals;
      });
    }
  };

  const removeInputFromProposal = (proposalIndex) => {
    if (proposals[proposalIndex].inputs.length > 1) {
      setProposals(prev => {
        const newProposals = [...prev];
        const proposal = newProposals[proposalIndex];
        const newInputs = proposal.inputs.slice(0, -1);
        newProposals[proposalIndex] = {
          ...proposal,
          inputs: newInputs
        };
        return newProposals;
      });
    }
  };

  const updateInputInProposal = (proposalIndex, inputIndex, newInput) => {
    setProposals(prev => {
      const newProposals = [...prev];
      const proposal = newProposals[proposalIndex];
      const newInputs = [...proposal.inputs];
      newInputs[inputIndex] = newInput;
      newProposals[proposalIndex] = {
        ...proposal,
        inputs: newInputs
      };
      return newProposals;
    });
  };

  const setProcessData = useCallback((proposalIndex, newProcessData) => {
    setProposals(prev => prev.map((proposal, index) =>
      index === proposalIndex ? { ...proposal, processData: newProcessData } : proposal
    ));
  }, []);

  const handleInflationRateChange = (value) => {
    setInflationRate(value);
  };

  const handleCurrencyRateChange = (value) => {
    setCurrencyRate(value);
  };

  proposals.forEach((proposal, index) => {
    console.log(`Proposal ${index + 1}:`);
    console.log(`  Target age: ${proposal.target.age}`);
    console.log(`  Target numberOfYears: ${proposal.target.numberOfYears}`);
    console.log(`  Target currencyRate: ${proposal.target.currencyRate}`);
    console.log(`  Target inflationRate: ${proposal.target.inflationRate}`);
    proposal.inputs.forEach((input, idx) => {
      console.log(`  Input ${idx + 1}:`);
      console.log(`    Expense Type: ${input.expenseType}`);
      console.log(`    From Age: ${input.fromAge}`);
      console.log(`    To Age: ${input.toAge}`);
      console.log(`    Yearly Withdrawal Amount: ${input.yearlyWithdrawalAmount}`);
    });
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: '100%', backgroundColor: appBarColor }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => { window.location.href = "https://portal.aimarketings.io/tool-list/"; }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            {t('Medical Financial Calculator')}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 10, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={addProposal} disabled={proposals.length >= 6}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={removeProposal} disabled={proposals.length <= 1}>
            <RemoveIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {proposals.map((proposal, proposalIndex) => (
              <Proposal
                key={proposalIndex}
                proposalIndex={proposalIndex}
                target={proposal.target}
                inputs={proposal.inputs}
                processData={proposal.processData}
                updateTarget={(newTarget) => updateProposalTarget(proposalIndex, newTarget)}
                addInput={() => addInputToProposal(proposalIndex)}
                removeInput={() => removeInputFromProposal(proposalIndex)}
                updateInput={(inputIndex, newInput) => updateInputInProposal(proposalIndex, inputIndex, newInput)}
                inflationRate={inflationRate}
                currencyRate={currencyRate}
                useInflation={useInflation}
                setProcessData={setProcessData}
                disabled={finalNotionalAmount !== null}
              />
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ p: 2 }}>
              <UseInflation
                inflationRate={inflationRate}
                currencyRate={currencyRate}
                useInflation={useInflation}
                setUseInflation={setUseInflation}
                onInflationRateChange={handleInflationRateChange}
                onCurrencyRateChange={handleCurrencyRateChange}
                processData={proposals}
                inputs={proposals}
                clientInfo={clientInfo}
                setClientInfo={setClientInfo}
                cashValueInfo={cashValueInfo}
                setCashValueInfo={setCashValueInfo}
                company={company}
                disabled={finalNotionalAmount !== null}
                setFinalNotionalAmount={setFinalNotionalAmount}
                pdfBase64={pdfBase64}
                setpdfBase64={setpdfBase64}
                filename={filename}
                setfilename={setfilename}
                IsProduction_Login={IsProduction_Login}
              />
            </Card>
            <Card elevation={3} sx={{ mt: 2, p: 2 }}>
              {proposals.map((proposal, proposalIndex) => (
                <OutputForm_1
                  key={proposalIndex}
                  proposal={proposal}
                />
              ))}
            </Card>
            <Card elevation={3} sx={{ mt: 2, p: 2 }}>
              {proposals.map((proposal, proposalIndex) => (
                <OutputForm_2
                  key={proposalIndex}
                  proposal={proposal}
                  finalNotionalAmount={finalNotionalAmount}
                  cashValueInfo={cashValueInfo}
                />
              ))}
            </Card>
            {finalNotionalAmount && (
              <Card elevation={3} sx={{ mt: 2, p: 2 }}>
                {proposals.map((proposal, proposalIndex) => (
                  <OutputForm_3
                    key={proposalIndex}
                    proposal={proposal}
                    cashValueInfo={cashValueInfo}
                    finalNotionalAmount={finalNotionalAmount}
                    setFinalNotionalAmount={setFinalNotionalAmount}
                    clientInfo={clientInfo}
                    appBarColor={appBarColor}
                    pdfBase64={pdfBase64}
                    filename={filename}
                  />
                ))}
              </Card>
            )}
            <Box sx={{ mt: 2 }}>
              <LanguageSwitch
                setAppBarColor={setAppBarColor}
                appBarColor={appBarColor}
                setCompany={setCompany}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;