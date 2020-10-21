/** @format */

let sellerFacets = [
  {
    categoryOptions: [
      {
        id: "101",
        parent: "0",
        brickCode: null,
        menuOrder: "1",
        name: "Home Furnishings",
        description: "Home Furnishings",
        language: "en-GB",
        isActive: "TRUE",
        createTimeStamp: "1590149986",
        updateTimeStamp: "1590149986",
        updateBy: "pavaspathak@qalara.com",
      },
      {
        id: "201",
        parent: "0",
        brickCode: null,
        menuOrder: "2",
        name: "Furniture & Storage",
        description: "Furniture & Storage",
        language: "en-GB",
        isActive: "TRUE",
        createTimeStamp: "1590149986",
        updateTimeStamp: "1590149986",
        updateBy: "pavaspathak@qalara.com",
      },
      {
        id: "301",
        parent: "0",
        brickCode: null,
        menuOrder: "3",
        name: "Home Décor & Accessories",
        description: "Home Décor & Accessories",
        language: "en-GB",
        isActive: "TRUE",
        createTimeStamp: "1590149986",
        updateTimeStamp: "1590149986",
        updateBy: "pavaspathak@qalara.com",
      },
      {
        id: "401",
        parent: "0",
        brickCode: null,
        menuOrder: "4",
        name: "Kitchen & Dining",
        description: "Kitchen & Dining",
        language: "en-GB",
        isActive: "TRUE",
        createTimeStamp: "1590149986",
        updateTimeStamp: "1590149986",
        updateBy: "pavaspathak@qalara.com",
      },
    ],
  },

  {
    values: [
      {
        id: "ORGANIC",
        name: "Organic",
        menuOrder: 1,
      },
      {
        id: "FAIR_TRADE",
        name: "Fair Trade",
        menuOrder: 2,
      },
      {
        id: "SUSTAINABLE",
        name: "Sustainable",
        menuOrder: 3,
      },
      {
        id: "ECO_FRIENDLY",
        name: "Eco friendly",
        menuOrder: 4,
      },
      {
        id: "ARTISANAL",
        name: "Artisanal",
        menuOrder: 5,
      },
      {
        id: "RECYCLED",
        name: "Recycled",
        menuOrder: 6,
      },
      {
        id: "SPECIAL_PRODUCER_GROUPS",
        name: " Special Producer Groups",
        menuOrder: 6,
      },
    ],
  },

  {
    ordertypes: [
      {
        id: "RTS",
        name: "Ready to ship",
        definition:
          "Orders involving products which are available in seller's inventory ",
        maxProductionTime:
          "No production involved, shipment is generally shipped within 4 days",
        deliveryTimeRangeOcean:
          "Normal delivery timelines to U.S. under this mode vary from anywhere between 25-35 days from the day the order is shipped",
        deliveryTimeRangeExpress:
          "Normal delivery timelines to U.S. under this mode vary from anywhere between 5-10 days to U.S. from the day the order is shipped",
        disclaimer:
          "Please note that the above values may differ for specialized products or high quantities. Exact details for such orders will be communicated to you when the order quotation is shared",
        menuOrder: 1,
      },
      {
        id: "RTM",
        name: "Ready to make",
        definition:
          "Orders involving products for which raw material is available with seller & no customization is required",
        maxProductionTime:
          "Generally the time taken to produce and ship these products is around 3 weeks",
        deliveryTimeRangeOcean:
          "Normal delivery timelines to U.S. under this mode vary from anywhere between 25-35 days from the day the order is shipped",
        deliveryTimeRangeExpress:
          "Normal delivery timelines to U.S. under this mode vary from anywhere between 5-10 days to U.S. from the day the order is shipped",
        disclaimer:
          "Please note that the above values may differ for specialized products or high quantities. Exact details for such orders will be communicated to you when the order quotation is shared",
        menuOrder: 2,
      },
      {
        id: "MTO",
        name: "Make to order",
        definition:
          "Orders involving products that involve minor customizations, like color, size etc, to the design available with suppliers",
        maxProductionTime:
          "Generally the time taken to produce and ship these products is around 7 weeks",
        deliveryTimeRangeOcean:
          "Normal delivery timelines to U.S. under this mode vary from anywhere between 25-35 days from the day the order is shipped",
        deliveryTimeRangeExpress:
          "Normal delivery timelines to U.S. under this mode vary from anywhere between 5-10 days to U.S. from the day the order is shipped",
        disclaimer:
          "Please note that the above values may differ for specialized products or high quantities. Exact details for such orders will be communicated to you when the order quotation is shared",
        menuOrder: 3,
      },
      {
        id: "DTO",
        name: "Design to order",
        definition:
          "Orders involving products that involve designing and developing the custom products as per buyer's requirement",
        maxProductionTime:
          "Generally the time taken to produce and ship these products is around 10 weeks",
        deliveryTimeRangeOcean:
          "Normal delivery timelines to U.S. under this mode vary from anywhere between 25-35 days from the day the order is shipped",
        deliveryTimeRangeExpress:
          "Normal delivery timelines to U.S. under this mode vary from anywhere between 5-10 days to U.S. from the day the order is shipped",
        disclaimer:
          "Please note that the above values may differ for specialized products or high quantities. Exact details for such orders will be communicated to you when the order quotation is shared",
        menuOrder: 4,
      },
    ],
  },
  {
    valuecertifications: [
      {
        id: "ORGANIC",
        name: "Organic",
        menuOrder: 1,
      },
      {
        id: "FAIRTRADE",
        name: "Fairtrade",
        menuOrder: 2,
      },
      {
        id: "FSC",
        name: "FSC",
        menuOrder: 3,
      },
      {
        id: "BSCI",
        name: "BSCI",
        menuOrder: 4,
      },
      {
        id: "SEDEX",
        name: "SEDEX",
        menuOrder: 5,
      },
    ],
  },
  {
    keymethods: [
      { id: "CARVING", name: "Carving", menuOrder: 1 },
      { id: "PAPER_MACHE", name: "Paper Mache", menuOrder: 2 },
      { id: "BLOCK_PRINTING", name: "Block Printing", menuOrder: 3 },
      { id: "PAINTING", name: "Painting", menuOrder: 4 },
      { id: "METAL_INLAY", name: "Metal Inlay", menuOrder: 5 },
      { id: "POTTERY", name: "Pottery", menuOrder: 6 },
      { id: "TIE_AND_DYE", name: "Tie & Dye", menuOrder: 7 },
      { id: "ENAMEL_WORK", name: "Enamel work", menuOrder: 8 },
      { id: "METAL_CASTING", name: "Metal Casting", menuOrder: 9 },
      { id: "BASKETRY", name: "Basketry", menuOrder: 10 },
      { id: "LEATHERWORK", name: "Leatherwork", menuOrder: 11 },
      { id: "ETCHING", name: "Etching", menuOrder: 12 },
    ],
  },
];

module.exports = sellerFacets;
