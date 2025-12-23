export const generateInvoiceId = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${dateStr}-${random}`;
};

export const calculateTax = (subtotal: number, taxRate: number = 0.06): number => {
  return parseFloat((subtotal * taxRate).toFixed(2));
};

export const calculateTotal = (subtotal: number, tax: number): number => {
  return parseFloat((subtotal + tax).toFixed(2));
};

export const convertUSDToRiel = (usd: number, rate: number = 4100): number => {
  return Math.round(usd * rate);
};

export const convertRielToUSD = (riel: number, rate: number = 4100): number => {
  return parseFloat((riel / rate).toFixed(2));
};

export const getStockStatus = (quantity: number): { label: string; color: string } => {
  if (quantity === 0) return { label: 'Out of Stock', color: 'text-gray-500' };
  if (quantity <= 10) return { label: 'Low Stock', color: 'text-yellow-600' };
  return { label: 'In Stock', color: 'text-green-600' };
};

export const getStockBadgeColor = (quantity: number): string => {
  if (quantity === 0) return 'bg-gray-200 text-gray-700';
  if (quantity <= 10) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min${mins !== 1 ? 's' : ''}`;
  if (mins === 0) return `${hours} hr${hours !== 1 ? 's' : ''}`;
  return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
};

export const getServiceStatus = (patientId: string | null): { label: string; color: string } => {
  if (patientId) return { label: 'Occupied', color: 'bg-red-100 text-red-800' };
  return { label: 'Available', color: 'bg-green-100 text-green-800' };
};
