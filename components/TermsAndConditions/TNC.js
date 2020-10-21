import React from 'react'
import dynamic from 'next/dynamic'
const PDFViewer = dynamic(()=>import('./TermsAndConditions'), { ssr: false });

function TNC() {
    return (
        <div>
             <PDFViewer />
        </div>
    )
}

export default TNC
