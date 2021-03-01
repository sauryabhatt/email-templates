/** @format */
import React, { useState, useEffect, useRef } from "react";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { Collapse, Table } from "antd";

const Panel = Collapse.Panel;

const FAQ = (props) => {
  const router = useRouter();
  const [activeKeys, setActiveKeys] = useState([]);
  const orders = useRef();
  const fulfillment = useRef();
  const payment = useRef();
  const shipping = useRef();
  const offers = useRef();
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  useEffect(() => {
    let { refs = "" } = router.query;
    setActiveKeys([refs]);
    if (refs === "ref1" && ref1 && ref1.current) {
      ref1.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (refs === "ref2" && ref2 && ref2.current) {
      ref2.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (refs === "ref3" && ref3 && ref3.current) {
      ref3.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (refs === "orders" && orders && orders.current) {
      orders.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (refs === "payment" && payment && payment.current) {
      payment.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (refs === "fulfillment" && fulfillment && fulfillment.current) {
      fulfillment.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [props, router.query]);

  const callback = (key) => {
    setActiveKeys(key);
  };

  const countryList = [
    {
      key: "1",
      country: "Australia",
      airData: "10 to 15",
      seaData: "40 to 50",
    },
    {
      key: "2",
      country: "Canada",
      airData: "12 to 18",
      seaData: "40 to 50",
    },
    {
      key: "3",
      country: "UK",
      airData: "7 to 14",
      seaData: "30 to 40",
    },
    {
      key: "4",
      country: "USA",
      airData: "7 to 14",
      seaData: "45 to 55",
    },
    {
      key: "5",
      country: "Singapore",
      airData: "5 to 10",
      seaData: "25 to 30",
    },
    {
      key: "6",
      country: "Ireland",
      airData: "10 to 15",
      seaData: "35 to 45",
    },
    {
      key: "7",
      country: "New Zealand",
      airData: "10 to 15",
      seaData: "40 to 50",
    },
    {
      key: "8",
      country: "Netherlands",
      airData: "7 to 14",
      seaData: "40 to 50",
    },
    {
      key: "9",
      country: "Germany",
      airData: "7 to 14",
      seaData: "40 to 50",
    },
  ];

  const countryHeader = [
    {
      title: "Country",
      dataIndex: "country",
    },
    {
      title: "AIR Shipping time (in days)",
      dataIndex: "airData",
    },
    {
      title: "SEA Shipping time (in days)",
      dataIndex: "seaData",
    },
  ];

  const shippingData = [
    {
      key: "1",
      country: "UK",
      buyerInfo:
        "EORI number \n If you don't have an EORI number we can still facilitate the delivery of a shipment using an IOR*",
    },
    {
      key: "2",
      country: "USA",
      buyerInfo:
        "If your order value is less than $2500 and the shipment mode is 'Air Express' no documentation is required. In this case, the carrier can act as an IOR (     subject to U.S. partner government agency (PGA) inspection and clearance). No additional IOR charge for such shipments will be charged. \n For all other shipments, i.e. value over $2500 or/and shipped through Sea mode Power of Attorney and Bond (either a Single entry or a Continuous bond). For more details please write to us at buyers@qalara.com",
    },
    {
      key: "3",
      country: "Canada",
      buyerInfo: "Not required",
    },
    {
      key: "4",
      country: "Australia",
      buyerInfo: "Australia Business Number, optional",
    },
    {
      key: "5",
      country: "European Union countries",
      buyerInfo: "EORI, Customs Declaration",
    },
    {
      key: "6",
      country: "New Zealand",
      buyerInfo:
        "Client code, Supplier code & register for trade single window(TSW)",
    },
    {
      key: "7",
      country: "Singapore",
      buyerInfo:
        "Unique Entity Number (UEN), Customs Account, and a Customs Import Declaration. \n If you don't have the UEN, we can still facilitate the delivery of a shipment using an IOR*",
    },
  ];

  const shippingHeader = [
    {
      title: "Country",
      dataIndex: "country",
      width: 150,
    },
    {
      title: "Buyer Information recommended",
      dataIndex: "buyerInfo",
    },
  ];

  return (
    <div className="buyer-faq-section">
      <div className="panel-header main-heading">ABOUT QALARA</div>
      <Collapse
        bordered={false}
        activeKey={activeKeys}
        onChange={callback}
        expandIconPosition="right"
        expandIcon={({ isActive }) => (
          <span>{isActive ? <UpOutlined /> : <DownOutlined />}</span>
        )}
      >
        <Panel
          header="How does Qalara help overseas wholesale buyers?"
          key="ref1"
          className="panel-title"
        >
          <div className="panel-body" ref={ref1}>
            Qalara is a global platform based in India, offering a convenient,
            reliable, digitally-enabled platform for global sourcing from South
            Asia (India, Sri Lanka, Nepal, Thailand, Vietnam, Indonesia, etc.).
            <br></br>
            <br></br>Specifically, we offer: <br></br>• An ever growing
            selection of artisanal, eco-friendly, organic, recycled products at
            great prices! <br></br>• Verified producers <br></br>• Small-to-mid
            sized, buyer friendly terms - MOQs, lead times and prices <br></br>•
            One-stop sourcing platform from discovery to delivery <br></br>•
            Account managers so that you don't have to coordinate with multiple
            vendors <br></br>• Secure payments <br></br>• Best freight and
            shipping costs <br></br>• Financial services launching soon
          </div>
        </Panel>
        <Panel
          header="How does Qalara verify its sellers?"
          key="ref2"
          className="panel-title"
        >
          <div className="panel-body" ref={ref2}>
            Qalara identifies and shortlists sellers based on credible,
            legitimate associations like the World Fair Trade Organization,
            Craftmark, Crafts Council, Export, Promotion, Councils, and
            self-declared claims against our six core values - Artisanal
            (heritage, evolved, hybrid), Organic, Eco-friendly, Recycled, Fair &
            Social, Sustainable. We then reach out to the sellers, once agreed
            on the terms and conditions, and review their certifications and
            legal compliance documentation. We also undertake physical factory
            or facility audits as best possible, however, owing to the unusual
            Covid circumstances we have been limited in our ability to do so to
            the fullest extent possible. In such scenarios, we also undertake
            reference checks and review customer or client feedback where
            possible.
          </div>
        </Panel>
        <Panel
          header="Why is Qalara better than other B2B online platforms?"
          key="ref3"
          className="panel-title"
        >
          <div className="panel-body" ref={ref3}>
            Qalara's promise to the buyer is convenience and reliability. Qalara
            is a managed marketplace where 100% of the Sellers are verified -
            which means that all sellers have been verified and vetted by team
            Qalara. We facilitate direct, moderated interaction between buyers
            and sellers, while at the same time taking a hands-on role to ensure
            that products are produced in time and to your specifications.
            Qalara steps in to take care of cross-border logistics, and
            aggregating shipments and partners with the best companies to ensure
            the best costs and experience to both sellers and buyers.
            Importantly, Qalara consciously emphasises on its six core values -
            artisanal, eco friendly, organic, fair & social, recycled,
            sustainable - and aspires to have the largest and most reliable
            selection of such manufacturers.
          </div>
        </Panel>

        <div className="panel-header" ref={orders}>
          ORDERS ON QALARA
        </div>

        <Panel
          header="What is Request for Quote, Order Query, Custom Quote and Add to collection?"
          key="orders"
          className="panel-title"
        >
          <div className="panel-body">
            Request for Quote (RFQ) / Order Query / Get Quote are order enquiry
            forms that you can fill out to convey your requirements. You can
            send us four types of Quote Requests:
            <br></br>
            <br></br>
            <b>Request for Quote</b> - If you're looking to purchase something
            specific but you haven't been able to find that product on our
            platform, we can create or curate products for you. This may require
            higher MOQs (Minimum Order Quantity) and longer lead times.<br></br>
            <br></br>
            <b>Send order Query</b> - If you like a seller's portfolio and would
            like them to manufacture a custom design for you basis their
            skillset. This may require higher MOQs (Minimum Order Quantity) and
            longer lead times.<br></br>
            <br></br>
            <b>Get custom Quote</b> - If you like a specific product and wish to
            order specific quantities or want to slightly customize the color or
            packaging, you can ask for a custom quote.<br></br>
            <br></br>
            <b>Add to Collection</b> - This is a <b>new feature</b> that allows
            you to add multiple products to create, ranges or collections based
            on a theme (say Fall2020) and you can send a Request for Quote for
            the entire collection at once! <br></br>
            <br></br>Once we receive a query, we will send you a Quotation with
            all required details. If you confirm the same, we send you a payment
            link to process your order!
          </div>
        </Panel>
        <Panel
          header="What are the different types of ordering options on Qalara?"
          key="ref5"
          className="panel-title"
        >
          <div className="panel-body">
            Qalara is designed to meet all kinds of wholesale and sourcing order
            requirements - <br></br>
            <br></br>
            <b>Ready to ship</b> - These are products for which inventory is
            readily available with the supplier. Generally ready to ship
            products are dispatched within 7-10 days of the order confirmation,
            after being quality inspected by Qalara. Many of these products are
            fast moving and can run out of stock!<br></br>
            <br></br>
            <b>Express Custom</b> - These are products that may not have ready
            inventory, but can be produced in small batches within 3-5 weeks.
            These are a great alternative to ready stock that we recommend.
            There may be some exceptions, but most hard goods are able to meet
            these requirements.<br></br>
            <br></br>
            <b>Made to order</b> - These are custom orders with predefined
            Minimum Order Quantities (MOQs) where the suppliers will need to
            procure raw materials as per your requirements and then take up
            production. Such orders are usually dispatched within 45-60 days of
            order confirmation. Depending on the product specifications and
            quantities, they may take less or more time.
            <br></br>
            <br></br>
            <b>Design to order</b> - Many of our suppliers are happy to develop
            your designs or product ideas, subject to MOQs. Additionally, if you
            need any customisation in the product size or design then you can
            convey your requirements and they can be produced based on approved
            designs. Such orders usually mandate sample approvals. This can be a
            slightly longer process depending on the product specifications and
            quantities, and orders are usually shipped within 60-90 days
            post-confirmation.
          </div>
        </Panel>
        <Panel
          header="How do I place an order on Qalara?"
          key="ref6"
          className="panel-title"
        >
          <div className="panel-body">
            For some items, we have instant checkout enabled; and for others, we
            have a Request for Quotation based 1-on-1 checkout. See more details
            below.<br></br>
            <br></br>
            <b>
              <i>Ready-to-ship and Express Custom orders</i>
            </b>
            <br></br>Both these types of orders are enabled for{" "}
            <b>instant checkout</b> - Look out for the 'Ready to ship' and
            'Express Custom' tag for these items. For the ones that you like,
            please enter quantity equal to or greater than the minimum quantity,
            add the products to cart, confirm your address, review the freight,
            tax and duties costs, and checkout using Paypal securely.
            <br></br>
            <br></br>For certain countries or postal codes, we may not have
            instant checkout currently available. In this case, look out for the
            <b>'Ready to ship'</b> and <b>'Express Custom'</b> tag and shortlist
            the items that you like. Please enter quantity equal to or greater
            than the minimum quantity, add the products to cart, confirm your
            address and then click on 'Create Order' for the Qalara team to then
            help you with the rest of the process to confirm the order. Once we
            receive your <b>'Create Order'</b> request, we will revert to you
            with a consolidated quotation via email and your My Account section,
            along with a link to checkout securely using Paypal or a similar
            payment gateway.<br></br>
            <br></br>
            Please note that the prices mentioned on our site may exclude
            certain remote regions. For ordering large quantities, please send
            us a 'Get quote' request to get unbeatable prices.<br></br>
            <br></br>
            <b>
              <i>Made-to-order or Design-to-order (Custom Orders)</i>
            </b>
            <br></br>
            STEP 1: Send us a Request for Quote, Seller Order Query or Custom
            Quote for any artisanal home & lifestyle products you'd like to
            source from us. <br></br>
            <br></br>STEP 2: Receive line-sheets for collections s. Shortlist
            products and finalise quantities to receive a consolidated quote
            with the lowest freight cost and/ or duties and taxes, if
            applicable, along with lead times. Confirm your order and receive a
            link to checkout securely using Paypal or a similar payment gateway.
            <br></br>
            <br></br>STEP 3: We manage production monitoring and quality
            inspection for you across all vendors. Once goods are ready you can
            opt for remote inspection should you prefer the same. Qalara sends
            you regular status updates till goods are delivered.
          </div>
        </Panel>
        <Panel
          header="Can I order a sample?"
          key="ref7"
          className="panel-title"
        >
          <div className="panel-body">
            In most cases, yes. Please write to us at buyers@qalara.com and
            mention the webpage address or link of the product that you like via
            email. We may request you to fill out a Sample Request Form with an
            indicative order type and size against the sample that you request.
            Once received, we check the availability of the sample with the
            supplier and notify you of the sample delivery cost. Please note
            that the seller may charge a premium for samples.
          </div>
        </Panel>
        <Panel
          header="Can Qalara help me source products specific to my designs?"
          key="ref8"
          className="panel-title"
        >
          <div className="panel-body">
            Yes absolutely! You can share with us design mood boards, or
            reference designs including sketches, photographs and
            specifications. We will in turn share the same with the respective
            sellers for them to design and develop products as per your designs.
            We also have inhouse designers who can guide you should you need the
            extra help! These orders are however almost always subject to higher
            MOQs (minimum order quantities) from the sellers.
          </div>
        </Panel>
        <Panel
          header="What are 'Free shipping' products?"
          key="ref9"
          className="panel-title"
        >
          <div className="panel-body">
            For products classified as 'Free shipping' you don't have to pay any
            additional freight charge for these products. You can simply add
            these products to your cart and proceed to the shipping page. You
            may have to pay Duties and taxes for these products depending on the
            local laws of the destination country.<br></br>
            <br></br>
            <b>Please note</b> that the free shipping price is inclusive of
            shipping based on calculations for small quantities and further may
            exclude certain remote regions. For large quantities, please send us
            a 'Get quote' request to get the best possible rates
          </div>
        </Panel>
        <Panel
          header="Why do you have different prices for different quantities applicable for some products?"
          key="ref11"
          className="panel-title"
        >
          <div className="panel-body">
            The production or manufacturing process of many of our items usually
            involve a fixed cost, e.g. dyeing of yarn, moulds, packaging
            materials, dies, blocks, etc. This fixed cost is applied across the
            total quantity of the product and as a result, the base price of the
            product may vary depending on the quantities that you are ordering.
            <br></br>
            <br></br>
            Furthermore, if the price mentioned for a product is inclusive of
            the Freight charge, then the freight for a given quantity too will
            influence these prices because freight varies by total weight and
            volume. We show different prices for different quantities so that
            the buyers can have a fair understanding of the cost as per their
            order requirements.
            <br></br>
            <br></br>
            Generally speaking, higher the quantities, lower the prices!
          </div>
          <br></br>
          <b>
            If you have a requirement for larger quantities or if you have any
            special requirements we request you to send a Get quote request, and
            we will get back with unbeatable prices.
          </b>
        </Panel>
        <Panel
          header="What is a video meeting?"
          key="ref12"
          className="panel-title"
        >
          <div className="panel-body">
            A video demo is a live video meeting that facilitates live
            interaction between the buyer and the products and a product expert.
            Through these meetings, we can engage more deeply, understand your
            requirements, and share more about our product offering and the
            specifications and details of the different production methods and
            crafts.
          </div>
        </Panel>

        <div className="panel-header" ref={fulfillment}>
          ORDER FULFILMENT BY QALARA
        </div>

        <Panel
          header="How do you ensure that goods will be delivered as per specifications and on time?"
          key="fulfillment"
          className="panel-title"
        >
          <div className="panel-body">
            We have dedicated production monitoring and quality control teams
            that track each order from confirmation to finalization through
            production - both inline and final if required - so that we can
            preempt and rectify any discrepancies during the production process.
            In case we anticipate delays, we step in, to caution and support the
            sellers if needed. We also do a final QC once the goods are packed
            and reach our warehouse before shipping. Buyers can also opt for
            remote inspections to be extra sure and to avoid any surprises.
          </div>
        </Panel>
        <Panel
          header="What is production monitoring?"
          key="ref14"
          className="panel-title"
        >
          <div className="panel-body">
            Once a custom order is confirmed, we provide the service of tracking
            key milestones through the production process of your order. The
            tracking process starts from the pre-production phase and continues
            until the goods are packed. We are consistently in touch with the
            supplier throughout the process and keep you updated on the status
            of your order. Each product type/ production method has a different
            monitoring process to ensure that all the key activities are tracked
            and you get your shipments in time – as confirmed to you at the time
            of placing the order.
          </div>
        </Panel>
        <Panel
          header="What is Quality Inspection?"
          key="ref15"
          className="panel-title"
        >
          <div className="panel-body">
            For any order placed on our platform, we provide quality inspection
            services. For custom orders, the inspection service involves
            inspection of the products during as well as post-production. This
            is done at the seller factory/ facility and we check the products
            against the order details to ensure that the products delivered
            match the order specification. Along with this, we also inspect and
            test the box post packaging. In the current Covid situation, in some
            cases, we may need to do remote inspections or green channel the
            inspection through very reliable vendors.
          </div>
        </Panel>
        <Panel
          header="What is Quality testing?"
          key="ref16"
          className="panel-title"
        >
          <div className="panel-body">
            We have partnered with major labs in India to conduct the required
            quality testing of products. If you want to avail this service
            please write to us with your requirements so we can share the
            testing protocols and costs. We also share a final quote once the
            testing requirement has been finalized. Once ready, our suppliers
            ship the product to the nominated testing lab. As soon as the
            reports are available, we will share the same with you.
          </div>
        </Panel>
        <Panel
          header="What if there is an issue with my order?"
          key="ref17"
          className="panel-title"
        >
          <div className="panel-body">
            You can always write to us at buyers@qalara.com and we will make
            sure that your issue is resolved. To report any issue with the order
            delivered we would need some material proof e.g. images, videos,
            etc. which we can share with the seller and/or logistics vendor to
            suitably address your concerns. We, therefore, request you to take
            the following steps to ensure that we can provide the fastest,
            satisfactory resolution:
            <br></br>• Take a video of the shipment box while unboxing <br></br>
            • If there is any discrepancy between the sample and the product
            delivered, we request you to share the image of the product and
            sample side by side and mention the issue that you are facing{" "}
            <br></br>• Please share clear images/ videos from different angles
            of any defect that you may notice on the product. Please note that
            handcrafted items unlike factory-made products always have some
            degree of variance. Please read the disclaimers carefully on the
            product page or in your custom order quotation.
            <br></br>
            <br></br>
            Having said that, if yours is a genuine case, we understand and
            we've got your back!
          </div>
        </Panel>

        <div className="panel-header" ref={shipping}>
          SHIPPING ON QALARA
        </div>

        <Panel
          header="Which countries do you ship to?"
          key="shipping-1"
          className="panel-title"
        >
          <div className="panel-body">
            We ship to 100+ countries around the world, including the UK,
            Australia, Canada, USA, European countries, Middle East, Singapore,
            South American countries, Japan, South Korea, and much much more.
          </div>
        </Panel>

        <Panel
          header="What modes of shipping do you use? How do you decide which one to use?"
          key="shipping-2"
          className="panel-title"
        >
          <div className="panel-body">
            We offer both Air (Express and Freight services) and Sea (LCL - Less
            than Container Load and FCL - Full Container Load services) modes of
            shipping. Generally speaking, we calculate freight costs for both
            modes of shipping, unless the buyer has specified a certain mode, or
            if certain goods cannot be air shipped, and suggest the lowest cost
            option.
          </div>
        </Panel>
        <Panel
          header="How long does it take to ship to my country?"
          key="shipping-3"
          className="panel-title"
        >
          <div className="panel-body">
            The table below shows the general timelines to some popular
            destinations worldwide:
            <br></br>
            <br></br>
            <Table
              dataSource={countryList}
              columns={countryHeader}
              pagination={false}
              size="small"
              rowClassName="qa-fs-13"
              tableLayout="fixed"
            />
            <br></br>
            <i>*Remote regions may add a few extra days</i>
            <br></br>
            <i>
              *Lead times are running slightly longer owing to the uncertainty
              related to the pandemic. In case of unforeseen delays, we will
              keep you updated till delivery.
            </i>
            <br></br>
            <br></br>You can add products to your Cart and proceed to the
            Shipping page to check the time that it will take to ship the order
            to your country. In case 'Proceed to shipping' is not available for
            your country you can use the 'Create Order' feature and we will get
            back to you within 24 - 48 hours with the timelines and the best
            possible quote.<br></br>
            <br></br>For more details, you can write to us at buyers@qalara.com
            if you have any shipping-related queries and we will get back to you
            within 24-48 hours.
          </div>
        </Panel>
        <Panel
          header="Which shipping partners do you use?"
          key="shipping-4"
          className="panel-title"
        >
          <div className="panel-body">
            We have tie-ups with several leading logistics companies, including
            FedEx, DHL, POTA, All Cargo, and several more. They in turn may have
            partnerships with local service providers across different
            countries.
          </div>
        </Panel>
        <Panel
          header="Do you ship to Amazon Warehouses?"
          key="shipping-5"
          className="panel-title"
        >
          <div className="panel-body">
            Yes, we can ship to Amazon Warehouses. We recommend you follow the
            steps mentioned in the Amazon Seller central panel. A summary of how
            the process works:<br></br>● Select the option to 'Send/ Replenish
            inventory' and then, assuming that your product is already listed
            choose the option to 'Send Inventory'
            <br></br>● Next, you will be directed to the 'Create Shipping Plan'
            page. Select the option 'case-packed products' and enter the number
            of case packs and units. Case pack and the details of products in
            case pack will be provided to you by Qalara.
            <br></br>● Save the pdf labels as a high-resolution Black & White
            file and email it to Qalara at buyers@qalara.com for printing and
            affixing on the individual boxes and the case packs. In the email
            that you send to Qalara, we request you to share your Order Id for
            easy reference.
            <br></br>● Once we have notified you regarding the shipment schedule
            you have to book the slot for delivering the shipment at the
            selected Amazon warehouse.
            <br></br>
            <br></br>
            Please note that the freight cost quoted depends on the delivery
            location shared by you at the time of placing your order. Any
            changes post that or any delay caused due to unavailability of slots
            at the Warehouse or delay in unloading the shipments may involve
            additional costs and will be charged back to you. For more details
            please write to us at buyers@qalara.com and we will get back to you
            within the next 24 to 48 hours.
          </div>
        </Panel>
        <Panel
          header="Do you deliver goods to residential locations?"
          key="shipping-6"
          className="panel-title"
        >
          <div className="panel-body">
            Yes, we deliver to any location - residence, office, warehouse, etc.
            <br></br>
            <br></br>
            Sometimes delivering to a residential address may involve additional
            complexities in terms of restricted timings for vehicle movements,
            width of the roads, etc. we would request you to share with us the
            following, well in advance so that we can plan the delivery
            accordingly:<br></br>a) Is your delivery address in a residential
            zone and if so, is there a timing restriction for goods vehicle
            movement in the area?
            <br></br>b) In case of a sea shipment, if the access roads to your
            address is wide enough for a 20-foot long container to enter and
            exit.
            <br></br>c) If you need a delivery on a floor that is above the
            ground floor and if yes, is there a cargo elevator available?
            <br></br>d) If you have the equipment to unload a pallet and move it
            inside your premises (like a forklift or a hand pallet jack).
            <br></br>e) Parking facility for the vehicle during unloading.
            <br></br>
            <br></br>
            Large shipments are generally palletized and may in rare occasions
            need mechanical handling. Some pointers that will help you in
            managing your shipment delivery better :<br></br>a) Do you have an
            adjustable ramp that can enable a forklift or other instruments to
            enter the container when it is aligned with your receiving dock door
            leveler at the destination?
            <br></br>b) Is there a provision to unload from the vehicle through
            any mechanized means eg. pallet jack, forklift etc.?
            <br></br>c) Is there adequate space for the transport vehicle (could
            be a 20' or a 40' container) to approach and reverse at your
            warehouse?
            <br></br>d) Hours of operation of your warehouse, it's best if you
            share this with us in advance so that we can instruct our logistics
            partner accordingly.
          </div>
        </Panel>
        <Panel
          header="Will we be intimated when goods are out for delivery? What if I'm not there?"
          key="shipping-7"
          className="panel-title"
        >
          <div className="panel-body">
            Yes, you will be intimated regarding the delivery of your shipment.
            The delivery process may differ depending on the shipping term that
            you have selected.
            <br></br>
            <br></br>
            <b>In case of a DDU shipment; </b>
            <br></br>Our logistics partner will notify you over email and/ or
            call regarding the shipment delivery schedule and payable taxes if
            any. Generally, they may intimate the same to you at the time of
            customs clearance or just before delivery.
            <br></br>
            <br></br>
            <b>In case of a DDP shipment;</b>
            <br></br>a) For shipments that are moved in the Express Mode (DHL,
            FedEx, etc) the carrier will generally provide a prior intimation
            (either over email or by phone) close to the time the goods are
            getting customs released and then attempt a delivery. In the event
            you would like to have a slotted delivery or deferred delivery, you
            could let them know your preference and they would generally
            accommodate.
            <br></br>
            <br></br>
            b) Large sized shipments (shipped in ocean containers) will
            generally get delivered only with a prior appointment. Whenever you
            receive a call related to the delivery of your shipments, please
            provide as much information about your delivery address (refer to
            the above answer) so that deliveries can be planned in a suitable
            vehicle and with adequate manpower.
          </div>
        </Panel>
        <Panel
          header="How will I know the shipping costs for my order? How are shipping costs calculated?"
          key="shipping-8"
          className="panel-title"
        >
          <div className="panel-body">
            For an online checkout, our site calculates the shipping cost and
            displays it when you proceed to the Shipping page from the Cart
            page. On the shipping page, you get an option to select from Sea or
            Air shipment mode, you can select the desired mode and proceed to
            payment. In some cases, only one between Sea/Air mode may be
            displayed. Prices displayed may exclude certain remote regions where
            logistics connectivity is not regular or depends on certain special
            modes of transportation.
            <br></br>
            <br></br>
            For Custom orders, our team will inform you about the shipping cost,
            basis your preferred shipping mode, before the payment link is sent
            to you.
            <br></br>
            <br></br>
            Generally speaking, shipping costs are calculated based on the
            following:
            <br></br>a. Mode of shipping (Express, Airfreight, Oceanfreight)
            <br></br>b. Combined weight and/ or volume of the total items
            shortlisted/ ordered
            <br></br>c. Distance of final destination from nearest sea-port or
            airport, and associated last-mile trucking costs and considerations
            <br></br>d. Any additional requirements for safety and appropriate
            transit handling or country compliance norms, like fumigation,
            palletization, etc.
            <br></br>e. Fixed costs of customs clearance, loading/ unloading,
            terminal handling, etc.
            <br></br>f. Surcharges, if applicable, from time to time, such as a
            covid surcharge, etc.
            <br></br>g. There may also be additional charges for overweight or
            oversized items or delivery to a higher floor in the residential
            apartment (even if there is an elevator)
            <br></br>h. Toll, Permits etc. if applicable
          </div>
        </Panel>
        <Panel
          header="Why is the freight high in some cases and low in some cases? I thought ocean freight would always be cheaper?"
          key="shipping-9"
          className="panel-title"
        >
          <div className="panel-body">
            Both Air and Ocean freight costs vary by weight/ volume and
            destination. It is important to note that since shipping cost is not
            fixed by weight or volume, hence costs do not increase or decrease
            linearly.
            <br></br>
            <br></br>
            Generally speaking, for very low weight/ volume, it is cheaper to
            ship goods by air express. For higher weight/ volume, it is
            preferable to ship by Ocean, but again shipping Less than Container
            Loads via Ocean can sometimes be high owing to high fixed costs of
            shipping by sea. Full Container loads are usually the cheapest way
            to ship goods. In the case of ocean shipping, you will find that as
            you order more items, the shipping cost per unit of item
            progressively reduces.
            <br></br>
            <br></br>
            We recommend that you consolidate and order multiple items together
            to reduce the freight costs per item.
          </div>
        </Panel>
        <Panel
          header="Your checkout mentions that Freight, Taxes and Duties are 'estimates'. When will I know the freight, duties and taxes that will be charged?"
          key="shipping-10"
          className="panel-title"
        >
          <div className="panel-body">
            The reason we mention Freight, Taxes and Duties as estimates at the
            time of placing the order is that we have seen variances in the
            volume of the final packed goods (especially for orders with mixed
            items from multiple sellers), furthermore, duties and taxes for
            certain products to countries can also periodically vary. For Ocean
            freight, it is at the time of dispatch once we have received the
            packed shipments (from across suppliers if that be the case) and
            have handed it over to the freight company and it is source cleared
            do we know the freight costs. For Air shipments, it is sometimes
            only known a week after the shipment is delivered depending on the
            country. Furthermore, taxes and duties are only known post customs
            clearance at destination.
            <br></br>
            <br></br>
            We will therefore be able to ascertain the final accurate freight,
            duties and taxes only after we receive the invoice from the freight
            company a few weeks post delivery, and there are possibilities of
            variance in freight, tax and duties as mentioned above, but those
            are usually minimal. Any such differential amount after the actual
            freight, duties and taxes is known to us, is neither charged extra
            to you, nor refunded.
          </div>
        </Panel>
        <Panel
          header="I am buying from multiple suppliers from India; would you be able to aggregate all my goods in one container?"
          key="shipping-11"
          className="panel-title"
        >
          <div className="panel-body">
            Yes absolutely. We can do this for no additional cost, and we highly
            recommend it because you would save on freight costs. We of course
            request certain undertakings from the supplier and prefer to inspect
            the goods in such scenarios.
          </div>
        </Panel>
        <Panel
          header="What is DDU (Delivered Duty Unpaid) mode of shipment?"
          key="shipping-12"
          className="panel-title"
        >
          <div className="panel-body">
            For a DDU shipment, we don't add the Estimated duties and taxes to
            your order total and any{" "}
            <b>
              applicable duties and taxes are directly paid by you to the
              freight/ logistics partner
            </b>{" "}
            during customs clearance or delivery as applicable. The option to
            select DDU mode is available in the Shipping page for Ready to Ship
            or Express custom products during checkout. For custom orders, you
            can share your shipment preference with our team during the quote
            creation process.
          </div>
        </Panel>
        <Panel
          header="What is DDP (Delivered Duty Paid) mode of shipment?"
          key="shipping-13"
          className="panel-title"
        >
          <div className="panel-body">
            For a DDP shipment, any{" "}
            <b>applicable duties and taxes are paid by Qalara on your behalf</b>{" "}
            during the custom clearance process. Estimated duties and taxes are
            added to your order total during the order checkout process. The
            option to select DDP mode is available in the shipping page for
            Ready to Ship or Express custom products during checkout. For custom
            orders, you can share your shipment preference with our team during
            the quote creation process.
          </div>
        </Panel>
        <Panel
          header="What information do you need from us for shipping the goods? Why do you need these? "
          key="shipping-14"
          className="panel-title"
        >
          <div className="panel-body">
            The below table lists the documents that are generally required for
            shipping the goods to your destination country. In some cases, the
            logistics service provider may reach out to you for some additional
            documents if required by the Customs of your country. These
            documents are required as part of the statutory requirement, while
            importing any goods to the destination country.<br></br>
            <br></br>
            <Table
              dataSource={shippingData}
              columns={shippingHeader}
              pagination={false}
              size="small"
              rowClassName="qa-fs-13"
              style={{ whiteSpace: "pre-line" }}
            />
            <br></br>* Nominal charges may apply for IOR service. For Custom
            orders, we will share the details when you are placing the order.
            For RTS orders, we generally share the information/documents
            required within 24 hours of order placement. You can avail the IOR
            services at that time or simply write to us at buyers@qalara.com to
            know more about the IOR services.
          </div>
        </Panel>
        <Panel
          header="I'm just getting started with my business, and I don't have my business registrations done. Can I still order from Qalara?"
          key="shipping-15"
          className="panel-title"
        >
          <div className="panel-body">
            For some countries, like the UK, yes we may be able to work via our
            own / partners' entities as an 'Importer on Record'. In some
            countries, it may be permissible to ship goods up till a certain
            value without business details from the buyer, in which case we can
            still fulfil your order. We have to follow the laws of the land into
            which we are shipping the goods so in some other cases, we may not
            be able to do so without complying with the mandatory information.
            However, we can certainly help you get set up - in most countries
            where we deliver, the processes are fairly straightforward and
            digital!
          </div>
        </Panel>
        <Panel
          header="Do you offer drop-shipping?"
          key="shipping-16"
          className="panel-title"
        >
          <div className="panel-body">
            We currently don't offer drop-shipping, but we can offer a variation
            - our minimum order values start as low as USD 250 per Seller. You
            can list products on your site, based on agreed terms with us, and
            as you get orders, we can combine them up to USD 250 - 500, and ship
            them combined to a given location. We recommend you try this with
            ready-to-ship orders or reserved orders.
            <br></br>
            <br></br>
            If/ when we launch drop-shipping service to different geographies in
            the future, we will update the information on our site.
          </div>
        </Panel>

        <div className="panel-header" ref={offers}>
          OFFERS ON QALARA
        </div>

        <Panel
          header="Tell me more about the 'Free Shipping' offer"
          key="offers-1"
          className="panel-title"
        >
          <div className="panel-body">
            This offer is applicable for all the products listed under free
            shipping with simplified inclusive prices! No Shipping / Freight
            fees is added against these products when added to your cart and
            checked out online. Only Custom duties and VAT/ Taxes, if
            applicable, are added and you can review those on the shipping page.
          </div>
        </Panel>

        <Panel
          header="How can I avail this offer?"
          key="offers-2"
          className="panel-title"
        >
          <div className="panel-body">
            Step 1: Add your favorite products from products marked with 'free
            shipping' to your cart, totaling to or above the Minimum Order Value
            for a given seller.
            <br></br>Step 2: Enter or select the address where the products need
            to be delivered and proceed to the Shipping Page
            <br></br>Step 3: Under Cart Summary, you will see 'Free shipping
            promotion applied' against which the estimated freight fees for the
            collection is deducted from the Total estimated freight fees.
            <br></br>Step 4: Proceed to payment and pay securely using PayPal
          </div>
        </Panel>

        <Panel
          header="What are Coupon Offers? How do I avail them?"
          key="offers-3"
          className="panel-title"
        >
          <div className="panel-body">
            We may run promotions now and then, that offer a flat value or %
            discount on your Order Value. Such offers are usually applied via a
            Coupon Code which will be mentioned on our site (and on the Cart
            Page). Enter the Coupon Code in the Shipping Page to avail the
            discount!
          </div>
        </Panel>

        <Panel
          header="Want to learn more about the offers in our website?"
          key="offers-4"
          className="panel-title"
        >
          <div className="panel-body">
            We're happy to help. You can always share your questions and issues
            by writing to us at buyers@qalara.com and we will make sure that
            your issue is resolved within the next 48 hours.
          </div>
        </Panel>

        <div className="panel-header" ref={payment}>
          PAYMENTS ON QALARA
        </div>

        <Panel
          header="Is it safe to transact on Qalara?"
          key="payment"
          className="panel-title"
        >
          <div className="panel-body">
            Absolutely! From a technology perspective, we are GDPR compliant -
            the EU General Data Protection Regulation which went into effect on
            May 25, 2018, replacing the Data Protection Directive 95/46/EC -
            which protects user data. From payments, we only work with the best
            global payment services providers like Paypal / Visa / Mastercard.
            Furthermore, we are backed by a Fortune 100 company, that is listed
            on the leading Indian Stock Exchange (BSE), and has partnerships
            with globally reputable companies like Intel, Qualcomm, Facebook
            amongst others. We comply with the highest governance land adherence
            standards and laws. You may also refer to our Privacy Policy.
          </div>
        </Panel>
        <Panel
          header="What Payment mechanisms do you accept?"
          key="ref19"
          className="panel-title"
        >
          <div className="panel-body">
            We offer multiple payment options for buyers, many of which allow
            you to pay in your local currency:<br></br>
            <br></br> <b>• Paypal</b> - This works as a secure escrow between
            buyers and our platform and enables you to pay in USD, EUR, GBP or
            AUD seamlessly via your Paypal account (if you have one) or via any
            international debit / credit card. While paying through PayPal your
            statement may reflect an order charge equivalent to the total order
            amount created against your card. However, the amount deducted is
            only the Advance amount for the order (currently 20% for online
            checkout orders, and is the advance payment as mentioned during the
            order quote finalization for custom orders.)
            <br></br>
            <br></br>
            <b>
              • Local Bank Transfer for 10+ countries like the UK, Australia,
              USA, Canada, and many more!
            </b>{" "}
            - We can share local bank details and you can make a local bank
            transfer easily in the following countries - <br></br>
            <br></br> <b>• International Bank Transfer to Citibank, India</b> -
            We can share our Citibank details in India, and you can make an
            international SWIFT transfer from your bank almost anywhere in the
            world to our primary bank account in India.
          </div>
        </Panel>
        <Panel
          header="What will be the payment terms for my Qalara order?"
          key="ref23"
          className="panel-title"
        >
          <div className="panel-body">
            For Ready to ship or Express Custom orders, we currently ask for 20%
            of the payment to be paid as advance for order confirmation. The
            balance 80% of the order amount is collected once the order is
            delivered to you. This may vary from time to time, but will always
            be mentioned clearly during checkout prior to confirming your order.
            For Custom orders, the payment schedule varies depending on the
            nature of the product and the order total. The same is communicated
            to you in advance by our team during the process of quote creation.
            Please note that for DDP shipments, we reserve the right to deduct
            the balance payment after the first attempt of delivery is made by
            our logistics partner. For DDU shipment, we reserve the right to
            collect the payment after 48 hours of the shipment reaching the
            destination port.
          </div>
        </Panel>
        <Panel
          header="What is a Proforma invoice?"
          key="ref24"
          className="panel-title"
        >
          <div className="panel-body">
            A proforma invoice is a preliminary copy of the invoice sent to
            buyers in advance of a shipment or delivery of goods. Pro-forma
            invoice typically describes the details and cost of purchased items
            and the estimated freight and estimated customs, duties and taxes.
            We share the Proforma Invoice, immediately after you place the order
            and will email you a copy of the invoice with the final billing
            amount at the time of dispatch. We also share a final invoice with
            all case of a ready to ship order or within 24 hours of placing a
            custom order.
          </div>
        </Panel>
        <Panel
          header="How can I get the invoice for my order?"
          key="ref25"
          className="panel-title"
        >
          <div className="panel-body">
            We share the necessary document within 24 hours of successful
            delivery. Alternatively, once your order is delivered, you can
            download the invoice from the Order section in your My Account page
            on Qalara.
          </div>
        </Panel>
        <Panel
          header="Can I get a refund for the VAT/GST charges?"
          key="ref26"
          className="panel-title"
        >
          <div className="panel-body">
            Many countries like Australia, U.K., Canada, and Singapore allow you
            to claim VAT/GST refunds provided you have a VAT/GST registration
            and if it's a business shipment. Different countries have different
            rules for claiming VAT refunds and we request you to check your
            local laws for the exact process. Please note that VAT/GST refund is
            not possible if you are availing IOR services for a DDP shipment.
            <br></br>
            <br></br>
            For U.K. You can reclaim a refund against the VAT while filing your
            returns. For more details, please refer the link
            https://www.gov.uk/reclaim-vat
            <br></br>
            <br></br>
            For Australia, you can pay the VAT and reclaim the benefits as
            applicable under the local laws. Alternatively, you can set up a
            deferment account in the first activity statement after import, and
            reclaim the applicable benefits on a monthly basis.
            <br></br>
            <br></br>
            For other countries that enable similar tax refunds, please write to
            us at buyers@qalara.com and we will share the process as applicable!
          </div>
        </Panel>
        <Panel
          header="Payment for my order failed, what should I do?"
          key="ref27"
          className="panel-title"
        >
          <div className="panel-body">
            Just go to the My Order section in your My Account page and you will
            find the order for which the payment failed. Against the order, you
            will have an option to Retry Payment. You can click on that link and
            you will be redirected to the Payment page for retrying payment. If
            the issue persists, please write to us at buyers@qalara.com and we
            will resolve the issue.
          </div>
        </Panel>

        <Panel
          header="Amount from my card was deducted but I didn't get an order confirmation email?"
          key="ref29"
          className="panel-title"
        >
          <div className="panel-body">
            Although this is very unlikely, however, if this happens please
            check if any order for the payment you made is visible in the My
            Order section in your My Account page. If an order is created and is
            in Payment Unsuccessful state please write to us at
            buyers@qalara.com. If no order is created we recommend you to wait
            for 3 to 5 days within which the refund to your account generally
            happens. Alternatively, you can always write to us at
            buyers@qalara.com
          </div>
        </Panel>
      </Collapse>

      <div className="panel-header main-heading">NEED FURTHER HELP?</div>
      <div className="panel-body help-section">
        We're happy to help. You can always share your questions and issues by
        writing to us at buyers@qalara.com and we will make sure that your issue
        is resolved within the next 48 hours.
      </div>
    </div>
  );
};

export default FAQ;
