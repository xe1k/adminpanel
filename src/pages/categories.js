import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import axios from 'axios';
import { withSwal } from "react-sweetalert2";
import Swal from 'sweetalert2'

 function Categories({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  useEffect(() => {
    fetchCategory();
  }, [])
  function fetchCategory() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { name, parentCategory }
    if (editedCategory) {
      data._id=editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null)
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    fetchCategory();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }
function deleteCategory(category){
  Swal.fire({
    title: "¿Estás seguro?",
    text: `¿Desea eliminar "${category.name}"?`,
    icon: "warning",
    iconColor:"#F70505",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#444444",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Eliminar"
  }).then( async result => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Eliminado!",
        text: `"${category.name}" ha sido eliminada`,
        icon: "success",
        confirmButtonColor: "#d33",
      });
      const {_id} = category;
      await axios.delete('/api/categories?_id='+_id);
      fetchCategory();
    }
  });
}
  return (
    <Layout>
      <h1>Categorias</h1>
      <label>{
        editedCategory ? `Editar la categoría${editedCategory.name}` : 'Crear nueva categoría'}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder="Nombre de la categoria"
          value={name}
          onChange={ev => setName(ev.target.value)}
        />
        <select className="mb-0"
          value={parentCategory}
          onChange={ev => setParentCategory(ev.target.value)}
        >
          <option value="">No tiene subcategoría</option>
          {categories.length > 0 && categories.map(category => (
            <option value={category._id}>{category.name}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          Guardar
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Subcategoria</td>
            <td>Categoria</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 && categories.map(category => (
            <tr>
              <td>{category.name}</td>
              <td>{category?.parent?.name}</td>
              <td>
                <button
                  className="btn-primary mr-1"
                  onClick={() => editCategory(category)}>
                  Editar
                </button>
                <button 
                onClick={() => deleteCategory(category)}
                className="btn-primary"
                >
                  Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
export default withSwal (({swal}, ref) =>(
  <Categories swal={swal}/>
))