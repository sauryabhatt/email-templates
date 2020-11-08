import dynamic from 'next/dynamic';
import {Layout} from "../../../../components/common/Layout"; 
import Spinner from "../../../../components/Spinner/Spinner"
const DynamicSellerAgreementWrapper = dynamic(
    () => import('../../../../components/SellerAgreement/SellerAgreement'),
    { 
    ssr: false,
    loading: () => <Spinner/>
    }
  )

export default function SellerAgreement() {
  
  const meta = {
    title:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
    description:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
}
  
  return (
    <Layout meta={meta} privateRoute>
      <DynamicSellerAgreementWrapper/>
    </Layout>  
  )

}