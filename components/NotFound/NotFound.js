import React from 'react';
import { Link } from 'next/link';
export default function NotFound(props) {
    return (
        <div id='not-found'>
        <p className='headings'>Sorry.</p>
        <p className='paragraph'>This page cannot be found.</p>
        <p className='paragraph'>Please <Link href='/'> Click Here </Link>to go to Qalara Home.</p>
    </div>
    )
}