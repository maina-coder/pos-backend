import { useState } from "react";
import Topbar from "./layout/Topbar";
import ManualSaleForm from "./sales/ManualSalesForm";
import SaleItemsTable from "./sales/SalesItemTable";
import PaymentPanel from "./sales/PaymentPanel";
import ReceiptModal from "./sales/ReceiptModal";

export default function PosApp({
  user,
  logout,
  productName,
  setProductName,
  price,
  setPrice,
  qty,
  setQty,
  addItem,
  saleItems = [],
  removeItem,
  total = 0,
  cashReceived,
  setCashReceived,
  clearSale,
  createSale,
  paymentMode,
  setPaymentMode,
}) {
  const [receipt, setReceipt] = useState(null);

  const currentTotal = Number(total) || 0;
  const currentCash = Number(cashReceived) || 0;
  const balance = currentCash - currentTotal;

  function handleAddItem() {
    if (!productName || !price) return;

    addItem({
      product_name: productName,
      negotiated_price: Number(price),
      quantity: Number(qty),
    });

    setProductName("");
    setPrice("");
    setQty(1);
  }

  async function handleCompleteSale() {
    if (!saleItems || saleItems.length === 0) {
      alert("Transaction checkout queue is completely empty.");
      return;
    }

    try {
      const formattedItems = saleItems.map(item => ({
        name: item.product_name,
        price: Number(item.negotiated_price),
        quantity: Number(item.quantity)
      }));

      const payload = {
        amount_received: currentCash,
        items: formattedItems
      };

      const data = await createSale(payload);
      
      // 🎯 THE payload injection: Attach the active payment type choice to the receipt 
      // object client-side so your thermal view can render it cleanly!
      const receiptWithPaymentData = {
        ...data,
        payment_mode: paymentMode,
        amount_received: currentCash,
        balance: balance
      };

      setReceipt(receiptWithPaymentData);
    } catch (err) {
      alert(err.message || "Failed to commit transaction to Django ledger.");
    }
  }

  return (
    <div className="pos-app">
      <Topbar user={user} onLogout={logout} />

      <main className="pos-main">
        {/* 🛒 LEFT INPUT WORKSPACE */}
        <section className="pos-left">
          <div className="pos-card">
            <div className="pos-card-header">
              <h2 className="pos-card-title">Product Entry Terminal</h2>
            </div>
            <div className="pos-card-body">
              <ManualSaleForm
                productName={productName}
                setProductName={setProductName}
                price={price}
                setPrice={setPrice}
                qty={qty}
                setQty={setQty}
                handleAddItem={handleAddItem}
              />
            </div>
          </div>

          <div className="pos-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="pos-card-header">
              <h2 className="pos-card-title">Active Transaction Basket</h2>
            </div>
            <div className="items-table-wrapper">
              <SaleItemsTable saleItems={saleItems} removeItem={removeItem} />
            </div>
          </div>
        </section>

        {/* 💵 RIGHT FINANCIAL CHECKOUT SIDEBAR PANEL */}
        <aside className="pos-right">
          {/* We wrap your existing PaymentPanel to add a clean visual toggle layout */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Select Payment Protocol</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                type="button"
                onClick={() => { setPaymentMode("CASH"); setCashReceived(""); }}
                style={{
                  padding: "12px", border: "1.5px solid", borderRadius: "8px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s",
                  backgroundColor: paymentMode === "CASH" ? "#0b1329" : "#ffffff",
                  color: paymentMode === "CASH" ? "#ffffff" : "#475569",
                  borderColor: paymentMode === "CASH" ? "#0b1329" : "#cbd5e1"
                }}
              >
                💵 CASH
              </button>
              <button
                type="button"
                onClick={() => { setPaymentMode("M-PESA"); setCashReceived(currentTotal); }} // Auto-fills exact match for rapid processing
                style={{
                  padding: "12px", border: "1.5px solid", borderRadius: "8px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s",
                  backgroundColor: paymentMode === "M-PESA" ? "#10b981" : "#ffffff",
                  color: paymentMode === "M-PESA" ? "#ffffff" : "#475569",
                  borderColor: paymentMode === "M-PESA" ? "#10b981" : "#cbd5e1"
                }}
              >
                📱 M-PESA
              </button>
            </div>
          </div>

          <PaymentPanel
            total={currentTotal}
            cashReceived={cashReceived}
            setCashReceived={setCashReceived}
            balance={balance}
            handleCompleteSale={handleCompleteSale}
            saleItems={saleItems}
            clearSale={clearSale}
            paymentMode={paymentMode} // Pass to toggle context views inside panel if needed
          />
        </aside>
      </main>

      <ReceiptModal
        receipt={receipt}
        onClose={() => {
          setReceipt(null);
          clearSale();
        }}
      />
    </div>
  );
}