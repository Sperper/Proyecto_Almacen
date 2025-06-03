import type { Route } from "./+types/home";
import { useEffect, useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  
}

