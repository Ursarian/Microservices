import React from 'react';

function AlertBox({ type = 'info', message, onClose }) {
    if (!message) return null;

    const bg = {
        info: '#cce5ff',
        success: '#d4edda',
        error: '#f8d7da'
    }[type] || '#eee';

    return (
        <div style={{
            backgroundColor: bg,
            padding: '1rem',
            marginBottom: '1rem',
            border: '1px solid #999',
            borderRadius: '4px',
            position: 'relative'
        }}>
            <span>{message}</span>
            {onClose && (
                <button onClick={onClose} style={{
                    position: 'absolute',
                    right: 10,
                    top: 5,
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>×</button>
            )}
        </div>
    );
}

export default AlertBox;