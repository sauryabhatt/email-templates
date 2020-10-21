import {Layout} from "../components/common/Layout" 
import HomePage from "../components/HomePage/Home"
import {fetchHeader} from "../utils/headerApiHandler"
export default function Home({response}) {
  const meta = {
    title:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
    description:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
    keywords:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Digitally. Reliably. Affordably. Responsibly."
  }
  
  return (
    <Layout meta={meta} navigationItem={response}>
      <HomePage/>
    </Layout>  
  )

}

//  