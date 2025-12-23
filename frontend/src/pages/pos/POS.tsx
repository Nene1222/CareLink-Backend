import { useState } from 'react';
import { usePOSData } from './hooks/usePOSData';
import type{ Medicine, Service, CartItem } from './types';
import { generateInvoiceId, calculateTax, calculateTotal } from './utils/helpers';
import { SearchFilters } from './components/SearchFilters';
import { ProductDisplay } from './components/ProductDisplay';
import { CartSection } from './components/CartSection';
import { BarcodeScanner } from './pages/BarcodeScanner';
import { Checkout } from './pages/Checkout';
import { PaymentCompleteDialog } from './components/PaymentCompleteDialog';
import axios from 'axios';
import { useEffect } from 'react';

const POS = () => {
  const { medicines, services, loading, error } = usePOSData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [activeTab, setActiveTab] = useState<'medicines' | 'services'>('medicines');
  const [showCart, setShowCart] = useState(false);

  // Reset filter when switching tabs
  const handleTabChange = (tab: 'medicines' | 'services') => {
    setActiveTab(tab);
    setSelectedType('all'); // Reset filter when switching tabs
  };
  const [showScanner, setShowScanner] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const [invoiceId] = useState(generateInvoiceId());
  const [date] = useState(new Date().toISOString());
  const [customerPhone, setCustomerPhone] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const BACKEND_URL = "/api/cart"
  const BACKEND_WS = "ws://localhost:3000/api/cart/ws";

  useEffect(() => {
    const ws = new WebSocket(BACKEND_WS);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event === "updateCart") {
          const formatted = message.payload.map((item: any) => ({
            id: item.id,
            productId: item.data.productId,
            name: item.data.name,
            unitPrice: item.data.unitPrice,
            quantity: item.data.quantity,
          }));

          setCartItems(formatted);
        }

      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };


    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close(); // clean up on component unmount
  }, []);
  const handleScanSuccess = (barcode: string) => {
    const medicine = medicines.find((m) => m.barcode === barcode);
    if (medicine) {
      addMedicineToCart(medicine); // ✅ add to cart in POS
      setShowScanner(false);        // close scanner
      alert(`Added ${medicine.name} to cart`);
    } else {
      alert('Invalid barcode - Product not found');
    }
  };

  const addMedicineToCart = async (medicine: Medicine) => {
  if (medicine.quantity === 0) {
    alert('This medicine is out of stock');
    return;
  }

  const newItem = {
    type: "medicine",
    productId: medicine._id,
    name: medicine.name,
    quantity: 1,
    unitPrice: medicine.price,
  };

  try {
    const response = await axios.post(`${BACKEND_URL}/add`, newItem);
    console.log("Cart updated on backend:", response.data);
  } catch (err) {
    console.error("Failed to add medicine to cart:", err);
  }
};


  const addServiceToCart = async (service: Service) => {
    const newItem = {
      type: "service",
      productId: service._id,
      name: service.name,
      quantity: 1,
      unitPrice: service.price,
    };

    try {
      const response = await axios.post(`${BACKEND_URL}/add`, newItem);
      console.log("Cart updated on backend:", response.data);
    } catch (err) {
      console.error("Failed to add service to cart:", err);
    }
  };


  const updateCartItemQuantity = async (id: string, delta: number) => {
  const item = cartItems.find(i => i.id === id);
  if (!item) return;

  const newQuantity = Math.max(0, item.quantity + delta); // allow 0
  try {
    const response = await axios.patch(`${BACKEND_URL}/update/${id}`, { quantity: newQuantity });
    console.log("Cart quantity updated:", response.data);
  } catch (err) {
    console.error("Failed to update cart item:", err);
  }
};

const removeCartItem = async (id: string) => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/update/${id}`, { quantity: 0 });
    console.log("Item removed from cart:", response.data);
  } catch (err) {
    console.error("Failed to remove cart item:", err);
  }
};

  

  // const handleScanSuccess = (barcode: string) => {
  //   const medicine = medicines.find((m) => m.barcode === barcode);
  //   if (medicine) {
  //     addMedicineToCart(medicine);
  //     setShowScanner(false);
  //     alert(`Added ${medicine.name} to cart`);
  //   } else {
  //     alert('Invalid barcode - Product not found');
  //   }
  // };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      setCartItems([]);
      setCustomerPhone('');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }
    setShowCheckout(true);
  };

  const handleCompletePayment = () => {
    setShowCheckout(false);
    setShowCompleteDialog(true);
  };

//   const handleCompletePayment = async () => {
//   if (cartItems.length === 0) {
//     alert("Cart is empty");
//     return;
//   }

//   // Prepare invoice data
//   const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
//   const tax = calculateTax(subtotal);
//   const total = calculateTotal(subtotal, tax);

//   const invoiceData = {
//     invoiceId,
//     customerPhone,
//     date,
//     subtotal,
//     tax,
//     total,
//   };

//   const invoiceDetailData = cartItems.map((item) => ({
//     invoiceId,
//     itemId: item.id,
//     itemName: item.name,
//     itemPrice: item.unitPrice,
//     itemQuantity: item.quantity,
//     itemTotalPrice: item.unitPrice * item.quantity,
//   }));

//   try {
//     // Send invoice and invoice details to backend
//     await axios.post("/api/invoice", invoiceData);
//     await axios.post("/api/invoice-detail", { details: invoiceDetailData });
//     console.log("Invoice and details saved to backend successfully");

//     // Show payment complete dialog
//     setShowCheckout(false);
//     setShowCompleteDialog(true);
//   } catch (err) {
//     console.error("Failed to save invoice:", err);
//     alert("Failed to save invoice. Please try again.");
//   }
// };

  const handleCloseCompleteDialog = async () => {
    try {
      // Call backend to clear cart
      await axios.delete(`${BACKEND_URL}/`);
      console.log("Backend cart cleared successfully");
      
      // Clear local state
      setCartItems([]);
      setCustomerPhone('');
      setShowCompleteDialog(false);
    } catch (err) {
      console.error("Failed to clear cart on backend:", err);
      alert("Failed to clear cart. Please try again.");
    }
  };


  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading POS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Error loading data</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">POS</h1>
          <p className="text-gray-600">Clinic Point-of-Sale & Billing System</p>
        </div>

        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          medicines={medicines}
          services={services}
          onToggleCart={() => setShowCart(!showCart)}
          onOpenScanner={() => setShowScanner(true)}
          cartItemCount={cartItems.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${showCart ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <ProductDisplay
              medicines={medicines}
              services={services}
              onAddMedicineToCart={addMedicineToCart}
              onAddServiceToCart={addServiceToCart}
              searchQuery={searchQuery}
              selectedType={selectedType}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          {showCart && (
            <div className="lg:col-span-1">
              <CartSection
                invoiceId={invoiceId}
                date={date}
                customerPhone={customerPhone}
                onCustomerPhoneChange={setCustomerPhone}
                cartItems={cartItems}
                onUpdateQuantity={updateCartItemQuantity}
                onRemoveItem={removeCartItem}
                subtotal={subtotal}
                tax={tax}
                total={total}
                onCancel={handleCancel}
                onCheckout={handleCheckout}
              />
            </div>
          )}
        </div>
      </div>

      {showScanner && (
        <BarcodeScanner onClose={() => setShowScanner(false)} onScanSuccess={handleScanSuccess}   onAddMedicineToCart={addMedicineToCart}
/>
      )}

      {showCheckout && (
        <Checkout
          invoiceId={invoiceId}
          date={date}
          customerPhone={customerPhone}
          cartItems={cartItems}
          subtotal={subtotal}
          tax={tax}
          total={total}
          onClose={() => setShowCheckout(false)}
          onComplete={handleCompletePayment}
        />
      )}

      {showCompleteDialog && (
        <PaymentCompleteDialog 
        invoiceId={invoiceId} 
        customerPhone={customerPhone}
        date={date}
        address="123 Medical Center Street, Phnom Penh"
        cartItems={cartItems}
        onClose={handleCloseCompleteDialog} />
      )}
    </div>
  );
};


export default POS