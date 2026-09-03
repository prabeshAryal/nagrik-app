import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { CopyButton, Icon, Modal, PageHeader } from "../components";
import { useApp } from "../app-context";

export default function Documents() {
  const { documents, addDocument, showToast } = useApp();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<(typeof documents)[number] | null>(null);
  const [file, setFile] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addDocument({
      id: `DOC-${Date.now()}`,
      type: String(fd.get("type")),
      nepali: "नयाँ कागजात",
      number: String(fd.get("number")),
      issuer: String(fd.get("issuer")),
      status: "Verified",
      updated: "03 Sep 2026",
    });
    setOpen(false);
    setFile("");
    showToast("Document verified and linked to wallet");
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (offsetWidth * 0.85));
      setActiveIndex(Math.min(index, documents.length - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth * 0.88;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className="page documents-page">
      <PageHeader
        eyebrow="YOUR VERIFIED RECORDS"
        title="Document Wallet"
        copy="Government-issued identity cards, licenses and records securely available in your wallet."
        action={
          <button type="button" className="button primary" onClick={() => setOpen(true)}>
            <Icon name="plus" /> Link document
          </button>
        }
      />

      {/* Slideable Document Cards Carousel on Mobile, Responsive Grid on Desktop */}
      <div className="document-carousel-wrap">
        <div className="document-grid" ref={scrollRef} onScroll={handleScroll}>
          {documents.map((d, i) => (
            <article className={`document-card tone-${i % 4}`} key={d.id}>
              {/* Card Holographic Emblem & Chip */}
              <div className="doc-top">
                <div className="doc-emblem-badge">
                  <span className="emblem-seal">नेपाल</span>
                  <div className="smart-chip">
                    <span />
                    <span />
                  </div>
                </div>
                <span className={`status-badge ${d.status.toLowerCase()}`}>
                  <Icon name="shield" size={12} /> {d.status}
                </span>
              </div>

              {/* Card Title & Nepali Subtitle */}
              <div className="doc-body">
                <p className="nepali-title">{d.nepali}</p>
                <h2 className="doc-type-title">{d.type}</h2>
                <div className="doc-number-row">
                  <small className="number-label">DOCUMENT NUMBER</small>
                  <div className="number-val-wrap">
                    <b className="doc-number">{d.number}</b>
                    <CopyButton value={d.number} />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <footer className="doc-footer">
                <div className="doc-issuer-meta">
                  <span className="issuer-name">{d.issuer}</span>
                  <small className="updated-date">Updated {d.updated}</small>
                </div>
                <button type="button" className="doc-open-btn" onClick={() => setPreview(d)}>
                  Open Card
                </button>
              </footer>
            </article>
          ))}
        </div>

        {/* Mobile Slider Indicator Dots */}
        <div className="document-slider-dots">
          {documents.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`slider-dot ${activeIndex === i ? "active" : ""}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Slide to card ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Privacy Control Strip */}
      <section className="data-control">
        <Icon name="shield" size={30} />
        <div>
          <h2>Your records stay under your control</h2>
          <p>No agency receives a document until you approve it for a specific service.</p>
        </div>
        <Link to="/support">Review privacy controls</Link>
      </section>

      {/* Link Document Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Link a government document">
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              <span>Document type</span>
              <select name="type" required>
                <option>Passport</option>
                <option>Citizenship Certificate</option>
                <option>Smart Driving License</option>
                <option>National ID (NID)</option>
                <option>PAN Certificate</option>
                <option>Lalpurja Land Ownership</option>
                <option>Health Insurance Card</option>
                <option>Academic Transcript</option>
              </select>
            </label>
            <label>
              <span>Document number</span>
              <input name="number" required placeholder="Enter exactly as issued on document" />
            </label>
            <label className="span-2">
              <span>Issuing office</span>
              <input name="issuer" required placeholder="e.g. Kathmandu DAO, DoTM, IRD" />
            </label>
          </div>
          <label className="upload-zone compact">
            <Icon name="upload" />
            <b>{file || "Upload front or certificate page scan"}</b>
            <small>PDF, JPG or PNG · maximum 10 MB</small>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0]?.name || "")} />
          </label>
          <div className="modal-actions">
            <button type="button" className="button quiet" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="button primary">
              Verify & Link Document
            </button>
          </div>
        </form>
      </Modal>

      {/* Document View Preview Modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.type || "Document"}>
        {preview && (
          <div className="document-preview">
            <div className="doc-preview-head">
              <span className="brand-seal">न</span>
              <div>
                <b>Government of Nepal</b>
                <small>{preview.issuer}</small>
              </div>
            </div>
            <h3>{preview.type}</h3>
            <p className="nepali" style={{ color: "var(--muted)", margin: "-6px 0 16px" }}>
              {preview.nepali}
            </p>
            <dl>
              <div>
                <dt>Document Holder</dt>
                <dd>Prabin Shrestha</dd>
              </div>
              <div>
                <dt>Document Number</dt>
                <dd>{preview.number}</dd>
              </div>
              <div>
                <dt>Issuing Authority</dt>
                <dd>{preview.issuer}</dd>
              </div>
              <div>
                <dt>Verification Status</dt>
                <dd>{preview.status}</dd>
              </div>
              <div>
                <dt>Last Synchronized</dt>
                <dd>{preview.updated}</dd>
              </div>
            </dl>
            <button
              type="button"
              className="button primary full"
              onClick={() => showToast("Verified digital copy downloaded")}
            >
              <Icon name="download" /> Download verified digital copy
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
