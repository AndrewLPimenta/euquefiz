import Link from "next/link"
import { Instagram, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Euquefiz
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Produtos artesanais feitos com amor, carinho e muita dedicação. Cada peça é única e especial.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>contato@euquefiz.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Instagram className="h-4 w-4 text-primary" />
                <span>@euquefiz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Euquefiz. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
