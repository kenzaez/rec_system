import { Sparkles, Leaf, Heart, Droplets, Sun, Flower2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    icon: Sparkles,
    title: "Facial Treatments",
    description: "Rejuvenating facials tailored to your skin type for a radiant, youthful complexion.",
    price: "From $85",
  },
  {
    icon: Leaf,
    title: "Organic Skincare",
    description: "Pure, plant-based treatments using only the finest organic ingredients.",
    price: "From $95",
  },
  {
    icon: Heart,
    title: "Body Massage",
    description: "Relaxing massages to release tension and restore your body's natural balance.",
    price: "From $75",
  },
  {
    icon: Droplets,
    title: "Hydration Therapy",
    description: "Deep hydration treatments to plump and nourish dehydrated skin.",
    price: "From $110",
  },
  {
    icon: Sun,
    title: "Anti-Aging",
    description: "Advanced treatments to reduce fine lines and restore youthful elasticity.",
    price: "From $150",
  },
  {
    icon: Flower2,
    title: "Aromatherapy",
    description: "Essential oil treatments for mind-body wellness and deep relaxation.",
    price: "From $65",
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Treatments Crafted for Your Glow
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Experience our signature beauty treatments designed to enhance your natural beauty 
            and leave you feeling refreshed and rejuvenated.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card 
              key={service.title}
              className="group bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-card-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">{service.price}</span>
                  <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                    Learn More →
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
