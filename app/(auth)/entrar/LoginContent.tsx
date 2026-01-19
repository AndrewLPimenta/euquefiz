"use client"
import { SignInPage, Testimonial } from "@/components/sign-in";
import { useAuth } from "@/contexts/auth-context";
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const { login } = useAuth()
  
  const testimonials: Testimonial[] = [
    {
      avatarSrc: "/placeholder.jpg",
      name: "Cliente",
      handle: "@cliente-instagram",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, accusantium cupiditate maiores facere quaerat eveniet perspiciatis vero nisi, voluptates dolorum totam vel.",
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
      text: "Consequatur, accusantium cupiditate maiores facere quaerat eveniet perspiciatis vero nisi, voluptates dolorum totam vel.",
    },
  ];

  const handleSignIn = async (email: string, password: string) => {
    try {
      await login(email, password, true) // rememberMe = true
    } catch (error) {
      // O erro já foi tratado pelo useAuth
      console.error('Erro no login:', error)
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Login com Google");
    // Implemente se necessário
  };

  const handleResetPassword = () => {
    console.log("Redirecionar para recuperação de senha");
    // Implemente se necessário
  };

  const handleCreateAccount = () => {
    window.location.href = `/register?redirect=${encodeURIComponent(redirect)}`;
  };

  return (
    <div className="">
      <SignInPage
        title={
          <>
            <span className="font-light">Euquefiz</span>
          </>
        }
        description="Continue de onde parou!"
        heroImageSrc="/background-auth.jpg"
        testimonials={testimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
}