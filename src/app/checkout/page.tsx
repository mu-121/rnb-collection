"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/format";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    paymentMethod: "cod"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty");
      setLoading(false);
      return;
    }

    // Validate that all cart items have valid MongoDB ObjectId productIds
    // (24 hex chars). Old cart items stored before this fix may have slugs.
    const invalidItems = items.filter(
      (i) => !i.productId || !/^[a-f\d]{24}$/i.test(i.productId)
    );
    if (invalidItems.length > 0) {
      setError(
        `Your cart has outdated items (${invalidItems.map((i) => i.name).join(", ")}). ` +
        "Please clear your cart and add the products again."
      );
      setLoading(false);
      return;
    }

    try {
      const orderPayload = {
        customerName: formData.name,
        customerEmail: formData.email,
        items: items.map(i => ({
          product: i.productId,
          name: i.name,
          image: i.image,
          quantity: i.quantity,
          price: i.price,
          variation: i.variation,
          size: i.size
        })),
        subtotal: cartTotal,
        shipping: 0, // Calculate shipping here if needed
        total: cartTotal,
        paymentMethod: formData.paymentMethod,
        paymentStatus: "pending",
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }
      
      clearCart();
      router.push(`/order-success/${data.data.id}`);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <div className="hero-shell hero-shell--product">
          <Header />
        </div>
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
          <h2>Your cart is empty</h2>
          <button onClick={() => router.push("/shop")} style={{ marginTop: '20px', padding: '12px 24px', background: '#005AFA', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
            Go to Shop
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="hero-shell hero-shell--product">
        <Header />
      </div>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '32px' }}>Checkout</h1>
        
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>{error}</div>}
        
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
          
          {/* Order Summary (Right side) */}
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ background: '#f9f9f9', padding: '24px', borderRadius: '8px', position: 'sticky', top: '20px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Order Summary</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '40vh', overflowY: 'auto' }}>
                {items.map(item => (
                  <div key={`${item.productId}-${item.variation}-${item.size}`} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '60px', height: '60px', position: 'relative', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      {item.image && <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.name}</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>Qty: {item.quantity}</p>
                      {(item.size || item.variation) && (
                        <p style={{ fontSize: '12px', color: '#888' }}>{item.size} {item.variation}</p>
                      )}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {formatPKR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#666' }}>
                <span>Subtotal</span>
                <span>{formatPKR(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee', color: '#666' }}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>{formatPKR(cartTotal)}</span>
              </div>
            </div>
          </div>

          {/* Form (Left side) */}
          <div style={{ flex: '2 1 600px' }}>
            <form onSubmit={handleSubmit}>
              
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Contact Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Delivery Address</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input required type="text" name="line1" value={formData.line1} onChange={handleChange} placeholder="Address Line 1" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
                  <input type="text" name="line2" value={formData.line2} onChange={handleChange} placeholder="Apartment, suite, etc. (optional)" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }} />
                    <input required type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Province/State" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }} />
                    <input required type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" readOnly style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, background: '#f5f5f5' }} />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Payment Method</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: formData.paymentMethod === 'cod' ? '#f0f7ff' : '#fff' }}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>Cash on Delivery (COD)</div>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Pay when your order is delivered.</div>
                    </div>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: formData.paymentMethod === 'bank_transfer' ? '#f0f7ff' : '#fff' }}>
                    <input type="radio" name="paymentMethod" value="bank_transfer" checked={formData.paymentMethod === 'bank_transfer'} onChange={handleChange} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>Bank Transfer</div>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Transfer directly to our bank account. WhatsApp receipt required.</div>
                    </div>
                  </label>
                </div>
                
                {formData.paymentMethod === 'bank_transfer' && (
                  <div style={{ marginTop: '16px', padding: '16px', background: '#f9f9f9', borderLeft: '4px solid #005AFA', borderRadius: '0 4px 4px 0' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Bank Transfer Instructions:</h3>
                    <p style={{ fontSize: '14px', marginBottom: '12px' }}>1. Transfer the full order amount ({formatPKR(cartTotal)}) to the following bank account.</p>
                    
                    <div style={{ background: '#fff', padding: '12px', borderRadius: '4px', marginBottom: '12px', fontSize: '14px', border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#666' }}>Bank Name:</span>
                        <strong>Meezan Bank</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#666' }}>Account Title:</span>
                        <strong>RNB Collections</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#666' }}>Account No:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong>0123456789</strong>
                          <button type="button" onClick={() => copyToClipboard('0123456789')} style={{ background: '#eee', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Copy</button>
                        </div>
                      </div>
                    </div>
                    
                    <p style={{ fontSize: '14px', marginBottom: '8px' }}>2. Place the order.</p>
                    <p style={{ fontSize: '14px' }}>3. Send payment screenshot/proof through WhatsApp. Admin will verify the payment.</p>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#005AFA', color: '#fff', borderRadius: '4px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
