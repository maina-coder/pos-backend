import React from "react";
import { fmt } from "../../utils/currency";

export default function ReceiptModal({
  receipt,
  onClose,
}) {
  if (!receipt) return null;

  const totalAmount = receipt.total_amount || 0;
  const productBasePrice = totalAmount / 1.16;
  const vatAmount = totalAmount - productBasePrice;

  // 🖨️ Perfectly centered monospace divider
  const TextDivider = () => (
    <div style={{
      textAlign: 'center',
      color: '#cbd5e1',
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '14px',
      letterSpacing: '3px',
      margin: '16px 0',
      width: '100%'
    }}>
      ----------------------------------
    </div>
  );

  return (
    <div className="overlay" style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(11, 19, 41, 0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px', backdropFilter: 'blur(6px)'
    }}>
      <div className="receipt-modal" style={{
        backgroundColor: '#ffffff', borderRadius: '24px',
        width: '420px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(11, 19, 41, 0.35)',
        display: 'flex', flexDirection: 'column'
      }}>
        
        {/* =========================================================================
           🖨️ PRINTABLE CANVAS AREA (Center-Locked Grid Platform)
           ========================================================================= */}
        <div className="printable-receipt-content" style={{ 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', // 🎯 Forces container child items to center
          textAlign: 'center',
          fontFamily: '"Inter", -apple-system, sans-serif',
          padding: '36px 32px'
        }}>
          
          {/* Header */}
          <div style={{ width: '100%', textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: '#0b1329', lineHeight: '1.4' }}>
              DEVERONIG DIGITAL ELECTRONICS LTD
            </h2>
            <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0' }}>Magomano Business Complex, Room 4.1</p>
            <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0' }}>Tel: 0712 407 941</p>
            <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0' }}>Email: info@deveronig.co.ke</p>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 0 0', fontWeight: '500' }}>
              Date: {receipt.timestamp ? new Date(receipt.timestamp).toLocaleString() : new Date().toLocaleString()}
            </p>
          </div>

          {/* Meta Information */}
          <div style={{ width: '100%', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', margin: '4px 0', color: '#334155' }}><strong>Receipt ID:</strong> #{receipt.id}</p>
            <p style={{ fontSize: '13px', margin: '4px 0', color: '#334155' }}><strong>Cashier:</strong> {receipt.cashier_name || "System Operator"}</p>
          </div>
             
          <TextDivider />

          {/* 🧾 Line Items (Shifted to Center Align blocks instead of Left/Right splits) */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
            {(receipt.items || []).map((item, index) => (
              <div key={item.id || index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{item.name}</span>
                <span style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  {item.quantity} x {fmt(item.price)} = <strong style={{ color: '#0b1329' }}>{fmt(item.price * item.quantity)}</strong>
                </span>
              </div>
            ))}
          </div>

          <TextDivider />

          {/* 💵 Financial Totals Panel (Center-Aligned stacked metrics) */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#475569' }}>
              Net Price: <strong style={{ color: '#0f172a' }}>{fmt(productBasePrice)}</strong>
            </div>
            <div style={{ fontSize: '13px', color: '#475569' }}>
              VAT (16% Included): <strong style={{ color: '#0f172a' }}>{fmt(vatAmount)}</strong>
            </div>
            
            <div style={{ 
              width: '100%',
              textAlign: 'center',
              paddingTop: '12px', 
              marginTop: '8px',
              borderTop: '2px dashed #0b1329'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>GRAND TOTAL</div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#0b1329', marginTop: '2px' }}>{fmt(totalAmount)}</div>
            </div>
          </div>

          {/* 🎯 Paybill Info Box (Perfect Center Layout Block) */}
          <div style={{ 
            width: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '6px',
            marginTop: '16px', 
            padding: '14px', 
            background: '#f8fafc', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>PAYMENT TYPE: </span>
              <strong style={{ color: receipt.payment_mode === "M-PESA" ? "#10b981" : "#0b1329", fontWeight: '800' }}>
                {receipt.payment_mode || "CASH"}
              </strong>
            </div>
            <div style={{ width: '100%', borderTop: '1px dashed #e2e8f0', marginTop: '6px', paddingTop: '6px', fontSize: '13px', color: '#475569' }}>
              <p style={{ margin: '3px 0' }}>Lipa Na M-PESA Paybill: <strong>542542</strong></p>
              <p style={{ margin: '3px 0' }}>Account Number: <strong>124079</strong></p>
            </div>
          </div>

          {/* Cash Ledger Status Summary */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#475569' }}>
              Amount Received: <span style={{ fontWeight: '600', color: '#0f172a' }}>{fmt(receipt.amount_received)}</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>
              CHANGE DUE: <span>{fmt(receipt.balance)}</span>
            </div>
          </div>

          <TextDivider />

          {/* Footer Canvas */}
          <div style={{ width: '100%', textAlign: 'center', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
            <p style={{ margin: '4px 0' }}>Thank you for purchasing from us!</p>
            <p style={{ margin: '4px 0', fontWeight: '500' }}>Goods once sold are not returnable.</p>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0b1329', marginTop: '12px' }}>Powered by Deveronig POS</h4>
          </div>

        </div>

        {/* =========================================================================
           🖥️ ACTIONS CONTROL PANEL (Screen Interface Only)
           ========================================================================= */}
        <div className="receipt-actions no-print" style={{ background: '#f8fafc', padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #e2e8f0', borderRadius: '0 0 24px 24px' }}>
          <button 
            className="btn-complete-sale" 
            onClick={() => { window.focus(); window.print(); }}
            style={{ margin: 0, padding: '16px', fontSize: '15px', fontWeight: '700', borderRadius: '12px' }}
          >
            🖨️ Send to Thermal Printer
          </button>
          <button 
            className="btn-clear-all" 
            onClick={onClose}
            style={{ margin: 0, padding: '12px', color: '#475569', borderColor: '#cbd5e1', fontSize: '14px', borderRadius: '12px' }}
          >
            Dismiss & Close Ledger
          </button>
        </div>

      </div>
    </div>
  );
}