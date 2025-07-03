import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup.jsx';
import './popup.css';

function App() {
    const [phishyAnchors, setAnchors] = React.useState([]);
    const [phishyQRs, setQRs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [loaderText, setLoaderText] = React.useState('Scanning, please wait...');
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setLoaderText('Scanning, please wait...');
        setError(null);
        let timer1 = setTimeout(() => {
            if (isMounted) setLoaderText('Fetching predictions...');
        }, 60000); // 1 min
        let timer2 = setTimeout(() => {
            if (isMounted) setLoaderText('Almost there...');
        }, 120000); // 2 min

        chrome.runtime.sendMessage({ type: 'PHISHY_ENTRIES' }, (response) => {
            if (!isMounted) return;
            if (response?.payload) {
                setAnchors(response.payload.anchors);
                setQRs(response.payload.images);
                setError(response.payload.error || null);
            } else {
                setAnchors([]);
                setQRs([]);
                setError('No response from background script.');
            }
            setLoading(false);
        });

        const onChange = (changes, area) => {
            if (area === 'session' && changes.successfulImagePredictions) {
                setQRs(changes.successfulImagePredictions.newValue || []);
            }
            if (area === 'session' && changes.successfulURLPredictions) {
                setAnchors(changes.successfulURLPredictions.newValue || []);
            }
            if (area === 'session' && changes.predictionError) {
                setError(changes.predictionError.newValue || null);
            }
        };

        chrome.storage.onChanged.addListener(onChange);

        return () => {
            isMounted = false;
            chrome.storage.onChanged.removeListener(onChange);
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    if (loading) {
        return (
            <div className="preloader-bg">
                <h1 className="preloader-title">CyberGuard</h1>
                <div className="preloader-spinner" />
                <div className="preloader-text">{loaderText}</div>
            </div>
        );
    }

    return (
        <>
            {error ? (
                <div className="error-banner enhanced-error-banner" role="alert" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    minHeight: '100%',
                    minWidth: '100%',
                    background: 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    fontWeight: 600,
                    fontSize: '1.08em',
                    letterSpacing: '0.5px',
                    animation: 'fadeIn 0.5s',
                    margin: 0,
                    border: 'none',
                    boxShadow: 'none',
                    padding: 0
                }}>
                    <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>⚠️</div>
                    <div style={{ fontSize: '1.25em', marginBottom: '6px', fontWeight: 700 }}>Something went wrong</div>
                    <span className="error-text" style={{ fontWeight: 400, fontSize: '1.08em', maxWidth: '90vw', wordBreak: 'break-word' }}>{error}</span>
                    <div style={{ fontWeight: 400, fontSize: '1em', marginTop: '14px', color: '#fffbe6' }}>
                        Please try after some time.
                    </div>
                    <button
                        style={{
                            marginTop: '18px',
                            background: '#fff',
                            color: '#ff5858',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 24px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '1em',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                        }}
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            ) :
                <Popup phishyAnchors={phishyAnchors} phishyQRs={phishyQRs} />
            }
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
