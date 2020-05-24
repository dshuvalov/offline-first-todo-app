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
        throw errorResponse
      })
  }

  get = (url: string) => {
    return this._fetchFromApi(url, { method: 'get' })
  }

  post = (url: string, { headers, body }: { headers?: HeadersInit, body: mixed }) => {
    const defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    return this._fetchFromApi(url, {
      method: 'post',
      headers: { ...headers, ...defaultHeaders },
      body: body ? JSON.stringify(body) : null,
    })
  }
}

export const httpClient = new HttpClient()
