import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/productos.tsx"),             // para "/"
  route("productos", "routes/productos.tsx") // para "/productos"
] satisfies RouteConfig;


function route(arg0: string, arg1: string): import("@react-router/dev/routes").RouteConfigEntry {
    throw new Error("Function not implemented.");
}

