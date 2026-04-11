"use client"

import { useState } from "react"
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    content: "The Peach Glow Serum is my holy grail! My skin has never looked so radiant. I&apos;ve tried countless serums but this one truly delivers results.",
    author: "Sarah Mitchell",
    role: "Verified Buyer",
    product: "Peach Glow Vitamin C Serum",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    content: "Finally found a brand that uses clean ingredients AND actually works. The whole collection smells amazing and my skin has improved so much!",
    author: "Emily Chen",
    role: "Verified Buyer",
    product: "Full Skincare Set",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    content: "I love that everything is cruelty-free and comes in sustainable packaging. The Rose Body Butter is incredibly moisturizing without feeling greasy.",
    author: "Jessica Park",
    role: "Verified Buyer",
    product: "Rose Petal Body Butter",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    content: "Fast shipping, beautiful packaging, and amazing products. The Retinol Night Cream has visibly reduced my fine lines. So impressed!",
    author: "Amanda Rodriguez",
    role: "Verified Buyer",
    product: "Retinol Night Cream",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section className="py-24 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Customer Reviews
          </span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Loved by Thousands
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See why over 15,000+ customers trust Peachy Glow for their beauty routine.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card rounded-3xl p-8 md:p-12 border border-border shadow-lg">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20" />
            
            <div className="text-center">
              {/* Rating */}
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>
              
              {/* Product */}
              <span className="text-sm font-medium text-primary">{current.product}</span>

              {/* Quote */}
              <p className="mt-4 text-xl md:text-2xl text-foreground leading-relaxed font-light italic">
                {`"${current.content.replace(/&apos;/g, "'")}"`}
              </p>

              {/* Author */}
              <div className="mt-8 flex flex-col items-center">
                <img
                  src={current.image}
                  alt={current.author}
                  className="w-16 h-16 rounded-full object-cover border-4 border-primary/20"
                />
                <div className="mt-4">
                  <div className="font-serif text-lg font-semibold text-foreground">
                    {current.author}
                  </div>
                  <div className="text-sm text-muted-foreground">{current.role}</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "bg-primary/30 hover:bg-primary/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
