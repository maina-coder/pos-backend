import React from "react";
import { fmt } from "../../utils/currency";

export default function ReceiptModal({
  receipt,
  onClose,
}) {
  if (!receipt) return null;

  // 🧮 Compute tax breakdown parameters safely from the existing total_amount
  const totalAmount = receipt.total_amount || 0;
  const productBasePrice = totalAmount / 1.16;
  const vatAmount = totalAmount - productBasePrice;

  // 🖨️ Bulletproof Monospace Text Dashes that can never be hidden by CSS bugs
  const TextDivider = () => (
    <div style={{
      textAlign: 'center',
      color: '#000000',
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '14px',
      letterSpacing: '1px',
      margin: '12px 0',
      userSelect: 'none'
    }}>
      - - - - - - - - - - - - - - - - - - - - - - - -
    </div>
  );

  return (
    <div className="overlay" style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(11, 19, 41, 0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px', backdropFilter: 'blur(4px)'
    }}>
      <div className="receipt-modal" style={{
        backgroundColor: '#ffffff', borderRadius: '16px',
        width: '380px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex', flexDirection: 'column'
      }}>
        
        {/* =========================================================================
           🖨️ PRINTABLE CANVAS AREA (Explicitly styled inline to bypass CSS caching)
           ========================================================================= */}
        <div className="printable-receipt-content" style={{ 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          fontFamily: '"Courier New", Courier, monospace'
        }}>
          
          <div className="receipt-header" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#0b1329' }}>
              DEVERONIG DIGITAL ELECTRONICS LTD
            </h2>
            <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0' }}>Magomano Business Complex, Room 4.1</p>
            <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0' }}>Tel: 0712 407 941</p>
            <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0' }}>Email: info@deveronig.co.ke</p>
            <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0' }}>
              Date: {receipt.timestamp ? new Date(receipt.timestamp).toLocaleString() : new Date().toLocaleString()}
            </p>
          </div>

          <div className="receipt-body" style={{ padding: '0 24px 24px 24px' }}>
            <p style={{ fontSize: '13px', margin: '6px 0', textAlign: 'center' }}>
              <strong>Receipt ID:</strong> #{receipt.id}
            </p>
            <p style={{ fontSize: '13px', margin: '6px 0', textAlign: 'center' }}>
              <strong>Cashier Staff:</strong> {receipt.cashier_name || "System Operator"}
            </p>
            
            <TextDivider />

            {/* 🧾 Line Items Layout Loop */}
            {(receipt.items || []).map((item, index) => (
              <div key={item.id || index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px' }}>
                <div style={{ textAlign: 'left', fontWeight: '600', color: '#0f172a' }}>
                  {item.name}
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                    {item.quantity} x {fmt(item.price)}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: '700', color: '#0b1329', alignSelf: 'center' }}>
                  {fmt(item.price * item.quantity)}
                </div>
              </div>
            ))}

            <TextDivider />

            {/* 💵 Totals Summary Panel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' }}>
              <span>Product Net Price:</span>
              <span style={{ fontWeight: '600' }}>{fmt(productBasePrice)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' }}>
              <span>VAT (16% Included):</span>
              <span style={{ fontWeight: '600' }}>{fmt(vatAmount)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 6px 0', fontSize: '22px', fontWeight: '800', color: '#0b1329', borderTop: '2px solid #0b1329', marginTop: '8px' }}>
              <span>GRAND TOTAL:</span>
              <span>{fmt(totalAmount)}</span>
            </div>

            {/* 🎯 Dynamic Payment Method Tracker Line Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '8px 10px', background: '#f8fafc', borderRadius: '4px', border: '1px dashed #cbd5e1', fontSize: '14px' }}>
              <strong>PAYMENT TYPE:</strong>
              <strong style={{ color: receipt.payment_mode === "M-PESA" ? "#10b981" : "#0b1329" }}>
                {receipt.payment_mode || "CASH"}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', marginTop: '10px', fontSize: '14px' }}>
              <span>Amount Received:</span>
              <span style={{ fontWeight: '600' }}>{fmt(receipt.amount_received)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '16px', fontWeight: '700', color: '#10b981' }}>
              <span>CHANGE BALANCE DUE:</span>
              <span>{fmt(receipt.balance)}</span>
            </div>

            <TextDivider />

            <div className="receipt-footer" style={{ textAlign: 'center', fontSize: '13px', color: '#475569', marginTop: '16px' }}>
              <p style={{ margin: '4px 0' }}>Thank you for purchasing from us!</p>
              <p style={{ margin: '4px 0' }}>Goods once sold are not returnable.</p>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0b1329', marginTop: '12px' }}>Powered by Deveronig POS</h4>
            </div>
          </div>
        </div>

        {/* =========================================================================
           🖥️ ACTIONS CONTROL PANEL
           ========================================================================= */}
        <div className="receipt-actions no-print" style={{ background: '#f8fafc', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #e2e8f0', borderRadius: '0 0 16px 16px' }}>
          <button 
            className="btn-complete-sale" 
            onClick={() => {
              window.focus();
              window.print();
            }}
            style={{ margin: 0, padding: '14px', fontSize: '15px' }}
          >
            🖨️ Send to Thermal Printer
          </button>
          
          <button 
            className="btn-clear-all" 
            onClick={onClose}
            style={{ margin: 0, padding: '10px', color: '#475569', borderColor: '#cbd5e1' }}
          >
            Dismiss & Close Ledger
          </button>
        </div>

      </div>
    </div>
  );
}