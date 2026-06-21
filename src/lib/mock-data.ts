// Shared domain types, consumed by the Firestore service layer in lib/firestore/.
// `createdAt` (epoch millis) is populated from each document's Firestore
// serverTimestamp() and used to merge/sort activity across collections.

export type InvoiceStatus = "paid" | "pending" | "overdue";

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  rate: number;
  inventoryItemId?: string;
  unit?: string;
};

export type InvoicePayment = {
  id: string;
  amount: number;
  date: string;
  method?: string;
  note?: string;
};

export type Invoice = {
  id: string;
  firm: string;
  contact: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  initials: string;
  clientId?: string;
  clientPhone?: string;
  invoiceDate?: string;
  lineItems?: InvoiceLineItem[];
  subtotal?: number;
  taxRate?: number;
  tax?: number;
  notes?: string;
  reminderDate?: string;
  payments?: InvoicePayment[];
  orderId?: string;
  orderRef?: string;
  createdAt?: number;
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
  sellingPrice?: number;
  supplier: string;
  createdAt?: number;
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
  createdAt?: number;
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
  initials: string;
  createdAt?: number;
};

// Billing totals are not stored on the client record — they're derived
// live from the billings collection via useClientBillingTotals().
export type ClientBillingTotals = {
  totalBilled: number;
  outstanding: number;
};

export type OrderStatus = "in-production" | "queued" | "completed" | "delayed";

export type Order = {
  id: string;
  client: string;
  clientId?: string;
  design: string;
  quantity: number;
  status: OrderStatus;
  eta: string;
  notes?: string;
  createdAt?: number;
};

export type PurchaseOrderStatus = "draft" | "ordered" | "received" | "cancelled";

export type PurchaseOrderLineItem = {
  description: string;
  quantity: number;
  rate: number;
  inventoryItemId?: string;
  unit?: string;
};

export type PurchaseOrder = {
  id: string;
  supplier: string;
  supplierContact?: string;
  supplierPhone?: string;
  status: PurchaseOrderStatus;
  orderDate?: string;
  expectedDate?: string;
  receivedDate?: string;
  lineItems: PurchaseOrderLineItem[];
  subtotal?: number;
  taxRate?: number;
  tax?: number;
  amount: number;
  notes?: string;
  createdAt?: number;
};
