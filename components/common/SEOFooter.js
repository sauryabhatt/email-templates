/** @format */

import React from "react";

function SEOFooter(props) {
  let { category = "" } = props;

  const footerHelpSection = (
    <div>
      <p style={{ fontWeight: "bold" }}>How and when are orders shipped?</p>
      <p>
        We continuously monitor the production process of your order and share
        updates throughout the production process. We also facilitate inline and
        final line inspections for custom orders - which can be done remotely
        via video meetings. We conduct a final QC for product specifications and
        a drop test as well. We can also facilitate quality testing as per your
        requirements from a certified lab at an additional fee. These quality
        standards need to be provided at the time of placing the order.<br></br>{" "}
        As soon as the production process has crossed a certain threshold, we
        plan the shipping date with the supplier. On the basis of the shipping
        date, a trusted logistics partner associated with Qalara comes and picks
        up the product. We keep a constant track of your order till the order is
        delivered to you at the designated location, ensuring fast execution and
        reliable service.
      </p>
      <br></br>
      <p style={{ fontWeight: "bold" }}>How are Qalara suppliers verified?</p>
      <p>
        Qalara identifies and shortlists sellers based on credible, legitimate
        associations like the World Fair Trade Organization, Craftmark, Crafts
        Council, Exports Promotions Councils, and self declared claims against
        our six core values - Artisanal (heritage, evolved, hybrid), Organic,
        Eco-friendly, Recycled, Fair & Social, Sustainable. We then reach out to
        the sellers, once agreed on the terms and conditions, and review their
        certifications and legal compliance documentation. We also review their
        product catalogs and order in items when we want to be sure about the
        materials and quality. We also undertake physical factory/ facility
        audits as best possible, however, owing to the unusual Covid
        circumstances we have been limited in our ability to do so to the
        fullest extent possible. In such scenarios we also undertake reference
        checks and review customer/ client feedback where possible.
      </p>
      <br></br>
      <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
      <p>
        Qalara, is a b2b sales platform, which brings reliable Indian
        manufacturers, to fulfil your wholesale needs. When you sign up at
        Qalara, during the registration we will ask you for basic information
        like organisation name, nature of business and country of operation etc.
        This helps us safeguard both your as well as our suppliers interests. We
        will reach out to you in case any additional information is required. If
        you are facing any issues with verification write to us at
        help@qalara.com
      </p>
      <br></br>
    </div>
  );

  if (category === "Furniture & Storage") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to Qalara sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How to choose the right seller?</p>
        <p>
          Every furniture seller on Qalara offers a unique combination design,
          technique and material. Once you finalize the categories that you are
          looking for, you will be able to see a shortlisted list of sellers who
          offer these products. You can read their story and get a glimpse of
          their workshops, techniques and people on the seller home page. You
          can also browse the product video and the catalogs to get an
          understanding of their products and services. If you still want to get
          to know more we can schedule a video demonstration with the supplier
          as well.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What furniture ranges are available on Qalara?
        </p>
        <p>
          With Qalara you can source wholesale metal as well as wooden furniture
          online from India. You can browse from an array of categories like
          Living Room, Home Office, Kitchen & Dining, Bedroom, Storage &
          Organization and Outdoor Furniture. Our suppliers are renowned
          wholesale suppliers in hand crafted yet intelligently designed
          products.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing furniture in
          India?
        </p>
        <p>
          A lot of suppliers use a mix of modern facilities along with popular
          regional techniques and handicrafts to create unique products and
          designs. Some popular production methods are Hand weaving, Hand
          carving, Hand painting, Metal cladding, Inlay (Stone and Marble).
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What Materials are used by your suppliers?
        </p>
        <p>
          Our curated yet exhaustive range or furniture suppliers offer options
          in Solid Wood, Leather, Iron, Brass, Aluminium, Glass, Marble, Jute
          and Bamboo. They also work with a variety of upholstery fabrics
          including handloom cotton, silk, block printed and hand embroidered
          fabrics. Our suppliers can also customize products to suit your
          business needs and complement your collection.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my Furniture supplier?
        </p>
        <p>
          Rich history, variety of materials used and different production
          methods employed can make finalizing the seller or product a very
          daunting task. We stand by the quality of the products of all the
          furniture suppliers on our platform, however for requirement
          finalization we recommend you to browse extensively through our
          furniture catalog. Here is a list of key points that can help you in
          the shortlisting process:
          <br></br>● Finalize the style that you want to buy, i.e. contemporary,
          modern, rustic etc.
          <br></br>● Materials and assembly methods best suited to your target
          consumer geography and weather
          <br></br>● Features of the furniture
          <br></br>● MOQs and Final Landing Price
          <br></br>● Shipment speed, i.e. how soon do you need the products.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          How do different Lead Times impact speed of the shipment?
        </p>
        <p>
          ● Ready to ship - These are products for which some inventories are
          readily available with the supplier. Generally ready to ship products
          are dispatched by the supplier within 5 days of order confirmation.
          <br></br>● Ready to make - Sometimes suppliers have the raw material
          readily available with them and hence they can take up the production
          process. These orders are shipped within 20 days of order
          confirmation.
          <br></br>● Make to order - These are custom order where the suppliers
          will need to procure raw materials as per your requirements and then
          take up production. Such orders are dispatched within 50 days of order
          confirmation.
          <br></br>● Design to order - If you need any customisation is the
          product size or design then you can convey your requirements to the
          supplier and they will do the production basis the approved designs.
          This can be a slightly longer process and orders are shipped within 70
          days of confirmation.
        </p>
        <br></br>

        {footerHelpSection}
      </div>
    );
  } else if (category === "Home Furnishing") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to Qalara sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How to choose the right seller?</p>
        <p>
          Every wholesale supplier on Qalara offers a unique combination design,
          technique and material. Once you finalize the categories that you are
          looking for, you will be able to see a shortlisted list of sellers who
          offer these products. You can read their story and get a glimpse of
          their workshops, techniques and people on the seller home page. You
          can also browse the product video and the catalogs to get an
          understanding of their products and services. We can also schedule a
          video call between you and the sellers.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What home furnishings and textiles ranges are available on Qalara?
        </p>
        <p>
          With Qalara you can source a wide range of home furnishings and accent
          products. We have an extensive selection of Bath Linen, Bed Linen,
          Table linen, Rugs, Quilts, Cushions, Throws & Poufs.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing textiles in
          India?
        </p>
        <p>
          Our suppliers are renowned wholesale suppliers in hand crafted yet
          intelligently designed products. They employ a variety of ingenious
          production methods like Block printing, Screen printing, Batik,
          Applique, Tie-dyeing, Ikat, Aari embroidered, Patchwork, Kantha
          quilting, Crewel embroidery, Hand tufting, Hand weaving and more.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What Materials are used by your suppliers?
        </p>
        <p>
          Our home furnishings suppliers work with a variety of textiles
          including handloom cotton, chanderi cotton, denim, silk, wool and wool
          blends, jute, upcycled and recycled fabrics and industrial waste. Our
          suppliers can also customize fabric quality as per your specific
          requirements.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my Home Furnishings supplier?
        </p>
        <p>
          Numerous combinations of materials, crafts and techniques can make
          finalizing the seller or product a very daunting task. We stand by the
          quality of the products of all the suppliers on our platform, however
          for requirement finalization we recommend you to browse extensively
          through each catalog. Here is a list of key points that can help you
          in the shortlisting process: <br></br>● Finalize the style that you
          want to buy to ensure these products fit into your collection{" "}
          <br></br>● Materials and crafts that will work best best for your
          target consumer geography and weather <br></br>● Specific features
          like wash care and hidden details that will specifically suit your
          customers <br></br>● MOQs and Final Landing Price <br></br>● Shipment
          speed, i.e. how soon do you need the products.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do different Lead Times impact speed of the shipment?
        </p>
        <p>
          ● Ready to ship - These are products for which some inventories are
          readily available with the supplier. Generally ready to ship products
          are dispatched by the supplier within 5 days of order confirmation.{" "}
          <br></br>● Ready to make - Sometimes suppliers have the raw material
          readily available with them and hence they can take up the production
          process. These orders are shipped within 20 days of order
          confirmation. <br></br>● Make to order - These are custom order where
          the suppliers will need to procure raw materials as per your
          requirements and then take up production. Such orders are dispatched
          within 50 days of order confirmation. <br></br>● Design to order - If
          you need any customisation is the product size or design then you can
          convey your requirements to the supplier and they will do the
          production basis the approved designs. This can be a slightly longer
          process and orders are shipped within 70 days post confirmation.
        </p>
        <br></br>

        {footerHelpSection}
      </div>
    );
  } else if (category === "Home Décor & Accessories") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to Qalara sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How to choose the right seller?</p>
        <p>
          Every home accents seller on Qalara offers a unique combination
          design, technique and material. Once you finalize the products that
          you are looking for, you will be able to see a shortlisted list of
          sellers who offer these products. Read their story and get a glimpse
          of their workshops, techniques and onsight videos on the seller home
          page. You can also browse the product video and the catalogs to assess
          their product diversity and services. We also schedule a video call
          and demonstration for further interaction.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What Home Decor and Accessories ranges are available on Qalara?
        </p>
        <p>
          You can browse from an array of product categories like Bells, Chimes,
          Table top accessories, Wall hangings, Christmas decor, Vases and wall
          clocks, Lamps and lighting. Our suppliers are renowned wholesale
          suppliers in hand crafted yet intelligently designed products.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing decor accents
          in India?
        </p>
        <p>
          A lot of suppliers use a mix of modern facilities along with popular
          regional techniques and handicrafts to create unique products and
          designs. Some popular production methods are Hand weaving, Hand
          carving, Hand painting, Metal cladding, Inlay (Stone and Marble), Jali
          cut and Hand painting.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What Materials are used by your suppliers?
        </p>
        <p>
          Our curated suppliers work with a wide range of materials including
          Stone, Ropes, Fabrics, Wood, Leather, Iron, Brass, Aluminium, Glass,
          Marble, Grass, upcycled waste, Jute and Bamboo.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my Home Decor and accessories
          supplier?
        </p>
        <p>
          Rich history, variety of materials used and different production
          methods employed can make finalizing the seller or product a very
          daunting task. We stand by the quality of the products of all the
          furniture suppliers on our platform, however for requirement
          finalization we recommend you to browse extensively through our
          furniture catalog. Here is a list of key points that can help you in
          the shortlisting process: <br></br>● Finalize the style that you want
          to buy, i.e. contemporary, modern, rustic, industrial etc.<br></br>●
          Materials, colors and techniques best suited to your target consumer
          geography and weather <br></br>● Features and hidden details <br></br>
          ● MOQs and Final Landing Price <br></br>● Shipment speed, i.e. how
          soon do you need the products.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do different Lead Times impact speed of the shipment?
        </p>
        <p>
          ● Ready to ship - These are products for which some inventories are
          readily available with the supplier. Generally ready to ship products
          are dispatched by the supplier within 5 days of order confirmation.
          <br></br>● Ready to make - Sometimes suppliers have the raw material
          readily available with them and hence they can take up the production
          process. These orders are shipped within 20 days of order
          confirmation. <br></br>● Make to order - These are custom order where
          the suppliers will need to procure raw materials as per your
          requirements and then take up production. Such orders are dispatched
          within 50 days of order confirmation. <br></br>● Design to order - If
          you need any customisation is the product size or design then you can
          convey your requirements to the supplier and they will do the
          production basis the approved designs. This can be a slightly longer
          process and orders are shipped within 70 days of confirmation.
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else if (category === "Kitchen & Dining") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to Qalara sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How to choose the wholesale seller for Kitchen & Dining products?
        </p>
        <p>
          Every seller on Qalara offers a unique combination design, technique
          and material. Once you finalize the products that you are looking for,
          you will be able to see a shortlisted list of sellers who offer these
          products. Read their story and get a glimpse of their workshops,
          techniques and onsight videos on the seller home page. You can also
          browse the product video and the catalogs to assess their product
          diversity and services. We also schedule a video call and
          demonstration for further interaction.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What kitchenware, cookware and dining ranges are available on Qalara?
        </p>
        <p>
          You can browse from an array of product categories like plates,
          cutlery, bar accessories, coasters, kitchen storage, chopping boards,
          and traditional indegenous kitchen tools. Our wholesale suppliers are
          renowned for hand crafted yet intelligently designed products.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What different techniques are employed in manufacturing Kitchen and
          Dining products?
        </p>
        <p>
          A lot of suppliers use a mix of modern facilities, traditional
          techniques and handicrafts to create unique products and designs. Some
          popular production methods are Hand carving, Metal Beating, Hand
          painting, Metal cladding, Pottery, Inlay and Hand painting.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What Materials are used by your suppliers?
        </p>
        <p>
          Our curated suppliers work with a wide range of materials including
          Stone, Wood, Iron, Brass, Aluminium, Glass and Marble.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my Kitchen and Dining
          wholesale supplier?
        </p>
        <p>
          Numerous combinations of materials, crafts and techniques can make
          finalizing the seller or product a very daunting task. We stand by the
          quality of the products of all the furniture suppliers on our
          platform, however for requirement finalization we recommend you to
          browse extensively through our furniture catalog. Here is a list of
          key points that can help you in shortlisting sellers: <br></br>●
          Finalize the design that you want to buy, i.e. coastal, modern,
          European-inspired, Asian-inspired, hammered glass etc. <br></br>●
          Materials, colors and techniques best suited to your target consumer
          geography and weather <br></br>● Features and hidden details <br></br>
          ● MOQs and Final Landing Price <br></br>● Shipment speed, i.e. how
          soon do you need the products.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do different Lead Times impact speed of the shipment?
        </p>
        <p>
          ● Ready to ship - These are products for which some inventories are
          readily available with the supplier. Generally ready to ship products
          are dispatched by the supplier within 5 days of order confirmation.{" "}
          <br></br>● Ready to make - Sometimes suppliers have the raw material
          readily available with them and hence they can take up the production
          process. These orders are shipped within 20 days of order
          confirmation. <br></br>● Make to order - These are custom order where
          the suppliers will need to procure raw materials as per your
          requirements and then take up production. Such orders are dispatched
          within 50 days of order confirmation. <br></br>● Design to order - If
          you need any customisation is the product size or design then you can
          convey your requirements to the supplier and they will do the
          production basis the approved designs. This can be a slightly longer
          process and orders are shipped within 70 days of confirmation.
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else if (category === "Fashion") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to Qalara sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How to choose the right seller?</p>
        <p>
          Every wholesale supplier on Qalara offers a unique combination design,
          technique and material. Once you finalize the categories that you are
          looking for, you will be able to see a shortlisted list of sellers who
          offer these products. You can read their story and get a glimpse of
          their workshops, techniques and people on the seller home page. You
          can also browse the product video and the catalogs to get an
          understanding of their products and services. We can also schedule a
          video call between you and the sellers.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What home fashion and textiles ranges are available on Qalara?
        </p>
        <p>
          With Qalara you can Choose products from a collection of fashion
          accessories and textiles across materials, art forms and production
          methods. You can browse from an array of categories like bags,
          wallets, stoles, shawls, wraps and ready to stitch fabric lengths.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing textiles in
          India?
        </p>
        <p>
          Our wholesale fashion and textiles suppliers are renowned for unique
          handcrafted products. They employ a variety of ingenious production
          methods like Kantha, Chikankari, Hand painting, Batik, Shibori,
          Tie-dyeing, Ikat, Aari embroidered, Crewel embroidery, Extra weft
          weaving, and numerous other surface embellishments.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What materials are used by fashion, textiles and accessories
          suppliers?
        </p>
        <p>
          Our suppliers work with a variety of textiles including handloom
          cotton, chanderi cotton, denim, silk, wool and wool blends, jute and
          leather. Our suppliers can also customize fabrics and material to suit
          your specific business needs.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my bulk fashion accessories
          supplier?
        </p>
        <p>
          Numerous combinations of materials, crafts and techniques can
          sometimes make finalizing the seller or product a very daunting task.
          We stand by the quality of the products of all the furniture suppliers
          on our platform, however for requirement finalization we recommend you
          to browse extensively through our furniture catalog. Here is a list of
          key points that can help you in shortlisting sellers:<br></br> ●
          Finalize the color palate that fits your target launch season{" "}
          <br></br>● Seasonal or ongoing design trends in your target geography{" "}
          <br></br>● Specific features like reversible, washacre etc. <br></br>●
          MOQs and Final Landing Price <br></br>● Shipment speed, i.e. how soon
          do you need the products.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do different Lead Times impact speed of the shipment?
        </p>
        <p>
          Our suppliers work with a variety of textiles including handloom
          cotton, chanderi cotton, denim, silk, wool and wool blends, jute and
          leather. Our suppliers can also customize fabrics and material to suit
          your specific business needs.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What materials are used by fashion, textiles and accessories
          suppliers?
        </p>
        <p>
          ● Ready to ship - These are products for which some inventories are
          readily available with the supplier. Generally ready to ship products
          are dispatched by the supplier within 5 days of order confirmation.
          <br></br> ● Ready to make - Sometimes suppliers have the raw material
          readily available with them and hence they can take up the production
          process. These orders are shipped within 20 days of order
          confirmation. <br></br>● Make to order - These are custom order where
          the suppliers will need to procure raw materials as per your
          requirements and then take up production. Such orders are dispatched
          within 50 days of order confirmation. <br></br>● Design to order - If
          you need any customisation is the product size or design then you can
          convey your requirements to the supplier and they will do the
          production basis the approved designs. This can be a slightly longer
          process and orders are shipped within 70 days post confirmation.
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else if (category === "Pets Essentials") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to Qalara sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How to choose the right seller?</p>
        <p>
          Every home accents seller on Qalara offers a unique combination
          design, technique and material. Once you finalize the products that
          you are looking for, you will be able to see a shortlisted list of
          sellers who offer these products. Read their story and get a glimpse
          of their workshops, techniques and onsight videos on the seller home
          page. You can also browse the product video and the catalogs to assess
          their product diversity and services. We also schedule a video call
          and demonstration for further interaction.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What Pets accessories ranges are available on Qalara?
        </p>
        <p>
          You can browse from an array of product categories like Beds, Feeders,
          Leashes, Pet toys and storage organisers. Our suppliers are renowned
          wholesale suppliers in hand crafted yet intelligently designed
          products.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing pet productsin
          India?
        </p>
        <p>
          A lot of suppliers use a mix of modern facilities along with popular
          regional techniques and handicrafts to create unique products and
          designs. Some popular production methods are Hand weaving, Hand
          carving, Hand painting and Hand weaving.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What Materials are used by your suppliers?
        </p>
        <p>
          Our curated suppliers work with a wide range of materials including
          Ropes, Fabrics, Wood, Leather, Iron, Aluminium, upcycled waste, Jute
          and Bamboo.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing a Pet accessories supplier?
        </p>
        <p>
          Rich history, variety of materials used and different production
          methods employed can make finalizing the seller or product a very
          daunting task. We stand by the quality of the products of all the
          furniture suppliers on our platform, however for requirement
          finalization we recommend you to browse extensively through our
          furniture catalog. Here is a list of key points that can help you in
          the shortlisting process: <br></br>● Finalize the style that you want
          to buy, i.e. contemporary, modern, rustic, industrial etc. <br></br>●
          Materials, colors and techniques best suited to your target consumer
          geography and weather <br></br>● Features and hidden details <br></br>
          ● MOQs and Final Landing Price <br></br>● Shipment speed, i.e. how
          soon do you need the products.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do different Lead Times impact speed of the shipment?
        </p>
        <p>
          ● Ready to ship - These are products for which some inventories are
          readily available with the supplier. Generally ready to ship products
          are dispatched by the supplier within 5 days of order confirmation.{" "}
          <br></br>● Ready to make - Sometimes suppliers have the raw material
          readily available with them and hence they can take up the production
          process. These orders are shipped within 20 days of order
          confirmation. <br></br>● Make to order - These are custom order where
          the suppliers will need to procure raw materials as per your
          requirements and then take up production. Such orders are dispatched
          within 50 days of order confirmation. <br></br>● Design to order - If
          you need any customisation is the product size or design then you can
          convey your requirements to the supplier and they will do the
          production basis the approved designs. This can be a slightly longer
          process and orders are shipped within 70 days of confirmation
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else if (category === "Baby & Kids") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to Qalara sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How to choose the right seller?</p>
        <p>
          Every wholesale supplier on Qalara offers a unique combination design,
          technique and material. Once you finalize the categories that you are
          looking for, you will be able to see a shortlisted list of sellers who
          offer these products. You can read their story and get a glimpse of
          their workshops, techniques and people on the seller home page. You
          can also browse the product video and the catalogs to get an
          understanding of their products and services. We can also schedule a
          video call between you and the sellers.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What baby products ranges are available on Qalara?
        </p>
        <p>
          With Qalara you can Choose products from a collection of accessories
          and toys across materials, art forms and production methods. You can
          browse from an array of categories like bags, bed linen and toys.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing of these
          products?
        </p>
        <p>
          Our wholesale suppliers are renowned for unique handcrafted products.
          They employ a variety of ingenious production methods like Kantha,
          Applique, Knitting, Embroidery, Lacquer work, Hand painting and Hand
          carving.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What materials are used by Qalara suppliers?
        </p>
        <p>
          Our suppliers work with a variety of textiles including handloom
          cotton, denim, wool and wood. Our suppliers can also customize
          materials to suit your specific business needs.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my bulk supplier?
        </p>
        <p>
          Numerous combinations of materials, crafts and techniques can
          sometimes make finalizing the seller or product a very daunting task.
          We stand by the quality of the products of all the furniture suppliers
          on our platform, however for requirement finalization we recommend you
          to browse extensively through our furniture catalog. Here is a list of
          key points that can help you in shortlisting sellers: <br></br>●
          Finalize the color palatte that fits your target launch season
          <br></br>● Seasonal or ongoing design trends in your target geography
          <br></br>● Specific features like reversible, washacre etc.<br></br>●
          MOQs and Final Landing Price<br></br>● Shipment speed, i.e. how soon
          do you need the products.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do different Lead Times impact speed of the shipment?
        </p>
        <p>
          ● Ready to ship - These are products for which some inventories are
          readily available with the supplier. Generally ready to ship products
          are dispatched by the supplier within 5 days of order confirmation.
          <br></br>● Ready to make - Sometimes suppliers have the raw material
          readily available with them and hence they can take up the production
          process. These orders are shipped within 20 days of order
          confirmation.<br></br>● Make to order - These are custom order where
          the suppliers will need to procure raw materials as per your
          requirements and then take up production. Such orders are dispatched
          within 50 days of order confirmation.<br></br>● Design to order - If
          you need any customisation is the product size or design then you can
          convey your requirements to the supplier and they will do the
          production basis the approved designs. This can be a slightly longer
          process and orders are shipped within 70 days post confirmation.
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else if (category === "Jewelry") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to Qalara sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How to choose the right seller?</p>
        <p>
          Every wholesale Jewelry supplier on Qalara offers a unique combination
          of design, technique and material. Once you finalize the products that
          you are looking for, you will be able to see a shortlisted list of
          sellers who offer these. You can read their story and get a glimpse of
          their workshops, techniques and artisans in action on the seller page.
          You can also browse their videos, catalogs and products to get an
          understanding of their offerings and services. We can also schedule a
          video call between you and the sellers.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What Jewelry and accessories ranges are available on Qalara?
        </p>
        <p>
          On Qalara you can buy products from a wide selection of Jewelry and
          accessories. You can choose from an array of categories like earrings,
          necklaces, nose pins, anklets, hair accessories, bracelets, chains,
          charms, studs, cufflinks, tie clips and brooches.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in Jewelry manufacturing?
        </p>
        <p>
          Our wholesale jewelry suppliers are renowned for their unique
          handcrafted designs and products. They employ a variety of ingenious
          production methods like meenakari, dhokra, thewa, filigree, beading,
          inlay, metal casting, braiding and many more traditional crafts.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What materials are used by jewelry suppliers?
        </p>
        <p>
          Our suppliers work with a variety of traditional materials like gold,
          silver, brass, platinum, diamond and semi-precious metals and
          gemstones. We also a wide selection of jewelry in unconventional
          materials like leather, upcycled fabrics, marble, mirror, felt,
          ceramic and marble.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my bulk jewelry supplier?
        </p>
        <p>
          Numerous combinations of materials, crafts and techniques can
          sometimes make finalizing the seller or product a very daunting task.
          We stand by the quality of the products of all the wholesale suppliers
          on our platform, however, for requirement finalization, we recommend
          you to browse extensively through our catalogs and listings. Here are
          a few key points that can help you in shortlisting sellers: <br></br>●
          Finalize the style and designs that best work for your brand
          philosophy - modern, traditional, quirky, minimalist<br></br>●
          Seasonal or ongoing design trends in your target geography <br></br>●
          Special features or hidden details like clip-on, back closures,
          detachable charms etc.<br></br>● MOQs and Final Landing Price
          <br></br>● Shipment speed, i.e. how soon do you need the products.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do different Lead Times impact speed of the shipment?
        </p>
        <p>
          ● Ready to ship - These are products for which some inventories are
          readily available with the supplier. Generally ready to ship products
          are dispatched by the supplier within 5 days of order confirmation.
          <br></br>● Ready to make - Sometimes suppliers have the raw material
          readily available with them and hence they can take up the production
          process. These orders are shipped within 20 days of order
          confirmation. <br></br>● Make to order - These are custom order where
          the suppliers will need to procure raw materials as per your
          requirements and then take up production. Such orders are dispatched
          within 50 days of order confirmation. <br></br>● Design to order - If
          you need any customisation is the product size or design then you can
          convey your requirements to the supplier and they will do the
          production basis the approved designs. This can be a slightly longer
          process and orders are shipped within 70 days post confirmation.
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else {
    return (
      <div className="seo-slp-footer">
        <h3>Qalara Buyer’s Guide</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How to select the correct supplier for your business requirements?
        </p>
        <p>
          At Qalara, a wholesale ecommerce platform we bring for you handpicked
          suppliers who are reliable, possess exquisite craftsmanship, believe
          in sustainable environment friendly products, and specialize in
          fulfilling wholesale requirements. These suppliers have extensive
          experience in fulfilling wholesale orders across the United States,
          Europe, and the United Kingdom. You can rest assured of the quality of
          each and every supplier on our wholesale platform. <br></br>
          <br></br>Few steps that may help you in selecting the correct supplier
          for your wholesale buying needs are as follows: <br></br>1. Select the
          category you want to purchase in the filter column. For example, if
          you want to place a wholesale order for candle wax warmer, select home
          décor in the filter. <br></br>2. Use the filter for certification, if
          you are looking for sellers certified on specific values for example
          fair trade, FCRF certifications, organic certification etc. <br></br>
          3. Go through the seller cards and the description to shortlist
          sellers who cater to your requirements
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How to select a product from the seller catalog?
        </p>
        <p>
          Qalara suggests that along with the product specifications you should
          also go through the supplier’s profile, production methods, and the
          different art forms that they use. This will give you a unique
          perspective on product aesthetics.
          <br></br>
          Our suppliers specialize across a wide variety of artisanal products
          from materials like wood, leather, iron, brass, glass, ceramic,
          marble, soapstone and Indian crafts like Block printing, Screen
          printing, Batik, Shibori, Yarn Dyed, Ikat, Embroidered, Phulkari, and
          lot more. You can fine-tune your requirements and select the
          appropriate wholesale supplier for you.
          <br></br>
          If you want further details around a product for example- wholesale
          prices, go to the supplier company page and raise a ‘Request for
          Quotation’. We will get back with details around the product and any
          other information that you might be looking for.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How to determine the pricing of the products?
        </p>
        <p>
          We suggest that once you have finalized the supplier or the product or
          if you want customization; please reach out to us using the ‘Request
          for Quote’ option. We will get back to you with a quote from the
          seller after confirming that all your requirements are fulfilled.
          <br></br>
          For example, if you are thinking of buying wholesale Boho jewelry for
          resale or a specific organic handicraft product, just share your
          requirements with us. We will connect you with the best supplier and
          share the all inclusive quote with you.
          <br></br>
          At Qalara we take pride in ensuring that our services are second to
          none. So just select the supplier or the product or simply share your
          requirements, and leave everything rest to us.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>Who can I contact for support?</p>
        <p>
          You can contact us via email at help@qalara.com. A Qalara team member
          will be in contact within 24 hours.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How are orders shipped?</p>
        <p>
          We keep a continuous monitoring of the production process of your
          order. As soon as the production process has crossed a certain
          threshold we plan the shipping date with the supplier. On the basis of
          the shipping date, a trusted logistics partner associated with Qalara
          comes and picks up the product. We keep a constant track of your order
          till the order is delivered to you at the designated location,
          ensuring fast execution and reliable service.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How to become a verified buyer?</p>
        <p>
          Qalara, is a b2b sales platform, which brings reliable Indian
          manufacturers, to fulfill your wholesale needs. When you sign up on
          Qalara, during the registration we take certain information that helps
          us in verifying you as a buyer. We will reach out to you in case any
          additional information is required. If you are facing any issues with
          verification write to us at help@qalara.com
        </p>
        <br></br>
      </div>
    );
  }
}

export default SEOFooter;
