import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    if (_id) {

      await axios.put("/api/products", { ...data, _id });
    } else {

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
      <label>Imagenes</label>
      <div className="mb-2">
        <button className="w-24 h-24 border flex text-center items-center justify-center text-sm text-gray-500 font-semibold gap-1 rounded-lg bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>

          Adjuntar
        </button>
        {!images?.length && (
          <div>No hay imagenes para este producto</div>
        )}
      </div>
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
