export type Service = { id:string; name:string; nepali:string; category:string; agency:string; type:"Online"|"Hybrid"|"Office"; fee:string; time:string; description:string; documents:string[]; officialUrl?:string };

export const categories = ["All","Identity","Transport","Finance","Travel","Land","Education","Health","Legal","Business","Employment","Civic"];

const defaults: Record<string,{description:string;documents:string[];fee:string;time:string}> = {
 Identity:{description:"Verify your identity and submit the request securely to the responsible public office.",documents:["Citizenship certificate","Recent passport photograph"],fee:"No fee",time:"3 to 7 working days"},
 Transport:{description:"Complete the transport request, attach supporting records, and reserve an office visit when required.",documents:["Citizenship certificate","Existing licence or vehicle record"],fee:"Calculated at review",time:"2 to 5 working days"},
 Finance:{description:"Retrieve your government account, review the assessed amount, and complete a recorded digital transaction.",documents:["PAN or citizenship number","Billing or account reference"],fee:"As assessed",time:"Usually instant"},
 Travel:{description:"Submit travel details for government verification and receive status updates in your citizen inbox.",documents:["Citizenship certificate","Passport or travel record"],fee:"Calculated at review",time:"5 to 15 working days"},
 Land:{description:"Request authenticated land information from the relevant Malpot or Survey office.",documents:["Lalpurja copy","Citizenship certificate","Kitta and ward details"],fee:"रू 100 onwards",time:"2 to 7 working days"},
 Education:{description:"Request, verify, or apply using academic records held by Nepal's public education bodies.",documents:["Citizenship certificate","Academic transcript or registration number"],fee:"Varies by service",time:"3 to 10 working days"},
 Health:{description:"Access public health registration, certification, and appointment services for you and your family.",documents:["Citizenship or birth certificate","Relevant health record"],fee:"No fee",time:"1 to 5 working days"},
 Legal:{description:"Send documents for official legal verification and track the reviewing authority's decision.",documents:["Identity proof","Original document scan"],fee:"रू 500 onwards",time:"3 to 7 working days"},
 Business:{description:"File a compliant business request and manage review tasks from one government workspace.",documents:["PAN or VAT certificate","Company or promoter records"],fee:"Calculated at review",time:"7 to 21 working days"},
 Employment:{description:"Submit employment details, permits, and supporting records to the responsible labour authority.",documents:["Citizenship certificate","Employment or qualification record"],fee:"Varies by service",time:"3 to 10 working days"},
 Civic:{description:"Reach the correct public authority, provide evidence, and track the official response.",documents:["Identity proof","Supporting evidence"],fee:"No fee",time:"Response within 7 days"},
};

const raw: Array<[string,string,string,string,string,"Online"|"Hybrid"|"Office"]> = [
 ["pcc","Police Clearance Certificate","प्रहरी चारित्र्य प्रमाणपत्र","Identity","Nepal Police","Online"],["nid","National ID pre-enrolment","राष्ट्रिय परिचयपत्र पूर्वदर्ता","Identity","DoNIDCR","Hybrid"],["citizenship","Citizenship certificate issuance","नागरिकता प्रमाणपत्र","Identity","District Administration Office","Hybrid"],["duplicate-citizenship","Duplicate citizenship copy","नागरिकता प्रतिलिपि","Identity","District Administration Office","Office"],["vital-event","Birth, marriage and death registration","व्यक्तिगत घटना दर्ता","Identity","Local Ward Office","Hybrid"],["voter-register","Voter registration and biometrics","मतदाता दर्ता","Identity","Election Commission Nepal","Hybrid"],["voter-check","Voter card and polling centre","मतदाता केन्द्र जाँच","Identity","Election Commission Nepal","Online"],
 ["cybercrime","Cybercrime report","साइबर अपराध रिपोर्ट","Civic","Nepal Police Cyber Bureau","Online"],["driving","Driving licence application and exam","सवारी चालक अनुमतिपत्र","Transport","Department of Transport Management","Hybrid"],["licence-renew","Driving licence renewal","लाइसेन्स नवीकरण","Transport","Department of Transport Management","Hybrid"],["licence-track","Smart licence print tracking","लाइसेन्स छपाइ स्थिति","Transport","Department of Transport Management","Online"],["vehicle-tax","Vehicle tax and bluebook renewal","गाडी कर तथा ब्लुबुक नवीकरण","Transport","Department of Transport Management","Hybrid"],["number-plate","Embossed number plate registration","इम्बोस्ड नम्बर प्लेट दर्ता","Transport","Department of Transport Management","Hybrid"],["drone","Drone registration and flight permit","ड्रोन दर्ता तथा उडान अनुमति","Transport","Civil Aviation Authority of Nepal","Hybrid"],
 ["pan","Personal PAN registration","व्यक्तिगत स्थायी लेखा नम्बर","Finance","Inland Revenue Department","Online"],["tax-return","Income tax return filing","आयकर विवरण","Finance","Inland Revenue Department","Online"],["tax-clearance","Tax clearance certificate","कर चुक्ता प्रमाणपत्र","Finance","Inland Revenue Department","Online"],["exim","EXIM code registration","आयात निर्यात कोड दर्ता","Finance","Department of Customs","Online"],["revenue","Government revenue payment","सरकारी राजस्व भुक्तानी","Finance","Financial Comptroller General Office","Online"],["ssf","Social Security Fund contributions","सामाजिक सुरक्षा कोष","Finance","Social Security Fund","Online"],["electricity","Electricity bill inquiry and payment","बिजुली महसुल भुक्तानी","Finance","Nepal Electricity Authority","Online"],["water","Drinking water bill payment","खानेपानी महसुल भुक्तानी","Finance","Kathmandu Upatyaka Khanepani","Online"],
 ["passport","e-Passport pre-enrolment","ई-पासपोर्ट पूर्वदर्ता","Travel","Department of Passport","Hybrid"],["passport-track","Passport status tracking","राहदानी स्थिति ट्र्याकिङ","Travel","Department of Passport","Online"],["visa","Tourist visa extension","पर्यटक भिसा नवीकरण","Travel","Department of Immigration","Online"],["trek","Restricted area trekking permit","पदयात्रा अनुमति","Travel","Department of Immigration","Hybrid"],["repatriation","Citizen rescue and repatriation","नागरिक उद्धार तथा स्वदेश फिर्ती","Travel","Department of Consular Services","Online"],["mountaineering","Mountaineering expedition permit","पर्वतारोहण अनुमति","Travel","Department of Tourism","Hybrid"],
 ["lalpurja","Land ownership record inquiry","लालपुर्जा विवरण","Land","Department of Land Reform","Online"],["mero-kitta","Mero Kitta cadastral map","मेरो कित्ता नक्सा","Land","Department of Survey","Online"],["mortgage","Property mortgage registration or release","रोक्का तथा फुकुवा","Land","Land Revenue Office","Hybrid"],["property-tax","Local property and land tax","सम्पत्ति तथा मालपोत कर","Land","Local Municipality","Online"],["building-permit","Building map approval","नक्सा पास","Land","Local Municipality","Hybrid"],
 ["relationship","Relationship verification certificate","नाता प्रमाणित","Civic","Local Ward Office","Hybrid"],["income-verify","Annual income verification","वार्षिक आय प्रमाणित","Civic","Local Ward Office","Hybrid"],["vaccine","Vaccination QR certificate","खोप क्यूआर प्रमाणपत्र","Health","Department of Health Services","Online"],["health-insurance","Health insurance enrolment","स्वास्थ्य बिमा दर्ता","Health","Health Insurance Board","Hybrid"],["hospital","Government hospital appointment","सरकारी अस्पताल अपोइन्टमेन्ट","Health","Department of Health Services","Online"],["social-allowance","Social security allowance","सामाजिक सुरक्षा भत्ता","Health","Department of Social Security","Hybrid"],
 ["noc","Abroad study NOC","विदेश अध्ययन अनुमति पत्र","Education","Ministry of Education","Online"],["equivalency","Academic equivalency certificate","शैक्षिक समकक्षता","Education","Curriculum Development Centre","Hybrid"],["see-result","SEE result and marksheet","एसईई नतिजा तथा लब्धाङ्कपत्र","Education","National Examinations Board","Online"],["neb-transcript","Class 12 transcript","कक्षा १२ ट्रान्सक्रिप्ट","Education","National Examinations Board","Online"],["tu-verify","University degree verification","विश्वविद्यालय उपाधि प्रमाणीकरण","Education","Tribhuvan University","Online"],["lok-sewa","Lok Sewa job application","लोक सेवा दरखास्त","Education","Public Service Commission","Online"],["lok-sewa-result","Civil service exam schedule and result","लोक सेवा नतिजा","Education","Public Service Commission","Online"],
 ["notary","Notarisation and certification","नोटरी प्रमाणीकरण","Legal","Nepal Notary Public Council","Office"],["translation","Certified document translation","प्रमाणित कागजात अनुवाद","Legal","Nepal Notary Public Council","Office"],["attestation","Consular document attestation","कन्सुलर प्रमाणीकरण","Legal","Department of Consular Services","Hybrid"],["court","Court case and cause list","अदालत मुद्दा तथा पेसी","Legal","Supreme Court of Nepal","Online"],["digital-signature","Digital signature certificate","डिजिटल हस्ताक्षर प्रमाणपत्र","Legal","Department of Information Technology","Hybrid"],
 ["company","Company incorporation","कम्पनी दर्ता","Business","Office of Company Registrar","Online"],["company-change","Company board and share changes","कम्पनी विवरण परिवर्तन","Business","Office of Company Registrar","Online"],["egp","e-GP bidder registration","ई-जीपी बोलपत्रदाता दर्ता","Business","Public Procurement Monitoring Office","Online"],["tenders","Browse public tenders","सार्वजनिक बोलपत्र","Business","Public Procurement Monitoring Office","Online"],["fdi","Foreign investment approval","वैदेशिक लगानी स्वीकृति","Business","Investment Board Nepal","Hybrid"],["eia","Environmental impact review","वातावरणीय प्रभाव मूल्याङ्कन","Business","Department of Environment","Hybrid"],
 ["labour-permit","Foreign labour permit","श्रम स्वीकृति","Employment","Department of Foreign Employment","Online"],["pmep","Unemployed citizen registration","बेरोजगार नागरिक दर्ता","Employment","Prime Minister Employment Programme","Hybrid"],["army","Nepal Army recruitment","नेपाली सेना भर्ना","Employment","Nepal Army","Hybrid"],["grievance","Hello Sarkar grievance","हेलो सरकार गुनासो","Civic","Office of the Prime Minister","Online"],["corruption","Report corruption","भ्रष्टाचार उजुरी","Civic","CIAA","Online"],["singha-durbar","Singha Durbar visitor pass","सिंहदरबार प्रवेश पास","Civic","Ministry of Home Affairs","Online"],["mdms","Mobile device IMEI registration","मोबाइल आईएमईआई दर्ता","Civic","Nepal Telecommunications Authority","Online"],["press-card","Journalist press card","पत्रकार परिचयपत्र","Civic","Department of Information","Hybrid"],
];

export const services: Service[] = raw.map(([id,name,nepali,category,agency,type]) => {
 const d=defaults[category];
 const officialUrl=["pan","tax-return","tax-clearance"].includes(id)?"https://ird.gov.np/":undefined;
 return {id,name,nepali,category,agency,type,...d,officialUrl,fee:["pcc","noc","passport"].includes(id)?"रू 500":d.fee,documents:id==="noc"?["Citizenship certificate","Academic transcripts","University offer letter","Payment receipt"]:id==="pcc"?["Citizenship certificate","Recent passport photograph","Passport bio page if applying from abroad"]:d.documents};
});
export const departmentHubs = [
  {
    id: "dao",
    name: "District Administration (DAO)",
    nepali: "जिल्ला प्रशासन कार्यालय",
    tagline: "Citizenship, Passport, NID & Identity verification",
    badge: "Primary Identity",
    iconName: "shield" as const,
    theme: "blue" as const,
    serviceIds: ["citizenship", "duplicate-citizenship", "nid", "passport", "passport-track"],
  },
  {
    id: "ward",
    name: "Local Ward Office",
    nepali: "स्थानीय वडा कार्यालय",
    tagline: "Birth, marriage, divorce, relationship & business Sifaris",
    badge: "Vital & Sifaris",
    iconName: "building" as const,
    theme: "teal" as const,
    serviceIds: ["vital-event", "relationship", "income-verify", "property-tax", "building-permit"],
  },
  {
    id: "malpot",
    name: "Land Revenue & Survey (Malpot)",
    nepali: "भूमिसुधार तथा मालपोत",
    tagline: "Lalpurja ownership, cadastral maps, land tax & rokkha",
    badge: "Land & Maps",
    iconName: "file" as const,
    theme: "amber" as const,
    serviceIds: ["lalpurja", "mero-kitta", "mortgage", "property-tax"],
  },
  {
    id: "yatayat",
    name: "Transport Management (Yatayat)",
    nepali: "यातायात व्यवस्था विभाग",
    tagline: "Smart driving license, vehicle tax, bluebook & plates",
    badge: "Driving & Vehicles",
    iconName: "card" as const,
    theme: "navy" as const,
    serviceIds: ["driving", "licence-renew", "licence-track", "vehicle-tax", "number-plate", "drone"],
  },
  {
    id: "revenue",
    name: "Inland Revenue & Tax (IRD)",
    nepali: "आन्तरिक राजस्व विभाग",
    tagline: "Personal PAN, income tax filing & clearance certificates",
    badge: "PAN & Tax",
    iconName: "file" as const,
    theme: "purple" as const,
    serviceIds: ["pan", "tax-return", "tax-clearance", "exim", "revenue"],
  },
  {
    id: "police",
    name: "Nepal Police & Security",
    nepali: "नेपाल प्रहरी",
    tagline: "Police Clearance Certificate (PCC) & cybercrime reports",
    badge: "Police & Safety",
    iconName: "shield" as const,
    theme: "red" as const,
    serviceIds: ["pcc", "cybercrime", "corruption"],
  },
  {
    id: "education",
    name: "Education & Universities",
    nepali: "शिक्षा, परीक्षा तथा बोर्ड",
    tagline: "SEE marksheet, NEB Class 12, foreign study NOC & TU",
    badge: "Academics & NOC",
    iconName: "building" as const,
    theme: "blue" as const,
    serviceIds: ["noc", "see-result", "neb-transcript", "tu-verify", "equivalency", "lok-sewa", "lok-sewa-result"],
  },
  {
    id: "utilities",
    name: "Utilities & Bill Settlements",
    nepali: "सार्वजनिक महसुल तथा भुक्तानी",
    tagline: "Electricity (NEA), drinking water (KUKL) & IMEI MDMS",
    badge: "Bills & Pay",
    iconName: "card" as const,
    theme: "green" as const,
    serviceIds: ["electricity", "water", "mdms"],
  },
  {
    id: "employment",
    name: "Labor, SSF & Social Security",
    nepali: "सामाजिक सुरक्षा तथा श्रम",
    tagline: "SSF contributions, foreign labor permits & allowances",
    badge: "SSF & Labour",
    iconName: "wallet" as const,
    theme: "teal" as const,
    serviceIds: ["ssf", "labour-permit", "health-insurance", "social-allowance", "pmep", "singha-durbar", "grievance"],
  },
];

export const featuredIds=["pcc","passport","vehicle-tax","noc","electricity","grievance","lalpurja","driving"];
export const initialDocuments=[
 {id:"DOC-CIT-01",type:"Citizenship",nepali:"नागरिकता",number:"27-01-75-08421",issuer:"Kathmandu DAO",status:"Verified",updated:"12 Aug 2026"},
 {id:"DOC-NID-02",type:"National ID",nepali:"राष्ट्रिय परिचयपत्र",number:"983-472-810-5",issuer:"DoNIDCR",status:"Verified",updated:"06 Jul 2026"},
 {id:"DOC-LIC-03",type:"Driving licence",nepali:"सवारी चालक अनुमतिपत्र",number:"01-08-00981234",issuer:"DoTM",status:"Verified",updated:"22 Jun 2026"},
 {id:"DOC-PAN-04",type:"Permanent Account Number",nepali:"स्थायी लेखा नम्बर",number:"601284932",issuer:"Inland Revenue Department",status:"Verified",updated:"10 Apr 2026"},
];

export const initialAcademicRecords=[
 {id:"AC-TU-2019",qualification:"Bachelor of Science in Computer Science",institution:"Tribhuvan University",level:"Bachelor",year:"2019",registration:"TU-5-2-887-2015",status:"Verified",credits:"120",division:"First Division"},
 {id:"AC-KU-2022",qualification:"Master of Business Administration",institution:"Kathmandu University",level:"Master",year:"2022",registration:"KU-MBA-20-184",status:"Verified",credits:"60",division:"CGPA 3.72"},
 {id:"AC-CTEVT-2015",qualification:"Diploma in Computer Engineering",institution:"CTEVT",level:"Diploma",year:"2015",registration:"CTEVT-071-4281",status:"Verified",credits:"96",division:"Distinction"},
];
