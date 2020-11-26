import {Layout} from "../components/common/Layout" 
import BecomeASeller from "../components/BecomeASeller/BecomeASeller"
export default function BecomeASellerWrapper() {
  const meta = {
    title:"Discover verified global buyers digitally | Export Handicrafts, Textiles, Furniture, Décor & more | Qalara",
    description:"Export from India, Export handicrafts, Find global buyers, Wholesale exports, Export home décor and textiles.",
    url:"/seller-subscription"
  }
  
  return (
    <Layout meta={meta} >
      <BecomeASeller/>
    </Layout>  
  )

}