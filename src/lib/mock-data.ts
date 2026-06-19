// Shared domain types (consumed by the Firestore service layer in lib/firestore/)
// plus a couple of illustrative datasets not yet backed by Firestore.

export type InvoiceStatus = "paid" | "pending" | "overdue";

export type Invoice = {
  id: string;
  firm: string;
  contact: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  initials: string;
};

export type InventoryCategory = "Thread" | "Fabric" | "Backing" | "Accessory" | "Design";

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: InventoryCategory;
  unit: string;
  quantity: number;
  reorderLevel: number;
  unitCost: number;
  supplier: string;
};

export type StockMovementType = "in" | "out" | "adjustment";

export type StockMovement = {
  id: string;
  itemName: string;
  type: StockMovementType;
  quantity: number;
  unit: string;
  date: string;
  reference: string;
  performedBy: string;
  notes?: string;
};

export type ClientType = "Firm" | "Individual";

export type Client = {
  id: string;
  name: string;
  type: ClientType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  totalBilled: number;
  outstanding: number;
  initials: string;
};

export type Order = {
  id: string;
  client: string;
  design: string;
  quantity: number;
  status: "in-production" | "queued" | "completed" | "delayed";
  eta: string;
  notes?: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
};

// Illustrative only — not yet wired to a Firestore collection.
export const recentActivity: ActivityItem[] = [
  { id: "AC-1", title: "Invoice INV-2044 paid", description: "Bloom Bridal Studio settled ₹32,100", time: "2h ago" },
  { id: "AC-2", title: "Stock alert", description: "Gold Metallic Thread fell below reorder level", time: "4h ago" },
  { id: "AC-3", title: "New order placed", description: "Lotus School Uniforms — 500 units", time: "6h ago" },
  { id: "AC-4", title: "Invoice INV-2043 overdue", description: "Sunrise Uniforms Co. — 11 days past due", time: "1d ago" },
];

// Illustrative only — real revenue trend requires aggregation infra not yet built.
export const revenueOverview = [
  { month: "Jan", revenue: 182000, expenses: 96000 },
  { month: "Feb", revenue: 165000, expenses: 89000 },
  { month: "Mar", revenue: 201000, expenses: 104000 },
  { month: "Apr", revenue: 194000, expenses: 99000 },
  { month: "May", revenue: 228000, expenses: 112000 },
  { month: "Jun", revenue: 246500, expenses: 121000 },
];
