/** @format */

import { Layout } from "../../components/common/Layout";
import ProductListing from "../../components/ProductListing/ProductListing";
import Spinner from "../../components/Spinner/Spinner"
import {useRouter} from "next/router";
import NotFound from "../../components/NotFound/NotFound";

export default function ProductListingPage({data}) {
   const router = useRouter();
   const {categoryId=""} = data ||{};
   let meta; 
      switch (categoryId) {
        case "home-furnishing":
          meta={
            title:"Source quality Home furnishings & linens from verified manufacturers at affordable wholesale prices | Qalara",
            description: "Wholesale cushions, throws, quilts, bedding, bath linen, rugs & carpets"
          }
          break;
  
        case "furniture-and-storage":
          meta={
            title:"Source quality Furniture & storage from verified manufacturers at affordable wholesale prices | Qalara",
            description:"Shop bookcases, benches, chairs, desks, wine cabinets, trunks, beds & poufs in bulk"
          }
          break;
  
        case "home-decor-and-accessories":
          meta={
            title:"Source quality Home decor from verified manufacturers at affordable wholesale prices | Qalara",
            description:"Wholesale home decor, lighting, ornaments, wall art, candlesticks and garden accessories"
          }
          break;
  
        case "kitchen-and-dining":
          meta={
            title:"Source quality Kitchen & dining from verified manufacturers at affordable wholesale prices | Qalara",
            description:"Shop tableware, dinnerware, cookware, utensils, cutlery, linens & bar accessories in bulk"
          }
          break;
  
        case "fashion":
          meta={
            title:"Source quality Fashion, accessories & textiles from verified manufacturers at affordable wholesale prices | Qalara",
            description: "Wholesale textiles, apparel, scarves, stoles, bags, shawls, belts & footwear"
          }
          break;
  
        case "pets-essentials":
          meta={
            title:"Source quality Pet accessories from verified manufacturers at affordable wholesale prices | Qalara",
            description:"Shop dog beds, feeders, cat towers, collars & leashes in bulk"
          }
          break;
  
        case "baby-and-kids":
          meta={
            title:"Source quality Baby & kids products from verified manufacturers at affordable wholesale prices | Qalara",
            description:"Shop in bulk for organic cotton crib sets, eco-friendly toys, learning tools and & kids furniture"
          }
          break;
  
        case "jewelry":
          meta={
            title:"Source quality Jewelry from verified manufacturers at affordable wholesale prices | Qalara",
            description: "Wholesale earrings, necklaces, bracelets, rings, nose pins and cuff links"
          }
          break;
  
        default:
          meta={
            title:"Source quality All categories from verified manufacturers at affordable wholesale prices | Qalara",
            description: "Shop handcrafted and artisanal products, produced ethically at wholesale prices"
          }
      }

  if(data?.error?.status) {
    return <><NotFound /></>;
  } 

  if (router.isFallback) {
    return <Spinner />;
  }
  return (
    <Layout meta={meta}>
      <ProductListing data={data} />
    </Layout>
  );
}

export async function getStaticPaths() {
    return {
      paths: [],
      fallback: true,
    };
}
const getURL = (category) =>{
  if(category==="all-categories") {      
    return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + "/plpv2?from=0&size=30&sort_by=minimumOrderQuantity&sort_order=ASC"
}else {
    return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/plpv2?from=0&size=30&sort_by=minimumOrderQuantity&sort_order=ASC&f_categories=${category}`
}
}

export const getStaticProps = async ({ params: { categoryId = "" } = {} }) => {
  let res; 
  const error={status:false};
  try {
  const response = await fetch(getURL(categoryId), {
    method: "GET",
  });
  res = await response.json();
  } catch (error) {
    error["status"]=true;
  }
  return {
    props: {
      data: {
        slp_count: res.totalHits,
        slp_content: res.products,
        slp_facets: res.aggregates,
        slp_categories: res.fixedAggregates,
        categoryId: categoryId,
        error:error
      },
    },
  };
};
