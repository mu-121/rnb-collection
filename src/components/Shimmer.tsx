import React from "react";

export function ShimmerProductGrid() {
  const items = Array.from({ length: 8 });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "24px", width: "100%", padding: "40px 0" }}>
      {items.map((_, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="shimmer-block" style={{ width: "100%", aspectRatio: "3/4", borderRadius: "8px" }}></div>
          <div className="shimmer-block" style={{ width: "80%", height: "20px", borderRadius: "4px" }}></div>
          <div className="shimmer-block" style={{ width: "50%", height: "20px", borderRadius: "4px" }}></div>
        </div>
      ))}
      <style>{`
        .shimmer-block {
          background: #f6f7f8;
          background-image: linear-gradient(
            to right,
            #f6f7f8 0%,
            #edeef1 20%,
            #f6f7f8 40%,
            #f6f7f8 100%
          );
          background-repeat: no-repeat;
          background-size: 800px 100%;
          animation: shimmer 1.5s linear infinite forwards;
        }
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
      `}</style>
    </div>
  );
}

export function ShimmerCard() {
  return (
    <div style={{ width: "100%", padding: "24px", background: "#fff", borderRadius: "8px", border: "1px solid #eee", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="shimmer-block" style={{ width: "40%", height: "24px", borderRadius: "4px" }}></div>
      <div className="shimmer-block" style={{ width: "100%", height: "60px", borderRadius: "4px" }}></div>
      <div className="shimmer-block" style={{ width: "100%", height: "60px", borderRadius: "4px" }}></div>
      <div className="shimmer-block" style={{ width: "100%", height: "60px", borderRadius: "4px" }}></div>
      
      <style>{`
        .shimmer-block {
          background: #f6f7f8;
          background-image: linear-gradient(
            to right,
            #f6f7f8 0%,
            #edeef1 20%,
            #f6f7f8 40%,
            #f6f7f8 100%
          );
          background-repeat: no-repeat;
          background-size: 800px 100%;
          animation: shimmer 1.5s linear infinite forwards;
        }
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
      `}</style>
    </div>
  );
}
