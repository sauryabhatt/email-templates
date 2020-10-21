import {Layout} from "../components/common/Layout" 
import TermsAndConditions from "../components/TermsAndConditions/TermsAndConditions"
export default function TermsOfUse() {
  
  const meta = {
    title:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
    description:"How to source from India? How to source handmade goods? How to find verified suppliers from India? How to find genuine suppliers? How to source genuine fair trade products from India?",
    keywords:"handmade, fair trade, wholesale buying, global sourcing, Indian crafts, Exporters from India, Verified manufacturers and suppliers, B2B platform"
}
  
  return (
    <Layout meta={meta}>
      <TermsAndConditions/>
    </Layout>  
  )

}