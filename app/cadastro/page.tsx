// app/cadastro/page.tsx
import { Suspense } from 'react'
import RegisterContent from '@/components/RegisterContent'  // ← Importe do caminho correto
import { Loader2 } from "lucide-react"

export default function CadastroPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}