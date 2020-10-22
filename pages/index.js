import {Layout} from "../components/common/Layout" 
import HomePage from "../components/HomePage/Home"
export default function Home() {
  const meta = {
    title:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
    description:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
  }
  
  return (
    <Layout meta={meta} >
      <HomePage/>
    </Layout>  
  )

}

