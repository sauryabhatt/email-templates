import React from 'react';

export default function NotVerifiedUser() {
    return (
        <div id='error500'>
            <p className='headings'></p>
            <p className='paragraph' style={{padding: '30vh 0 0 0'}}>Please sign in using your registered email id. <br/>
            The email you have used to sign in is different from the email that you had used to register as a seller</p>
            <p className='paragraph'>
            Please write to us at help@qalara.com if you face any issues or if you have any questions</p>
        </div>
    )
}