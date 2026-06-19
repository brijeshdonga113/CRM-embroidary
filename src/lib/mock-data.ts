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

export const invoices: Invoice[] = [
  { id: "INV-2041", firm: "Aarav Textiles Pvt Ltd", contact: "Aarav Shah", amount: 48250, status: "paid", dueDate: "12 Jun 2026", initials: "AT" },
  { id: "INV-2042", firm: "Riviera Sports Club", contact: "Meera Nair", amount: 12800, status: "pending", dueDate: "22 Jun 2026", initials: "RS" },
  { id: "INV-2043", firm: "Sunrise Uniforms Co.", contact: "Karan Patel", amount: 9650, status: "overdue", dueDate: "08 Jun 2026", initials: "SU" },
  { id: "INV-2044", firm: "Bloom Bridal Studio", contact: "Ishita Rao", amount: 32100, status: "paid", dueDate: "15 Jun 2026", initials: "BB" },
  { id: "INV-2045", firm: "Falcon Corporate Wear", contact: "Devansh Mehta", amount: 18900, status: "pending", dueDate: "27 Jun 2026", initials: "FC" },
  { id: "INV-2046", firm: "Lotus School Uniforms", contact: "Priya Iyer", amount: 7400, status: "overdue", dueDate: "05 Jun 2026", initials: "LS" },
];

export type StockItem = {
  id: string;
  name: string;
  category: string;
  remaining: number;
  total: number;
  unit: string;
};

export const lowStockItems: StockItem[] = [
  { id: "ST-01", name: "Gold Metallic Thread", category: "Thread", remaining: 8, total: 100, unit: "spools" },
  { id: "ST-02", name: "Cotton Twill Fabric – Navy", category: "Fabric", remaining: 14, total: 150, unit: "meters" },
  { id: "ST-03", name: "Backing Stabilizer (Cut-away)", category: "Backing", remaining: 22, total: 200, unit: "rolls" },
  { id: "ST-04", name: "Polyester Thread – White", category: "Thread", remaining: 31, total: 250, unit: "spools" },
  { id: "ST-05", name: "Iron-on Patches Base", category: "Accessory", remaining: 18, total: 120, unit: "sheets" },
];

export type Order = {
  id: string;
  client: string;
  design: string;
  quantity: number;
  status: "in-production" | "queued" | "completed" | "delayed";
  eta: string;
};

export const activeOrders: Order[] = [
  { id: "ORD-3301", client: "Riviera Sports Club", design: "Team Crest – Left Chest", quantity: 240, status: "in-production", eta: "21 Jun 2026" },
  { id: "ORD-3302", client: "Falcon Corporate Wear", design: "Logo – Full Back", quantity: 120, status: "queued", eta: "24 Jun 2026" },
  { id: "ORD-3303", client: "Bloom Bridal Studio", design: "Custom Monogram", quantity: 6, status: "completed", eta: "18 Jun 2026" },
  { id: "ORD-3304", client: "Lotus School Uniforms", design: "School Emblem", quantity: 500, status: "delayed", eta: "19 Jun 2026" },
];

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export const recentActivity: ActivityItem[] = [
  { id: "AC-1", title: "Invoice INV-2044 paid", description: "Bloom Bridal Studio settled ₹32,100", time: "2h ago" },
  { id: "AC-2", title: "Stock alert", description: "Gold Metallic Thread fell below reorder level", time: "4h ago" },
  { id: "AC-3", title: "New order placed", description: "Lotus School Uniforms — 500 units", time: "6h ago" },
  { id: "AC-4", title: "Invoice INV-2043 overdue", description: "Sunrise Uniforms Co. — 11 days past due", time: "1d ago" },
];

export const revenueOverview = [
  { month: "Jan", revenue: 182000, expenses: 96000 },
  { month: "Feb", revenue: 165000, expenses: 89000 },
  { month: "Mar", revenue: 201000, expenses: 104000 },
  { month: "Apr", revenue: 194000, expenses: 99000 },
  { month: "May", revenue: 228000, expenses: 112000 },
  { month: "Jun", revenue: 246500, expenses: 121000 },
];

export const stats = {
  totalRevenue: 1216500,
  revenueDelta: 12.4,
  outstanding: 48750,
  outstandingDelta: -4.2,
  lowStockCount: lowStockItems.length,
  activeOrdersCount: activeOrders.filter((o) => o.status !== "completed").length,
};
