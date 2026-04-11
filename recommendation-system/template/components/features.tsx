import { Leaf, Recycle, Heart, Sparkles, Truck, Shield } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Clean formulas with plant-based ingredients you can trust.",
  },
  {
    icon: Recycle,
    title: "Eco-Friendly",
    description: "Sustainable packaging and zero-waste initiatives.",
  },
  {
    icon: Heart,
    title: "Cruelty-Free",
    description: "Never tested on animals. Certified by Leaping Bunny.",
  },
  {
    icon: Sparkles,
    title: "Dermatologist Tested",
    description: "Clinically proven results for all skin types.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary shipping on all orders over $50.",
  },
  {
    icon: Shield,
    title: "30-Day Returns",
    description: "Not satisfied? Full refund within 30 days.",
  },
]

export function Features() {
  return (
    <section className="py-16 border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
