import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import MenuCard from '../components/MenuCard'
import { menuCategories } from '../data/menuData'
import { dataService } from '../api/dataService'
import './Menu.css'

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

  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'pills'
  const scrollRef = useRef(null)

  // Build dynamic category filter options with images, counts, and emojis
  const allOption = {
    id: 'All',
    name: 'All Dishes',
    shortName: 'All',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80',
    emoji: '🍽️',
    count: categories.reduce((sum, c) => sum + (c.items?.length || 0), 0)
  }

  const categoryOptions = [
    allOption,
    ...categories.map(c => ({
      id: c.id,
      name: c.name,
      shortName: c.name.replace(' Starters', ''),
      image: c.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
      emoji: c.emoji || '🍲',
      count: c.items?.length || 0
    }))
  ]

  // 1. Filter categories by the course/category button
  const categoryMatched = activeFilter === 'All'
    ? categories
    : categories.filter(c =>
        c.id === activeFilter ||
        c.name.toLowerCase() === activeFilter.toLowerCase() ||
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

  const scrollContainer = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -280 : 280
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  const activeOption = categoryOptions.find(opt => opt.id === activeFilter || opt.name === activeFilter)

  return (
    <div className="page-wrapper">
      <section className="section menu-page-section" ref={ref}>
        <div className="container">
          
          {/* Filters Section with Category Images */}
          <motion.div
            className="menu-filters-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {/* Header / Eyebrow & View Switcher */}
            <div className="category-filter-header">
              <div className="category-filter-title-wrap">
                <span className="category-filter-eyebrow">✨ Explore Our Specialties</span>
                <h1 className="category-filter-heading">Choose by Category</h1>
              </div>

              {/* View Switcher: Cards vs Pills */}
              <div className="category-view-toggle">
                <button
                  className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setViewMode('cards')}
                  title="Visual Cards View"
                  aria-label="Visual Cards View"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <span>Photo Cards</span>
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'pills' ? 'active' : ''}`}
                  onClick={() => setViewMode('pills')}
                  title="Compact Pills View"
                  aria-label="Compact Pills View"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <circle cx="4" cy="6" r="1.5" fill="currentColor"></circle>
                    <circle cx="4" cy="12" r="1.5" fill="currentColor"></circle>
                    <circle cx="4" cy="18" r="1.5" fill="currentColor"></circle>
                  </svg>
                  <span>Pills</span>
                </button>
              </div>
            </div>

            {/* Category Filter Interactive Container */}
            <div className="category-carousel-wrapper">
              <button
                className="carousel-arrow carousel-arrow--left"
                onClick={() => scrollContainer('left')}
                aria-label="Scroll left"
              >
                ‹
              </button>

              <div
                ref={scrollRef}
                className={`category-filter-list ${viewMode === 'cards' ? 'category-filter-list--cards' : 'category-filter-list--pills'}`}
              >
                {categoryOptions.map((opt) => {
                  const isSelected = activeFilter === opt.id || (activeFilter === 'All' && opt.id === 'All')
                  return (
                    <button
                      key={opt.id}
                      className={
                        viewMode === 'cards'
                          ? `category-card-item ${isSelected ? 'category-card-item--active' : ''}`
                          : `category-pill-item ${isSelected ? 'category-pill-item--active' : ''}`
                      }
                      onClick={() => setActiveFilter(opt.id)}
                    >
                      {/* Image Frame */}
                      <div className={viewMode === 'cards' ? 'category-card-avatar' : 'category-pill-avatar'}>
                        <img
                          src={opt.image}
                          alt={opt.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex'
                            }
                          }}
                        />
                        <span className="category-fallback-emoji" style={{ display: 'none' }}>
                          {opt.emoji}
                        </span>
                        {viewMode === 'cards' && isSelected && (
                          <span className="category-card-check">✓</span>
                        )}
                      </div>

                      {/* Title & Count */}
                      <div className={viewMode === 'cards' ? 'category-card-meta' : 'category-pill-meta'}>
                        <span className="category-item-name">{opt.name}</span>
                        <span className="category-item-count">
                          {opt.count} {opt.count === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                className="carousel-arrow carousel-arrow--right"
                onClick={() => scrollContainer('right')}
                aria-label="Scroll right"
              >
                ›
              </button>
            </div>


            {/* Veg / Non-Veg Sliding Pill Selector */}
            <div className="diet-filter-pill-wrap">
              <button 
                className={`diet-pill-btn diet-pill-btn--all ${dietFilter === 'All' ? 'active' : ''}`}
                onClick={() => setDietFilter('All')}
              >
                🍽️ All Diet
              </button>
              <button 
                className={`diet-pill-btn diet-pill-btn--veg ${dietFilter === 'Veg' ? 'active' : ''}`}
                onClick={() => setDietFilter('Veg')}
              >
                🟢 Pure Veg
              </button>
              <button 
                className={`diet-pill-btn diet-pill-btn--nonveg ${dietFilter === 'Non-Veg' ? 'active' : ''}`}
                onClick={() => setDietFilter('Non-Veg')}
              >
                🔴 Non-Veg
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
