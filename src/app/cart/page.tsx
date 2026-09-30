"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/format";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal } = useCart();

  return (
    <>
      <Header />
      <main className="cart-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Your Cart</h1>
        
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>Your cart is empty.</p>
            <Link href="/shop" style={{ display: 'inline-block', padding: '12px 24px', background: '#005AFA', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 600px' }}>
              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                <span style={{flex: 2}}>Product</span>
                <span style={{flex: 1, textAlign: 'center'}}>Quantity</span>
                <span style={{flex: 1, textAlign: 'right'}}>Total</span>
              </div>
              
              {items.map((item) => {
                const remoteImage = item.image?.startsWith("http");
                return (
                  <div key={`${item.productId}-${item.variation}-${item.size}`} style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f5f5f5' }}>
                    <div style={{ width: '80px', height: '100px', position: 'relative', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized={remoteImage} />
                      )}
                    </div>
                  
                  <div style={{ flex: 2 }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{item.name}</h3>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>{formatPKR(item.price)}</p>
                    {item.size && <p style={{ fontSize: '12px', color: '#888' }}>Size: {item.size}</p>}
                    {item.variation && <p style={{ fontSize: '12px', color: '#888' }}>{item.variation}</p>}
                    <button 
                      onClick={() => removeItem(item.productId, item.variation, item.size)}
                      style={{ fontSize: '12px', color: '#ff4444', background: 'none', border: 'none', padding: 0, marginTop: '8px', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.variation, item.size, item.quantity - 1)}
                      style={{ width: '28px', height: '28px', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.variation, item.size, item.quantity + 1)}
                      style={{ width: '28px', height: '28px', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>
                  
                  <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
                    {formatPKR(item.price * item.quantity)}
                  </div>
                </div>
                );
              })}
            </div>
            
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ background: '#f9f9f9', padding: '24px', borderRadius: '8px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Order Summary</h2>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#666' }}>Subtotal</span>
                  <span>{formatPKR(cartTotal)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#666' }}>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '18px', fontWeight: 'bold' }}>
                  <span>Total</span>
                  <span>{formatPKR(cartTotal)}</span>
                </div>
                
                <Link href="/checkout" style={{ display: 'block', width: '100%', padding: '16px', background: '#005AFA', color: '#fff', textAlign: 'center', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
