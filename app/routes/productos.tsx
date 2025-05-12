import { useEffect, useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  peso_unidad: string;
  almacenes: {
    id: number;
    nombre: string;
    stock: number;
    ubicaciones: string[];
  }[];
};

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [almacenFiltro, setAlmacenFiltro] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los productos");
        return res.json();
      })
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message));
  }, []);

  const almacenesUnicos = Array.from(
    new Set(productos.flatMap((p) => p.almacenes.map((a) => a.nombre)))
  );

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (almacenFiltro === "" || producto.almacenes.some((a) => a.nombre === almacenFiltro))
  );

  return (
    <div className="p-4 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="border rounded px-3 py-2 w-full md:w-1/2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2 w-full md:w-1/3"
          value={almacenFiltro}
          onChange={(e) => setAlmacenFiltro(e.target.value)}
        >
          <option value="">Todos los almacenes</option>
          {almacenesUnicos.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <ul className="border rounded p-4 shadow max-h-[500px] overflow-y-auto">
            {productosFiltrados.map((producto) => (
              <li
                key={producto.id}
                className={`p-2 cursor-pointer hover:bg-blue-100 rounded ${
                  productoSeleccionado?.id === producto.id ? "bg-blue-200" : ""
                }`}
                onClick={() => setProductoSeleccionado(producto)}
              >
                {producto.nombre}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-2/3">
          {productoSeleccionado ? (
            <div className="border rounded p-4 shadow bg-white">
              <h2 className="text-xl font-semibold mb-2">
                {productoSeleccionado.nombre}
              </h2>
              <p className="mb-4 text-gray-600">
                <strong>Peso por unidad:</strong> {productoSeleccionado.peso_unidad}
              </p>
              <h3 className="font-medium mb-2">Almacenes:</h3>
              <ul className="list-disc pl-5">
                {productoSeleccionado.almacenes.map((almacen) => (
                  <li key={almacen.id} className="mb-2">
                    <p>
                      <strong>{almacen.nombre}</strong> – Stock: {almacen.stock}
                    </p>
                    {almacen.ubicaciones.length > 0 ? (
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {almacen.ubicaciones.map((u, idx) => (
                          <li key={idx}>{u}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Sin ubicaciones</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-600">Selecciona un producto para ver detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
