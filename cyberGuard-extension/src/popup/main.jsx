import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup.jsx';
import './popup.css';

function App() {
    const [phishyAnchors, setAnchors] = React.useState([]);
    const [phishyQRs, setQRs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [loaderText, setLoaderText] = React.useState('Scanning, please wait...');

    React.useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setLoaderText('Scanning, please wait...');
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
