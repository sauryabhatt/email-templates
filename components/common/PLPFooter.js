/** @format */

import React from "react";

function PLPFooter(props) {
  let { category = "" } = props;

  const footerHelpSection = (
    <div>
      <p style={{ fontWeight: "bold" }}>
        How do different lead times impact the speed of the shipment?
      </p>
      <p>
        ● Ready to ship - These are products for which some inventories are
        readily available with the supplier. Generally ready to ship products
        are dispatched by the supplier within 5 days of order confirmation.
        <br></br>● Ready to make - Sometimes suppliers have the raw material
        readily available with them and hence they can take up the production
        process. These orders are shipped within 20 days of order confirmation.
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
      <p style={{ fontWeight: "bold" }}>How and when are orders shipped?</p>
      <p>
        We continuously monitor the production process of your order and share
        updates throughout the production process. We also facilitate inline and
        final line inspections for custom orders - which can be done remotely
        via video meetings. We conduct a final QC for product specifications and
        a drop test as well. We can also facilitate quality testing as per your
        requirements from a certified lab at an additional fee. These quality
        standards need to be provided at the time of placing the order. During
        order processing, we will reach out to you for country-specific
        information, if required.<br></br>As soon as the production process has
        crossed a certain threshold, we plan the shipping date with the
        supplier. On the basis of the shipping date, a trusted logistics partner
        associated with Qalara ships the products. We keep a constant track of
        your order till the order is delivered to you at the designated
        location, ensuring fast execution and reliable service.
      </p>
      <br></br>
      <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
      <p>
        You can sign up as a buyer on Qalara to start your buying journey.
        During the registration, we will ask you for basic information like
        organisation name, nature of business and country of operation etc. This
        helps us safeguard both your as well as our suppliers’ interests. We
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
        <h3>An easy guide to bulk buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What furniture ranges are available on Qalara?
        </p>
        <p>
          With Qalara you can source wholesale furniture in wood, iron, rattan,
          glass and engineered wood. You can choose from a variety of products
          like coffee tables, side tables, chest of drawers, beds, chairs,
          sofas, poufs, bookshelves and more.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing furniture by
          Qalara sellers?
        </p>
        <p>
          Our sellers use a mix of different techniques to create unique
          products and designs. Some popular production methods are hand
          carving, metalwork, inlay, hand painting, rattan weaving, marble craft
          amongst others.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What raw materials are used for manufacturing these products?
        </p>
        <p>
          Our curated bulk furniture suppliers offer options in different
          qualities of wood like sheesham, mango, acacia, beech along with
          leather, iron, brass, aluminium, glass, marble, jute and bamboo. They
          also work with a variety of upholstery fabrics and can also customize
          products to suit your specific requirements.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What else should I consider before finalizing my order?
        </p>
        <p>
          A huge design range, variety of materials used and different
          production methods employed can make finalizing the seller or product
          a very daunting task. We stand by the quality of the products of all
          products listed on our platform, however, for requirement finalization
          we recommend you to browse extensively through our furniture catalog.
          Here is a list of key points that can help you in the shortlisting
          process:
          <br></br>● Finalize the style that you want to buy, i.e. contemporary,
          modern, rustic etc.
          <br></br>● Materials and assembly methods best suited to your target
          consumer geography and weather
          <br></br>● Features of the furniture
          <br></br>● MOQs and Final Landing Price
          <br></br>● Shipment speed, i.e. how soon do you need the products.
        </p>
        <br></br>

        {footerHelpSection}
      </div>
    );
  } else if (category === "Home Furnishing") {
    return (
      <div className="seo-slp-footer">
        <h3>An easy guide to bulk buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What home furnishings and linens products are available on Qalara?
        </p>
        <p>
          With Qalara you can source a wide range of home furnishings and
          linens. We have an extensive selection of bedding, curtains, bath
          towels & robes, cushions & throws, quilts & duvets and rugs & carpet.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing these
          products?
        </p>
        <p>
          Our suppliers employ a variety of ingenious production methods like
          kantha, patchwork, crewel embroidery, applique, block-printing, batik,
          tie-dye, aari work, batik, macrame, beadwork and many more traditional
          techniques, that they employ to create modern designs.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What Materials are used by your suppliers?
        </p>
        <p>
          Our home furnishings sellers work with a variety of raw materials
          including cotton, jute, satin, silk, wool, and wool blends, recycled
          fabrics, upcycled textile waste, denim along with many natural fibres
          and local fabrics.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my bulk order?
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

        {footerHelpSection}
      </div>
    );
  } else if (category === "Home Décor & Accessories") {
    return (
      <div className="seo-slp-footer">
        <h3>An easy guide to bulk buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What Home Decor and Accessories products are available on Qalara?
        </p>
        <p>
          You can browse from an array of product categories like wall decor,
          planters, candlesticks, tealights, incense, sculptures, bells &
          windchimes, photo frames, plaques, vases, dreamcatchers, wall hooks,
          door handles, lamps and many more unique artisanal products.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing these decor
          accents?
        </p>
        <p>
          Our bulk sellers use a mix of modern facilities along with popular
          local techniques and handicrafts to create unique products and
          designs. Some popular production methods are dhokra, woodcarving,
          jaali cutting, mosaic, metal casting, pattachitra painting, glasswork
          and gold inlay amongst other traditional and modern techniques.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What materials are used in manufacturing these products?
        </p>
        <p>
          Our wholesale suppliers work with a wide range of raw materials
          including stone, ropes, fabrics, wood, leather, iron, copper, brass,
          aluminium, glass, marble, grass, upcycled waste, jute and bamboo.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my Home Decor and accessories
          order?
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
        {footerHelpSection}
      </div>
    );
  } else if (category === "Kitchen & Dining") {
    return (
      <div className="seo-slp-footer">
        <h3>An easy guide to bulk buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What kitchenware, cookware and dining ranges are available on Qalara?
        </p>
        <p>
          You can choose from a range of kitchenware like platters, cutting
          boards, utensils, crockery, serving dishes, glasses, cutlery, bar
          accessories, coasters, cups & mugs, kitchen storage and traditional
          indigenous kitchen tools.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What different techniques are employed in manufacturing Kitchen and
          Dining products?
        </p>
        <p>
          Our bulk suppliers use a mix of modern facilities, traditional
          techniques and handicrafts to create unique products and designs. Some
          popular production methods are hand carving, hammering, metal
          cladding, and pottery.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What materials are used in manufacturing these products?
        </p>
        <p>
          Our curated suppliers work with a wide range of materials including
          stone, wood, iron, brass, copper, aluminium, glass and marble.
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
        {footerHelpSection}
      </div>
    );
  } else if (category === "Fashion") {
    return (
      <div className="seo-slp-footer">
        <h3>An easy guide to bulk buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What home fashion, accessories and textiles products are available on
          Qalara?
        </p>
        <p>
          Qalara hosts a huge collection of fashion accessories and textiles,
          created using different materials, art forms and production methods.
          You can choose from bags, vanity pouches, footwear, stoles, wraps,
          hair accessories, shirts, pants, skirts and textile yardages.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          Which manufacturing techniques are employed in making these products?
        </p>
        <p>
          Our wholesale fashion and textiles suppliers are renowned for unique
          handcrafted products. They employ a variety of ingenious production
          methods like phulkari, chikankari, hand painting, batik, shibori,
          tie-dye, ikat, aari work, extra weft weaving, and numerous other
          surface embellishments.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What raw materials are used in fashion, textiles and accessories
          manufacturing?
        </p>
        <p>
          Our suppliers work with a variety of yarns like organic cotton, eri
          silk, tussar, muga, pashmina wool, and different ready textiles like
          chanderi cotton, denim, satin, wool and wool blends.
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
        {footerHelpSection}
      </div>
    );
  } else if (category === "Pets Essentials") {
    return (
      <div className="seo-slp-footer">
        <h3>An easy guide to bulk buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What Pets accessories ranges are available on Qalara?
        </p>
        <p>
          You can browse from a wide selection of pet beds, feeders, leashes,
          pet toys and organisers.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing pet products?
        </p>
        <p>
          Our wholesale suppliers use a mix of modern facilities along with
          popular regional techniques and handicrafts to create unique products
          and designs. Some popular production methods are wood carving, meat
          work, embroidery, beadwork among others.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What materials are used in manufacturing these products?
        </p>
        <p>
          Our bulk sellers work with a wide range of raw materials including
          ropes, fabrics, wood, leather, iron, copper, brass, aluminium, glass,
          marble, grass, upcycled waste, jute and bamboo.
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
        {footerHelpSection}
      </div>
    );
  } else if (category === "Baby & Kids") {
    return (
      <div className="seo-slp-footer">
        <h3>An easy guide to bulk buying on Qalara</h3>
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
          What are the different techniques used in the manufacturing of these
          products?
        </p>
        <p>
          Our wholesale suppliers are renowned for unique handcrafted products.
          They employ a variety of ingenious production methods like kantha,
          applique, knitting, embroidery, lacquer work, painting and carving.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What materials are used in manufacturing these products?
        </p>
        <p>
          Our bulk sellers work with a variety of safe and children friendly
          materials including organic cotton, denim, wool and wood. They can
          also customize designs and materials tailored to your specific
          requirements.
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
        {footerHelpSection}
      </div>
    );
  } else if (category === "Jewelry") {
    return (
      <div className="seo-slp-footer">
        <h3>An easy guide to bulk buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What Jewelry ranges are available on Qalara?
        </p>
        <p>
          With Qalara you can Choose products from a collection of necklaces,
          bracelets, anklets, nose pins, rings, studs, cufflinks, tie pins,
          broaches, hair accessories, bangles and many more.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in the manufacturing of these
          products?
        </p>
        <p>
          Our wholesale suppliers are renowned for unique handcrafted products.
          They employ a variety of ingenious hammering, inlay, gem craft, wire
          braiding, kundan work and meenakari amongst other local techniques.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What materials are used in manufacturing these products?
        </p>
        <p>
          Our bulk jewelry sellers work with gold, silver, copper, brass,
          precious and semi-precious gems, diamonds and other skin-friendly
          metal. You will also find unique jewelry made with upcycled fabrics,
          glass and natural fibres.
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

        {footerHelpSection}
      </div>
    );
  } else {
    return (
      <div className="seo-slp-footer">
        <h3>An easy guide to bulk buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What product ranges are available on Qalara?
        </p>
        <p>
          Qalara is a digital platform for wholesale buyers from around the
          world to source artisanal, eco friendly, organic, recycled, fair &
          social products made by responsible producers from India, South East
          Asia and nearby regions. You can buy wholesale home decor, linens,
          fashion accessories, textiles, rugs, jewelry, furniture, beauty and
          personal care, baby products & pet essentials on Qalara.
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  }
}

export default PLPFooter;
