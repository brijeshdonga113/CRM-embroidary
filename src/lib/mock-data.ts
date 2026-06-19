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

export const inventoryItems: InventoryItem[] = [
  { id: "INV-IT-01", name: "Gold Metallic Thread", sku: "TH-GLD-40", category: "Thread", unit: "spools", quantity: 8, reorderLevel: 25, unitCost: 145, supplier: "Madeira India" },
  { id: "INV-IT-02", name: "Cotton Twill Fabric – Navy", sku: "FB-TWL-NV", category: "Fabric", unit: "meters", quantity: 14, reorderLevel: 40, unitCost: 220, supplier: "Raymond Fabrics" },
  { id: "INV-IT-03", name: "Backing Stabilizer (Cut-away)", sku: "BK-CTW-75", category: "Backing", unit: "rolls", quantity: 22, reorderLevel: 30, unitCost: 380, supplier: "Pellon Supplies" },
  { id: "INV-IT-04", name: "Polyester Thread – White", sku: "TH-PLY-WHT", category: "Thread", unit: "spools", quantity: 31, reorderLevel: 50, unitCost: 95, supplier: "Madeira India" },
  { id: "INV-IT-05", name: "Iron-on Patches Base", sku: "AC-PCH-BS", category: "Accessory", unit: "sheets", quantity: 18, reorderLevel: 25, unitCost: 60, supplier: "Patchwork Co." },
  { id: "INV-IT-06", name: "Black Polyester Thread", sku: "TH-PLY-BLK", category: "Thread", unit: "spools", quantity: 86, reorderLevel: 50, unitCost: 95, supplier: "Madeira India" },
  { id: "INV-IT-07", name: "Pique Polo Fabric – White", sku: "FB-PIQ-WHT", category: "Fabric", unit: "meters", quantity: 120, reorderLevel: 40, unitCost: 260, supplier: "Raymond Fabrics" },
  { id: "INV-IT-08", name: "Tearaway Stabilizer", sku: "BK-TRW-50", category: "Backing", unit: "rolls", quantity: 64, reorderLevel: 30, unitCost: 310, supplier: "Pellon Supplies" },
  { id: "INV-IT-09", name: "Woven Name Labels", sku: "AC-LBL-WV", category: "Accessory", unit: "sheets", quantity: 142, reorderLevel: 50, unitCost: 18, supplier: "Patchwork Co." },
  { id: "INV-IT-10", name: "Team Crest – Digitized Design", sku: "DS-CRST-01", category: "Design", unit: "files", quantity: 1, reorderLevel: 0, unitCost: 0, supplier: "In-house" },
  { id: "INV-IT-11", name: "School Emblem – Digitized Design", sku: "DS-EMBL-02", category: "Design", unit: "files", quantity: 1, reorderLevel: 0, unitCost: 0, supplier: "In-house" },
  { id: "INV-IT-12", name: "Silver Metallic Thread", sku: "TH-SLV-40", category: "Thread", unit: "spools", quantity: 47, reorderLevel: 25, unitCost: 145, supplier: "Madeira India" },
];

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
};

export const stockMovements: StockMovement[] = [
  { id: "MV-501", itemName: "Gold Metallic Thread", type: "out", quantity: 12, unit: "spools", date: "18 Jun 2026", reference: "ORD-3301", performedBy: "Riya Sharma" },
  { id: "MV-502", itemName: "Pique Polo Fabric – White", type: "in", quantity: 100, unit: "meters", date: "17 Jun 2026", reference: "PO-1182", performedBy: "Karthik Iyer" },
  { id: "MV-503", itemName: "Tearaway Stabilizer", type: "out", quantity: 18, unit: "rolls", date: "17 Jun 2026", reference: "ORD-3302", performedBy: "Riya Sharma" },
  { id: "MV-504", itemName: "Cotton Twill Fabric – Navy", type: "adjustment", quantity: -6, unit: "meters", date: "16 Jun 2026", reference: "Stock count", performedBy: "Karthik Iyer" },
  { id: "MV-505", itemName: "Woven Name Labels", type: "in", quantity: 200, unit: "sheets", date: "15 Jun 2026", reference: "PO-1179", performedBy: "Karthik Iyer" },
  { id: "MV-506", itemName: "Black Polyester Thread", type: "out", quantity: 24, unit: "spools", date: "14 Jun 2026", reference: "ORD-3304", performedBy: "Riya Sharma" },
  { id: "MV-507", itemName: "Backing Stabilizer (Cut-away)", type: "out", quantity: 15, unit: "rolls", date: "13 Jun 2026", reference: "ORD-3303", performedBy: "Riya Sharma" },
  { id: "MV-508", itemName: "Silver Metallic Thread", type: "in", quantity: 50, unit: "spools", date: "11 Jun 2026", reference: "PO-1175", performedBy: "Karthik Iyer" },
];

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

export const clients: Client[] = [
  { id: "CL-01", name: "Aarav Textiles Pvt Ltd", type: "Firm", contactPerson: "Aarav Shah", email: "aarav@aaravtextiles.in", phone: "+91 98200 11223", address: "MIDC, Andheri East, Mumbai", totalBilled: 248250, outstanding: 0, initials: "AT" },
  { id: "CL-02", name: "Riviera Sports Club", type: "Firm", contactPerson: "Meera Nair", email: "meera@rivierasc.com", phone: "+91 99870 44556", address: "Bandra West, Mumbai", totalBilled: 96800, outstanding: 12800, initials: "RS" },
  { id: "CL-03", name: "Sunrise Uniforms Co.", type: "Firm", contactPerson: "Karan Patel", email: "karan@sunriseuniforms.in", phone: "+91 90040 77881", address: "Naroda, Ahmedabad", totalBilled: 64200, outstanding: 9650, initials: "SU" },
  { id: "CL-04", name: "Bloom Bridal Studio", type: "Individual", contactPerson: "Ishita Rao", email: "ishita.rao@bloomstudio.in", phone: "+91 97120 33445", address: "Koramangala, Bengaluru", totalBilled: 132100, outstanding: 0, initials: "BB" },
  { id: "CL-05", name: "Falcon Corporate Wear", type: "Firm", contactPerson: "Devansh Mehta", email: "devansh@falconwear.com", phone: "+91 98330 22118", address: "Sector 18, Gurugram", totalBilled: 78900, outstanding: 18900, initials: "FC" },
  { id: "CL-06", name: "Lotus School Uniforms", type: "Firm", contactPerson: "Priya Iyer", email: "priya@lotusschool.in", phone: "+91 96500 88321", address: "Adyar, Chennai", totalBilled: 187400, outstanding: 7400, initials: "LS" },
  { id: "CL-07", name: "Nikhil Verma", type: "Individual", contactPerson: "Nikhil Verma", email: "nikhil.verma@gmail.com", phone: "+91 88990 12345", address: "Indiranagar, Bengaluru", totalBilled: 5400, outstanding: 0, initials: "NV" },
  { id: "CL-08", name: "Studio Eleven Apparel", type: "Firm", contactPerson: "Sana Khan", email: "sana@studioeleven.co", phone: "+91 91670 55667", address: "Lower Parel, Mumbai", totalBilled: 41200, outstanding: 0, initials: "SE" },
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
  { id: "ORD-3305", client: "Sunrise Uniforms Co.", design: "Company Initials – Cuff", quantity: 180, status: "queued", eta: "26 Jun 2026" },
  { id: "ORD-3306", client: "Studio Eleven Apparel", design: "Brand Wordmark – Chest", quantity: 60, status: "in-production", eta: "23 Jun 2026" },
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
