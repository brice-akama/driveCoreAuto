'use client';
import * as React from "react";
import { useState  } from 'react';
import Link from 'next/link';
import { useCart, CartItem } from "@/app/context/CartContext";
import QRCodeWrapper from '../components/QRCodeWrapper';
import { FaPaypal, FaBitcoin, FaApple, FaCcVisa } from "react-icons/fa";
import { SiCashapp, SiVenmo, SiZelle } from "react-icons/si";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { useLanguage } from "@/app/context/LanguageContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";




interface AddressDetails {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

interface BillingDetails extends AddressDetails {
  createAccount?: boolean;
  shipToDifferentAddress?: boolean;
  orderNotes?: string;
  password?: string; 
}

interface AddressFormProps {
  data: AddressDetails;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ data, onChange }) => (
  <div className="space-y-4">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <label className="block font-medium mb-1">First name <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="firstName"
          value={data.firstName}   // ✅ use the prop
          onChange={onChange}      // ✅ use the prop
          className="w-full border border-gray-300 px-3 py-2 rounded-full"
        />
      </div>
      <div className="flex-1">
        <label className="block font-medium mb-1">Last name <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="lastName"
          value={data.lastName}   // ✅ use the prop
          onChange={onChange}     // ✅ use the prop
          className="w-full border border-gray-300 px-3 py-2 rounded-full"
          required
        />
      </div>
    </div>

    <div>
      <label className="block font-medium mb-1">Company name (optional)</label>
      <input
        type="text"
        name="companyName"
        value={data.companyName}
        onChange={onChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-full"
      />
    </div>

    <div>
      <label className="block font-medium mb-1">Email <span className="text-red-500">*</span></label>
      <input
        type="email"
        name="email"
        value={data.email}
        onChange={onChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-full"
        required
      />
    </div>

    <div>
      <label className="block font-medium mb-1">Phone <span className="text-red-500">*</span></label>
      <input
        type="tel"
        name="phone"
        value={data.phone}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-full"
        required
      />
    </div>

    <div>
      <label className="block font-medium mb-1">Country / Region <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="country"
        value={data.country}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-full"
        required
      />
    </div>

    <div>
      <label className="block font-medium mb-1">Street Address <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="streetAddress"
        value={data.streetAddress}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-full"
        required
      />
    </div>

    <div>
      <label className="block font-medium mb-1">City <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="city"
        value={data.city}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-full"
        required
      />
    </div>

    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <label className="block font-medium mb-1">State <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="state"
          value={data.state}
          onChange={onChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-full"
          required
        />
      </div>
      <div className="flex-1">
        <label className="block font-medium mb-1">ZIP Code <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="zipCode"
          value={data.zipCode}
          onChange={onChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-full"
          required
        />
      </div>
    </div>
  </div>
);





const CheckOutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<'Cash App' | 'Paypal' | 'Zelle' | 'Apple Pay' | 'Venmo' | 'crypto' | ''>('');

  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { cartItems, totalPrice } = useCart();
  const [cryptoWarning, setCryptoWarning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
 
  const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const router = useRouter();
    const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  
 

  const {  language } = useLanguage();
 const [billingDetails, setBillingDetails] = useState<BillingDetails>({ 
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    createAccount: false,
    shipToDifferentAddress: false,
    orderNotes: '',
    
  });
  const [shippingDetails, setShippingDetails] = useState<AddressDetails>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Recalculate subtotal, tax, and total whenever quantities change
  // Helper to get the effective price (consider discount)
// Helper to get the effective price (with discount applied safely)
// Helper: calculate discounted price from discountPercent
const getItemPrice = (item: CartItem) => {
  if (item.discountPercent && item.discountPercent > 0) {
    return item.price - (item.price * item.discountPercent) / 100;
  }
  return item.price;
};



// Subtotal calculation


  const calculateShipping = () => {
  if (subtotal > 2000) {
    setShippingCost(200); // heavy items like engines
  } else if (subtotal > 500) {
    setShippingCost(100); // smaller transmissions
  } else {
    setShippingCost(50);  // small parts
  }
};// Subtotal (discounted prices included)
const subtotal = cartItems.reduce((acc, item) => {
  const price = getItemPrice(item);
  return acc + price * item.quantity;
}, 0);

const freeShippingThreshold = 5000;
const remaining = freeShippingThreshold - totalPrice;

// Tax & totals
const salesTaxAmount = subtotal * 0.07;
const total = subtotal + (shippingCost || 0) + salesTaxAmount - discount;

React.useEffect(() => {
  calculateShipping();
}, [subtotal]);




const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/secure-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginDetails),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message || "Logged in successfully");
      setShowLogin(false);
      // Optionally: set user in context or localStorage
    } else {
      toast.error(data.error || "Invalid email or password");
    }
  } catch (err) {
    console.error(err);
    toast.error("Login failed. Try again.");
  }
};


const handleRegister = async ({ email, password }: { email: string, password: string }) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      toast.success(data.message || "Account created successfully");
      setBillingDetails(prev => ({ ...prev, createAccount: false }));
      // Optionally log them in automatically
    } else {
      toast.error(data.error || "Registration failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to register. Try again.");
  }
};


// Coupon application
const applyCoupon = async () => {
  if (!couponCode) return;

  try {
    const response = await fetch("/api/cart/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponCode }),
    });

    const data = await response.json();

    if (data.success) {
      setDiscount(data.cart.discount || 0);
      alert(`Coupon applied! You saved $${data.cart.discount?.toFixed(2) || 0}`);
    } else {
      setDiscount(0);
      // Show server message (like minOrderValue requirement)
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    setDiscount(0);
    alert("Error applying coupon. Please try again.");
  }
};



  
  // Generic input change for billing & shipping
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  type: 'billing' | 'shipping' = 'billing'
) => {
  const { name, value, type: inputType } = e.target;

  if (inputType === 'checkbox') {
    const checked = (e.target as HTMLInputElement).checked;
    if (type === 'billing') {
      setBillingDetails(prev => ({ ...prev, [name]: checked }));
    } else {
      setShippingDetails(prev => ({ ...prev, [name]: checked }));
    }
  } else {
    // Only update text / textarea values here
    if (type === 'billing') {
      setBillingDetails(prev => ({ ...prev, [name]: value }));
    } else {
      setShippingDetails(prev => ({ ...prev, [name]: value }));
    }
  }
};




  const [showLogin, setShowLogin] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  
  // Add this inside your component
const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setLoginDetails(prev => ({ ...prev, [name]: value }));
};

const [accountDetails, setAccountDetails] = useState({
  email: '',
  password: '',
});

const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setAccountDetails(prev => ({ ...prev, [name]: value }));
};


  
  
const handlePlaceOrder = async () => {
  setOrderStatus('idle');
  setCryptoWarning(false);

  if (paymentMethod === 'crypto') {
    setCryptoWarning(true);
    return;
  }

  const orderData = {
    cartItems,
    totalPrice,
    paymentMethod,
    billingDetails,
  };

  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error('Failed to place order');

    // ✅ get backend response (must include orderId)
    const { orderId } = await response.json();

    console.log('Order placed successfully:', orderId);
    setOrderStatus('success');

    // ✅ redirect to confirmation page
    router.push(`/order-confirmation/${orderId}`);

  } catch (error) {
    console.error('Error placing order:', error);
    setOrderStatus('error');
  }
};


  const [showCoupon, setShowCoupon] = useState(false);

  const paymentIcons: Record<string, React.ReactNode> = {
  'Cash App': <SiCashapp className="w-5 h-5" />,
  'Paypal': <FaPaypal className="w-5 h-5" />,
  'Zelle': <SiZelle className="w-5 h-5" />,
  'Apple Pay': <FaApple className="w-5 h-5" />,
  'Venmo': <SiVenmo className="w-5 h-5" />,
  'crypto': <FaBitcoin className="w-5 h-5" />,
};

  

  const handleCopy = () => {
    navigator.clipboard.writeText("bc1qvar3m86w6d2s33gq63jrew6a5nqdxg34ytqnwd");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

   
  return (
    <div className="mt-20 lg:mt-40">
          {/* Full-width black section */}
          <div className="bg-black text-white py-8 text-center w-full">
            
    
            
           {/* Breadcrumb + Shopping Cart link inline on md+ screens */}
    <div className="mt-2 flex justify-center items-center text-sm space-x-2">
      {/* Shopping Cart link only on md+ screens */}
      <Link
        href="/cart-drawer"
        className="hidden md:inline text-white font-bold hover:underline text-4xl"
      >
        shopping Cart
      </Link>
      
      {/* Arrow separator only visible on md+ */}
      <span className="hidden md:inline text-white">→</span>

      {/* Current page */}
      <span className="text-white font-bold text-4xl">Checkout</span>
    </div>
          </div>
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Order Page Header Section */}
          <div className="w-full space-y-3 lg:col-span-3">
<div className="mt-4 relative" >
  <span className="text-gray-700">Returning customer? </span>
  <button
    type="button"
    onClick={() => setShowLogin(!showLogin)}
    className="text-blue-700 font-medium underline hover:text-blue-900 transition"
  >
    Click here to login
  </button>

  {showLogin && (
    <div className="absolute mt-2 w-full max-w-sm bg-white border border-gray-300 rounded-lg shadow-lg p-6">
      
      {/* Informational text */}
      <p className="text-sm text-gray-700 mb-4">
        If you have shopped with us before, please enter your details below.
        <br />
        If you are a new customer, please proceed to the Billing section.
      </p>

      <form onSubmit={handleLogin}className="space-y-4">
        
        {/* Email */}
        <div  className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
    type="email"
    name="email"
    value={loginDetails.email}
    onChange={handleLoginInputChange}
    className="w-full border border-gray-300 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    required
    placeholder="Enter your email"
  />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
         <div className="relative mt-3">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={loginDetails.password}
     onChange={handleLoginInputChange}
    className="w-full border border-gray-300 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
    required
    placeholder="Enter your password"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 px-2"
  >
    {showPassword ? (
      <AiOutlineEyeInvisible className="pointer-events-none" />
    ) : (
      <AiOutlineEye className="pointer-events-none" />
    )}
  </button>
</div>
        </div>

        {/* Remember me and lost password */}
        <div className="flex items-center justify-between text-sm">
          <Link
            href="/forgot-password"   
            className="text-blue-700 underline hover:text-blue-900 transition"
          >
            Lost your password?
          </Link>
        </div>

        {/* Login button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          Login
        </button>
      </form>
    </div>
  )}
</div>

          <div>
  <span className="text-gray-700">Have a coupon? </span>
  <button
    type="button"
    onClick={() => setShowCoupon(!showCoupon)}
    className="text-blue-700 font-medium underline hover:text-blue-900 transition"
  >
    Click here to enter your code
  </button>
</div>

{/* Coupon Input (only shows when toggled) */}
{showCoupon && (
  <div className="flex space-x-2 mt-3">
    <input
      type="text"
      placeholder="Coupon code"
      onChange={(e) => setCouponCode(e.target.value)}
      className="flex-1 border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="button"
      onClick={applyCoupon}
      className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
    >
      Apply Coupon
    </button>
  </div>
)}
          {/* Divider */}
<hr className="my-3 border-dashed border-gray-300" />

{/* Free shipping bar */}
{totalPrice >= freeShippingThreshold ? (
  <div>
    <span className="font-medium text-gray-800">
      Your order qualifies for free shipping!
    </span>
    <div className="w-full bg-green-200 rounded-full mt-1 h-2">
      <div
        className="bg-green-500 h-2 rounded-full transition-all"
        style={{ width: "100%" }}
      />
    </div>
  </div>
) : (
  <div>
    <span className="font-medium text-gray-800">
      Add ${remaining.toLocaleString()} more to qualify for free shipping.
    </span>
    <div className="w-full bg-red-200 rounded-full mt-1 h-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all"
        style={{
          width: `${(totalPrice / freeShippingThreshold) * 100}%`,
        }}
      />
    </div>
  </div>
)}

          {/* Billing Details */}
          <div className="w-full space-y-3 lg:col-span-3">
          {/* Billing Details */}
          <div className="space-y-4 p-6 rounded-lg shadow-md mt-6 bg-white">
            <h2 className="text-lg font-bold uppercase mb-6 tracking-wide">Billing Details</h2>
            <AddressForm
              data={billingDetails}
              onChange={(e) => handleInputChange(e, 'billing')}
            />
            {/* Checkboxes */}
            <div className="flex flex-col gap-3 mt-6">
             <label className="inline-flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    name="createAccount"
    checked={billingDetails.createAccount || false}
  onChange={(e) => handleInputChange(e, 'billing')}
    className="form-checkbox accent-blue-600"
  />
  <span className="font-semibold">Create an account?</span>
</label>

{billingDetails.createAccount && (
  <div className="mt-4 space-y-2">
    <input
      type="email"
      name="email"
      value={billingDetails.email || ""}
      onChange={(e) => handleInputChange(e, 'billing')}
      placeholder="Email"
      required
      className="w-full border rounded-full px-3 py-2"
    />
    <input
      type="password"
      name="password"
      value={billingDetails.password || ""}
      onChange={(e) => handleInputChange(e, 'billing')}
      placeholder="Password"
      required
      className="w-full border rounded-full px-3 py-2"
    />
    <button
      type="button"
      onClick={async () => {
        if (!billingDetails.email || !billingDetails.password) {
          toast.error("Email and password are required");
          return;
        }
        await handleRegister({
          email: billingDetails.email,
          password: billingDetails.password
        });
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
    >
      Create Account
    </button>
  </div>
)}

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="shipToDifferentAddress"
                  checked={billingDetails.shipToDifferentAddress || false}
                  onChange={(e) => handleInputChange(e, 'billing')}
                  className="form-checkbox accent-blue-600"
                />
                <span className="font-semibold">Ship to a different address?</span>
              </label>
            </div>
            {/* Shipping Details */}
            {billingDetails.shipToDifferentAddress && (
              <div className="space-y-4 p-6 rounded-lg shadow-md mt-6 bg-white">
                <h2 className="text-lg font-bold uppercase mb-6 tracking-wide">Shipping Details</h2>
                <AddressForm
                  data={shippingDetails}
                  onChange={(e) => handleInputChange(e, 'shipping')}
                />
              </div>
            )}
            {/* Order notes */}
            <div className="mt-4">
              <label htmlFor="orderNotes" className="block font-medium mb-1">Order notes (optional)</label>
              <textarea
                id="orderNotes"
                name="orderNotes"
                value={billingDetails.orderNotes || ''}
  onChange={(e) => handleInputChange(e, 'billing')}
                rows={4}
                placeholder="Notes about your order, e.g. special notes for delivery."
                className="w-full border border-gray-300 rounded-md px-3 py-2 resize-y"
              />
            </div>
          </div>
        </div>
        </div>
        {/* Right: Cart Summary & Payment */}
        <div className=" space-y-4 bg-gray-50  p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold">YOUR ORDER</h2>
          <div>
      {cartItems.map((item) => (
  <div key={item.slug} className="flex items-center gap-4 border-b pb-2">
    <img
      src={item.mainImage}
      alt={item.name}
      className="w-16 h-16 object-cover rounded-md"
    />
    <div>
      <p className="font-medium">{item.name}</p>

      {item.discountPercent && item.discountPercent > 0 ? (
        <>
          {/* Original price strikethrough */}
          <p className="text-sm text-gray-500 line-through">
            ${item.originalPrice.toFixed(2)}
          </p>

          {/* Discounted price */}
          <p className="text-sm text-green-600">
            ${item.price.toFixed(2)} x {item.quantity}
          </p>
        </>
      ) : (
        <p className="text-sm">
          ${item.price.toFixed(2)} x {item.quantity}
        </p>
      )}

      <p className="text-sm font-semibold">
        Total: ${(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  </div>
))}

           
<div className="flex justify-between mt-1">
  <span>Subtotal</span>
  <span>${subtotal.toFixed(2)}</span>
</div>

{discount > 0 && (
  <div className="flex justify-between mt-3 text-green-600 font-medium">
    <span>Coupon Discount</span>
    <span>- ${discount.toFixed(2)}</span>
  </div>
)}

<div className="flex justify-between mt-1">
  <span>Shipping</span>
  <span>{shippingCost !== null ? `$${shippingCost.toFixed(2)}` : '—'}</span>
</div>

<div className="flex justify-between mt-1">
  <span>Sales Tax (7%)</span>
  <span>${salesTaxAmount.toFixed(2)}</span>
</div>

<p className="mt-4 text-lg font-bold border-t pt-2">
  Grand Total: ${total.toFixed(2)}
</p>

{shippingCost === null && (
  <button
    type="button"
    onClick={calculateShipping}
    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
  >
    Calculate Shipping
  </button>
)}

          </div>
          <h3 className="text-lg font-semibold mt-4">Payment Methods</h3>
          <div className="space-y-2">
  {['Cash App', 'Paypal', 'Zelle', 'Apple Pay', 'Venmo', 'crypto'].map((method) => (
    <label key={method} className="flex items-center gap-2 cursor-pointer mt-5">
      <input
        type="radio"
        name="paymentMethod"
        value={method}
        checked={paymentMethod === method}
        onChange={() =>
          setPaymentMethod(
            method as 'Cash App' | 'Paypal' | 'Zelle' | 'Apple Pay' | 'Venmo' | 'crypto'
          )
        }
      />
      <span className="flex items-center gap-1">
        {paymentIcons[method]}
        {method}
      </span>
    </label>
  ))}
</div>

          {/* Cash App Instructions */}
{paymentMethod === 'Cash App' && (
  <div className="bg-white border border-gray-300 p-4 rounded-md text-sm text-gray-700 space-y-2">
    <p className="font-semibold text-blue-700">
      Cashapp payment instructions at checkout:
    </p>
    <ol className="list-decimal list-inside space-y-1">
      <li>Open the Cash App mobile app.</li>
      <li>
        Add “cash” to your “Cash App balance” before making the payment so as to avoid fail payment.
      </li>
      <li>Enter the amount you want to send.</li>
      <li>Tap “Pay.”</li>
      <li>
        Get in touch with us through our live chat or email: 
        <a href="mailto:support@drivecoreauto.com" className="text-blue-600 underline">
         support@drivecoreauto.com
        </a> 
        for our cashtag.
      </li>
      <li>Enter the email address, phone number, or “$Cashtag”.</li>
      <li>
        Enter what you are sending the payment for. For example: “ORDER #7895”.
      </li>
      <li>Tap “Pay.”</li>
    </ol>
    <p className="text-red-600 font-medium mt-2">
      NB: Please don’t make the Cash App payment to our website email 
      <strong>support@drivecoreauto.com</strong>. Kindly get in touch via live chat or email for our Cash App info.  
      Payments made to our website email won’t be validated nor confirmed.
    </p>
  </div>
)}

      {/* Paypal Instructions */}
{/* Paypal Instructions */}
{/* Paypal Instructions */}
{paymentMethod === 'Paypal' && (
  <div className="bg-white border border-gray-300 p-4 rounded-md text-sm text-gray-700 space-y-2">
    <p className="font-semibold text-blue-700">
      PayPal Payment Instructions:
    </p>
    <ol className="list-decimal list-inside space-y-1">
      <li>
        After placing your order, please contact us via live chat or email to receive our PayPal payment details.
        <br />
        Email: <a href="mailto:support@drivecoreauto.com" className="text-blue-600 underline">support@drivecoreauto.com</a>
      </li>
    </ol>
  </div>
)}

{paymentMethod === 'Zelle' && (
  <div className="bg-white border border-gray-300 p-4 rounded-md text-sm text-gray-700 space-y-2">
    <p className="font-semibold text-blue-700">
      Zelle Payment Instructions at Checkout:
    </p>
    <ol className="list-decimal list-inside space-y-1">
      <li>Download the Zelle App to get started!</li>
      <li>All you need to send money with Zelle is the preferred email address or mobile number of the trusted recipient.</li>
      <li>Please kindly get in touch with us via live chat or email: 
        <a href="mailto:support@drivecoreauto.com" className="text-blue-600 underline">support@drivecoreauto.com</a> for our Zelle details.
      </li>
      <li>After making payment, take a screenshot and send it to our live chat or email: 
        <a href="mailto:support@drivecoreauto.com" className="text-blue-600 underline">support@drivecoreauto.com</a> for confirmation.
      </li>
      <li>Your order is considered valid once we receive details of your payment, which should be pictures or screenshots showing transaction details alongside your Order ID.</li>
      <li>Contact our live chat or email: 
        <a href="mailto:support@drivecoreauto.com" className="text-blue-600 underline">support@drivecoreauto.com</a> for assistance regarding the Zelle payment.
      </li>
    </ol>
    <p className="text-red-600 font-medium mt-2">
      NB: Please don’t make the Zelle payment to our website email ”support@drivecoreauto.com”. Kindly get in touch via live chat or email for our Zelle info. Payments made to our website email won’t be validated nor confirmed.
    </p>
  </div>
)}

{paymentMethod === 'Apple Pay' && (
  <div className="bg-white border border-gray-300 p-4 rounded-md text-sm text-gray-700 space-y-2">
    <p className="font-semibold text-blue-700">
      Apple Pay Payment Instructions:
    </p>
    <ol className="list-decimal list-inside space-y-1">
      <li>
        Kindly contact us via live chat or email after placing your order to receive our Apple Pay information.
        <br />
        Email: <a href="mailto:support@drivecoreauto.com" className="text-blue-600 underline">support@drivecoreauto.com</a>
      </li>
    </ol>
  </div>
)}

{paymentMethod === 'Venmo' && (
  <div className="bg-white border border-gray-300 p-4 rounded-md text-sm text-gray-700 space-y-2">
    <p className="font-semibold text-blue-700">
      Venmo Payment Instructions:
    </p>
    <ol className="list-decimal list-inside space-y-1">
      <li>
        Kindly contact us via live chat or email after placing your order to receive our Venmo payment details.
        <br />
        Email: <a href="mailto:support@drivecoreauto.com" className="text-blue-600 underline">support@drivecoreauto.com</a>
      </li>
    </ol>
  </div>
)}








          {paymentMethod === 'crypto' && (
            <div className="bg-blue-100 p-4 rounded-md text-sm text-gray-700 space-y-3">
              <p><strong>Send BTC to:</strong></p>
              <div className="flex items-center justify-between bg-white p-2 rounded border">
                <span className="break-all font-mono text-gray-800">
                  bc1qv8wl5n9pe89qv9hptvnhljc0cg57c4j63nrynm
                </span>
                <button
                  onClick={handleCopy}
                  className="ml-3 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p>Or scan QR code:</p>
              <QRCodeWrapper
                value="bc1qv8wl5n9pe89qv9hptvnhljc0cg57c4j63nrynm"
                size={160}
              />
            </div>
          )}
          {orderStatus === 'success' && (
            <p className="text-sm text-green-700 bg-green-100 p-2 rounded-md">
              ✅ Your order has been successfully placed and is pending payment via <strong>{paymentMethod}</strong>.
            </p>
          )}
          {orderStatus === 'error' && (
            <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">
              ❌ Something went wrong while placing your order. Please try again.
            </p>
          )}
          <p className="mt-2 text-sm">
            Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
            <Link  href={`/${language}/privacy-policy`} className="text-blue-600 underline">privacy policy</Link>.
          </p>
          {cryptoWarning && (
            <p className="text-sm text-orange-700 bg-orange-100 p-2 rounded-md">
              ⚠️ You selected Crypto. Please send the payment to the wallet address above and contact us with a screenshot of your transaction. We will process your order once we verify the payment.
            </p>
          )}

          {/* Terms & Conditions Checkbox */}
<div className="mt-2 flex items-center gap-2">
  <input
    type="checkbox"
    id="terms"
    checked={agreedToTerms}
    onChange={(e) => setAgreedToTerms(e.target.checked)}
    className="w-4 h-4"
  />
  <label htmlFor="terms" className="text-sm">
    I have read and agree to the website <Link href={`/${language}/terms-conditions`} className="text-blue-600 underline">terms and conditions</Link>
  </label>
</div>
          
<button
  onClick={() => {
    if (!agreedToTerms) {
      alert("You must agree to the terms and conditions before placing your order.");
      return;
    }
    handlePlaceOrder();
  }}
  className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700 transition"
>
  Place Order
</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CheckOutPage;
function useEffect(arg0: () => void, arg1: (string | ((text: string) => Promise<string>))[]) {
  throw new Error("Function not implemented.");
}

