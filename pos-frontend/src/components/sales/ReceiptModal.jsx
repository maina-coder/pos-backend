import React from "react";
import { fmt } from "../../utils/currency";

export default function ReceiptModal({
  receipt,
  onClose,
}) {
  if (!receipt) return null;

  return (
    <div className="overlay">
      <div className="receipt-modal">
        
        {/* =========================================================================
           🖨️ PRINTABLE CANVAS AREA
           ========================================================================= */}
        <div className="printable-receipt-content">
          <div className="receipt-header">
            <h2 className="receipt-brand-name">DEVERONIG DIGITAL ELECTRONICS LTD</h2>
            <p className="receipt-meta">Magomano Business Complex, Room 4.1</p>
            <p className="receipt-meta">Tel: 0712 407 941</p>
            <p className="receipt-meta">Email: info@deveronig.co.ke</p>
            <p className="receipt-meta">
              Date: {receipt.timestamp ? new Date(receipt.timestamp).toLocaleString() : new Date().toLocaleString()}
            </p>
          </div>

          <div className="receipt-body">
            <p style={{ fontSize: '12px', margin: '2px 0' }}>
              <strong>Receipt ID:</strong> #{receipt.id}
            </p>
            <p style={{ fontSize: '12px', margin: '2px 0' }}>
              <strong>Cashier Staff:</strong> {receipt.cashier_name || "System Operator"}
            </p>
            
            <hr className="receipt-dashes" />

            {/* 🧾 Line Items Layout Loop */}
            {(receipt.items || []).map((item, index) => (
              <div className="receipt-item-row" key={item.id || index}>
                <div className="receipt-item-name">
                  {item.name}
                  <div className="receipt-item-detail">
                    {item.quantity} x {fmt(item.price)}
                  </div>
                </div>
                <div className="receipt-item-subtotal">
                  {fmt(item.price * item.quantity)}
                </div>
              </div>
            ))}

            <hr className="receipt-dashes" />

            {/* 💵 Totals Summary Panel */}
            <div className="receipt-sum-row">
              <span>Subtotal Value:</span>
              <span>{fmt(receipt.total_amount)}</span>
            </div>
            
            <div className="receipt-sum-row receipt-sum-row--total">
              <span>GRAND TOTAL:</span>
              <span>{fmt(receipt.total_amount)}</span>
            </div>

            {/* 🎯 NEW RENDER: Dynamic Payment Method Tracker Line Row */}
            <div className="receipt-sum-row" style={{ marginTop: '8px', padding: '4px 6px', background: '#f8fafc', borderRadius: '4px', border: '1px dashed #cbd5e1' }}>
              <strong>PAYMENT TYPE:</strong>
              <strong style={{ color: receipt.payment_mode === "M-PESA" ? "#10b981" : "#0b1329" }}>
                {receipt.payment_mode || "CASH"}
              </strong>
            </div>

            <div className="receipt-sum-row" style={{ marginTop: '6px' }}>
              <span>Amount Received:</span>
              <span>{fmt(receipt.amount_received)}</span>
            </div>

            <div className="receipt-sum-row receipt-sum-row--change">
              <span>CHANGE BALANCE DUE:</span>
              <span>{fmt(receipt.balance)}</span>
            </div>

            <hr className="receipt-dashes" />

            <div className="receipt-footer">
              <p>Thank you for purchasing from us!</p>
              <p>Goods once sold are not returnable.</p>
              <h4 className="receipt-footer-brand">Powered by Deveronig POS</h4>
            </div>
          </div>
        </div>

        {/* =========================================================================
           🖥 decline action panel
           ========================================================================= */}
        <div className="receipt-actions no-print" style={{ background: '#f8fafc', padding: '16px', gap: '12px' }}>
          <button 
            className="btn-complete-sale" 
            onClick={() => window.print()}
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