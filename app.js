// ═══════════════════════════════════════════════════
//  NAGARIK APP — app.js v2.0
//  Full service catalog from services_tree.md
// ═══════════════════════════════════════════════════

// ─── User Data ───────────────────────────────────
const userData = {
    name: "Prabin Shrestha",
    nid: "983-472-810-5",
    citizenshipNo: "27-01-75-08421",
    licenseNo: "094-82749-10",
    panNo: "609483721",
    passportNo: "N1294830",
    ssfNo: "SSF-8392-472",
    avatar: "avatar.jpg",
    ssfBalance: "रू. 1,45,280.50",
    ssfBalanceRaw: 145280.50,
    ssfTarget: 200000,
    lastContribution: "July 2026",
    applications: [
        { id: "PCC-4821", name: "Police Clearance Certificate", date: "2026-07-15", status: "Approved",  icon: "fa-shield-halved",   color: "var(--emerald-600)" },
        { id: "NOC-3311", name: "No Objection Cert. (Australia)", date: "2026-07-20", status: "Pending",  icon: "fa-graduation-cap", color: "var(--amber-600)"   },
        { id: "PSP-0091", name: "e-Passport Renewal",            date: "2026-07-10", status: "In Review", icon: "fa-passport",        color: "var(--blue-600)"    },
    ],
    permissions: [
        { entity: "Nabil Bank Ltd",            purpose: "KYC Verification",                    fields: "Citizenship No., National ID",         active: true  },
        { entity: "Ministry of Education",     purpose: "NOC Document Verification",           fields: "Academic Certs, Citizenship",           active: true  },
        { entity: "Nepal Telecom (NTC)",        purpose: "e-SIM Registration",                 fields: "Citizenship, Photo",                    active: false },
        { entity: "Social Security Fund (SSF)", purpose: "Employer Contribution Verification", fields: "PAN, SSF No., Employment Status",       active: true  },
        { entity: "Inland Revenue Dept (IRD)", purpose: "Tax Return Cross-Reference",          fields: "PAN, Income Declaration",               active: true  },

    ],
    notifications: [
        { title: "Police Clearance Approved ✅",     body: "Your PCC has been digitally signed and is ready for download.",     time: "2 hours ago",   icon: "fa-shield-halved",   iconBg: "var(--emerald-100)", iconColor: "var(--emerald-600)", unread: true  },
        { title: "Hello Sarkar — Case #HS-8290 📩",  body: "Your streetlight grievance has been forwarded to municipality.",     time: "1 day ago",     icon: "fa-comment-dots",    iconBg: "var(--purple-100)", iconColor: "var(--purple-600)", unread: false },
        { title: "SSF Contribution Deposited 💰",    body: "Employer deposited रू. 6,800 to your SSF account for July 2026.",   time: "Jul 15, 2026",  icon: "fa-vault",           iconBg: "var(--blue-100)",   iconColor: "var(--blue-600)",   unread: false },
        { title: "Passport Application Update 🛂",   body: "e-Passport renewal (PSP-0091) is under security clearance review.", time: "Jul 12, 2026",  icon: "fa-passport",        iconBg: "var(--amber-100)",  iconColor: "var(--amber-600)",  unread: false },
    ]
};

// ─── FULL SERVICE CATALOG (from services_tree.md) ─
const ALL_SERVICES = [
    // ── DIGITAL IDENTITY & LEGAL DOCUMENTS ──
    { id: "pcc",            name: "Police Clearance Certificate",         nameNp: "प्रहरी चारित्र्य प्रमाणपत्र",  cat: "Identity",    ministry: "Nepal Police Headquarter", icon: "fa-shield-halved",      iconCls: "svc-blue",   online: "🌐", modalId: "modal-pcc"     },
    { id: "nid",            name: "National ID Pre-enrollment",           nameNp: "राष्ट्रिय परिचयपत्र पूर्व–दर्ता", cat: "Identity",    ministry: "DoNIDCR Civil Reg.",  icon: "fa-id-card",            iconCls: "svc-purple", online: "🔀", modalId: null            },
    { id: "citizenship",    name: "Citizenship Certificate",              nameNp: "नागरिकता प्रमाणपत्र",            cat: "Identity",    ministry: "District Admin Office (DAO)", icon: "fa-address-card", iconCls: "svc-blue", online: "📝", modalId: null            },
    { id: "duplicate-cit",  name: "Duplicate Citizenship (Pratilipi)",    nameNp: "नागरिकताको प्रतिलिपि",            cat: "Identity",    ministry: "District Admin Office (DAO)", icon: "fa-copy",         iconCls: "svc-slate",  online: "📝", modalId: null            },
    { id: "vital-event",    name: "Vital Event Registration (Birth/Death/Marriage)", nameNp: "व्यक्तिगत घटना दर्ता", cat: "Identity", ministry: "Ward Office (वडा कार्यालय)", icon: "fa-baby", iconCls: "svc-green", online: "🔀", modalId: null },
    { id: "address-cert",   name: "Address & Residence Verification",      nameNp: "बासस्थान प्रमाणित सिफारिस",       cat: "Identity",    ministry: "Ward Office (वडा कार्यालय)", icon: "fa-location-dot",  iconCls: "svc-sky",    online: "🌐", modalId: null            },
    { id: "ward-character", name: "Ward Character Certificate",           nameNp: "वडा चारित्र्य सिफारिस",           cat: "Identity",    ministry: "Ward Office (वडा कार्यालय)", icon: "fa-user-check",    iconCls: "svc-emerald",online: "🌐", modalId: null            },
    { id: "voter",          name: "Voter Registration & Biometrics",      nameNp: "मतदाता दर्ता",                    cat: "Identity",    ministry: "Election Commission Nepal", icon: "fa-person-booth",iconCls: "svc-rose",   online: "🔀", modalId: null            },
    { id: "voter-check",    name: "Check Voter Card & Polling Center",   nameNp: "मतदाता केन्द्र जाँच",             cat: "Identity",    ministry: "Election Commission Nepal", icon: "fa-location-pin", iconCls: "svc-rose",   online: "🌐", modalId: null            },
    { id: "voter-update",   name: "Voter List Update & Address Transfer", nameNp: "मतदाता नामावली अद्यावधिक र सरुवा", cat: "Identity",   ministry: "Election Commission Nepal", icon: "fa-user-pen",      iconCls: "svc-blue",   online: "🔀", modalId: null            },
    { id: "cyber-crime",    name: "Online Crime & Cybercrime Reporting",  nameNp: "साइबर अपराध रिपोर्ट",            cat: "Identity",    ministry: "Nepal Police Cyber Bureau", icon: "fa-bug-slash",    iconCls: "svc-red",    online: "🌐", modalId: null            },
    { id: "pension-card",   name: "Civil Service Pension Card (Nivruttibharan)", nameNp: "निवृतिभरण अधिकारपत्र (पेन्सन पट्टा)", cat: "Identity", ministry: "Department of Civil Personnel Records", icon: "fa-person-cane", iconCls: "svc-purple", online: "🔀", modalId: null },

    // ── LICENSING, TRANSPORT & MOBILITY ──
    { id: "driving",        name: "Smart Driving License Exam Booking",   nameNp: "सवारी चालक अनुमतिपत्र",          cat: "Transport",   ministry: "Dept. of Transport Mgmt (DoTM)", icon: "fa-car",     iconCls: "svc-sky",    online: "🔀", modalId: null            },
    { id: "license-renew",  name: "Driving License Renewal Application",  nameNp: "लाइसेन्स नवीकरण",                cat: "Transport",   ministry: "Dept. of Transport Mgmt (DoTM)", icon: "fa-rotate",  iconCls: "svc-sky",    online: "🔀", modalId: null            },
    { id: "license-print-track", name: "License Smart Card Print Status", nameNp: "लाइसेन्स छपाई स्थिति र ट्र्याकिङ",   cat: "Transport",   ministry: "Dept. of Transport Mgmt (DoTM)", icon: "fa-print",   iconCls: "svc-emerald", online: "🌐", modalId: null         },
    { id: "vehicle-tax",    name: "Vehicle Tax & Bluebook Renewal",       nameNp: "गाडी कर र ब्लुबुक नवीकरण",         cat: "Transport",   ministry: "Transport Office / DoTM", icon: "fa-car-side",        iconCls: "svc-amber",  online: "🔀", modalId: "modal-pay-utility" },
    { id: "number-plate",   name: "Embossed Number Plate Registration",   nameNp: "एम्बसड् नम्बर प्लेट",            cat: "Transport",   ministry: "Dept. of Transport Mgmt (DoTM)", icon: "fa-rectangle-list", iconCls: "svc-slate", online: "🔀", modalId: null            },
    { id: "drone",          name: "Drone Registration & Flight Permit",   nameNp: "ड्रोन दर्ता तथा अनुमति",           cat: "Transport",   ministry: "Civil Aviation Authority (CAAN)", icon: "fa-satellite", iconCls: "svc-purple", online: "🔀", modalId: null          },
    { id: "public-transit", name: "Public Transit Card & Route Mapping",  nameNp: "सार्वजनिक यातायात कार्ड र रुट",     cat: "Transport",   ministry: "Municipal Transport Authority", icon: "fa-bus",       iconCls: "svc-blue",   online: "🌐", modalId: null            },
    { id: "city-parking",   name: "City Parking Locator & Permit Renewal",nameNp: "स्मार्ट पार्किङ तथा अनुमति",        cat: "Transport",   ministry: "Metropolitan Traffic Police", icon: "fa-square-parking", iconCls: "svc-slate", online: "🌐", modalId: null          },

    // ── LEGAL, COURTS & NOTARY ──
    { id: "notary",         name: "Notary Public Document Verification",  nameNp: "नोटरी पब्लिक कागजात प्रमाणीकरण",   cat: "Legal",       ministry: "Nepal Notary Public Council", icon: "fa-stamp",      iconCls: "svc-amber",  online: "🌐", modalId: null            },
    { id: "translation",    name: "Official Document Translation Service",nameNp: "आधिकारिक कागजात अनुवाद सिफारिस", cat: "Legal",       ministry: "Law Books Management Board", icon: "fa-language",   iconCls: "svc-blue",   online: "🌐", modalId: null            },
    { id: "e-attestation",  name: "Consular Document e-Attestation",      nameNp: "कन्सुलर प्रमाणीकरण (e-Attestation)",cat: "Legal",       ministry: "Department of Consular Services", icon: "fa-file-shield", iconCls: "svc-purple", online: "🌐", modalId: null       },
    { id: "court-cases",    name: "Supreme & District Court Cases & Cause List", nameNp: "अदालतको मुद्दा ट्र्याकिङ र पेसी सूची", cat: "Legal", ministry: "Supreme Court of Nepal", icon: "fa-gavel",       iconCls: "svc-rose",   online: "🌐", modalId: null            },
    { id: "efiling-waris",  name: "Court e-Filing & Power of Attorney (Warisnama)", nameNp: "ई-फाइलिङ तथा वारेसनामा दर्ता", cat: "Legal", ministry: "Office of Attorney General", icon: "fa-file-signature", iconCls: "svc-sky", online: "🔀", modalId: null        },
    { id: "dsc",            name: "Digital Signature Certificate (DSC)",  nameNp: "डिजिटल हस्ताक्षर (DSC)",          cat: "Legal",       ministry: "Controller of Certifying Authorities", icon: "fa-signature", iconCls: "svc-emerald", online: "🌐", modalId: null        },
    { id: "notary-verify",  name: "Verify Notary Public Practitioner",   nameNp: "नोटरी कानून व्यवसायी जाँच",        cat: "Legal",       ministry: "Nepal Notary Public Council", icon: "fa-user-shield", iconCls: "svc-slate", online: "🌐", modalId: null          },

    // ── TAXATION, FINANCIAL & CUSTOMS ──
    { id: "pan",            name: "Personal PAN Registration",            nameNp: "स्थायी लेखा नम्बर दर्ता",         cat: "Finance",     ministry: "Inland Revenue Dept (IRD)", icon: "fa-hashtag",      iconCls: "svc-amber",  online: "🌐", modalId: null            },
    { id: "tax-return",     name: "Income Tax Return Filing (D1/D2)",     nameNp: "आयकर विवरण भरौट",                 cat: "Finance",     ministry: "Inland Revenue Dept (IRD)", icon: "fa-file-invoice", iconCls: "svc-amber",  online: "🌐", modalId: null            },
    { id: "tax-clearance",  name: "Online Tax Clearance Certificate",     nameNp: "कर चुक्ता प्रमाणपत्र",            cat: "Finance",     ministry: "Inland Revenue Dept (IRD)", icon: "fa-receipt",      iconCls: "svc-green",  online: "🌐", modalId: null            },
    { id: "exim",           name: "EXIM Import-Export Code Registration", nameNp: "आयात–निर्यात (EXIM) कोड दर्ता",   cat: "Finance",     ministry: "Department of Customs", icon: "fa-ship",            iconCls: "svc-sky",    online: "🌐", modalId: null            },
    { id: "revenue",        name: "Government Revenue e-Payment (FCGO)",  nameNp: "सरकारी राजस्व भुक्तानी",          cat: "Finance",     ministry: "FCGO Revenue Portal", icon: "fa-money-bill-wave", iconCls: "svc-green",  online: "🌐", modalId: null            },
    { id: "ssf-check",      name: "Social Security Contribution Account", nameNp: "सामाजिक सुरक्षा कोष",             cat: "Finance",     ministry: "Social Security Fund (SSF)", icon: "fa-vault",       iconCls: "svc-blue",   online: "🌐", modalId: null            },
    { id: "nea-pay",        name: "Electricity Bill Payment (NEA)",       nameNp: "बिजुली महसुल भुक्तानी",            cat: "Finance",     ministry: "Nepal Electricity Authority", icon: "fa-bolt",      iconCls: "svc-red",    online: "🌐", modalId: "modal-pay-utility" },
    { id: "khanepani-pay",  name: "Khanepani Drinking Water Bill",        nameNp: "खानेपानी महसुल भुक्तानी",          cat: "Finance",     ministry: "KUKL / Water Supply Dept", icon: "fa-droplet",        iconCls: "svc-sky",    online: "🌐", modalId: "modal-pay-utility" },

    // ── TRAVEL, PASSPORT & FOREIGN EXCHANGE ──
    { id: "passport",       name: "e-Passport Pre-Enrollment Application",nameNp: "ई-राहदानी दर्ता दरखास्त",           cat: "Travel",      ministry: "Department of Passport (DoP)", icon: "fa-passport", iconCls: "svc-purple", online: "🔀", modalId: null            },
    { id: "passport-track", name: "Passport Status & Dispatch Tracking",  nameNp: "राहदानी स्थिति तथा डिस्प्याच ट्र्याक", cat: "Travel",   ministry: "Department of Passport (DoP)", icon: "fa-magnifying-glass", iconCls: "svc-sky", online: "🌐", modalId: null            },
    { id: "visa-ext",       name: "Tourist & Business Visa Extension",    nameNp: "पर्यटक तथा व्यापारिक भिसा नवीकरण", cat: "Travel",      ministry: "Department of Immigration", icon: "fa-plane",        iconCls: "svc-blue",   online: "🌐", modalId: null            },
    { id: "forex-rates",    name: "NRB Foreign Exchange Rates & Currency",nameNp: "विदेशी विनिमय दर तथा मनी एक्सचेञ्ज", cat: "Travel",     ministry: "Nepal Rastra Bank (NRB Forex)", icon: "fa-money-bill-transfer", iconCls: "svc-green", online: "🌐", modalId: null    },
    { id: "trek-permit",    name: "Restricted Area Trekking Permit",      nameNp: "प्रतिबन्धित क्षेत्र पदयात्रा अनुमति",  cat: "Travel",      ministry: "Department of Immigration", icon: "fa-mountain-sun", iconCls: "svc-green",  online: "🔀", modalId: null            },
    { id: "repatriation",   name: "Citizen Rescue & Repatriation Abroad", nameNp: "नागरिक उद्धार तथा कन्सुलर राहत",     cat: "Travel",      ministry: "Dept. of Consular Services", icon: "fa-helicopter",   iconCls: "svc-rose",   online: "🌐", modalId: null            },
    { id: "mountaineer",    name: "Mountaineering Expedition Permit",     nameNp: "पर्वतारोहण अनुमतिपत्र",            cat: "Travel",      ministry: "Department of Tourism", icon: "fa-flag",            iconCls: "svc-slate",  online: "🔀", modalId: null            },

    // ── PUBLIC HEALTH & MEDICAL SERVICES ──
    { id: "vaccine",        name: "Immunization Vaccine QR Certificate",  nameNp: "खोप प्रमाणपत्र",                  cat: "Health",      ministry: "Department of Health Services", icon: "fa-syringe", iconCls: "svc-green",  online: "🌐", modalId: null            },
    { id: "health-ins",     name: "Health Insurance Card Enrollment",     nameNp: "स्वास्थ्य बिमा दर्ता",            cat: "Health",      ministry: "Health Insurance Board (HIB)", icon: "fa-heart-pulse", iconCls: "svc-rose", online: "🔀", modalId: null            },
    { id: "clinic-booking", name: "Public Hospital & Clinic Specialist Booking", nameNp: "सरकारी अस्पताल ओपिडी टिकेट", cat: "Health", ministry: "Department of Health Services", icon: "fa-user-doctor", iconCls: "svc-blue", online: "🌐", modalId: null         },
    { id: "organ-donation", name: "Organ Donation Consent Registry",     nameNp: "अंगदान मञ्जुरी दर्ता",             cat: "Health",      ministry: "Human Organ Transplant Centre", icon: "fa-hand-holding-medical", iconCls: "svc-rose", online: "🌐", modalId: null },
    { id: "social-sec",     name: "Senior/Disability Allowance Registration", nameNp: "सामाजिक सुरक्षा भत्ता दर्ता",  cat: "Health",      ministry: "Department of Social Security", icon: "fa-hand-holding-heart", iconCls: "svc-rose", online: "🔀", modalId: null          },

    // ── EDUCATION, BOARD EXAMS & ACADEMICS ──
    { id: "see-neb",        name: "SEE Class 10 Board Result & Marksheet",nameNp: "एस.इ.इ. नतिजा तथा लब्धाङ्क पत्र",    cat: "Education",   ministry: "National Examinations Board (NEB)", icon: "fa-file-lines", iconCls: "svc-green", online: "🌐", modalId: null       },
    { id: "neb-12",         name: "+2 / Class 12 NEB Transcript Certificate", nameNp: "कक्षा १२ ट्रान्सक्रिप्ट र माइग्रेसन", cat: "Education", ministry: "National Examinations Board (NEB)", icon: "fa-graduation-cap", iconCls: "svc-purple", online: "🌐", modalId: null   },
    { id: "tu-degree",      name: "TU University Degree & Transcript Verify", nameNp: "त्रिभुवन विश्वविद्यालय उपाधि प्रमाणीकरण", cat: "Education", ministry: "Tribhuvan University (TU)", icon: "fa-building-columns", iconCls: "svc-blue", online: "🌐", modalId: null },
    { id: "ctevt",          name: "CTEVT Technical Diploma & Skill Certificate", nameNp: "CTEVT डिप्लोमा तथा सीप प्रमाणपत्र", cat: "Education", ministry: "CTEVT Nepal", icon: "fa-award", iconCls: "svc-amber", online: "🌐", modalId: null },
    { id: "noc",            name: "Abroad Study NOC Application",         nameNp: "विदेश अध्ययन अनुमति (NOC)",        cat: "Education",   ministry: "Ministry of Education (NOC Sec)", icon: "fa-plane-departure", iconCls: "svc-purple", online: "🌐", modalId: "modal-noc" },
    { id: "equivalency",    name: "Academic Degree Equivalency Certificate", nameNp: "समकक्षता प्रमाणपत्र",          cat: "Education",   ministry: "Curriculum Development Centre", icon: "fa-certificate", iconCls: "svc-sky", online: "🔀", modalId: null            },
    { id: "school-enroll",  name: "Public School Centralized Enrollment", nameNp: "विद्यालय भर्ना आवेदन",             cat: "Education",   ministry: "Education & Human Resource Dept", icon: "fa-school", iconCls: "svc-green", online: "🌐", modalId: null          },
    { id: "lok-sewa",       name: "Lok Sewa Job Application Portal",      nameNp: "लोक सेवा आयोग दरखास्त",           cat: "Education",   ministry: "Public Service Commission", icon: "fa-pencil",      iconCls: "svc-blue",   online: "🌐", modalId: null            },
    { id: "lok-sewa-res",   name: "Lok Sewa Exam Results & Schedule",     nameNp: "लोक सेवा परीक्षा नतिजा",          cat: "Education",   ministry: "Public Service Commission", icon: "fa-chart-bar",   iconCls: "svc-green",  online: "🌐", modalId: null            },
    { id: "army-recruit",   name: "Nepalese Army Online Recruitment",     nameNp: "नेपाली सेना भर्ना आवेदन",          cat: "Education",   ministry: "Nepalese Army Headquarters", icon: "fa-shield",     iconCls: "svc-slate",  online: "🔀", modalId: null            },
    { id: "shram",          name: "Foreign Labor Permit (Shram Suwikriti)",nameNp:"श्रम स्वीकृति (FEIMS)",             cat: "Employment",  ministry: "Dept. of Foreign Employment", icon: "fa-plane-arrival", iconCls: "svc-sky", online: "🌐", modalId: null            },
    { id: "pmep",           name: "Prime Minister Employment Registration",nameNp:"रोजगार कार्यक्रम (PMEP)",           cat: "Employment",  ministry: "Prime Minister Employment Prog", icon: "fa-briefcase", iconCls: "svc-amber", online: "🔀", modalId: null            },

    // ── SAFETY, JUSTICE, GRIEVANCE & PASSES ──
    { id: "emergency-alert",name: "Disaster Alert & Emergency Broadcast",nameNp: "आपतकालीन विपद् चेतावनी",        cat: "Grievance",   ministry: "National Disaster Risk Mgmt (NDRRMA)", icon: "fa-triangle-exclamation", iconCls: "svc-red", online: "🌐", modalId: null },
    { id: "grievance",      name: "Hello Sarkar — Lodge Citizen Grievance",nameNp: "हेलो सरकार उजुरी",               cat: "Grievance",   ministry: "Hello Sarkar Public Redress", icon: "fa-comment-dots", iconCls: "svc-rose", online: "🌐", modalId: "modal-grievance"},
    { id: "singhdurbar-pass", name: "Singha Durbar Gate Pass Application",  nameNp: "सिंहदरबार प्रवेश पास आवेदन",       cat: "Grievance",   ministry: "Ministry of Home Affairs / Singha Durbar Security", icon: "fa-id-badge", iconCls: "svc-blue", online: "🌐", modalId: null },

    // ── LAND & PROPERTY ──
    { id: "lalpurja",       name: "Land Ownership Records Inquiry",      nameNp: "लालपुर्जा",                       cat: "Land",        ministry: "Dept. of Land Reform (Malpot)", icon: "fa-map-location", iconCls: "svc-green", online: "🌐", modalId: null            },
    { id: "cadastral",      name: "Mero Kitta Cadastral Survey Map",      nameNp: "मेरो किता नक्शा",                  cat: "Land",        ministry: "Department of Survey (Napi)", icon: "fa-map",        iconCls: "svc-green",  online: "🌐", modalId: null            },
    { id: "mortgage",       name: "Property Mortgage Rokka / Fukua",      nameNp: "जग्गा बन्धक तथा फुकुवा",           cat: "Land",        ministry: "Dept. of Land Reform (Malpot)", icon: "fa-landmark", iconCls: "svc-amber",  online: "🔀", modalId: null            },

    // ── BUSINESS, PROCUREMENT & ENVIRONMENT ──
    { id: "company-reg",    name: "Company Incorporation Registration",    nameNp: "कम्पनी दर्ता",                    cat: "Business",    ministry: "Office of Company Registrar", icon: "fa-building-columns", iconCls: "svc-purple", online: "🌐", modalId: null            },
    { id: "company-change", name: "Filing Company Board Changes & Shares", nameNp: "कम्पनी सञ्चालक तथा शेयर परिवर्तन", cat: "Business",  ministry: "Office of Company Registrar", icon: "fa-users-gear", iconCls: "svc-purple", online: "🌐", modalId: null            },
    { id: "egp",            name: "e-GP Contractor Bidder Registration",  nameNp: "इ-GP ठेकेदार दर्ता",              cat: "Business",    ministry: "Public Procurement Monitoring (PPMO)", icon: "fa-file-contract", iconCls: "svc-amber", online: "🌐", modalId: null      },
    { id: "tenders",        name: "Browse Active Public Tenders",         nameNp: "सार्वजनिक बोलपत्र",              cat: "Business",    ministry: "Public Procurement Monitoring (PPMO)", icon: "fa-folder-open", iconCls: "svc-slate", online: "🌐", modalId: null        },
    { id: "fdi",            name: "Large-Scale Project FDI Approval",     nameNp: "वैदेशिक लगानी स्वीकृति",           cat: "Business",    ministry: "Investment Board Nepal (IBN)", icon: "fa-earth-asia", iconCls: "svc-blue", online: "🔀", modalId: null            },
    { id: "eia",            name: "Environmental Clearance & EIA Review",  nameNp: "वातावरणीय प्रभाव मूल्यांकन",     cat: "Business",    ministry: "Department of Environment", icon: "fa-leaf",        iconCls: "svc-green",  online: "🔀", modalId: null            },

    // ── TELECOM & MEDIA ──
    { id: "mdms",           name: "Mobile Device IMEI Registration (MDMS)",nameNp:"मोबाइल IMEI दर्ता",              cat: "Telecom",     ministry: "Nepal Telecom Authority (NTA)", icon: "fa-mobile-screen", iconCls: "svc-sky", online: "🌐", modalId: null            },
    { id: "press-card",     name: "Journalist Press Card Issuance",        nameNp: "पत्रकार परिचयपत्र",               cat: "Telecom",     ministry: "Dept. of Info & Broadcasting", icon: "fa-newspaper", iconCls: "svc-slate", online: "🔀", modalId: null            },
    { id: "news-portal",    name: "Online News Portal Registration",      nameNp: "अनलाइन समाचार पोर्टल दर्ता",       cat: "Telecom",     ministry: "Dept. of Info & Broadcasting", icon: "fa-globe",     iconCls: "svc-blue",   online: "🔀", modalId: null            },
];


const CATEGORIES = [
    { id: "all",        label: "All Services (सबै सेवाहरू)", icon: "fa-border-all" },
    { id: "Identity",   label: "Identity & Wards (परिचय तथा वडा)", icon: "fa-id-card" },
    { id: "Travel",     label: "Travel & Passport (राहदानी र यात्रा)", icon: "fa-plane" },
    { id: "Finance",    label: "Utilities & Tax (महसुल र कर)", icon: "fa-coins" },
    { id: "Land",       label: "Land & Lalpurja (घरजग्गा र नक्शा)", icon: "fa-map" },
    { id: "Transport",  label: "Transport & License (सवारी र लाइसेन्स)", icon: "fa-car" },
    { id: "Education",  label: "Education & NOC (शिक्षा र परीक्षा)", icon: "fa-graduation-cap" },
    { id: "Legal",      label: "Legal & Notary (कानूनी र नोटरी)", icon: "fa-gavel" },
    { id: "Health",     label: "Health & Social (स्वास्थ्य र सामाजिक)", icon: "fa-heart-pulse" },
    { id: "Business",   label: "Business & Tenders (व्यापार र ठेक्का)", icon: "fa-building" },
    { id: "Telecom",    label: "Telecom & Tech (सञ्चार र प्रविधि)", icon: "fa-mobile" },
    { id: "Employment", label: "Employment & SSF (रोजगार र कोष)", icon: "fa-briefcase" },
    { id: "Grievance",  label: "Grievance & Passes (उजुरी र प्रवेश पास)", icon: "fa-comment-dots" },
];



const DOCUMENTS = [
    { name: "Citizenship Certificate (नागरिकता)", nameNp: "नागरिकता प्रमाणपत्र", issuer: "Home Ministry DAO Office", icon: "fa-address-card",  iconBg: "var(--blue-50)",    iconColor: "var(--blue-600)"   },
    { name: "National Identity Card (NID)",        nameNp: "राष्ट्रिय परिचयपत्र", issuer: "DoNIDCR Civil Reg.",   icon: "fa-id-card",       iconBg: "var(--purple-100)", iconColor: "var(--purple-600)" },
    { name: "Smart Driving License",               nameNp: "सवारी चालक अनुमति", issuer: "Dept. of Transport Mgmt", icon: "fa-car",        iconBg: "var(--emerald-100)",iconColor: "var(--emerald-600)"},
    { name: "Permanent Account Number (PAN)",      nameNp: "स्थायी लेखा नम्बर", issuer: "Inland Revenue Dept.", icon: "fa-hashtag",     iconBg: "var(--amber-100)",  iconColor: "var(--amber-600)"  },
    { name: "SEE Class 10 Board Marksheet",        nameNp: "एस.इ.इ. लब्धाङ्क पत्र", issuer: "National Examinations Board", icon: "fa-file-lines", iconBg: "var(--sky-100)", iconColor: "var(--sky-600)" },
    { name: "Class 12 NEB Academic Transcript",    nameNp: "कक्षा १२ ट्रान्सक्रिप्ट", issuer: "National Examinations Board", icon: "fa-graduation-cap", iconBg: "var(--purple-100)", iconColor: "var(--purple-600)" },
    { name: "TU Bachelor's Degree Certificate",    nameNp: "त्रिभुवन विश्वविद्यालय उपाधि", issuer: "Tribhuvan University (TU)", icon: "fa-certificate", iconBg: "var(--emerald-100)", iconColor: "var(--emerald-600)" },
    { name: "Lalpurja Land Ownership Card",        nameNp: "लालपुर्जा प्रमाणपत्र", issuer: "Dept. of Land Reform (Malpot)", icon: "fa-map-location", iconBg: "var(--amber-100)", iconColor: "var(--amber-600)" },
    { name: "SSF Contribution Card",               nameNp: "सामाजिक सुरक्षा कोष",issuer: "Social Security Fund", icon: "fa-vault",       iconBg: "var(--blue-50)",    iconColor: "var(--blue-600)"    },
    { name: "Health Insurance Card",               nameNp: "स्वास्थ्य बिमा कार्ड", issuer: "Health Insurance Board (HIB)", icon: "fa-heart-pulse", iconBg: "var(--rose-100)", iconColor: "var(--rose-600)" },
];


// ─── Bootstrap ────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    runFaceIDSimulation();

    // Bottom nav wiring
    document.querySelectorAll(".nav-btn[data-page]").forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.getAttribute("data-page");
            switchPage(page);
            setActiveNav(page);
        });
    });

    // Overlay click → close modal
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", e => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    loadUserData();
    renderServices("all");
    buildServicesPage();
    setupFullscreenListeners();
});

// ─── Fullscreen & Viewport Wiring ──────────────────
function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().then(() => {
                document.body.classList.add("fullscreen-mode");
                updateFullscreenIcon(true);
            }).catch(() => {
                document.body.classList.toggle("fullscreen-mode");
                updateFullscreenIcon(document.body.classList.contains("fullscreen-mode"));
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
            document.body.classList.add("fullscreen-mode");
            updateFullscreenIcon(true);
        } else {
            document.body.classList.toggle("fullscreen-mode");
            updateFullscreenIcon(document.body.classList.contains("fullscreen-mode"));
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        document.body.classList.remove("fullscreen-mode");
        updateFullscreenIcon(false);
    }
}

function updateFullscreenIcon(isFS) {
    const btns = document.querySelectorAll("#fullscreen-toggle, .mygov-icon-btn[onclick*='toggleFullscreen']");
    btns.forEach(btn => {
        const icon = btn.querySelector("i");
        if (icon) {
            icon.className = isFS ? "fa-solid fa-compress" : "fa-solid fa-expand";
        }
    });
}

function setupFullscreenListeners() {
    // Double click anywhere outside interactive controls toggles Fullscreen
    document.addEventListener("dblclick", (e) => {
        if (e.target.closest("button, input, select, textarea, a, .doc-card-wrap, .modal-sheet")) {
            return;
        }
        toggleFullscreen();
    });

    document.addEventListener("fullscreenchange", () => {
        const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
        if (isFS) {
            document.body.classList.add("fullscreen-mode");
        } else {
            document.body.classList.remove("fullscreen-mode");
        }
        updateFullscreenIcon(isFS);
    });
}

// ─── Face ID Simulation ───────────────────────────
function runFaceIDSimulation() {
    const overlay = document.getElementById("biometric-overlay");
    if (!overlay) return;

    // Click to skip immediately
    overlay.addEventListener("click", () => overlay.classList.add("hidden"));

    setTimeout(() => {
        const txt = document.getElementById("scan-status-text");
        if (txt) {
            txt.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#34D399; margin-right:4px;"></i> Authenticated ✓';
            txt.style.color = "#34D399";
        }
        const scanBox = overlay.querySelector(".face-scan-box");
        if (scanBox) scanBox.style.borderColor = "#34D399";
        setTimeout(() => overlay.classList.add("hidden"), 700);
    }, 1600);
}


// ─── Load User Data into DOM ─────────────────────
function loadUserData() {
    document.querySelectorAll(".val-user-name").forEach(el => el.textContent = userData.name);
    document.querySelectorAll(".val-nid").forEach(el        => el.textContent = userData.nid);
    document.querySelectorAll(".val-citizenship").forEach(el=> el.textContent = userData.citizenshipNo);
    document.querySelectorAll(".val-license").forEach(el    => el.textContent = userData.licenseNo);
    document.querySelectorAll(".val-pan").forEach(el        => el.textContent = userData.panNo);
    document.querySelectorAll(".val-passport").forEach(el   => el.textContent = userData.passportNo);
    document.querySelectorAll(".user-avatar").forEach(img   => img.src = userData.avatar);

    // SSF progress
    const ssfMeta = document.getElementById("ssf-meta-text");
    if (ssfMeta) ssfMeta.textContent = `Last contribution: ${userData.lastContribution}`;
    const ssfBal = document.getElementById("ssf-balance-val");
    if (ssfBal) ssfBal.textContent = userData.ssfBalance;

    // Animate SSF progress bar after mount
    const pct = Math.min(100, Math.round((userData.ssfBalanceRaw / userData.ssfTarget) * 100));
    setTimeout(() => {
        const bar = document.getElementById("ssf-progress");
        if (bar) bar.style.width = pct + "%";
    }, 400);

    renderDocumentList();
    renderAppList();
    renderNotifList();
    renderPermList();
    renderMoreDocList();
    renderMorePermList();
    updateUnreadDot();
}

// ─── Page Switching ───────────────────────────────
function switchPage(pageId) {
    document.querySelectorAll(".app-page").forEach(p => p.classList.remove("active"));
    const target = document.getElementById("page-" + pageId);
    if (target) target.classList.add("active");
}

function setActiveNav(pageId) {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    const active = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
    if (active) active.classList.add("active");
}

// ─── Render: Document Wallet List ────────────────
function renderDocumentList() {
    const container = document.getElementById("doc-list-container");
    if (!container) return;
    container.innerHTML = "";
    DOCUMENTS.forEach(doc => {
        container.insertAdjacentHTML("beforeend", `
        <div class="doc-list-item">
            <div class="doc-icon" style="background:${doc.iconBg}; color:${doc.iconColor};">
                <i class="fa-solid ${doc.icon}"></i>
            </div>
            <div class="doc-info">
                <div class="doc-name">${doc.name}</div>
                <div class="doc-issuer">Issued by: ${doc.issuer}</div>
                <div class="doc-verified-badge"><i class="fa-solid fa-circle-check"></i> Verified</div>
            </div>
            <div class="doc-right">
                <button class="doc-dl-btn"><i class="fa-solid fa-download"></i> PDF</button>
                <button class="doc-dl-btn" style="margin-top:0;"><i class="fa-solid fa-qrcode"></i> QR</button>
            </div>
        </div>`);
    });
}

// ─── Render: Applications (Inbox) ────────────────
function renderAppList() {
    const container = document.getElementById("app-list-container");
    if (!container) return;
    container.innerHTML = "";
    userData.applications.forEach(app => {
        const statusCls = app.status === "Approved" ? "status-approved" : app.status === "Pending" ? "status-pending" : "status-review";
        container.insertAdjacentHTML("beforeend", `
        <div class="app-list-item">
            <div class="app-icon" style="background:${app.color}18; color:${app.color};">
                <i class="fa-solid ${app.icon}"></i>
            </div>
            <div class="app-info">
                <div class="app-name">${app.name}</div>
                <div class="app-date">Filed: ${app.date} &nbsp;·&nbsp; ID: ${app.id}</div>
            </div>
            <span class="status-pill ${statusCls}">${app.status}</span>
        </div>`);
    });
}

// ─── Render: Notification List ───────────────────
function renderNotifList() {
    const container = document.getElementById("notif-list-container");
    if (!container) return;
    container.innerHTML = "";
    userData.notifications.forEach((n, i) => {
        container.insertAdjacentHTML("beforeend", `
        <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="markRead(${i})" style="cursor:pointer;">
            <div class="notif-icon" style="background:${n.iconBg}; color:${n.iconColor};">
                <i class="fa-solid ${n.icon}"></i>
            </div>
            <div class="notif-content">
                <div class="notif-title">${n.title}</div>
                <div class="notif-body">${n.body}</div>
                <div class="notif-time">${n.time}</div>
            </div>
        </div>`);
    });
}

function markRead(i) {
    userData.notifications[i].unread = false;
    renderNotifList();
    updateUnreadDot();
}

function updateUnreadDot() {
    const count = userData.notifications.filter(n => n.unread).length;
    // Home hero dot
    const dot = document.getElementById("notif-dot");
    if (dot) dot.style.display = count > 0 ? "block" : "none";
    // Nav inbox button badge
    const navBtn = document.getElementById("nav-inbox-btn");
    if (navBtn) {
        let badge = navBtn.querySelector(".nav-unread-dot");
        if (count > 0) {
            if (!badge) { badge = document.createElement("span"); badge.className = "nav-unread-dot"; navBtn.appendChild(badge); }
        } else {
            if (badge) badge.remove();
        }
    }
}

// ─── Render: Permission List ──────────────────────
function renderPermList() {
    const container = document.getElementById("perm-list-container");
    if (!container) return;
    container.innerHTML = "";
    userData.permissions.forEach((p, i) => {
        container.insertAdjacentHTML("beforeend", `
        <div class="perm-item">
            <div class="perm-icon"><i class="fa-solid fa-building-shield"></i></div>
            <div class="perm-info">
                <div class="perm-entity">${p.entity}</div>
                <div class="perm-purpose">${p.purpose}</div>
                <div class="perm-fields"><i class="fa-solid fa-lock-open" style="font-size:0.55rem;"></i> ${p.fields}</div>
            </div>
            <label class="toggle">
                <input type="checkbox" ${p.active ? "checked" : ""} onchange="togglePerm(${i}, this.checked)">
                <span class="toggle-track"></span>
            </label>
        </div>`);
    });
}

function togglePerm(i, checked) {
    userData.permissions[i].active = checked;
    const entity = userData.permissions[i].entity;
    pushNotif({
        title: checked ? "Access Granted 🔓" : "Access Revoked 🔒",
        body: checked ? `You granted ${entity} access to your documents.` : `${entity}'s access has been revoked.`,
        time: "Just now",
        icon: "fa-building-shield",
        iconBg: "var(--blue-100)",
        iconColor: "var(--blue-600)",
        unread: true
    });
}

// ─── More Page — Mirror Doc and Perm lists ────────
function renderMoreDocList() {
    const container = document.getElementById("more-doc-list");
    if (!container) return;
    container.innerHTML = "";
    DOCUMENTS.forEach(doc => {
        container.insertAdjacentHTML("beforeend", `
        <div class="doc-list-item">
            <div class="doc-icon" style="background:${doc.iconBg}; color:${doc.iconColor};">
                <i class="fa-solid ${doc.icon}"></i>
            </div>
            <div class="doc-info">
                <div class="doc-name">${doc.name}</div>
                <div class="doc-issuer">${doc.issuer}</div>
                <div class="doc-verified-badge"><i class="fa-solid fa-circle-check"></i> Verified</div>
            </div>
            <div class="doc-right">
                <button class="doc-dl-btn"><i class="fa-solid fa-download"></i> PDF</button>
            </div>
        </div>`);
    });
}

function renderMorePermList() {
    const container = document.getElementById("more-perm-list");
    if (!container) return;
    container.innerHTML = "";
    userData.permissions.forEach((p, i) => {
        container.insertAdjacentHTML("beforeend", `
        <div class="perm-item">
            <div class="perm-icon"><i class="fa-solid fa-building-shield"></i></div>
            <div class="perm-info">
                <div class="perm-entity">${p.entity}</div>
                <div class="perm-purpose">${p.purpose}</div>
                <div class="perm-fields"><i class="fa-solid fa-lock-open" style="font-size:0.55rem;"></i> ${p.fields}</div>
            </div>
            <label class="toggle">
                <input type="checkbox" ${p.active ? "checked" : ""} onchange="togglePermMore(${i}, this.checked)">
                <span class="toggle-track"></span>
            </label>
        </div>`);
    });
}

function togglePermMore(i, checked) {
    userData.permissions[i].active = checked;
    togglePerm(i, checked);
    renderPermList();
    renderMorePermList();
}
const QUICK_SERVICES = ["pcc", "noc", "notary", "grievance", "lalpurja", "vehicle-tax", "nea-bill", "passport", "shram", "vaccine", "tax-clearance", "driving"];

function renderServices(catFilter) {
    const grid = document.getElementById("home-svc-grid");
    if (!grid) return;
    const list = catFilter === "all"
        ? QUICK_SERVICES.map(id => ALL_SERVICES.find(s => s.id === id)).filter(Boolean)
        : ALL_SERVICES.filter(s => s.cat === catFilter).slice(0, 16);

    grid.innerHTML = "";
    list.forEach(svc => {
        const el = document.createElement("div");
        el.className = "svc-item";
        el.innerHTML = `
            <div class="svc-icon-box ${svc.iconCls}"><i class="fa-solid ${svc.icon}"></i></div>
            <span class="svc-label">${svc.name.split(" ").slice(0, 3).join(" ")}</span>`;
        if (svc.modalId) {
            el.setAttribute("onclick", `openModal('${svc.modalId}')`);
        } else {
            el.setAttribute("onclick", `showServiceDetail('${svc.id}')`);
        }
        grid.appendChild(el);
    });
}

// ─── Services Catalog Page ────────────────────────
function buildServicesPage() {
    buildCategoryFilterBar();
    buildServiceCatalog("all");
}

function buildCategoryFilterBar() {
    const bar = document.getElementById("cat-filter-bar");
    if (!bar) return;
    CATEGORIES.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "cat-filter-btn" + (cat.id === "all" ? " active-cat" : "");
        btn.setAttribute("data-cat", cat.id);
        btn.innerHTML = `<i class="fa-solid ${cat.icon}"></i> ${cat.label}`;
        btn.addEventListener("click", () => {
            document.querySelectorAll(".cat-filter-btn").forEach(b => b.classList.remove("active-cat"));
            btn.classList.add("active-cat");
            buildServiceCatalog(cat.id);
        });
        bar.appendChild(btn);
    });
}

let currentCatFilter = "all";

function buildServiceCatalog(catFilter = "all", searchQuery = "") {
    currentCatFilter = catFilter;
    const container = document.getElementById("services-catalog-container");
    if (!container) return;

    let list = catFilter === "all" ? ALL_SERVICES : ALL_SERVICES.filter(s => s.cat === catFilter);

    const q = searchQuery.toLowerCase().trim();
    if (q) {
        list = list.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.nameNp.includes(q) ||
            s.ministry.toLowerCase().includes(q) ||
            s.cat.toLowerCase().includes(q)
        );
    }

    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:32px; color:var(--text-400); font-size:0.8rem;">कुनै सेवा भेटिएन (No services match "${q}").</div>`;
        return;
    }

    // Group by ministry
    const grouped = {};
    list.forEach(svc => {
        if (!grouped[svc.ministry]) grouped[svc.ministry] = [];
        grouped[svc.ministry].push(svc);
    });

    Object.keys(grouped).forEach(ministry => {
        const section = document.createElement("div");
        section.innerHTML = `<div class="ministry-section-label">${ministry}</div>`;
        grouped[ministry].forEach(svc => {
            section.insertAdjacentHTML("beforeend", `
            <div class="svc-catalog-item" onclick="${svc.modalId ? "openModal('" + svc.modalId + "')" : "showServiceDetail('" + svc.id + "')" }">
                <div class="svc-icon-box ${svc.iconCls}" style="width:40px; height:40px; font-size:1rem; border-radius:10px;">
                    <i class="fa-solid ${svc.icon}"></i>
                </div>
                <div class="svc-cat-info">
                    <div class="svc-cat-name">${svc.name}</div>
                    <div class="svc-cat-np">${svc.nameNp}</div>
                </div>
                <div class="svc-online-badge">${svc.online}</div>
            </div>`);
        });
        container.appendChild(section);
    });
}

// Services Tab Search Input Listener
const servicesSearch = document.getElementById("services-search");
if (servicesSearch) {
    servicesSearch.addEventListener("input", () => {
        buildServiceCatalog(currentCatFilter, servicesSearch.value);
    });
}


// ─── Service Detail Sheet ─────────────────────────
function showServiceDetail(svcId) {
    const svc = ALL_SERVICES.find(s => s.id === svcId);
    if (!svc) return;

    // Populate and open generic service detail modal
    const modal = document.getElementById("modal-service-detail");
    if (!modal) return;
    document.getElementById("svc-detail-title").textContent = svc.name;
    document.getElementById("svc-detail-np").textContent   = svc.nameNp;
    document.getElementById("svc-detail-ministry").textContent = `Ministry: ${svc.ministry}`;
    document.getElementById("svc-detail-online").textContent   = `Status: ${svc.online === "🌐" ? "Fully Online" : svc.online === "🔀" ? "Partially Online" : "Manual / In-Person"}`;
    openModal("modal-service-detail");
}

// ─── Modal Control ────────────────────────────────
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("open");
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("open");
}

// ─── QR Code Payload ──────────────────────────────
function updateQRCode() {
    const cidCheck = document.getElementById("qr-cid");
    const nidCheck = document.getElementById("qr-nid");
    const panCheck = document.getElementById("qr-pan");

    const payload = {
        nagarik_id: `NID-${userData.nid}`,
        name: userData.name,
        issued_by: "Government of Nepal – Nagarik App",
        timestamp: new Date().toISOString(),
        expires_in: "45s (single-use)"
    };
    if (cidCheck && cidCheck.checked) payload.citizenship = userData.citizenshipNo;
    if (nidCheck && nidCheck.checked) payload.nid = userData.nid;
    if (panCheck && panCheck.checked) payload.pan = userData.panNo;

    const preview = document.getElementById("qr-payload-preview");
    if (preview) preview.textContent = JSON.stringify(payload, null, 2);
}

// ─── Global Search ────────────────────────────────
const mainSearch = document.getElementById("main-search");
if (mainSearch) {
    mainSearch.addEventListener("input", () => {
        const q = mainSearch.value.toLowerCase().trim();
        if (!q) { renderServices("all"); return; }
        const grid = document.getElementById("home-svc-grid");
        if (!grid) return;
        const results = ALL_SERVICES.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.nameNp.includes(q) ||
            s.ministry.toLowerCase().includes(q) ||
            s.cat.toLowerCase().includes(q)
        ).slice(0, 12);
        grid.innerHTML = "";
        if (results.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-400); font-size:0.8rem; padding:20px 0;">No results for "${q}"</div>`;
            return;
        }
        results.forEach(svc => {
            const el = document.createElement("div");
            el.className = "svc-item";
            el.innerHTML = `
                <div class="svc-icon-box ${svc.iconCls}"><i class="fa-solid ${svc.icon}"></i></div>
                <span class="svc-label">${svc.name.split(" ").slice(0, 3).join(" ")}</span>`;
            if (svc.modalId) el.setAttribute("onclick", `openModal('${svc.modalId}')`);
            else el.setAttribute("onclick", `showServiceDetail('${svc.id}')`);
            grid.appendChild(el);
        });
    });
}

// ─── Form Submit Handlers ─────────────────────────
function handlePCCSubmit(event) {
    event.preventDefault();
    const purpose = document.getElementById("pcc-purpose").value;
    const id = "PCC-" + Math.floor(1000 + Math.random() * 9000);
    userData.applications.unshift({ id, name: `Police Clearance (${purpose})`, date: today(), status: "Pending", icon: "fa-shield-halved", color: "var(--amber-600)" });
    pushNotif({ title: "PCC Application Filed 🛡️", body: `Application ${id} received. Processing within 24hrs.`, time: "Just now", icon: "fa-shield-halved", iconBg: "var(--emerald-100)", iconColor: "var(--emerald-600)", unread: true });
    closeModal("modal-pcc");
    event.target.reset();
}

function handleNOCSubmit(event) {
    event.preventDefault();
    const college = document.getElementById("noc-college").value;
    const country = document.getElementById("noc-country").value;
    const id = "NOC-" + Math.floor(1000 + Math.random() * 9000);
    userData.applications.unshift({ id, name: `Study NOC — ${country}`, date: today(), status: "Pending", icon: "fa-graduation-cap", color: "var(--purple-600)" });
    pushNotif({ title: "NOC Application Submitted 🎓", body: `NOC for ${college}, ${country} is under review.`, time: "Just now", icon: "fa-graduation-cap", iconBg: "var(--purple-100)", iconColor: "var(--purple-600)", unread: true });
    closeModal("modal-noc");
    event.target.reset();
}

function handleNotarySubmit(event) {
    event.preventDefault();
    const type = document.getElementById("notary-type").value;
    const id = "NTR-" + Math.floor(1000 + Math.random() * 9000);
    userData.applications.unshift({ id, name: `Notary: ${type}`, date: today(), status: "Pending", icon: "fa-stamp", color: "var(--amber-600)" });
    pushNotif({ title: "Notary Submitted 📜", body: `Translation/certification for "${type}" assigned to licensed translator.`, time: "Just now", icon: "fa-stamp", iconBg: "var(--amber-100)", iconColor: "var(--amber-600)", unread: true });
    closeModal("modal-notary");
    event.target.reset();
}

function handleGrievanceSubmit(event) {
    event.preventDefault();
    const cat  = document.getElementById("grv-category").value;
    const desc = document.getElementById("grv-desc").value;
    const token = "HS-" + Math.floor(1000 + Math.random() * 9000);
    pushNotif({ title: `Hello Sarkar Filed — ${token} 💬`, body: `Issue on "${cat}": "${desc.substring(0, 50)}…" Forwarded to concerned authority.`, time: "Just now", icon: "fa-comment-dots", iconBg: "var(--rose-100)", iconColor: "var(--rose-600)", unread: true });
    closeModal("modal-grievance");
    event.target.reset();
}

function handleLinkDoc(event) {
    event.preventDefault();
    const type = document.getElementById("link-type").value;
    const num  = document.getElementById("link-number").value;
    if (type.includes("Passport")) {
        const card = document.getElementById("card-passport");
        if (card) { card.style.display = "block"; }
    }
    pushNotif({ title: `${type} Linked 🔗`, body: `Document ${num} verified & linked to your biometric profile.`, time: "Just now", icon: "fa-link", iconBg: "var(--green-100)", iconColor: "var(--emerald-600)", unread: true });
    closeModal("modal-link-doc");
    event.target.reset();
}

function handlePayUtility(event) {
    event.preventDefault();
    const type = document.getElementById("pay-type").value;
    const cid  = document.getElementById("pay-consumer-id").value;
    const amt  = document.getElementById("pay-amount").value;

    pushNotif({
        title: `${type} Payment Successful 💳`,
        body: `Paid रू. ${amt} for ${type} (ID: ${cid}). Receipt voucher saved.`,
        time: "Just now",
        icon: "fa-circle-check",
        iconBg: "var(--emerald-100)",
        iconColor: "var(--emerald-600)",
        unread: true
    });
    closeModal("modal-pay-utility");
    event.target.reset();
}

// ─── Helpers ──────────────────────────────────────
function today() {
    return new Date().toISOString().split("T")[0];
}

function pushNotif(n) {
    userData.notifications.unshift(n);
    renderNotifList();
    renderAppList();
    updateUnreadDot();
}

function showLinkDocumentForm() {
    openModal("modal-link-doc");
}

// ─── Clipboard Copy & Privacy Masking Helpers ─────
function copyToClipboard(text, btnEl) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        if (btnEl) {
            const icon = btnEl.querySelector("i");
            if (icon) {
                icon.className = "fa-solid fa-check";
                btnEl.style.color = "var(--emerald-600)";
                setTimeout(() => {
                    icon.className = "fa-regular fa-copy";
                    btnEl.style.color = "var(--blue-600)";
                }, 1500);
            }
        }
    }).catch(err => {
        console.log("Copy failed:", err);
    });
}

let isPrivacyMasked = false;

function togglePrivacyMask() {
    isPrivacyMasked = !isPrivacyMasked;
    const eyeIcon = document.getElementById("privacy-eye-icon");
    if (eyeIcon) {
        eyeIcon.className = isPrivacyMasked ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
    }

    const citEls = document.querySelectorAll(".val-citizenship");
    citEls.forEach(el => {
        el.textContent = isPrivacyMasked ? "27-••-••-•••••" : userData.citizenshipNo;
    });

    const nidEls = document.querySelectorAll(".val-nid");
    nidEls.forEach(el => {
        el.textContent = isPrivacyMasked ? "983-•••-•••-•" : userData.nid;
    });
}




