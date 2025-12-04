import React from 'react';
import './ReportModal.css';

function ReportModal({ mosque, onClose }) {
    // Replace these with your actual contact details
    const ADMIN_PHONE = '9203060898747'; // Format: CountryCode+Number (without +)

    const handleWhatsApp = () => {
        const text = encodeURIComponent(`Assalamu-alaikum, I want to report incorrect timing for mosque: ${mosque.name} (${mosque.address}). Here is the picture of the clock/chart:`);
        window.open(`https://wa.me/${ADMIN_PHONE}?text=${text}`, '_blank');
    };



    return (
        <div className="report-modal-overlay">
            <div className="report-modal-backdrop" onClick={onClose}></div>
            <div className="report-modal card">
                <button className="close-button" onClick={onClose}>&times;</button>

                <div className="report-header">
                    <div className="report-icon">⚠️</div>
                    <h2>Report Incorrect Timing</h2>
                    <p>Help us keep the community updated!</p>
                </div>

                <div className="report-content">
                    <p className="instruction-text">
                        Please send us a picture of the mosque's <strong>clock or prayer chart</strong> to verify the new timings.
                    </p>

                    <div className="report-actions">
                        <button className="report-action-btn whatsapp" onClick={handleWhatsApp}>
                            <span className="btn-icon">📱</span>
                            <div className="btn-text">
                                <span className="btn-title">Send via WhatsApp</span>
                                <span className="btn-subtitle">Fastest response</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportModal;
