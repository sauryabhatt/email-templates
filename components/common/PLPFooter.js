/** @format */

import React from "react";

function PLPFooter(props) {
  let { category = "" } = props;

  const footerHelpSection = (
    <div>
      {/* <p style={{ fontWeight: "bold" }}>
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
      <br></br> */}
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
        <h3 className="qa-fw-b">An easy guide to wholesale buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          Which types of furniture are available on Qalara?
        </p>
        <p>
          With Qalara you can source wholesale furniture for the living room,
          bedroom, dining room, home office, hallways, and even outdoors. You
          can choose from a variety of products like coffee tables, side tables,
          chest of drawers, beds, chairs, sofas, poufs, bookshelves and more.
          Different sellers also offer different furniture styles like modern,
          minimal, traditional, industrial and mid-century modern.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing furniture by
          Qalara sellers?
        </p>
        <p>
          Our sellers use a mix of different techniques to create unique
          products and designs. Some popular production methods are hand
          carving, metalwork, metal & marble inlay, hand painting, rattan
          weaving, wood moulding and bending amongst others.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What raw materials are used for manufacturing these products?
        </p>
        <p>
          Our curated bulk furniture suppliers offer options in different
          qualities of wood like sheesham, mango, acacia, beech along with
          leather, iron, brass, aluminium, glass, marble, jute and bamboo. They
          also work with a variety of upholstery fabrics like cotton, velvet and
          faux leather.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add you label and customise designs as per
          your requirements. In case you already have a design, please send us a
          picture and we will get back to you with detailed specs, post a
          discussion with the supplier. Different sellers will have specific
          MOQs for customised products and we will share the same with you.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What else should I consider before finalizing my order?
        </p>
        <p>
          A wide design range, variety of materials and different production
          methods employed can make finalizing the seller or product a bit of a
          task. We stand by the quality of all products listed on our platform,
          however, for requirement finalization we recommend you to browse
          extensively through our selection. Here is a list of key pointers that
          can help you in the shortlisting process:<br></br>
          <br></br>● Finalize the style that you want to buy, i.e. contemporary,
          modern, rustic, industrial etc.
          <br></br>● Materials and assembly methods best suited to your target
          consumer geography and weather
          <br></br>● Review our continually refreshing trend-boards for ideas
          <br></br>● Review the product specification details mentioned on the
          product page especially sizing, care, and any disclaimers
          <br></br>● You can read up about the supplier as that can offer great
          content for marketing these products
          <br></br>● Review the MOQs and the final landed price inclusive of
          freight and taxes.
        </p>
        <br></br>

        {footerHelpSection}
      </div>
    );
  } else if (category === "Home Furnishing") {
    return (
      <div className="seo-slp-footer">
        <h3 className="qa-fw-b">An easy guide to wholesale buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What type of home furnishing and linen ranges are available on Qalara?
        </p>
        <p>
          With Qalara you can source a wide range of home linen and furnishings.
          We have an extensive selection of bedding, curtains, bath towels &
          robes, cushions & throws, table linen, quilts & duvets and rugs &
          carpet.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing these
          products?
        </p>
        <p>
          Many of our suppliers employ a mix of handicraft techniques like
          kantha, patchwork, crewel embroidery, applique, block-printing,
          tie-dye, aari work, batik, macrame, beadwork and many more traditional
          techniques to create unique designs.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What Materials are used by your suppliers?
        </p>
        <p>
          Our home furnishings sellers work with a variety of raw materials
          including cotton, jute, satin, silk, wool, and wool blends, recycled
          fabrics, upcycled textile waste, denim along with many natural fibres.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add you label and customise designs as per
          your requirements. In case you already have a design, please send us a
          picture and we will get back to you with detailed specs, post a
          discussion with the supplier. Different sellers will have specific
          MOQs for customised products and we will share the same with you.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my bulk order?
        </p>
        <p>
          Numerous combinations of materials, crafts and techniques can make
          finalizing products a bit of a task. We stand by the quality of all
          products on our platform, however, for requirement finalization we
          recommend you to browse extensively through our selection. Here is a
          list of key points that can help you in the shortlisting process:
          <br></br>
          <br></br>● Finalize the styles and colors that fit your brand and
          collection
          <br></br>● Finalize materials and crafts that will work best for your
          target consumer geography and weather
          <br></br>● Review our continually refreshing trend-boards for ideas
          <br></br>● Review the product specification details mentioned on the
          product page especially sizing, care, and any disclaimers
          <br></br>● You can read up about the supplier as that can offer great
          content for marketing these products
          <br></br>● Review the MOQs and the final landed price inclusive of
          freight and taxes.
        </p>
        <br></br>

        {footerHelpSection}
      </div>
    );
  } else if (category === "Home Décor & Accessories") {
    return (
      <div className="seo-slp-footer">
        <h3 className="qa-fw-b">An easy guide to wholesale buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          Which home decor and accessories ranges are available on Qalara?
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
          Our bulk sellers use a mix of modern and popular local techniques and
          handicrafts to create unique products and designs. Some popular
          production methods are dhokra, woodcarving, jaali cutting, mosaic,
          metal casting, hand painting, glasswork and gold inlay amongst other
          traditional and modern techniques.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What materials are used in manufacturing these products?
        </p>
        <p>
          Our wholesale suppliers work with a wide range of raw materials
          including stone, ropes, fabrics, wood, leather, iron, copper, brass,
          aluminium, glass, marble, sabai grass, upcycled waste, jute and
          bamboo. Many of our sellers recycle wastes and upcycle scraps to
          create unique decor accents.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add you label and customise designs as per
          your requirements. In case you already have a design, please send us a
          picture and we will get back to you with detailed specs, post a
          discussion with the supplier. Different sellers will have specific
          MOQs for customised products and we will share the same with you.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my wholesale home decor and
          accessories order?
        </p>
        <p>
          A variety of materials, production methods and designs can sometimes
          make finalizing the seller or product a bit of a task. We stand by the
          quality of the all products listed on our platform, however, for
          requirement finalization, we recommend you to browse extensively
          through our product selection. Here is a list of key points that can
          help you in the shortlisting process:<br></br>
          <br></br>● Finalize the style that you want to buy, i.e. contemporary,
          modern, rustic, industrial etc.<br></br>● Materials, colours and
          techniques best suited to your target consumer geography and weather
          <br></br>● Review our continually refreshing trend-boards for ideas
          <br></br>● Review the product specification details mentioned on the
          product page especially sizing, care, and any disclaimers<br></br>●
          You can read up about the supplier as that can offer great content for
          marketing these products<br></br>● Review the MOQs and the final
          landed price inclusive of freight and taxes.
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else if (category === "Kitchen & Dining") {
    return (
      <div className="seo-slp-footer">
        <h3 className="qa-fw-b">An easy guide to wholesale buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          Which kitchenware, cookware and dining products are available on
          Qalara?
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
          Many of our suppliers employ a mix of handicraft techniques to create
          unique products and designs. Some popular production methods are hand
          carving, hammering, metal cladding, inlay, hand painting and polishing
          and pottery.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What materials are used in manufacturing these products?
        </p>
        <p>
          Our curated suppliers work with a wide range of materials including
          stone, wood, iron, brass, copper, aluminium, glass, marble, natural
          fibres, sabai grass and many other indigenous materials.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add you label and customise designs as per
          your requirements. In case you already have a design, please send us a
          picture and we will get back to you with detailed specs, post a
          discussion with the supplier. Different sellers will have specific
          MOQs for customised products and we will share the same with you.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my kitchen and dining
          wholesale order?
        </p>
        <p>
          Numerous combinations of materials, crafts and designs can make
          finalizing the seller or product a bit of a task. We stand by the
          quality of the products of all the suppliers on our platform, however,
          for requirement finalization, we recommend you to browse extensively
          through our selection. Here is a list of key points that can help you
          in shortlisting your products:<br></br>
          <br></br>● Finalize the style that you want to buy, i.e. coastal,
          modern, european, traditional etc.
          <br></br>● Materials, colours and techniques best suited to your
          target consumer geography and weather<br></br>● Review our continually
          refreshing trend-boards for ideas<br></br>● Review the product
          specification details mentioned on the product page especially sizing,
          care, and any disclaimers<br></br>● You can read up about the supplier
          as that can offer great content for marketing these products<br></br>●
          Review the MOQs and the final landed price inclusive of freight and
          taxes.
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else if (category === "Fashion") {
    return (
      <div className="seo-slp-footer">
        <h3 className="qa-fw-b">An easy guide to wholesale buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What types of fashion, accessories and textile products are available
          on Qalara?
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
          Many of our wholesale fashion and textiles suppliers use a mix of
          modern and traditional techniques and handicrafts to create unique
          products and designs. They employ a variety of ingenious production
          methods like phulkari, chikankari, hand painting, batik, shibori,
          tie-dye, ikat, aari work, extra weft weaving, and numerous other
          surface embellishment and weaving techniques.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What raw materials are used in fashion, textiles and accessories
          manufacturing?
        </p>
        <p>
          Our suppliers work with a variety of fabrics like organic cotton, eri
          silk, tussar, muga, pashmina wool, and different ready textiles like
          chanderi cotton, satin, wool and wool blends. Accessories suppliers
          also use leather and denim along with other surface embellishments.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add you label and customise designs as per
          your requirements. In case you already have a design, please send us a
          picture and we will get back to you with detailed specs, post a
          discussion with the supplier. Different sellers will have specific
          MOQs for customised products and we will share the same with you.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my wholesale fashion
          accessories order?
        </p>
        <p>
          Numerous combinations of materials, crafts and designs can make
          finalizing the seller or product a bit of a task. We stand by the
          quality of all the products on our platform, however, for requirement
          finalization, we recommend you to browse extensively through our
          selection. Here is a list of key points that can help you in
          shortlisting your products:<br></br>
          <br></br> ● Finalize the color palette and the fabrics best suited for
          your target audience<br></br>● Review our continually refreshing
          trend-boards for ideas<br></br>● Review the product specification
          details mentioned on the product page especially sizing, care, and any
          disclaimers<br></br>● You can read up about the supplier as that can
          offer great content for marketing these products
          <br></br>● Review the MOQs and the final landed price inclusive of
          freight and taxes.
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else if (category === "Pets Essentials") {
    return (
      <div className="seo-slp-footer">
        <h3 className="qa-fw-b">An easy guide to wholesale buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          Which pets accessories products are available on Qalara?
        </p>
        <p>
          You can choose from a wide selection of pet beds, feeders and
          organisers. We will be launching, leashes, collars and toys very soon.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing pet products?
        </p>
        <p>
          Many of our suppliers employ a mix of handicraft techniques to create
          unique products and designs. Some popular production methods are wood
          carving, meat work, embroidery and beadwork among others.
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
        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add you label and customise designs as per
          your requirements. In case you already have a design, please send us a
          picture and we will get back to you with detailed specs, post a
          discussion with the supplier. Different sellers will have specific
          MOQs for customised products and we will share the same with you.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my order?
        </p>
        <p>
          Numerous combinations of materials, crafts and designs can make
          finalizing the seller or product a bit of a task. We stand by the
          quality of all the products on our platform, however, for requirement
          finalization, we recommend you to browse extensively through our
          online selection. Here is a list of key points that can help you in
          shortlisting your products: <br></br>
          <br></br>● Finalize the style that you want to buy, i.e. contemporary,
          modern, rustic, industrial etc.<br></br>● Materials, colours and
          techniques best suited to your target consumer geography and weather
          <br></br>● Review the product specification details mentioned on the
          product page especially sizing, care, and any disclaimers<br></br>●
          You can read up about the supplier as that can offer great content for
          marketing these products<br></br>● Review the MOQs and the final
          landed price inclusive of freight and taxes
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else if (category === "Baby & Kids") {
    return (
      <div className="seo-slp-footer">
        <h3 className="qa-fw-b">An easy guide to wholesale buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          Which baby and kids products are available on Qalara?
        </p>
        <p>
          With Qalara you can choose products from a collection of clothes,
          toys, crib sets, diaper bags, bed linen, kids furniture and more.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in the manufacturing of these
          products?
        </p>
        <p>
          Many of our wholesale suppliers are renowned for their unique
          handcrafted products. They employ a variety of production methods like
          quilting, crochet, applique, knitting, embroidery, lacquer work, hand
          painting, hand printing and carving.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What materials are used in manufacturing these products?
        </p>
        <p>
          Our bulk sellers work with a variety of safe and children friendly
          materials including organic cotton, denim, cotton velvet, wool and
          sustainable wood.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add you label and customise designs as per
          your requirements. In case you already have a design, please send us a
          picture and we will get back to you with detailed specs, post a
          discussion with the supplier. Different sellers will have specific
          MOQs for customised products and we will share the same with you.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my wholesale order?
        </p>
        <p>
          Numerous combinations of materials, crafts and designs can make
          finalizing the seller or product a bit of a task. We stand by the
          quality of all the products on our platform, however, for requirement
          finalization, we recommend you to browse extensively through our
          selection. Here is a list of key pointers that can help you in
          shortlisting your products:<br></br>
          <br></br>● Finalize the product range and colors that fit your brand
          and collection
          <br></br>● Review our continually refreshing trend-boards and category
          edits for ideas
          <br></br>● Review the product specification details mentioned on the
          product page especially sizing, care, and any disclaimers<br></br>●
          You can read up about the supplier as that can offer great content for
          marketing these products<br></br>● Review the MOQs and the final
          landed price inclusive of freight and taxes
        </p>
        <br></br>
        {footerHelpSection}
      </div>
    );
  } else if (category === "Jewelry") {
    return (
      <div className="seo-slp-footer">
        <h3 className="qa-fw-b">An easy guide to wholesale buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What types of Jewelry is available on Qalara?
        </p>
        <p>
          With Qalara you can choose products from a collection of necklaces,
          bracelets, anklets, nose pins, rings, studs, cufflinks, tie pins,
          broaches, hair accessories, bangles and many more.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in the manufacturing of jewelry
          products found on Qalara?
        </p>
        <p>
          Many of our wholesale suppliers are renowned for their unique
          handcrafted products. They employ a variety of centuries-old
          techniques of hammering, inlay work, gem craft, wire braiding, kundan
          work and meenakari amongst many others.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What materials are used in manufacturing these jewelry products found
          on Qalara?
        </p>
        <p>
          Our bulk jewelry sellers work with gold, silver, copper, brass,
          precious and semi-precious gems, and other skin-friendly metal. You
          will also find unique jewelry made with upcycled fabrics, glass and
          natural fibres.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add you label and customise designs as per
          your requirements. In case you already have a design, please send us a
          picture and we will get back to you with detailed specs, post a
          discussion with the supplier. Different sellers will have specific
          MOQs for customised products and we will share the same with you.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my wholesale order?
        </p>
        <p>
          Numerous combinations of materials, crafts and designs can make
          finalizing the seller or product a bit of a task. We stand by the
          quality of the products of all the suppliers on our platform, however,
          for requirement finalization, we recommend you to browse extensively
          through our selection. Here is a list of key pointers that can help
          you in shortlisting your products: <br></br>
          <br></br>● Finalize styles and metal colours that fit your brand and
          collection<br></br>● Review our continually refreshing trend-boards
          for ideas<br></br>● Review the product specification details mentioned
          on the product page especially sizing, care, and any disclaimers
          <br></br>● You can read up about the supplier as that can offer great
          content for marketing these products
          <br></br>● Review the MOQs and the final landed price inclusive of
          freight and taxes.
        </p>
        <br></br>

        {footerHelpSection}
      </div>
    );
  } else if (category === "Stationery & Novelty") {
    return (
      <div className="seo-slp-footer">
        <h3 className="qa-fw-b">An easy guide to wholesale buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What types of stationery & novelty products are available on Qalara?
        </p>
        <p>
          With Qalara you can choose products from a collection of notebooks,
          journals, diaries, covers, desk organisers, pen stands, board games,
          wooden games, compasses, telescopes and various other novelty
          products.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in the manufacturing of novelty
          products found on Qalara?
        </p>
        <p>
          Many of our wholesale suppliers are renowned for their unique
          handcrafted products. They employ a variety of centuries-old
          techniques of hammering, inlay work, wood carving, handmade paper
          crafts, hand binding, leather crafts, paper mache amongst others.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What materials are used in manufacturing these stationery products
          found on Qalara?
        </p>
        <p>
          Our bulk stationery and novelty sellers work with wood, iron, handmade
          paper, textiles, brass, marble, ceramics and many other indigenous
          materials.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add you label and customise designs as per
          your requirements. In case you already have a design, please send us a
          picture and we will get back to you with detailed specs, post a
          discussion with the supplier. Different sellers will have specific
          MOQs for customised products and we will share the same with you.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What should I consider before finalizing my wholesale order?
        </p>
        <p>
          Numerous combinations of materials, crafts and designs can make
          finalizing the seller or product a bit of a task. We stand by the
          quality of the products of all the suppliers on our platform, however,
          for requirement finalization, we recommend you to browse extensively
          through our selection. Here is a list of key pointers that can help
          you in shortlisting your products: <br></br>
          <br></br>● Finalize the product range and styles that fit your brand
          and collection<br></br>● Review our continually refreshing
          trend-boards for ideas<br></br>● Review the product specification
          details mentioned on the product page especially sizing, care, and any
          disclaimers
          <br></br>● You can read up about the supplier as that can offer great
          content for marketing these products
          <br></br>● Review the MOQs and the final landed price inclusive of
          freight and taxes.
        </p>
        <br></br>

        {footerHelpSection}
      </div>
    );
  } else {
    return (
      <div className="seo-slp-footer">
        <h3 className="qa-fw-b">An easy guide to wholesale buying on Qalara</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What types of products are available on Qalara?
        </p>
        <p>
          Qalara is a digital platform for wholesale buyers from around the
          world to source artisanal, eco-friendly, organic, recycled, fair &
          social products made by responsible producers from India, South East
          Asia and nearby regions. You can buy wholesale home decor, home linen,
          kitchen & dining ware, fashion accessories, textiles, rugs, jewellery,
          furniture, baby products, pet essentials and more on Qalara. Our
          sellers specialise in techniques like kalamkari hand painting, ikat
          weaving, numerous ingenious handloom crafts, marble inlay, block
          printing, resist dyeing, hand embroidery, basketry, hand carving,
          crochet, macrame and many more. We will also be launching beauty and
          specialty organic foods soon!
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add you label and customise designs as per
          your requirements. In case you already have a design, please send us a
          picture and we will get back to you with detailed specs, post a
          discussion with the supplier. Different sellers will have specific
          MOQs for customised products and we will share the same with you.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          How do we know that goods are of the right quality and will be
          produced on time?
        </p>
        <p>
          We quality inspect all orders, manage production monitoring for custom
          orders, facilitate secure payments, offer the best freight costs and
          ensure safe door delivery. For custom orders, we monitor the
          production of your order and share updates through the key milestones
          of the production process. We also facilitate inline and final line
          inspections for large custom orders - which can be done remotely via
          video meetings. We conduct a final Quality Inspection once goods are
          ready and review all documentation. We can also facilitate quality
          testing as per your requirements from a certified lab at an additional
          fee. These quality standards need to be provided at the time of
          placing the order and are recommended for larger orders.
          <br></br>
          <br></br>Once products are ready and have been inspected, a trusted
          logistics partner associated with Qalara ships the products, either by
          Air or Ocean Freight as decided at the time of placing the order. We
          keep a constant track of your order till the order is delivered to you
          at the designated location, ensuring reliable service from order
          confirmation to delivery.
        </p>
        <br></br>

        {footerHelpSection}
      </div>
    );
  }
}

export default PLPFooter;
