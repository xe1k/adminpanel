import React from 'react'
import Layout from '../components/Layout'

export default function NewProduct() {
  return (
    <Layout>
      <h1>Nuevo producto</h1>
      <label htmlFor="">Nombre del producto</label>
      <input type="text" placeholder='nombre del producto'/>
      <label htmlFor="">Descripción</label>
      <textarea placeholder='descripción'></textarea>
      <label htmlFor="">Precio</label>
      <input type="number" placeholder='precio' />
      <button className="btn-primary">Guardar</button>
    </Layout>
  )
}
