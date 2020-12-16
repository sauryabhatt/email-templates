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
    title:"<My Profile> | Qalara",
}
  
  return (
    <Layout meta={meta} privateRoute>
      <Auth path={`/account/${router.query.section}`}><><DynamicUserAccountWrapper/></></Auth>
    </Layout>  
  )

}