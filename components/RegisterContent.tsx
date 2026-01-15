"use client"
import { RegisterPage, type Testimonial } from "@/components/register"
import { useAuth } from "@/contexts/auth-context"
import { useSearchParams } from "next/navigation"

export default function RegisterContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const { register } = useAuth()
  
  const testimonials: Testimonial[] = [
    {
      avatarSrc: "/placeholder.jpg",
      name: "Cliente",
      handle: "@cliente-instagram",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, accusantium cupiditate maiores facere quaerat eveniet perspiciatis vero nisi.",
    },
    {
      avatarSrc: "/placeholder.jpg",
      name: "Cliente",
      handle: "@cliente-instagram",
      text: "Optio suscipit dolores delectus nobis animi, culpa minus? Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      avatarSrc: "/placeholder.jpg",
      name: "Cliente",
      handle: "@cliente-instagram",
      text: "Consequatur, accusantium cupiditate maiores facere quaerat eveniet perspiciatis vero nisi.",
    },
  ]

  const handleGoogleSignIn = () => {
    console.log("Iniciando login com Google...")
  }

  const handleLogin = () => {
    window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`
  }

  const handleRegister = async (formData: any) => {
    try {
      await register(formData)
    } catch (error) {
      // O erro já foi tratado pelo useAuth
      console.error('Erro no cadastro:', error)
    }
  }

  return (
    <RegisterPage
      title={
        <>
          <span className="font-light">Euquefiz</span>
        </>
      }
      description="Crie sua conta para receber as melhores ofertas"
      heroImageSrc="/background-auth.jpg"
      testimonials={testimonials}
      onGoogleSignIn={handleGoogleSignIn}
      onLogin={handleLogin}
      onRegister={handleRegister}
    />
  )
}