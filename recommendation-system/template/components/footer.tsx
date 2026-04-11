import Link from "next/link"
import { Instagram, Facebook, Twitter, Youtube, CreditCard, Truck, Shield } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "All Products", href: "#products" },
    { name: "Skincare", href: "#products" },
    { name: "Haircare", href: "#products" },
    { name: "Body Care", href: "#products" },
    { name: "Makeup", href: "#products" },
    { name: "Fragrance", href: "#products" },
    { name: "Gift Sets", href: "#products" },
  ],
  customer: [
    { name: "My Account", href: "#" },
    { name: "Order Tracking", href: "#" },
    { name: "Wishlist", href: "#" },
    { name: "Rewards Program", href: "#" },
    { name: "Refer a Friend", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Our Story", href: "#" },
    { name: "Sustainability", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
  ],
  help: [
    { name: "Contact Us", href: "#contact" },
    { name: "FAQs", href: "#" },
    { name: "Shipping Info", href: "#" },
    { name: "Returns & Exchanges", href: "#" },
    { name: "Size Guide", href: "#" },
  ],
}

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Trust Badges */}
      <div className="border-b border-background/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-3 text-background/80">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">Free Shipping</div>
                <div className="text-sm text-background/60">On orders over $50</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-background/80">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">30-Day Returns</div>
                <div className="text-sm text-background/60">Easy returns & exchanges</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-background/80">
              <CreditCard className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">Secure Payment</div>
                <div className="text-sm text-background/60">100% secure checkout</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif text-lg font-bold">P</span>
              </div>
              <span className="font-serif text-2xl font-bold text-background">
                Peachy Glow
              </span>
            </Link>
            <p className="mt-4 text-background/70 text-sm leading-relaxed">
              Premium beauty essentials crafted with clean, natural ingredients. 
              Elevate your self-care routine.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-background mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h4 className="font-semibold text-background mb-4">Account</h4>
            <ul className="space-y-3">
              {footerLinks.customer.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-background mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-background mb-4">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/50">
              2024 Peachy Glow. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="#" className="text-sm text-background/50 hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-background/50 hover:text-background transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-background/50 hover:text-background transition-colors">
                Cookie Policy
              </Link>
              <Link href="#" className="text-sm text-background/50 hover:text-background transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
