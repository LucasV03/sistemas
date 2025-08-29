/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as empleados from "../empleados.js";
import type * as proveedores from "../proveedores.js";
import type * as reportes from "../reportes.js";
import type * as repuestos from "../repuestos.js";
import type * as usuarios from "../usuarios.js";
import type * as vehiculos from "../vehiculos.js";
import type * as viajes from "../viajes.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  empleados: typeof empleados;
  proveedores: typeof proveedores;
  reportes: typeof reportes;
  repuestos: typeof repuestos;
  usuarios: typeof usuarios;
  vehiculos: typeof vehiculos;
  viajes: typeof viajes;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
