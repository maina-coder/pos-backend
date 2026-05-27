import { fmt } from "../../utils/currency";

export default function PaymentPanel({
  total,
  cashReceived,
  setCashReceived,
  balance,
  handleCompleteSale,
  saleItems,
}) {
  return (
    <div className="payment-panel">
      <h2>Total: {fmt(total)}</h2>

      <input
        type="number"
        placeholder="Cash Received"
        value={cashReceived}
        onChange={(e) =>
          setCashReceived(e.target.value)
        }
      />

      {balance >= 0 ? (
        <div className="good-balance">
          Change Due: {fmt(balance)}
        </div>
      ) : (
        <div className="bad-balance">
          Short By: {fmt(Math.abs(balance))}
        </div>
      )}

      <button
        disabled={balance < 0 || saleItems.length === 0}
        onClick={handleCompleteSale}
      >
        Complete Sale
      </button>
    </div>
  );
}