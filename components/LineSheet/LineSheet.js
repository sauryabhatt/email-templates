/** @format */
import React, { useState, useEffect } from "react";
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
  message,
  Tooltip,
  Upload
} from "antd";
import { InfoCircleOutlined ,FilePdfOutlined ,ExportOutlined} from '@ant-design/icons';
import { useKeycloak } from "@react-keycloak/ssr";
import moment from "moment"

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
  const [orderId , setOrderId ] = useState("")

  console.log("orderSheetDetails",orderSheetDetails) 

  const { linesheetId } = router.query ; 
    
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
          console.log("productsAlldata",productsAlldata)
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
      if(["WITH_BUYER_TEAM","SUBMITTED_TO_BUYER","WITH_FF_TEAM","WITH_LOGISTICS_TEAM"].includes(status)){
          let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/approve/" + linesheetId;
          fetch(url)
          .then(res => {
            if(res.ok){
              return res.json()
            }else{
              throw(res.statusText || 'Error while approving order')
            }
          }).then(res => {
              const { quoteId } = res;
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
                }else{
                  throw(res.statusText || 'Error while getting order id')
                }
              }).then(res =>{
                const { orderId } = res;
                let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/update/" + linesheetId + "/for-quote-with/" + orderId;
                fetch(url,{
                  method: "PUT",
                  headers: {
                      "Authorization": "Bearer " + keycloak.token,
                      "Content-Type": "application/json"
                  },   
                }).then(res => {
                  if(res.ok){
                    return res.json()
                  }else{
                    throw(res.statusText || 'something went wrong')
                  }
                }).then(res => {
                  let url = '/order-review/' + orderId
                  router.push(url);
                  setReviewCheckout({
                    loading: false,
                    isDisabled : false
                  })
                })
              })
          })
      }

      if(status === "APPROVED"){
        console.log("status",status)
        setReviewCheckout({
          loading: true,
          isDisabled : true
        })
        const { quoteId } = orderSheetDetails;
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
            }else{
              throw(res.statusText || 'Error while getting order id')
            }
          }).then(res =>{
              const {orderId} = res;
              let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/update/" + linesheetId + "/for-quote-with/" + orderId;
                fetch(url,{
                  method: "PUT",
                  headers: {
                      "Authorization": "Bearer " + keycloak.token,
                      "Content-Type": "application/json"
                  },   
                }).then(res => {
                  if(res.ok){
                    return res.json()
                  }else{
                    throw(res.statusText || 'something went wrong')
                  }
                }).then(res => {
                  console.log("res",res)
                  let url = '/order-review/' + orderId
                  router.push(url);
                  setReviewCheckout({
                    loading: false,
                    isDisabled : false
                  })
                })
          })
      }
  }

 

  const showModal = () => {
    setIsModalVisible(true);
    const { queryNumber } = orderSheetDetails;
    let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/get/older_versions/" + queryNumber
    fetch(url)
    .then(res => {
      if(res.ok){
        return res.json()
      }
    }).then(res => {
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
    let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/get/older_versions/" + queryNumber ;
    fetch(url)
    .then( res => {
      if(res.ok){
        return res.json()
      }
    })
    .then( res => {
        console.log("getPreviousVersion",res)
        document.getElementById("review-and-checkout").style.display = "none"
        document.getElementById("review-checkout").style.display = "none"
        // document.getElementById("newest-version").style.display = "block"
        // document.getElementById("previous-version").style.display = "none"
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

  const getNewestVersion = () => {
    let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/order_page/" + linesheetId;
    fetch(url)
    .then(res => {
      if(res.ok){
        return res.json()
      }
    }).then(res => {
      document.getElementById("newest-version").style.display = "none"
      document.getElementById("previous-version").style.display = "block"
      setOrderSheetDetails(res)
    })
  }

  const commentsUpdate = (e) => {
      let value = e.target.value
      setBuyerComments(value)
  }



  const saveComments = () => {
      let buyerText = document.getElementById("buyerValidate").value;
      if([null , undefined , ""].includes(buyerText)){
        document.getElementById("buyerValidate").focus();
        document.getElementById("buyerValidateText").style.display = "block"
        return;
      }
       let updatedProductDetails = []
       for(let i = 0;i<productsDetails.length;i++){
         let obj = {...productsDetails[i]}
         console.log("obj",obj)
         let buyerComment = [
          {
            comment : buyerComments,
            dateTime : new Date()
          }
        ]

        // console.log("buyerComments",buyerComments)
         obj['buyerComments'] = buyerComment
        updatedProductDetails.push(productsDetails[i])
        
      }
      console.log("productsAlldata",updatedProductDetails)

      let ProductUpdate = {
        deliveryAddress: orderSheetDetails.deliveryAddress,
        quoteId: orderSheetDetails.quoteId,
        queryNumber: orderSheetDetails.queryNumber,
        status: orderSheetDetails.status,
        country: orderSheetDetails.country,
        zipCode: orderSheetDetails.zipCode,
        city: orderSheetDetails.city,
        targetDeliveryDate: orderSheetDetails.targetDeliveryDate,
        buyerName: orderSheetDetails.buyerName,
        buyerCode: orderSheetDetails.buyerCode,
        currency: orderSheetDetails.currency,
        shippingTerms: orderSheetDetails.shippingTerms,
        shippingTerms: orderSheetDetails.shippingTerms,
        products : updatedProductDetails,
        miscCharges: orderSheetDetails.miscCharges,
        shippingMode: orderSheetDetails.shippingMode,
        totalProductValue: orderSheetDetails.totalProductValue,
        totalOrderValue: orderSheetDetails.totalOrderValue,
        shippingDetails: orderSheetDetails.shippingDetails,
        additionalInstruction: orderSheetDetails.additionalInstruction,
        customizedPackagingDetails: orderSheetDetails.customizedPackagingDetails,
        covidSurchargeFreight: orderSheetDetails.covidSurchargeFreight,
        qalaraMargin: orderSheetDetails.qalaraMargin,
        paymentTerms: orderSheetDetails.paymentTerms
      }

      console.log("ProductUpdate",JSON.stringify(ProductUpdate))

      let url = process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/lineSheet/edit_request/" + linesheetId
      
      fetch((url),{
        method: "POST",
        body : JSON.stringify(ProductUpdate),
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
        console.log("res",res)
        setTimeout(()=>{
          message.success('comment saved successfully')
        },1000)
        // document.getElementById("buyerValidateText").style.display = "none"
        // let buyerComments = []
        // for (let i = 0;i < res.buyerComments.length;i++){
        //   buyerComments.push(res.buyerComments[i]);
        // }
        // setBuyerComments(buyerComments)
        // console.log("last Comments",buyerComments)
      })
  }


  const text = (
    <div style={{ padding:"0 25px 25px 25px" }} id="disclamer">
      {orderSheetDetails.disclaimer !== null ? <p>{orderSheetDetails.disclaimer} </p> : ""}

      <p style={{fontWeight:"bold",marginBottom:"5px"}}>Validity</p>
      <p>Prices quoted above are valid for a period of 4 weeks from the date of the quotation. 
      <br/>* Taxes are refundable if you have the required registration to avail the refunds.</p>
    </div>
  );

  const handlePreview = async(file) => {
    let src = file.url;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
  }

  // console.log("object",orderSheetDetails?.productSpecificationUrls?.length === 0) q 

  const ddutext = <span
            style={{
                fontFamily:"Sen",
                fontSize:"13px",
                fontWeight:"600"
            }}
        >
            Any applicable duties and taxes are paid directly by you to the freight or logistics partner during customs clearance or delivery as applicable.
        </span>


        const ddptext = <span
            style={{
                fontFamily:"Sen",
                fontSize:"13px",
                fontWeight:"600"
            }}
        >
        Any applicable duties and taxes are estimated and charged to you by Qalara and paid during customs clearance on your behalf
    </span>

  return(
    <React.Fragment>
      <Row justify="space-around">
        <Col xs={22} sm={22} md={22} lg={22} xl={22} style={{marginTop:"25px" }}>
          <h2 id="order-sheet">Order sheet</h2>
        </Col>
        <Col span={15} xs={22} sm={22} md={22} lg={13} xl={13} id="order-sheet-details">
          <Row justify="space-between">
            <Col xs={22} sm={22} lg={7} xl={7}>
              <span >Date : {moment(orderSheetDetails.targetDeliveryDate).format("Do MMM YY")}</span>
            </Col>
          </Row>
          <Row>
            <Col xs={22} sm={22} lg={10} xl={10}>
              <span>LinesheetID : {linesheetId}</span> 
            </Col>
          </Row>
          <Row>
            <Col xs={22} sm={22} lg={7} xl={7}>
              <span>Shipping mode: {orderSheetDetails.shippingMode}</span>
            </Col>
          </Row>
          <Row>
            <Col xs={22} sm={22} lg={7} xl={7}>
              <span>Shipping term : {orderSheetDetails.shippingTerms} </span> 
              <Tooltip color="#191919" placement="bottom" title={orderSheetDetails.shippingTerms === "DDU" ? ddutext : ddptext}>
                <InfoCircleOutlined style={{ fontSize: '14px', color: '#874439'}}/>
              </Tooltip>
            </Col>
          </Row>

          {/* Your details Section  */}

          <Row style={{marginTop:"28px"}}>
            <Col xs={23} sm={23} md={22} lg={13} xl={13} id="order-details">
              <div className="site-card-border-less-wrapper card-border">
                <Card bordered={false} style={{ width: 592 ,background:"#F9F7F2"}} id="card">
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
                    <Col id="order-details" style={{lineHeight:"21px"}} xs={22} sm={22} lg={7} xl={7}>
                      <span>ABN / VAT / EORI / UEN /Tax Number : </span>
                    </Col>
                    <Col id="order-details" style={{marginTop:"3.3%"}} xs={22} sm={22} lg={12} xl={12}>
                      <span>{orderSheetDetails.taxNumber}</span>
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
          <Card id="order-summary-details" style={{backgroundColor:'#F2F0EB', width:350 , height : 544 ,boxShadow:"0px 1px 1px rgba(25, 25, 25, 0.2)"}}>
            <Row justify="space-between" className="order-details-name">
              <Col><span id="order-summary">Order summary</span></Col>
              <Col><span id="order-currency">{orderSheetDetails?.currency}</span></Col>
            </Row>
            <Divider style={{'background-color':'#191919',marginTop:"9px",marginBottom:"9px"}}/>
            <Row justify="space-between" className="order-details-name">
              <Col><span>Value of products purchsed</span></Col>
              <Col>
                <span>
                  {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{' '}
                  {''}{orderSheetDetails.totalProductValue}
                </span>
              </Col>
            </Row>
            <Row justify="space-between" className="order-details-name">
              <Col><span>Qalara Margin</span></Col>
              <Col>
                <span>
                {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{' '}
                  {orderSheetDetails.qalaraMargin === null ? "00.00" : orderSheetDetails.qalaraMargin }
                </span>
              </Col>
            </Row>
            <Row justify="space-between" className="order-details-name">
              <Col><span>Estimated freight fees</span></Col>
              <Col>
                <span>
                  {/* {
                    orderSheetDetails.shippingTerms === "DDU" ?
                    orderSheetDetails && orderSheetDetails.allCharges && orderSheetDetails.allCharges.miscChargeDDU.find(x => x.chargeId === "FREIGHT_MAX").amount
                    : orderSheetDetails && orderSheetDetails.allCharges && orderSheetDetails.allCharges.miscChargeDDP.find(x => x.chargeId === "FREIGHT_MAX").amount
                  } */}
                  {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{' '}
                  {orderSheetDetails?.miscCharges?.find(x => x.chargeId == "TOTAL_COST_FREIGHT_MAX").amount}
                </span>
              </Col>
            </Row>
            <Row justify="space-between" className="order-details-name">
              <Col><span>Covid surcharge(freight)</span></Col>
              <Col>
                <span>
                  {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{' '}
                  {orderSheetDetails.covidSurchargeFreight === null ? "00.00" : orderSheetDetails.covidSurchargeFreight}
                   {/* {orderSheetDetails?.covidSurchargeFreight} */}
                </span>
              </Col>
            </Row>
            <Row justify="space-between" id="order-summary-details-green" className="order-details-name" style={{lineHeight:"19px"}}>
              <Col xs={18} sm={18} md={19} lg={19} xl={19}><span>Qalara margin/Covid surcharge discounted</span></Col>
              <Col>
                <span>
                  {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{' '}
                  0
                </span>
              </Col>
            </Row>

            <Row justify="space-between" className="order-details-name">
              <Col><span>Estimated Custom Duties</span></Col>
              <Col>
                <span>
                  {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{" "}
                  {orderSheetDetails?.miscCharges?.find(x => x.chargeId == "DUTY_MAX").amount}
                </span>
              </Col>
            </Row>

            <Row justify="space-between" className="order-details-name">
              <Col><span>Estimated VAT / GST / Taxes</span></Col>
              <Col>
                <span>
                  {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{' '}
                  {orderSheetDetails?.miscCharges?.find(x => x.chargeId == "VAT").amount}
                </span>
              </Col>
            </Row>

            <Row justify="space-between" id="order-summary-details-green" className="order-details-name">
              <Col><span>Discount</span></Col>
              <Col>
                <span>
                  {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{' '}
                  {orderSheetDetails?.miscCharges?.find(x => x.chargeId == "DISCOUNT").amount}
                </span>
              </Col>
            </Row>

            <Divider style={{'background-color':'#191919',marginBottom:"20px",marginTop:"13px"}}/>
            <Row justify="space-between" id="total-order-value">
              <Col><span> Total order value ({orderSheetDetails.shippingTerms})</span></Col>
              <Col>
                  {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{' '}
                <span> {orderSheetDetails.totalOrderValue}</span>
              </Col>
            </Row>

            <Row style={{marginTop:"20px"}}>
                <Col span={24}>
                  <span id="review-and-checkout">
                    <Button style={{width:"100%",height:"46px"}} id="reviewBtn" loading={reviewCheckout.loading} disabled={reviewCheckout.isDisabled} onClick={checkOut} >REVIEW & CHECKOUT </Button>
                  </span>
                </Col>
            </Row>

            <Row justify="space-between" id="paynow">
              <Col><span>PAY NOW</span></Col>
              <Col>
                
                  {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{" "}
                  <span>
                  {orderSheetDetails?.paymentTerms?.find(x => x.chargeId == "ADVANCE").amount}
                  </span>
              </Col>
            </Row>

            <Row justify="space-between" id="paylater">
              <Col><span>PAY LATER</span></Col>
              <Col>
                <span>
                  {orderSheetDetails?.currency === "AUD" ? "$" : ""}
                  {orderSheetDetails?.currency === "USD" ? "$" : ""}
                  {orderSheetDetails?.currency === "GBP" ? "£" : ""}
                  {orderSheetDetails?.currency === "EUR" ? "€" : ""}{" "}
                  {orderSheetDetails?.paymentTerms?.find(x => x.chargeId == "POST_DELIVERY").amount}
                </span>
              </Col>
            </Row>
          </Card>
        </Col> 

              {/* DataTable section */}
        
        <Col xs={22} sm={22} md={22} lg={22} xl={22} style={{marginTop:"25px" }}>
          <table style={{width:"100%",overflowX:"scroll",display:"block"}}>
          <tr style={{height:"100px"}}>
            <th style={{fontWeight:"900"}}><span>{orderSheetDetails.currency}</span></th>
            {productsDetails.map(ele => (
              <td key={ele}>
                <span>
                  {
                    <Image
                      width={170}
                      height={148}
                      style={{
                        border : "1px solid rgb(204, 204, 204)",
                      }}
                      src={ele.imageUrl !== null ? "https://" + ele.imageUrl : process.env.NEXT_PUBLIC_URL + "/placeholder.png"}
                    />
                  }
                </span>
              </td>
            ))}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Product name/ Description</span></th>
            {productsDetails.map((ele,i) =><td key={i}><span>{ele.productName}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th style={{fontWeight:"900"}}><span>Quantity units</span></th>
            {productsDetails.map((ele,i) =><td key={i}><span>{ele.moqUnit}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th style={{fontWeight:"900"}}><span>Quantity</span></th>
            {productsDetails.map((ele,i) =><td key={i} style={{fontWeight:"bold"}}><span>{ele.quantity}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span><span>Item ID</span></span></th>
            {productsDetails.map((ele,i) =><td key={i}><span>{ele.id.replace("PRODUCT::","")}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th style={{color:"#02873A",fontWeight:"900"}}><span>FREE shipping</span></th>
            {productsDetails.map((ele,i) => <td key={i}><span>{ele.freeShippingEligible ? "Yes" : "No"}</span></td>)} 
          </tr>
          <tr style={{height:"45px"}}>
            <th style={{fontWeight:"900"}}><span>Door Delivered Price incl.<br/> Duties and taxes DDP</span></th>
            {productsDetails.map((ele,i) => <td key={i} style={{fontWeight:"bold"}}><span>{ele.doorDeliveredPrice}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Color / Finish</span></th>
            {productsDetails.map((ele,i) => <td key={i}><span>{ele.colorOrFinish}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Product size</span></th>
            <td><span>55</span></td>
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Product size units</span></th>
            {productsDetails.map((ele,i) => <td key={i}><span>{ele.casePackLBHUnit}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Product weight</span></th>
            {productsDetails.map((ele,i) => <td key={i}><span>{ele.casePackWeight}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Product weight units</span></th>
            {productsDetails.map((ele,i) => <td key={i}><span>{ele.casePackWeightUnit}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Material</span></th>
            {productsDetails.map((ele,i) => <td key={i}><span>{ele.material}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Specification 1</span></th>
            {productsDetails.map((ele,i) => <td key={i}><span>{ele.specification1}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Specification 2</span></th>
            {productsDetails.map((ele,i) => <td key={i}><span>{ele.specification2}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Minimum order quantity</span></th>
            {productsDetails.map((ele,i) => <td key={i}><span>{ele.minimumOrderQuantity}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Production Lead time  DAYS</span></th>
            <td><span>10days</span></td> 
          </tr>
          <tr style={{height:"45px"}}>
            <th><span>Base price</span></th>
              {productsDetails.map((ele,i) => <td key={i}><span>{ele.priceApplied}</span></td>)}
          </tr>
          <tr style={{height:"45px"}}>
            <th style={{background:"rgba(234, 218, 169, 0.1)"}}>
              <span style={{color:"#005098",fontWeight:"bold"}}>Enter your comments here</span>
              <span><button style={{border:"none",fontWeight:"bold",textDecoration:"underline",cursor:"pointer",background:"rgba(234, 218, 169, 0.1)"}} onClick={saveComments}>SAVE</button></span>
            </th>
            {
              productsDetails.map((ele,i) =>(
                <td key={i} style={{background:"rgba(234, 218, 169, 0.1)"}}>
                  <span>
                    {<TextArea id="buyerValidate" value={lastComments.comment} onChange={ (e) => setBuyerComments(e.target.value)} />}
                  </span>
                  <Row id="buyerValidateText" style={{display:"none"}}>
                    <span style={{color : "red",display:"flex",justifyContent:"center",alignItems:"center"}}>* Comments can not be blank</span>
                  </Row>
                </td>
              ))
            }
          </tr>
          {/* <tr style={{height:"45px"}}>
            <th>
              <span style={{color:"#005098"}}>Enter your comments here</span>
              <span><button style={{border:"none",textDecoration:"underline",cursor:"pointer"}} onClick={saveComments}>Save</button></span>
            </th>
            {
              productsDetails.map((ele,i) => (
                <td key={i}>
                  <span>
                    {<TextArea/>}
                  </span>
                </td>
              ))
            } */}
            {/* <td><TextArea onChange={commentsUpdate}/></td>
              {productsDetails.map((ele,i) => (
                <td key={i}>
                  <span>
                    {<TextArea id="buyerValidate" value={lastComments.comment} style={{marginTop:"1px",marginBottom:"1px",width:"70%"}} onChange={ (e) => setBuyerComments(e.target.value)} />}
                  </span>
                  <Row id="buyerValidateText" style={{display:"none"}}>
                    <span style={{color : "red",display:"flex",justifyContent:"center",alignItems:"center"}}>* Comments can not be blank</span>
                  </Row>
                </td>
              ))} */}
          {/* </tr> */}
        </table> 

        </Col>

            {/* CheckOut & previous sections section */}

        <Col xs={22} sm={22} md={22} lg={22} xl={22} style={{marginTop:"25px" }}>
          <Row justify="space-between">
            <Col xs={24} sm={24} md={24} lg={9} xl={9}>
              <span>
                <Button 
                  style={{width:"65%"}} 
                  id="previous-version" 
                  onClick={showModal}
                >
                  SHOW PREVIOUS VERSIONS 
                </Button>
              </span>
              <span>
                <Button 
                  style={{width:"65%",display:"none"}} 
                  id="newest-version" 
                  onClick={getNewestVersion}
                >
                  SHOW NEWEST VERSION 
                </Button>
              </span>
              <Modal title="PREVIOUS QUOTATIONS" visible={isModalVisible} onCancel={handleCancel} footer={[]}>
                <p id="mobile-popup" style={{fontFamily:"Sen",fontSize:"14px"}}>Please click on the linesheet version you want to view:</p>
                <Row justify="space-around" id="myQuotation" style={{display:"block"}}>
                  {/* <span style={{fontFamily:"Sen"}}>05 Mar 21</span> */}
                    {getOlderVersionProducts.map((product , i) => (<a onClick={getPreviousVersion} style={{color:"#9D4930",fontFamily:"Sen"}} key={i}><ExportOutlined style={{marginRight:"5px"}}/>linesheet ID: {product.lineSheetNumber}</a>))}
                </Row>
                <Row justify="center" id="myQuotationNoData" style={{display:"none"}}>
                  <span style={{fontFamily:"Sen",color:"#9D4930",display:"flex",justifyContent:"center",alignItems:"center"}}>* No previous versions found.</span>  
                </Row>
              </Modal> 
              <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{marginTop:"10px"}}>
                <Row justify="space-between" style={{marginTop:"18px"}}>
                  <span id="estimated-date">Estimated delivery date:</span>
                  <span id="delivery-time">
                      {orderSheetDetails?.shippingDetails?.totalEstTimeMinDays} - {orderSheetDetails?.shippingDetails?.totalEstTimeMaxDays} days
                  </span>
                </Row>
                <Divider style={{marginTop:"9px",marginBottom:"11px"}}/>
                <Row justify="space-between" style={{marginTop:"6px"}} id="estimated-time">
                  <Col>
                      <Badge color="#D9BB7F"/>
                      <span style={{fontFamily:"Sen",fontSize:"14px"}}>Estimated production/dispatch time</span>
                  </Col>
                  <span id="shipping-details-time">
                      {orderSheetDetails?.shippingDetails?.estimatedProductionTimeMinDays} - {orderSheetDetails?.shippingDetails?.estimatedProductionTimeMaxDays} days
                  </span>
                </Row>
                <Row justify="space-between" style={{marginTop:"6px"}} id="estimated-time">
                  <Col>
                    <Badge color="#D9BB7F"/>
                    <span style={{fontFamily:"Sen",fontSize:"14px"}}>Estimated shipping lead time ({orderSheetDetails.shippingMode})</span>
                  </Col>
                  <span id="shipping-details-time">
                    {orderSheetDetails?.shippingDetails?.estimatedLeadTimeMinDays} - {orderSheetDetails?.shippingDetails?.estimatedLeadTimeMaxDays} days
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
              {/* <Row style={{padding:"10px 25px 25px 25px",marginLeft:"10px"}} >
                <FilePdfOutlined style={{ fontSize: '25px', color: '#e4605e',marginLeft:"12px"}}/> <span style={{marginLeft:"12px"}}>DOWNLOAD ATTACHMENT 1</span>
              </Row> */}
               <div>
                  
                  
                {
                  orderSheetDetails?.productSpecificationUrls?.length >= 0 
                  ?<span>
                    {orderSheetDetails?.productSpecificationUrls.map(ele => (
                      <span style={{textDecoration:"underline",textTransform:"uppercase",marginLeft:"3px",color:"#874439",cursor:"pointer"}}><FilePdfOutlined style={{ fontSize: '25px', color: '#874439',marginLeft:"12px"}}/>
                        <Upload
                          onPreview={handlePreview}
                        >
                          {ele.replace("https://forms/anon/","")}
                        </Upload>
                        
                      </span>)
                    )}
                  </span>
                  : "Admin has not uploaded any documents"  
                }
              </div>
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
