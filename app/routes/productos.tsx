import { useEffect, useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  peso_unidad: number;
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
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los productos");
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setProductoSeleccionado(data[0] || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="p-4 text-white">Cargando productos...</p>;
  if (error) return <p className="p-4 text-red-400">Error: {error}</p>;

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Menú lateral */}
      <aside className="w-1/4 p-4 overflow-y-auto border-r border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Productos</h2>
        <ul className="space-y-2">
          {productos.map((producto) => (
            <li
              key={producto.id}
              className={`p-2 rounded cursor-pointer hover:bg-gray-800 ${
                productoSeleccionado?.id === producto.id ? "bg-gray-700 font-bold" : ""
              }`}
              onClick={() => setProductoSeleccionado(producto)}
            >
              {producto.nombre}
            </li>
          ))}
        </ul>
      </aside>

      {/* Detalle del producto */}
      <main className="flex-1 p-6 overflow-y-auto">
        {productoSeleccionado ? (
          <div>
            <h1 className="text-2xl font-bold mb-2">{productoSeleccionado.nombre}</h1>
            <p className="mb-1">Precio: €{productoSeleccionado.precio}</p>
            <p className="mb-1">Peso por unidad: {productoSeleccionado.peso_unidad} kg</p>

            <h2 className="text-lg font-semibold mt-4 mb-2">Almacenes:</h2>
            <ul className="space-y-2">
              {productoSeleccionado.almacenes.map((almacen) => (
                <li key={almacen.id} className="border border-gray-700 p-2 rounded">
                  <p><strong>{almacen.nombre}</strong> - Stock: {almacen.stock}</p>
                  {almacen.ubicaciones.length > 0 && (
                    <ul className="ml-4 list-disc text-sm text-gray-300">
                      {almacen.ubicaciones.map((u, i) => (
                        <li key={i}>Ubicación: {u}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Selecciona un producto para ver los detalles.</p>
        )}
      </main>
    </div>
  );
}
