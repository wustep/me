import type { NextApiResponse } from 'next'

export type ApiErrorBody = {
  error: string
  message: string
  status: number
}

export function apiError(
  status: number,
  error: string,
  message = error
): ApiErrorBody {
  return { error, message, status }
}

export function sendApiError(
  res: NextApiResponse,
  status: number,
  error: string,
  message = error
) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  return res.status(status).json(apiError(status, error, message))
}

export function apiErrorResponse(
  status: number,
  error: string,
  message = error
): Response {
  return Response.json(apiError(status, error, message), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  })
}
