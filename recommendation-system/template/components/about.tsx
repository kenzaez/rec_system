import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  "100% Natural & Organic Ingredients",
  "Cruelty-Free & Vegan Certified",
  "Eco-Friendly Packaging",
  "Dermatologist Tested & Approved",
  "Free from Parabens & Sulfates",
  "Sustainably Sourced",
]

export function About() {
  return (
    <section id="about" className="py-24 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=500&fit=crop"
                    alt="Natural skincare ingredients"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop"
                    alt="Spa treatment"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="pt-8 space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400&h=400&fit=crop"
                    alt="Beauty products"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=500&fit=crop"
                    alt="Natural beauty"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-6 lg:right-6 bg-card rounded-2xl p-6 shadow-xl border border-border">
              <div className="font-serif text-4xl font-bold text-primary">10+</div>
              <div className="text-sm text-muted-foreground mt-1">Years of Excellence</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              About Us
            </span>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Where Nature Meets Luxury
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              At Peachy Glow, we believe true beauty comes from within. Founded in 2014, 
              we&apos;ve dedicated ourselves to creating premium skincare and beauty treatments 
              that harness the power of nature&apos;s finest ingredients.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Our expert team of aestheticians and formulators work tirelessly to develop 
              products and treatments that deliver real results while being kind to your 
              skin and the planet.
            </p>

            {/* Features */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Learn Our Story
              </Button>
              <Button size="lg" variant="outline" className="border-foreground/20 hover:bg-secondary">
                Meet the Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
