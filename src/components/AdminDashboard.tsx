import { useEffect, useState } from 'react';
import type { Product, ProductDraft } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';

type Props = { client: SupabaseClient; onClose: () => void; onProductsChanged: () => void };
const blank: ProductDraft = { name:'', price:0, category:'T-Shirts', colors:['Black','White'], image:'', description:'', tag:'', active:true };

export default function AdminDashboard({ client, onClose, onProductsChanged }: Props) {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [session,setSession] = useState<any>(null);
  const [authorized,setAuthorized] = useState(false);
  const [products,setProducts] = useState<Product[]>([]);
  const [categories,setCategories] = useState<string[]>([]);
  const [draft,setDraft] = useState<ProductDraft>(blank);
  const [editing,setEditing] = useState<string|null>(null);
  const [newCategory,setNewCategory] = useState('');
  const [busy,setBusy] = useState(false);
  const [notice,setNotice] = useState('');

  useEffect(() => {
    client.auth.getSession().then(({data}) => setSession(data.session));
    const {data:{subscription}} = client.auth.onAuthStateChange((_event,next) => setSession(next));
    return () => subscription.unsubscribe();
  },[client]);

  useEffect(() => {
    const admin = session?.user?.app_metadata?.role === 'admin';
    setAuthorized(Boolean(admin));
    if(admin) loadData();
  },[session]);

  async function loadData() {
    setBusy(true);
    const [p,c] = await Promise.all([
      client.from('products').select('*').order('created_at',{ascending:false}),
      client.from('categories').select('name').order('name')
    ]);
    if(p.error) setNotice(p.error.message); else setProducts(p.data||[]);
    if(c.error) setNotice(c.error.message); else setCategories((c.data||[]).map((x:any)=>x.name));
    setBusy(false);
  }

  async function signIn(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setNotice('');
    const {data,error} = await client.auth.signInWithPassword({email,password});
    if(error) setNotice('Login gagal. Periksa email/password.'); 
    else if(data.user?.app_metadata?.role !== 'admin') {
      await client.auth.signOut();
      setNotice('Akun ini belum memiliki role admin.');
    }
    setBusy(false);
  }

  async function signOut() { await client.auth.signOut(); setSession(null); setAuthorized(false); }
  function edit(p:Product) { setEditing(p.id); setDraft({...p,colors:p.colors||[],tag:p.tag||''}); }
  function resetForm() { setDraft(blank); setEditing(null); }

  async function uploadImage(file:File) {
    if(!file.type.startsWith('image/')) { setNotice('File harus berupa gambar.'); return; }
    if(file.size > 5*1024*1024) { setNotice('Ukuran gambar maksimal 5 MB.'); return; }
    setBusy(true);
    const ext=file.name.split('.').pop()?.toLowerCase()||'jpg';
    const path=`${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const {error}=await client.storage.from('product-images').upload(path,file,{upsert:false,contentType:file.type});
    if(error) setNotice(error.message);
    else { const {data}=client.storage.from('product-images').getPublicUrl(path); setDraft(d=>({...d,image:data.publicUrl})); setNotice('Foto berhasil diunggah.'); }
    setBusy(false);
  }

  async function saveProduct(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setNotice('');
    const payload={name:draft.name.trim(),price:Number(draft.price),category:draft.category,colors:draft.colors, image:draft.image,description:draft.description.trim(),tag:draft.tag||null,active:draft.active!==false,slug:draft.name.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')};
    const result=editing?await client.from('products').update(payload).eq('id',editing):await client.from('products').insert(payload);
    if(result.error) setNotice(result.error.message);
    else {setNotice('Produk tersimpan.');resetForm();await loadData();onProductsChanged();}
    setBusy(false);
  }

  async function removeProduct(id:string) {
    if(!window.confirm('Hapus produk ini secara permanen?')) return;
    setBusy(true); const {error}=await client.from('products').delete().eq('id',id);
    if(error) setNotice(error.message); else {await loadData();onProductsChanged();setNotice('Produk dihapus.');}
    setBusy(false);
  }

  async function addCategory(e:React.FormEvent) {
    e.preventDefault(); const name=newCategory.trim(); if(!name)return;
    setBusy(true);
    const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    const {error}=await client.from('categories').insert({name,slug});
    if(error) setNotice(error.message); else {setCategories(c=>[...c,name]);setDraft(d=>({...d,category:name}));setNewCategory('');setNotice('Kategori ditambahkan.');}
    setBusy(false);
  }

  async function removeCategory(name:string) {
    if(products.some(p=>p.category===name)){setNotice('Kategori masih digunakan produk. Pindahkan produknya dulu.');return;}
    if(!window.confirm('Hapus kategori '+name+'?'))return;
    const {error}=await client.from('categories').delete().eq('name',name);
    if(error)setNotice(error.message);else setCategories(c=>c.filter(x=>x!==name));
  }

  return <div className="fixed inset-0 z-[100] bg-[#080808] text-white overflow-y-auto">
    <header className="sticky top-0 z-10 bg-black border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
      <div><p className="text-xs tracking-[.3em] text-gray-500">VORTIV.ID</p><h1 className="font-bold tracking-widest">ADMIN PANEL</h1></div>
      <div className="flex gap-3"><button onClick={onClose} className="border border-white/20 px-3 py-2 text-xs">CLOSE</button>{session&&<button onClick={signOut} className="border border-white/20 px-3 py-2 text-xs">SIGN OUT</button>}</div>
    </header>
    {!session?<div className="max-w-md mx-auto px-5 py-20"><h2 className="text-2xl font-bold tracking-widest mb-3">ADMIN LOGIN</h2><p className="text-gray-500 text-sm mb-8">Secure sign-in through Supabase Auth. Admin permissions are verified using server-managed app metadata and database policies.</p><form onSubmit={signIn} className="space-y-4"><input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin email" className="w-full bg-[#111] border border-white/20 p-3"/><input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-[#111] border border-white/20 p-3"/><button disabled={busy} className="w-full bg-white text-black p-3 font-bold disabled:opacity-50">{busy?'PLEASE WAIT':'SIGN IN'}</button></form>{notice&&<p className="text-sm text-red-300 mt-4">{notice}</p>}</div>
    :!authorized?<div className="max-w-xl mx-auto p-8"><p className="text-red-300">Akun login ini belum memiliki akses admin. Logout otomatis dilakukan jika role tidak cocok.</p></div>
    :<main className="max-w-7xl mx-auto p-4 md:p-8 grid lg:grid-cols-[minmax(0,1fr)_420px] gap-8">
      <section><div className="flex justify-between items-center mb-5"><h2 className="text-xl font-bold">Products <span className="text-gray-500 text-sm">({products.length})</span></h2><button onClick={loadData} className="text-xs border border-white/20 px-3 py-2">REFRESH</button></div>
      {busy&&<p className="text-xs text-gray-500 mb-3">Working…</p>}
      <div className="space-y-3">{products.map(p=><article key={p.id} className="border border-white/10 p-3 flex gap-3 items-center"><img src={p.image||'https://placehold.co/80x100?text=No+Image'} alt="" className="w-16 h-20 object-cover bg-gray-900"/><div className="min-w-0 flex-1"><p className="font-semibold text-sm truncate">{p.name}</p><p className="text-gray-500 text-xs">{p.category} · ${p.price} · {p.active?'Published':'Hidden'}</p><p className="text-gray-500 text-xs truncate">{p.tag||'No tag'}</p></div><div className="flex flex-col gap-2"><button onClick={()=>edit(p)} className="border border-white/20 px-3 py-2 text-xs">EDIT</button><button onClick={()=>removeProduct(p.id)} className="border border-red-900 text-red-300 px-3 py-2 text-xs">DELETE</button></div></article>)}</div>
      <div className="mt-10 border border-white/10 p-5"><h3 className="font-bold mb-4">Categories</h3><div className="flex flex-wrap gap-2 mb-4">{categories.map(c=><span key={c} className="border border-white/20 px-3 py-2 text-xs flex gap-2 items-center">{c}<button onClick={()=>removeCategory(c)} aria-label={'Delete '+c} className="text-red-300">×</button></span>)}</div><form onSubmit={addCategory} className="flex gap-2"><input value={newCategory} onChange={e=>setNewCategory(e.target.value)} placeholder="New category" className="min-w-0 flex-1 bg-[#111] border border-white/20 p-2 text-sm"/><button disabled={busy} className="border border-white px-4 text-xs">ADD</button></form></div>
      </section>
      <section className="border border-white/10 p-5 h-fit lg:sticky lg:top-24"><h2 className="font-bold tracking-widest mb-5">{editing?'EDIT PRODUCT':'ADD PRODUCT'}</h2><form onSubmit={saveProduct} className="space-y-4">
        <label className="block text-xs text-gray-400">Product name<input required value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} className="w-full mt-1 bg-[#111] border border-white/20 p-2.5 text-white"/></label>
        <div className="grid grid-cols-2 gap-3"><label className="text-xs text-gray-400">Price (USD)<input type="number" min="0" step="0.01" required value={draft.price} onChange={e=>setDraft(d=>({...d,price:Number(e.target.value)}))} className="w-full mt-1 bg-[#111] border border-white/20 p-2.5 text-white"/></label><label className="text-xs text-gray-400">Category<select value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))} className="w-full mt-1 bg-[#111] border border-white/20 p-2.5 text-white">{categories.map(c=><option key={c}>{c}</option>)}</select></label></div>
        <label className="block text-xs text-gray-400">Product image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>e.target.files?.[0]&&uploadImage(e.target.files[0])} className="block w-full mt-2 text-xs"/><input type="url" value={draft.image} onChange={e=>setDraft(d=>({...d,image:e.target.value}))} placeholder="Or paste image URL" className="w-full mt-2 bg-[#111] border border-white/20 p-2.5 text-white"/>{draft.image&&<img src={draft.image} alt="Preview" className="mt-3 w-24 h-28 object-cover"/>}</label>
        <label className="block text-xs text-gray-400">Description<textarea rows={3} value={draft.description} onChange={e=>setDraft(d=>({...d,description:e.target.value}))} className="w-full mt-1 bg-[#111] border border-white/20 p-2.5 text-white"/></label>
        <label className="block text-xs text-gray-400">Colors (comma separated)<input value={draft.colors.join(', ')} onChange={e=>setDraft(d=>({...d,colors:e.target.value.split(',').map(x=>x.trim()).filter(Boolean)}))} className="w-full mt-1 bg-[#111] border border-white/20 p-2.5 text-white"/></label>
        <label className="block text-xs text-gray-400">Tag (optional)<input value={draft.tag||''} onChange={e=>setDraft(d=>({...d,tag:e.target.value}))} placeholder="NEW / BEST SELLER / SALE" className="w-full mt-1 bg-[#111] border border-white/20 p-2.5 text-white"/></label>
        <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={draft.active!==false} onChange={e=>setDraft(d=>({...d,active:e.target.checked}))}/> Visible on storefront</label>
        <div className="flex gap-2"><button disabled={busy} className="flex-1 bg-white text-black p-3 font-bold text-xs disabled:opacity-50">{busy?'SAVING…':editing?'SAVE CHANGES':'CREATE PRODUCT'}</button>{editing&&<button type="button" onClick={resetForm} className="border border-white/20 px-4 text-xs">CANCEL</button>}</div>
      </form>{notice&&<p className="text-sm mt-4 text-amber-200 break-words">{notice}</p>}</section>
    </main>}
  </div>;
}
