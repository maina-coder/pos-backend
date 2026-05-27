import { useMemo, useState } from "react";

export default function useSale() {
  const [saleItems, setSaleItems] = useState([]);

  const addItem = (item) => {
    setSaleItems((prev) => [...prev, item]);
  };

  const removeItem = (index) => {
    setSaleItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearSale = () => {
    setSaleItems([]);
  };

  const total = useMemo(() => {
    return saleItems.reduce(
      (sum, item) =>
        sum + item.negotiated_price * item.quantity,
      0
    );
  }, [saleItems]);

  return {
    saleItems,
    addItem,
    removeItem,
    clearSale,
    total,
  };
}