import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup.jsx';
import './popup.css';

// Listen for the background‐sent data and update state
function App() {
    const [phishyAnchors, setAnchors] = React.useState([]);
    const [phishyQRs, setQRs] = React.useState([]);

    React.useEffect(() => {
        chrome.runtime.onMessage.addListener((msg) => {
            if (msg.type === 'PHISHY_ENTRIES') {
                setAnchors(msg.payload.anchors || []);
                setQRs(msg.payload.images || []);
            }
        });
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
