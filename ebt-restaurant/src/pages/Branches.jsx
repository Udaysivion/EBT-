import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import BranchCard from '../components/BranchCard'
import { branches } from '../data/menuData'
import './Branches.css'

export default function Branches() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="page-wrapper">
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero__bg" style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=80)`
        }}></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-eyebrow">Find Us</span>
            <h1 className="page-hero__title">Our Branches</h1>
            <p className="page-hero__subtitle">
              Three locations across Hyderabad, each bringing the same authentic flavors closer to you
            </p>
          </motion.div>
        </div>
      </div>

      {/* Branch stats */}
      <div className="branches-stats">
        <div className="container">
          <div className="branches-stats__grid">
            {[
              { icon: '🏬', label: 'Locations', value: '3' },
              { icon: '👥', label: 'Daily Customers', value: '4000+' },
              { icon: '📅', label: 'Years Serving', value: '5+' },
              { icon: '⭐', label: 'Google Rating', value: '4.5★' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="branches-stat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="branches-stat__icon">{s.icon}</span>
                <span className="branches-stat__value">{s.value}</span>
                <span className="branches-stat__label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <section className="section" ref={ref}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            <span className="section-eyebrow">All Branches</span>
            <h2 className="section-title">Visit Us Today</h2>
            <p className="section-subtitle">Open 7 days a week · 11:00 AM to 11:00 PM</p>
          </motion.div>

          <div className="branches-page__grid">
            {branches.map((branch, i) => (
              <BranchCard key={branch.id} branch={branch} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Map hint section */}
      <section className="branches-contact-strip">
        <div className="container">
          <div className="branches-contact-strip__inner">
            <div className="branches-contact-strip__text">
              <h3>Can't find your nearest branch?</h3>
              <p>Call us and we'll guide you to the closest location</p>
            </div>
            <div className="branches-contact-strip__actions">
              <a href="tel:+918499887767" className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                </svg>
                +91 84998 87767
              </a>
              <a href="https://wa.me/919999999999" className="btn-outline" target="_blank" rel="noreferrer">
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
