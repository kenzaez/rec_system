"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Search, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

const navLinks = [
  { name: "Shop All", href: "#products" },
  { name: "Skincare", href: "#products" },
  { name: "Haircare", href: "#products" },
  { name: "Body Care", href: "#products" },
  { name: "Sale", href: "#products" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems, setIsCartOpen } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      {/* Promo Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
        Free shipping on orders over $50 | Use code PEACHY20 for 20% off
      </div>
      
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif text-lg font-bold">P</span>
            </div>
            <span className="font-serif text-2xl font-bold text-foreground">
              Peachy Glow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.name === "Sale" 
                    ? "text-primary hover:text-primary/80" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              <Search className="w-5 h-5" />
              <span className="sr-only">Search products</span>
            </button>
            <button className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              <User className="w-5 h-5" />
              <span className="sr-only">Account</span>
            </button>
            <button className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              <Heart className="w-5 h-5" />
              <span className="sr-only">Wishlist</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 text-muted-foreground hover:text-foreground transition-colors relative rounded-full hover:bg-secondary"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="sr-only">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-foreground relative"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="sr-only">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium transition-colors ${
                    link.name === "Sale" 
                      ? "text-primary" 
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
