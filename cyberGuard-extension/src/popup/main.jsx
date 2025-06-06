import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup.jsx';
import './popup.css';

// Listen for the background‐sent data and update state
function App() {
    const [phishyAnchors, setAnchors] = React.useState([]);
    const [phishyQRs, setQRs] = React.useState([]);

    React.useEffect(() => {
        chrome.runtime.sendMessage({ type: 'PHISHY_ENTRIES' }, (response) => {
            if (response?.payload) {
                setAnchors(response.payload.anchors);
                setQRs(response.payload.images);
            }
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
            chrome.storage.onChanged.removeListener(onChange);
        };
    }, []);

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
