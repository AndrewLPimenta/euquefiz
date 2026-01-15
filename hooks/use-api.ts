"use client"

import { useEffect, useState } from 'react'
import { AuthService } from '@/lib/auth'

interface UseApiOptions<T> {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  requireAuth?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
}

export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const callApi = async ({
    endpoint,
    method = 'GET',
    body,
    requireAuth = true,
    onSuccess,
    onError
  }: UseApiOptions<T>) => {
    setLoading(true)
    setError(null)

    try {
      // Verificar autenticação se necessário
      if (requireAuth && !AuthService.isAuthenticated()) {
        throw new Error('Usuário não autenticado')
      }

      const token = AuthService.getToken()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err: any) {
      setError(err)
      onError?.(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    callApi,
    setData
  }
}