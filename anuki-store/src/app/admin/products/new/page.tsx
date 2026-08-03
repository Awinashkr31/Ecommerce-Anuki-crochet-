"use client";
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, UploadCloud, Plus, X, Save, CheckCircle, Trash2 } from 'lucide-react';
import { compressImageToWebP } from '@/lib/imageCompression';
import { apiGet, apiPost, apiUpload } from '../../../../lib/api';

interface Category { id: string; name: string; slug: string; }
interface UploadedImage { url: string; altText: string; }

const TABS = ['Basic Info', 'Attributes & Shipping', 'SEO'];

export default function NewProductPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Basic Info
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Pricing & Inventory
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [taxSettings, setTaxSettings] = useState('');
  const [stockStatus, setStockStatus] = useState('IN_STOCK');
  const [stock, setStock] = useState<number>(0);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [hasStyles, setHasStyles] = useState(false);
  const [hasSizes, setHasSizes] = useState(false);
  const [color, setColor] = useState('');

  // Attributes & Shipping
  const [isHandmade, setIsHandmade] = useState(true);
  const [material, setMaterial] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('India');
  const [weight, setWeight] = useState<number | ''>('');
  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [shippingCharges, setShippingCharges] = useState<number | ''>('');
  const [freeShipping, setFreeShipping] = useState(false);
  
  // SEO & Flags
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  
  const { data: categories = [] } = useSWR('/categories', (url: string) => apiGet<Category[]>(url), { revalidateOnFocus: false });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  useEffect(() => {
    if (name && !isSlugManuallyEdited) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [name, isSlugManuallyEdited]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugManuallyEdited(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const compressedFile = await compressImageToWebP(file, 200, 1000); // 200KB max, 1000px max width
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('folder', 'products');
      const data = await apiUpload('/upload', formData);
      setImages([...images, { url: data.url, altText: name || 'Product image' }]);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to upload image. Please try again or check the file format.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };



  const handleSubmit = async (status: string) => {
    if (!name || !slug || !categoryId || basePrice === '') {
      setError('Please fill in Name, Slug, Category, and Base Price.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      
      const payload = {
        name, slug, shortDesc, fullDesc, categoryId,
        basePrice: Number(basePrice),
        salePrice: salePrice !== '' ? Number(salePrice) : undefined,
        taxSettings, stockStatus, stock, lowStockThreshold,
        hasStyles, hasSizes, color,
        isHandmade, material, careInstructions, countryOfOrigin,
        weight: weight !== '' ? Number(weight) : undefined,
        length: length !== '' ? Number(length) : undefined,
        width: width !== '' ? Number(width) : undefined,
        height: height !== '' ? Number(height) : undefined,
        shippingCharges: shippingCharges !== '' ? Number(shippingCharges) : undefined,
        freeShipping, seoTitle, seoDesc, seoKeywords, canonicalUrl, videoUrl,
        featured, bestseller,
        status,
        images: images.map((img, i) => ({ ...img, order: i }))
      };

      await apiPost('/products', payload);
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-3xl font-bold text-neutral-900">Add New Product</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleSubmit('DRAFT')} disabled={saving} className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
            <Save size={16} /> Save Draft
          </button>
          <button onClick={() => handleSubmit('PUBLISHED')} disabled={saving} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 flex items-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} Publish Product
          </button>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 font-medium">{error}</div>}

      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === tab ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-neutral-200 rounded-2xl shadow-sm p-8">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'Basic Info' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-4">Basic Information</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Product Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" placeholder="e.g. Sunflower Crochet Bouquet" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Slug *</label>
                  <input type="text" value={slug} onChange={handleSlugChange} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500 bg-neutral-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Category *</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500">
                  <option value="">Select a category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Short Description</label>
                <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={2} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" placeholder="Brief summary for product card..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Full Description</label>
                <textarea value={fullDesc} onChange={e => setFullDesc(e.target.value)} rows={6} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" placeholder="Detailed product description..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Product Images</label>
                <div className="flex gap-4 flex-wrap mb-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 border rounded-xl overflow-hidden group">
                      <img src={img.url} className="w-full h-full object-cover" alt="" />
                      <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100"><X size={14}/></button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-neutral-500 cursor-pointer hover:bg-neutral-50 hover:border-neutral-400">
                    {uploadingImage ? <Loader2 size={24} className="animate-spin" /> : <UploadCloud size={24} />}
                    <span className="text-xs mt-2 font-medium">Upload</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Product Video URL (Optional)</label>
                <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" placeholder="https://..." />
              </div>

              <h2 className="text-xl font-bold border-b pb-4 pt-6">Pricing</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Regular Price (₹) *</label>
                  <input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value ? Number(e.target.value) : '')} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Sale Price (₹)</label>
                  <input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value ? Number(e.target.value) : '')} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" />
                </div>
              </div>

              <h2 className="text-xl font-bold border-b pb-4 pt-6">Inventory</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Stock Status</label>
                  <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500">
                    <option value="IN_STOCK">In Stock</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                    <option value="PRE_ORDER">Pre-Order</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Stock Quantity</label>
                  <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Low Stock Alert Threshold</label>
                  <input type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" />
                </div>
              </div>

              <h2 className="text-xl font-bold border-b pb-4 pt-6">Variants Configuration, Color & Size</h2>
              <div className="grid grid-cols-1 gap-6">

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Base Color (Optional)</label>
                  <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" placeholder="e.g. Red, Blue, or #FF0000" />
                  <p className="text-xs text-neutral-500 mt-1">Enter the primary color here. Add additional colors as variants.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTRIBUTES & SHIPPING */}
          {activeTab === 'Attributes & Shipping' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-4">Product Attributes</h2>
              
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isHandmade" checked={isHandmade} onChange={e => setIsHandmade(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                <label htmlFor="isHandmade" className="font-bold text-neutral-700">This is a handmade product</label>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Base Material</label>
                  <input type="text" value={material} onChange={e => setMaterial(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" placeholder="e.g. 100% Acrylic Yarn" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Country of Origin</label>
                  <input type="text" value={countryOfOrigin} onChange={e => setCountryOfOrigin(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Care Instructions</label>
                  <textarea value={careInstructions} onChange={e => setCareInstructions(e.target.value)} rows={3} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" placeholder="e.g. Hand wash gently, do not bleach..." />
                </div>
              </div>

              <h2 className="text-xl font-bold border-b pb-4 pt-6">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Weight (grams)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value ? Number(e.target.value) : '')} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Shipping Charges (₹)</label>
                  <input type="number" value={shippingCharges} onChange={e => setShippingCharges(e.target.value ? Number(e.target.value) : '')} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" />
                </div>
                <div className="col-span-2">
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">Length (cm)</label>
                      <input type="number" value={length} onChange={e => setLength(e.target.value ? Number(e.target.value) : '')} className="w-32 border p-3 rounded-xl outline-none focus:border-rose-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">Width (cm)</label>
                      <input type="number" value={width} onChange={e => setWidth(e.target.value ? Number(e.target.value) : '')} className="w-32 border p-3 rounded-xl outline-none focus:border-rose-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">Height (cm)</label>
                      <input type="number" value={height} onChange={e => setHeight(e.target.value ? Number(e.target.value) : '')} className="w-32 border p-3 rounded-xl outline-none focus:border-rose-500" />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-3 mt-2">
                  <input type="checkbox" id="freeShipping" checked={freeShipping} onChange={e => setFreeShipping(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <label htmlFor="freeShipping" className="font-bold text-neutral-700">Offer Free Shipping for this product</label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SEO */}
          {activeTab === 'SEO' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-4">Search Engine Optimization</h2>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">SEO Title</label>
                <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" placeholder="Keep it under 60 characters" />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Meta Description</label>
                <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} rows={3} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" placeholder="Write a compelling description for search results..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Meta Keywords</label>
                <input type="text" value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} className="w-full border p-3 rounded-xl outline-none focus:border-rose-500" placeholder="crochet, handmade, bouquet..." />
              </div>
              
              <h2 className="text-xl font-bold border-b pb-4 pt-6">Marketing Flags</h2>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-5 h-5 rounded border-neutral-300 text-rose-600 focus:ring-rose-500" />
                  <span className="font-medium text-neutral-700">Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={bestseller} onChange={e => setBestseller(e.target.checked)} className="w-5 h-5 rounded border-neutral-300 text-rose-600 focus:ring-rose-500" />
                  <span className="font-medium text-neutral-700">Bestseller</span>
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
