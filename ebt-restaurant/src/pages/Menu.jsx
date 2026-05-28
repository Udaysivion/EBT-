import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import MenuCard from '../components/MenuCard'
import { menuCategories } from '../data/menuData'
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
  const [activeFilter, setActiveFilter] = useState('All')
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  const filters = ['All', 'Biryani', 'Mandi', 'Starters', 'Rice', 'Tandoori']

  const filtered = activeFilter === 'All'
    ? menuCategories
    : menuCategories.filter(c =>
        c.name.toLowerCase().includes(activeFilter.toLowerCase()) ||
        c.id.toLowerCase().includes(activeFilter.toLowerCase())
      )

  return (
    <div className="page-wrapper">
      <PageHeader />

      <section className="section" ref={ref}>
        <div className="container">
          {/* Filter bar */}
          <motion.div
            className="menu-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {filters.map(f => (
              <button
                key={f}
                className={`menu-filter-btn ${activeFilter === f ? 'menu-filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
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
              <p>No categories found</p>
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
