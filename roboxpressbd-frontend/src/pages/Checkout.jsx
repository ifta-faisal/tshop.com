import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Orders } from '../api/client'
import toast from 'react-hot-toast'

const fmt = (n) => '৳ ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const { user, isAuthed } = useAuth()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({ 
    firstName: user?.fullName ? user.fullName.split(' ')[0] : '', 
    lastName: user?.fullName ? user.fullName.split(' ').slice(1).join(' ') : '', 
    companyName: '',
    country: 'Bangladesh',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    district: '',
    postcode: '',
    phone: user?.phone || '', 
    email: user?.email || '',
    paymentMethod: 'bank_transfer',
    shippingMethod: 'sundarban',
    shipToDifferent: false,
    orderNotes: '',
    createAccount: false,
    termsAccepted: false
  })
  const [busy, setBusy] = useState(false)

  const shippingFees = {
    'sundarban': 150,
    'pickup': 0,
    'emergency': 4000
  }

  const currentShippingFee = shippingFees[form.shippingMethod] || 0
  const orderTotal = subtotal + currentShippingFee

  const submit = async (e) => {
    e.preventDefault()
    if (!form.termsAccepted) {
      toast.error('You must accept the terms and conditions')
      return
    }
    setBusy(true)
    try {
      const addressParts = [
        form.companyName ? `Company: ${form.companyName}` : '',
        form.streetAddress1,
        form.streetAddress2,
        `${form.city}, ${form.district} ${form.postcode}`,
        form.country
      ].filter(Boolean).join('\n')

      const payload = {
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        customerPhone: form.phone,
        customerEmail: form.email,
        shippingAddress: addressParts,
        paymentMethod: form.paymentMethod
      }

      if (!isAuthed) {
        payload.guestItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      }
      
      if (form.orderNotes) {
        payload.shippingAddress += `\n\nNotes: ${form.orderNotes}`
      }

      const order = await Orders.checkout(payload)
      await clear()
      toast.success('Order placed!')
      navigate(`/order/${order.orderNumber}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed')
    } finally { setBusy(false) }
  }

  if (items.length === 0) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-500 text-lg">Your cart is empty.</div>
  }

  const Input = ({ label, required, value, onChange, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-2">
      {label && <label className="text-[14px] font-bold text-slate-700">{label} {required && '*'}</label>}
      <input 
        type={type} 
        required={required} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-slate-300 rounded-[30px] focus:outline-none focus:border-slate-500 transition-colors" 
      />
    </div>
  )

  const Select = ({ label, required, value, onChange, options }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-bold text-slate-700">{label} {required && '*'}</label>
      <select 
        required={required} 
        value={value} 
        onChange={onChange}
        className="w-full px-4 py-3 border border-slate-300 rounded-[30px] bg-white focus:outline-none focus:border-slate-500 transition-colors appearance-none"
      >
        <option value="" disabled>Select an option...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_450px] gap-12">
        
        {/* LEFT COLUMN - BILLING */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl text-slate-700 mb-2 font-normal">Billing details</h2>
            <div className="w-full h-[1px] bg-slate-200 mb-8 relative">
              <div className="absolute left-0 top-[-1px] w-16 h-[3px] bg-slate-400"></div>
            </div>

            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <Input label="First name" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                <Input label="Last name" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
              </div>
              
              <Input label="Company name (optional)" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
              
              <Select label="Country / Region" required value={form.country} onChange={e => setForm({...form, country: e.target.value})} options={[{label: 'Bangladesh', value: 'Bangladesh'}]} />
              
              <div className="flex flex-col gap-4">
                <label className="text-[14px] font-bold text-slate-700">Street address *</label>
                <input required value={form.streetAddress1} onChange={e => setForm({...form, streetAddress1: e.target.value})} placeholder="House number and street name" className="w-full px-4 py-3 border border-slate-300 rounded-[30px] focus:outline-none focus:border-slate-500 transition-colors" />
                <input value={form.streetAddress2} onChange={e => setForm({...form, streetAddress2: e.target.value})} placeholder="Apartment, suite, unit, etc. (optional)" className="w-full px-4 py-3 border border-slate-300 rounded-[30px] focus:outline-none focus:border-slate-500 transition-colors" />
              </div>

              <Input label="Town / City" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
              
              <Select label="District" required value={form.district} onChange={e => setForm({...form, district: e.target.value})} options={[
                {label: 'Dhaka', value: 'Dhaka'},
                {label: 'Chattogram', value: 'Chattogram'},
                {label: 'Sylhet', value: 'Sylhet'},
                {label: 'Rajshahi', value: 'Rajshahi'},
                {label: 'Khulna', value: 'Khulna'},
                {label: 'Barishal', value: 'Barishal'},
                {label: 'Rangpur', value: 'Rangpur'},
                {label: 'Mymensingh', value: 'Mymensingh'}
              ]} />

              <Input label="Postcode / ZIP (optional)" value={form.postcode} onChange={e => setForm({...form, postcode: e.target.value})} />
              
              <Input label="Phone" type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              
              <Input label="Email address" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              
              {!isAuthed && (
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.createAccount} onChange={e => setForm({...form, createAccount: e.target.checked})} className="w-4 h-4" />
                    <span className="text-[15px] font-bold text-slate-700">Create an account?</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8">
            <h2 className="text-2xl text-slate-700 mb-2 font-normal">Shipping Details</h2>
            <div className="w-full h-[1px] bg-slate-200 mb-8 relative">
              <div className="absolute left-0 top-[-1px] w-24 h-[3px] bg-slate-400"></div>
            </div>

            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.shipToDifferent} onChange={e => setForm({...form, shipToDifferent: e.target.checked})} className="w-4 h-4" />
                <span className="text-[15px] font-bold text-slate-700">Ship to a different address?</span>
              </label>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-slate-700">Order notes (optional)</label>
                <textarea 
                  value={form.orderNotes} 
                  onChange={e => setForm({...form, orderNotes: e.target.value})} 
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  className="w-full px-4 py-3 border border-slate-300 rounded-[20px] focus:outline-none focus:border-slate-500 transition-colors min-h-[120px]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - ORDER SUMMARY */}
        <div>
          <div className="bg-[#f7f7f7] p-8 rounded-md sticky top-8 border-2 border-transparent relative">
            <h2 className="text-2xl text-slate-700 mb-2 font-normal">Your order</h2>
            <div className="w-full h-[1px] bg-slate-300 mb-8 relative">
              <div className="absolute left-0 top-[-1px] w-16 h-[3px] bg-slate-400"></div>
            </div>

            {/* Order Table */}
            <div className="w-full text-[15px] text-slate-600 mb-8 border-b border-slate-300 pb-6">
              <div className="flex justify-between font-bold text-slate-800 pb-4 border-b border-slate-200 mb-4">
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              
              <div className="space-y-4 mb-4 border-b border-slate-200 pb-4">
                {items.map(i => (
                  <div key={i.id} className="flex justify-between items-start gap-4">
                    <span className="text-slate-500 leading-snug">
                      {i.productName} <strong className="text-slate-800 font-bold ml-1">× {i.quantity}</strong>
                    </span>
                    <span className="whitespace-nowrap">{fmt(i.lineTotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pb-4 border-b border-slate-200 mb-4">
                <span className="font-bold text-slate-800">Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>

              <div className="pb-4 border-b border-slate-200 mb-4 flex justify-between gap-4">
                <span className="font-bold text-slate-800 shrink-0">Shipment</span>
                <div className="space-y-3 flex flex-col items-end text-right">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-slate-600">Sundarban Courier: <span className="text-slate-800">{fmt(150)}</span></span>
                    <input type="radio" name="shipping" value="sundarban" checked={form.shippingMethod === 'sundarban'} onChange={() => setForm({...form, shippingMethod: 'sundarban'})} className="mt-0.5" />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-slate-600 text-right">Local Pickup (Sayed Nagar, Vatara, Dhaka-1212)</span>
                    <input type="radio" name="shipping" value="pickup" checked={form.shippingMethod === 'pickup'} onChange={() => setForm({...form, shippingMethod: 'pickup'})} className="mt-0.5" />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-slate-600 text-right">Emergency China-Bangladesh (4-8 days) - 2kg: <span className="text-slate-800">{fmt(4000)}</span></span>
                    <input type="radio" name="shipping" value="emergency" checked={form.shippingMethod === 'emergency'} onChange={() => setForm({...form, shippingMethod: 'emergency'})} className="mt-0.5" />
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-bold text-slate-800">{fmt(orderTotal)}</span>
              </div>
              <div className="text-right text-xs text-slate-500 mt-1">
                (includes tax estimated for Bangladesh)
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="payment" value="bank_transfer" checked={form.paymentMethod === 'bank_transfer'} onChange={() => setForm({...form, paymentMethod: 'bank_transfer'})} />
                  <span className="font-bold text-slate-800">Direct bank transfer</span>
                </label>
                {form.paymentMethod === 'bank_transfer' && (
                  <div className="mt-3 bg-slate-200/50 p-4 text-[14px] text-slate-600 rounded relative leading-relaxed">
                    <div className="absolute top-[-6px] left-6 w-3 h-3 bg-slate-200/50 transform rotate-45"></div>
                    Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account. If you forget to use your Order ID when transferring the payment, don't worry just send us a short email here: roboxpressbd@gmail.com
                  </div>
                )}
              </div>
              
              <div className="border-t border-slate-200 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="bkash" checked={form.paymentMethod === 'bkash'} onChange={() => setForm({...form, paymentMethod: 'bkash'})} />
                    <span className="font-bold text-slate-800">bKash</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/BKash_Logo.svg/512px-BKash_Logo.svg.png" alt="bKash" className="h-6 object-contain" />
                </label>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="rocket" checked={form.paymentMethod === 'rocket'} onChange={() => setForm({...form, paymentMethod: 'rocket'})} />
                    <span className="font-bold text-slate-800">Rocket</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Rocket_DBBL_logo.svg/512px-Rocket_DBBL_logo.svg.png" alt="Rocket" className="h-6 object-contain" />
                </label>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="nagad" checked={form.paymentMethod === 'nagad'} onChange={() => setForm({...form, paymentMethod: 'nagad'})} />
                    <span className="font-bold text-slate-800">Nagad</span>
                  </div>
                  <img src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" alt="Nagad" className="h-6 object-cover object-left" style={{ width: '40px' }} />
                </label>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-4">
              <p className="text-[14px] text-slate-600 leading-relaxed">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
              </p>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required checked={form.termsAccepted} onChange={e => setForm({...form, termsAccepted: e.target.checked})} className="mt-1 w-4 h-4" />
                <span className="text-[15px] text-slate-700">
                  I have read and agree to the website <a href="#" className="font-bold text-slate-800 hover:text-blue-600 hover:underline">terms and conditions</a> <span className="text-red-500">*</span>
                </span>
              </label>

              <button 
                disabled={busy || !form.termsAccepted} 
                className="w-full bg-black text-white rounded-full py-4 text-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors mt-4"
              >
                {busy ? 'Placing order...' : 'Place order'}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}
