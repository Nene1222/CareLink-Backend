export interface Medicine {
  _id: string;
  image: string;
  name: string;
  type: string;
  price: number;
  barcode: string;
  quantity: number;
  expireDate: string[];
}

export interface Service {
  _id: string;
  name: string;
  durationMinutes: number;
  price: number;
  roomNumber: string;
  patientId: string | null;
  patientName: string | null;
}

export interface CartItem {
  id: string;
  type: 'medicine' | 'service';
  name: string;
  quantity: number;
  unitPrice: number;
  itemId: string;
}

export interface Invoice {
  invoiceId: string;
  date: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}
