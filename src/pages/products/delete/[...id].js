import Layout from "@/pages/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push("/products");
  }
  async function deleteProduct(){
   await axios.delete('/api/products?id='+id);
   goBack();
  }
  return (
    <Layout>
      <h1 className="text-center">
        ¿Estás seguro de que quieres eliminar &nbsp;"{productInfo?.title}" ?
      </h1>
      <h2 className="text-center text-primary font-semibold text-lg mb-4">Al eliminar el producto, este se eliminará de forma permanente de la base de datos y no podrá recuperar su información.</h2>
      <div className="flex gap-2 justify-center ">
        <button className="btn-secondary" onClick={deleteProduct}>Eliminar</button>
        <button className="btn-primary" onClick={goBack}>
          Cancelar
        </button>
      </div>
    </Layout>
  );
}
