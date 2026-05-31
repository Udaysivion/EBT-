import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { heroImages } from '../data/menuData'
import './Hero.css'

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroImages.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hero">
      {/* Background slideshow */}
      <div className="hero__bg">
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            className="hero__slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ backgroundImage: `url(${heroImages[current]})` }}
          />
        </AnimatePresence>
        <div className="hero__overlay"></div>
        <div className="hero__overlay-gradient"></div>
      </div>

      {/* Dots */}
      <div className="hero__dots">
        {heroImages.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container hero__content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero__text"
        >
          <motion.span
            className="tag hero__tag"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            🔥 Est. 2020 · Hyderabad
          </motion.span>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Welcome to<br />
            <span className="hero__title-brand">EM BABU <br />THINNARA</span>
          </motion.h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            A family restaurant where authentic flavors meet<br className="hero__br" />
            Arabian Mandi & Hyderabadi Biryani tradition
          </motion.p>

          <motion.div
            className="hero__badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <div className="hero__badge">🍽️ Dine In</div>
            <div className="hero__badge">📦 Takeaway</div>
            <div className="hero__badge">🏬 3 Locations</div>
          </motion.div>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/menu" className="btn-primary hero__btn-main">
              Explore Our Menu
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </Link>
            <Link to="/branches" className="btn-outline hero__btn-sec">
              Our Branches
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats floating card */}
        <motion.div
          className="hero__stats"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { value: '3+', label: 'Branches' },
            { value: '50K+', label: 'Customers' },
            { value: '100+', label: 'Dishes' },
            { value: '5★', label: 'Rating' },
          ].map(stat => (
            <div key={stat.label} className="hero__stat">
              <span className="hero__stat-value">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>


    </section>
  )
}
