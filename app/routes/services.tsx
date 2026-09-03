import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { departmentHubs, services } from "../data";
import { Icon, PageHeader } from "../components";

export default function Services() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [selectedHub, setSelectedHub] = useState<string | null>(params.get("dept") || null);

  const hubData = useMemo(() => {
    return departmentHubs
      .map((hub) => {
        const hubServices = hub.serviceIds
          .map((id) => services.find((s) => s.id === id)!)
          .filter(Boolean);

        const filteredServices = query.trim()
          ? hubServices.filter((s) =>
              `${s.name} ${s.nepali} ${s.agency} ${s.description}`
                .toLowerCase()
                .includes(query.toLowerCase())
            )
          : hubServices;

        const isMatch =
          query.trim() === "" ||
          filteredServices.length > 0 ||
          `${hub.name} ${hub.nepali} ${hub.tagline}`
            .toLowerCase()
            .includes(query.toLowerCase());

        return {
          ...hub,
          services: filteredServices,
          allServices: hubServices,
          isMatch,
        };
      })
      .filter((h) => h.isMatch);
  }, [query]);

  const activeHub = useMemo(
    () => (selectedHub ? departmentHubs.find((h) => h.id === selectedHub) : null),
    [selectedHub]
  );

  const activeHubServices = useMemo(() => {
    if (!activeHub) return [];
    return activeHub.serviceIds
      .map((id) => services.find((s) => s.id === id)!)
      .filter(Boolean)
      .filter((s) =>
        query.trim()
          ? `${s.name} ${s.nepali} ${s.agency} ${s.description}`
              .toLowerCase()
              .includes(query.toLowerCase())
          : true
      );
  }, [activeHub, query]);

  return (
    <div className="page services-hierarchy-page">
      <PageHeader
        eyebrow="NATIONAL SERVICE DIRECTORY"
        title="Government Services"
        copy="Access digital public services categorized by responsible department, municipal ward, and administrative authority."
      />

      {/* Search Bar & Quick Filters */}
      <div className="catalog-toolbar">
        <label className="catalog-search">
          <Icon name="search" size={19} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search service, office (e.g. Citizenship, Ward Sifaris, Lalpurja, PAN)..."
          />
          {query && (
            <button
              type="button"
              className="icon-button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              style={{ width: 28, height: 28 }}
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </label>

        {/* Quick Authority Filter Tabs */}
        <div className="category-tabs" role="tablist">
          <button
            type="button"
            className={!selectedHub ? "active" : ""}
            onClick={() => {
              setSelectedHub(null);
              const p = new URLSearchParams(params);
              p.delete("dept");
              setParams(p);
            }}
          >
            All Authorities ({departmentHubs.length})
          </button>
          {departmentHubs.map((hub) => (
            <button
              type="button"
              key={hub.id}
              className={selectedHub === hub.id ? "active" : ""}
              onClick={() => {
                setSelectedHub(hub.id);
                const p = new URLSearchParams(params);
                p.set("dept", hub.id);
                setParams(p);
              }}
            >
              {hub.name.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Single Department View */}
      {activeHub ? (
        <div className="dept-detail-view">
          <div className="dept-hero-banner">
            <button
              type="button"
              className="back-link"
              onClick={() => {
                setSelectedHub(null);
                const p = new URLSearchParams(params);
                p.delete("dept");
                setParams(p);
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14 }}
            >
              <Icon name="arrow" size={16} /> Back to all authorities
            </button>
            <div className="dept-hero-content">
              <span className={`dept-icon-large ${activeHub.theme}`}>
                <Icon name={activeHub.iconName} size={30} />
              </span>
              <div>
                <span className="dept-badge">{activeHub.badge}</span>
                <h2>{activeHub.name}</h2>
                <p className="nepali-sub">{activeHub.nepali}</p>
                <p className="dept-desc">{activeHub.tagline}</p>
              </div>
            </div>
          </div>

          <div className="dept-services-section">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">SERVICES INSIDE THIS AUTHORITY</p>
                <h3>{activeHubServices.length} Available Services</h3>
              </div>
            </div>
            {activeHubServices.length > 0 ? (
              <div className="services-row-list">
                {activeHubServices.map((s) => (
                  <Link to={`/services/${s.id}`} key={s.id} className="service-row-card">
                    <span className={`service-row-icon ${activeHub.theme}`}>
                      <Icon name={activeHub.iconName} size={18} />
                    </span>
                    <div className="service-row-main">
                      <b>{s.name}</b>
                      <small className="nepali">{s.nepali} · {s.agency}</small>
                    </div>
                    <span className="service-row-fee">{s.fee}</span>
                    <span className="service-row-tag">{s.type}</span>
                    <Icon name="chevron" size={16} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Icon name="search" size={32} />
                <h3>No matching services in {activeHub.name}</h3>
                <p>Try searching with another keyword.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Hierarchical Department Directory with Expanded Row Items */
        <div className="dept-directory-grid">
          {hubData.length > 0 ? (
            hubData.map((hub) => (
              <div className="dept-hub-card" key={hub.id}>
                <header className="dept-hub-header">
                  <span className={`dept-hub-glyph ${hub.theme}`}>
                    <Icon name={hub.iconName} size={22} />
                  </span>
                  <div className="dept-hub-title">
                    <span className="dept-badge">{hub.badge}</span>
                    <h3>{hub.name}</h3>
                    <p className="nepali-sub">{hub.nepali}</p>
                  </div>
                  <button
                    type="button"
                    className="dept-explore-btn"
                    onClick={() => {
                      setSelectedHub(hub.id);
                      const p = new URLSearchParams(params);
                      p.set("dept", hub.id);
                      setParams(p);
                    }}
                    aria-label={`View ${hub.name}`}
                  >
                    <span>{hub.allServices.length} services</span>
                    <Icon name="chevron" size={16} />
                  </button>
                </header>

                <p className="dept-hub-tagline">{hub.tagline}</p>

                {/* Sub-services compact 1-row items */}
                <div className="dept-sub-services">
                  {hub.services.map((s) => (
                    <Link
                      to={`/services/${s.id}`}
                      key={s.id}
                      className="dept-service-pill"
                    >
                      <span className="pill-dot" />
                      <div className="pill-text">
                        <b>{s.name}</b>
                        <small>{s.nepali}</small>
                      </div>
                      <Icon name="arrow" size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Icon name="search" size={36} />
              <h2>No matching services or departments</h2>
              <p>Try searching for a different keyword like "Citizenship", "NID", "Lalpurja", or "Tax".</p>
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setQuery("");
                  setSelectedHub(null);
                  setParams({});
                }}
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
