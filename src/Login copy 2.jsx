import React, { useState } from 'react';
import axios from 'axios';

function Login({ processedData, inputs, numberOfYearAccMP }) {
  const [url, setUrl] = useState('https://api.hkprod.manulife.com.hk/ext/pos-qq-web-hkg-app/');
  const [username, setUsername] = useState('CHANTSZLUNG');
  const [password, setPassword] = useState('Ctsz_!376897');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  
  // New form states
  const [surname, setSurname] = useState('');
  const [givenName, setGivenName] = useState('');
  const [chineseName, setChineseName] = useState('');
  const [dob, setDob] = useState('');
  const [insuranceAge, setInsuranceAge] = useState('');
  const [gender, setGender] = useState('');
  const [isSmoker, setIsSmoker] = useState(false);
  const [isCorporateCustomer, setIsCorporateCustomer] = useState(false);
  const [isPolicyHolder, setIsPolicyHolder] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9000/login', {
        url,
        username,
        password,
        // Add new form data
        formData: {
          surname,
          givenName,
          chineseName,
          dob,
          insuranceAge,
          gender,
          isSmoker,
          isCorporateCustomer,
          isPolicyHolder
        }
      });
      setSessionId(response.data.session_id);
      setStep('otp');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:9000/verify-otp', {
        session_id: sessionId,
        otp,
        calculation_data: {
          processedData,
          inputs,
          totalAccumulatedMP: numberOfYearAccMP
        }
      });
      alert('Login and data submission successful!');
      setStep('login');
      // Reset form
      setUrl('');
      setUsername('');
      setPassword('');
      setOtp('');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <div className="main">
      <div className="main-content">
        {step === 'login' ? (
          <form onSubmit={handleLogin} className="customer-information-container">
            <div className="checkbox-corporate-customer">
              <label className="mdc-label">
                <input
                  type="checkbox"
                  checked={isCorporateCustomer}
                  onChange={(e) => setIsCorporateCustomer(e.target.checked)}
                />
                公司客戶
              </label>
            </div>

            <div className="margin-top-20 info-section">
              <div className="customer-title margin-bottom-20">擬受保人</div>
              
              <div className="radio-button margin-bottom-10">
                <label className="unit margin-right-30">受保人為保單持有人</label>
                <div className="mat-mdc-radio-group">
                  <label>
                    <input
                      type="radio"
                      name="policyHolder"
                      checked={isPolicyHolder}
                      onChange={() => setIsPolicyHolder(true)}
                    />
                    是
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="policyHolder"
                      checked={!isPolicyHolder}
                      onChange={() => setIsPolicyHolder(false)}
                    />
                    否
                  </label>
                </div>
              </div>

              <div className="customer-card-container">
                <div className="grid-layout customer-card-row">
                  <div className="name-field">
                    <label className="unit margin-unit">
                      英文姓氏 <span className="mandatory-tick">*</span>
                     
                    </label>
                    <input
                      type="text"
                      className="mat-mdc-input-element"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      required
                    />
                  </div>

                  <div className="name-field">
                    <label className="unit margin-unit">
                      英文名字 <span className="mandatory-tick">*</span>
                      
                    </label>
                    <input
                      type="text"
                      className="mat-mdc-input-element"
                      value={givenName}
                      onChange={(e) => setGivenName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="margin-top-10px grid-layout customer-card-row">
                  <div className="name-field">
                    <label className="unit margin-unit">中文姓名</label>
                    <input
                      type="text"
                      className="mat-mdc-input-element"
                      value={chineseName}
                      onChange={(e) => setChineseName(e.target.value)}
                      maxLength="10"
                    />
                  </div>

                  <div className="date-field">
                    <label className="unit margin-unit">出生日期</label>
                    <input
                      type="text"
                      className="mat-mdc-input-element"
                      placeholder="DD/MM/YYYY"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-layout customer-card-row">
                  <div className="insurance-age-field">
                    <label className="unit margin-unit">
                      投保年齡 <span className="mandatory-tick">*</span>
                     
                    </label>
                    <input
                      type="number"
                      className="mat-mdc-input-element"
                      value={insuranceAge}
                      onChange={(e) => setInsuranceAge(e.target.value)}
                      maxLength="2"
                      required
                    />
                  </div>
                </div>

                <div className="grid-layout customer-card-row">
                  <div className="gender-selection">
                    <label className="unit">
                      性別<span className="mandatory-tick">*</span>
                    </label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={gender === 'Male'}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        男
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={gender === 'Female'}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        女
                      </label>
                    </div>
                  </div>

                  <div className="smoker-selection">
                    <label className="unit">
                      您是否有吸煙習慣? <span className="mandatory-tick">*</span>
                      
                    </label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          name="smoker"
                          checked={isSmoker}
                          onChange={() => setIsSmoker(true)}
                        />
                        是
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="smoker"
                          checked={!isSmoker}
                          onChange={() => setIsSmoker(false)}
                        />
                        否
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login fields at bottom */}
              <div className="login-fields margin-top-20">
                <div className="grid-layout customer-card-row">
                  <div className="url-field">
                    <label className="unit margin-unit">
                      Website URL <span className="mandatory-tick">*</span>
                    </label>
                    <input
                      type="url"
                      className="mat-mdc-input-element"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid-layout customer-card-row">
                  <div className="username-field">
                    <label className="unit margin-unit">
                      Username <span className="mandatory-tick">*</span>
                    </label>
                    <input
                      type="text"
                      className="mat-mdc-input-element"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid-layout customer-card-row">
                  <div className="password-field">
                    <label className="unit margin-unit">
                      Password <span className="mandatory-tick">*</span>
                    </label>
                    <input
                      type="password"
                      className="mat-mdc-input-element"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid-layout customer-card-row">
                  <button 
                    type="submit" 
                    className="mdc-button mdc-button--raised" 
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Login'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="customer-information-container">
            <div className="margin-top-20 info-section">
              <div className="grid-layout customer-card-row">
                <div>
                  <label className="unit margin-unit">
                    OTP Verification <span className="mandatory-tick">*</span>
                    <span className="position-container">
                      <img 
                        src="assets/images/common/icon-tooltip.svg" 
                        alt="info" 
                        className="tooltip-icon"
                      />
                    </span>
                  </label>
                  <div className="mat-mdc-form-field full-width">
                    <input
                      type="text"
                      className="mat-mdc-input-element"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid-layout customer-card-row">
                <button 
                  type="submit" 
                  className="mdc-button mdc-button--raised" 
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Submit OTP'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;