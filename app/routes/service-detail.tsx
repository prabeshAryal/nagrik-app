import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Icon, Modal, ServiceGlyph } from "../components";
import { services, type Service } from "../data";
import { useApp } from "../app-context";

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const service = services.find((s) => s.id === serviceId);
  const [apply, setApply] = useState(false);

  if (!service)
    return (
      <div className="page empty-state">
        <h1>Service not found</h1>
        <Link className="button primary" to="/services">
          Back to services
        </Link>
      </div>
    );

  return (
    <div className="page">
      <Link className="back-link" to="/services">
        ← Service directory
      </Link>
      <section className="service-hero">
        <ServiceGlyph category={service.category} />
        <div>
          <h1>{service.name}</h1>
          <p className="nepali large">{service.nepali}</p>
          <p>{service.description}</p>
        </div>
        <button className="button primary" onClick={() => setApply(true)}>
          Start application <Icon name="arrow" size={18} />
        </button>
      </section>

      <div className="detail-layout">
        <div>
          <section className="content-card">
            <p className="eyebrow">BEFORE YOU START</p>
            <h2>What you will need</h2>
            <ol className="requirement-list">
              {service.documents.map((d, i) => (
                <li key={d}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <b>{d}</b>
                    <small>Auto-synchronized from your verified Nagarik Wallet or upload clear scan</small>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="content-card">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>Simple, trackable digital process</h2>
            <div className="process-row">
              <div>
                <b>01</b>
                <span>Verify info</span>
              </div>
              <div>
                <b>02</b>
                <span>Attach records</span>
              </div>
              <div>
                <b>03</b>
                <span>Agency review</span>
              </div>
              <div>
                <b>04</b>
                <span>Receive decision</span>
              </div>
            </div>
          </section>
        </div>
        <aside className="service-facts">
          <h3>Service details</h3>
          <dl>
            <div>
              <dt>Responsible office</dt>
              <dd>{service.agency}</dd>
            </div>
            <div>
              <dt>Delivery type</dt>
              <dd>{service.type}</dd>
            </div>
            <div>
              <dt>Estimated fee</dt>
              <dd>{service.fee}</dd>
            </div>
            <div>
              <dt>Typical time</dt>
              <dd>{service.time}</dd>
            </div>
          </dl>
          {service.officialUrl && (
            <a className="official-link" href={service.officialUrl} target="_blank" rel="noreferrer">
              <span>
                <b>Open official {service.agency} website</b>
                <small>Government of Nepal Verified Portal</small>
              </span>
              <Icon name="arrow" size={18} />
            </a>
          )}
          <div className="secure-note">
            <Icon name="lock" />
            <p>
              <b>Secure submission</b>
              <br />
              Your data is encrypted and shared directly with {service.agency}.
            </p>
          </div>
        </aside>
      </div>

      <ApplicationFlow service={service} open={apply} onClose={() => setApply(false)} />
    </div>
  );
}

function ApplicationFlow({ service, open, onClose }: { service: Service; open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<string[]>([service.documents[0] || "Verified Citizenship"]);
  const [reference, setReference] = useState("");
  const { addApplication, showToast, documents } = useApp();
  const nav = useNavigate();

  const isLokSewa = service.id.includes("lok-sewa") || service.id.includes("tsc");
  const isLabour = service.id.includes("labour") || service.id.includes("shram") || service.id.includes("eps");

  const submit = () => {
    const ref = `${service.id.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 899999)}`;
    addApplication({
      id: `APP-${Date.now()}`,
      serviceId: service.id,
      name: service.name,
      nepali: service.nepali,
      date: "03 Sep 2026",
      status: "Submitted",
      progress: 25,
      reference: ref,
    });
    showToast("Application submitted successfully to " + service.agency);
    onClose();
    nav("/activity");
  };

  return (
    <Modal open={open} onClose={onClose} title={service.name} wide>
      <div className="wizard-head">
        {["Applicant", "Service Info", "Documents", "Review"].map((x, i) => (
          <span className={step >= i + 1 ? "active" : ""} key={x}>
            <b>{i + 1}</b>
            {x}
          </span>
        ))}
      </div>

      <div className="wizard-body">
        {/* Step 1: Pre-verified Citizen Identity */}
        {step === 1 && (
          <div className="form-grid">
            <label>
              <span>Full name (English)</span>
              <input defaultValue="Prabin Shrestha" required />
            </label>
            <label>
              <span>नाम (नेपालीमा)</span>
              <input defaultValue="प्रबिन श्रेष्ठ" required />
            </label>
            <label>
              <span>National ID (NID)</span>
              <input defaultValue="983-472-810-5" readOnly style={{ background: "var(--paper)" }} />
            </label>
            <label>
              <span>Citizenship Number</span>
              <input defaultValue="27-01-75-08421 (Kathmandu)" readOnly style={{ background: "var(--paper)" }} />
            </label>
            <label>
              <span>Mobile number (Linked SIM)</span>
              <input defaultValue="+977 9841 234 567" required />
            </label>
            <label>
              <span>Permanent Address</span>
              <input defaultValue="Kathmandu Metropolitan City 10, Bagmati" required />
            </label>
          </div>
        )}

        {/* Step 2: Contextual Service Fields */}
        {step === 2 && (
          <div className="form-grid">
            {isLokSewa ? (
              <>
                <label>
                  <span>PSC Master ID</span>
                  <input defaultValue="PSC-2026-98421" />
                </label>
                <label>
                  <span>Applied Post / Level</span>
                  <select defaultValue="Officer Level 7">
                    <option>Section Officer (शाखा अधिकृत - Level 7)</option>
                    <option>Nayab Subba (नायब सुब्बा - Level 5)</option>
                    <option>Computer Officer (कम्प्युटर अधिकृत)</option>
                    <option>Engineering / Technical Service</option>
                  </select>
                </label>
                <label>
                  <span>Exam Center Preference</span>
                  <select defaultValue="Kathmandu">
                    <option>Kathmandu (काठमाडौं केन्द्र)</option>
                    <option>Pokhara (पोखरा केन्द्र)</option>
                    <option>Biratnagar (विराटनगर केन्द्र)</option>
                    <option>Butwal (बुटवल केन्द्र)</option>
                  </select>
                </label>
                <label>
                  <span>Inclusion Quota (समावेशी समूह)</span>
                  <select defaultValue="Open">
                    <option>Open (खुल्ला)</option>
                    <option>Aadibasi Janajati (आदिवासी जनजाति)</option>
                    <option>Madhesi (मधेसी)</option>
                    <option>Dalit (दलित)</option>
                  </select>
                </label>
              </>
            ) : isLabour ? (
              <>
                <label>
                  <span>Destination Country</span>
                  <select defaultValue="UAE">
                    <option>United Arab Emirates (UAE)</option>
                    <option>Saudi Arabia</option>
                    <option>Qatar</option>
                    <option>South Korea (EPS)</option>
                    <option>Japan (SSW)</option>
                  </select>
                </label>
                <label>
                  <span>Permit Type</span>
                  <select defaultValue="Re-entry">
                    <option>Re-entry Labour Permit (पुनः श्रम स्वीकृति)</option>
                    <option>New Individual Permit (व्यक्तिगत श्रम)</option>
                    <option>Institutional / Manpower (संस्थागत)</option>
                  </select>
                </label>
                <label className="span-2">
                  <span>Foreign Employer / Company Name</span>
                  <input defaultValue="Al-Futtaim Global Services LLC" />
                </label>
              </>
            ) : (
              <>
                <label>
                  <span>Request purpose</span>
                  <select defaultValue="Personal">
                    <option>Personal & Identity</option>
                    <option>Employment / Job</option>
                    <option>Higher Education</option>
                    <option>Travel / Visa</option>
                    <option>Business & Property</option>
                  </select>
                </label>
                <label>
                  <span>Responsible Office / Center</span>
                  <select defaultValue="Kathmandu">
                    <option>Kathmandu District Office / Ward</option>
                    <option>Lalitpur Office</option>
                    <option>Bhaktapur Office</option>
                    <option>Federal Central Portal</option>
                  </select>
                </label>
                <label className="span-2">
                  <span>Reference or File Note (Optional)</span>
                  <input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Enter any previous token or billing voucher number"
                  />
                </label>
              </>
            )}
          </div>
        )}

        {/* Step 3: Verified Wallet Documents + Upload */}
        {step === 3 && (
          <div>
            <div className="wallet-attach-box" style={{ marginBottom: 16 }}>
              <p className="eyebrow" style={{ color: "var(--q-color-primary)", fontWeight: 700 }}>
                AUTO-SYNC FROM YOUR NAGARIK WALLET
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    className="button quiet"
                    style={{
                      border: files.includes(doc.type) ? "1.5px solid var(--q-color-primary)" : "1px solid var(--line)",
                      background: files.includes(doc.type) ? "#eaf1fb" : "#fff",
                      fontSize: 12,
                      padding: "6px 12px",
                      borderRadius: 8,
                    }}
                    onClick={() => {
                      if (!files.includes(doc.type)) {
                        setFiles([...files, doc.type]);
                      }
                    }}
                  >
                    <Icon name="check" size={14} /> {doc.type} ({doc.number})
                  </button>
                ))}
              </div>
            </div>

            <div className="upload-zone">
              <Icon name="upload" size={28} />
              <h3>Attach additional supporting files</h3>
              <p>PDF, JPG, or PNG · maximum 10 MB each</p>
              <label className="button secondary">
                Choose file
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFiles([...files, ...Array.from(e.target.files || []).map((f) => f.name)])}
                />
              </label>
            </div>

            <div className="file-list" style={{ marginTop: 12 }}>
              {files.map((f) => (
                <div key={f}>
                  <Icon name="file" />
                  <span>
                    <b>{f}</b>
                    <small>Verified attachment ready</small>
                  </span>
                  <button type="button" onClick={() => setFiles(files.filter((x) => x !== f))}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Final Review */}
        {step === 4 && (
          <div className="review-box">
            <div className="review-person">
              <span>
                <img src="/avatar.jpg" alt="Prabin Shrestha" />
              </span>
              <div>
                <b>Prabin Shrestha</b>
                <small>NID 983-472-810-5 · Identity Verified</small>
              </div>
            </div>
            <dl>
              <div>
                <dt>Service</dt>
                <dd>{service.name}</dd>
              </div>
              <div>
                <dt>Office Authority</dt>
                <dd>{service.agency}</dd>
              </div>
              <div>
                <dt>Attached Documents</dt>
                <dd>{files.length ? `${files.length} verified records` : "Verified Citizen Record"}</dd>
              </div>
              <div>
                <dt>Service Fee</dt>
                <dd>{service.fee}</dd>
              </div>
            </dl>
            <label className="consent-check">
              <input type="checkbox" defaultChecked />
              <span>
                I confirm the information is correct and consent to sharing my verified profile with {service.agency}.
              </span>
            </label>
          </div>
        )}
      </div>

      <footer className="wizard-actions">
        <button type="button" className="button quiet" onClick={step === 1 ? onClose : () => setStep(step - 1)}>
          {step === 1 ? "Cancel" : "Back"}
        </button>
        <button type="button" className="button primary" onClick={step === 4 ? submit : () => setStep(step + 1)}>
          {step === 4 ? "Submit Application" : "Continue"}
          <Icon name="arrow" size={17} />
        </button>
      </footer>
    </Modal>
  );
}
