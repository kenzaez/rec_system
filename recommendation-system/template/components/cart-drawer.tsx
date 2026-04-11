"use client"

import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

export function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart()

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-semibold text-card-foreground">
              Your Cart ({totalItems})
            </h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close cart</span>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-card-foreground mb-2">
                Your cart is empty
              </h3>
              <p className="text-muted-foreground mb-6">
                Add some beautiful products to get started!
              </p>
              <Button 
                onClick={() => setIsCartOpen(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-4 bg-secondary/50 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-card-foreground truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-foreground">
                        ${item.price}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span className="sr-only">Increase quantity</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Remove item</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-sm text-muted-foreground">Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between mb-6 pt-4 border-t border-border">
              <span className="font-serif text-lg font-semibold text-foreground">Total</span>
              <span className="font-serif text-xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base">
              Proceed to Checkout
            </Button>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="w-full mt-3 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
