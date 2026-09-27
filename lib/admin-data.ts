export type SupplierRecord = {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  notes: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductProfitSummary = {
  supplier_cost: number | null;
  delivery_cost: number | null;
  other_cost: number | null;
  profit: number | null;
  profit_margin: number | null;
};

export function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocalStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function calculateProfit({
  sellingPrice,
  supplierCost,
  deliveryCost,
  otherCost,
}: {
  sellingPrice: number;
  supplierCost?: number | null;
  deliveryCost?: number | null;
  otherCost?: number | null;
}): ProductProfitSummary {
  const validSupplierCost = typeof supplierCost === 'number' ? supplierCost : null;
  const validDeliveryCost = typeof deliveryCost === 'number' ? deliveryCost : null;
  const validOtherCost = typeof otherCost === 'number' ? otherCost : null;

  if (
    !Number.isFinite(sellingPrice) ||
    sellingPrice <= 0 ||
    validSupplierCost === null
  ) {
    return {
      supplier_cost: validSupplierCost,
      delivery_cost: validDeliveryCost,
      other_cost: validOtherCost,
      profit: null,
      profit_margin: null,
    };
  }

  const profit = sellingPrice - (validSupplierCost + (validDeliveryCost ?? 0) + (validOtherCost ?? 0));
  const profitMargin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  return {
    supplier_cost: validSupplierCost,
    delivery_cost: validDeliveryCost,
    other_cost: validOtherCost,
    profit,
    profit_margin: profitMargin,
  };
}

export function getLowStockProducts<T extends { stock?: number; low_stock_threshold?: number; name?: string }>(products: T[]) {
  return products.filter((product) => {
    const stock = Number(product.stock ?? 0);
    const threshold = Number(product.low_stock_threshold ?? 0);
    return stock <= threshold && stock >= 0;
  });
}
