"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Beauty Lane", "Beverly Hills, CA 90210"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@peachyglow.com", "bookings@peachyglow.com"],
  },
  {
    icon: Clock,
    title: "Hours",
    details: ["Mon-Fri: 9AM - 8PM", "Sat-Sun: 10AM - 6PM"],
  },
]

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" })
    alert("Thank you for your message! We will get back to you soon.")
  }

  return (
    <section id="contact" className="py-24 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Get in Touch
          </span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Book Your Appointment
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Ready to start your glow-up journey? Contact us today to schedule your 
            personalized consultation or book a treatment.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((item) => (
                <div
                  key={item.title}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-card-foreground mb-2">
                    {item.title}
                  </h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-muted-foreground text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-secondary">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop"
                alt="Location map"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-3xl p-8 border border-border">
            <h3 className="font-serif text-2xl font-semibold text-card-foreground mb-6">
              Send Us a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-background border-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background border-input"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-background border-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your skincare goals or which service you&apos;re interested in..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-background border-input resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
