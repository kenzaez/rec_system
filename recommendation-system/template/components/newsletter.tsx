"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Check } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative bg-primary/10 rounded-3xl p-8 md:p-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/30 rounded-full blur-3xl" />
          
          <div className="relative max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Get 15% Off Your First Order
            </h2>
            
            <p className="mt-4 text-lg text-muted-foreground">
              Subscribe to our newsletter for exclusive offers, beauty tips, and early access to new products.
            </p>

            {submitted ? (
              <div className="mt-8 flex items-center justify-center gap-3 text-primary">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-medium">Thank you! Check your email for your discount code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 bg-card border-border"
                />
                <Button 
                  type="submit" 
                  className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Subscribe
                </Button>
              </form>
            )}
            
            <p className="mt-4 text-sm text-muted-foreground">
              No spam, unsubscribe anytime. Read our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
