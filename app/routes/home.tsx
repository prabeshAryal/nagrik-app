import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useState } from "react";
import { CopyButton, Icon, Modal, NepalFlag } from "../components";
import { services } from "../data";
import { useApp } from "../app-context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nagarik | Nepal's citizen portal" },
    { name: "description", content: "One secure place for Nepal government services, documents and payments." },
  ];
}

const quickServices = [
  { id: "nid", name: "National ID", nepali: "राष्ट्रिय परिचय", icon: "shield", color: "blue" },
  { id: "driving", name: "Driving License", nepali: "सवारी चालक", icon: "card", color: "navy" },
  { id: "pcc", name: "Police Clearance", nepali: "प्रहरी चारित्रिक", icon: "shield", color: "red" },
  { id: "lalpurja", name: "Malpot (Land)", nepali: "मालपोत / लालपुर्जा", icon: "file", color: "amber" },
  { id: "noc", name: "Education / NOC", nepali: "शिक्षा तथा एनओसी", icon: "building", color: "blue" },
  { id: "vital-event", name: "Ward & Sifaris", nepali: "वडा तथा घटना", icon: "home", color: "teal" },
  { id: "citizenship", name: "Citizenship", nepali: "नागरिकता", icon: "building", color: "blue" },
  { id: "passport", name: "Passport", nepali: "राहदानी", icon: "file", color: "blue" },
  { id: "pan", name: "PAN & Tax", nepali: "प्यान तथा कर", icon: "file", color: "purple" },
  { id: "ssf", name: "SSF Account", nepali: "सामाजिक सुरक्षा", icon: "wallet", color: "teal" },
  { id: "electricity", name: "NEA Electricity", nepali: "विद्युत महसुल", icon: "card", color: "green" },
  { id: "grievance", name: "My Grievance", nepali: "हेलो सरकार उजुरी", icon: "help", color: "red" },
] as const;

export default function Home() {
  const { privacy, setPrivacy, applications, documents, academicRecords, paidBills } = useApp();
  const [share, setShare] = useState(false);
  const paymentDue = [{ id: "nea", n: 1840 }, { id: "kukl", n: 650 }, { id: "vehicle", n: 600 }]
    .filter((x) => !paidBills.includes(x.id))
    .reduce((a, x) => a + x.n, 0);

  return (
    <div className="page home-page">
      {/* Citizen Card + Actions Row */}
      <section className="home-dashboard">
        <div className="citizen-card">
          <header>
            <NepalFlag size={28} />
            <div>
              <small>नेपाल सरकार · GOVERNMENT OF NEPAL</small>
              <b>नागरिक परिचय</b>
            </div>
            <button
              className="icon-button card-eye"
              onClick={() => setPrivacy(!privacy)}
              aria-label="Show or hide personal numbers"
            >
              <Icon name={privacy ? "eyeoff" : "eye"} />
            </button>
          </header>
          <div className="citizen-body">
            <div className="citizen-photo">
              <img src="/avatar.jpg" alt="Prabin Shrestha" />
              <span>
                <Icon name="shield" size={13} /> VERIFIED
              </span>
            </div>
            <div className="citizen-person">
              <small>FULL NAME</small>
              <h2>Prabin Shrestha</h2>
              <p>प्रबिन श्रेष्ठ</p>
              <dl>
                <div>
                  <dt>National ID</dt>
                  <dd>
                    {privacy ? "••• ••• •••" : "983 472 810"}
                    {!privacy && <CopyButton value="983472810" />}
                  </dd>
                </div>
                <div>
                  <dt>Citizenship no.</dt>
                  <dd>
                    {privacy ? "•• •• •• •••••" : "27-01-75-08421"}
                    {!privacy && <CopyButton value="27-01-75-08421" />}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <button className="citizen-share" onClick={() => setShare(true)}>
            <span className="qr-symbol">▦</span>
            <span>
              <b>Share verified identity</b>
              <small>Choose fields · QR expires in 10 minutes</small>
            </span>
            <Icon name="chevron" />
          </button>
        </div>

        <div className="home-actions">
          <Link to="/education-records">
            <span className="action-icon blue">
              <Icon name="file" />
            </span>
            <span>
              <b>Education records</b>
              <small>{academicRecords.length} synchronized qualifications</small>
            </span>
            <Icon name="chevron" />
          </Link>
          <Link to="/documents">
            <span className="action-icon red">
              <Icon name="wallet" />
            </span>
            <span>
              <b>Document wallet</b>
              <small>{documents.length} linked documents</small>
            </span>
            <Icon name="chevron" />
          </Link>
          <Link to="/activity">
            <span className="action-icon navy">
              <Icon name="activity" />
            </span>
            <span>
              <b>My applications</b>
              <small>{applications.length} service requests</small>
            </span>
            <Icon name="chevron" />
          </Link>
          <Link to="/payments">
            <span className="action-icon green">
              <Icon name="card" />
            </span>
            <span>
              <b>Payments</b>
              <small>रू {paymentDue.toLocaleString()} currently due</small>
            </span>
            <Icon name="chevron" />
          </Link>
        </div>
      </section>

      {/* Prime Minister Disaster Relief Fund Banner */}
      <section className="civic-banner pmdrf-banner">
        <span className="banner-mark">रा</span>
        <div>
          <p className="eyebrow">NATIONAL CITIZEN SOLIDARITY</p>
          <h2>Prime Minister Disaster Relief Fund (PMDRF)</h2>
          <p>
            Support citizens and communities affected by natural disasters, floods, landslides, and emergencies across
            Nepal. Contribute directly to the official Prime Minister's Disaster Relief Fund.
          </p>
          <a
            className="button banner-button"
            href="https://pmdrf.prabe.sh"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support PMDRF Relief Fund <Icon name="arrow" size={18} />
          </a>
        </div>
        <div className="banner-certificate pmdrf-badge">
          <span>नेपाल सरकार</span>
          <b>PMDRF</b>
          <i>राहत</i>
          <small>DISASTER RELIEF</small>
        </div>
      </section>

      {/* Available Services Clean CSS Icon Grid */}
      <section className="section services-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">AVAILABLE SERVICES</p>
            <h2>Digital citizen services</h2>
          </div>
          <Link to="/services">
            See all {services.length} services <Icon name="arrow" size={18} />
          </Link>
        </div>

        <div className="services-icon-grid">
          {quickServices.map((item) => (
            <Link to={`/services/${item.id}`} key={item.id} className="service-icon-tile">
              <div className={`tile-icon-wrap ${item.color}`}>
                <Icon name={item.icon as any} size={22} />
              </div>
              <span className="tile-name">{item.name}</span>
              <small className="tile-nepali">{item.nepali}</small>
            </Link>
          ))}
        </div>
      </section>

      {/* Lower Cards */}
      <section className="home-lower">
        <div className="progress-card">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">CURRENT APPLICATION</p>
              <h2>Passport renewal</h2>
            </div>
            <span className="status in-review">In review</span>
          </div>
          <div className="progress-track">
            <span style={{ width: "64%" }} />
          </div>
          <div className="progress-steps">
            <span className="done">Submitted</span>
            <span className="current">Verification</span>
            <span>Decision</span>
          </div>
          <Link className="text-button" to="/activity">
            Track application <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="help-card">
          <span className="action-icon red">
            <Icon name="help" />
          </span>
          <div>
            <p className="eyebrow">NAGARIK SUPPORT</p>
            <h2>Need help with a service?</h2>
            <p>
              Call the government helpdesk at <b>1102</b>, Sunday to Friday.
            </p>
            <Link to="/support">
              Visit help centre <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Share Identity Modal */}
      <Modal open={share} onClose={() => setShare(false)} title="Share verified identity">
        <div className="share-sheet">
          <div className="qr-large" aria-label="Demo QR code">
            <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
          </div>
          <p>This QR shares your name, photo, and National ID validity for 10 minutes. Numbers remain hidden.</p>
          <div className="consent-row">
            <Icon name="shield" />
            <span>
              <b>Consent protected</b>
              <small>One verification only · access is recorded</small>
            </span>
          </div>
          <button className="button primary full" onClick={() => setShare(false)}>
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
}
