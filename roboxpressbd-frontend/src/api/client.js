import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('rx_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rx_token')
      localStorage.removeItem('rx_user')
    }
    return Promise.reject(err)
  }
)

export default api

// Convenience helpers
export const Auth = {
  signup: (data) => api.post('/auth/signup', data).then(r => r.data),
  login:  (data) => api.post('/auth/login', data).then(r => r.data)
}

export const Catalog = {
  banners:   () => api.get('/banners/active').then(r => r.data),
  categories:() => api.get('/categories').then(r => r.data),
  brands:    () => api.get('/brands').then(r => r.data),
  products:  (params) => api.get('/products', { params }).then(r => r.data),
  product:   (slug) => api.get(`/products/${slug}`).then(r => r.data),
  featured:  () => api.get('/products/featured').then(r => r.data),
  newArrivals: () => api.get('/products/new-arrivals').then(r => r.data),
  trending:  () => api.get('/products/trending').then(r => r.data),
  backInStock: () => api.get('/products/back-in-stock').then(r => r.data),
  uploadCsv: (formData) => api.post('/products/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data)
}

export const Cart = {
  list:   () => api.get('/cart').then(r => r.data),
  add:    (productId, quantity) => api.post('/cart', { productId, quantity }).then(r => r.data),
  update: (productId, quantity) => api.put(`/cart/${productId}?quantity=${quantity}`).then(r => r.data),
  remove: (productId) => api.delete(`/cart/${productId}`).then(r => r.data),
  clear:  () => api.delete('/cart').then(r => r.data)
}

export const Orders = {
  checkout: (data) => api.post('/orders/checkout', data).then(r => r.data),
  mine:     () => api.get('/orders').then(r => r.data),
  get:      (n) => api.get(`/orders/${n}`).then(r => r.data)
}

export const Account = {
  me:    () => api.get('/account/me').then(r => r.data),
  update:(data) => api.put('/account/me', data).then(r => r.data)
}
