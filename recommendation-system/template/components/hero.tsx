import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, Leaf, Shield } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-foreground mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Spring Collection Now Live
            </div>
            
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
              Glow With
              <span className="text-primary"> Natural</span>
              <br />
              Beauty
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Shop premium skincare, haircare, and body care products made with 
              clean, natural ingredients. Because your skin deserves the best.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base">
                <Link href="#products">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground/20 hover:bg-secondary px-8 py-6 text-base">
                <Link href="#collections">
                  View Collections
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-primary" />
                <span>Free Shipping $50+</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-5 h-5 text-primary" />
                <span>100% Natural</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>Cruelty Free</span>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=533&fit=crop"
                  alt="Woman with glowing skin"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop"
                  alt="Skincare serum"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop"
                  alt="Beauty products"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=533&fit=crop"
                  alt="Skincare routine"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Floating sale badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-xl">
              <div className="text-center">
                <div className="font-serif text-3xl font-bold text-primary">20% OFF</div>
                <div className="text-sm text-muted-foreground mt-1">Use code: PEACHY20</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
