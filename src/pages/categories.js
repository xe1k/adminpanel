import React, { useState } from "react";
import Layout from "./components/Layout";
import axios from 'axios';

export default function Categories() {
  const [name, setName] = useState("");
  async function saveCategory(ev) {
    ev.preventDefault();
    await axios.post('/api/categories', {name});
    setName('');
  }
  return (
    <Layout>
      <h1>Categorias</h1>
      <label>Nombre de la nueva categoria</label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder="Nombre de la categoria"
          value={name}
          onChange={ev => setName(ev.target.value)}
        />
        <button type="submit" className="btn-primary">
          Guardar
        </button>
      </form>
    </Layout>
  );
}
