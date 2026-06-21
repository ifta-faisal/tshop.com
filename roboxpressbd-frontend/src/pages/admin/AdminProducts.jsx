import { useState, useEffect } from 'react'
import { Catalog, Admin } from '../../api/client'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    price: '',
    categoryId: '',
    brandId: '',
    sku: '',
    stock: '',
    imageUrl: '',
    description: '',
    flashSaleEnabled: false,
    flashSalePrice: '',
    flashSaleEndDate: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        Admin.products(),
        Catalog.categories(),
        Catalog.brands()
      ])
      setProducts(prodRes.content || [])
      setCategories(catRes || [])
      setBrands(brandRes || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        brandId: formData.brandId ? parseInt(formData.brandId) : null,
        slug: generateSlug(formData.name),
        flashSaleEnabled: formData.flashSaleEnabled,
        flashSalePrice: formData.flashSalePrice ? parseFloat(formData.flashSalePrice) : null,
        flashSaleEndDate: formData.flashSaleEndDate ? new Date(formData.flashSaleEndDate).toISOString() : null
      }

      if (formData.id) {
        // Edit
        await Admin.updateProduct(formData.id, payload)
        alert('Product updated!')
      } else {
        // Create
        await Admin.createProduct(payload)
        alert('Product created!')
      }
      
      // Reset form and refresh list
      setFormData({ id: null, name: '', price: '', categoryId: '', brandId: '', sku: '', stock: '', imageUrl: '', description: '', flashSaleEnabled: false, flashSalePrice: '', flashSaleEndDate: '' })
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name || '',
      price: product.price || '',
      categoryId: product.category?.id || '',
      brandId: product.brand?.id || '',
      sku: product.sku || '',
      stock: product.stock || '',
      imageUrl: product.imageUrl || '',
      description: product.description || '',
      flashSaleEnabled: product.flashSaleEnabled || false,
      flashSalePrice: product.flashSalePrice || '',
      flashSaleEndDate: product.flashSaleEndDate ? product.flashSaleEndDate.slice(0,16) : ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await Admin.deleteProduct(id)
        setProducts(products.filter(p => p.id !== id))
      } catch (err) {
        alert('Failed to delete product')
        console.error(err)
      }
    }
  }

  const inputClass = "w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#16a34a]"

  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase().replace(/\s+/g, '')
    return p.name?.toLowerCase().replace(/\s+/g, '').includes(q) || 
           p.sku?.toLowerCase().replace(/\s+/g, '').includes(q) ||
           p.category?.name?.toLowerCase().replace(/\s+/g, '').includes(q)
  })

  return (
    <div className="p-8">
      {/* Product Form */}
      <div className="mb-12 border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{formData.id ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className={inputClass} />
            </div>
            <div>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" className={inputClass} />
            </div>
            <div>
              <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className={inputClass}>
                <option value="">Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <select name="brandId" value={formData.brandId} onChange={handleInputChange} className={inputClass}>
                <option value="">Vendor</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="SKU (Unique)" className={inputClass} />
            </div>
            <div>
              <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stock" className={inputClass} />
            </div>
            <div>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="Image URL" className={inputClass} />
            </div>
          </div>
          
          <div className="mb-6">
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" rows="4" className={inputClass}></textarea>
          </div>
          
          {/* Flash Sale Engine */}
          <div className="mb-6 border border-dashed border-pink-500 rounded-lg p-6 bg-pink-50/30">
            <h3 className="text-pink-600 font-bold mb-4">Flash Sale Engine</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <input 
                  type="checkbox" 
                  name="flashSaleEnabled" 
                  checked={formData.flashSaleEnabled} 
                  onChange={handleInputChange} 
                  className="w-4 h-4 accent-pink-600" 
                />
                <span className="text-sm text-slate-700">Enable Flash Sale</span>
              </label>
              <div className="flex-1 w-full">
                <input 
                  type="number" 
                  step="0.01" 
                  name="flashSalePrice" 
                  value={formData.flashSalePrice} 
                  onChange={handleInputChange} 
                  placeholder="Flash Sale Price" 
                  className={inputClass} 
                  disabled={!formData.flashSaleEnabled}
                />
              </div>
              <div className="flex-1 w-full">
                <input 
                  type="datetime-local" 
                  name="flashSaleEndDate" 
                  value={formData.flashSaleEndDate} 
                  onChange={handleInputChange} 
                  className={inputClass} 
                  disabled={!formData.flashSaleEnabled}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            {formData.id && (
              <button type="button" onClick={() => setFormData({ id: null, name: '', price: '', categoryId: '', brandId: '', sku: '', stock: '', imageUrl: '', description: '', flashSaleEnabled: false, flashSalePrice: '', flashSaleEndDate: '' })} className="px-6 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition">
                Cancel Edit
              </button>
            )}
            <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-[#16a34a] rounded hover:bg-green-700 transition">
              {formData.id ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Products Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Existing Products ({filteredProducts.length})</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-[#16a34a] w-64"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading products...</div>
        ) : (
          <div className="border border-slate-200 rounded overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 bg-white">
              <thead className="bg-[#f4f4f4] border-b border-slate-200 text-slate-600 font-bold text-xs">
                <tr>
                  <th className="px-4 py-3 uppercase">Name</th>
                  <th className="px-4 py-3 uppercase">Category</th>
                  <th className="px-4 py-3 uppercase">Price</th>
                  <th className="px-4 py-3 uppercase">Stock</th>
                  <th className="px-4 py-3 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.category?.name || '-'}</td>
                    <td className="px-4 py-3">৳{product.price}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col items-end gap-1 font-semibold text-xs">
                        <button onClick={() => handleEdit(product)} className="text-[#1a73e8] hover:underline">Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="text-[#16a34a] hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
