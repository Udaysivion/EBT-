import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import MenuCard from '../components/MenuCard'
import { menuCategories } from '../data/menuData'
import { dataService } from '../api/dataService'
import './Menu.css'

function PageHeader() {
  return (
    <div className="page-hero">
      <div className="page-hero__bg" style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1400&q=80)`
      }}></div>
      <div className="page-hero__overlay"></div>
      <div className="container page-hero__content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">Explore</span>
          <h1 className="page-hero__title">Our Menu</h1>
          <p className="page-hero__subtitle">
            A culinary journey through authentic flavors — from Hyderabadi Biryani to Arabian Mandi and beyond
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function Menu() {
  const [categories, setCategories] = useState(menuCategories)
  const [activeFilter, setActiveFilter] = useState('All')
  const [dietFilter, setDietFilter] = useState('All') // 'All', 'Veg', 'Non-Veg'
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  useEffect(() => {
    dataService.getMenu().then(data => {
      if (data && data.length > 0) {
        setCategories(data)
      }
    })
  }, [])

  const filters = ['All', 'Biryani', 'Mandi', 'Starters', 'Rice', 'Tandoori']

  // 1. Filter categories by the course/category button
  const categoryMatched = activeFilter === 'All'
    ? categories
    : categories.filter(c =>
        c.name.toLowerCase().includes(activeFilter.toLowerCase()) ||
        c.id.toLowerCase().includes(activeFilter.toLowerCase())
      )

  // 2. Map and filter individual items based on the Veg/Non-Veg sliding filter
  const filtered = categoryMatched.map(c => {
    const filteredItems = (c.items || []).filter(item => {
      const isVeg = item.foodType === 'Veg' || item.tag === 'Veg'
      const isNonVeg = item.foodType === 'Non-Veg' || item.tag === 'Non-Veg'

      if (dietFilter === 'All') return true
      if (dietFilter === 'Veg') return isVeg
      if (dietFilter === 'Non-Veg') return isNonVeg
      return true
    })
    return { ...c, items: filteredItems }
  }).filter(c => c.items.length > 0) // Only display categories that contain matching dishes!

  return (
    <div className="page-wrapper">
      <PageHeader />

      <section className="section" ref={ref}>
        <div className="container">
          
          {/* Filters Bar */}
          <motion.div
            className="menu-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {/* Category selection row */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginBottom: '16px' }}>
              {filters.map(f => (
                <button
                  key={f}
                  className={`menu-filter-btn ${activeFilter === f ? 'menu-filter-btn--active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Veg / Non-Veg Sliding Pill Selector */}
            <div className="diet-filter-pill-wrap">
              <button 
                className={`diet-pill-btn diet-pill-btn--all ${dietFilter === 'All' ? 'active' : ''}`}
                onClick={() => setDietFilter('All')}
              >
                🍽️ All
              </button>
              <button 
                className={`diet-pill-btn diet-pill-btn--veg ${dietFilter === 'Veg' ? 'active' : ''}`}
                onClick={() => setDietFilter('Veg')}
              >
                🟢 Veg Only
              </button>
              <button 
                className={`diet-pill-btn diet-pill-btn--nonveg ${dietFilter === 'Non-Veg' ? 'active' : ''}`}
                onClick={() => setDietFilter('Non-Veg')}
              >
                🔴 Non-Veg Only
              </button>
            </div>
          </motion.div>

          {/* Grid of categories */}
          <div className="menu-page__grid">
            {filtered.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07 }}
              >
                <MenuCard category={cat} />
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="menu-empty">
              <span>🍽️</span>
              <p>No dishes found matching your criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="menu-cta">
        <div className="container">
          <div className="menu-cta__inner">
            <div>
              <h3 className="menu-cta__title">Want to reserve a table?</h3>
              <p className="menu-cta__text">Call us and we'll ensure a perfect dining experience</p>
            </div>
            <div className="menu-cta__actions">
              <a href="tel:+918499887767" className="btn-primary">
                📞 +91 84998 87767
              </a>
              <a href="https://wa.me/919494792191" className="btn-outline" target="_blank" rel="noreferrer">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
