import React from 'react';
import Link from "next/link";

export default function AgreementAccepted() {
    return (
        <div id='error500'>
            <p className='headings'></p>
            <p className='paragraph' style={{padding: '30vh 0 0 0'}}>You have already accepted the Qalara Seller Agreement.</p>
            <p className='paragraph'>
            <Link href='/'> Click Here </Link>
            to redirect you to the homepage or Write to us at Contact@Qalara.com for urgent queries.</p>
        </div>
    )
}