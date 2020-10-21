import {Layout} from "../components/common/Layout" 
import AboutUsWrapper from "../components/AboutUs/AboutUsWrapper"
export default function AboutUs() {
  
  const meta = {
    title:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
    description:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
    keywords:"handmade, fair trade, wholesale buying, global sourcing, Indian crafts, Exporters from India, Verified manufacturers and suppliers, B2B platform"
}
  
  return (
    <Layout meta={meta}>
      <AboutUsWrapper/>
    </Layout>  
  )

}