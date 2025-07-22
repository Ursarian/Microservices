import React, { useEffect } from 'react';

function NotFound() {
    useEffect(() => {
        document.title = "404 Not Found";
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <h1>404</h1>
            <p>Sorry, nothing found at this address.</p>
        </div>
    );
}

export default NotFound;
