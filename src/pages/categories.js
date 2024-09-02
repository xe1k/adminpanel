import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Swal from "sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategory();
  }, []);
  function fetchCategory() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { 
      name, 
      parentCategory: parentCategory, 
      properties:properties.map(p => ({
        name:p.name,
        values:p.values.split(','),
      })) ,
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategory();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    const categoryProperties = Array.isArray(category.properties)
    ? category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    : [];

  setProperties(categoryProperties);
  }
  function deleteCategory(category) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Desea eliminar "${category.name}"?`,
      icon: "warning",
      iconColor: "#F70505",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#444444",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado!",
          text: `"${category.name}" ha sido eliminada`,
          icon: "success",
          confirmButtonColor: "#d33",
        });
        const { _id } = category;
        await axios.delete("/api/categories?_id=" + _id);
        fetchCategory();
      }
    });
  }
  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Categorias</h1>
      <label>
        {editedCategory
          ? `Editar la categoría${editedCategory.name}`
          : "Crear nueva categoría"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Nombre de la categoria"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value="">No tiene subcategoría</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Propiedades</label>
          <button
            type="button"
            className="btn-third mb-2"
            onClick={addProperty}
          >
            Añadir nueva categoria
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2" key={index}>
                <input
                  className="mb-0"
                  type="text"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  placeholder="name"
                ></input>
                <input
                  className="mb-0"
                  type="text"
                  value={property.values}
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  placeholder="values"
                />
                <button
                  className="btn-secondary"
                  onClick={() => removeProperty(index)}
                  type="button"
                >
                  Eliminar
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          <button type="submit" className="btn-primary">
            Guardar
          </button>
          {editedCategory && (
            <button className="btn-secondary"
            onClick={()=> {
              setEditedCategory(null);
              setName("");
              setParentCategory("");
              setProperties([]);
            }}
            type="button"
            >Cancelar</button>
          )}
        </div>
      </form>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Subcategoria</td>
              <td>Categoria</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      className="btn-primary mr-1"
                      onClick={() => editCategory(category)}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-secondary"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
