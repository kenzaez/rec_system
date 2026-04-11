import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Collections } from "@/components/collections"
import { Products } from "@/components/products"
import { Testimonials } from "@/components/testimonials"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Collections />
      <Products />
      <Testimonials />
      <Newsletter />
      <Footer />
      <CartDrawer />
    </main>
  )
}
