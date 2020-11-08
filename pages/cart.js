import dynamic from 'next/dynamic';
import {Layout} from "../components/common/Layout"; 
import Auth from "../components/common/Auth"; 
import Spinner from "../components/Spinner/Spinner"
const DynamicCartWrapper = dynamic(
    () => import('../components/Cart/Cart'),
    { 
    ssr: false,
    loading: () => <Spinner/>
    }
  )

function Cart() {
  
  const meta = {
    title:"Buy online from India for wholesale exports. Source from verified exporters | Qalara",
    description:"Looking to buy from Indian exporters? Buy wholesale, connect with hundreds of verified manufacturers and trade online!",
}
  
  return (
      <Layout meta={meta}>
        <Auth><><DynamicCartWrapper/></></Auth>
      </Layout>
  )

}
export default Cart;