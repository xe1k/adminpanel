import Layout from "./components/Layout";
import { useSession } from "next-auth/react";

export default function index() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
          </h2>
        <div className="flex text-black">
          <img src={session?.user?.image} alt="" className="h-6 w-6 mr-2 rounded-xl"/>
          <b>{session?.user?.name}</b>
        </div>
      </div>
    </Layout>
  );
}
