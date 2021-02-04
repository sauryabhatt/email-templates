/** @format */
import React, { useState, useEffect, useRef } from "react";
import { Collapse } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const Panel = Collapse.Panel;

const FAQ = (props) => {
  const router = useRouter();
  const [activeKeys, setActiveKeys] = useState([]);
  const orders = useRef();
  const fulfillment = useRef();
  const payment = useRef();
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
            Craftmark, Crafts Council, Exports Promotions Councils, and
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
          header="What is a Request for Quote, an Order Query and a Custom Quote?"
          key="orders"
          className="panel-title"
        >
          <div className="panel-body">
            A Request for Quote (RFQ) / Order Query/ Custom Quote is a simple
            order enquiry form that you can fill out to convey your
            requirements. You can send us three types of Quote Requests:
            <br></br>
            <br></br>
            <b>Get custom Quote</b> - If you like a specific product and wish to
            order specific quantities or want to slightly customize the color or
            packaging, you can ask for a custom quote. <br></br>
            <br></br>
            <b>Send order Query</b> - If you like a seller's portfolio and would
            like them to manufacture a custom design for you basis their
            skillset. This may require higher MOQs (Minimum Order Quantity) and
            longer lead times. <br></br>
            <br></br>
            <b>Request for Quote</b> - If you're looking to purchase something
            specific but you haven't been able to find that product on our
            platform, we can create or curate products for you. This may require
            higher MOQs (Minimum Order Quantity) and longer lead times.{" "}
            <br></br>
            <br></br>
            <b>Add to Collection</b> - This is a <b>new feature</b> that allows
            you to add multiple products to create moodboards, ranges or
            collections based on a theme (say Fall2020) and you can send a
            Request for Quote for the entire collection at once! <br></br>
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
            after being quality inspected by Qalara Many of these products are
            fast moving and can run out of stock! <br></br>
            <br></br>
            <b>Express Custom</b> - These are products that may not have ready
            inventory, but can be produced in small batches within 3-5 weeks.
            These are a great alternative to ready stock that we recommend.
            There may be some exceptions, but most hard goods are able to meet
            these requirements. <br></br>
            <br></br>
            <b>Made to order</b> - These are custom orders with predefined
            Minimum Order Quantities (MOQ) where the suppliers will need to
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
            quantities and orders are usually shipped within 60-90 days
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
            have a Request for Quotation based 1-on-1 checkout. See details
            below.<br></br>
            <br></br>
            <b>
              <i>Ready-to-ship and Express Custom orders</i>
            </b>
            <br></br>Both these types of orders are enabled for instant checkout
            - Look out for the 'Ready to ship' and 'Express Custom' tag for
            these items. For the ones that you like, please enter quantity equal
            to or greater than the minimum quantity, add the products to cart,
            confirm your address, review the freight, tax and duties costs, and
            checkout using Paypal securely.
            <br></br>
            <br></br>For certain countries or postal codes, we may not have
            instant checkout currently available. In this case, look out for the
            'Ready to ship' and 'Express Custom' tag and shortlist the items
            that you like. Please enter quantity equal to or greater than the
            minimum quantity, add the products to cart, confirm your address and
            then click on 'Create Order' for the Qalara team to then help you
            with the rest of the process to confirm the order. Once we receive
            your <b>'Create Order'</b> request, we will revert to you with a
            consolidated quotation via email and your My Account section, along
            with a link to checkout securely using Paypal or a similar payment
            gateway.<br></br>
            <br></br>
            <b>
              <i>Made-to-order or Design-to-order (Custom Orders)</i>
            </b>
            <br></br>
            STEP 1: Send us a Request for Quote, Seller Order Query or Custom
            Quote for any artisanal home & lifestyle products you'd like to
            source from us. <br></br>STEP 2: Receive line-sheets for collections
            from curated sellers. Shortlist products and finalise quantities to
            receive a consolidated quote with the lowest freight cost & taxes
            along with lead times. Confirm your order and receive a link to
            checkout securely using Paypal or a similar payment gateway.{" "}
            <br></br>STEP 3: We manage sampling and production monitoring for
            you across all vendors. Once goods are ready you can opt for remote
            video inspection. Qalara sends you regular status updates till goods
            are delivered.
          </div>
        </Panel>
        <Panel
          header="Can I order a sample?"
          key="ref7"
          className="panel-title"
        >
          <div className="panel-body">
            In most cases, yes. Please write to us at buyers@qalara.com and
            mention the webpage address or link of the product that you like in
            your email. We may request you to fill out a Sample Request Form
            with an indicative order type and size against the sample that you
            request. Once received, we check the availability of the sample with
            the supplier and notify you of the sample delivery cost. The Seller
            may charge a premium for samples.
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
          header="What do you need from us to process our order"
          key="ref9"
          className="panel-title"
        >
          <div className="panel-body">
            After you have placed an order on our site, we may reach out to you
            for certain business-related documents or numbers that may be
            required, such as your VAT number, Business Number, EORI, Import
            Export Code, GST number, etc. These typically vary by country and
            are mandated by the shipping company to clear customs into your
            country.
          </div>
        </Panel>
        <Panel
          header="What are 'Free shipping' products?"
          key="ref10"
          className="panel-title"
        >
          <div className="panel-body">
            For products classified as 'Free shipping' you don't have to pay any
            additional freight charge for these products. You can simply add
            these products to your cart and proceed to the shipping page. You
            may have to pay Duties and taxes for these products depending on the
            local laws of the destination country.
          </div>
        </Panel>
        <Panel
          header="Why do you have different prices for different quantities applicable for some products?"
          key="ref11"
          className="panel-title"
        >
          <div className="panel-body">
            Due to the nature of the product, there is a fixed cost that is
            involved while producing these products. That's why the base price
            of the product may vary depending on the quantities that you are
            ordering. If the price mentioned for a product is inclusive of the
            Freight charge the freight for a given quantity too will influence
            these prices. We show different prices for different quantities so
            that the buyers can have a fair understanding of the cost as per
            their order requirements. <br></br>
            <br></br>
            <b>
              If you have a requirement for larger quantities or if you have any
              special requirements we request you to send a Get quote request,
              and we will get back with unbeatable prices
            </b>
          </div>
        </Panel>
        <Panel
          header="What is a video meeting?"
          key="ref12"
          className="panel-title"
        >
          <div className="panel-body">
            A video demo is a live video meeting that facilitates direct
            conversation and interaction with the seller. Through these
            meetings, buyers can engage with sellers more deeply, check out the
            seller's product offering and understand the specifications and
            details of the different production methods and crafts. You can also
            share your specific requirements with the seller and can in turn
            understand your design preferences and expectations. You may even
            request a facility tour to get a first-hand view of behind the
            scenes operations. This is recommended for large custom orders.
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
            preempt and rectify and discrepancies during the production process.
            In case we anticipate delays, we step in, to caution and support the
            sellers if needed. We also do a final QC at the once goods are
            packed and reach our warehouse before shipping. We also encourage
            buyers to participate in 'remote video inspections' to be extra sure
            and avoid any surprises.
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
            please write to us with your requirements. We generally suggest the
            critical tests for products that you select. We also share a final
            quote once the testing requirement has been finalized. Once ready,
            our suppliers ship the product to the nominated testing lab. As soon
            as the reports are available, we will share the same with you.
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
            delivered we would need absolute proof to suitably address your
            concerns. We, therefore, request you to take the following steps to
            ensure that we can provide the fastest, satisfactory resolution:
            <br></br>• Take a video of the shipment box while unboxing <br></br>
            • If there is any discrepancy between the sample and the product
            delivered, we request you to share the image of the product and
            sample side by side and mention the issue that you are facing{" "}
            <br></br>• Please share clear image/ video from different angles of
            any defect that you may notice on the product
            <br></br>
            Please note that handcrafted items unlike factory-made products
            always have some degree of variance. Please read the disclaimers
            carefully on the product page or in your custom order quotation.
            <br></br>
            <br></br>
            Having said that, if yours is a genuine case, we understand and
            we've got your back!
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
            with globally reputable companies like Intel, Qualcomm, Facebook,
            amongst others. We comply with the highest governance land adherence
            standards and laws. You may refer to our Privacy Policy.
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
            <br></br> <b>• Paypal</b> - this works as a secure escrow between
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
              US, Canada, and many more!
            </b>
            We can share local bank details and you can make a local bank
            transfer easily from above mentioned countries. <br></br>
            <br></br> <b>• International Bank Transfer to Citibank, India</b> -
            we can share our Citibank details in India, and you can make an
            international SWIFT transfer.
          </div>
        </Panel>
        <Panel
          header="What is DDU (Delivered Duty Unpaid) mode of shipment?"
          key="ref20"
          className="panel-title"
        >
          <div className="panel-body">
            The option to select DDU mode is available in the Shipping page for
            Ready to Ship or Express custom products during checkout. For custom
            orders you can share your shipment preference with our team during
            the quote creation process. For a DDU shipment we don't add the
            Estimated duties and taxes to your order total and any{" "}
            <b>
              applicable duties and taxes are directly paid by you to the
              freight/ logistics partner
            </b>{" "}
            during customs clearance or delivery as applicable.
          </div>
        </Panel>
        <Panel
          header="What is DDP (Delivered Duty Paid) mode of shipment?"
          key="ref21"
          className="panel-title"
        >
          <div className="panel-body">
            The option to select DDP mode is available in the shipping page for
            Ready to Ship or Express custom products during checkout. For custom
            orders you can share your shipment preference with our team during
            the quote creation process. For a DDP shipment any{" "}
            <b>applicable duties and taxes are paid by Qalara on your behalf</b>{" "}
            during the custom clearance process. Estimated duties and taxes are
            added to your order total during the order checkout process.
          </div>
        </Panel>
        <Panel
          header="Your checkout mentions that Freight, Taxes and Duties are 'estimates'. When will I know the freight, duties and taxes that will be charged?"
          key="ref22"
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
            clearance at destination.<br></br>
            <br></br> We will therefore be able to ascertain the final accurate
            freight, duties and taxes only after we receive the invoice from the
            freight company a few weeks post delivery, and there are
            possibilities of variance in freight, tax and duties as mentioned
            above, but those are usually minimal. Any such differential amount
            after the actual freight, duties and taxes is known to us is neither
            charged extra to you, nor refunded.
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
            For Custom orders the payment schedule varies depending on the
            nature of the product and the order total. The same is communicated
            to you in advance by our team during the process of quote creation.
            Please note that for DDP shipments we reserve the right to deduct
            the balance payment after the first attempt of delivery is made by
            our logistics partner. For DDU shipment we reserve the right to
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
            in case of a ready to ship order or within 24 hours of placing a
            custom order.
          </div>
        </Panel>
        <Panel
          header="How can I get the invoice for my order?"
          key="ref25"
          className="panel-title"
        >
          <div className="panel-body">
            We will email you a copy of the invoice with the final billing
            amount at the time of dispatch. We also share a final invoice with
            all necessary documents within 24 hours of successful delivery.
            Alternatively, once your order is delivered you can download the
            invoice from the Order section in your My Account page on Qalara
          </div>
        </Panel>
        <Panel
          header="I am shipping my order to the U.K.; can I get a refund for the VAT charges?"
          key="ref26"
          className="panel-title"
        >
          <div className="panel-body">
            Yes, you will be eligible for a refund provided you are registered
            under VAT and you fulfil all criteria as per applicable U.K. laws.
            You can reclaim a refund against the VAT while filing your returns.
            For more details, please refer the link
            https://www.gov.uk/reclaim-vat
          </div>
        </Panel>
        <Panel
          header="I am shipping my order to Australia; can I get a refund for the GST charges?"
          key="ref27"
          className="panel-title"
        >
          <div className="panel-body">
            Yes, you will be eligible for a refund provided you are registered
            under GST as per applicable Australian laws. You can pay and reclaim
            or set up a deferment account pay in the first activity statement
            after import and reclaim to the extent of imported goods sales on
            each month basis. For other countries that enable similar tax
            refunds, please write to us at buyers@qalara.com and we will help
            you get your refunds!
          </div>
        </Panel>
        <Panel
          header="Payment for my order failed, what should I do?"
          key="ref28"
          className="panel-title"
        >
          <div className="panel-body">
            Just go to the My Order section in your My Account page and you will
            find the order for which the payment failed. Against the order, you
            will have an option to Retry Payment. You can click on that link and
            you will be redirected to the Payment page for retrying payment.
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
            buyers@qalara.com If no order is created we recommend you to wait
            for 3 to 5 days within which the refund to your account generally
            happens. Alternatively, you can always write to us at
            buyers@qalara.com
          </div>
        </Panel>
        <Panel
          header="I'm just getting started with my business, and I don't have my business registrations done. Can I still order from Qalara?"
          key="ref30"
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
