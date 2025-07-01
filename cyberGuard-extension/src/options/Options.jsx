import { useState } from 'react';
import './options.css';

export default function Options() {
    const [url, setUrl] = useState('');
    const [feedback, setFeedback] = useState('false_positive');
    const [notes, setNotes] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Sending feedback...');
        try {
            const response = await fetch('http://localhost:8000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, feedback, notes }),
            });
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            setStatusMessage('Thank you for your feedback!');
            setUrl('');
            setNotes('');
            setFeedback('false_positive');
        } catch (err) {
            setStatusMessage('Failed to send feedback. Please try again.');
        }
    };

    return (
        <div className="options-root">
            <nav className="options-navbar">
                <span className="navbar-title">CyberGuard</span>
            </nav>
            <div className="options-container">
                <h1 className="options-title">Report Feedback</h1>
                <form className="feedback-form" onSubmit={handleSubmit}>
                    <label className="field">
                        <span>URL</span>
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="Paste the URL you want to give feedback about"
                            required
                        />
                    </label>
                    <fieldset className="fieldset">
                        <legend>Your Feedback</legend>
                        <label>
                            <input
                                type="radio"
                                name="feedback"
                                value="false_positive"
                                checked={feedback === 'false_positive'}
                                onChange={() => setFeedback('false_positive')}
                            />
                            Mark as False Positive
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="feedback"
                                value="accurate"
                                checked={feedback === 'accurate'}
                                onChange={() => setFeedback('accurate')}
                            />
                            Prediction is Accurate
                        </label>
                    </fieldset>
                    <label className="field">
                        <span>Additional Notes (optional)</span>
                        <textarea
                            rows="3"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Any details you want to share..."
                        />
                    </label>
                    <button type="submit" className="submit-btn">Submit</button>
                </form>
                {statusMessage && <p className="status-message">{statusMessage}</p>}
            </div>
            <footer className="options-footer">
                <span>CyberGuard &copy; 2025 &mdash; Made with <span style={{color:'#00e6e6'}}>&#10084;</span></span>
            </footer>
        </div>
    );
}
