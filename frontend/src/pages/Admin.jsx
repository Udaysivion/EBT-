import { useState, useEffect, useCallback } from 'react'
import logo from '../assets/logo.jpg'
import './Admin.css'

// ─── API helpers ────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() { return localStorage.getItem('ebt_admin_token') }
function authHeaders() { return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` } }

const api = {
  get: (url) => fetch(`${BASE}${url}`).then(r => r.json()),
  getAuth: (url) => fetch(`${BASE}${url}`, { headers: authHeaders() }).then(r => r.json()),
  post: (url, body) => fetch(`${BASE}${url}`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(r => r.json()),
  put: (url, body) => fetch(`${BASE}${url}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) }).then(r => r.json()),
  delete: (url) => fetch(`${BASE}${url}`, { method: 'DELETE', headers: authHeaders() }).then(r => r.json()),
  login: (u, p) => fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) }).then(r => r.json()),
}

// ─── Toast ──────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span>{t.type === 'success' ? '✓' : '✕'}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}

// ─── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

// ─── Field ──────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', textarea = false }) {
  return (
    <div className={`form-field ${textarea ? 'form-field--full' : ''}`}>
      <label>{label}</label>
      {textarea
        ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3} />
        : <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} />
      }
    </div>
  )
}

// ─── LOGIN SCREEN ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await api.login(username, password)
      if (data.token) {
        localStorage.setItem('ebt_admin_token', data.token)
        onLogin()
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch {
      setError('Server unreachable. Make sure backend is running.')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg__circle login-bg__circle--1" />
        <div className="login-bg__circle login-bg__circle--2" />
        <div className="login-bg__circle login-bg__circle--3" />
      </div>
      <div className="login-card">
        <div className="login-card__logo">
          <img src={logo} alt="EBT" />
        </div>
        <div className="login-card__brand">
          <span className="login-card__brand-name">EM BABU THINNARA</span>
          <span className="login-card__brand-sub">Admin Dashboard</span>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label>Username</label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="login-form__field">
            <label>Password</label>
            <div className="login-form__pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="login-form__eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && <div className="login-form__error">{error}</div>}
          <button type="submit" className="login-form__submit" disabled={loading}>
            {loading ? <span className="spinner" /> : '🔐 Sign In to Dashboard'}
          </button>
        </form>
        <p className="login-card__hint">Default: <code>admin</code> / <code>ebt@2024</code></p>
      </div>
    </div>
  )
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'menu',      icon: '🍽️', label: 'Menu' },
  { id: 'specials',  icon: '⭐', label: 'Specials' },
  { id: 'branches',  icon: '🏬', label: 'Branches' },
  { id: 'stats',     icon: '📈', label: 'Stats' },
  { id: 'franchise', icon: '🤝', label: 'Franchise' },
  { id: 'messages',  icon: '✉️', label: 'Messages' },
]

function Sidebar({ active, onNav, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <img src={logo} alt="EBT" className="sidebar__logo" />
        <div className="sidebar__brand">
          <span className="sidebar__brand-name">EBT Admin</span>
          <span className="sidebar__brand-sub">Control Panel</span>
        </div>
      </div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`sidebar__link ${active === item.id ? 'sidebar__link--active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar__bottom">
        <a href="/" target="_blank" className="sidebar__view-site">
          🌐 View Website
        </a>
        <button className="sidebar__logout" onClick={onLogout}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  )
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ data }) {
  const unreadCount = data.messages?.filter(m => m.status === 'unread').length ?? 0
  const cards = [
    { icon: '🍽️', label: 'Menu Categories', value: data.menu?.length ?? '—', color: '#e05a1a' },
    { icon: '🥘', label: 'Total Dishes', value: data.menu?.reduce((a, c) => a + (c.items?.length || 0), 0) ?? '—', color: '#c8410b' },
    { icon: '⭐', label: 'Specials', value: data.specials?.length ?? '—', color: '#d4a017' },
    { icon: '🏬', label: 'Branches', value: data.branches?.length ?? '—', color: '#2a7d4f' },
    { icon: '✉️', label: 'Unread Messages', value: unreadCount, color: '#4a90e2' },
  ]

  return (
    <div className="section-view">
      <div className="section-view__header">
        <h1>Dashboard</h1>
        <p>Welcome back, Admin! Here's your restaurant at a glance.</p>
      </div>
      <div className="dashboard-cards">
        {cards.map(c => (
          <div key={c.label} className="dash-card" style={{ '--accent': c.color }}>
            <div className="dash-card__icon">{c.icon}</div>
            <div className="dash-card__info">
              <span className="dash-card__value">{c.value}</span>
              <span className="dash-card__label">{c.label}</span>
            </div>
            <div className="dash-card__bar" />
          </div>
        ))}
      </div>
      <div className="dashboard-info">
        <div className="info-block">
          <h3>🔐 Access Info</h3>
          <p>Username: <code>admin</code></p>
          <p>Password: <code>ebt@2024</code></p>
          <p>URL: <code>/admin</code></p>
        </div>
        <div className="info-block">
          <h3>📡 Backend Status</h3>
          <p className="status-ok">✅ Connected to API</p>
          <p>Port: <code>3001</code></p>
          <p>Data: <code>server/data/db.json</code></p>
        </div>
        <div className="info-block">
          <h3>⚡ Quick Tips</h3>
          <p>• Use sidebar to navigate sections</p>
          <p>• Click any card to edit</p>
          <p>• Changes save to db.json instantly</p>
        </div>
      </div>
    </div>
  )
}

// ─── MENU SECTION ─────────────────────────────────────────────────────────────
function MenuSection({ showToast }) {
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [editCat, setEditCat] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [showNewCat, setShowNewCat] = useState(false)
  const [showNewItem, setShowNewItem] = useState(false)
  
  // Unified Dish Manager state
  const [subTab, setSubTab] = useState('categories') // 'categories' or 'dishes'
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [filterFoodType, setFilterFoodType] = useState('All')
  const [filterCourse, setFilterCourse] = useState('All')
  const [filterSpecialOnly, setFilterSpecialOnly] = useState(false)

  const [newCat, setNewCat] = useState({ name: '', description: '', emoji: '🍽️', image: '' })
  const [newItem, setNewItem] = useState({ 
    name: '', 
    price: '', 
    image: '', 
    foodType: 'Veg', 
    courseType: 'Main Course', 
    isSpecial: false,
    categoryId: ''
  })

  const load = useCallback(async () => {
    const data = await api.get('/menu')
    setCategories(data)
  }, [])

  useEffect(() => { load() }, [load])

  // Sync categoryId for newItem once categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !newItem.categoryId) {
      setNewItem(prev => ({ ...prev, categoryId: categories[0].id }))
    }
  }, [categories, newItem.categoryId])

  const saveCat = async () => {
    await api.put(`/admin/menu/${editCat.id}`, editCat)
    showToast('Category updated!', 'success')
    setEditCat(null); load()
  }

  const deleteCat = async (id) => {
    if (!confirm('Delete this category and all its items?')) return
    await api.delete(`/admin/menu/${id}`)
    showToast('Category deleted', 'success')
    setSelectedCat(null); load()
  }

  const addCat = async () => {
    await api.post('/admin/menu', newCat)
    showToast('Category added!', 'success')
    setShowNewCat(false); setNewCat({ name: '', description: '', emoji: '🍽️', image: '' }); load()
  }

  const saveItem = async () => {
    const catId = selectedCat?.id || editItem.categoryId
    const { categoryName, categoryId, categoryEmoji, ...cleanDish } = editItem
    
    // Sync legacy tag attribute with foodType for safety
    cleanDish.tag = cleanDish.foodType

    await api.put(`/admin/menu/${catId}/items/${editItem.id}`, cleanDish)
    showToast('Dish updated!', 'success')
    setEditItem(null); load()
    
    if (selectedCat) {
      const fresh = await api.get(`/menu/${selectedCat.id}`)
      setSelectedCat(fresh)
    }
  }

  const deleteItem = async (item) => {
    if (!confirm(`Delete ${item.name}?`)) return
    const catId = selectedCat?.id || item.categoryId
    await api.delete(`/admin/menu/${catId}/items/${item.id}`)
    showToast('Dish deleted', 'success')
    
    if (selectedCat) {
      const fresh = await api.get(`/menu/${selectedCat.id}`)
      setSelectedCat(fresh)
    }
    load()
  }

  const addItem = async () => {
    const catId = selectedCat?.id || newItem.categoryId
    if (!catId) return showToast('Please select a category', 'error')
    
    const { categoryId, ...cleanItem } = newItem
    cleanItem.tag = cleanItem.foodType

    await api.post(`/admin/menu/${catId}/items`, cleanItem)
    showToast('Dish added!', 'success')
    setShowNewItem(false)
    setNewItem({ 
      name: '', 
      price: '', 
      image: '', 
      foodType: 'Veg', 
      courseType: 'Main Course', 
      isSpecial: false,
      categoryId: categories[0]?.id || ''
    })
    
    if (selectedCat) {
      const fresh = await api.get(`/menu/${selectedCat.id}`)
      setSelectedCat(fresh)
    }
    load()
  }

  // Quick Inline Toggles for fast and easy catalog editing
  const toggleFoodType = async (dish) => {
    const newType = dish.foodType === 'Veg' ? 'Non-Veg' : 'Veg'
    const updated = { ...dish, foodType: newType, tag: newType }
    const { categoryName, categoryId, categoryEmoji, ...cleanDish } = updated
    
    await api.put(`/admin/menu/${dish.categoryId}/items/${dish.id}`, cleanDish)
    showToast(`Switched ${dish.name} to ${newType}!`, 'success')
    load()
  }

  const toggleSpecial = async (dish) => {
    const newSpecial = !dish.isSpecial
    const updated = { ...dish, isSpecial: newSpecial }
    const { categoryName, categoryId, categoryEmoji, ...cleanDish } = updated
    
    await api.put(`/admin/menu/${dish.categoryId}/items/${dish.id}`, cleanDish)
    showToast(newSpecial ? `⭐ ${dish.name} is now a Special!` : `Removed ${dish.name} from Specials`, 'success')
    load()
  }

  // Flatten all dishes across categories for the unified manager
  const allDishes = categories.flatMap(cat => 
    (cat.items || []).map(item => ({
      ...item,
      categoryName: cat.name,
      categoryId: cat.id,
      categoryEmoji: cat.emoji
    }))
  )

  const filteredDishes = allDishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCat === 'All' || dish.categoryId === filterCat
    const matchesFoodType = filterFoodType === 'All' || dish.foodType === filterFoodType
    const matchesCourse = filterCourse === 'All' || dish.courseType === filterCourse
    const matchesSpecial = !filterSpecialOnly || dish.isSpecial
    return matchesSearch && matchesCategory && matchesFoodType && matchesCourse && matchesSpecial
  })

  return (
    <div className="section-view">
      {/* Tab Switcher */}
      <div className="admin-tabs-bar">
        <button 
          className={`admin-tab-btn ${subTab === 'categories' ? 'admin-tab-btn--active' : ''}`}
          onClick={() => { setSubTab('categories'); setSelectedCat(null); }}
        >
          📁 Categories Overview
        </button>
        <button 
          className={`admin-tab-btn ${subTab === 'dishes' ? 'admin-tab-btn--active' : ''}`}
          onClick={() => setSubTab('dishes')}
        >
          🍔 Unified Dish Manager
        </button>
      </div>

      {subTab === 'categories' ? (
        // ─── TABS 1: CATEGORIES OVERVIEW ─────────────────────────────────────────
        <div>
          <div className="section-view__header">
            <div>
              <h1>Menu Categories</h1>
              <p>Manage all menu categories and their dishes</p>
            </div>
            <button className="btn-add" onClick={() => setShowNewCat(true)}>+ Add Category</button>
          </div>

          {!selectedCat ? (
            <div className="cards-grid">
              {categories.map(cat => (
                <div key={cat.id} className="item-card" onClick={() => setSelectedCat(cat)}>
                  <div className="item-card__img-wrap">
                    <img src={cat.image} alt={cat.name} loading="lazy" />
                    <span className="item-card__emoji">{cat.emoji}</span>
                  </div>
                  <div className="item-card__body">
                    <h4>{cat.name}</h4>
                    <p>{cat.description}</p>
                    <span className="item-card__count">{cat.items?.length || 0} dishes</span>
                  </div>
                  <div className="item-card__actions" onClick={e => e.stopPropagation()}>
                    <button className="btn-edit" onClick={() => setEditCat({ ...cat })}>✏️ Edit</button>
                    <button className="btn-del" onClick={() => deleteCat(cat.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="breadcrumb">
                <button onClick={() => setSelectedCat(null)}>← All Categories</button>
                <span>/</span>
                <span>{selectedCat.emoji} {selectedCat.name}</span>
              </div>
              <div className="section-view__subheader">
                <h2>{selectedCat.name} Dishes</h2>
                <button className="btn-add" onClick={() => setShowNewItem(true)}>+ Add Dish</button>
              </div>
              <div className="cards-grid cards-grid--dishes">
                {selectedCat.items?.map(item => (
                  <div key={item.id} className="dish-card">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <div className="dish-card__body">
                      <div className="dish-badges">
                        <span className={`tag-badge tag-badge--${(item.foodType || item.tag || 'Veg').toLowerCase().replace(' ', '-')}`}>
                          {item.foodType || item.tag || 'Veg'}
                        </span>
                        {item.courseType && <span className="course-badge">{item.courseType}</span>}
                        {item.isSpecial && <span className="special-badge">⭐ Special</span>}
                      </div>
                      <h5>{item.name}</h5>
                      {item.price && <span className="dish-card__price">{item.price}</span>}
                    </div>
                    <div className="dish-card__actions">
                      <button className="btn-edit" onClick={() => setEditItem({ ...item, categoryId: selectedCat.id })}>✏️</button>
                      <button className="btn-del" onClick={() => deleteItem(item)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // ─── TABS 2: UNIFIED DISH MANAGER ─────────────────────────────────────────
        <div className="unified-dish-manager">
          <div className="section-view__header">
            <div>
              <h1>Unified Dish Manager</h1>
              <p>Easily search, filter, add, update, and manage all restaurant dishes</p>
            </div>
            <button className="btn-add" onClick={() => setShowNewItem(true)}>+ Add New Dish</button>
          </div>

          {/* Unified search & filter bar */}
          <div className="manager-filter-panel">
            <div className="manager-search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search dishes by name..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>}
            </div>

            <div className="manager-filters">
              {/* Category selector */}
              <div className="filter-group">
                <label>Category</label>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Diet selector */}
              <div className="filter-group">
                <label>Type</label>
                <select value={filterFoodType} onChange={e => setFilterFoodType(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Veg">🟢 Veg Only</option>
                  <option value="Non-Veg">🔴 Non-Veg Only</option>
                </select>
              </div>

              {/* Course selector */}
              <div className="filter-group">
                <label>Course</label>
                <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
                  <option value="All">All Courses</option>
                  <option value="Starter">Starter</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Bread">Bread</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>

              {/* Specials checkbox */}
              <div className="filter-group checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={filterSpecialOnly} 
                    onChange={e => setFilterSpecialOnly(e.target.checked)} 
                  />
                  <span>⭐ Chef Specials Only</span>
                </label>
              </div>
            </div>
          </div>

          <div className="filtered-results-meta">
            Showing {filteredDishes.length} of {allDishes.length} dishes in the system
          </div>

          {/* Dishes grid */}
          <div className="cards-grid cards-grid--dishes">
            {filteredDishes.map(dish => (
              <div key={dish.id} className={`dish-card ${dish.isSpecial ? 'dish-card--special-border' : ''}`}>
                <div className="dish-card__img-wrap">
                  <img src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"} alt={dish.name} loading="lazy" />
                  
                  {/* Veg/Nonveg direct click toggle */}
                  <button 
                    className={`dish-card__quick-badge badge-diet--${(dish.foodType || 'Veg').toLowerCase()}`}
                    title="Click to toggle Veg / Non-Veg"
                    onClick={() => toggleFoodType(dish)}
                  >
                    {dish.foodType === 'Veg' ? '🟢' : '🔴'} {dish.foodType}
                  </button>

                  {/* Special status direct click toggle */}
                  <button 
                    className={`dish-card__quick-special ${dish.isSpecial ? 'active' : ''}`}
                    title="Click to toggle Chef Special"
                    onClick={() => toggleSpecial(dish)}
                  >
                    ⭐
                  </button>
                </div>

                <div className="dish-card__body">
                  <div className="dish-meta-pills">
                    <span className="pill-category">{dish.categoryEmoji} {dish.categoryName}</span>
                    <span className="pill-course">{dish.courseType || 'Main Course'}</span>
                  </div>
                  <h5>{dish.name}</h5>
                  <span className="dish-card__price">{dish.price || '—'}</span>
                </div>

                <div className="dish-card__actions">
                  <button className="btn-edit" onClick={() => setEditItem({ ...dish })}>✏️ Edit</button>
                  <button className="btn-del" onClick={() => deleteItem(dish)}>🗑️</button>
                </div>
              </div>
            ))}

            {filteredDishes.length === 0 && (
              <div className="menu-empty width-full">
                <span>🔍</span>
                <p>No dishes match your filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editCat && (
        <Modal title={`Edit Category: ${editCat.name}`} onClose={() => setEditCat(null)}>
          <Field label="Name" value={editCat.name} onChange={v => setEditCat({ ...editCat, name: v })} />
          <Field label="Description" value={editCat.description} onChange={v => setEditCat({ ...editCat, description: v })} />
          <Field label="Emoji" value={editCat.emoji} onChange={v => setEditCat({ ...editCat, emoji: v })} />
          <Field label="Image URL" value={editCat.image} onChange={v => setEditCat({ ...editCat, image: v })} />
          {editCat.image && <img src={editCat.image} alt="preview" className="img-preview" />}
          <div className="modal__footer">
            <button className="btn-cancel" onClick={() => setEditCat(null)}>Cancel</button>
            <button className="btn-save" onClick={saveCat}>💾 Save</button>
          </div>
        </Modal>
      )}

      {/* Edit Item Modal */}
      {editItem && (
        <Modal title={`Edit Dish: ${editItem.name}`} onClose={() => setEditItem(null)}>
          <Field label="Name" value={editItem.name} onChange={v => setEditItem({ ...editItem, name: v })} />
          
          <div className="form-field">
            <label>Food Type</label>
            <select value={editItem.foodType || 'Veg'} onChange={e => setEditItem({ ...editItem, foodType: e.target.value, tag: e.target.value })}>
              <option value="Veg">🟢 Veg</option>
              <option value="Non-Veg">🔴 Non-Veg</option>
            </select>
          </div>

          <div className="form-field">
            <label>Course Type</label>
            <select value={editItem.courseType || 'Main Course'} onChange={e => setEditItem({ ...editItem, courseType: e.target.value })}>
              <option value="Starter">Starter</option>
              <option value="Main Course">Main Course</option>
              <option value="Bread">Bread</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>

          <div className="form-field">
            <label className="checkbox-label flex-row">
              <input 
                type="checkbox" 
                checked={editItem.isSpecial || false} 
                onChange={e => setEditItem({ ...editItem, isSpecial: e.target.checked })} 
              />
              <span>⭐ Chef Special in Category</span>
            </label>
          </div>

          <Field label="Price (e.g. ₹150)" value={editItem.price} onChange={v => setEditItem({ ...editItem, price: v })} />
          <Field label="Image URL" value={editItem.image} onChange={v => setEditItem({ ...editItem, image: v })} />
          {editItem.image && <img src={editItem.image} alt="preview" className="img-preview" />}
          <div className="modal__footer">
            <button className="btn-cancel" onClick={() => setEditItem(null)}>Cancel</button>
            <button className="btn-save" onClick={saveItem}>💾 Save</button>
          </div>
        </Modal>
      )}

      {/* New Category Modal */}
      {showNewCat && (
        <Modal title="Add New Category" onClose={() => setShowNewCat(false)}>
          <Field label="Name" value={newCat.name} onChange={v => setNewCat({ ...newCat, name: v })} />
          <Field label="Description" value={newCat.description} onChange={v => setNewCat({ ...newCat, description: v })} />
          <Field label="Emoji" value={newCat.emoji} onChange={v => setNewCat({ ...newCat, emoji: v })} />
          <Field label="Image URL" value={newCat.image} onChange={v => setNewCat({ ...newCat, image: v })} />
          <div className="modal__footer">
            <button className="btn-cancel" onClick={() => setShowNewCat(false)}>Cancel</button>
            <button className="btn-save" onClick={addCat}>➕ Add</button>
          </div>
        </Modal>
      )}

      {/* New Dish Modal */}
      {showNewItem && (
        <Modal title="Add New Dish" onClose={() => setShowNewItem(false)}>
          <Field label="Name" value={newItem.name} onChange={v => setNewItem({ ...newItem, name: v })} />
          
          {/* Select category dropdown if we are in Unified Dish Manager */}
          {subTab === 'dishes' && (
            <div className="form-field">
              <label>Category</label>
              <select value={newItem.categoryId} onChange={e => setNewItem({ ...newItem, categoryId: e.target.value })}>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-field">
            <label>Food Type</label>
            <select value={newItem.foodType} onChange={e => setNewItem({ ...newItem, foodType: e.target.value })}>
              <option value="Veg">🟢 Veg</option>
              <option value="Non-Veg">🔴 Non-Veg</option>
            </select>
          </div>

          <div className="form-field">
            <label>Course Type</label>
            <select value={newItem.courseType} onChange={e => setNewItem({ ...newItem, courseType: e.target.value })}>
              <option value="Starter">Starter</option>
              <option value="Main Course">Main Course</option>
              <option value="Bread">Bread</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>

          <div className="form-field">
            <label className="checkbox-label flex-row">
              <input 
                type="checkbox" 
                checked={newItem.isSpecial} 
                onChange={e => setNewItem({ ...newItem, isSpecial: e.target.checked })} 
              />
              <span>⭐ Chef Special in Category</span>
            </label>
          </div>

          <Field label="Price (e.g. ₹150)" value={newItem.price} onChange={v => setNewItem({ ...newItem, price: v })} />
          <Field label="Image URL" value={newItem.image} onChange={v => setNewItem({ ...newItem, image: v })} />
          <div className="modal__footer">
            <button className="btn-cancel" onClick={() => setShowNewItem(false)}>Cancel</button>
            <button className="btn-save" onClick={addItem}>➕ Add</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── SPECIALS SECTION ─────────────────────────────────────────────────────────
function SpecialsSection({ showToast }) {
  const [specials, setSpecials] = useState([])
  const [categories, setCategories] = useState([])
  const [editItem, setEditItem] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', tag: 'Special', image: '', categoryId: '' })

  const load = useCallback(async () => {
    try {
      const [specialsData, menuData] = await Promise.all([
        api.get('/specials'),
        api.get('/menu')
      ])
      setSpecials(specialsData)
      setCategories(menuData)
    } catch {
      showToast('Error loading specials data', 'error')
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  // Sync categoryId for newItem once categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !newItem.categoryId) {
      setNewItem(prev => ({ ...prev, categoryId: categories[0].id }))
    }
  }, [categories, newItem.categoryId])

  const save = async () => {
    await api.put(`/admin/specials/${editItem.id}`, editItem)
    showToast('Special updated!', 'success'); setEditItem(null); load()
  }

  const del = async (id) => {
    if (!confirm('Delete this special?')) return
    await api.delete(`/admin/specials/${id}`)
    showToast('Deleted', 'success'); load()
  }

  const add = async () => {
    await api.post('/admin/specials', newItem)
    showToast('Special added!', 'success')
    setShowNew(false)
    setNewItem({ 
      name: '', 
      description: '', 
      price: '', 
      tag: 'Special', 
      image: '', 
      categoryId: categories[0]?.id || '' 
    })
    load()
  }

  return (
    <div className="section-view">
      <div className="section-view__header">
        <div><h1>⭐ Specials</h1><p>Chef's signature exclusive dishes</p></div>
        <button className="btn-add" onClick={() => setShowNew(true)}>+ Add Special</button>
      </div>
      <div className="cards-grid cards-grid--dishes">
        {specials.map(item => {
          const matchedCat = categories.find(c => c.id === item.categoryId)
          return (
            <div key={item.id} className="dish-card dish-card--special">
              <img src={item.image} alt={item.name} loading="lazy" />
              <div className="dish-card__body">
                <div className="dish-meta-pills">
                  <span className="tag-badge tag-badge--special">⭐ Special</span>
                  {matchedCat && (
                    <span className="pill-category">
                      {matchedCat.emoji} {matchedCat.name}
                    </span>
                  )}
                </div>
                <h5>{item.name}</h5>
                {item.price && <span className="dish-card__price">{item.price}</span>}
                {item.description && <p className="dish-card__desc">{item.description}</p>}
              </div>
              <div className="dish-card__actions">
                <button className="btn-edit" onClick={() => setEditItem({ ...item })}>✏️ Edit</button>
                <button className="btn-del" onClick={() => del(item.id)}>🗑️</button>
              </div>
            </div>
          )
        })}
      </div>
      {editItem && (
        <Modal title={`Edit: ${editItem.name}`} onClose={() => setEditItem(null)}>
          <Field label="Name" value={editItem.name} onChange={v => setEditItem({ ...editItem, name: v })} />
          
          <div className="form-field">
            <label>Menu Category</label>
            <select value={editItem.categoryId || ''} onChange={e => setEditItem({ ...editItem, categoryId: e.target.value })}>
              <option value="">No Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </div>

          <Field label="Description" value={editItem.description} onChange={v => setEditItem({ ...editItem, description: v })} textarea />
          <Field label="Price" value={editItem.price} onChange={v => setEditItem({ ...editItem, price: v })} />
          <Field label="Image URL" value={editItem.image} onChange={v => setEditItem({ ...editItem, image: v })} />
          {editItem.image && <img src={editItem.image} alt="preview" className="img-preview" />}
          <div className="modal__footer">
            <button className="btn-cancel" onClick={() => setEditItem(null)}>Cancel</button>
            <button className="btn-save" onClick={save}>💾 Save</button>
          </div>
        </Modal>
      )}
      {showNew && (
        <Modal title="Add Special Dish" onClose={() => setShowNew(false)}>
          <Field label="Name" value={newItem.name} onChange={v => setNewItem({ ...newItem, name: v })} />
          
          <div className="form-field">
            <label>Menu Category</label>
            <select value={newItem.categoryId || ''} onChange={e => setNewItem({ ...newItem, categoryId: e.target.value })}>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </div>

          <Field label="Description" value={newItem.description} onChange={v => setNewItem({ ...newItem, description: v })} textarea />
          <Field label="Price" value={newItem.price} onChange={v => setNewItem({ ...newItem, price: v })} />
          <Field label="Image URL" value={newItem.image} onChange={v => setNewItem({ ...newItem, image: v })} />
          <div className="modal__footer">
            <button className="btn-cancel" onClick={() => setShowNew(false)}>Cancel</button>
            <button className="btn-save" onClick={add}>➕ Add</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── BRANCHES SECTION ─────────────────────────────────────────────────────────
function BranchesSection({ showToast }) {
  const [branches, setBranches] = useState([])
  const [editItem, setEditItem] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', address: '', phone: '', timings: '', year: '', customers: '', description: '', quote: '', image: '' })

  const load = useCallback(async () => { setBranches(await api.get('/branches')) }, [])
  useEffect(() => { load() }, [load])

  const save = async () => {
    await api.put(`/admin/branches/${editItem.id}`, editItem)
    showToast('Branch updated!', 'success'); setEditItem(null); load()
  }

  const del = async (id) => {
    if (!confirm('Delete this branch?')) return
    await api.delete(`/admin/branches/${id}`)
    showToast('Deleted', 'success'); load()
  }

  const add = async () => {
    await api.post('/admin/branches', newItem)
    showToast('Branch added!', 'success')
    setShowNew(false); setNewItem({ name: '', address: '', phone: '', timings: '', year: '', customers: '', description: '', quote: '', image: '' }); load()
  }

  return (
    <div className="section-view">
      <div className="section-view__header">
        <div><h1>🏬 Branches</h1><p>Manage restaurant locations</p></div>
        <button className="btn-add" onClick={() => setShowNew(true)}>+ Add Branch</button>
      </div>
      <div className="cards-grid cards-grid--branches">
        {branches.map(b => (
          <div key={b.id} className="branch-card-admin">
            <img src={b.image} alt={b.name} loading="lazy" />
            <div className="branch-card-admin__body">
              <h4>{b.name}</h4>
              <p>📍 {b.address}</p>
              <p>📞 {b.phone}</p>
              <p>🕒 {b.timings}</p>
              <p>📅 Est. {b.year} · {b.customers} customers</p>
            </div>
            <div className="branch-card-admin__actions">
              <button className="btn-edit" onClick={() => setEditItem({ ...b })}>✏️ Edit</button>
              <button className="btn-del" onClick={() => del(b.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {editItem && (
        <Modal title={`Edit: ${editItem.name}`} onClose={() => setEditItem(null)}>
          <Field label="Branch Name" value={editItem.name} onChange={v => setEditItem({ ...editItem, name: v })} />
          <Field label="Address" value={editItem.address} onChange={v => setEditItem({ ...editItem, address: v })} />
          <Field label="Phone" value={editItem.phone} onChange={v => setEditItem({ ...editItem, phone: v })} />
          <Field label="Timings" value={editItem.timings} onChange={v => setEditItem({ ...editItem, timings: v })} />
          <Field label="Est. Year" value={editItem.year} onChange={v => setEditItem({ ...editItem, year: v })} />
          <Field label="Customers (e.g. 2k+)" value={editItem.customers} onChange={v => setEditItem({ ...editItem, customers: v })} />
          <Field label="Description" value={editItem.description} onChange={v => setEditItem({ ...editItem, description: v })} textarea />
          <Field label="Quote" value={editItem.quote} onChange={v => setEditItem({ ...editItem, quote: v })} />
          <Field label="Image URL" value={editItem.image} onChange={v => setEditItem({ ...editItem, image: v })} />
          {editItem.image && <img src={editItem.image} alt="preview" className="img-preview" />}
          <div className="modal__footer">
            <button className="btn-cancel" onClick={() => setEditItem(null)}>Cancel</button>
            <button className="btn-save" onClick={save}>💾 Save</button>
          </div>
        </Modal>
      )}
      {showNew && (
        <Modal title="Add New Branch" onClose={() => setShowNew(false)}>
          <Field label="Branch Name" value={newItem.name} onChange={v => setNewItem({ ...newItem, name: v })} />
          <Field label="Address" value={newItem.address} onChange={v => setNewItem({ ...newItem, address: v })} />
          <Field label="Phone" value={newItem.phone} onChange={v => setNewItem({ ...newItem, phone: v })} />
          <Field label="Timings" value={newItem.timings} onChange={v => setNewItem({ ...newItem, timings: v })} />
          <Field label="Est. Year" value={newItem.year} onChange={v => setNewItem({ ...newItem, year: v })} />
          <Field label="Customers" value={newItem.customers} onChange={v => setNewItem({ ...newItem, customers: v })} />
          <Field label="Description" value={newItem.description} onChange={v => setNewItem({ ...newItem, description: v })} textarea />
          <Field label="Quote" value={newItem.quote} onChange={v => setNewItem({ ...newItem, quote: v })} />
          <Field label="Image URL" value={newItem.image} onChange={v => setNewItem({ ...newItem, image: v })} />
          <div className="modal__footer">
            <button className="btn-cancel" onClick={() => setShowNew(false)}>Cancel</button>
            <button className="btn-save" onClick={add}>➕ Add</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── STATS SECTION ────────────────────────────────────────────────────────────
function StatsSection({ showToast }) {
  const [stats, setStats] = useState([])
  const [editItem, setEditItem] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [newItem, setNewItem] = useState({ label: '', value: '', icon: '📊' })

  const load = useCallback(async () => { setStats(await api.get('/stats')) }, [])
  useEffect(() => { load() }, [load])

  const save = async () => {
    await api.put(`/admin/stats/${editItem.id}`, editItem)
    showToast('Stat updated!', 'success'); setEditItem(null); load()
  }

  const del = async (id) => {
    if (!confirm('Delete this stat?')) return
    await api.delete(`/admin/stats/${id}`)
    showToast('Deleted', 'success'); load()
  }

  const add = async () => {
    await api.post('/admin/stats', newItem)
    showToast('Stat added!', 'success')
    setShowNew(false); setNewItem({ label: '', value: '', icon: '📊' }); load()
  }

  return (
    <div className="section-view">
      <div className="section-view__header">
        <div><h1>📈 Stats</h1><p>Hero section numbers shown on homepage</p></div>
        <button className="btn-add" onClick={() => setShowNew(true)}>+ Add Stat</button>
      </div>
      <div className="stats-admin-grid">
        {stats.map(s => (
          <div key={s.id} className="stat-admin-card">
            <div className="stat-admin-card__icon">{s.icon}</div>
            <div className="stat-admin-card__value">{s.value}</div>
            <div className="stat-admin-card__label">{s.label}</div>
            <div className="stat-admin-card__actions">
              <button className="btn-edit" onClick={() => setEditItem({ ...s })}>✏️ Edit</button>
              <button className="btn-del" onClick={() => del(s.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {editItem && (
        <Modal title="Edit Stat" onClose={() => setEditItem(null)}>
          <Field label="Icon (emoji)" value={editItem.icon} onChange={v => setEditItem({ ...editItem, icon: v })} />
          <Field label="Value (e.g. 50K+)" value={editItem.value} onChange={v => setEditItem({ ...editItem, value: v })} />
          <Field label="Label" value={editItem.label} onChange={v => setEditItem({ ...editItem, label: v })} />
          <div className="modal__footer">
            <button className="btn-cancel" onClick={() => setEditItem(null)}>Cancel</button>
            <button className="btn-save" onClick={save}>💾 Save</button>
          </div>
        </Modal>
      )}
      {showNew && (
        <Modal title="Add Stat" onClose={() => setShowNew(false)}>
          <Field label="Icon (emoji)" value={newItem.icon} onChange={v => setNewItem({ ...newItem, icon: v })} />
          <Field label="Value (e.g. 50K+)" value={newItem.value} onChange={v => setNewItem({ ...newItem, value: v })} />
          <Field label="Label" value={newItem.label} onChange={v => setNewItem({ ...newItem, label: v })} />
          <div className="modal__footer">
            <button className="btn-cancel" onClick={() => setShowNew(false)}>Cancel</button>
            <button className="btn-save" onClick={add}>➕ Add</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── FRANCHISE SECTION ────────────────────────────────────────────────────────
function FranchiseSection({ showToast }) {
  const [data, setData] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  const load = useCallback(async () => {
    const d = await api.get('/franchise'); setData(d); setForm(d)
  }, [])
  useEffect(() => { load() }, [load])

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, founderPhoto: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const save = async () => {
    await api.put('/admin/franchise', form)
    showToast('Franchise data saved!', 'success'); setEditing(false); load()
  }

  if (!data) return <div className="loading">Loading…</div>

  const f = v => {
    if (v.key === 'founderPhoto') {
      return (
        <div key={v.key} className="form-field form-field--full image-uploader-field">
          <label>{v.label}</label>
          <div className="image-uploader-preview-row">
            <img 
              src={form[v.key] || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80'} 
              alt="Founder Preview" 
              className="uploader-preview-img" 
            />
            <div className="uploader-actions">
              <input 
                type="file" 
                accept="image/*" 
                id="founder-photo-file" 
                style={{ display: 'none' }} 
                onChange={handlePhotoUpload}
              />
              <button 
                type="button" 
                className="btn-upload-file" 
                onClick={() => document.getElementById('founder-photo-file').click()}
              >
                📁 Choose Local Image
              </button>
              <input 
                type="text" 
                placeholder="Or paste an image URL here..." 
                value={form[v.key] || ''} 
                onChange={e => setForm({ ...form, [v.key]: e.target.value })} 
                className="uploader-url-input"
              />
            </div>
          </div>
        </div>
      )
    }
    return (
      <Field key={v.key} label={v.label} value={form[v.key]} onChange={val => setForm({ ...form, [v.key]: val })} textarea={v.textarea} />
    )
  }

  const fields = [
    { key: 'founderName', label: 'Founder Name' },
    { key: 'founderRole', label: 'Founder Role' },
    { key: 'founderPhoto', label: 'Founder Photo' },
    { key: 'foundedYear', label: 'Founded Year' },
    { key: 'founderBio', label: 'Founder Bio', textarea: true },
    { key: 'founderQuote', label: 'Founder Quote', textarea: true },
    { key: 'franchiseFee', label: 'Franchise Fee' },
    { key: 'totalSetupCost', label: 'Total Setup Cost' },
    { key: 'liquidFunds', label: 'Liquid Working Capital' },
    { key: 'royaltyFee', label: 'Royalty Fee' },
    { key: 'agreementTerm', label: 'Agreement Term' },
    { key: 'breakEven', label: 'Break-even Period' },
    { key: 'minArea', label: 'Min. Area Required' },
    { key: 'preferredLocation', label: 'Preferred Location Type', textarea: true },
    { key: 'parkingRequirement', label: 'Parking Requirement', textarea: true },
    { key: 'staffRequired', label: 'Staff Required' },
    { key: 'utilityRequirement', label: 'Utility Requirement (Power/Water)', textarea: true },
    { key: 'contactPhone', label: 'Contact Phone' },
    { key: 'contactEmail', label: 'Contact Email' },
    { key: 'contactWhatsapp', label: 'WhatsApp Number' },
  ]

  return (
    <div className="section-view">
      <div className="section-view__header">
        <div><h1>🤝 Franchise</h1><p>Founder profile & financial details</p></div>
        <button className={editing ? 'btn-save' : 'btn-add'} onClick={() => editing ? save() : setEditing(true)}>
          {editing ? '💾 Save Changes' : '✏️ Edit'}
        </button>
      </div>

      {!editing ? (
        <div className="franchise-view">
          <div className="franchise-view__founder">
            <img src={data.founderPhoto} alt={data.founderName} />
            <div>
              <h3>{data.founderName}</h3>
              <p>{data.founderRole} · Est. {data.foundedYear}</p>
              <blockquote>"{data.founderQuote}"</blockquote>
            </div>
          </div>
          <div className="franchise-view__grid">
            {[
              { label: 'Franchise Fee', value: data.franchiseFee },
              { label: 'Setup Cost', value: data.totalSetupCost },
              { label: 'Liquid Funds', value: data.liquidFunds },
              { label: 'Royalty', value: data.royaltyFee },
              { label: 'Agreement', value: data.agreementTerm },
              { label: 'Break-even', value: data.breakEven },
              { label: 'Area', value: data.minArea },
              { label: 'Location', value: data.preferredLocation },
              { label: 'Parking', value: data.parkingRequirement },
              { label: 'Staff', value: data.staffRequired },
              { label: 'Utilities', value: data.utilityRequirement },
            ].map(r => (
              <div key={r.label} className="fv-card">
                <span className="fv-card__label">{r.label}</span>
                <span className="fv-card__value">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="franchise-view__contact">
            <span>📞 {data.contactPhone}</span>
            <span>✉️ {data.contactEmail}</span>
          </div>
        </div>
      ) : (
        <div className="form-grid">
          {fields.map(fl => f(fl))}
          <div className="form-actions">
            <button className="btn-cancel" onClick={() => { setEditing(false); setForm(data) }}>Cancel</button>
            <button className="btn-save" onClick={save}>💾 Save All Changes</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MESSAGES SECTION ────────────────────────────────────────────────────────
function MessagesSection({ showToast }) {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'
  const [selectedMsg, setSelectedMsg] = useState(null)

  const load = useCallback(async () => {
    try {
      const data = await api.getAuth('/admin/messages')
      setMessages(data)
    } catch (err) {
      showToast('Failed to load messages', 'error')
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const toggleStatus = async (msg) => {
    const nextStatus = msg.status === 'read' ? 'unread' : 'read'
    try {
      await api.put(`/admin/messages/${msg.id}`, { status: nextStatus })
      showToast(`Marked as ${nextStatus}`, 'success')
      load()
    } catch {
      showToast('Error updating status', 'error')
    }
  }

  const deleteMsg = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    try {
      await api.delete(`/admin/messages/${id}`)
      showToast('Message deleted', 'success')
      load()
    } catch {
      showToast('Error deleting message', 'error')
    }
  }

  const filtered = messages.filter(m => {
    if (filter === 'unread') return m.status === 'unread'
    if (filter === 'read') return m.status === 'read'
    return true
  })

  return (
    <div className="section-view">
      <div className="section-view__header">
        <div>
          <h1>✉️ Contact Messages</h1>
          <p>Read and manage incoming franchise, feedback, and customer enquiries</p>
        </div>
        <div className="message-filters-bar">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({messages.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({messages.filter(m => m.status === 'unread').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({messages.filter(m => m.status === 'read').length})
          </button>
        </div>
      </div>

      <div className="messages-container">
        {filtered.length > 0 ? (
          <div className="messages-list">
            {filtered.map(msg => (
              <div 
                key={msg.id} 
                className={`message-card-admin ${msg.status === 'unread' ? 'unread' : ''}`}
                onClick={() => setSelectedMsg(msg)}
              >
                <div className="message-card-admin__header">
                  <div className="sender-info">
                    <span className="sender-avatar">👤</span>
                    <div>
                      <h4>{msg.name}</h4>
                      <p>{msg.email} {msg.phone && `· ${msg.phone}`}</p>
                    </div>
                  </div>
                  <span className="msg-date">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="message-card-admin__body">
                  <h5 className="msg-subject">Subject: {msg.subject || 'No Subject'}</h5>
                  <p className="msg-preview-text">
                    {msg.message.length > 180 ? `${msg.message.substring(0, 180)}...` : msg.message}
                  </p>
                </div>
                <div className="message-card-admin__actions" onClick={e => e.stopPropagation()}>
                  <button 
                    className={`btn-read-toggle ${msg.status === 'unread' ? 'mark-read' : 'mark-unread'}`}
                    onClick={() => toggleStatus(msg)}
                  >
                    {msg.status === 'unread' ? '👁️ Mark Read' : '📨 Mark Unread'}
                  </button>
                  <button className="btn-del" onClick={() => deleteMsg(msg.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="menu-empty width-full">
            <span>📨</span>
            <p>No messages found in this filter.</p>
          </div>
        )}
      </div>

      {selectedMsg && (
        <Modal title="Enquiry Details" onClose={() => setSelectedMsg(null)}>
          <div className="msg-detail-modal">
            <div className="msg-detail-field">
              <span className="label">Sender Name:</span>
              <strong className="value">{selectedMsg.name}</strong>
            </div>
            <div className="msg-detail-field">
              <span className="label">Email:</span>
              <a href={`mailto:${selectedMsg.email}`} className="value link">{selectedMsg.email}</a>
            </div>
            {selectedMsg.phone && (
              <div className="msg-detail-field">
                <span className="label">Phone:</span>
                <a href={`tel:${selectedMsg.phone}`} className="value link">{selectedMsg.phone}</a>
              </div>
            )}
            <div className="msg-detail-field">
              <span className="label">Received:</span>
              <span className="value">
                {new Date(selectedMsg.createdAt).toLocaleString(undefined, { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="msg-detail-field">
              <span className="label">Subject:</span>
              <span className="value bold">{selectedMsg.subject || 'No Subject'}</span>
            </div>
            <div className="msg-detail-message-box">
              <span className="label">Message:</span>
              <div className="message-text-content">{selectedMsg.message}</div>
            </div>
            <div className="modal__footer">
              <button 
                className="btn-read-toggle mark-read" 
                onClick={() => { toggleStatus(selectedMsg); setSelectedMsg(null); }}
              >
                {selectedMsg.status === 'unread' ? '👁️ Mark Read' : '📨 Mark Unread'}
              </button>
              <button className="btn-cancel" onClick={() => setSelectedMsg(null)}>Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [toasts, setToasts] = useState([])
  const [allData, setAllData] = useState({})

  // Verify existing token on mount
  useEffect(() => {
    const token = getToken()
    if (token) {
      fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => { if (d.valid) setIsLoggedIn(true) })
        .catch(() => {})
    }
  }, [])

  // Load dashboard data
  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([
        api.get('/menu'),
        api.get('/specials'),
        api.get('/branches'),
        api.get('/stats'),
        api.getAuth('/admin/messages'),
      ]).then(([menu, specials, branches, stats, messages]) => {
        setAllData({ menu, specials, branches, stats, messages })
      })
    }
  }, [isLoggedIn])

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem('ebt_admin_token')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard data={allData} />
      case 'menu':      return <MenuSection showToast={showToast} />
      case 'specials':  return <SpecialsSection showToast={showToast} />
      case 'branches':  return <BranchesSection showToast={showToast} />
      case 'stats':     return <StatsSection showToast={showToast} />
      case 'franchise': return <FranchiseSection showToast={showToast} />
      case 'messages':  return <MessagesSection showToast={showToast} />
      default:          return <Dashboard data={allData} />
    }
  }

  return (
    <div className="admin-layout">
      <Toast toasts={toasts} />
      <Sidebar active={activeSection} onNav={setActiveSection} onLogout={handleLogout} />
      <main className="admin-main">
        {renderSection()}
      </main>
    </div>
  )
}
