"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthService } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  requiredPermission?: string
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  redirectTo = '/login',
  requiredPermission
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = AuthService.isAuthenticated()
      
      // Se requer autenticação mas usuário não está autenticado
      if (requireAuth && !isAuthenticated) {
        // Salvar a URL atual para redirecionamento pós-login
        sessionStorage.setItem('redirectAfterLogin', pathname)
        router.push(`${redirectTo}?from=${encodeURIComponent(pathname)}`)
        return
      }

      // Se não requer autenticação mas usuário está autenticado (ex: página de login)
      if (!requireAuth && isAuthenticated) {
        // Redirecionar para home ou dashboard
        const redirect = sessionStorage.getItem('redirectAfterLogin') || '/'
        sessionStorage.removeItem('redirectAfterLogin')
        router.push(redirect)
        return
      }

      // Verificar permissão específica
      if (requiredPermission && !AuthService.hasPermission(requiredPermission)) {
        router.push('/unauthorized')
        return
      }
    }

    checkAuth()
  }, [router, pathname, requireAuth, redirectTo, requiredPermission])

  // Se não há restrições ou todas foram atendidas
  if (!requireAuth || AuthService.isAuthenticated()) {
    return <>{children}</>
  }

  // Mostrar loader enquanto verifica
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}