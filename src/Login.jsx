import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Modal styling for consistent appearance
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
  useInflation 
}) {
  // Login and OTP states
  const IsProduction = true;
  const [url, setUrl] = useState('https://api.hkprod.manulife.com.hk/ext/pos-qq-web-hkg-app/');
  const [username, setUsername] = useState('CHANTSZLUNG');
  const [password, setPassword] = useState('Ctsz_!376897');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [newNotionalAmount, setNewNotionalAmount] = useState('');
  const [pdfDownloadLink, setPdfDownloadLink] = useState('');

  // Customer information states
  const [isCorporateCustomer, setIsCorporateCustomer] = useState(false);
  const [isPolicyHolder, setIsPolicyHolder] = useState(true);
  const [surname, setSurname] = useState('Chan');
  const [givenName, setGivenName] = useState('Peter');
  const [chineseName, setChineseName] = useState('陳大文');
  const [dob, setDob] = useState('');
  const [insuranceAge, setInsuranceAge] = useState(inputs.age);
  const [gender, setGender] = useState('Male');
  const [isSmoker, setIsSmoker] = useState(false);
  
  // Plan and payment states
  const [planCategory, setPlanCategory] = useState('全部');
  const [basicPlan, setBasicPlan] = useState('宏摯傳承保障計劃(GS)');
  const [premiumPaymentPeriod, setPremiumPaymentPeriod] = useState(15);
  const [worryFreeOption, setWorryFreeOption] = useState('否');
  const [currency, setCurrency] = useState('美元');
  const [notionalAmount, setNotionalAmount] = useState('20000');
  const [premiumPaymentMethod, setPremiumPaymentMethod] = useState('每年');
  const [getPromotionalDiscount, setGetPromotionalDiscount] = useState(true);

  // Withdrawal states
  const [fromYear, setFromYear] = useState(inputs.numberOfYear + 1);
  const [withdrawalPeriod, setWithdrawalPeriod] = useState('');
  const [annualWithdrawalAmount, setAnnualWithdrawalAmount] = useState(1000);
  
  // Update withdrawal period based on inputs.age and inputs.numberOfYear
  useEffect(() => {
    if (inputs.age && inputs.numberOfYear) {
      const calculatedWithdrawalPeriod = 100 - inputs.age - inputs.numberOfYear + 2;
      setWithdrawalPeriod(calculatedWithdrawalPeriod);
    }
  }, [inputs.age, inputs.numberOfYear]);

  // Auto-download PDF when step is 'success' and pdfDownloadLink is set
  useEffect(() => {
    if (step === 'success' && pdfDownloadLink) {
      const link = document.createElement('a');
      link.href = pdfDownloadLink;
      link.download = 'proposal.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [step, pdfDownloadLink]);

  // Handle close function
  const handleClose = () => {
    onClose();
    setStep('login');
    setSystemMessage('');
    setNewNotionalAmount('');
    setPdfDownloadLink('');
    setOtp(' ');
  };

  // Define manual download handler
  const handleManualDownload = () => {
    if (pdfDownloadLink) {
      const link = document.createElement('a');
      link.href = pdfDownloadLink;
      link.download = 'proposal.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle login submission
  let serverURL;
  IsProduction ? serverURL = 'https://fastapi-production-a20ab.up.railway.app' : serverURL = 'http://localhost:9002';
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

  // Handle OTP submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
          dob,
          gender,
          isSmoker,
          basicPlan,
          currency, 
          notionalAmount,
          premiumPaymentMethod,
          useInflation,
        },
      });
      if (response.data.status === 'retry') {
        setSystemMessage(response.data.system_message);
        setStep('retry');
      } else if (response.data.status === 'success') {
        setPdfDownloadLink(response.data.pdf_link);
        setStep('success');
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  // Handle retry submission with new notional amount
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
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  // Dynamic submit handler
  const handleSubmit = (e) => {
    if (step === 'login') {
      handleLogin(e);
    } else if (step === 'otp') {
      handleOtpSubmit(e);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {}} // Prevents closing on backdrop click or escape key
      aria-labelledby="login-modal"
      aria-describedby="insurance-plan-login"
    >
      <Paper sx={modalStyle}>
        {/* Close Button */}
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
          計劃易 - 登錄
        </Typography>
        
        {step === 'login' || step === 'otp' ? (
          <form onSubmit={handleSubmit}>
            <div className="margin-top-20 info-section">
              {/* Customer Information Fields */}
              <div className="customer-card-container" style={{ display: 'grid', gap: '20px' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <TextField
                      label={<>英文姓氏 <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 2 }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label={<>英文名字 <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      value={givenName}
                      onChange={(e) => setGivenName(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 2 }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <TextField
                      label="中文姓名"
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
                    <TextField
                      label="出生日期"
                      placeholder="DD/MM/YYYY"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 2 }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>
                      性別 <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                    </Typography>
                    <RadioGroup
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      row
                      sx={{ display: 'flex', gap: '20px' }}
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
                              transition: 'all 0.3s ease',
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
                            男
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
                              transition: 'all 0.3s ease',
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
                            女
                          </>
                        }
                      />
                    </RadioGroup>
                  </div>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>
                      您是否有吸煙習慣? <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                    </Typography>
                    <RadioGroup
                      value={isSmoker.toString()}
                      onChange={(e) => setIsSmoker(e.target.value === 'true')}
                      row
                      sx={{ display: 'flex', gap: '20px' }}
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
                              transition: 'all 0.3s ease',
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
                            是
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
                              transition: 'all 0.3s ease',
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
                            否
                          </>
                        }
                      />
                    </RadioGroup>
                  </div>
                </Box>
              </div>

              {/* Plan and Payment Fields */}
              <div className="customer-card-container" style={{ marginTop: '20px' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        計劃類別 <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={planCategory}
                        onChange={(e) => setPlanCategory(e.target.value)}
                        label={<>計劃類別 <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp'}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                      >
                        <MenuItem value="全部">全部</MenuItem>
                        <MenuItem value="退休">退休</MenuItem>
                        <MenuItem value="危疾">危疾</MenuItem>
                        <MenuItem value="儲蓄">儲蓄</MenuItem>
                        <MenuItem value="住院">住院</MenuItem>
                        <MenuItem value="投資">投資</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        基本計劃 <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={basicPlan}
                        onChange={(e) => setBasicPlan(e.target.value)}
                        label={<>基本計劃 <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp'}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                      >
                        <MenuItem value="宏摯傳承保障計劃(GS)">宏摯傳承保障計劃(GS)</MenuItem>
                        <MenuItem value="更多">更多</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        貨幣 <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        label={<>貨幣 <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
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
                      label="名義金額"
                      value={notionalAmount}
                      onChange={(e) => setNotionalAmount(e.target.value)}
                      fullWidth
                      disabled={loading || step === 'otp'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {currency === '美元' ? 'USD' : 'HKD'}
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                      placeholder="Enter amount"
                    />
                  </div>
                </Box>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        保費繳付方式 <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={premiumPaymentMethod}
                        onChange={(e) => setPremiumPaymentMethod(e.target.value)}
                        label={<>保費繳付方式 <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
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
                </div>
              </div>

              {/* Login Fields */}
              <div className="login-fields margin-top-20" style={{ marginTop: '30px' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <TextField
                      label={<>Website URL <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 2 }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label={<>Username <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 2 }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label={<>Password <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp'}
                      sx={{ mb: 3 }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                </Box>

                {/* OTP Field (shown only during OTP phase) */}
                {step === 'otp' && (
                  <TextField
                    label={<>OTP Verification <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2, mb: 2 }}
                    InputLabelProps={{ style: { fontWeight: '500' } }}
                  />
                )}

                {/* Submit Button */}
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
                    'Login'
                  ) : (
                    'Submit OTP'
                  )}
                </Button>
              </div>
            </div>
          </form>
        ) : step === 'retry' ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Message
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {systemMessage}
            </Typography>
            <TextField
              label="New Notional Amount"
              value={newNotionalAmount}
              onChange={(e) => setNewNotionalAmount(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {currency === '美元' ? 'USD' : 'HKD'}
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontWeight: '500' } }}
              placeholder="Enter new amount"
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
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Box>
        ) : step === 'success' ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              建立及下載建議書成功!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                onClick={handleManualDownload}
                variant="contained"
                sx={{ 
                  backgroundColor: '#10740AFF', 
                  '&:hover': { backgroundColor: '#0d5f08' } 
                }}
              >
                下載建議書
              </Button>
              <Button
                onClick={handleClose}
                variant="contained"
                sx={{ 
                  backgroundColor: '#10740AFF', 
                  '&:hover': { backgroundColor: '#0d5f08' } 
                }}
              >
                完成
              </Button>
            </Box>
          </Box>
        ) : null}
      </Paper>
    </Modal>
  );
}

export default Login;