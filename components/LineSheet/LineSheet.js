/** @format */
import React, { useState, useEffect ,Fragment } from "react";
import 'antd/dist/antd.css';
import { connect } from "react-redux";
import {useRouter} from "next/router";
import {
  Button,
  Row,
  Col,
  Card,
  Divider,
  Collapse,
  Badge,
  Modal,
  Input,
  Image,
  message
} from "antd";
import { InfoCircleOutlined ,FilePdfOutlined ,ExportOutlined} from '@ant-design/icons';
import PayWithPaypal from "../PayWithPayPal/PayWithPaypal";
import { useKeycloak } from "@react-keycloak/ssr";
import moment from "moment"
import { Router } from "next/router";
import { countBy } from "lodash";
const { Panel } = Collapse;
const { TextArea } = Input;


const LineSheet = (props) => {
  const router = useRouter();

  const [ orderSheetDetails , setOrderSheetDetails ] = useState([])
  const [ productsDetails , setProductsDetails ] = useState([])
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ buyerComments , setBuyerComments ] = useState([])
  const [ reviewCheckout , setReviewCheckout ] = useState({loading: false,isDisabled : false}) 
 
  const { keycloak } = useKeycloak();
  const [ getOlderVersionProducts , setGetOlderVersionProducts ] = useState([])
  const [ lastComments,setLastComments ] = useState("")

   
  const { linesheetId } = router.query ; 
  // console.log("orderSheetDetails",orderSheetDetails)
    
  const getBuyerOrderSheetDetails = (linesheetId) => {

      let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/order_page/" + linesheetId;
      fetch(url)
      .then(res => {
        if(res.ok){
          return res.json()
        }
      })
      .then( res =>{
        setOrderSheetDetails(res)
        setBuyerComments(res.comment)

        let productsAlldata = []
        for(let i = 0;i<res.products.length;i++){
          productsAlldata.push(res.products[i])
        }
        setProductsDetails(productsAlldata);
      })
  }

  useEffect(()=>{
    let { linesheetId="" } = router.query
    getBuyerOrderSheetDetails(linesheetId);
  },[router.query])



  

  const checkOut = () => {
    
       setReviewCheckout({
        loading: true,
        isDisabled : true
      })
      const { status } = orderSheetDetails;
      // console.log(status)
      if(status == "SUBMITTED_TO_BUYER"){
        let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/approve/" + linesheetId;
        // console.log("url",url)
        fetch(url)
        .then(res => {
          if(res.ok){
            return res.json()
          }
        })
        .then(res => {
          document.getElementById("buyerValidateText").style.display = "none"
          const {quoteId} = res;
          let url = process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL + "/orders/custom/" + quoteId;
          fetch(url,{
            method: "POST",
            headers: {
                "Authorization": "Bearer " + keycloak.token,
                "Content-Type": "application/json"
            },          
          }).then(res => {
            if(res.ok){
              return res.json()
            }
          })
          .then(res => {
            // console.log("res",res)
            setReviewCheckout({
              loading: false,
              isDisabled : false
            })
            let url = '/order-review/' + res.orderId
            router.push(url);
          })
        })
        .catch( err => {
          throw (err.statusText || 'Error While making payment.')
        })

      }else if(status == "APPROVED"){
        document.getElementById("buyerValidateText").style.display = "none"
        setReviewCheckout({
          loading: true,
          isDisabled : true
        })

        const { quoteId } = orderSheetDetails;
        let url = process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL + "/orders/custom/" + quoteId;
        // console.log("url",url)
        fetch(url,{
          method: "POST",
          headers: {
              "Authorization": "Bearer " + keycloak.token,
              "Content-Type": "application/json"
          },          
        }).then(res => {
          if(res.ok){
            return res.json()
          }
        })
        .then(res => {
          setReviewCheckout({
            loading: false,
            isDisabled : false
          })
          // console.log("review & Checkout",res);
          let url = '/order-review/' + res.orderId
          router.push(url);
        })
      }
  }

  

 

  const showModal = () => {
    setIsModalVisible(true);
    const { queryNumber } = orderSheetDetails;
    let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/get/older_versions/" + queryNumber
    // console.log("url",url)
    fetch(url)
    .then(res => {
      if(res.ok){
        return res.json()
      }
    }).then(res => {
      // console.log("resOlderVersion",res)

      if(res.length == 0 ){
        document.getElementById("myQuotationNoData").style.display = "block"
      }else{
        document.getElementById("myQuotationNoData").style.display = "none"
        setGetOlderVersionProducts(res);
      }
      

      // if(res.length === 0 ){
      //   console.log("No version Found")
      //   document.getElementById("myQuotationNoData").style.display = "block"
      // }else{
      //   setGetOlderVersion(res)
      //   let productsAlldata = []
      //   for(let i = 0;i<res.products.length;i++){
      //     productsAlldata.push(res.products[i])
      //   }
      //   setGetOlderVersionProducts(productsAlldata);
      //   document.getElementById("myQuotation").style.display = "block"

      // }
    })
    .catch( err => {
      throw (err.statusText || 'Error while loading your previous version')
    })

  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getPreviousVersion = () => {
    const {queryNumber} = orderSheetDetails;
    // console.log("queryNumber",queryNumber)
    let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/get/older_versions/" + queryNumber ;
    fetch(url)
    .then( res => {
      if(res.ok){
        return res.json()
      }
    })
    .then( res => {
        let Allcomments = res[0].buyerComments
        let findLastComment = Allcomments.pop()
        setLastComments(findLastComment)
        setOrderSheetDetails(res[0])
        setIsModalVisible(false);
        setTimeout(()=>{
          message.success(`You are viewing older linesheet`);
        },1000)
    })
    
  }

  const saveComments = () => {
      let buyerText = document.getElementById("buyerValidate").value;
      if([null , undefined , ""].includes(buyerText)){
        document.getElementById("buyerValidate").focus();
        document.getElementById("buyerValidateText").style.display = "block"
        return;
      }
      let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/edit_request/" + linesheetId
      // console.log("url",url)
      let UpdateComments = {
        ...orderSheetDetails,
        comment : buyerComments 
      }
      
      fetch((url),{
        method: "POST",
        body : JSON.stringify(UpdateComments),
        headers: {
            "Authorization": "Bearer " + keycloak.token,
            "Content-Type": "application/json"
        },          
      })
      .then(res =>{
        if(res.ok){
          return res.json()
        }else{
          throw (res.statusText || "error while updating your comments")
        }
      }).then(res => {
        document.getElementById("buyerValidateText").style.display = "none"
        let buyerComments = []
        for (let i = 0;i < res.buyerComments.length;i++){
          buyerComments.push(res.buyerComments[i]);
        }
        setBuyerComments(buyerComments)
        // console.log("last Comments",buyerComments)
      })
  }


  const text = (
    <div style={{ padding:"0 25px 25px 25px" }} id="disclamer">
      <p>
        a. We try our best to ensure your goods are delivered exactly as promised, but sometimes delivery may take longer due to bad weather, flight delays, custom clearance procedures, or other unforeseen circumstances.
           If such a situation arises, we will keep you regularly updated.<br/>
        b. Production is initiated after receipt of advance payment.<br/>
        c. For custom designs, production lead time will be subject to design approval.
      </p>
     
      <p style={{marginTop:"25px",fontWeight:700}}>validity</p>
      <p>Prices quoted above are valid for a period of 4 weeks from the date of the quotation.</p>
        <p style={{marginTop: "-14px"}}>* Taxes are refundable if you have the required registration to avail the refunds.</p>
    </div>
  );

  return(
    <React.Fragment>
      <Row justify="space-around" style={{ marginBottom: "20px"}}>
        <Col xs={22} sm={22} md={22} lg={22} xl={22} style={{marginTop:"25px" }}>
          <h2 id="order-sheet">Order sheet</h2>
        </Col>
        <Col span={15} xs={22} sm={22} md={22} lg={13} xl={13} id="order-sheet-details">
          <Row justify="space-between">
            <Col xs={22} sm={22} lg={7} xl={7}>
              <span>Date : {moment(orderSheetDetails.targetDeliveryDate).format("MMM Do YY")}</span>
            </Col>
          </Row>
          <Row>
            <Col xs={22} sm={22} lg={10} xl={10}>
              {/* <span>LineSheet ID : {orderSheetDetails.lineSheetNumber}</span>  */}
              <span>Quotation ID : {orderSheetDetails.quoteId}</span> 

            </Col>
          </Row>
          <Row>
            <Col xs={22} sm={22} lg={7} xl={7}>
            {/* <span>Shipping mode: {orderSheetDetails.products[0].shippingMode1}</span> */}
            <span>Shipping mode: (Air)</span>

            </Col>
          </Row>
          <Row>
            <Col xs={22} sm={22} lg={7} xl={7}>
              <span>Shipping term : {orderSheetDetails.shippingTerms} <InfoCircleOutlined style={{ fontSize: '14px', color: '#874439'}}/></span>
            </Col>
          </Row>

          {/* Your details Section  */}

          <Row style={{marginTop:"28px"}}>
            <Col xs={23} sm={23} md={22} lg={13} xl={13} id="order-details">
              <div className="site-card-border-less-wrapper card-border">
                <Card bordered={false} style={{ width: 592 }} id="card">
                  <h3 id="details-header">Your details</h3>
                  <Divider style={{'background-color':'#191919'}}/>
                  <Row justify="start" id="mobile-view">
                    <Col id="order-details" xs={22} sm={22} lg={7} xl={7}>
                      <span>Buyer org. name : </span>
                    </Col>
                    <Col id="order-details" xs={22} sm={22} lg={17} xl={17}>
                      <span>{props.user && props.user !== null && props.user.orgName} </span>
                    </Col>
                  </Row>
                  <Row justify="start" id="mobile-view">
                    <Col id="order-details" xs={22} sm={22} lg={7} xl={7}>
                      <span>Buyer Phone no : </span>
                    </Col>
                    <Col id="order-details" xs={22} sm={22} lg={10} xl={10}>
                      <span>{props.user && props.user !== null && props.user.orgPhone} </span>
                    </Col>
                  </Row>
                  <Row justify="start" id="mobile-view">
                    <Col id="order-details" xs={22} sm={22} lg={7} xl={7}>
                      <span>Buyer e-mail ID : </span>
                    </Col>
                    <Col id="order-details" xs={22} sm={22} lg={17} xl={17}>
                      {/* <span>{props.user.email} </span> */}
                      <span>{props.user && props.user !== null && props.user.email} </span>
                    </Col>
                  </Row>
                  <Row justify="start" id="mobile-view">
                    <Col id="order-details" xs={22} sm={22} lg={7} xl={7}>
                      <span>ABN / VAT / EORI / UEN /Tax Number: </span>
                    </Col>
                    <Col id="order-details" xs={22} sm={22} lg={12} xl={12}>
                      <span>324563728</span>
                    </Col>
                  </Row>
                  <Row justify="start" id="mobile-view">
                    <Col id="order-details" xs={22} sm={22} lg={7} xl={7}>
                      <span>Delivery address : </span>
                    </Col>
                    <Col id="order-details" xs={22} sm={22} lg={17} xl={17}>
                      <span>{orderSheetDetails.deliveryAddress}</span>
                    </Col>
                  </Row>
                  <Row justify="start" id="mobile-view">
                    <Col id="order-details" xs={22} sm={22} lg={7} xl={7}>
                      <span>Zipcode : </span>
                    </Col>
                    <Col id="order-details" xs={22} sm={22} lg={17} xl={17}>
                      <span>{orderSheetDetails.zipCode} </span>
                    </Col>
                  </Row>
                  <Row justify="start" id="mobile-view">
                    <Col id="order-details" xs={22} sm={22} lg={7} xl={7}>
                      <span>Country : </span>
                    </Col>
                    <Col id="order-details" xs={22} sm={22} lg={17} xl={17}>
                      <span>{orderSheetDetails.country} </span>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Col>
          </Row>
        </Col> 

        {/* Payment Section  */}

        <Col span={9} xs={22} sm={22} md={22} lg={7} xl={7} id="order-sheet-details">
          <Card id="order-summary-details" style={{backgroundColor:'#F2F0EB', width:350 , height : 544 , }}>
            <Row justify="space-between">
              <Col><span id="order-summary">Order summary</span></Col>
              <Col><span id="order-currency">USD</span></Col>
            </Row>
            <Divider style={{'background-color':'#191919'}}/>
            <Row justify="space-between">
              <Col><span>Value of products purchsed</span></Col>
              <Col>
                <span>
                   ${orderSheetDetails.totalProductPurchasedValue}
                </span>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col><span>Qalara Margin</span></Col>
              <Col>
                <span>
                  ${orderSheetDetails.qalaraMargin === null ? "00.00" : orderSheetDetails.qalaraMargin }
                </span>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col><span>Estimated freight fees</span></Col>
              <Col>
                <span>
                  ${
                    orderSheetDetails.shippingTerms === "DDU" ?
                    orderSheetDetails && orderSheetDetails.allCharges && orderSheetDetails.allCharges.miscChargeDDU.find(x => x.chargeId === "FREIGHT_MAX").amount
                    : orderSheetDetails && orderSheetDetails.allCharges && orderSheetDetails.allCharges.miscChargeDDP.find(x => x.chargeId === "FREIGHT_MAX").amount
                  }
                </span>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col><span>Covid surcharge(freight)</span></Col>
              <Col>
                <span>
                   ${orderSheetDetails.covidSurchargeFreight === null ? "00.00" : orderSheetDetails.covidSurchargeFreight}
                </span>
              </Col>
            </Row>
            <Row justify="space-between" id="order-summary-details-green">
              <Col><span>Qalara margin/Covid <br/> surcharge discounted</span></Col>
              <Col>
                <span>
                  
                </span>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col><span>Estimated Custom Duties</span></Col>
              <Col>
                <span>
                  ${
                    orderSheetDetails.shippingTerms === "DDU" ?
                    orderSheetDetails && orderSheetDetails.allCharges && orderSheetDetails.allCharges.miscChargeDDU.find(x => x.chargeId === "DUTY_MAX").amount
                    : orderSheetDetails && orderSheetDetails.allCharges && orderSheetDetails.allCharges.miscChargeDDP.find(x => x.chargeId === "DUTY_MAX").amount
                  }
                </span>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col><span>Estimated VAT / GST / Taxes</span></Col>
              <Col>
                <span>
                  ${
                    orderSheetDetails.shippingTerms === "DDU" ?
                    orderSheetDetails && orderSheetDetails.allCharges && orderSheetDetails.allCharges.miscChargeDDU.find(x => x.chargeId === "VAT").amount
                    : orderSheetDetails && orderSheetDetails.allCharges && orderSheetDetails.allCharges.miscChargeDDP.find(x => x.chargeId === "VAT").amount
                  }
                </span>
              </Col>
            </Row>

            <Row justify="space-between" id="order-summary-details-green">
              <Col><span>Discount</span></Col>
              <Col>
                <span>
                  ${
                    orderSheetDetails.shippingTerms === "DDU" ?
                    orderSheetDetails && orderSheetDetails.allCharges && orderSheetDetails.allCharges.miscChargeDDU.find(x => x.chargeId === "DISCOUNT").amount
                    : orderSheetDetails && orderSheetDetails.allCharges && orderSheetDetails.allCharges.miscChargeDDP.find(x => x.chargeId === "DISCOUNT").amount
                  }
                </span>
              </Col>
            </Row>

            <Divider style={{'background-color':'#191919'}}/>
            <Row justify="space-between" id="total-order-value">
              <Col><span> Total order value ({orderSheetDetails.shippingTerms})</span></Col>
              <Col><span> ${orderSheetDetails.totalOrderValue}</span></Col>
            </Row>

            <Row style={{marginTop:"20px"}}>
                <Col span={24}><Button style={{width:"100%"}} id="reviewBtn" loading={reviewCheckout.loading} disabled={reviewCheckout.isDisabled} onClick={checkOut} >REVIEW & CHECKOUT </Button></Col>
            </Row>

            <Row justify="space-between" id="paynow">
              <Col><span>PAY NOW</span></Col>
              <Col>
                <span>
                  ${
                    orderSheetDetails.shippingTerms === "DDU" ? 
                    orderSheetDetails && orderSheetDetails.paymentTerms && orderSheetDetails.paymentTerms.paymentTermsDDU.find(x => x.chargeId === "ADVANCE").amount
                    : orderSheetDetails && orderSheetDetails.paymentTerms && orderSheetDetails.paymentTerms.paymentTermsDDP.find(x => x.chargeId == "ADVANCE").amount
                  }
                </span>
              </Col>
            </Row>

            <Row justify="space-between" id="paylater">
              <Col><span>PAY LATER</span></Col>
              <Col>
                <span>
                  ${
                    orderSheetDetails.shippingTerms === "DDU" ? 
                    orderSheetDetails && orderSheetDetails.paymentTerms && orderSheetDetails.paymentTerms.paymentTermsDDU.find(x => x.chargeId === "POST_DELIVERY").amount
                    : orderSheetDetails && orderSheetDetails.paymentTerms && orderSheetDetails.paymentTerms.paymentTermsDDP.find(x => x.chargeId == "POST_DELIVERY").amount
                  }
                </span>
              </Col>
            </Row>
          </Card>
        </Col> 

              {/* DataTable section */}
        
        <Col xs={22} sm={22} md={22} lg={22} xl={22} style={{marginTop:"25px" }}>
            <table style={{width:"100%"}}>
              <tr style={{height:"100px"}}>
                <th style={{fontWeight:"900"}}><span>USD</span></th>
                {productsDetails.map(ele => (
                  <td key={ele}>
                    <span>
                      {
                        <Image
                          width={130}
                          height={100}
                          style={{
                            border : "1px solid rgb(204, 204, 204)",
                            marginTop:"2px",
                          }}
                          src={ele.imageUrl}
                          fallback="data:image/png;base64,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"
                        />
                      }
                    </span>
                  </td>
                ))}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Product name/<br/> Description</span></th>
                {productsDetails.map(ele =><td key={ele}><span>{ele.productName}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th style={{fontWeight:"900"}}><span>Quantity units</span></th>
                {productsDetails.map(ele =><td key={ele}><span>{ele.lbhUnit}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th style={{fontWeight:"900"}}><span>Quantity</span></th>
                {productsDetails.map(ele =><td key={ele}><span>{ele.quantity}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span><span>Item ID</span></span></th>
                {productsDetails.map(ele =><td key={ele}><span>{ele.id.replace("PRODUCT::","")}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th style={{color:"#02873A",fontWeight:"900"}}><span>FREE shipping</span></th>
                {productsDetails.map(ele => <td key={ele}><span>{ele.freeShippingEligible ? "Yes" : "No"}</span></td>)} 
              </tr>
              <tr style={{height:"45px"}}>
                <th style={{fontWeight:"900"}}><span>Door Delivered Price incl.<br/> Duties and taxes DDP</span></th>
                {productsDetails.map(ele => <td key={ele}><span>{ele.doorDeliveredPrice}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Color / Finish</span></th>
                {productsDetails.map(ele => <td key={ele}><span>{ele.colorOrFinish}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Product size</span></th>
                <td><span>55</span></td>
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Product size units</span></th>
                {productsDetails.map(ele => <td key={ele}><span>{ele.casePackLBHUnit}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Product weight</span></th>
                {productsDetails.map(ele => <td key={ele}><span>{ele.casePackWeight}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Product weight units</span></th>
                {productsDetails.map(ele => <td key={ele}><span>{ele.casePackWeightUnit}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Material</span></th>
                {productsDetails.map(ele => <td key={ele}><span>{ele.material}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Specification 1</span></th>
                {productsDetails.map(ele => <td key={ele}><span>{ele.specification1}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Specification 2</span></th>
                {productsDetails.map(ele => <td key={ele}><span>{ele.specification2}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Minimum order quantity</span></th>
                {productsDetails.map(ele => <td key={ele}><span>{ele.minimumOrderQuantity}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Production Lead time  DAYS</span></th>
                <td><span>10days</span></td>
              </tr>
              <tr style={{height:"45px"}}>
                <th><span>Base price</span></th>
                  {productsDetails.map(ele => <td key={ele}><span>{ele.priceApplied}</span></td>)}
              </tr>
              <tr style={{height:"45px"}}>
                <th>
                  <span style={{color:"#005098"}}>Enter your comments here</span>
                  <span><button style={{border:"none",textDecoration:"underline",cursor:"pointer"}} onClick={saveComments}>Save</button></span>
                </th>
                  {productsDetails.map(ele => (
                    <td key={ele}>
                      <span>
                        {<TextArea id="buyerValidate" value={lastComments.comment} style={{marginTop:"1px",marginBottom:"1px",width:"70%"}} onChange={ (e) => setBuyerComments(e.target.value)} />}
                      </span>
                      <Row id="buyerValidateText" style={{display:"none"}}>
                        <span style={{color : "red",display:"flex",justifyContent:"center",alignItems:"center"}}>* Comments can not be blank</span>
                      </Row>
                    </td>
                  ))}
              </tr>
            </table>

        </Col>

            {/* CheckOut & previous sections section */}

        <Col xs={22} sm={22} md={22} lg={22} xl={22} style={{marginTop:"25px" }}>
          <Row justify="space-between">
            <Col xs={24} sm={24} md={24} lg={9} xl={9}>
              <span>
                <Button style={{width:"65%"}} id="previous-version" onClick={showModal}>SHOW PREVIOUS VERSION </Button>
              </span>
              <Modal title="PREVIOUS QUOTATIONS" visible={isModalVisible} onCancel={handleCancel} footer={[]}>
                <p id="mobile-popup" style={{fontFamily:"Sen",fontSize:"14px"}}>Please click on the linesheet version you want to view:</p>
                <Row justify="space-around" id="myQuotation" style={{display:"block"}}>
                  {/* <span style={{fontFamily:"Sen"}}>05 Mar 21</span> */}
                    {getOlderVersionProducts.map((product , i) => (<a onClick={getPreviousVersion} style={{color:"#9D4930",fontFamily:"Sen"}} key={i}><ExportOutlined style={{marginRight:"5px"}}/>linesheet ID: {product.lineSheetNumber}</a>))}
                </Row>
                <Row justify="center" id="myQuotationNoData" style={{display:"none"}}>
                  <span style={{fontFamily:"Sen",color:"#9D4930",display:"flex",justifyContent:"center",alignItems:"center"}}>* No previous version found.</span>  
                </Row>
              </Modal> 
              <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{marginTop:"10px"}}>
                <Row justify="space-between" style={{marginTop:"18px"}}>
                  <span id="estimated-date">Estimated delivery date:</span>
                  <span style={{color:"#02873A",fontSize:"17px"}} id="delivery-time">
                    {/* {moment(orderSheetDetails.targetDeliveryDate).format("MMM Do YY")}  */}
                    
                      {orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.totalEstTimeMinDays === null
                        ? "1st April 21"
                        : moment(orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.totalEstTimeMinDays).format("MMM do YY")
                      }-{
                        orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.totalEstTimeMaxDays === null
                        ? "25th April 21"
                        : moment(orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.totalEstTimeMaxDays).format("MMM do YY")
                      }
                    
                  </span>
                </Row>
                <Divider style={{marginTop:"9px",marginBottom:"11px"}}/>
                <Row justify="space-between" style={{marginTop:"6px"}} id="estimated-time">
                  <Col>
                      <Badge color="#D9BB7F"/>
                      <span>Estimated production/dispatch time</span>
                  </Col>
                  <span>
                    {
                      orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.estimatedProductionTimeMinDays == null
                      ? "10"
                      : orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.estimatedProductionTimeMinDays
                    }-{
                      orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.estimatedProductionTimeMaxDays == null
                      ? "20"
                      :orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.estimatedProductionTimeMaxDays
                      } days
                  </span>
                </Row>
                <Row justify="space-between" style={{marginTop:"6px"}} id="estimated-time">
                  <Col>
                    <Badge color="#D9BB7F"/>
                    <span>Estimated shipping lead time (Air)</span>
                  </Col>
                  <span>
                    {
                      orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.estimatedLeadTimeMinDays == null
                      ? "10"
                      :orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.estimatedLeadTimeMinDays
                    }-{
                      orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.estimatedLeadTimeMaxDays == null
                      ? "16"
                      :orderSheetDetails && orderSheetDetails.shippingDetails && orderSheetDetails.shippingDetails.estimatedLeadTimeMaxDays
                    } days
                  </span>
                </Row>
              </Col>
            </Col>
            <Col xs={24} sm={24} md={24} lg={6} xl={6} id="final-checkout">
              <span>
                <Button id="review-checkout" style={{width:"100%"}} loading={reviewCheckout.loading} disabled={reviewCheckout.isDisabled} onClick={checkOut} >REVIEW & CHECKOUT </Button>
              </span>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{marginTop:"10px"}}>
                  <p id="secure-msg">Secure payments. Product assurance.</p>
                  <p id="paylater1">Pay 20% now, balance later!</p>
              </Col>
            </Col>
          </Row>
        </Col>

        
       

        <Col xs={22} sm={22} md={22} lg={22} xl={22} style={{marginTop:"35px"}}>
          <Collapse bordered={false}>
            <Panel header="PRODUCT SPECIFICATIONS (CUSTOM DESIGNS)" style={{backgroundColor:'#F2F0EB',fontFamily:"Sen"}}>
              <Row style={{padding:"10px 25px 25px 25px",marginLeft:"10px"}} >
                <FilePdfOutlined style={{ fontSize: '25px', color: '#e4605e',marginLeft:"12px"}}/> <span style={{marginLeft:"12px"}}>DOWNLOAD ATTACHMENT 1</span>
                {/* <FilePdfOutlined style={{ fontSize: '25px', color: '#e4605e',marginLeft:"12px"}}/> <span style={{marginLeft:"12px"}}>DOWNLOAD ATTACHMENT 2</span>
                <FilePdfOutlined style={{ fontSize: '25px', color: '#e4605e',marginLeft:"12px"}}/> <span style={{marginLeft:"12px"}}>DOWNLOAD ATTACHMENT 3</span>
                <FilePdfOutlined style={{ fontSize: '25px', color: '#e4605e',marginLeft:"12px"}}/> <span style={{marginLeft:"12px"}}>DOWNLOAD ATTACHMENT 4</span> */}
              </Row>
            </Panel>
          </Collapse>
        </Col>

        <Col xs={22} sm={22} md={22} lg={22} xl={22} style={{marginTop:"10px",marginBottom:"45px"}}>
          <Collapse bordered={false}>
            <Panel header="DISCLAIMERS" style={{backgroundColor:'#F2F0EB',fontFamily:"Sen"}}>
              {text}
            </Panel>
          </Collapse>
        </Col>

        
      </Row>
    </React.Fragment>
  )
}
// export default LineSheet

const mapStateToProps = (state) => {
  return {
    user: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps,null)(LineSheet);
