/* eslint-disable no-underscore-dangle */
// @flow

const apiUrl = 'http://localhost:3000/api'

type SuccessResponse = {|
  status: number,
  body: mixed,
|}

type ErrorResponse = {|
  status: number,
  body: string,
|}

function checkStatus(response: Response): Response {
  if (response.status >= 200 && response.status < 300 && response.ok) {
    return response
  }
  throw response
}

function mapToSuccess(response: mixed): SuccessResponse {
  return {
    status: 200,
    body: response,
  }
}

function mapToError(response: Response): ErrorResponse {
  return {
    status: response.status,
    body: response.statusText,
  }
}

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

class HttpClient {
  _fetchFromApi = (path: string, options: RequestOptions) => {
    return fetch(`${apiUrl}${path}`, {
      ...options,
    })
      .then(checkStatus)
      .then(response => response.json())
      .then(mapToSuccess)
      .catch(response => {
        const errorResponse = mapToError(response)
        return errorResponse
      })
  }

  get = (url: string) => {
    return this._fetchFromApi(url, { method: 'get' })
  }

  post = (url: string, { headers, body }: { headers?: HeadersInit, body: mixed }) => {
    return this._fetchFromApi(url, {
      method: 'post',
      headers: { ...headers, ...defaultHeaders },
      body: body ? JSON.stringify(body) : null,
    })
  }

  delete = (url: string, { headers, body }: { headers?: HeadersInit, body: mixed }) => {
    return this._fetchFromApi(url, {
      method: 'delete',
      headers: { ...headers, ...defaultHeaders },
      body: body ? JSON.stringify(body) : null,
    })
  }

  put = (url: string, { headers, body }: { headers?: HeadersInit, body: mixed }) => {
    return this._fetchFromApi(url, {
      method: 'put',
      headers: { ...headers, ...defaultHeaders },
      body: body ? JSON.stringify(body) : null,
    })
  }
}

export const httpClient = new HttpClient()
