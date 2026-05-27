import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import LoginScreen from "../components/auth/LoginScreen";
import POSApp from "../components/POSApp";

export default function POSPage() {
  const { user, login, logout } = useAuth();
  const idleTimerRef = useRef(null);

  // ==========================================
  // 🛒 LIVE SALES BASKET AND TRANSACTION STATES
  // ==========================================
  const [saleItems, setSaleItems] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState(0);
  const [cashReceived, setCashReceived] = useState("");
  
  // 🎯 NEW PAYMENT MODE STATE ROUTER
  const [paymentMode, setPaymentMode] = useState("CASH");

  useEffect(() => {
    const computedTotal = saleItems.reduce(
      (sum, item) => sum + item.negotiated_price * item.quantity,
      0
    );
    setTotal(computedTotal);
  }, [saleItems]);

  // ==========================================
  // ⏱️ AUTOMATED INACTIVITY WATCHDOG TIMER
  // ==========================================
  const IDLE_TIMEOUT_SECONDS = 120; 

  const resetInactivityCountdown = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      executeForcedSessionEviction();
    }, IDLE_TIMEOUT_SECONDS * 1000);
  };

  const executeForcedSessionEviction = () => {
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
    setSaleItems([]);
    setCashReceived("");
    logout();
    alert("Terminal session expired due to inactivity.");
  };

  useEffect(() => {
    if (user) resetInactivityCountdown();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [user]);

  // ==========================================
  // ⚡ TRANSACTION ACTION HANDLERS
  // ==========================================
  function addItem(newItem) { setSaleItems((prev) => [...prev, newItem]); }
  function removeItem(indexToRemove) { setSaleItems((prev) => prev.filter((_, idx) => idx !== indexToRemove)); }
  
  function clearSale() { 
    setSaleItems([]); 
    setCashReceived("");
    setPaymentMode("CASH"); // Reset type fallback on completion
  }

  async function createSale(payload) {
    const savedToken = localStorage.getItem("pos_token");
    const res = await fetch("http://127.0.0.1:8000/api/sales/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${savedToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data.amount_received ? data.amount_received[0] : (data.detail || JSON.stringify(data));
      throw new Error(errorMsg || "Failed to finalize sale backend ledger.");
    }
    return data;
  }

  if (!user) {
    return <LoginScreen login={login} />;
  }

  return (
    <div 
      className="pos-workspace-root-wrapper"
      onMouseMove={resetInactivityCountdown}
      onClick={resetInactivityCountdown}
      onKeyDown={resetInactivityCountdown}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <POSApp
        user={user}
        logout={logout}
        productName={productName}
        setProductName={setProductName}
        price={price}
        setPrice={setPrice}
        qty={qty}
        setQty={setQty}
        addItem={addItem}
        saleItems={saleItems}
        removeItem={removeItem}
        total={total}
        cashReceived={cashReceived}
        setCashReceived={setCashReceived}
        clearSale={clearSale}
        createSale={createSale}
        paymentMode={paymentMode}       // 🎯 Pass downstream
        setPaymentMode={setPaymentMode} // 🎯 Pass downstream
      />
    </div>
  );
}