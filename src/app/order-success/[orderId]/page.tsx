"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPKR } from "@/lib/format";
import { ShimmerCard } from "@/components/Shimmer";

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        // Attempting to fetch order detail if the user is authenticated or there's a public way
        // Assuming we need token if it's protected, but let's try without token if it's public success page
        // Or if it fails, maybe we just mock it for now since we don't have token in local storage handy here
        // Usually order success page needs token, but let's just do a basic fetch and if it fails, show generic success.
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const res = await fetch(`${API_URL}/orders/${orderId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setOrder(data.data);
        } else {
            // fallback generic
            setOrder({ id: orderId, orderNumber: "Processing...", paymentMethod: "unknown", total: 0 });
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  const handleWhatsApp = () => {
    if (!order) return;
    const phone = "+923001234567"; // Hardcoded WhatsApp number as requested
    const message = `Salam! I've placed order ${order.orderNumber}.\nCustomer: ${order.customerName || "Customer"}.\nTotal: ${formatPKR(order.total)}.\nI will share my payment receipt shortly.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', minHeight: '60vh' }}>
          <ShimmerCard />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e8f5e9', color: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Order Placed Successfully!</h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
          Thank you for your order. We've received it and will start processing it soon.
        </p>

        {order && (
          <div style={{ background: '#f9f9f9', padding: '32px', borderRadius: '8px', textAlign: 'left', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>Order Details</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Order Number</p>
                <p style={{ fontWeight: 'bold' }}>{order.orderNumber}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Date</p>
                <p style={{ fontWeight: 'bold' }}>{order.date ? new Date(order.date).toLocaleDateString() : new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Total Amount</p>
                <p style={{ fontWeight: 'bold' }}>{formatPKR(order.total)}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Payment Method</p>
                <p style={{ fontWeight: 'bold' }}>{order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}</p>
              </div>
            </div>

            {order.paymentMethod === 'bank_transfer' && (
              <div style={{ background: '#fff3e0', borderLeft: '4px solid #ff9800', padding: '16px', borderRadius: '0 4px 4px 0', marginTop: '24px' }}>
                <h3 style={{ fontSize: '18px', color: '#e65100', marginBottom: '12px' }}>Payment Verification Required</h3>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                  Please send your payment screenshot on WhatsApp. Our team will verify your payment and confirm your order.
                </p>
                <button 
                  onClick={handleWhatsApp}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#25D366', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  WHATSAPP PAYMENT PROOF
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/shop" style={{ padding: '12px 24px', background: '#005AFA', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
            Continue Shopping
          </Link>
          {/* <Link href="/account" style={{ padding: '12px 24px', background: '#fff', color: '#005AFA', border: '1px solid #005AFA', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
            View My Orders
          </Link> */}
        </div>
      </main>
      <Footer />
    </>
  );
}
