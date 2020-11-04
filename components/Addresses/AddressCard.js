import React from 'react';
import { Row, Col, Menu, Button, Tooltip, Modal, Input, Form, Radio, Select } from "antd";
import Icon, { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const AddressCard = (props) => {
    const mediaMatch = window.matchMedia("(min-width: 768px)");
    return (
        <Row style={{marginBottom: '20px'}}>
            <Col xs={24} sm={24} md={24} lg={24} style={mediaMatch.matches ? { padding: '20px', backgroundColor: '#F2F0EB' } : { backgroundColor: '#F2F0EB' }}>
                <Row style={mediaMatch.matches ? {} : { paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '15px' }}>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <span className={mediaMatch.matches ? "qa-font-san qa-fs-20": "qa-font-san qa-fs-17"}  style={{ color: '#191919' }}>{props.data.fullName}</span>
                    </Col>
                    {mediaMatch.matches ? 
                    props.data.isDefault ? <Col xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span className="qa-font-san qa-fs-14 qa-fw-b" style={{ color: '#D9BB7F' }}>Default address</span>
                    </Col> :  <Col xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span className="qa-font-san qa-fs-14 qa-fw-b" style={{ color: '#874439', textDecoration: 'underline', cursor: 'pointer' }} onClick={(e)=>props.makeDefault(props.data.id)}>Make Default address</span>
                    </Col> :
                        <Col xs={12} sm={12} md={12} lg={12} style={{ marginTop: '5px' }}>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12} className="qa-col-end">
                                    {/* <Tooltip placement="top" title={<span>Edit</span>}>
                                                    <span className="qa-font-san qa-fs-14 qa-fw-b"><EditOutlined /></span>
                                                </Tooltip> */}
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} className="qa-col-end">
                                    <Col xs={12} sm={12} md={12} lg={12} className="qa-col-start">
                                        <Tooltip placement="top" title={<span>Edit</span>}>
                                            <span className="qa-font-san qa-fs-14 qa-fw-b" onClick={(e)=> props.handleEdit(props.data.id)}><EditOutlined /></span>
                                        </Tooltip>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={12} className="qa-col-end">
                                        <Tooltip placement="top" title={<span>Delete</span>}>
                                            <span className="qa-font-san qa-fs-14 qa-fw-b" onClick={(e)=>props.handleAddressDelete(props.data.id)}><DeleteOutlined /></span>
                                        </Tooltip>
                                    </Col>
                                    {/* <Tooltip placement="top" title={<span>Delete</span>}>
                                                    <span className="qa-font-san qa-fs-14 qa-fw-b"><DeleteOutlined /></span>
                                                </Tooltip> */}
                                </Col>
                            </Row>
                        </Col>}
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={0} lg={0}>
                        <hr style={{ border: '1px solid #E5E5E5' }} />
                    </Col>
                </Row>
                <Row style={mediaMatch.matches ? { paddingTop: '10px' } : { paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '15px' }}>
                    <Col xs={24} sm={24} md={15} lg={15}>
                        <span className="qa-font-san qa-fs-14" style={{ color: '#191919' }}>{props.data.addressLine1}, {props.data.addressLine2} , {props.data.city}, {props.data.state}, {props.data.country}, {props.data.zipCode}</span>
                    </Col>
                    <Col xs={0} sm={0} md={9} lg={9}>
                        <Row>
                            <Col xs={18} sm={0} md={18} lg={18}></Col>
                            <Col xs={18} sm={18} md={3} lg={3}>
                                <Tooltip placement="top" title={<span>Edit</span>}>
                                    <span className="qa-font-san qa-fs-14 qa-fw-b" onClick={(e)=> props.handleEdit(props.data.id)}><EditOutlined /></span>
                                </Tooltip>
                            </Col>
                            <Col xs={18} sm={18} md={3} lg={3}>
                                <Tooltip placement="top" title={<span>Delete</span>}>
                                    <span className="qa-font-san qa-fs-14 qa-fw-b" onClick={(e)=>props.handleAddressDelete(props.data.id)}><DeleteOutlined /></span>
                                </Tooltip>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {mediaMatch.matches ? '' : <Row style={mediaMatch.matches ? {} : { paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '15px' }}>
                    {props.data.isDefault ? <Col xs={24} sm={24} md={0} lg={0} className="qa-col-center">
                        <span className="qa-font-san qa-fs-14 qa-fw-b" style={{ color: '#D9BB7F' }}>Default address</span>
                    </Col> : <Col xs={24} sm={24} md={0} lg={0} className="qa-col-center">
                        <span className="qa-font-san qa-fs-14 qa-fw-b" style={{ color: '#874439', textDecoration: 'underline' }} onClick={(e)=> props.makeDefault(props.data.id)}>Make default address</span>
                    </Col>}
                </Row>}
            </Col>
        </Row>
    )
}

export default AddressCard;