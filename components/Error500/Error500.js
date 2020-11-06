import React from 'react';

import queryString from 'query-string';

import Link from 'next/link'
import { Button } from 'antd';
import {useRouter} from 'next/router'


export default function Error500(props) {
    const router = useRouter()
    const values = router.query;
    const handleReload = () => {
        window.location.reload();
    }
    return (
        <div id='error500'>
            <p className='headings'>Sorry.</p>
            <p className='paragraph'>Our page is down for maintenance.<br />We will be back soon.</p>
            <p className='paragraph'>Please
            {/* {(props.exception && props.exception.message) || values.message} */}
            {props.path ? <Button type="link" onClick={handleReload} > Click Here </Button> :
                <Link href={values.redirectURI || '/'}> Click Here </Link>}
            or Write to us at Contact@Qalara.com for urgent queries.</p>
        </div>
    )
}