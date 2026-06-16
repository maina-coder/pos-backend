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

  return (
    <div className="overlay">
      <div className="receipt-modal">
        
        {/* =========================================================================
           🖨️ PRINTABLE CANVAS AREA
           ========================================================================= */}
        <div className="printable-receipt-content">
          
          {/* Header */}
          <div className="receipt-header">
            <h2 className="receipt-brand-name">
              DEVERONIG DIGITAL ELECTRONICS LTD
            </h2>
            <p className="receipt-meta">Magomano Business Complex, Room 4.1</p>
            <p className="receipt-meta">Tel: 0712 407 941</p>
            <p className="receipt-meta">Email: info@deveronig.co.ke</p>
            <p className="receipt-meta" style={{ fontWeight: '500', marginTop: '4px' }}>
              Date: {receipt.timestamp ? new Date(receipt.timestamp).toLocaleString() : new Date().toLocaleString()}
            </p>
          </div>

          {/* Meta Information */}
          <div className="receipt-header-meta" style={{ textAlign: 'center', width: '100%', marginTop: '6px' }}>
            <p className="receipt-meta"><strong>Receipt ID:</strong> #{receipt.id}</p>
            <p className="receipt-meta"><strong>Cashier:</strong> {receipt.cashier_name || "System Operator"}</p>
          </div>
             
          <div className="receipt-dashes">----------------------------------</div>

          {/* 🧾 Line Items */}
          <div className="receipt-items-container" style={{ width: '100%' }}>
            {(receipt.items || []).map((item, index) => (
              <div key={item.id || index} className="receipt-item-row" style={{ marginBottom: '10px' }}>
                <div className="receipt-item-name" style={{ fontWeight: '700', color: '#0f172a' }}>{item.name}</div>
                <div className="receipt-item-detail" style={{ color: '#475569', marginTop: '2px' }}>
                  {item.quantity} x {fmt(item.price)} = {fmt(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="receipt-dashes">----------------------------------</div>

          {/* 💵 Financial Totals Panel */}
          <div className="receipt-totals-container" style={{ width: '100%' }}>
            <div className="receipt-sum-row">
              Net Price: <strong>{fmt(productBasePrice)}</strong>
            </div>
            <div className="receipt-sum-row">
              VAT (16% Included): <strong>{fmt(vatAmount)}</strong>
            </div>
            
            <div className="receipt-sum-row--total" style={{ width: '100%', textAlign: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #0b1329' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>GRAND TOTAL</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0b1329', marginTop: '2px' }}>{fmt(totalAmount)}</div>
            </div>
          </div>

          {/* 🎯 Paybill Info Box */}
          <div className="receipt-paybill-box" style={{ 
            width: '100%',
            marginTop: '14px', 
            padding: '12px', 
            background: '#f8fafc', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0'
          }}>
            <div className="receipt-paybill-type" style={{ fontSize: '13px' }}>
              <span>PAYMENT TYPE: </span>
              <strong style={{ color: receipt.payment_mode === "M-PESA" ? "#10b981" : "#0b1329", fontWeight: '800' }}>
                {receipt.payment_mode || "CASH"}
              </strong>
            </div>
            <div className="receipt-paybill-details" style={{ width: '100%', borderTop: '1px dashed #e2e8f0', marginTop: '6px', paddingTop: '6px' }}>
              <p className="receipt-meta">Lipa Na M-PESA Paybill: <strong>542542</strong></p>
              <p className="receipt-meta">Account Number: <strong>124079</strong></p>
            </div>
          </div>

          {/* Cash Ledger Status Summary */}
          <div className="receipt-ledger-summary" style={{ width: '100%', marginTop: '14px' }}>
            <div className="receipt-sum-row">
              Amount Received: {fmt(receipt.amount_received)}
            </div>
            <div className="receipt-sum-row receipt-sum-row--change" style={{ color: '#10b981', fontWeight: '700', fontSize: '15px' }}>
              CHANGE DUE: {fmt(receipt.balance)}
            </div>
          </div>

          <div className="receipt-dashes">----------------------------------</div>

          {/* Footer Canvas */}
          <div className="receipt-footer">
            <p>Thank you for purchasing from us!</p>
            <p style={{ fontWeight: '500' }}>Goods once sold are not returnable.</p>
            <h4 className="receipt-footer-brand" style={{ marginTop: '8px' }}>Powered by Deveronig POS</h4>
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