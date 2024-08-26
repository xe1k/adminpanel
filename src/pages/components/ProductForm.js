import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    if(_id){
      
      await axios.put("/api/products", {...data,_id});
    }else{
      
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }
  return (
    <form onSubmit={saveProduct}>
      <label htmlFor="">Nombre del producto</label>
      <input
        type="text"
        placeholder="nombre del producto"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label htmlFor="">Descripción</label>
      <textarea
        placeholder="descripción"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label htmlFor="">Precio</label>
      <input
        type="number"
        placeholder="precio"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
}
