مشروع التخرج: عقد شراكة إسلامي (Sharaka)

وصف المشروع وفكرته



مشروع "Sharaka" هو عقد ذكي على بلوكشين إيثيريوم لتمويل المشاريع. يسمح العقد بجمع الاستثمارات من المستثمرين وتوزيع الأرباح بنسبة 70% للمستثمرين و30% لمالك المنصة. يتميز المشروع بأنه:

يستخدم نظام المشاركة في الأرباح والخسائر

يوفر شفافية كاملة في توزيع الأرباح

يمنح المستثمرين تحكماً كاملاً في سحب أرباحهم



هيكل الملفات والمجلدات


BLOKKAT-ARABIC-BLOCKCHAIN-DEVELOPER-BOOTCAMP-GRADUATION-PROJECT/
├── contracts/                   # العقود الذكية (مشروع Foundry)
│   ├── src/
│   │   ├
│   │   └── sharaka.sol          # العقد الرئيسي للمشروع
│   ├── test/
│   │   ├  
│   │   └── sharaka.t.sol        # اختبارات العقد الرئيسي
│   ├── script/                  # نصوص النشر
│   ├── foundry.toml             # إعدادات Foundry
│   ├── .env                     # متغيرات البيئة
│   └── .gitignore
│
├── frontend/                    # تطبيق الواجهة الأمامية (Next.js)
│   ├── app/
│   │   ├── globals.css          # الأنماط العامة
│   │   ├── layout.jsx           # تخطيط الصفحة
│   │   └── page.jsx             # الصفحة الرئيسية
│   ├── components/
│   │   └── WalletConnectButton.js # زر توصيل المحفظة
│   ├── config/
│   │   └── wagmi.js             # إعدادات Wagmi
│   ├── contract/
│   │   ├── abi.json             # واجهة العقد الذكي (ABI)
│   │   └── contract.js          # عنوان العقد
│   ├── public/
│   │   └── favicon.ico          # أيقونة الموقع
│   ├── .gitignore
│   ├── jsconfig.json            # إعدادات JavaScript
│   ├── next.config.mjs          # إعدادات Next.js
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs       # إعدادات PostCSS
│   └── README.md
│
├── .github/                     # إعدادات GitHub (اختياري)
├── cache/                       # ذاكرة Foundry المؤقتة
├── out/                         # مخرجات العقود المترجمة
├── README.md                    # ملف التعليمات الرئيسي
└── .gitignore                



Design Patterns


1. نموذج المالك (Ownable Pattern)
استخدمته لتحديد صلاحية مالك العقد والتنفيذذ كان في الكود التالى

modifier onlyOwner() {
    require(msg.sender == _owner, "Not contract owner");
    _;
}

function distributeProfits() external payable onlyOwner { ... }

2. نمط سحب المدفوعات (Pull Payments Pattern)
استخدمته من اجل السماح للمسثمر بسحب ارباحهم بدل دفعها بشكل تلقائي

mapping(address => uint256) public profits;

function withdrawProfits() external nonReentrant {
    uint256 amount = profits[msg.sender];
    require(amount > 0, "No profits to withdraw");
    profits[msg.sender] = 0;
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}



Security Measures


1. الحماية من إعادة الدخول (Reentrancy Guard)
استخدمته لمنع هجمات اعادة للدخول (تقوم باستنزاف امزال العقد)

modifier nonReentrant() {
    require(!_locked, "No reentrancy");
    _locked = true;
    _;
    _locked = false;
}

function withdrawProfits() external nonReentrant { ... }

2. نموذج الفحوصات-التأثيرات-التفاعلات (Checks-Effects-Interactions)
استخدمته لمنع الثغرات الأمنية من خلال ترتيب عمليات السحب

function withdrawProfits() external nonReentrant {
    // 1. الفحص (Check)
    uint256 amount = profits[msg.sender];
    require(amount > 0, "No profits to withdraw");
    
    // 2. التأثير (Effect)
    profits[msg.sender] = 0;
    
    // 3. التفاعل (Interaction)
    (bool success, ) = msg.s.sender.call{value: amount}("");
    require(success, "Transfer failed");
}


Important Links & Addresses

1.عنوان العقد على شبكة الإختبار هو
0x06dDC1E3858DFa5C1110C21f192d0f57a50bD752

2.https://sepolia.scrollscan.com/address/0x06dDC1E3858DFa5C1110C21f192d0f57a50bD752



3.الفيديو الخاص بالمشروع
https://drive.google.com/file/d/1Bk1zUotXTRrDgkrwlyQA1v_xsgroU4Qr/view?usp=sharing


4.رابط الموقع بعد النشر(استضافة)
https://muhammetgazel.github.io/blokkat-arabic-blockchain-developer-bootcamp-graduation-project/







تشغيل الاختبارات

الامر لتشغيل المشروع بعد الانتقال لمجلد المشروع  هو
forge test -vvv

الاختبارات المتوفرة:
testGetInvestorCount(): يختبر حساب عدد المستثمرين

testInvestment(): يختبر عملية الاستثمار

testOnlyOwnerCanDistribute(): يختبر صلاحيات توزيع الأرباح

testProfitDistribution(): يختبر آلية توزيع الأرباح

testWithdrawProfits(): يختبر عملية سحب الأرباح

testReentrancyProtection(): يختبر الحماية من هجمات إعادة الدخول

How to Run the Program

طبعا من اجل تشغيل التطبيق محليا يجب تثبيت  التبعيات داخل مجلد البرنامج ثم اضافة النتغيرات التالية داخل ملف .env 

NEXT_PUBLIC_SCROLL_SEPOLIA_URL=https://sepolia-rpc.scroll.io
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
ثم تشغيل التطبيق من خلال الامر
npm run dev
