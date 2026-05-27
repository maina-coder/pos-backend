import { fmt } from "../../utils/currency";

export default function SaleItemsTable({
  saleItems = [], // Secure array initialization fallback
  removeItem,
}) {
  return (
    <table className="items-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Subtotal</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {/* 🎯 Safety check prevents running .map on undefined or non-array payloads */}
        {(saleItems || []).length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", padding: "24px", color: "#888", fontStyle: "italic" }}>
              No items added to current sale queue.
            </td>
          </tr>
        ) : (
          saleItems.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.product_name}</td>
              <td>{item.quantity}</td>
              <td>{fmt(item.negotiated_price)}</td>
              <td>
                {fmt(
                  item.negotiated_price * item.quantity
                )}
              </td>
              <td>
                <button 
                  className="btn-remove" 
                  onClick={() => removeItem(index)}
                  style={{ cursor: "pointer" }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}