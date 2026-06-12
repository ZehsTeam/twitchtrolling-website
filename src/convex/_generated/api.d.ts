/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as discord from "../discord.js";
import type * as effects from "../effects.js";
import type * as effectsHttp from "../effectsHttp.js";
import type * as http from "../http.js";
import type * as pages from "../pages.js";
import type * as pagesHttp from "../pagesHttp.js";
import type * as rateLimiter from "../rateLimiter.js";
import type * as twitch from "../twitch.js";
import type * as utils from "../utils.js";
import type * as validateHttp from "../validateHttp.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  discord: typeof discord;
  effects: typeof effects;
  effectsHttp: typeof effectsHttp;
  http: typeof http;
  pages: typeof pages;
  pagesHttp: typeof pagesHttp;
  rateLimiter: typeof rateLimiter;
  twitch: typeof twitch;
  utils: typeof utils;
  validateHttp: typeof validateHttp;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
};
