import { API_BASE_URL } from "../utils/constants";
import authService from "./authService";

const authHeaders = () => ({
  Authorization: `Token ${authService.getToken()}`,
  "Content-Type": "application/json",
});

export async function createSale(payload) {
  const res = await fetch(`${API_BASE_URL}/api/sales/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.error || "Sale failed");
  }

  return data;
}

export async function fetchSalesHistory() {
  const res = await fetch(`${API_BASE_URL}/api/sales/history/`, {
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed loading sales history");
  }

  return data;
}