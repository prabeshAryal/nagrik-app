import os
import json
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Define the nodes of Nepal's Government Services database & Global Benchmarks
# Hierarchy: OPMCM (Root) -> Ministry / Constitutional Body / Benchmark Portal -> Department / Agency -> Service
nodes_data = [
    # --- ROOT ---
    {
        "id": "opmcm",
        "parent": None,
        "name": "Office of the Prime Minister and Council of Ministers",
        "type": "root",
        "category": "Governance & Administration",
        "description": "Central executive office coordinating the cabinet, formulating national policies, and overseeing all ministries.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },

    # --- CONSTITUTIONAL BODIES (Linked to OPMCM for coordination) ---
    {
        "id": "psc",
        "parent": "opmcm",
        "name": "Public Service Commission (Lok Sewa Aayog)",
        "type": "constitutional_body",
        "category": "Public Recruitment",
        "description": "Constitutional body responsible for conducting recruitment examinations and appointing civil servants.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "lok_sewa_job_application",
        "parent": "psc",
        "name": "Lok Sewa Job Application & Registration",
        "type": "service",
        "category": "Employment & Recruitment",
        "description": "Online registration, application submission, and fee payment for federal civil service examinations.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Citizenship;Academic Certificates;Character Certificate;Passport Photo;Signature Scan"
    },
    {
        "id": "lok_sewa_exam_schedule_results",
        "parent": "psc",
        "name": "Civil Service Exam Schedule and Results Portal",
        "type": "service",
        "category": "Employment & Recruitment",
        "description": "Public portal for checking examination dates, roll numbers, syllabus, written results, and interview calls.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "None"
    },

    {
        "id": "ecn",
        "parent": "opmcm",
        "name": "Election Commission Nepal",
        "type": "constitutional_body",
        "category": "Democracy & Elections",
        "description": "Constitutional body that manages voter registration, conducts federal/provincial/local elections, and regulates political parties.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "voter_registration_biometrics",
        "parent": "ecn",
        "name": "Voter Registration with Biometrics",
        "type": "service",
        "category": "Democracy & Elections",
        "description": "Pre-registration of voting details online, followed by biometric (fingerprint/photo) collection at district offices.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Citizenship Certificate;Proof of Address (if different from citizenship)"
    },
    {
        "id": "check_voter_card_details",
        "parent": "ecn",
        "name": "Check Voter Card Details & Polling Center",
        "type": "service",
        "category": "Democracy & Elections",
        "description": "Digital inquiry system to view voter ID card status, voting number, and designated polling booth.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Voter ID Number or Citizenship Number"
    },

    {
        "id": "ciaa",
        "parent": "opmcm",
        "name": "Commission for the Investigation of Abuse of Authority (CIAA)",
        "type": "constitutional_body",
        "category": "Anti-Corruption & Vigilance",
        "description": "The apex constitutional body for investigating corruption and abuse of public authority in Nepal.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "report_corruption_bribe",
        "parent": "ciaa",
        "name": "Report Corruption and Abuse of Office",
        "type": "service",
        "category": "Anti-Corruption & Vigilance",
        "description": "Online form and toll-free helpline to register corruption allegations, bribery complaints, and submit supporting evidence.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Evidence documents/media (optional);Complaint letter"
    },

    # --- OPMCM DIRECT AGENCIES ---
    {
        "id": "hello_sarkar",
        "parent": "opmcm",
        "name": "Hello Sarkar Public Grievance Portal",
        "type": "department",
        "category": "Governance & Administration",
        "description": "Public grievance redressal system directly monitored by the OPMCM to address citizen complaints.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "register_grievance",
        "parent": "hello_sarkar",
        "name": "Lodge Citizen Grievance",
        "type": "service",
        "category": "Governance & Administration",
        "description": "Lodge complaints against public agencies, officials, delayed services, or infrastructure issues via web, SMS, phone, or app.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Details of the grievance;Supporting files/photos (optional)"
    },
    {
        "id": "track_grievance",
        "parent": "hello_sarkar",
        "name": "Track Grievance Status",
        "type": "service",
        "category": "Governance & Administration",
        "description": "Track the action taken on registered complaints using a unique token identifier.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Complaint Token ID"
    },

    {
        "id": "ppmo",
        "parent": "opmcm",
        "name": "Public Procurement Monitoring Office (PPMO)",
        "type": "department",
        "category": "Governance & Administration",
        "description": "Monitors government procurement, manages the e-GP portal, and standardizes bidding processes.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "egp_contractor_registration",
        "parent": "ppmo",
        "name": "e-GP Contractor/Bidder Registration",
        "type": "service",
        "category": "Governance & Administration",
        "description": "Online registration of business firms and contractors to bid for government tenders.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Company Registration;Tax Clearance;PAN/VAT Certificate;Bank Guarantee"
    },
    {
        "id": "browse_public_tenders",
        "parent": "ppmo",
        "name": "Browse Public Tenders & Contracts",
        "type": "service",
        "category": "Governance & Administration",
        "description": "Search, view, and download active public procurement bidding documents and contract awards.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "None"
    },

    {
        "id": "ibn",
        "parent": "opmcm",
        "name": "Investment Board Nepal (IBN)",
        "type": "department",
        "category": "Investment & Business",
        "description": "Government body that facilitates large-scale public-private partnerships (PPP) and foreign direct investment (FDI).",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "large_project_fdi_application",
        "parent": "ibn",
        "name": "Large-Scale Project FDI Approval",
        "type": "service",
        "category": "Investment & Business",
        "description": "Submission and tracking of foreign investment proposals above the threshold for large projects (hydropower, highways, factories).",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Project Proposal;Financial Plan;Company Profile;Feasibility Report"
    },

    {
        "id": "nso",
        "parent": "opmcm",
        "name": "National Statistics Office (NSO)",
        "type": "department",
        "category": "Governance & Administration",
        "description": "Primary statistical body responsible for collection, processing, and analysis of demographic and economic data.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "request_statistical_data",
        "parent": "nso",
        "name": "Request Census & Survey Microdata",
        "type": "service",
        "category": "Governance & Administration",
        "description": "Online application for researchers to access official survey microdata, census sheets, or demographic statistics.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Request Letter;Research Proposal;Institution ID"
    },

    # --- MINISTRY 1: MINISTRY OF HOME AFFAIRS (MoHA) ---
    {
        "id": "moha",
        "parent": "opmcm",
        "name": "Ministry of Home Affairs",
        "type": "ministry",
        "category": "Security & Civil Administration",
        "description": "Responsible for internal security, public order, local administration, disaster management, and immigration.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "nepal_police",
        "parent": "moha",
        "name": "Nepal Police",
        "type": "department",
        "category": "Security & Civil Administration",
        "description": "Federal law enforcement agency ensuring public safety, crime prevention, and traffic control.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "police_clearance_certificate",
        "parent": "nepal_police",
        "name": "Police Clearance Certificate (PCC)",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Online application for Police Character Certificate for job, visa, or studies abroad.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Citizenship Certificate;Passport bio-data page;Passport photo;Marriage Certificate (for females if surname changed)"
    },
    {
        "id": "online_crime_reporting",
        "parent": "nepal_police",
        "name": "Online Crime and Cybercrime Reporting",
        "type": "service",
        "category": "Security & Civil Administration",
        "description": "Portal to report cyber harassment, digital financial fraud, or theft without visiting a station physically.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Incident description;Screenshots/Evidence files;ID Proof"
    },
    {
        "id": "donidcr",
        "parent": "moha",
        "name": "Department of National ID and Civil Registration (DoNIDCR)",
        "type": "department",
        "category": "Identity & Legal Certificates",
        "description": "Oversees the National ID system, population registers, and registration of vital events.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "national_id_pre_enrollment",
        "parent": "donidcr",
        "name": "National ID Pre-enrollment & Biometric Booking",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Online pre-registration of demographic data to obtain a registration number and book biometric appointment slots.",
        "digitized_status": "Partially Online",
        "nagarik_app": True,
        "required_documents": "Original Citizenship Certificate;Marriage Certificate (if applicable);Birth Certificate (for children)"
    },
    {
        "id": "vital_event_registration",
        "parent": "donidcr",
        "name": "Civil Event Registration (Birth, Marriage, Death, Divorce, Migration)",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Online reporting of vital life events via ward offices to record and issue official registration certificates.",
        "digitized_status": "Partially Online",
        "nagarik_app": True,
        "required_documents": "Hospital birth notification/Marriage card/Death report;Citizenship certificates of parties;Migration document"
    },
    {
        "id": "doi",
        "parent": "moha",
        "name": "Department of Immigration (DoI)",
        "type": "department",
        "category": "Security & Civil Administration",
        "description": "Manages entry, stay, and exit of foreign nationals and regulates border crossings.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "tourist_visa_extension",
        "parent": "doi",
        "name": "Online Tourist Visa Extension",
        "type": "service",
        "category": "Security & Civil Administration",
        "description": "Online application for foreign tourists to extend their legal stay in Nepal.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Passport scan;Current Visa details;Online payment confirmation"
    },
    {
        "id": "trekking_permit_restricted",
        "parent": "doi",
        "name": "Restricted Area Trekking Permit",
        "type": "service",
        "category": "Security & Civil Administration",
        "description": "Issuance of special trekking permits for foreigners seeking to trek in restricted frontier zones (Upper Mustang, Manaslu, Dolpo).",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Passport Copy;Valid Visa Copy;Trekking Agency credentials;Authorized Guide details"
    },
    {
        "id": "dao",
        "parent": "moha",
        "name": "District Administration Office (DAO)",
        "type": "department",
        "category": "Security & Civil Administration",
        "description": "The administrative office representing the home ministry in each of the 77 districts, issuing identities and managing local security.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "citizenship_certificate_issuance",
        "parent": "dao",
        "name": "Citizenship Certificate (Nagarikta) Issuance",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Application and formal physical verification for the issuance of the basic national identity document.",
        "digitized_status": "Manual",
        "nagarik_app": True,
        "required_documents": "Parents' Citizenship Certificates;Local Ward Recommendation;Birth Certificate;Academic certificate (optional)"
    },
    {
        "id": "citizenship_duplicate_issuance",
        "parent": "dao",
        "name": "Request Duplicate Citizenship (Pratilipi)",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Application for a duplicate citizenship certificate in case of loss, damage, or correction of the original.",
        "digitized_status": "Manual",
        "nagarik_app": False,
        "required_documents": "Police report of lost card;Ward Recommendation;Copy of original citizenship (if available);Passport Photos"
    },
    {
        "id": "organization_ngo_registration",
        "parent": "dao",
        "name": "NGO & Organization Registration and Renewal",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Process for registering and renewing non-profit organizations, social clubs, and NGOs at the district level.",
        "digitized_status": "Manual",
        "nagarik_app": False,
        "required_documents": "Organization Constitution;Founder list & passports;Rent agreement;Police character reports of founders;Ward approval"
    },

    # --- MINISTRY 2: MINISTRY OF FINANCE (MoF) ---
    {
        "id": "mof",
        "parent": "opmcm",
        "name": "Ministry of Finance",
        "type": "ministry",
        "category": "Finance & Revenue",
        "description": "Manages treasury operations, prepares annual budget, designs monetary policy targets, and oversees tax policy.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "ird",
        "parent": "mof",
        "name": "Inland Revenue Department (IRD)",
        "type": "department",
        "category": "Finance & Revenue",
        "description": "Administers income tax, VAT, excise duty, and generates tax revenues for the state.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "personal_pan_registration",
        "parent": "ird",
        "name": "Personal PAN Registration",
        "type": "service",
        "category": "Finance & Revenue",
        "description": "Online application for a Permanent Account Number (PAN) required for jobs, banking, and professional work.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Citizenship Certificate Copy;Passport Photo;National ID (if available)"
    },
    {
        "id": "income_tax_filing",
        "parent": "ird",
        "name": "Income Tax Return Filing (D-1, D-2, D-3)",
        "type": "service",
        "category": "Finance & Revenue",
        "description": "Online portal for individuals and entities to declare annual income, calculate tax, and file returns.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "PAN details;Bank accounts;Salary statement/Income evidence;Tax deduction receipts"
    },
    {
        "id": "tax_clearance_certificate",
        "parent": "ird",
        "name": "Online Tax Clearance Certificate",
        "type": "service",
        "category": "Finance & Revenue",
        "description": "Request and generate a certified document proving all tax liabilities have been resolved for the fiscal year.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "PAN;Tax return submission confirmation;Payment receipt"
    },
    {
        "id": "doc",
        "parent": "mof",
        "name": "Department of Customs",
        "type": "department",
        "category": "Finance & Revenue",
        "description": "Enforces customs laws, collects custom duties, and regulates cross-border trade flow.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "exim_code_registration",
        "parent": "doc",
        "name": "EXIM Code Registration and Renewal",
        "type": "service",
        "category": "Finance & Revenue",
        "description": "Online registration of Export-Import Code (EXIM) mandatory for carrying out international trade.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Company registration certificate;PAN/VAT certificate;Bank guarantee (minimum NPR 3-10 Lakhs);Rent agreement"
    },
    {
        "id": "fcgo",
        "parent": "mof",
        "name": "Financial Comptroller General Office (FCGO)",
        "type": "department",
        "category": "Finance & Revenue",
        "description": "Oversees government accounting, budget execution records, internal audit coordination, and civil service pensions.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "government_revenue_epayment",
        "parent": "fcgo",
        "name": "Government Revenue e-Payment Portal",
        "type": "service",
        "category": "Finance & Revenue",
        "description": "Unified online platform to pay taxes, service charges, passport fees, and license fees to various offices.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Billing reference code/Voucher"
    },

    # --- MINISTRY 3: MINISTRY OF FOREIGN AFFAIRS (MoFA) ---
    {
        "id": "mofa",
        "parent": "opmcm",
        "name": "Ministry of Foreign Affairs",
        "type": "ministry",
        "category": "Diplomacy & International Relations",
        "description": "Implements foreign policy, maintains diplomatic relations, and manages services for citizens traveling or working abroad.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "department_of_passport",
        "parent": "mofa",
        "name": "Department of Passport (DoP)",
        "type": "department",
        "category": "Diplomacy & International Relations",
        "description": "Designated authority for issuing Machine Readable and Electronic Passports (e-Passports).",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "epassport_pre_enrollment",
        "parent": "department_of_passport",
        "name": "e-Passport Pre-Enrollment & Appointment Booking",
        "type": "service",
        "category": "Diplomacy & International Relations",
        "description": "Mandatory online application form and biometric appointment selection for e-Passport issuance.",
        "digitized_status": "Partially Online",
        "nagarik_app": True,
        "required_documents": "National ID Number (NID);Citizenship Certificate;Old Passport (if renewing);Payment Voucher"
    },
    {
        "id": "passport_status_tracking",
        "parent": "department_of_passport",
        "name": "Passport Status Tracking",
        "type": "service",
        "category": "Diplomacy & International Relations",
        "description": "Track the print status, dispatch, and delivery location of pre-booked passport applications.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Application Reference Number or Passport Number"
    },
    {
        "id": "consular_services",
        "parent": "mofa",
        "name": "Department of Consular Services",
        "type": "department",
        "category": "Diplomacy & International Relations",
        "description": "Provides notarization verification, legal document attestation, and coordinates rescue of Nepalese citizens abroad.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "document_attestation",
        "parent": "consular_services",
        "name": "Online Consular Document Attestation",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Submitting personal and academic documents for MoFA attestation prior to abroad use. Verified online via integration with line departments.",
        "digitized_status": "Partially Online",
        "nagarik_app": True,
        "required_documents": "Original Document to attest;Notarized translation copy;Citizenship copy;Application voucher"
    },
    {
        "id": "repatriation_and_rescue",
        "parent": "consular_services",
        "name": "Citizen Repatriation and Rescue Coordination",
        "type": "service",
        "category": "Diplomacy & International Relations",
        "description": "Register requests for rescue, legal aid, or repatriation of Nepalese workers stranded, jailed, or in distress abroad.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Passport Copy;Visa/Labor Permit Copy;Description of distress;Employer details"
    },

    # --- MINISTRY 4: MINISTRY OF ENERGY, WATER RESOURCES AND IRRIGATION (MoEWRI) ---
    {
        "id": "moewri",
        "parent": "opmcm",
        "name": "Ministry of Energy, Water Resources and Irrigation",
        "type": "ministry",
        "category": "Energy & Infrastructure",
        "description": "Manages Nepal's massive hydropower potential, power grid distribution, water resource conservation, and irrigation channels.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "nea",
        "parent": "moewri",
        "name": "Nepal Electricity Authority (NEA)",
        "type": "department",
        "category": "Energy & Infrastructure",
        "description": "The national utility company responsible for generation, transmission, and distribution of electricity across Nepal.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "electricity_bill_payment",
        "parent": "nea",
        "name": "Electricity Bill Inquiry & Payment",
        "type": "service",
        "category": "Utility Payments",
        "description": "Search monthly electricity consumption bills and pay online via multiple digital payment gateways.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "NEA Consumer ID;Counter office name"
    },
    {
        "id": "new_electricity_connection",
        "parent": "nea",
        "name": "Apply for New Meter/Connection",
        "type": "service",
        "category": "Utility Payments",
        "description": "Online application for a new electricity connection line or upgrade to 3-phase/industrial connection lines.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Land ownership Lalpurja;Citizenship Certificate;Ward Recommendation;No-Objection statement from neighbor"
    },

    # --- MINISTRY 5: MINISTRY OF INFRASTRUCTURE DEVELOPMENT (MoID) ---
    {
        "id": "moid",
        "parent": "opmcm",
        "name": "Ministry of Infrastructure Development",
        "type": "ministry",
        "category": "Transportation & Infrastructure",
        "description": "Develops public road systems, manages transport networks, registers motor vehicles, and licenses drivers.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "dotm",
        "parent": "moid",
        "name": "Department of Transport Management (DoTM)",
        "type": "department",
        "category": "Transportation & Infrastructure",
        "description": "Regulates licensing of vehicle drivers, registers private and commercial motor vehicles, and monitors transport operators.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "driving_license_preenrollment",
        "parent": "dotm",
        "name": "Driving License Application & Exam Slot Booking",
        "type": "service",
        "category": "Transportation & Infrastructure",
        "description": "Apply for a new driving license category, fill out the form online, and book dates for the medical/exam tests.",
        "digitized_status": "Partially Online",
        "nagarik_app": True,
        "required_documents": "Citizenship copy;Blood Group report;Passport photo;Citizenship original (during test)"
    },
    {
        "id": "driving_license_renewal",
        "parent": "dotm",
        "name": "Driving License Renewal Application",
        "type": "service",
        "category": "Transportation & Infrastructure",
        "description": "Submit driving license renewal form online, calculate renewal fees, and check pending traffic fines.",
        "digitized_status": "Partially Online",
        "nagarik_app": True,
        "required_documents": "Original Driving License;Health Certificate (certified by registered physician);Payment receipt"
    },
    {
        "id": "vehicle_tax_bluebook_renewal",
        "parent": "dotm",
        "name": "Vehicle Tax and Bluebook Renewal",
        "type": "service",
        "category": "Utility Payments",
        "description": "Check annual vehicle road tax, pay online, and schedule physical bluebook endorsement at transport offices.",
        "digitized_status": "Partially Online",
        "nagarik_app": True,
        "required_documents": "Vehicle Bluebook details;Third-party insurance certificate;PAN (for commercial vehicles)"
    },
    {
        "id": "embossed_plate_application",
        "parent": "dotm",
        "name": "Embossed Number Plate Registration",
        "type": "service",
        "category": "Transportation & Infrastructure",
        "description": "Apply for the mandatory RFID-based embossed number plate for vehicles, submit fees, and book fitment appointment.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Bluebook Copy;Tax Clearance receipt;Citizenship Certificate;Fitment fee voucher"
    },

    # --- MINISTRY 6: MINISTRY OF LAW, JUSTICE AND PARLIAMENTARY AFFAIRS (MoLJPA) ---
    {
        "id": "moljpa",
        "parent": "opmcm",
        "name": "Ministry of Law, Justice and Parliamentary Affairs",
        "type": "ministry",
        "category": "Law & Justice",
        "description": "Oversees the judicial system, drafts bills, publishes acts in the Nepal Gazette, and regulates the Notary Public Council.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "notary_public_council",
        "parent": "moljpa",
        "name": "Nepal Notary Public Council",
        "type": "department",
        "category": "Law & Justice",
        "description": "Licensing authority for Notaries Public to translate, authenticate, and verify official citizen documents.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "notarization_services",
        "parent": "notary_public_council",
        "name": "Notarization & Document Certification",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Formal certification of document photocopies as 'true copies' by a licensed notary public for official applications.",
        "digitized_status": "Manual",
        "nagarik_app": False,
        "required_documents": "Original Document;Photocopy to be certified;ID proof of requestor"
    },
    {
        "id": "document_translation_certified",
        "parent": "notary_public_council",
        "name": "Certified Document Translation",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Translating official documents (Citizenship, Birth certificates, Marksheets) from Nepali to English by a council-licensed translator.",
        "digitized_status": "Manual",
        "nagarik_app": False,
        "required_documents": "Original Nepali Document;Translator Fee"
    },
    {
        "id": "verify_notary_license",
        "parent": "notary_public_council",
        "name": "Verify Notary Public License",
        "type": "service",
        "category": "Law & Justice",
        "description": "Search directory to verify if a Notary Public is registered and legally authorized to authenticate documents.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Notary Name or License Number"
    },

    # --- MINISTRY 7: MINISTRY OF SCIENCE, TECHNOLOGY AND INNOVATION (MoSTI) ---
    {
        "id": "mosti",
        "parent": "opmcm",
        "name": "Ministry of Science, Technology and Innovation",
        "type": "ministry",
        "category": "Science & Technology",
        "description": "Promotes scientific research, coordinates digital transformation, and formulates cybersecurity/IT frameworks.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "doit",
        "parent": "mosti",
        "name": "Department of Information Technology (DoIT)",
        "type": "department",
        "category": "Science & Technology",
        "description": "Primary department executing government IT policies, managing the National G-Cloud, and issuing digital signature certificates.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "digital_signature_issuance",
        "parent": "doit",
        "name": "Digital Signature Certificate (DSC) Issuance",
        "type": "service",
        "category": "Science & Technology",
        "description": "Issuance of cryptographic digital signature keys to secure online transactions, bidding, and filing for businesses and officials.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Citizenship copy;Company Registration (for business keys);Application form;Biometric validation"
    },

    # --- MINISTRY 8: MINISTRY OF WOMEN, CHILDREN, GENDER & SEXUAL MINORITIES AND SOCIAL SECURITY (MoWCGMSS) ---
    {
        "id": "mowcgmss",
        "parent": "opmcm",
        "name": "Ministry of Women, Children, Gender & Sexual Minorities and Social Security",
        "type": "ministry",
        "category": "Social Protection & Welfare",
        "description": "Ensures the protection of human rights of marginalized genders, children, elder citizens, and implements federal social assistance.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "doss",
        "parent": "mowcgmss",
        "name": "Department of Social Security",
        "type": "department",
        "category": "Social Protection & Welfare",
        "description": "Coordinates funding, eligibility, and cash transfer channels for citizen social security allowances.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "social_security_allowance_apply",
        "parent": "doss",
        "name": "Social Security Allowance Registration",
        "type": "service",
        "category": "Social Protection & Welfare",
        "description": "Apply for senior citizen cash allowance, single women/widow allowance, or disability allowance at the local ward office.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Citizenship Certificate;Disability Card (for disability allowance);Proof of age (70+ / 60+ in designated zones);Ward Recommendation"
    },

    # --- MINISTRY 9: MINISTRY OF LAND MANAGEMENT, COOPERATIVES, FEDERAL AFFAIRS AND GENERAL ADMINISTRATION (MoLMCFAGA) ---
    {
        "id": "molmcfaga",
        "parent": "opmcm",
        "name": "Ministry of Land Management, Cooperatives, Federal Affairs and General Administration",
        "type": "ministry",
        "category": "Land, Local Gov & Administration",
        "description": "Coordinates civil service administration, manages relations with 753 local municipal bodies, oversees land reforms, surveys, and cooperative frameworks.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "dolrm",
        "parent": "molmcfaga",
        "name": "Department of Land Reform and Management (Land Revenue / Malpot)",
        "type": "department",
        "category": "Land, Local Gov & Administration",
        "description": "Responsible for managing land records, land registration, deed execution, property transfers, and land taxation.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "land_ownership_lalpurja_lookup",
        "parent": "dolrm",
        "name": "Land Ownership (Lalpurja) Records Inquiry",
        "type": "service",
        "category": "Land, Local Gov & Administration",
        "description": "Online search of land registry records to verify ownership details, plot boundaries, and transaction history.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Lalpurja details (District, VDC/Municipality, Ward, Sheet No, Plot/Kitta No);PAN or Citizenship No"
    },
    {
        "id": "property_mortgage_rokka_fukua",
        "parent": "dolrm",
        "name": "Property Mortgage Registration & Release (Rokka / Fukua)",
        "type": "service",
        "category": "Land, Local Gov & Administration",
        "description": "Registration of land mortgage with banks/financial institutions and formal release of land records after loan clearance.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Lalpurja;Citizenship;Bank Loan approval document;Property Valuation report"
    },
    {
        "id": "survey_department",
        "parent": "molmcfaga",
        "name": "Department of Survey (Napi)",
        "type": "department",
        "category": "Land, Local Gov & Administration",
        "description": "Maintains cadastral maps, establishes geodetic reference networks, and defines national boundaries.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "mero_kitta_maps",
        "parent": "survey_department",
        "name": "Mero Kitta Cadastral Map Printing",
        "type": "service",
        "category": "Land, Local Gov & Administration",
        "description": "Online platform to view, pay for, and download print-ready cadastral maps (Kitta Kaat) and field books without visiting the Napi office.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Lalpurja details;Citizenship Number;Payment Voucher"
    },
    {
        "id": "local_municipalities",
        "parent": "molmcfaga",
        "name": "753 Local Municipalities and Rural Wards",
        "type": "department",
        "category": "Land, Local Gov & Administration",
        "description": "Decentralized local governments responsible for neighborhood infrastructure, local taxation, and vital recommendation letters.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "local_property_tax_payment",
        "parent": "local_municipalities",
        "name": "Local Property and Land Tax Payment",
        "type": "service",
        "category": "Utility Payments",
        "description": "Online payment of local municipal property taxes, rental taxes, and land revenue (Malpot tax) via local e-governance systems.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Lalpurja Copy;Previous Tax receipt;PAN (optional)"
    },
    {
        "id": "house_map_approval_naksa",
        "parent": "local_municipalities",
        "name": "Building Construction Map Approval (Naksa Pass)",
        "type": "service",
        "category": "Land, Local Gov & Administration",
        "description": "Electronic building permit system (e-BPS) to submit blueprint maps, get clearances, and obtain construction permission certificates.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Lalpurja;Land Survey map;Cadastral print;Structural blueprints (certified by architect);Citizenship Certificate"
    },
    {
        "id": "wada_sifarish_relationship",
        "parent": "local_municipalities",
        "name": "Relationship Verification Certificate (Nata Pramanit)",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Official recommendation letter verifying blood relationships between family members (vital for visa applications, property transfer).",
        "digitized_status": "Partially Online",
        "nagarik_app": True,
        "required_documents": "Citizenship certificates of all members;Birth certificates;Passport size photos;Witness statements"
    },
    {
        "id": "wada_sifarish_income",
        "parent": "local_municipalities",
        "name": "Annual Income Verification Recommendation",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Local ward recommendation verifying the family's annual income sources (agriculture, business, salary) for scholarship or visa purposes.",
        "digitized_status": "Partially Online",
        "nagarik_app": True,
        "required_documents": "Land Lalpurja (for agri income);Salary certificate;Audit reports of business;Tax receipts"
    },

    # --- MINISTRY 10: MINISTRY OF HEALTH AND FOOD HYGIENE (MoHFH) ---
    {
        "id": "mohfh",
        "parent": "opmcm",
        "name": "Ministry of Health and Food Hygiene",
        "type": "ministry",
        "category": "Health & Nutrition",
        "description": "Regulates hospitals, public health targets, medical research, pharmaceutical manufacturing, and ensures food/nutrition safety.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "department_of_health_services",
        "parent": "mohfh",
        "name": "Department of Health Services",
        "type": "department",
        "category": "Health & Nutrition",
        "description": "Executes public health programs, vaccination campaigns, child health initiatives, and oversees government hospitals.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "vaccine_qr_certification",
        "parent": "department_of_health_services",
        "name": "Immunization/Vaccine QR Code Certification",
        "type": "service",
        "category": "Health & Nutrition",
        "description": "Generate digitally verifiable vaccine certificate with a secure QR code (critical for travel and child school admissions).",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Immunization card scan;Citizenship/Passport Copy;Mobile Number"
    },
    {
        "id": "health_insurance_board",
        "parent": "mohfh",
        "name": "Health Insurance Board (HIB)",
        "type": "department",
        "category": "Health & Nutrition",
        "description": "Implements the government-backed social health insurance scheme to guarantee affordable access to medical services.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "health_insurance_enrollment",
        "parent": "health_insurance_board",
        "name": "Health Insurance Enrollment & Renewal",
        "type": "service",
        "category": "Health & Nutrition",
        "description": "Register family members under the national health insurance card, pay premium contributions, and track coverage limits.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Citizenship/Birth Certificates of all members;Family photo;Premium payment voucher"
    },

    # --- MINISTRY 11: MINISTRY OF EDUCATION AND SPORTS (MoES) ---
    {
        "id": "moes",
        "parent": "opmcm",
        "name": "Ministry of Education and Sports",
        "type": "ministry",
        "category": "Education & Sports",
        "description": "Formulates educational laws, administers federal exams, regulates higher universities, and supports national sports activities.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "foreign_study_permission",
        "parent": "moes",
        "name": "Foreign Study Permission Section (NOC Section)",
        "type": "department",
        "category": "Education & Sports",
        "description": "Verifies students going abroad and issues the mandatory No Objection Letter for foreign currency exchange and visa.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "no_objection_certificate_noc",
        "parent": "foreign_study_permission",
        "name": "No Objection Certificate (NOC) for Abroad Studies",
        "type": "service",
        "category": "Education & Sports",
        "description": "Complete online application, document verification, and e-payment to obtain an NOC letter.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Citizenship Certificate;Academic Transcripts (SLC/SEE, +2, or Bachelor's);Offer letter from foreign university;Application fee receipt"
    },
    {
        "id": "curriculum_development_centre",
        "parent": "moes",
        "name": "Curriculum Development Centre (CDC)",
        "type": "department",
        "category": "Education & Sports",
        "description": "Formulates school-level curriculum and certifies educational equivalence of foreign school-level boards (like CBSE, GCSE).",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "academic_equivalency_certificate",
        "parent": "curriculum_development_centre",
        "name": "Educational Degree/Board Equivalency Certificate",
        "type": "service",
        "category": "Education & Sports",
        "description": "Evaluation and formal issuance of equivalency for foreign academic boards/degrees compared to Nepalese standards.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Original Transcripts and Character certificates;Syllabus of the studied course;Passport and visa copy;Equivalency fee payment"
    },

    # --- MINISTRY 12: MINISTRY OF CULTURE, TOURISM AND CIVIL AVIATION (MoCTCA) ---
    {
        "id": "moctca",
        "parent": "opmcm",
        "name": "Ministry of Culture, Tourism and Civil Aviation",
        "type": "ministry",
        "category": "Culture & Tourism",
        "description": "Governs civil aviation rules, promotes cultural archives, registers hotels, and controls mountaineering/trekking licenses.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "department_of_tourism",
        "parent": "moctca",
        "name": "Department of Tourism (DoT)",
        "type": "department",
        "category": "Culture & Tourism",
        "description": "Regulatory body for registering hotels, travel agencies, tour guides, and issuing climbing permits for high peaks.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "mountaineering_climbing_permit",
        "parent": "department_of_tourism",
        "name": "Mountaineering Climbing Permit Application",
        "type": "service",
        "category": "Culture & Tourism",
        "description": "Online application for peak climbing permissions (Everest, Lhotse, Ama Dablam) for expeditions.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Climber Biodata;Medical fitness certificate;Insurance;Liaison Officer details;Expedition fee receipt"
    },
    {
        "id": "caan",
        "parent": "moctca",
        "name": "Civil Aviation Authority of Nepal (CAAN)",
        "type": "department",
        "category": "Culture & Tourism",
        "description": "The independent regulator of civil aviation and airport operations across Nepal.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "drone_flying_permit",
        "parent": "caan",
        "name": "Drone Registration & Flight Permit",
        "type": "service",
        "category": "Culture & Tourism",
        "description": "Registration of unmanned aerial vehicles (UAVs/Drones) and seeking flight approval for specified zones and timeframes.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Drone specification sheet;Passport/Citizenship Copy;Purpose and map of target area;Security Clearance recommendation"
    },

    # --- MINISTRY 13: MINISTRY OF INFORMATION AND COMMUNICATION (MoIC) ---
    {
        "id": "moic",
        "parent": "opmcm",
        "name": "Ministry of Information and Communication",
        "type": "ministry",
        "category": "Information & Telecommunication",
        "description": "Regulates the telecom sector, broadcasting media licenses, postal systems, and cyber networks.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "nta",
        "parent": "moic",
        "name": "Nepal Telecommunications Authority (NTA)",
        "type": "department",
        "category": "Information & Telecommunication",
        "description": "The autonomous regulatory body for telecommunications, ISP licensing, frequency allocations, and consumer protection.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "mdms_registration",
        "parent": "nta",
        "name": "Mobile Device Management System (MDMS) Registration",
        "type": "service",
        "category": "Information & Telecommunication",
        "description": "Registering the IMEI of foreign-purchased mobile phones to whitelist them for Nepalese SIM networks.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Device IMEI Number;Passport copy (showing arrival stamp) or Customs declaration receipt"
    },
    {
        "id": "department_of_information_broadcasting",
        "parent": "moic",
        "name": "Department of Information and Broadcasting (DoIB)",
        "type": "department",
        "category": "Information & Telecommunication",
        "description": "Issues official press credentials and registers/renews internet news portals and television/radio licenses.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "press_card_issuance",
        "parent": "department_of_information_broadcasting",
        "name": "Journalist Press Representative Card Issuance",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Formal vetting and card issuance for working media journalists to access governmental briefings.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Appointment letter from media;Academic certificate copy;Recommendation from chief editor;Citizenship copy"
    },
    {
        "id": "online_media_portal_registration",
        "parent": "department_of_information_broadcasting",
        "name": "Online News Portal Registration & Renewal",
        "type": "service",
        "category": "Identity & Legal Certificates",
        "description": "Licensing process for digital news sites to operate legally inside Nepal.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Company registration certificate;Editor qualification details;PAN/VAT card;Domain name receipt"
    },

    # --- MINISTRY 14: MINISTRY OF AGRICULTURE, FORESTS AND ENVIRONMENT (MoAFE) ---
    {
        "id": "moafe",
        "parent": "opmcm",
        "name": "Ministry of Agriculture, Forests and Environment",
        "type": "ministry",
        "category": "Agriculture & Environment",
        "description": "Develops farming initiatives, monitors environmental pollution levels, manages biodiversity reserves, and executes climate policies.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "department_of_environment",
        "parent": "moafe",
        "name": "Department of Environment",
        "type": "department",
        "category": "Agriculture & Environment",
        "description": "Formulates environmental standards, reviews EIAs, and enforces pollution control measures.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "pollution_clearance_eia",
        "parent": "department_of_environment",
        "name": "Environmental Impact Assessment (EIA) Review & Pollution Clearance",
        "type": "service",
        "category": "Agriculture & Environment",
        "description": "Clearance certification required for factories, hydropowers, and hotels showing compliance with noise, air, and waste regulations.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "EIA/IEE report booklet;Land papers;Local ward recommendation;Technical specifications"
    },

    # --- MINISTRY 15: MINISTRY OF INDUSTRY, COMMERCE AND SUPPLIES (MoICS) ---
    {
        "id": "moics",
        "parent": "opmcm",
        "name": "Ministry of Industry, Commerce and Supplies",
        "type": "ministry",
        "category": "Industry & Commerce",
        "description": "Supports commercial ventures, coordinates bilateral trade treaties, manages supply lines, and registers companies.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "ocr",
        "parent": "moics",
        "name": "Office of the Company Registrar (OCR)",
        "type": "department",
        "category": "Industry & Commerce",
        "description": "Designated authority for registering private/public limited businesses and partnerships.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "company_incorporation",
        "parent": "ocr",
        "name": "Company Incorporation Registration",
        "type": "service",
        "category": "Investment & Business",
        "description": "Online application to register a new private/public company, including name reservation, article submission, and fee payment.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Reserved Company Name;Memorandum of Association (MoA);Articles of Association (AoA);Citizenship copies of founders;Witness signatures"
    },
    {
        "id": "company_share_transfer_filing",
        "parent": "ocr",
        "name": "Filing of Company Board Changes & Share Transfers",
        "type": "service",
        "category": "Investment & Business",
        "description": "Digital submission of annual shareholder resolutions, transfer of stock, change in company directors, and address modifications.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Board Resolution copy;Share transfer agreement deed;Tax clearance;Audited balance sheet"
    },

    # --- MINISTRY 16: MINISTRY OF YOUTH, LABOUR AND EMPLOYMENT (MoYLE) ---
    {
        "id": "moyle",
        "parent": "opmcm",
        "name": "Ministry of Youth, Labour and Employment",
        "type": "ministry",
        "category": "Labour & Employment",
        "description": "Regulates local and foreign employment, administers contribution-based social security, and supports youth vocational plans.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "dofe",
        "parent": "moyle",
        "name": "Department of Foreign Employment (DoFE)",
        "type": "department",
        "category": "Labour & Employment",
        "description": "Administers labor migrations, registers foreign recruitment agencies, and issues overseas work permits.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "foreign_labor_permit",
        "parent": "dofe",
        "name": "Foreign Labor Permit (Shram Suwikriti)",
        "type": "service",
        "category": "Labour & Employment",
        "description": "Mandatory online application via FEIMS for new or renewal labor permits for Nepalese citizens seeking work abroad.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "Passport;Valid Foreign Visa;Employment Agreement;Welfare fund fee receipt;Pre-departure insurance;Medical clearance"
    },
    {
        "id": "ssf",
        "parent": "moyle",
        "name": "Social Security Fund (SSF)",
        "type": "department",
        "category": "Labour & Employment",
        "description": "Manages national contribution-based social security funds for medical, maternity, disability, and retirement.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "ssf_contribution_tracking",
        "parent": "ssf",
        "name": "Social Security Contribution Tracking",
        "type": "service",
        "category": "Labour & Employment",
        "description": "Check monthly contribution allocations deposited by employers or self-employed individuals into the social security fund.",
        "digitized_status": "Fully Online",
        "nagarik_app": True,
        "required_documents": "SSF Identity Number;PAN or Citizenship Number"
    },
    {
        "id": "pmep",
        "parent": "moyle",
        "name": "Prime Minister Employment Programme (PMEP)",
        "type": "department",
        "category": "Labour & Employment",
        "description": "Administers localized employment opportunities and cash benefits for unemployed families.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "unemployed_registration_pmep",
        "parent": "pmep",
        "name": "Unemployed Citizen Registration",
        "type": "service",
        "category": "Labour & Employment",
        "description": "Online/offline registration by unemployed citizens at local ward offices to secure 100 days of work or unemployment subsistence grants.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Citizenship copy;Self-declaration of family income;Ward verification stamp"
    },

    # --- MINISTRY 17: MINISTRY OF DEFENCE (MoD) ---
    {
        "id": "mod",
        "parent": "opmcm",
        "name": "Ministry of Defence",
        "type": "ministry",
        "category": "Defence",
        "description": "Coordinates national security agencies, formulates defense strategies, and oversees military operations.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "nepalese_army",
        "parent": "mod",
        "name": "Nepalese Army (Jangi Adda)",
        "type": "department",
        "category": "Defence",
        "description": "The defense force responsible for national sovereignty protection, military peacekeeping, and rescue missions.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "military_recruitment_application",
        "parent": "nepalese_army",
        "name": "Military Officer/Soldier Online Recruitment",
        "type": "service",
        "category": "Employment & Recruitment",
        "description": "Submission of physical and academic application forms online for joining the Nepalese Army ranks.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Citizenship certificate;Academic transcripts;Character Certificate;Passport Photos"
    },

    # --- GLOBAL BENCHMARK SERVICES PORTALS ---
    {
        "id": "global_benchmarks",
        "parent": "opmcm",
        "name": "Global Benchmark Services (International Integrations)",
        "type": "benchmark_portal",
        "category": "Global Best Practices",
        "description": "Benchmark services and portals from successful global e-governance systems to guide the MyGov upgrade.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    
    # 1. ASAN Xidmət (Azerbaijan)
    {
        "id": "asan_xidmet",
        "parent": "global_benchmarks",
        "name": "ASAN Xidmət (Azerbaijan One-Stop-Shop)",
        "type": "benchmark_portal",
        "category": "Global Best Practices",
        "description": "State agency for public services to citizens under the President of Azerbaijan, famous for high efficiency and one-stop centers.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "asan_id_passports",
        "parent": "asan_xidmet",
        "name": "ASAN Identity and Passports Issuance",
        "type": "benchmark_service",
        "category": "Identity & Legal Certificates",
        "description": "Unified desk service where citizenship IDs and foreign travel passports are processed and handed over within minutes/hours.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Application Form;Birth certificate or old ID;State fee voucher"
    },
    {
        "id": "asan_notary",
        "parent": "asan_xidmet",
        "name": "ASAN Unified Notary & Document Certification",
        "type": "benchmark_service",
        "category": "Identity & Legal Certificates",
        "description": "Integrated notarial system for quick validation, attorney setups, and certified translation stamps in one office visit.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Original Documents;Identification proof"
    },
    {
        "id": "asan_real_estate",
        "parent": "asan_xidmet",
        "name": "ASAN Real Estate Registry & Land Title Deeds",
        "type": "benchmark_service",
        "category": "Land, Local Gov & Administration",
        "description": "Integrated registry desk for instant transfer of real estate titles and property evaluation notes.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Sales Deed;Property ID;Seller and Buyer IDs;Fee payment receipt"
    },
    {
        "id": "asan_pay",
        "parent": "asan_xidmet",
        "name": "ASAN Pay (Unified State Payment Portal)",
        "type": "benchmark_service",
        "category": "Finance & Revenue",
        "description": "Standardized payment network for paying all government fees, court fines, traffic tickets, and utility payments.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Billing Invoice number or fine token"
    },
    {
        "id": "asan_kommunal",
        "parent": "asan_xidmet",
        "name": "ASAN Kommunal (Unified Utility Desk)",
        "type": "benchmark_service",
        "category": "Utility Payments",
        "description": "Merged service counters for gas, electricity, and water meters, supporting installations and bill clearing.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Subscriber Account details;ID proof"
    },
    {
        "id": "asan_mobile",
        "parent": "asan_xidmet",
        "name": "Mobile ASAN (Buses & Trains Outreach)",
        "type": "benchmark_service",
        "category": "Global Best Practices",
        "description": "Customized buses and trains equipped with satellite links and office counters traveling to remote areas to deliver services.",
        "digitized_status": "Partially Online",
        "nagarik_app": False,
        "required_documents": "Varies by target service (Citizenship, Passport, etc.)"
    },
    
    # 2. e-Estonia (Estonia)
    {
        "id": "e_estonia",
        "parent": "global_benchmarks",
        "name": "e-Estonia (Estonian Digital State Portal)",
        "type": "benchmark_portal",
        "category": "Global Best Practices",
        "description": "The world's most advanced digital society, where 99% of government services are available online 24/7.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "estonia_eresidency",
        "parent": "e_estonia",
        "name": "Estonian e-Residency Digital Identity",
        "type": "benchmark_service",
        "category": "Identity & Legal Certificates",
        "description": "Transnational digital identity card issued to global citizens, allowing them to establish and run an EU-based business online.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Passport scan;Motivation statement;Credit Card payment;Biometric collection at embassy"
    },
    {
        "id": "estonia_evoting",
        "parent": "e_estonia",
        "name": "e-Voting (i-Voting Remote Election System)",
        "type": "benchmark_service",
        "category": "Democracy & Elections",
        "description": "Secure internet voting system allowing citizens to cast ballots from anywhere in the world during elections.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Estonian Smart ID Card or Mobile-ID;PIN Codes"
    },
    {
        "id": "estonia_ehealth",
        "parent": "e_estonia",
        "name": "Electronic Health Record (EHR) & e-Prescriptions",
        "type": "benchmark_service",
        "category": "Health & Nutrition",
        "description": "Secure blockchain-backed patient records portal sharing diagnostic history and automated electronic medical prescriptions.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Digital ID login"
    },
    
    # 3. Singpass (Singapore)
    {
        "id": "singpass_singapore",
        "parent": "global_benchmarks",
        "name": "Singpass (Singapore National Digital Identity)",
        "type": "benchmark_portal",
        "category": "Global Best Practices",
        "description": "Singapore's trusted digital identity app containing credentials and personal profiles of residents.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "singpass_myinfo",
        "parent": "singpass_singapore",
        "name": "MyInfo Consent-Based Data Sharing API",
        "type": "benchmark_service",
        "category": "Identity & Legal Certificates",
        "description": "Personal data platform allowing users to consent to pre-fill forms automatically for government and private banking services.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Singpass App credentials;User explicit biometric consent"
    },
    {
        "id": "singpass_signing",
        "parent": "singpass_singapore",
        "name": "Singpass Sign (Digital Contract Signing)",
        "type": "benchmark_service",
        "category": "Identity & Legal Certificates",
        "description": "Secure legal signing of business documents and property loans using cryptographic signatures validated by Singpass.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Document PDF;Singpass App scanner"
    },
    
    # 4. DigiLocker (India)
    {
        "id": "digilocker_india",
        "parent": "global_benchmarks",
        "name": "DigiLocker (Indian Digital Document Wallet)",
        "type": "benchmark_portal",
        "category": "Global Best Practices",
        "description": "India's cloud document storage and verification system delivering legally valid digital certificates.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "N/A"
    },
    {
        "id": "digilocker_wallet",
        "parent": "digilocker_india",
        "name": "DigiLocker Document Wallet & Verifier",
        "type": "benchmark_service",
        "category": "Identity & Legal Certificates",
        "description": "Storage and instant retrieval of academic boards transcripts, driver licenses, and insurance deeds directly verified by issuing authorities.",
        "digitized_status": "Fully Online",
        "nagarik_app": False,
        "required_documents": "Aadhaar Card Link;OTP Verification"
    }
]

# Helper function to generate valid XML GraphML
def build_graphml(output_path):
    ET.register_namespace('', "http://graphml.graphdrawing.org/xmlns")
    root = ET.Element("graphml", {
        "xmlns": "http://graphml.graphdrawing.org/xmlns",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:schemaLocation": "http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd"
    })
    
    keys = [
        {"id": "name", "for": "node", "name": "name", "type": "string"},
        {"id": "type", "for": "node", "name": "type", "type": "string"},
        {"id": "category", "for": "node", "name": "category", "type": "string"},
        {"id": "description", "for": "node", "name": "description", "type": "string"},
        {"id": "digitized_status", "for": "node", "name": "digitized_status", "type": "string"},
        {"id": "nagarik_app", "for": "node", "name": "nagarik_app", "type": "boolean"},
        {"id": "required_documents", "for": "node", "name": "required_documents", "type": "string"}
    ]
    
    for k in keys:
        ET.SubElement(root, "key", {
            "id": k["id"],
            "for": k["for"],
            "attr.name": k["name"],
            "attr.type": k["type"]
        })
        
    graph = ET.SubElement(root, "graph", {"id": "G", "edgedefault": "directed"})
    
    for node in nodes_data:
        n_elem = ET.SubElement(graph, "node", {"id": node["id"]})
        properties = [
            ("name", node["name"]),
            ("type", node["type"]),
            ("category", node["category"]),
            ("description", node["description"]),
            ("digitized_status", node["digitized_status"]),
            ("nagarik_app", str(node["nagarik_app"]).lower()),
            ("required_documents", node.get("required_documents", "N/A"))
        ]
        for k, v in properties:
            d_elem = ET.SubElement(n_elem, "data", {"key": k})
            d_elem.text = v
            
    edge_counter = 1
    for node in nodes_data:
        if node["parent"]:
            ET.SubElement(graph, "edge", {
                "id": f"e{edge_counter}",
                "source": node["parent"],
                "target": node["id"]
            })
            edge_counter += 1
            
    raw_xml = ET.tostring(root, encoding='utf-8')
    parsed_xml = minidom.parseString(raw_xml)
    pretty_xml = parsed_xml.toprettyxml(indent="  ")
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(pretty_xml)
    print(f"Successfully generated GraphML file at: {output_path}")

# Helper to build the Markdown Tree
def build_markdown_tree(output_path):
    tree_map = {}
    node_lookup = {}
    for node in nodes_data:
        node_lookup[node["id"]] = node
        parent = node["parent"]
        if parent not in tree_map:
            tree_map[parent] = []
        tree_map[parent].append(node["id"])
        
    lines = [
        "# Nepal & Global Benchmark Government Services Tree",
        "",
        "> [!NOTE]",
        "> This document lists the hierarchical structure of ministries, departments, and services of Nepal (2026 restructuring) and international best practice integrations.",
        "> Legend: 📱 = Integrated in Nagarik App | 🌐 = Fully Online | 🔀 = Partially Online | 📝 = Manual",
        ""
    ]
    
    def traverse(node_id, depth=0):
        node = node_lookup[node_id]
        indent = "  " * depth
        napp_flag = " 📱" if node.get("nagarik_app") else ""
        status_map = {"Fully Online": " 🌐", "Partially Online": " 🔀", "Manual": " 📝"}
        status_flag = status_map.get(node.get("digitized_status"), "")
        
        if node["type"] == "root":
            lines.append(f"{indent}- **{node['name']}** (Root Office)")
        elif node["type"] in ("ministry", "constitutional_body", "benchmark_portal"):
            lines.append(f"{indent}- **{node['name']}** ({node['type'].replace('_', ' ').title()})")
        elif node["type"] == "department":
            lines.append(f"{indent}- {node['name']} (Department/Agency)")
        else:
            lines.append(f"{indent}- [Service] *{node['name']}*{napp_flag}{status_flag}")
            lines.append(f"{indent}  - *Description*: {node['description']}")
            if node.get("required_documents") and node["required_documents"] not in ("N/A", "None"):
                docs = ", ".join([f"`{d.strip()}`" for d in node["required_documents"].split(";")])
                lines.append(f"{indent}  - *Required Documents*: {docs}")
                
        children = tree_map.get(node_id, [])
        for child_id in children:
            traverse(child_id, depth + 1)
            
    root_node = [n for n in nodes_data if n["parent"] is None][0]
    traverse(root_node["id"], 0)
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Successfully generated Markdown tree at: {output_path}")

# Helper to build the visualizer HTML
def build_viewer_html(output_path):
    # Serialized nodes_data for JSON inclusion
    nodes_json = json.dumps(nodes_data, indent=12)
    
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nepal & Global Government Services Explorer</title>
    <!-- Modern Premium Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Vis.js CDN for Network Graphs -->
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    
    <!-- FontAwesome for Premium Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        :root {
            --bg-color: #0b0f19;
            --card-bg: rgba(22, 28, 45, 0.7);
            --border-color: rgba(255, 255, 255, 0.08);
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
            --accent-primary: #3b82f6;
            --accent-secondary: #10b981;
            --accent-purple: #8b5cf6;
            --accent-orange: #f59e0b;
            --accent-red: #ef4444;
            --accent-indigo: #6366f1;
            --accent-cyan: #06b6d4;
            --glow-color: rgba(59, 130, 246, 0.15);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            overflow: hidden;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Glassmorphism Header */
        header {
            background: rgba(11, 15, 25, 0.8);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
        }

        .header-title {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .header-title h1 {
            font-size: 1.25rem;
            font-weight: 700;
            background: linear-gradient(135deg, #fff 30%, #a5b4fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .header-title p {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 0.1rem;
        }

        .legend-bar {
            display: flex;
            gap: 1.25rem;
            font-size: 0.8rem;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 0.4rem;
        }

        .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 3px;
        }

        /* App Container */
        .app-container {
            display: flex;
            flex: 1;
            position: relative;
            overflow: hidden;
        }

        /* Sidebar Filters */
        .sidebar {
            width: 320px;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            padding: 1.5rem;
            gap: 1.5rem;
            z-index: 5;
            overflow-y: auto;
        }

        .section-title {
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            margin-bottom: 0.75rem;
        }

        .search-box {
            position: relative;
        }

        .search-box input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-main);
            font-family: inherit;
            font-size: 0.9rem;
            transition: all 0.2s;
        }

        .search-box input:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 2px var(--glow-color);
        }

        .search-box i {
            position: absolute;
            left: 0.85rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
        }

        /* Search Results Autocomplete */
        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #111827;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 20;
            display: none;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
        }

        .search-item {
            padding: 0.6rem 1rem;
            font-size: 0.85rem;
            cursor: pointer;
            transition: background 0.15s;
        }

        .search-item:hover {
            background: var(--accent-primary);
            color: white;
        }

        /* Filter Controls */
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .filter-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.6rem 0.85rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: var(--text-main);
            font-size: 0.85rem;
            cursor: pointer;
            text-align: left;
            transition: all 0.15s;
        }

        .filter-btn:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.15);
        }

        .filter-btn.active {
            background: rgba(59, 130, 246, 0.1);
            border-color: var(--accent-primary);
            color: var(--accent-primary);
            font-weight: 600;
        }

        .badge-count {
            font-size: 0.75rem;
            background: rgba(255, 255, 255, 0.08);
            padding: 0.1rem 0.4rem;
            border-radius: 10px;
            color: var(--text-muted);
        }

        /* Layout Controls */
        .layout-toggle {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            background: rgba(15, 23, 42, 0.6);
            padding: 0.25rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }

        .layout-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            padding: 0.5rem;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            transition: all 0.2s;
        }

        .layout-btn.active {
            background: var(--accent-primary);
            color: white;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        /* Network Canvas */
        #network-canvas {
            flex: 1;
            height: 100%;
            background-color: #080c14;
            position: relative;
        }

        /* Floating Details Panel */
        .details-pane {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            width: 380px;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(16px);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            z-index: 6;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
            transform: translateX(420px);
            opacity: 0;
            pointer-events: none;
            max-height: 85%;
            overflow-y: auto;
        }

        .details-pane.active {
            transform: translateX(0);
            opacity: 1;
            pointer-events: auto;
        }

        .pane-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 1.2rem;
            cursor: pointer;
            transition: color 0.15s;
        }

        .pane-close:hover {
            color: white;
        }

        .details-header {
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1rem;
            margin-top: 0.5rem;
        }

        .details-title {
            font-size: 1.15rem;
            font-weight: 700;
            color: white;
            line-height: 1.4;
            margin-bottom: 0.5rem;
        }

        .badge-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }

        .badge {
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            padding: 0.25rem 0.6rem;
            border-radius: 4px;
            letter-spacing: 0.02em;
        }

        .badge-type-root { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
        .badge-type-ministry { background: rgba(139, 92, 246, 0.15); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3); }
        .badge-type-constitutional { background: rgba(236, 72, 153, 0.15); color: #f472b6; border: 1px solid rgba(236, 72, 153, 0.3); }
        .badge-type-department { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .badge-type-service { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .badge-type-benchmarkportal { background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); }
        .badge-type-benchmarkservice { background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3); }

        .badge-napp {
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent-secondary);
            border: 1px solid rgba(16, 185, 129, 0.3);
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
        }

        .badge-status {
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        .details-body {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .detail-item-title {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-muted);
            letter-spacing: 0.05em;
            margin-bottom: 0.4rem;
        }

        .detail-item-content {
            font-size: 0.85rem;
            line-height: 1.5;
            color: var(--text-main);
        }

        .doc-tag {
            display: inline-block;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            padding: 0.3rem 0.6rem;
            border-radius: 6px;
            font-size: 0.75rem;
            margin: 0.2rem;
        }

        /* Navigation Help Overlay */
        .nav-help {
            position: absolute;
            bottom: 1.5rem;
            left: 340px;
            background: rgba(15, 23, 42, 0.7);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(8px);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.75rem;
            color: var(--text-muted);
            pointer-events: none;
            display: flex;
            gap: 1rem;
            z-index: 4;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.15);
            border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.3);
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header>
        <div class="header-title">
            <i class="fa-solid fa-network-wired" style="color: var(--accent-primary); font-size: 1.5rem;"></i>
            <div>
                <h1>Nepal &amp; Global Benchmark Services Directory</h1>
                <p>Interactive graph database mapping all federal ministries, departments, and international best practice services (ASAN, Singpass, Estonia)</p>
            </div>
        </div>
        <div class="legend-bar">
            <div class="legend-item">
                <span class="legend-color" style="background-color: #3b82f6;"></span>
                <span>OPMCM (Root)</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #8b5cf6;"></span>
                <span>Ministries</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #f59e0b;"></span>
                <span>Departments</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #6366f1;"></span>
                <span>Global Portals</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #06b6d4;"></span>
                <span>Global Services</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #10b981;"></span>
                <span>Local Services</span>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <div class="app-container">
        <!-- Sidebar Filters -->
        <div class="sidebar">
            <!-- Search -->
            <div>
                <div class="section-title">Search Directory</div>
                <div class="search-box">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="directory-search" placeholder="Search service, ministry, ASAN..." oninput="showSearchSuggestions(this.value)">
                    <div class="search-results" id="autocomplete-box"></div>
                </div>
            </div>

            <!-- Layout Mode -->
            <div>
                <div class="section-title">Visual Layout</div>
                <div class="layout-toggle">
                    <button class="layout-btn active" id="layout-tree" onclick="setLayoutMode('hierarchical')">
                        <i class="fa-solid fa-tree"></i> Tree View
                    </button>
                    <button class="layout-btn" id="layout-network" onclick="setLayoutMode('network')">
                        <i class="fa-solid fa-circle-nodes"></i> Physics Net
                    </button>
                </div>
            </div>

            <!-- Quick Filter by Type -->
            <div class="filter-group">
                <div class="section-title">Filter Node Type</div>
                <button class="filter-btn active" id="type-all" onclick="filterType('all')">
                    <span>All System Nodes</span>
                    <span class="badge-count" id="count-all">0</span>
                </button>
                <button class="filter-btn" id="type-ministry" onclick="filterType('ministry')">
                    <span>Ministries</span>
                    <span class="badge-count" id="count-ministry">0</span>
                </button>
                <button class="filter-btn" id="type-department" onclick="filterType('department')">
                    <span>Departments & Agencies</span>
                    <span class="badge-count" id="count-department">0</span>
                </button>
                <button class="filter-btn" id="type-service" onclick="filterType('service')">
                    <span>Local Services</span>
                    <span class="badge-count" id="count-service">0</span>
                </button>
                <button class="filter-btn" id="type-benchmark" onclick="filterType('benchmark_service')">
                    <span>Global Benchmarks</span>
                    <span class="badge-count" id="count-benchmark">0</span>
                </button>
            </div>

            <!-- Digital Integration Filter -->
            <div class="filter-group">
                <div class="section-title">Integration & Channels</div>
                <button class="filter-btn" id="filter-napp" onclick="toggleNagarikAppFilter()">
                    <span>📱 Nagarik App Services</span>
                    <span class="badge-count" id="count-napp">0</span>
                </button>
                <button class="filter-btn" id="filter-fully-online" onclick="toggleFullyOnlineFilter()">
                    <span>🌐 Fully Online (Digital)</span>
                    <span class="badge-count" id="count-fully-online">0</span>
                </button>
            </div>
        </div>

        <!-- Network Visualization Canvas -->
        <div id="network-canvas"></div>

        <!-- Float Help Overlay -->
        <div class="nav-help">
            <span><i class="fa-solid fa-mouse-pointer"></i> Click Node to View Details</span>
            <span><i class="fa-solid fa-magnifying-glass-plus"></i> Scroll to Zoom</span>
            <span><i class="fa-solid fa-arrows-up-down-left-right"></i> Drag Background to Pan</span>
        </div>

        <!-- Sidebar Detailed Info Panel -->
        <div class="details-pane" id="info-panel">
            <button class="pane-close" onclick="closeDetailsPane()"><i class="fa-solid fa-xmark"></i></button>
            
            <div class="details-header">
                <div id="pane-node-type-badge" class="badge-row"></div>
                <h2 class="details-title" id="pane-node-title">Inland Revenue Department</h2>
                <div class="badge-row" id="pane-napp-badge-row"></div>
            </div>

            <div class="details-body">
                <div>
                    <div class="detail-item-title">Parent Agency</div>
                    <div class="detail-item-content" id="pane-node-parent" style="font-weight:600; color:var(--accent-primary);">Ministry of Finance</div>
                </div>

                <div>
                    <div class="detail-item-title">Description</div>
                    <div class="detail-item-content" id="pane-node-desc">Formulates tax guidelines and administers internal revenues like Income Tax and VAT.</div>
                </div>

                <div id="pane-online-status-block">
                    <div class="detail-item-title">E-Governance Delivery Channel</div>
                    <div class="badge badge-status" id="pane-online-badge">
                        <span class="status-dot"></span>
                        <span id="pane-online-text">Fully Online</span>
                    </div>
                </div>

                <div id="pane-docs-block">
                    <div class="detail-item-title">Required Documents</div>
                    <div id="pane-node-docs" style="margin-left:-0.2rem;"></div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript">
        // Embedded complete database of all ministries, departments, and services
        const rawNodes = {nodes_json};

        // System variables
        let network = null;
        let nodesDataset = null;
        let edgesDataset = null;
        let currentLayout = 'hierarchical';
        let currentTypeFilter = 'all';
        let nagarikFilterActive = false;
        let fullyOnlineFilterActive = false;

        // Styling palettes for graph elements
        const typeColors = {
            root: { background: '#1e3a8a', border: '#3b82f6', color: '#ffffff', shape: 'ellipse' },
            constitutional_body: { background: '#831843', border: '#db2777', color: '#ffffff', shape: 'ellipse' },
            ministry: { background: '#4c1d95', border: '#8b5cf6', color: '#ffffff', shape: 'ellipse' },
            department: { background: '#78350f', border: '#d97706', color: '#ffffff', shape: 'box' },
            service: { background: '#064e3b', border: '#10b981', color: '#ffffff', shape: 'box' },
            benchmark_portal: { background: '#1e1b4b', border: '#6366f1', color: '#ffffff', shape: 'ellipse' },
            benchmark_service: { background: '#083344', border: '#06b6d4', color: '#ffffff', shape: 'box' }
        };

        // Initialize counts on Sidebar
        function updateCounters() {
            document.getElementById('count-all').innerText = rawNodes.length;
            document.getElementById('count-ministry').innerText = rawNodes.filter(n => n.type === 'ministry').length;
            document.getElementById('count-department').innerText = rawNodes.filter(n => n.type === 'department').length;
            document.getElementById('count-service').innerText = rawNodes.filter(n => n.type === 'service').length;
            document.getElementById('count-benchmark').innerText = rawNodes.filter(n => n.type === 'benchmark_service').length;
            document.getElementById('count-napp').innerText = rawNodes.filter(n => n.nagarik_app).length;
            document.getElementById('count-fully-online').innerText = rawNodes.filter(n => n.digitized_status === 'Fully Online').length;
        }

        // Generate matching visual nodes & edges
        function renderGraph() {
            const nodes = [];
            const edges = [];

            rawNodes.forEach(node => {
                // Determine eligibility based on filters
                let show = true;
                if (currentTypeFilter !== 'all' && node.type !== currentTypeFilter) show = false;
                if (nagarikFilterActive && !node.nagarik_app) show = false;
                if (fullyOnlineFilterActive && node.digitized_status !== 'Fully Online') show = false;

                if (show) {
                    const style = typeColors[node.type] || typeColors.service;
                    nodes.push({
                        id: node.id,
                        label: node.name.length > 25 ? node.name.substring(0, 22) + '...' : node.name,
                        title: node.name,
                        shape: style.shape,
                        color: {
                            background: style.background,
                            border: style.border,
                            highlight: {
                                background: '#1e293b',
                                border: '#6366f1'
                            }
                        },
                        font: {
                            color: style.color,
                            face: 'Plus Jakarta Sans',
                            size: 13,
                            bold: node.type === 'root' || node.type === 'ministry' || node.type === 'benchmark_portal'
                        },
                        borderWidth: 2,
                        shadow: {
                            enabled: true,
                            color: 'rgba(0,0,0,0.4)',
                            size: 4,
                            x: 2,
                            y: 2
                        },
                        margin: 10
                    });
                }
            });

            // Generate edges only if both source and target are displayed
            const visibleNodeIds = new Set(nodes.map(n => n.id));
            rawNodes.forEach(node => {
                if (node.parent && visibleNodeIds.has(node.id) && visibleNodeIds.has(node.parent)) {
                    edges.push({
                        from: node.parent,
                        to: node.id,
                        color: {
                            color: 'rgba(255, 255, 255, 0.12)',
                            highlight: '#6366f1',
                            hover: 'rgba(255, 255, 255, 0.3)'
                        },
                        width: 1.5,
                        arrows: {
                            to: { enabled: true, scaleFactor: 0.8 }
                        },
                        smooth: {
                            type: 'cubicBezier',
                            forceDirection: 'vertical',
                            roundness: 0.4
                        }
                    });
                }
            });

            nodesDataset = new vis.DataSet(nodes);
            edgesDataset = new vis.DataSet(edges);

            const container = document.getElementById('network-canvas');
            const data = { nodes: nodesDataset, edges: edgesDataset };
            
            const options = {
                interaction: {
                    hover: true,
                    dragNodes: true,
                    dragView: true,
                    zoomView: true
                },
                layout: currentLayout === 'hierarchical' ? {
                    hierarchical: {
                        direction: 'UD',
                        sortMethod: 'directed',
                        nodeSpacing: 220,
                        levelSeparation: 140,
                        shakeTowards: 'leaves'
                    }
                } : {
                    hierarchical: false
                },
                physics: currentLayout === 'hierarchical' ? {
                    hierarchicalRepulsion: {
                        nodeSpacing: 240,
                        centralGravity: 0.0,
                        springLength: 120,
                        springConstant: 0.01,
                        damping: 0.9
                    },
                    avoidOverlap: 1
                } : {
                    barnesHut: {
                        gravitationalConstant: -30000,
                        centralGravity: 0.3,
                        springLength: 95,
                        springConstant: 0.04,
                        damping: 0.09,
                        avoidOverlap: 1
                    }
                }
            };

            network = new vis.Network(container, data, options);

            network.on("click", function (params) {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    showNodeDetails(nodeId);
                } else {
                    closeDetailsPane();
                }
            });
        }

        // Handle Details Pane Content Construction
        function showNodeDetails(nodeId) {
            const node = rawNodes.find(n => n.id === nodeId);
            if (!node) return;

            document.getElementById('pane-node-title').innerText = node.name;
            document.getElementById('pane-node-desc').innerText = node.description;

            if (node.parent) {
                const parentNode = rawNodes.find(n => n.id === node.parent);
                document.getElementById('pane-node-parent').innerText = parentNode ? parentNode.name : node.parent;
            } else {
                document.getElementById('pane-node-parent').innerText = "None (Root Authority)";
            }

            const typeBadgeContainer = document.getElementById('pane-node-type-badge');
            typeBadgeContainer.innerHTML = '';
            const typeBadge = document.createElement('span');
            const cleanType = node.type.replace('_body', '').replace('_', '');
            typeBadge.className = `badge badge-type-${cleanType}`;
            typeBadge.innerText = node.type.replace('_', ' ');
            typeBadgeContainer.appendChild(typeBadge);

            const nappBadgeContainer = document.getElementById('pane-napp-badge-row');
            nappBadgeContainer.innerHTML = '';
            if (node.nagarik_app) {
                const nappBadge = document.createElement('span');
                nappBadge.className = 'badge badge-napp';
                nappBadge.innerHTML = '<i class="fa-solid fa-mobile-screen-button"></i> Nagarik App Integrated';
                nappBadgeContainer.appendChild(nappBadge);
            }

            const statusBlock = document.getElementById('pane-online-status-block');
            const statusText = document.getElementById('pane-online-text');
            const statusDot = document.querySelector('#pane-online-badge .status-dot');
            const statusBadge = document.getElementById('pane-online-badge');

            if (node.type === 'service' || node.type === 'benchmark_service') {
                statusBlock.style.display = 'block';
                statusText.innerText = node.digitized_status;

                statusDot.style.backgroundColor = '';
                statusBadge.style.backgroundColor = '';
                statusBadge.style.color = '';

                if (node.digitized_status === 'Fully Online') {
                    statusDot.style.backgroundColor = 'var(--accent-secondary)';
                    statusBadge.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                    statusBadge.style.color = '#34d399';
                } else if (node.digitized_status === 'Partially Online') {
                    statusDot.style.backgroundColor = 'var(--accent-orange)';
                    statusBadge.style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
                    statusBadge.style.color = '#fbbf24';
                } else {
                    statusDot.style.backgroundColor = 'var(--accent-red)';
                    statusBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                    statusBadge.style.color = '#f87171';
                }
            } else {
                statusBlock.style.display = 'none';
            }

            const docsBlock = document.getElementById('pane-docs-block');
            const docsContainer = document.getElementById('pane-node-docs');
            docsContainer.innerHTML = '';

            if ((node.type === 'service' || node.type === 'benchmark_service') && node.required_documents && node.required_documents !== 'N/A' && node.required_documents !== 'None') {
                docsBlock.style.display = 'block';
                const docsList = node.required_documents.split(';');
                docsList.forEach(doc => {
                    const tag = document.createElement('span');
                    tag.className = 'doc-tag';
                    tag.innerText = doc.trim();
                    docsContainer.appendChild(tag);
                });
            } else {
                docsBlock.style.display = 'none';
            }

            document.getElementById('info-panel').classList.add('active');
        }

        function closeDetailsPane() {
            document.getElementById('info-panel').classList.remove('active');
            if (network) network.unselectNodes();
        }

        function setLayoutMode(mode) {
            currentLayout = mode;
            document.getElementById('layout-tree').classList.toggle('active', mode === 'hierarchical');
            document.getElementById('layout-network').classList.toggle('active', mode === 'network');
            renderGraph();
        }

        function filterType(type) {
            currentTypeFilter = type;
            const buttons = ['all', 'ministry', 'department', 'service', 'benchmark'];
            buttons.forEach(b => {
                const targetId = b === 'benchmark' ? 'type-benchmark' : `type-${b}`;
                const isTarget = (b === 'benchmark' && type === 'benchmark_service') || (b === type);
                document.getElementById(targetId).classList.toggle('active', isTarget);
            });
            renderGraph();
            closeDetailsPane();
        }

        function toggleNagarikAppFilter() {
            nagarikFilterActive = !nagarikFilterActive;
            document.getElementById('filter-napp').classList.toggle('active', nagarikFilterActive);
            renderGraph();
            closeDetailsPane();
        }

        function toggleFullyOnlineFilter() {
            fullyOnlineFilterActive = !fullyOnlineFilterActive;
            document.getElementById('filter-fully-online').classList.toggle('active', fullyOnlineFilterActive);
            renderGraph();
            closeDetailsPane();
        }

        function showSearchSuggestions(value) {
            const box = document.getElementById('autocomplete-box');
            if (!value) {
                box.style.display = 'none';
                return;
            }

            const matches = rawNodes.filter(n => n.name.toLowerCase().includes(value.toLowerCase()));
            if (matches.length === 0) {
                box.style.display = 'none';
                return;
            }

            box.innerHTML = '';
            matches.slice(0, 5).forEach(m => {
                const div = document.createElement('div');
                div.className = 'search-item';
                div.innerText = m.name;
                div.onclick = () => {
                    selectNodeFromSearch(m.id);
                    box.style.display = 'none';
                    document.getElementById('directory-search').value = m.name;
                };
                box.appendChild(div);
            });
            box.style.display = 'block';
        }

        function selectNodeFromSearch(nodeId) {
            if (nodesDataset && nodesDataset.get(nodeId)) {
                network.selectNodes([nodeId]);
                network.focus(nodeId, {
                    scale: 1.1,
                    animation: {
                        duration: 800,
                        easingFunction: 'easeInOutQuad'
                    }
                });
                showNodeDetails(nodeId);
            } else {
                currentTypeFilter = 'all';
                nagarikFilterActive = false;
                fullyOnlineFilterActive = false;
                
                document.getElementById('type-all').click();
                document.getElementById('filter-napp').classList.remove('active');
                document.getElementById('filter-fully-online').classList.remove('active');
                
                setTimeout(() => {
                    network.selectNodes([nodeId]);
                    network.focus(nodeId, {
                        scale: 1.1,
                        animation: {
                            duration: 800,
                            easingFunction: 'easeInOutQuad'
                        }
                    });
                    showNodeDetails(nodeId);
                }, 100);
            }
        }

        document.addEventListener('click', function(e) {
            if (e.target.id !== 'directory-search') {
                document.getElementById('autocomplete-box').style.display = 'none';
            }
        });

        window.onload = function() {
            updateCounters();
            renderGraph();
        }
    </script>
</body>
</html>"""
    
    html_content = html_content.replace("{nodes_json}", nodes_json)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Successfully generated visualizer viewer HTML at: {output_path}")

if __name__ == "__main__":
    os.makedirs(os.path.dirname(__file__), exist_ok=True)
    
    graphml_file = os.path.join(os.path.dirname(__file__), "nepal_gov_services.graphml")
    markdown_file = os.path.join(os.path.dirname(__file__), "services_tree.md")
    viewer_file = os.path.join(os.path.dirname(__file__), "viewer.html")
    
    build_graphml(graphml_file)
    build_markdown_tree(markdown_file)
    build_viewer_html(viewer_file)
