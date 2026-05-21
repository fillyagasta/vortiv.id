import { useState } from 'react';
import { ShoppingCart, Search, Instagram, Youtube, ArrowRight, Globe, Shield, RefreshCw, CreditCard, ChevronRight } from 'lucide-react';

const newArrivals = [
  {
    id: 1,
    name: 'VORTEX TEE',
    price: '$49.00',
    colors: ['white', 'black'],
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    name: 'MOTION TEE',
    price: '$49.00',
    colors: ['white', 'black'],
    image: 'https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    name: 'ORBIT HOODIE',
    price: '$89.00',
    colors: ['white', 'black'],
    image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 4,
    name: 'CORE HOODIE',
    price: '$89.00',
    colors: ['white', 'black'],
    image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const bestSellers = [
  {
    id: 5,
    name: 'GLOBAL TEE',
    price: '$49.00',
    colors: ['white', 'black'],
    image: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 6,
    name: 'SIGNATURE TEE',
    price: '$45.00',
    colors: ['white', 'black'],
    image: 'https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 7,
    name: 'STAR HOODIE',
    price: '$89.00',
    colors: ['white', 'black'],
    image: 'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 8,
    name: 'NULL TEE',
    price: '$49.00',
    colors: ['white', 'black'],
    image: 'https://images.pexels.com/photos/8532614/pexels-photo-8532614.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

function ProductCard({ product }: { product: typeof newArrivals[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-[#111] aspect-square mb-3">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}
        />
        <div className={`absolute inset-0 bg-black/40 flex items-end justify-center pb-4 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="bg-white text-black text-xs font-bold tracking-widest px-6 py-2 hover:bg-gray-200 transition-colors">
            QUICK ADD
          </button>
        </div>
      </div>
      <div>
        <p className="text-white text-xs font-bold tracking-widest mb-1">{product.name}</p>
        <p className="text-gray-400 text-xs mb-2">{product.price}</p>
        <div className="flex gap-1.5">
          {product.colors.map((color) => (
            <button
              key={color}
              className={`w-4 h-4 rounded-full border border-gray-600 ${color === 'white' ? 'bg-white' : 'bg-black border-gray-500'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.25 8.25 0 0 0 4.83 1.56V6.79a4.85 4.85 0 0 1-1.06-.1z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function App() {
  const [cartCount] = useState(0);
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Announcement Bar */}
      <div className="bg-white text-black text-center py-2 text-xs tracking-widest font-medium">
        FREE SHIPPING ON ORDERS OVER $150 — USE CODE: VORTIV15 FOR 15% OFF
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/10 sticky top-0 z-50 bg-black">
        <a href="#" className="text-white font-bold text-lg tracking-tight">vortiv.id</a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors tracking-wide">Shop</a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors tracking-wide">New Arrivals</a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors tracking-wide">Best Sellers</a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors tracking-wide">About Us</a>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          <button className="text-gray-300 hover:text-white transition-colors">
            <Search size={18} />
          </button>
          <a href="#" className="hidden md:block text-sm text-gray-300 hover:text-white transition-colors tracking-wide">Account</a>
          <button className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
            <ShoppingCart size={18} />
            <span className="text-sm tracking-wide">Cart ({cartCount})</span>
          </button>
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-5 flex flex-col gap-1">
              <span className="block h-px bg-current"></span>
              <span className="block h-px bg-current"></span>
              <span className="block h-px bg-current"></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-white/10 px-6 py-4 flex flex-col gap-4">
          {['Shop', 'New Arrivals', 'Best Sellers', 'About Us', 'Account'].map((item) => (
            <a key={item} href="#" className="text-sm text-gray-300 hover:text-white tracking-wide">{item}</a>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-black overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img
            src="/1779349938873_0.webp"
            alt="Vortiv hero"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>
        <div className="relative z-10 px-8 md:px-16 max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-6">
            BUILT<br />DIFFERENT.
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-10 max-w-xs leading-relaxed">
            Premium streetwear for those<br />who move different.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-white text-black px-7 py-3 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors group"
          >
            SHOP NOW
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* As Seen In */}
      <section className="border-b border-white/10 bg-black">
        <div className="flex flex-wrap items-center gap-8 md:gap-16 px-8 md:px-16 py-6">
          <span className="text-gray-500 text-xs tracking-widest uppercase">As seen in</span>
          {['HIGHSNOBIETY', 'HYPEBEAST', 'COMPLEX', 'GQ', 'DAZED'].map((brand, i) => (
            <span
              key={brand}
              className={`text-sm md:text-base font-bold tracking-widest ${i === 0 ? 'border-b border-white' : 'text-gray-400'} hover:text-white transition-colors cursor-pointer`}
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="px-6 md:px-10 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-widest">NEW ARRIVALS</h2>
          <a href="#" className="flex items-center gap-2 text-sm tracking-widest text-gray-400 hover:text-white transition-colors group">
            VIEW ALL
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Limited Drop Banner */}
      <section className="relative mx-6 md:mx-10 mb-14 overflow-hidden min-h-[420px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=900"
            alt="Limited drop"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 ml-auto mr-16 md:mr-24 text-right max-w-sm">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">LIMITED DROP</h2>
          <p className="text-gray-300 text-sm mb-2">No restocks. No second chances.</p>
          <p className="text-gray-300 text-sm mb-8">Grab it while it's live.</p>
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-white text-black px-7 py-3 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors group"
          >
            SHOP THE DROP
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="px-6 md:px-10 py-4 pb-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-widest">BEST SELLERS</h2>
          <a href="#" className="flex items-center gap-2 text-sm tracking-widest text-gray-400 hover:text-white transition-colors group">
            VIEW ALL
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-t border-white/10 bg-black px-6 md:px-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Globe size={22} />, title: 'WORLDWIDE SHIPPING', sub: 'Fast & secure delivery' },
            { icon: <Shield size={22} />, title: 'PREMIUM QUALITY', sub: 'Built to last' },
            { icon: <RefreshCw size={22} />, title: 'EASY RETURNS', sub: '14-day return policy' },
            { icon: <CreditCard size={22} />, title: 'SECURE PAYMENTS', sub: 'PayPal & more' },
          ].map((feat) => (
            <div key={feat.title} className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5 shrink-0">{feat.icon}</div>
              <div>
                <p className="text-xs font-bold tracking-widest text-white mb-0.5">{feat.title}</p>
                <p className="text-xs text-gray-500">{feat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black px-6 md:px-10 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="text-white font-bold text-lg tracking-tight mb-3 block">vortiv.id</a>
            <p className="text-gray-500 text-xs leading-relaxed mb-6">
              Premium streetwear brand<br />from the underground.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Instagram size={16} />, label: 'instagram' },
                { icon: <TikTokIcon />, label: 'tiktok' },
                { icon: <XIcon />, label: 'x' },
                { icon: <Youtube size={16} />, label: 'youtube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-xs font-bold tracking-widest text-white mb-4">SHOP</p>
            <ul className="space-y-2.5">
              {['All Products', 'T-Shirts', 'Hoodies', 'Accessories'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-xs font-bold tracking-widest text-white mb-4">HELP</p>
            <ul className="space-y-2.5">
              {['Shipping', 'Returns', 'FAQs', 'Size Guide'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold tracking-widest text-white mb-4">COMPANY</p>
            <ul className="space-y-2.5">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-bold tracking-widest text-white mb-4">NEWSLETTER</p>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Get early access to new drops and exclusive offers.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#111] border border-white/20 text-white text-xs px-3 py-2.5 placeholder-gray-600 focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-black px-3 py-2.5 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© 2025 vortiv.id — All rights reserved.</p>
          <div className="flex items-center gap-3">
            {/* Payment Icons */}
            {['PayPal', 'VISA', 'MC', 'Apple Pay'].map((pay) => (
              <span key={pay} className="text-xs text-gray-600 border border-gray-700 px-2 py-0.5 rounded-sm">{pay}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
