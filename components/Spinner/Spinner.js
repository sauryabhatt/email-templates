import React from 'react';
import {Spin} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Spinner = () => {
    return <div style={{display: 'table', textAlign: 'center', width: '100%', minHeight: '100vh'}}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: 'black' }} spin />} tip='LOADING' size="large" style={{display: 'table-cell', verticalAlign: 'middle', color: 'black'}}/>
    </div>
}

export default Spinner;