import './popup.css';

export default function Popup({ phishyAnchors = [], phishyQRs = [] }) {
  const hasAny = phishyAnchors.length > 0 || phishyQRs.length > 0;

  return (
    <div className="popup-container enhanced-theme" style={{ padding: '20px 10px 12px 10px' }}>
      <h1 className="title cyberguard-title enhanced-title">CyberGuard Alerts</h1>

      {/* Section for Phishy URLs */}
      <section className="section enhanced-section">
        <h2 className="section-title section-title-urls enhanced-section-title">Phishy URLs</h2>
        {phishyAnchors.length === 0 ? (
          <p className="empty-message empty-message-urls enhanced-empty-message">No suspicious URLs detected.</p>
        ) : (
          <ul className="url-list phishy-anchors-list enhanced-list">
            {phishyAnchors.map((item, idx) => {
              const { url, prediction, phishy_probability } = item;
              const pct = Math.round(phishy_probability * 100);
              return (
                <li key={idx} className="url-card url-card-urls enhanced-card compact-card">
                  <div className="card-url-row">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="url-link url-link-urls enhanced-link card-url"
                    >
                      {url.length > 60 ? url.slice(0, 57) + '...' : url}
                    </a>
                  </div>
                  <div className="card-bar-row">
                    <div className="prob-bar prob-bar-urls enhanced-bar compact-bar">
                      <div className="filled filled-urls enhanced-filled" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="percent enhanced-percent compact-percent">{pct}%</span>
                    <span className={`prediction enhanced-prediction ${prediction.toUpperCase()} compact-prediction`}>{prediction.toUpperCase()}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Section for Phishy QR Codes */}
      <section className="section enhanced-section">
        <h2 className="section-title section-title-qrs enhanced-section-title">Phishy QR Codes</h2>
        {phishyQRs.length === 0 ? (
          <p className="empty-message empty-message-qrs enhanced-empty-message">No suspicious QR codes detected.</p>
        ) : (
          <ul className="url-list phishy-qrs-list enhanced-list">
            {phishyQRs.map((item, idx) => {
              const { url, prediction, phishy_probability } = item;
              const pct = Math.round(phishy_probability * 100);
              return (
                <li key={idx} className="url-card url-card-qrs enhanced-card compact-card">
                  <div className="card-url-row">
                    <span className="qr-text qr-text-qrs enhanced-link card-url">{url.length > 60 ? url.slice(0, 57) + '...' : url}</span>
                  </div>
                  <div className="card-bar-row">
                    <div className="prob-bar prob-bar-qrs enhanced-bar compact-bar">
                      <div className="filled filled-qrs enhanced-filled" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="percent enhanced-percent compact-percent">{pct}%</span>
                    <span className={`prediction enhanced-prediction ${prediction.toUpperCase()} compact-prediction`}>{prediction.toUpperCase()}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Feedback Button */}
      {hasAny && (
        <div className="feedback-container enhanced-feedback">
          <button
            className="feedback-btn enhanced-btn"
            onClick={() => chrome.runtime.openOptionsPage()}
          >
            Provide Feedback
          </button>
        </div>
      )}
    </div>
  );
}
