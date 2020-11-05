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
        <h3>Buyer's Guide to wholesale furniture sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How do I choose the right seller?</p>
        <p>
          Every furniture seller on Qalara offers a unique combination of
          design, technique and material. Once you finalize the categories that
          you are looking for, you will be able to see a shortlisted list of
          sellers who offer these products. You can read their story and get a
          glimpse of their workshops, techniques and people on the seller home
          page. You can also browse the product video and the catalogs to get an
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
          Organization and Outdoor Furniture.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing furniture?
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
          Our wholesale furniture suppliers offer options in Solid Wood,
          Leather, Iron, Brass, Aluminium, Glass, Marble, Jute and Bamboo. They
          also work with a variety of upholstery fabrics including handloom
          cotton, silk, block printed and hand embroidered fabrics. Our
          suppliers can also customize products to suit your business needs and
          complement your collection.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          How are furniture suppliers verified?
        </p>
        <p>
          Qalara identifies and shortlists sellers based on credible, legitimate
          associations like the World Fair Trade Organization, Craftmark, Crafts
          Council, Exports Promotions Councils, and self declared claims against
          our six core values - Artisanal (heritage, evolved, hybrid), Organic,
          Eco-friendly, Recycled, Fair & Social, Sustainable. We then reach out
          to the sellers, once agreed on the terms and conditions, and review
          their certifications and legal compliance documentation. We also
          review their product catalogs and order in items when we want to be
          sure about the materials and quality. We also undertake physical
          factory/ facility audits as best possible, however, owing to the
          unusual Covid circumstances we have been limited in our ability to do
          so to the fullest extent possible. In such scenarios we also undertake
          reference checks and review customer/ client feedback where possible.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
        <p>
          Please sign up as a buyer on Qalara to start your buying journey.
          During the registration, we will ask you for basic information like
          organisation name, nature of business and country of operation etc.
          This helps us safeguard both your as well as our suppliers’ interests.
          We will reach out to you in case any additional information is
          required. If you are facing any issues with verification write to us
          at help@qalara.com
        </p>
        <br></br>

        {/* {footerHelpSection} */}
      </div>
    );
  } else if (category === "Home Furnishing") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to wholesale home furnishings sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How do I choose the right seller?</p>
        <p>
          Every home linen and furnishings sellers on Qalara offers a unique of
          combination design, technique and material. Once you finalize the
          categories that you are looking for, you will be able to see a
          shortlisted list of sellers who offer these products. You can read
          their story and get a glimpse of their workshops, techniques and
          people on the seller home page. You can also browse the product video
          and the catalogs to get an understanding of their products and
          services. If you still want to get to know more we can schedule a
          video demonstration with the supplier as well.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          Which home furnishings and textiles product ranges are available on
          Qalara?
        </p>
        <p>
          With Qalara you can source a wide range of home furnishings and accent
          products. We have an extensive selection of Bath Linen, Bed Linen,
          Table linen, Rugs & Carpets, Quilts, Cushions, Throws & Poufs.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing textiles?
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
          Our home furnishings suppeller works with a variety of textiles
          including handloom cotton, chanderi cotton, denim, silk, wool and wool
          blends, jute, upcycled and recycled fabrics and industrial waste. Our
          suppliers can also customize fabric quality as per your specific
          requirements.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>How are Qalara suppliers verified?</p>
        <p>
          Qalara identifies and shortlists sellers based on credible, legitimate
          associations like the World Fair Trade Organization, Craftmark, Crafts
          Council, Exports Promotions Councils, and self declared claims against
          our six core values - Artisanal (heritage, evolved, hybrid), Organic,
          Eco-friendly, Recycled, Fair & Social, Sustainable. We then reach out
          to the sellers, once agreed on the terms and conditions, and review
          their certifications and legal compliance documentation. We also
          review their product catalogs and order in items when we want to be
          sure about the materials and quality. We also undertake physical
          factory/ facility audits as best possible, however, owing to the
          unusual Covid circumstances we have been limited in our ability to do
          so to the fullest extent possible. In such scenarios we also undertake
          reference checks and review customer/ client feedback where possible.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
        <p>
          Please sign up as a buyer on Qalara to start your buying journey.
          During the registration, we will ask you for basic information like
          organisation name, nature of business and country of operation etc.
          This helps us safeguard both your as well as our suppliers’ interests.
          We will reach out to you in case any additional information is
          required. If you are facing any issues with verification write to us
          at help@qalara.com
        </p>
        <br></br>

        {/* {footerHelpSection} */}
      </div>
    );
  } else if (category === "Home Décor & Accessories") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to wholesale home decor sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How do I choose the right seller?</p>
        <p>
          Every home decor seller on Qalara offers a unique combination of
          design, technique and material. Once you finalize the categories that
          you are looking for, you will be able to see a shortlisted list of
          sellers who offer these products. You can read their story and get a
          glimpse of their workshops, techniques and people on the seller home
          page. You can also browse the product video and the catalogs to get an
          understanding of their products and services. If you still want to get
          to know more we can schedule a video demonstration with the supplier
          as well.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          Which home decor and accent product ranges are available on Qalara?
        </p>
        <p>
          You can browse from an array of product categories like Bells, Chimes,
          Table top accessories, Wall hangings, Christmas decor, Vases and
          planters, Wall art, Ornaments, Candle stick, Tea light holders, Lamps
          and more.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing home decor
          products?
        </p>
        <p>
          A lot of suppliers use a mix of modern facilities along with popular
          regional techniques and handicrafts to create unique products and
          designs. Some popular production methods are Hand weaving, Hand
          carving, Hand painting, Metal cladding, Sand casting and Inlay (stone
          and marble).
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What Materials are used by Qalara suppliers?
        </p>
        <p>
          Our wholesale decor suppliers work with wood, clay, brass, copper,
          iron and other metals, marble, jute and other local materials. They
          also upcycle and recycle a pot of industrial and textile waste.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How are home decor suppliers verified?
        </p>
        <p>
          Qalara identifies and shortlists sellers based on credible, legitimate
          associations like the World Fair Trade Organization, Craftmark, Crafts
          Council, Exports Promotions Councils, and self declared claims against
          our six core values - Artisanal (heritage, evolved, hybrid), Organic,
          Eco-friendly, Recycled, Fair & Social, Sustainable. We then reach out
          to the sellers, once agreed on the terms and conditions, and review
          their certifications and legal compliance documentation. We also
          review their product catalogs and order in items when we want to be
          sure about the materials and quality. We also undertake physical
          factory/ facility audits as best possible, however, owing to the
          unusual Covid circumstances we have been limited in our ability to do
          so to the fullest extent possible. In such scenarios we also undertake
          reference checks and review customer/ client feedback where possible.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
        <p>
          Please sign up as a buyer on Qalara to start your buying journey.
          During the registration, we will ask you for basic information like
          organisation name, nature of business and country of operation etc.
          This helps us safeguard both your as well as our suppliers’ interests.
          We will reach out to you in case any additional information is
          required. If you are facing any issues with verification write to us
          at help@qalara.com
        </p>
        <br></br>
        {/* {footerHelpSection} */}
      </div>
    );
  } else if (category === "Kitchen & Dining") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's guide to kitchen & dining sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do I choose a wholesale seller for Kitchen & Dining products?
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
          A lot of suppliers use a mix of traditional techniques and handicrafts
          to create unique products and designs. Some popular production methods
          are Hand carving, Metal Beating, Hand painting, Metal cladding,
          Pottery, Inlay and Hand painting.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What Materials are used by your suppliers?
        </p>
        <p>
          Our curated suppliers work with a wide range of materials including
          Stone, Clay, Terracotta, Copper, Hone & Horn, Wood, Iron, Brass,
          Aluminium, Glass and Marble.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How are Qalara suppliers verified?</p>
        <p>
          Qalara identifies and shortlists sellers based on credible, legitimate
          associations like the World Fair Trade Organization, Craftmark, Crafts
          Council, Exports Promotions Councils, and self declared claims against
          our six core values - Artisanal (heritage, evolved, hybrid), Organic,
          Eco-friendly, Recycled, Fair & Social, Sustainable. We then reach out
          to the sellers, once agreed on the terms and conditions, and review
          their certifications and legal compliance documentation. We also
          review their product catalogs and order in items when we want to be
          sure about the materials and quality. We also undertake physical
          factory/ facility audits as best possible, however, owing to the
          unusual Covid circumstances we have been limited in our ability to do
          so to the fullest extent possible. In such scenarios we also undertake
          reference checks and review customer/ client feedback where possible.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
        <p>
          Please sign up as a buyer on Qalara to start your buying journey.
          During the registration, we will ask you for basic information like
          organisation name, nature of business and country of operation etc.
          This helps us safeguard both your as well as our suppliers’ interests.
          We will reach out to you in case any additional information is
          required. If you are facing any issues with verification write to us
          at help@qalara.com
        </p>
        <br></br>
        {/* {footerHelpSection} */}
      </div>
    );
  } else if (category === "Fashion") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to fashion and accessories sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How do I choose the right seller?</p>
        <p>
          Every fashion and sellers on Qalara offers a unique combination of
          design, technique and material. Once you finalize the categories that
          you are looking for, you will be able to see a shortlisted list of
          sellers who offer these products. You can read their story and get a
          glimpse of their workshops, techniques and people on the seller home
          page. You can also browse the product video and the catalogs to get an
          understanding of their products and services. If you still want to get
          to know more we can schedule a video demonstration with the supplier
          as well.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          Which home fashion, accessories and textiles ranges are available on
          Qalara?
        </p>
        <p>
          With Qalara you can Choose products from a collection of fashion
          accessories and textiles across materials, art forms and production
          methods. You can browse from an array of categories like bags,
          wallets, stoles, shawls, wraps and ready to stitch fabric lengths.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What are the different manufacturing techniques used by fashion
          accessories suppliers?
        </p>
        <p>
          Our suppliers are renowned wholesale suppliers in hand crafted yet
          intelligently designed products. They employ a variety of ingenious
          production methods like Kantha, Chikankari, Hand painting, Batik,
          Shibori, Tie-dyeing, Ikat, Aari embroidered, Crewel embroidery, Extra
          weft weaving, and numerous other surface embellishments.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What materials are used by fashion accessories suppliers?
        </p>
        <p>
          Our suppellers work with a variety of textiles including handloom
          cotton, chanderi cotton, denim, silk, tussar, muga, zari, wool and
          wool blends, jute and leather. Our suppliers can also customize
          fabrics and material to suit your specific business needs.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How are home furnishings suppliers verified?
        </p>
        <p>
          Qalara identifies and shortlists sellers based on credible, legitimate
          associations like the World Fair Trade Organization, Craftmark, Crafts
          Council, Exports Promotions Councils, and self declared claims against
          our six core values - Artisanal (heritage, evolved, hybrid), Organic,
          Eco-friendly, Recycled, Fair & Social, Sustainable. We then reach out
          to the sellers, once agreed on the terms and conditions, and review
          their certifications and legal compliance documentation. We also
          review their product catalogs and order in items when we want to be
          sure about the materials and quality. We also undertake physical
          factory/ facility audits as best possible, however, owing to the
          unusual Covid circumstances we have been limited in our ability to do
          so to the fullest extent possible. In such scenarios we also undertake
          reference checks and review customer/ client feedback where possible.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
        <p>
          Please sign up as a buyer on Qalara to start your buying journey.
          During the registration, we will ask you for basic information like
          organisation name, nature of business and country of operation etc.
          This helps us safeguard both your as well as our suppliers’ interests.
          We will reach out to you in case any additional information is
          required. If you are facing any issues with verification write to us
          at help@qalara.com
        </p>
        <br></br>
        {/* {footerHelpSection} */}
      </div>
    );
  } else if (category === "Pets Essentials") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's guide to Qalara pet essential sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do I choose a wholesale seller?
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
          Which pet accessories product ranges are available on Qalara?
        </p>
        <p>
          You can browse from an array of product categories like Beds, Feeders,
          Leashes, Pet toys and storage organisers. Our suppliers are renowned
          wholesale suppliers in hand crafted yet intelligently designed
          products.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in manufacturing pet products?
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
        <p style={{ fontWeight: "bold" }}>How are Qalara suppliers verified?</p>
        <p>
          Qalara identifies and shortlists sellers based on credible, legitimate
          associations like the World Fair Trade Organization, Craftmark, Crafts
          Council, Exports Promotions Councils, and self declared claims against
          our six core values - Artisanal (heritage, evolved, hybrid), Organic,
          Eco-friendly, Recycled, Fair & Social, Sustainable. We then reach out
          to the sellers, once agreed on the terms and conditions, and review
          their certifications and legal compliance documentation. We also
          review their product catalogs and order in items when we want to be
          sure about the materials and quality. We also undertake physical
          factory/ facility audits as best possible, however, owing to the
          unusual Covid circumstances we have been limited in our ability to do
          so to the fullest extent possible. In such scenarios we also undertake
          reference checks and review customer/ client feedback where possible.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
        <p>
          Please sign up as a buyer on Qalara to start your buying journey.
          During the registration, we will ask you for basic information like
          organisation name, nature of business and country of operation etc.
          This helps us safeguard both your as well as our suppliers’ interests.
          We will reach out to you in case any additional information is
          required. If you are facing any issues with verification write to us
          at help@qalara.com
        </p>
        <br></br>
        {/* {footerHelpSection} */}
      </div>
    );
  } else if (category === "Baby & Kids") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's Guide to Qalara sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How to choose a wholesale seller for baby & kids products?
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
          What baby products ranges are available on Qalara?
        </p>
        <p>
          With Qalara you can choose products from a collection of accessories
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
          They employ a variety of indegenous production methods like Applique,
          Knitting, Embroidery, Lacquer work, Hand painting and Hand carving.
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
        <p style={{ fontWeight: "bold" }}>How are Qalara suppliers verified?</p>
        <p>
          Qalara identifies and shortlists sellers based on credible, legitimate
          associations like the World Fair Trade Organization, Craftmark, Crafts
          Council, Exports Promotions Councils, and self declared claims against
          our six core values - Artisanal (heritage, evolved, hybrid), Organic,
          Eco-friendly, Recycled, Fair & Social, Sustainable. We then reach out
          to the sellers, once agreed on the terms and conditions, and review
          their certifications and legal compliance documentation. We also
          review their product catalogs and order in items when we want to be
          sure about the materials and quality. We also undertake physical
          factory/ facility audits as best possible, however, owing to the
          unusual Covid circumstances we have been limited in our ability to do
          so to the fullest extent possible. In such scenarios we also undertake
          reference checks and review customer/ client feedback where possible.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
        <p>
          Please sign up as a buyer on Qalara to start your buying journey.
          During the registration, we will ask you for basic information like
          organisation name, nature of business and country of operation etc.
          This helps us safeguard both your as well as our suppliers’ interests.
          We will reach out to you in case any additional information is
          required. If you are facing any issues with verification write to us
          at help@qalara.com
        </p>
        <br></br>
        {/* {footerHelpSection} */}
      </div>
    );
  } else if (category === "Jewelry") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's guide to Qalara jewelry sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How do I choose the right seller?</p>
        <p>
          Every wholesale jewelry supplier on Qalara offers a unique combination
          of design, technique and material. Once you finalize the products that
          you are looking for, you will be able to see a shortlisted list of
          relevant sellers. You can read their story and get a glimpse of their
          workshops, techniques and artisans in action on the seller page. You
          can also browse their videos, catalogs and products to get an
          understanding of their offerings and services. We can also schedule a
          video call between you and the sellers.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What Jewelry and accessories ranges are available on Qalara?
        </p>
        <p>
          On Qalara you can buy products from a wide selection of jewelry and
          accessories. You can choose from an array of categories like earrings,
          necklaces, nose pins, anklets, hair accessories, bracelets, chains,
          charms, studs, cufflinks, tie clips and brooches. Our sellers can also
          customise designs to your specific requirements.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in Jewelry manufacturing?
        </p>
        <p>
          Our wholesale jewelry suppliers are renowned for their unique
          handcrafted designs and techniques. They employ a variety of
          production methods like meenakari, dhokra, thewa, filigree, beading,
          inlay, metal casting, braiding and many more traditional crafts.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What materials are used by jewelry suppliers?
        </p>
        <p>
          Our suppliers work with a variety of traditional materials like
          silver, brass, copper, swarovski, natural stones, and semi-precious
          metals and gemstones. We also have a wide selection of jewelry in
          unconventional materials like leather, upcycled fabrics, mirror, felt,
          ceramic and marble.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How are Qalara suppliers verified?</p>
        <p>
          Qalara identifies and shortlists sellers based on credible, legitimate
          associations like the World Fair Trade Organization, Craftmark, Crafts
          Council, Exports Promotions Councils, and self-declared claims against
          our six core values - Artisanal (heritage, evolved, hybrid), Organic,
          Eco-friendly, Recycled, Fair & Social, Sustainable. We then reach out
          to the sellers and review their certifications and legal compliance
          documentation, and also review their product catalogs. We also
          undertake physical factory/ facility audits as best possible, however,
          owing to the unusual Covid circumstances we have been limited in our
          ability to do so to the fullest extent possible. In such scenarios, we
          also undertake reference checks and review customer/ client feedback
          where possible.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
        <p>
          You can sign up as a buyer on Qalara to start your buying journey.
          During the registration, we will ask you for basic information like
          organisation name, nature of business and country of operation etc.
          This helps us safeguard both your as well as our suppliers’ interests.
          We will reach out to you in case any additional information is
          required. If you are facing any issues with verification write to us
          at help@qalara.com
        </p>
        <br></br>
        {/* {footerHelpSection} */}
      </div>
    );
  } else if (category === "Stationery & Novelty") {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's guide to Qalara stationery sellers</h3>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do I choose a wholesale seller?
        </p>
        <p>
          Every wholesale seller on Qalara offers a unique combination of
          design, technique and material. Once you finalize the products that
          you are looking for, you will be able to see a shortlisted list of
          relevant sellers. You can read their story and get a glimpse of their
          workshops, techniques and artisans in action on the seller page. You
          can also browse their videos, catalogs and products to get an
          understanding of their offerings and services. We can also schedule a
          video call between you and the sellers.
        </p>
        <br></br>

        <p style={{ fontWeight: "bold" }}>
          Which stationery products are available on Qalara?
        </p>
        <p>
          On Qalara you can buy products from a wide selection of stationery,
          games & novelty products. You can choose from planners, journals,
          organisers, games, card sets, bookmarks, telescopes & compasses. Our
          sellers can also customise designs to your specific requirements.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What are the different techniques used in stationery manufacturing?
        </p>
        <p>
          Our wholesale stationery suppliers are renowned for their unique
          handcrafted designs and techniques. They employ a variety of
          production methods like wood carving, lacquer work, sand casting, hand
          binding, paper mache and metal crafts.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          What materials are used by stationery suppliers?
        </p>
        <p>
          Our suppliers work with a variety of traditional materials like
          handmade paper, fabrics, brass, copper, iron and wood. We also have a
          wide selection of products in unconventional materials like leather,
          upcycled fabrics, and marble.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How are Qalara suppliers verified?</p>
        <p>
          Qalara identifies and shortlists sellers based on credible, legitimate
          associations like the World Fair Trade Organization, Craftmark, Crafts
          Council, Exports Promotions Councils, and self-declared claims against
          our six core values - Artisanal (heritage, evolved, hybrid), Organic,
          Eco-friendly, Recycled, Fair & Social, Sustainable. We then reach out
          to the sellers and review their certifications and legal compliance
          documentation, and also review their product catalogs. We also
          undertake physical factory/ facility audits as best possible, however,
          owing to the unusual Covid circumstances we have been limited in our
          ability to do so to the fullest extent possible. In such scenarios, we
          also undertake reference checks and review customer/ client feedback
          where possible.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
        <p>
          You can sign up as a buyer on Qalara to start your buying journey.
          During the registration, we will ask you for basic information like
          organisation name, nature of business and country of operation etc.
          This helps us safeguard both your as well as our suppliers’ interests.
          We will reach out to you in case any additional information is
          required. If you are facing any issues with verification write to us
          at help@qalara.com
        </p>
        <br></br>
        {/* {footerHelpSection} */}
      </div>
    );
  } else {
    return (
      <div className="seo-slp-footer">
        <h3>Buyer's guide to Qalara sellers</h3>
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
          weaving, numerous ingenious handloom crafts, marble inlay,
          block-printing, resist dyeing, hand embroidery, basketry, hand
          carving, crochet, macrame and many more. We will also be launching
          beauty and speciality organic foods soon!
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How do I choose the right seller?</p>
        <p>
          Our wholesale suppliers are reliable, possess exquisite craftsmanship,
          believe in sustainable environment-friendly products, and specialize
          in fulfilling wholesale requirements. These suppliers have extensive
          experience in fulfilling wholesale orders across the United States,
          Europe, the United Kingdom and Australia.
          <br></br>
          <br></br>
          Once you finalize the products that you are looking for, you will be
          able to see a shortlisted list of relevant sellers. You can read their
          story and get a glimpse of their workshops, techniques and artisans in
          action on the seller page. You can also browse their videos, catalogs
          and products to get an understanding of their offerings and services.
          We can also schedule a video call between you and the sellers.
          <br></br>
          <br></br>
          Few steps that may help you in selecting an appropriate supplier for
          your wholesale buying needs:
          <br></br>
          1. Select the category you want to purchase to view shortlisted
          sellers who cater to your requirement
          <br></br>
          2. Use the filter for values, if you are looking for sellers certified
          on specific values for example fair trade, FCRF certifications,
          organic certification etc.
          <br></br>
          3. Go through the seller cards and the description to understand the
          seller's craft skills and capabilities
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>
          How do I select a product from the seller catalog?
        </p>
        <p>
          We suggest that along with the product specifications you should also
          go through the supplier’s profile, production methods, and the
          different art forms that they use. This will give you a unique
          perspective on product aesthetics. Our suppliers work with a wide
          variety of artisanal products from materials like wood, leather, iron,
          brass, glass, ceramic, marble, soapstone and Indian crafts like block
          printing, screen printing, batik, shibori, Ikat, woodwork, metal
          inlay, pottery, phulkari, and lot more. You can fine-tune your
          requirements and select the appropriate wholesale supplier for you.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>Can you customise products?</p>
        <p>
          Absolutely! Colours and sizes for most of our products can be
          customised. We can also add your label and customise designs as per
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
          ensure safe door delivery. <br></br> For custom orders, we monitor the
          production of your order and share updates through the key milestones
          of the production process. We also facilitate inline and final line
          inspections for large custom orders - which can be done remotely via
          video meetings. We conduct a final Quality Inspection once goods are
          ready and review all documentation. We can also facilitate quality
          testing as per your requirements from a certified lab at an additional
          fee. These quality standards need to be provided at the time of
          placing the order and are recommended for larger orders.<br></br>
          <br></br> Once products are ready and have been inspected, a trusted
          logistics partner associated with Qalara ships the products, either by
          Air or Ocean Freight as decided at the time of placing the order. We
          keep a constant track of your order till the order is delivered to you
          at the designated location, ensuring reliable service from order
          confirmation to delivery.
        </p>
        <br></br>
        <p style={{ fontWeight: "bold" }}>How can I become a verified buyer?</p>
        <p>
          You can sign up as a buyer on Qalara to start your buying journey.
          During the registration, we will ask you for basic information like
          organisation name, nature of business and country of operation etc.
          This helps us safeguard both your as well as our suppliers’ interests.
          We will reach out to you in case any additional information is
          required. If you are facing any issues with verification write to us
          at help@qalara.com
        </p>
        <br></br>
      </div>
    );
  }
}

export default SEOFooter;
