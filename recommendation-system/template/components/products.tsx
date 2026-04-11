"use client"

import { useState } from "react"
import { ShoppingBag, Star, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { products, categories } from "@/lib/products"

export function Products() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [favorites, setFavorites] = useState<number[]>([])
  const { addItem } = useCart()

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory)

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <section id="products" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Shop Our Products
          </span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Bestselling Beauty Essentials
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Premium, clean beauty products loved by thousands. Find your new favorites.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id}
              className="group bg-card border-border overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge */}
                {product.badge && (
                  <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${
                    product.badge === "Sale" 
                      ? "bg-destructive text-card" 
                      : product.badge === "New"
                      ? "bg-foreground text-card"
                      : "bg-primary text-primary-foreground"
                  }`}>
                    {product.badge}
                  </span>
                )}
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        favorites.includes(product.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? "fill-current" : ""}`} />
                      <span className="sr-only">Add to wishlist</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-card text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all">
                      <Eye className="w-5 h-5" />
                      <span className="sr-only">Quick view</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-medium text-foreground">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>
                
                {/* Title & Category */}
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <h3 className="font-serif text-base font-semibold text-card-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                  {product.name}
                </h3>
                
                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => addItem(product)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="sr-only">Add to cart</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-foreground/20 hover:bg-secondary px-8">
            Load More Products
          </Button>
        </div>
      </div>
    </section>
  )
}
