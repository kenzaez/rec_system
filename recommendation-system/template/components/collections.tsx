import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { featuredCollections } from "@/lib/products"

export function Collections() {
  return (
    <section id="collections" className="py-24 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Shop by Collection
            </span>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Curated for You
            </h2>
          </div>
          <Link 
            href="#products" 
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            View All Collections
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {featuredCollections.map((collection, index) => (
            <Link
              key={collection.id}
              href="#products"
              className={`group relative overflow-hidden rounded-2xl ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className={`${index === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-[4/3]"} bg-secondary`}>
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-sm text-card/80">
                  {collection.productCount} Products
                </span>
                <h3 className="font-serif text-2xl font-bold text-card mt-1">
                  {collection.title}
                </h3>
                <p className="text-card/80 mt-1 mb-4">
                  {collection.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-card group-hover:gap-3 transition-all">
                  Shop Collection
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
