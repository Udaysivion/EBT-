import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './MenuCard.css'

function MenuModal({ category, onClose }) {
  const [filter, setFilter] = useState('All')
  const tags = ['All', 'Veg', 'Non-Veg', 'Special']
  
  const filtered = (category.items || []).filter(item => {
    const isVeg = item.foodType === 'Veg' || item.tag === 'Veg'
    const isNonVeg = item.foodType === 'Non-Veg' || item.tag === 'Non-Veg'
    const isSpecial = item.isSpecial || item.tag === 'Special'
    
    if (filter === 'All') return true
    if (filter === 'Veg') return isVeg
    if (filter === 'Non-Veg') return isNonVeg
    if (filter === 'Special') return isSpecial
    return true
  })

  // Grouping logic - pull specials out first
  const specials = filtered.filter(i => i.isSpecial || i.tag === 'Special')

  const starters = filtered.filter(i => 
    !specials.includes(i) &&
    (i.courseType === 'Starter' || 
     category.id === 'starters' || 
     category.id === 'tandoori')
  )
  
  const breads = filtered.filter(i => 
    !specials.includes(i) &&
    (i.courseType === 'Bread' || 
     category.id === 'rotis')
  )
  
  const desserts = filtered.filter(i => 
    !specials.includes(i) &&
    i.courseType === 'Dessert'
  )
  
  const mainCourses = filtered.filter(i => 
    !specials.includes(i) &&
    !starters.includes(i) && 
    !breads.includes(i) && 
    !desserts.includes(i)
  )

  const renderItemCard = (item, i) => {
    const isItemSpecial = item.isSpecial || item.tag === 'Special'
    const itemFoodType = item.foodType || item.tag || 'Veg'

    return (
      <motion.div
        key={item.name + '-' + i}
        className={`modal-item ${isItemSpecial ? 'modal-item--special-glow' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.04 }}
      >
        <div className="modal-item-img-wrap">
          <img
            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
            alt={item.name}
            className="modal-item-img"
            loading="lazy"
          />
          {isItemSpecial && <span className="modal-item-special-badge">⭐ chef special</span>}
        </div>
        <div className="modal-item-info">
          <p className="modal-item-name">{item.name}</p>
          <div className="modal-item-footer">
            <span className={`modal-item-tag modal-item-tag--${itemFoodType.toLowerCase().replace(' ', '-')}`}>
              {itemFoodType === 'Veg' ? '🟢' : '🔴'} {itemFoodType}
            </span>
            {item.price && <span className="modal-item-price">{item.price}</span>}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="modal-header-left">
              <span className="modal-emoji">{category.emoji}</span>
              <div>
                <h2 className="modal-title">{category.name}</h2>
                <p className="modal-desc">{category.description}</p>
              </div>
            </div>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          {/* Filter tabs */}
          <div className="modal-filters">
            {tags.map(tag => (
              <button
                key={tag}
                className={`modal-filter-btn ${filter === tag ? 'modal-filter-btn--active' : ''}`}
                onClick={() => setFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="modal-items">
            {filtered.length === 0 ? (
              <p className="modal-empty">No items in this category</p>
            ) : (
              <>
                {/* Specials Section first */}
                {specials.length > 0 && (
                  <>
                    <h4 className="modal-course-title specials-course-title">⭐ Chef Signature Specials</h4>
                    {specials.map((item, i) => renderItemCard(item, i))}
                  </>
                )}

                {/* Starters Section */}
                {starters.length > 0 && (
                  <>
                    <h4 className="modal-course-title">🍗 Starters & Appetizers</h4>
                    {starters.map((item, i) => renderItemCard(item, i))}
                  </>
                )}

                {/* Main Course Section */}
                {mainCourses.length > 0 && (
                  <>
                    <h4 className="modal-course-title">🍛 Main Course Dishes</h4>
                    {mainCourses.map((item, i) => renderItemCard(item, i))}
                  </>
                )}

                {/* Breads Section */}
                {breads.length > 0 && (
                  <>
                    <h4 className="modal-course-title">🫓 Fresh Breads & Rotis</h4>
                    {breads.map((item, i) => renderItemCard(item, i))}
                  </>
                )}

                {/* Desserts Section */}
                {desserts.length > 0 && (
                  <>
                    <h4 className="modal-course-title">🍨 Desserts & Sweet Treats</h4>
                    {desserts.map((item, i) => renderItemCard(item, i))}
                  </>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function MenuCard({ category }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.div
        className="menu-card"
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="menu-card__img-wrap">
          <img
            src={category.image}
            alt={category.name}
            className="menu-card__img"
            loading="lazy"
          />
          <div className="menu-card__overlay"></div>
          <span className="menu-card__emoji">{category.emoji}</span>
          <span className="menu-card__count">{category.items.length} items</span>
        </div>
        <div className="menu-card__body">
          <h3 className="menu-card__name">{category.name}</h3>
          <p className="menu-card__desc">{category.description}</p>
          <button className="menu-card__btn" onClick={() => setOpen(true)}>
            View Menu
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      </motion.div>

      {open && <MenuModal category={category} onClose={() => setOpen(false)} />}
    </>
  )
}
