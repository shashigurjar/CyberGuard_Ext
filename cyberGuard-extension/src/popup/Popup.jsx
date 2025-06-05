import './popup.css';

export default function Popup({ phishyAnchors = [], phishyQRs = [] }) {
  return (
    <div className="popup-container">
      <h1 className="title">CyberGuard Alerts</h1>

      {/* Phishy URLs */}
      <section className="section">
        <h2 className="section-title">Phishy URLs</h2>
        {phishyAnchors.length === 0 ? (
          <p className="empty-message">No suspicious URLs detected.</p>
        ) : (
          <ul className="url-list">
            {phishyAnchors.map((item, idx) => {
              const { url, prediction, phishy_probability } = item;
              const pct = Math.round(phishy_probability * 100);
              return (
                <li key={idx} className="url-card">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-link"
                  >
                    {url.length > 40 ? url.slice(0, 37) + '...' : url}
                  </a>
                  <div className="details">
                    <span className={`prediction ${prediction.toUpperCase()}`}>{prediction.toUpperCase()}</span>
                    <div className="prob-bar">
                      <div className="filled" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="percent">{pct}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Phishy QR Codes */}
      <section className="section">
        <h2 className="section-title">Phishy QR Codes</h2>
        {phishyQRs.length === 0 ? (
          <p className="empty-message">No suspicious QR codes detected.</p>
        ) : (
          <ul className="url-list">
            {phishyQRs.map((item, idx) => {
              const { url, prediction, phishy_probability } = item;
              const pct = Math.round(phishy_probability * 100);
              return (
                <li key={idx} className="url-card">
                  <span className="qr-text">{url.length > 40 ? url.slice(0, 37) + '...' : url}</span>
                  <div className="details">
                    <span className={`prediction ${prediction.toUpperCase()}`}>{prediction.toUpperCase()}</span>
                    <div className="prob-bar">
                      <div className="filled" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="percent">{pct}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
