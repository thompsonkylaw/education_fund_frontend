import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // Disable debug in production
    defaultNS: 'translation', // Set default namespace
    interpolation: {
      escapeValue: false, // React handles XSS
      defaultVariables: {
        // Fallbacks for interpolated values
        numberOfYears: 0,
        savingsPercentage: 0,
        savingsInMillions: 0,
        total: 0,
        count: 0,
        age: 0,
        value: '-',
        averageMonthly: 0,
      },
    },
    resources: {
      en: {
        translation: {
          
          welcome: 'Welcome',
          greeting: 'Hello, {{name}}!',
          Yearth: 'Year {{year}}',
          "Medical Financial Calculator": "Medical Financial Calculator",
          medicalTotal: '{{years}}th Year Medical Ins Total (HKD): {{total}}',
          Plan: 'Plan',
          'Plan Category': 'Plan Category',
          'Effective Date': 'Effective Date',
          Currency: 'Currency',
          Sexuality: 'Sexuality',
          Ward: 'Ward',
          'Plan Option': 'Plan Option',
          Age: 'Age',
          'Number of Year': 'Number of Year',
          Add: 'Add',
          Remove: 'Remove',
          'Add Second Plan': 'Add Second Plan',
          'Remove Second Plan': 'Remove Second Plan',
          Year: 'Year',
          Age: 'Age',
          'Medical Premium USD': 'Medical Premium(USD)',
          'Acc MP USD': 'Acc MP(USD)',
          'Acc MP': 'Acc MP(HKD)',
          login: {
            notioalAmountPlaceHolder: "Enter Notional Amount",
            notionalAmountError : 'Not Less Than USD$1500',
            title: 'PlanEasy - Login',
            surname: 'Surname',
            givenName: 'Given Name',
            chineseName: 'Chinese Name',
            insuranceAge: 'Insurance Age',
            gender: 'Gender',
            genderMale: 'Male',
            genderFemale: 'Female',
            smokingHabit: 'Do you have a smoking habit?',
            yes: 'Yes',
            no: 'No',
            basicPlan: 'Basic Plan',
            premiumPaymentPeriod: 'Premium Payment Period',
            currency: 'Currency',
            notionalAmount: 'Notional Amount',
            premiumPaymentMethod: 'Premium Payment Method',
            proposalLanguage: 'Proposal Language',
            languageZh: 'Traditional Chinese',
            languageSc: 'Simplified Chinese',
            languageEn: 'English',
            websiteUrl: 'Website URL',
            username: 'Username',
            password: 'Password',
            otpVerification: 'OTP Verification',
            loginButton: 'Login',
            submitOtpButton: 'Submit OTP',
            viewLogs: 'View Logs ({{count}})',
            systemMessage: 'System Message',
            newNotionalAmount: 'New Notional Amount',
            submitButton: 'Submit',
            completeButton: 'Complete',
            successMessage: 'Proposal successfully created and downloaded to PlanEasy system!'
          },
          useInflation: {
            title: 'PlanEasy',
            useInflationAdjustment: 'Use Inflation Adjustment',
            inflationRate: 'Inflation Rate (%)',
            currencyRate: 'Currency Rate'
          },
          outputForm1: {
            header: "Traditional Medical Premium",
            footer: "Total Cost: HKD $ {{total}}"
          },
          outputForm2: {
            header: "Medical Financing Premium",
            footer: "Total Cost: HKD $ {{total}}",
            firstRowValue: "First {{numberOfYears}} years average monthly HKD $ {{averageMonthly}}",
            placeholder: "Please complete login to get notional amount"
          },
          outputForm3: {
            ageLabel: "Age",
            accountValueLabel: "Account Value: HKD $",
            compareButton: "Compare Now",
            resetButton: "Reset Form",
            resetConfirmation: "Are you sure you want to reset the form? All inputs will be cleared."
          },
          common: {
            yearsOld: "years old",
            hkdZero: "HKD $ -"
          },
          comparisonPopup: {
            "title": "Manulife",
            "ageRange": "Age Range",
            "traditionalMedicalPremiumTable": "Traditional Medical Premium",
            "financingMedicalPremiumTable": "Financing Medical Premium",
            "page": "Page {{current}} of {{total}}",
            traditionalMedicalPremium: "Traditional Medical Premium",
            financingMedicalPremium: "Medical Financing Premium",
            howItWorks: "How does it work?",
            totalCost: "Total Cost: HKD $ {{total}}",
            accountValueAtAge: "Account Value at age {{age}}: HKD $ {{value}}",
            useHtml: "Use HTML",
            downloadReport: "Download Report",
            loadingFonts: "Fonts are loading, please wait",
            traditionalPoints: [ // Expected to be an array for .map usage
              "Purchase yearly, claim when hospitalized, waste money when not",
              "Premium increases yearly, cheaper when young",
              "Premium increases with age, expensive after retirement",
              "Consumable product"
            ],
            financingPoints: [ // Expected to be an array for .map usage
              "Only need {{numberOfYears}} years to complete lifetime medical protection",
              "Save {{savingsPercentage}}% on lifetime medical premium ${{savingsInMillions}} million",
              "Comprehensive lifetime medical protection up to age 100",
              "Claim when needed, save when not, account value increases over time"
            ]
          }
        }
      },
      "zh-HK": {
        translation: {
          welcome: '歡迎',
          greeting: '你好, {{name}}!',
          Yearth: '第{{year}}年',
          "Medical Financial Calculator": "醫療融資計算機",
          medicalTotal: '第{{years}}年醫療保險總額（港元）：{{total}}',
          Plan: '計劃',
          'Plan Category': '計劃類別',
          'Effective Date': '生效日期',
          Currency: '貨幣',
          Sexuality: '性別',
          Ward: '病房',
          'Plan Option': '計劃選項',
          Age: '年齡',
          'Number of Year': '年數',
          Add: '添加',
          Remove: '移除',
          'Add Second Plan': '添加第二個計劃',
          'Remove Second Plan': '移除第二個計劃',
          Year: '年',
          Age: '年齡',
          'Medical Premium USD': '醫療保費(美元)',
          'Acc MP USD': '累積醫療保費(美元)',
          'Acc MP': '累積醫療保費(港元)',
          login: {
            notioalAmountPlaceHolder: "輸入名義金額",
            notionalAmountError : '不能少於 USD$1500',
            title: '計劃易 - 登錄',
            surname: '英文姓氏',
            givenName: '英文名字',
            chineseName: '中文姓名',
            insuranceAge: '投保年齡',
            gender: '性別',
            genderMale: '男',
            genderFemale: '女',
            smokingHabit: '您是否有吸煙習慣?',
            yes: '是',
            no: '否',
            basicPlan: '基本計劃',
            premiumPaymentPeriod: '保費繳付期',
            currency: '貨幣',
            notionalAmount: '名義金額',
            premiumPaymentMethod: '保費繳付方式',
            proposalLanguage: '建議書語言',
            languageZh: '繁體中文',
            languageSc: '簡體中文',
            languageEn: '英文',
            websiteUrl: '網站 URL',
            username: '用戶名',
            password: '密碼',
            otpVerification: 'OTP 驗證',
            loginButton: '登錄',
            submitOtpButton: '提交 OTP',
            viewLogs: '查看日誌 ({{count}})',
            systemMessage: '系統信息',
            newNotionalAmount: '新名義金額',
            submitButton: '提交',
            completeButton: '完成',
            successMessage: '建議書已成功建立及下載到計劃易系統中!'
          },
          useInflation: {
            title: '計劃易',
            useInflationAdjustment: '使用通脹調整',
            inflationRate: '通脹率 (%)',
            currencyRate: '匯率'
          },
          outputForm1: {
            header: "傳統醫療保費",
            footer: "總成本: HKD $ {{total}}"
          },
          outputForm2: {
            header: "醫療融資保費",
            footer: "總成本: HKD $ {{total}}",
            firstRowValue: "首{{numberOfYears}}年平均每月 HKD $ {{averageMonthly}}",
            placeholder: "請先完成登錄以獲取名義金額"
          },
          outputForm3: {
            ageLabel: "歲",
            accountValueLabel: "戶口價值: HKD $",
            compareButton: "馬上比較",
            resetButton: "重設表單",
            resetConfirmation: "確定要重設表單嗎？所有輸入將被清除。"
          },
          common: {
            yearsOld: "歲",
            hkdZero: "HKD $ -"
          },
          comparisonPopup: {
            "title": "Manulife 宏利",
    "ageRange": "年齡範圍",
    "traditionalMedicalPremiumTable": "傳統醫療保費",
    "financingMedicalPremiumTable": "醫療融資保費",
    "page": "頁面 {{current}}/{{total}}",
            traditionalMedicalPremium: "傳統醫療保費",
            financingMedicalPremium: "醫療融資保費",
            howItWorks: "實際操作 How does it work?",
            totalCost: "總成本: HKD $ {{total}}",
            accountValueAtAge: "{{age}} 歲戶口價值: HKD $ {{value}}",
            useHtml: "使用 HTML",
            downloadReport: "下載報告",
            loadingFonts: "字體正在加載中，請稍後再試",
            traditionalPoints: [ // Expected to be an array for .map usage
              "逐年購買，住院賠錢，無事洗錢",
              "年年加價，年輕時保費便宜",
              "年長時保費遞增，退休後保費高昂",
              "消費性產品"
            ],
            financingPoints: [ // Expected to be an array for .map usage
              "只需{{numberOfYears}}年完成終生醫療保衛",
              "節省{{savingsPercentage}}%終身醫療保費${{savingsInMillions}}萬",
              "全面終身醫療保障至100歲",
              "有事賠錢，無事儲錢，戶口長期增值"
            ]
          }
        }
      },
      "zh-CN": {
        translation: {
          welcome: '欢迎',
          greeting: '你好, {{name}}!',
          Yearth: '第{{year}}年',
          "Medical Financial Calculator": "医疗融资计算器",
          medicalTotal: '第{{years}}年医疗保险总额（港元）：{{total}}',
          Plan: '计划',
          'Plan Category': '计划类别',
          'Effective Date': '生效日期',
          Currency: '货币',
          Sexuality: '性别',
          Ward: '病房',
          'Plan Option': '计划选项',
          Age: '年龄',
          'Number of Year': '年数',
          Add: '添加',
          Remove: '移除',
          'Add Second Plan': '添加第二个计划',
          'Remove Second Plan': '移除第二个计划',
          Year: '年',
          Age: '年龄',
          'Medical Premium USD': '医疗保费(美元)',
          'Acc MP USD': '累积医疗保费(美元)',
          'Acc MP': '累积医疗保费(港元)',
          login: {
            notioalAmountPlaceHolder: "输入名义金额",
            notionalAmountError : '不能少於 USD$1500',
            title: '计划易 - 登录',
            surname: '英文姓氏',
            givenName: '英文名字',
            chineseName: '中文姓名',
            insuranceAge: '投保年龄',
            gender: '性别',
            genderMale: '男',
            genderFemale: '女',
            smokingHabit: '您是否有吸烟习惯?',
            yes: '是',
            no: '否',
            basicPlan: '基本计划',
            premiumPaymentPeriod: '保费缴付期',
            currency: '货币',
            notionalAmount: '名义金额',
            premiumPaymentMethod: '保费缴付方式',
            proposalLanguage: '建议书语言',
            languageZh: '繁体中文',
            languageSc: '简体中文',
            languageEn: '英文',
            websiteUrl: '网站 URL',
            username: '用户名',
            password: '密码',
            otpVerification: 'OTP 验证',
            loginButton: '登录',
            submitOtpButton: '提交 OTP',
            viewLogs: '查看日志 ({{count}})',
            systemMessage: '系统信息',
            newNotionalAmount: '新名义金额',
            submitButton: '提交',
            completeButton: '完成',
            successMessage: '建议书已成功建立及下载到计划易系统中!'
          },
          useInflation: {
            title: '计划易',
            useInflationAdjustment: '使用通胀调整',
            inflationRate: '通胀率 (%)',
            currencyRate: '汇率'
          },
          outputForm1: {
            header: "传统医疗保费",
            footer: "总成本: HKD $ {{total}}"
          },
          outputForm2: {
            header: "医疗融资保费",
            footer: "总成本: HKD $ {{total}}",
            firstRowValue: "首{{numberOfYears}}年平均每月 HKD $ {{averageMonthly}}",
            placeholder: "请先完成登录以获取名义金额"
          },
          outputForm3: {
            ageLabel: "岁",
            accountValueLabel: "户口价值: HKD $",
            compareButton: "马上比较",
            resetButton: "重设表单",
            resetConfirmation: "确定要重设表单吗？所有输入将被清除。"
          },
          common: {
            yearsOld: "岁",
            hkdZero: "HKD $ -"
          },
          comparisonPopup: {
            "title": "Manulife 宏利",
    "ageRange": "年龄范围",
    "traditionalMedicalPremiumTable": "传统医疗保费",
    "financingMedicalPremiumTable": "医疗融资保费",
    "page": "页面 {{current}}/{{total}}",
            traditionalMedicalPremium: "传统医疗保费",
            financingMedicalPremium: "医疗融资保费",
            howItWorks: "实际操作 How does it work?",
            totalCost: "总成本: HKD $ {{total}}",
            accountValueAtAge: "{{age}} 岁户口价值: HKD $ {{value}}",
            useHtml: "使用 HTML",
            downloadReport: "下载报告",
            loadingFonts: "字体正在加载中，请稍后再试",
            traditionalPoints: [ // Expected to be an array for .map usage
              "逐年购买，住院赔钱，无事洗钱",
              "年年加价，年轻时保费便宜",
              "年长时保费递增，退休后保费高昂",
              "消费性产品"
            ],
            financingPoints: [ // Expected to be an array for .map usage
              "只需{{numberOfYears}}年完成终生医疗保卫",
              "节省{{savingsPercentage}}%终生医疗保费${{savingsInMillions}}万",
              "全面终生医疗保障至100岁",
              "有事赔钱，无事储钱，户口长期增值"
            ]
          }
        }
      }
    }
  });

export default i18next;