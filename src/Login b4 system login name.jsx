import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import manulifeSavingPlans from './dropdown/manulife/manulife_saving_plan.json';
import premiumPaymentPeriodOptions from './dropdown/manulife/premium_payment_period_options.json';

import { 
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  RadioGroup,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
};

function Login({ 
  open,
  onClose,
  processedData, 
  inputs, 
  numberOfYearAccMP,
  useInflation,
  setFinalNotionalAmount
}) {
  const { t } = useTranslation();
  const IsProduction = true;
  const [url, setUrl] = useState('https://api.hkprod.manulife.com.hk/ext/pos-qq-web-hkg-app/');
  const [username, setUsername] = IsProduction ? useState(() => localStorage.getItem('username') || '') : useState('CHANTSZLUNG');
  const [password, setPassword] = IsProduction ? useState(() => localStorage.getItem('password') || '') : useState('Ctsz_!376897');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [newNotionalAmount, setNewNotionalAmount] = useState('');
  const [pdfDownloadLink, setPdfDownloadLink] = useState('');
  const [isCorporateCustomer, setIsCorporateCustomer] = useState(false);
  const [isPolicyHolder, setIsPolicyHolder] = useState(true);
  const [surname, setSurname] = IsProduction ? useState('') : useState('Chann');
  const [givenName, setGivenName] = IsProduction ? useState("") : useState('Peterrr');
  const [chineseName, setChineseName] = useState('');
  const [dob, setDob] = useState('');
  const [insuranceAge, setInsuranceAge] = useState('40');
  const [gender, setGender] = useState('Male');
  const [isSmoker, setIsSmoker] = useState(false);
  const [planCategory, setPlanCategory] = useState('全部');
  const [basicPlan, setBasicPlan] = useState('宏摯傳承保障計劃(GS)');
  const [premiumPaymentPeriod, setPremiumPaymentPeriod] = useState('15');
  const [worryFreeOption, setWorryFreeOption] = useState('否');
  const [currency, setCurrency] = useState('美元');
  const [notionalAmount, setNotionalAmount] = useState('20000');
  const [premiumPaymentMethod, setPremiumPaymentMethod] = useState('每年');
  const [getPromotionalDiscount, setGetPromotionalDiscount] = useState(true);
  const [fromYear, setFromYear] = useState(inputs.numberOfYears + 1);
  const [withdrawalPeriod, setWithdrawalPeriod] = useState('');
  const [annualWithdrawalAmount, setAnnualWithdrawalAmount] = useState(1000);
  const [proposalLanguage, setProposalLanguage] = useState("zh");
  const [availablePaymentPeriods, setAvailablePaymentPeriods] = useState([]);
  const [logs, setLogs] = useState([]);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const logRef = useRef(null);
  const shouldShowField = false;

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('password', password);
  }, [password]);

  useEffect(() => {
    if (inputs.age && inputs.numberOfYears) {
      const calculatedWithdrawalPeriod = 100 - inputs.age - inputs.numberOfYears + 2;
      setWithdrawalPeriod(calculatedWithdrawalPeriod);
    }
  }, [inputs.age, inputs.numberOfYears]);

  useEffect(() => {
    if (step === 'success' && pdfDownloadLink) {
      // Uncomment to enable auto-download
      // const link = document.createElement('a');
      // link.href = pdfDownloadLink;
      // link.download = 'proposal.pdf';
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    }
  }, [step, pdfDownloadLink]);

  const serverURL = IsProduction ? 'https://fastapi-production-a20ab.up.railway.app' : 'http://localhost:9002';
  useEffect(() => {
    if (sessionId) {
      const eventSource = new EventSource(`${serverURL}/logs/${sessionId}`);
      eventSource.onmessage = (event) => {
        setLogs(prevLogs => [...prevLogs, event.data]);
      };
      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        eventSource.close();
      };
      return () => {
        eventSource.close();
      };
    }
  }, [sessionId]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logDialogOpen, logs]);

  const handleClose = () => {
    onClose();
    setStep('login');
    setSystemMessage('');
    setNewNotionalAmount('');
    setPdfDownloadLink('');
    setOtp('');
    setOtpError('');
    setSessionId('');
    setLogs([]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(serverURL + '/login', {
        url,
        username,
        password,
      });
      setSessionId(response.data.session_id);
      setStep('otp');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOtpError('');
    try {
      const response = await axios.post(serverURL + '/verify-otp', {
        session_id: sessionId,
        otp,
        calculation_data: {
          processedData,
          inputs,
          totalAccumulatedMP: numberOfYearAccMP,
        },
        formData: {
          isCorporateCustomer,
          isPolicyHolder,
          surname,
          givenName,
          chineseName,
          insuranceAge,
          gender,
          isSmoker,
          basicPlan,
          currency, 
          notionalAmount,
          premiumPaymentPeriod,
          premiumPaymentMethod,
          useInflation,
          proposalLanguage,
        },
      });
      if (response.data.status === 'otp_failed') {
        setOtpError(response.data.message);
      } else if (response.data.status === 'retry') {
        setSystemMessage(response.data.system_message);
        setStep('retry');
      } else if (response.data.status === 'success') {
        setPdfDownloadLink(response.data.pdf_link);
        setStep('success');
        setFinalNotionalAmount(notionalAmount);
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleRetrySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(serverURL + '/retry-notional', {
        session_id: sessionId,
        new_notional_amount: newNotionalAmount,
      });
      if (response.data.status === 'retry') {
        setSystemMessage(response.data.system_message);
        setNewNotionalAmount('');
      } else if (response.data.status === 'success') {
        setPdfDownloadLink(response.data.pdf_link);
        setStep('success');
        setFinalNotionalAmount(newNotionalAmount);
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    if (step === 'login') {
      handleLogin(e);
    } else if (step === 'otp') {
      handleOtpSubmit(e);
    }
  };

  useEffect(() => {
    if (basicPlan && premiumPaymentPeriodOptions[basicPlan]) {
      setAvailablePaymentPeriods(premiumPaymentPeriodOptions[basicPlan]);
    } else {
      setAvailablePaymentPeriods([]);
    }
    setPremiumPaymentPeriod('');
  }, [basicPlan]);

  const numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const [displayValue, setDisplayValue] = useState('');

  const handleChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, '');
    if (input === '') {
      setNotionalAmount('');
      setDisplayValue('');
      return;
    }

    const numericValue = parseInt(input, 10);
    if (!isNaN(numericValue)) {
      setNotionalAmount(numericValue.toString());
      setDisplayValue(numberFormatter.format(numericValue));
    }
  };

  const handleBlur = () => {
    if (notionalAmount !== '') {
      const numericValue = parseInt(notionalAmount, 10);
      if (!isNaN(numericValue)) {
        setDisplayValue(numberFormatter.format(numericValue));
      } else {
        setNotionalAmount('');
        setDisplayValue('');
      }
    }
  };

  const handleFocus = () => {
    if (notionalAmount !== '') {
      setDisplayValue(notionalAmount);
    }
  };

  const languageLabels = {
    zh: t('login.languageZh'),
    sc: t('login.languageSc'),
    en: t('login.languageEn'),
  };

  return (
    <Modal
      open={open}
      onClose={() => {}}
      aria-labelledby="login-modal"
      aria-describedby="insurance-plan-login"
    >
      <Paper sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {t('login.title')}
        </Typography>
        
        {step === 'login' || step === 'otp' ? (
          <form onSubmit={handleSubmit}>
            <div className="margin-top-20 info-section">
              <div className="customer-card-container" style={{ display: 'grid', gap: '20px' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <TextField
                      label={<>{t('login.surname')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label={<>{t('login.givenName')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      value={givenName}
                      onChange={(e) => setGivenName(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <TextField
                      label={t('login.chineseName')}
                      value={chineseName}
                      onChange={(e) => setChineseName(e.target.value)}
                      fullWidth
                      disabled={loading || step === 'otp'}
                      inputProps={{ maxLength: 10 }}
                      sx={{ mb: 2 }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  <div>
                    {shouldShowField && (
                      <TextField
                        label={t('login.insuranceAge')}
                        value={insuranceAge}
                        onChange={(e) => setInsuranceAge(e.target.value)}
                        fullWidth
                        disabled={loading || step === 'otp'}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ style: { fontWeight: '500' } }}
                        select
                      >
                        {Array.from({ length: 100 }, (_, i) => 0 + i).map((num) => (
                          <MenuItem key={num} value={String(num)}>
                            {num}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </div>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>
                      {t('login.gender')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                    </Typography>
                    <RadioGroup
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      row
                      sx={{ display: 'flex', gap: '20px', position: 'relative', right: '-12px' }}
                    >
                      <FormControlLabel
                        value="Male"
                        control={<Radio sx={{ display: 'none' }} />}
                        disabled={loading || step === 'otp'}
                        label={
                          <>
                            <span style={{
                              display: 'inline-block',
                              width: '20px',
                              height: '20px',
                              border: '2px solid #ccc',
                              borderRadius: '50%',
                              marginRight: '8px',
                              backgroundColor: '#fff',
                              position: 'relative',
                            }}>
                              {gender === 'Male' && (
                                <svg
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="#10740AFF"
                                >
                                  <circle cx="12" cy="12" r="6" />
                                </svg>
                              )}
                            </span>
                            {t('login.genderMale')}
                          </>
                        }
                      />
                      <FormControlLabel
                        value="Female"
                        control={<Radio sx={{ display: 'none' }} />}
                        disabled={loading || step === 'otp'}
                        label={
                          <>
                            <span style={{
                              display: 'inline-block',
                              width: '20px',
                              height: '20px',
                              border: '2px solid #ccc',
                              borderRadius: '50%',
                              marginRight: '8px',
                              backgroundColor: '#fff',
                              position: 'relative',
                            }}>
                              {gender === 'Female' && (
                                <svg
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="#10740AFF"
                                >
                                  <circle cx="12" cy="12" r="6" />
                                </svg>
                              )}
                            </span>
                            {t('login.genderFemale')}
                          </>
                        }
                      />
                    </RadioGroup>
                  </div>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>
                      {t('login.smokingHabit')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                    </Typography>
                    <RadioGroup
                      value={isSmoker.toString()}
                      onChange={(e) => setIsSmoker(e.target.value === 'true')}
                      row
                      sx={{ display: 'flex', gap: '20px', position: 'relative', right: '-12px' }}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio sx={{ display: 'none' }} />}
                        disabled={loading || step === 'otp'}
                        label={
                          <>
                            <span style={{
                              display: 'inline-block',
                              width: '20px',
                              height: '20px',
                              border: '2px solid #ccc',
                              borderRadius: '50%',
                              marginRight: '8px',
                              backgroundColor: '#fff',
                              position: 'relative',
                            }}>
                              {isSmoker && (
                                <svg
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="#10740AFF"
                                >
                                  <circle cx="12" cy="12" r="6" />
                                </svg>
                              )}
                            </span>
                            {t('login.yes')}
                          </>
                        }
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio sx={{ display: 'none' }} />}
                        disabled={loading || step === 'otp'}
                        label={
                          <>
                            <span style={{
                              display: 'inline-block',
                              width: '20px',
                              height: '20px',
                              border: '2px solid #ccc',
                              borderRadius: '50%',
                              marginRight: '8px',
                              backgroundColor: '#fff',
                              position: 'relative',
                            }}>
                              {!isSmoker && (
                                <svg
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="#10740AFF"
                                >
                                  <circle cx="12" cy="12" r="6" />
                                </svg>
                              )}
                            </span>
                            {t('login.no')}
                          </>
                        }
                      />
                    </RadioGroup>
                  </div>
                </Box>
              </div>

              <div className="customer-card-container" style={{ marginTop: '20px' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        {t('login.basicPlan')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={basicPlan}
                        onChange={(e) => setBasicPlan(e.target.value)}
                        label={<>{t('login.basicPlan')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp'}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                      >
                        {manulifeSavingPlans.map((plan) => (
                          <MenuItem key={plan} value={plan}>
                            {plan}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        {t('login.premiumPaymentPeriod')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={premiumPaymentPeriod}
                        onChange={(e) => setPremiumPaymentPeriod(e.target.value)}
                        label={<>{t('login.premiumPaymentPeriod')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp' || !basicPlan}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                        required
                      >
                        {availablePaymentPeriods.map((period) => (
                          <MenuItem key={period} value={period}>
                            {period}年
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        {t('login.currency')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        label={<>{t('login.currency')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp'}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                      >
                        <MenuItem value="美元">美元</MenuItem>
                        <MenuItem value="港元">港元</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      label={t('login.notionalAmount')}
                      value={displayValue}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {currency === '美元' ? 'USD' : 'HKD'}
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 2, 
                        '& .MuiInputLabel-asterisk': { color: 'red' },
                        '& .Mui-error': {
                          color: 'red',
                        }
                      }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                      placeholder={t("login.notioalAmountPlaceHolder")}
                      error={Number(displayValue?.replace(/[^0-9.-]+/g,"")) < 1500}
                      helperText={Number(displayValue?.replace(/[^0-9.-]+/g,"")) < 1500 ? t('login.notionalAmountError') : ""}
                    />
                  </div>
                </Box>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        {t('login.premiumPaymentMethod')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={premiumPaymentMethod}
                        onChange={(e) => setPremiumPaymentMethod(e.target.value)}
                        label={<>{t('login.premiumPaymentMethod')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp'}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                      >
                        <MenuItem value="每年">每年</MenuItem>
                        <MenuItem value="每半年">每半年</MenuItem>
                        <MenuItem value="每季">每季</MenuItem>
                        <MenuItem value="每月">每月</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>
                      {t('login.proposalLanguage')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                    </Typography>
                    <RadioGroup
                      value={proposalLanguage}
                      onChange={(e) => setProposalLanguage(e.target.value)}
                      row
                      sx={{ display: 'flex', gap: '20px', position: 'relative', right: '-12px' }}
                    >
                      {['zh', 'sc', 'en'].map((lang) => (
                        <FormControlLabel
                          key={lang}
                          value={lang}
                          control={<Radio sx={{ display: 'none' }} />}
                          disabled={loading || step === 'otp'}
                          label={
                            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                              <span style={{
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                border: `2px solid ${proposalLanguage === lang ? '#10740AFF' : '#ccc'}`,
                                borderRadius: '50%',
                                marginRight: '8px',
                                backgroundColor: '#fff',
                                position: 'relative',
                              }}>
                                {proposalLanguage === lang && (
                                  <svg
                                    style={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                    }}
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="#10740AFF"
                                  >
                                    <circle cx="12" cy="12" r="6" />
                                  </svg>
                                )}
                              </span>
                              {languageLabels[lang]}
                            </div>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="login-fields margin-top-20" style={{ marginTop: '30px' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <TextField
                      label={<>{t('login.websiteUrl')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  
                  <div>
                    <TextField
                      label={<>{t('login.password')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label={<>{t('login.username')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                </Box>
                {step === 'otp' && (
                  <TextField
                    label={<>{t('login.otpVerification')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setOtp(value);
                        if (value.length !== 6) {
                          setOtpError('OTP must be exactly 6 digits');
                        } else {
                          setOtpError('');
                        }
                      }
                    }}
                    onBlur={() => {
                      if (otp.length !== 6) {
                        setOtpError('OTP must be exactly 6 digits');
                      } else {
                        setOtpError('');
                      }
                    }}
                    required
                    fullWidth
                    disabled={loading}
                    error={!!otpError}
                    helperText={otpError}
                    sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                    InputLabelProps={{ style: { fontWeight: '500' } }}
                    inputProps={{
                      maxLength: 6,
                      inputMode: 'numeric',
                    }}
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ 
                    padding: '12px 24px', 
                    backgroundColor: loading ? '#ccc' : '#10740AFF', 
                    '&:hover': { backgroundColor: '#0d5f08' } 
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : step === 'login' ? (
                    t('login.loginButton')
                  ) : (
                    t('login.submitOtpButton')
                  )}
                </Button>

                <Box sx={{ mt: 2 }}>
                  <Button 
                    onClick={() => setLogDialogOpen(true)} 
                    variant="outlined"
                    fullWidth
                    sx={{ padding: '12px 24px' }}
                  >
                    {t('login.viewLogs', { count: logs.length })}
                  </Button>
                </Box>
              </div>
            </div>
          </form>
        ) : step === 'retry' ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('login.systemMessage')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {systemMessage}
            </Typography>
            <TextField
  label={t('login.newNotionalAmount')}
  value={newNotionalAmount}
  onChange={(e) => {
    const value = e.target.value;
    // Remove all non-digit characters except decimal point
    const rawValue = value.replace(/[^\d.]/g, '');
    
    // Split into whole and decimal parts
    const parts = rawValue.split('.');
    let whole = parts[0] || '';
    const decimal = parts.length > 1 ? `.${parts[1]}` : '';
    
    // Format whole number part with commas
    if (whole) {
      whole = parseInt(whole, 10).toLocaleString('en-US');
    }
    
    // Combine formatted whole number with decimal part
    const formattedValue = whole + decimal;
    
    // Only update if valid number or empty
    if (value === '' || /^[0-9,]*\.?[0-9]*$/.test(value)) {
      setNewNotionalAmount(formattedValue);
    }
  }}
  fullWidth
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        {currency === '美元' ? 'USD' : 'HKD'}
      </InputAdornment>
    ),
    inputMode: 'decimal',
  }}
  sx={{ mb: 2 }}
  InputLabelProps={{ style: { fontWeight: '500' } }}
  placeholder="Enter new amount"
  type="text"
/>
            <Button
              onClick={handleRetrySubmit}
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ 
                backgroundColor: loading ? '#ccc' : '#10740AFF', 
                '&:hover': { backgroundColor: '#0d5f08' } 
              }}
            >
              {loading ? <CircularProgress size={24} /> : t('login.submitButton')}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={() => setLogDialogOpen(true)} variant="outlined" fullWidth>
                {t('login.viewLogs', { count: logs.length })}
              </Button>
            </Box>
          </Box>
        ) : step === 'success' ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('login.successMessage')}
            </Typography>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{ 
                backgroundColor: '#10740AFF', 
                '&:hover': { backgroundColor: '#0d5f08' } 
              }}
            >
              {t('login.completeButton')}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={() => setLogDialogOpen(true)} variant="outlined" fullWidth>
                {t('login.viewLogs', { count: logs.length })}
              </Button>
            </Box>
          </Box>
        ) : null}

        <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('login.systemMessage')}</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                backgroundColor: '#f9f9f9',
              }}
              ref={logRef}
            >
              {logs.map((log, index) => (
                <Typography key={index} sx={{ marginBottom: '8px' }}>
                  {log}
                </Typography>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogDialogOpen(false)}>{t('login.completeButton')}</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Modal>
  );
}

export default Login;