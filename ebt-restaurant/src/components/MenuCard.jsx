import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './MenuCard.css'

function MenuModal({ category, onClose }) {
  const [filter, setFilter] = useState('All')
  const tags = ['All', 'Veg', 'Non-Veg', 'Special']
  const filtered = filter === 'All'
    ? category.items
    : category.items.filter(item => item.tag === filter)

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
              filtered.map((item, i) => (
                <motion.div
                  key={item.name}
                  className="modal-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="modal-item-img"
                    loading="lazy"
                  />
                  <div className="modal-item-info">
                    <p className="modal-item-name">{item.name}</p>
                    <span className={`modal-item-tag modal-item-tag--${item.tag?.toLowerCase().replace(' ', '-')}`}>
                      {item.tag === 'Veg' ? '🟢' : item.tag === 'Non-Veg' ? '🔴' : '⭐'} {item.tag}
                    </span>
                  </div>
                </motion.div>
              ))
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
