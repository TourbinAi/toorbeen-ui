import { env } from "@/env.mjs"
import { useTranslations } from "next-intl"
import qs from "qs"

import type { Common, Params } from "@repo/strapi"
import { APIResponse, APIResponseCollection, APIUrlParams } from "@/types/api"
import { AppError } from "@/types/general"

type CustomFetchOptions = {
  translateKeyPrefixForErrors?: Parameters<typeof useTranslations>[0]
}

/**
 * IMPORTANT:
 * Add endpoints here that are queried from the frontend.
 * Mapping of Strapi content type UIDs to API endpoint paths.
 */
// eslint-disable-next-line no-unused-vars
export const API_ENDPOINTS: { [key in Common.UID.ContentType]?: string } = {
  "api::configuration.configuration": "/configuration",
  "plugin::users-permissions.user": "/users",
  "api::page.page": "/pages",
  "api::footer.footer": "/footer",
  "api::navbar.navbar": "/navbar",
  // Add UID<->endpoint mapping for ContentTypes here
} as const

export default class Strapi {
  public static async fetchAPI(
    path: string,
    params = {},
    requestInit?: RequestInit,
    options?: CustomFetchOptions
  ) {
    const { url, headers } = this.prepareRequest(path, params)
    const response = await fetch(url, {
      cache: "no-cache", // `next: { revalidate: 60 }`
      ...requestInit,
      headers: { ...requestInit?.headers, ...headers },
    })
    const data = await response.json()

    if (!response.ok) {
      const { error } = data
      const appError: AppError = {
        message: error?.message,
        name: error?.name,
        details: error?.details,
        status: response.status ?? error?.status,
        translateKeyPrefixForErrors: options?.translateKeyPrefixForErrors,
      }
      throw new Error(JSON.stringify(appError))
    }

    return data
  }

  /**
   * Fetches a single entity by ID or fetch single type
   */
  public static async fetchOne<
    TContentTypeUID extends Common.UID.ContentType,
    TParams extends APIUrlParams<TContentTypeUID>,
  >(
    uid: TContentTypeUID,
    entityId?: Params.Attribute.ID,
    params?: TParams,
    requestInit?: RequestInit,
    options?: CustomFetchOptions
  ): Promise<APIResponse<TContentTypeUID>> {
    const path = this.getStrapiApiPathByUId(uid)
    const url = `${path}${entityId ? "/" + entityId : ""}`
    return this.fetchAPI(url, params, requestInit, options)
  }

  /**
   * Fetches multiple entities
   */
  public static async fetchMany<
    TContentTypeUID extends Common.UID.ContentType,
    TParams extends APIUrlParams<TContentTypeUID>,
  >(
    uid: TContentTypeUID,
    params?: TParams,
    requestInit?: RequestInit,
    options?: CustomFetchOptions
  ): Promise<APIResponseCollection<TContentTypeUID>> {
    const path = this.getStrapiApiPathByUId(uid)
    return this.fetchAPI(path, params, requestInit, options)
  }

  /**
   * Fetches all entities
   */
  public static async fetchAll<
    TContentTypeUID extends Common.UID.ContentType,
    TParams extends APIUrlParams<TContentTypeUID>,
  >(
    uid: TContentTypeUID,
    params?: TParams,
    requestInit?: RequestInit
  ): Promise<APIResponseCollection<TContentTypeUID>> {
    const path = this.getStrapiApiPathByUId(uid)

    const firstPage = await this.fetchAPI(path, { ...params }, requestInit)

    if (firstPage.meta.pagination.pageCount === 1) {
      return firstPage
    }

    const otherPages = Array.from(
      { length: firstPage.meta.pagination.pageCount - 1 },
      (_, i) =>
        this.fetchAPI(
          path,
          {
            ...params,
            pagination: { page: i + 2 },
          },
          requestInit
        )
    )

    return Promise.all(otherPages).then((res) => ({
      data: [firstPage.data, ...res.map((page) => page.data)].flat(),
      meta: {
        pagination: {
          page: 1,
          pageCount: 1,
          pageSize: firstPage.meta.pagination.total,
          total: firstPage.meta.pagination.total,
        },
      },
    }))
  }

  /**
   * Fetches a single entity by slug
   */
  public static async fetchOneBySlug<
    TContentTypeUID extends Common.UID.ContentType,
    TParams extends APIUrlParams<TContentTypeUID>,
  >(
    uid: TContentTypeUID,
    slug: string | null,
    params?: TParams,
    requestInit?: RequestInit,
    options?: CustomFetchOptions
  ): Promise<APIResponse<TContentTypeUID>> {
    const slugFilter = slug && slug.length > 0 ? { $eq: slug } : { $null: true }
    const mergedParams = {
      ...params,
      sort: { publishedAt: "desc" },
      filters: { ...params?.filters, slug: slugFilter },
    }
    const path = this.getStrapiApiPathByUId(uid)
    const response: APIResponseCollection<TContentTypeUID> =
      await this.fetchAPI(path, mergedParams, requestInit, options)
    // return last published entry
    return {
      data: response.data.pop() ?? null,
      meta: {},
    }
  }

  public static prepareRequest(path: string, params: Object) {
    let url = `/api${path.startsWith("/") ? path : `/${path}`}`

    const queryString =
      typeof params === "object" ? qs.stringify(params) : params
    if (queryString != null && queryString?.length > 0) {
      url += `?${queryString}`
    }

    const strapiAPIUrl = `${env.NEXT_PUBLIC_STRAPI_URL}/api`

    return {
      url: new URL(url, strapiAPIUrl),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }
  }

  /**
   * Get Path of the API route by UID
   * @param uid - UID of the Endpoint
   * @returns API Endpoint path
   */
  private static getStrapiApiPathByUId(
    uid: keyof typeof API_ENDPOINTS
  ): string {
    const path = API_ENDPOINTS[uid]
    if (path) {
      return path
    }
    throw new Error(
      `Endpoint for UID "${uid}" not found. Extend API_ENDPOINTS in lib/api/client.ts.`
    )
  }
}
