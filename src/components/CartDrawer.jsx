// components/CartDrawer.jsx - Fixed with Enhanced GA4 Tracking
import React, { useState, useRef, useCallback, memo } from "react";
import { useCart } from "./CartContext";
import { toast } from "react-hot-toast";

// ✅ CheckoutForm - Memoized to prevent unnecessary re-renders
const CheckoutForm = memo(
  ({
    isFormVisible,
    formRef,
    closeCheckoutForm,
    getTotalPrice,
    formData,
    handleInputChange,
    handlePlaceOrder,
    isProcessing,
  }) => (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeCheckoutForm();
        }
      }}
    >
      <div
        ref={formRef}
        className={`bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl transition-all duration-300 ease-out ${
          isFormVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Order Details
            </h2>
            <button
              onClick={closeCheckoutForm}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <p className="text-sm text-gray-600">Total Amount:</p>
            <p className="text-3xl md:text-4xl font-bold text-black">
              Rs. {getTotalPrice().toLocaleString()}
            </p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="03XX-XXXXXXX"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="House #, Street, Area"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                placeholder="Enter your city"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any special instructions..."
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 resize-none text-base"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 rounded-full text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-[1.02] shadow-lg shadow-green-200"
              }`}
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Confirm Order"
              )}
            </button>

            <button
              type="button"
              onClick={closeCheckoutForm}
              className="w-full mt-2 text-gray-500 hover:text-black text-sm font-medium transition-colors duration-300"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  ),
);
CheckoutForm.displayName = "CheckoutForm";

const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const formRef = useRef(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // ✅ GA4 Event - view_cart
  React.useEffect(() => {
    if (isOpen && cartItems.length > 0 && window.gtag) {
      window.gtag("event", "view_cart", {
        currency: "PKR",
        value: getTotalPrice(),
        items: cartItems.map((item) => ({
          item_id: String(item.id),
          item_name: item.name,
          item_category: item.category || "perfume",
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }
  }, [isOpen, cartItems, getTotalPrice]);

  const handlePlaceOrder = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      if (
        !formData.name ||
        !formData.phone ||
        !formData.address ||
        !formData.city
      ) {
        toast.error("Please fill in all required fields!", {
          duration: 2000,
          icon: "⚠️",
        });
        return;
      }

      setIsProcessing(true);

      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          notes: formData.notes || "",
        },
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category || "perfume",
          image: item.image || "",
        })),
        totalAmount: getTotalPrice(),
      };

      try {
        const response = await fetch(
          "https://karachiclothes.vercel.app/api/orders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          },
        );

        const result = await response.json();

        // ✅ GA4 Event - purchase
        if (window.gtag && result.success) {
          window.gtag("event", "purchase", {
            transaction_id: result.data.orderId,
            value: getTotalPrice(),
            currency: "PKR",
            items: cartItems.map((item) => ({
              item_id: String(item.id),
              item_name: item.name,
              item_category: item.category || "perfume",
              price: item.price,
              quantity: item.quantity,
            })),
          });
        }

        if (result.success) {
          toast.success(`✅ Order placed! ID: ${result.data.orderId}`, {
            duration: 2600,
            icon: "🎉",
          });

          setTimeout(() => {
            clearCart();
            setShowCheckoutForm(false);
            setIsFormVisible(false);
            setFormData({
              name: "",
              phone: "",
              address: "",
              city: "",
              notes: "",
            });
            setIsProcessing(false);
            onClose();
          }, 1500);
        } else {
          throw new Error(result.message || "Failed to place order");
        }
      } catch (error) {
        console.error("Order Error:", error);
        toast.error("Failed to place order. Please try again.", {
          duration: 2600,
          icon: "❌",
        });
        setIsProcessing(false);
      }
    },
    [formData, cartItems, getTotalPrice, clearCart, onClose],
  );

  const handleInputChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const openCheckoutForm = useCallback(() => {
    // ✅ GA4 Event - begin_checkout
    if (window.gtag) {
      window.gtag("event", "begin_checkout", {
        currency: "PKR",
        value: getTotalPrice(),
        items: cartItems.map((item) => ({
          item_id: String(item.id),
          item_name: item.name,
          item_category: item.category || "perfume",
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }

    setShowCheckoutForm(true);

    setTimeout(() => {
      setIsFormVisible(true);
    }, 50);
  }, [cartItems, getTotalPrice]);

  const closeCheckoutForm = useCallback(() => {
    setIsFormVisible(false);
    setTimeout(() => {
      setShowCheckoutForm(false);
    }, 300);
  }, []);

  const handleRemoveFromCart = useCallback(
    (id) => {
      removeFromCart(id);
    },
    [removeFromCart],
  );

  const handleUpdateQuantity = useCallback(
    (id, quantity) => {
      updateQuantity(id, quantity);
    },
    [updateQuantity],
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={handleClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-6 flex-1">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-2">
                Start shopping to add items
              </p>
              <button
                onClick={handleClose}
                className="mt-6 bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x80/cccccc/666666?text=No+Image";
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800">
                      {item.name}
                    </h4>
                    <p className="text-sm font-bold text-black mt-1">
                      Rs. {item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-300"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-300"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-2xl font-bold text-black">
                Rs. {getTotalPrice().toLocaleString()}
              </span>
            </div>

            <button
              onClick={openCheckoutForm}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-full text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-green-200 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={handleClose}
              className="w-full mt-3 text-gray-500 hover:text-black text-sm font-medium transition-colors duration-300"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Checkout Form Overlay */}
      {showCheckoutForm && (
        <CheckoutForm
          isFormVisible={isFormVisible}
          formRef={formRef}
          closeCheckoutForm={closeCheckoutForm}
          getTotalPrice={getTotalPrice}
          formData={formData}
          handleInputChange={handleInputChange}
          handlePlaceOrder={handlePlaceOrder}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};

export default CartDrawer;
