import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup.jsx';
import './popup.css';

// Listen for the background‐sent data and update state
function App() {
    const [phishyAnchors, setAnchors] = React.useState([]);
    const [phishyQRs, setQRs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;
        setLoading(true);
        chrome.runtime.sendMessage({ type: 'PHISHY_ENTRIES' }, (response) => {
            if (!isMounted) return;
            if (response?.payload) {
                setAnchors(response.payload.anchors);
                setQRs(response.payload.images);
            } else {
                setAnchors([]);
                setQRs([]);
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
        };

        chrome.storage.onChanged.addListener(onChange);

        return () => {
            isMounted = false;
            chrome.storage.onChanged.removeListener(onChange);
        };
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
                color: '#fff',
                fontFamily: 'Segoe UI, Arial, sans-serif',
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem',
                    letterSpacing: '2px',
                    color: '#00e6e6',
                    textShadow: '0 2px 8px #0008'
                }}>
                    CyberGuard
                </h1>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '6px solid #00e6e6',
                    borderTop: '6px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '1.5rem'
                }} />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <div style={{ fontSize: '1.1rem', letterSpacing: '1px', opacity: 0.85 }}>
                    Scanning, please wait...
                </div>
            </div>
        );
    }

    return (
        <>
            <Popup phishyAnchors={phishyAnchors} phishyQRs={phishyQRs} />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
