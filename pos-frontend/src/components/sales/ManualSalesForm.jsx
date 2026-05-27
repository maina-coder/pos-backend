export default function ManualSaleForm({
  productName,
  setProductName,
  price,
  setPrice,
  qty,
  setQty,
  handleAddItem,
}) {
  return (
    <div className="sale-form">
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Negotiated Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Quantity"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
      />

      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
}