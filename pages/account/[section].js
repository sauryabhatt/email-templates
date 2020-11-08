import dynamic from 'next/dynamic';
import {Layout} from "../../components/common/Layout"; 
import Spinner from "../../components/Spinner/Spinner";
import Auth from "../../components/common/Auth"; 
import {useRouter} from "next/router";
const DynamicUserAccountWrapper = dynamic(
    () => import('../../components/UserAccount/UserAccount'),
    { 
    ssr: false,
    loading: () => <Spinner/>
    }
  )

export default function UserAccount() {
  const router = useRouter();
  const meta = {
    title:"Buy online from India for wholesale exports. Source from verified exporters | Qalara",
    description:"Looking to buy from Indian exporters? Buy wholesale, connect with hundreds of verified manufacturers and trade online!",
}
  
  return (
    <Layout meta={meta} privateRoute>
      <Auth path={`/account/${router.query.section}`}><><DynamicUserAccountWrapper/></></Auth>
    </Layout>  
  )

}