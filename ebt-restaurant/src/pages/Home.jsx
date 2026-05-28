import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Hero from '../components/Hero'
import MenuCard from '../components/MenuCard'
import BranchCard from '../components/BranchCard'
import { menuCategories, branches, stats } from '../data/menuData'
import './Home.css'

function StatsBar() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  return (
    <div className="stats-bar" ref={ref}>
      <div className="container">
        <div className="stats-bar__grid">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stats-bar__item"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <span className="stats-bar__value">{stat.value}</span>
              <span className="stats-bar__label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AboutSection() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })
  return (
    <section className="section about-section" ref={ref}>
      <div className="container">
        <div className="about-section__grid">
          <motion.div
            className="about-section__images"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="about-img-stack">
              <img
                src="https://images.pexels.com/photos/6294377/pexels-photo-6294377.jpeg?w=600&q=80"
                alt="Restaurant interior"
                className="about-img about-img--main"
                loading="lazy"
              />
              <img
                src="https://images.pexels.com/photos/5339083/pexels-photo-5339083.jpeg?w=400&q=80"
                alt="Food"
                className="about-img about-img--secondary"
                loading="lazy"
              />
              <div className="about-img__badge">
                <span>🏆</span>
                <strong>Best Biryani</strong>
                <small>Hyderabad 2023</small>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about-section__content"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="section-eyebrow">Our Story</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              Where Every Meal<br />Becomes a Memory
            </h2>
            <p className="about-section__text">
              At EBT, we pride ourselves on offering a unique and memorable dining experience. With a menu that blends traditional and modern flavors, an inviting atmosphere, and exceptional service, we strive to exceed your expectations every time you visit.
            </p>
            <p className="about-section__text">
              The dining experience is about more than just the food. We've created a warm and welcoming atmosphere that makes our customers feel right at home — whether you're grabbing a quick lunch, celebrating a special occasion, or enjoying a romantic dinner.
            </p>
            <div className="about-section__features">
              {[
                { icon: '🍳', title: 'Fresh Ingredients', desc: 'Only the finest quality produce' },
                { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Years of culinary mastery' },
                { icon: '❤️', title: 'Made with Love', desc: 'Every dish crafted with passion' },
              ].map(f => (
                <div key={f.title} className="about-feature">
                  <span className="about-feature__icon">{f.icon}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <span>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <blockquote className="about-section__quote">
              "Our Restaurant is heaven to food lovers."
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeaturedMenu() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const scrollRef = useRef(null)
  const featured = menuCategories.slice(0, 6)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0
    }
    
    // Counteract CSS scroll-snapping anomalies triggered by Framer Motion entry animations
    const timeouts = [100, 300, 600, 1000].map(delay =>
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = 0
        }
      }, delay)
    )

    return () => timeouts.forEach(clearTimeout)
  }, [inView])

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Taste the Best</span>
          <h2 className="section-title">Our Signature Menu</h2>
          <p className="section-subtitle">
            From aromatic biryanis to authentic Arabian mandi — a culinary journey awaits
          </p>
        </motion.div>
      </div>
      <div className="h-scroll" ref={scrollRef}>
        {featured.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08 }}
          >
            <MenuCard category={cat} />
          </motion.div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/menu" className="btn-primary">
          View Full Menu
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </Link>
      </div>
    </section>
  )
}

function FeaturedBranches() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <section className="section branches-preview" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Find Us Near You</span>
          <h2 className="section-title">Our Locations</h2>
          <p className="section-subtitle">
            Three branches across Hyderabad, each serving the same legendary flavors
          </p>
        </motion.div>
        <div className="branches-preview__grid">
          {branches.map((branch, i) => (
            <BranchCard key={branch.id} branch={branch} index={i} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link to="/branches" className="btn-outline">
            View All Branches
          </Link>
        </div>
      </div>
    </section>
  )
}

function FranchiseCTA() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  return (
    <section className="franchise-cta" ref={ref}>
      <div className="franchise-cta__bg"></div>
      <div className="container">
        <motion.div
          className="franchise-cta__inner"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <img
            src="https://em-babu-thinnara.firebaseapp.com/1.png"
            alt="EBT Logo"
            className="franchise-cta__logo"
          />
          <span className="section-eyebrow">Join Our Family</span>
          <h2 className="franchise-cta__title">Own an EBT Franchise</h2>
          <p className="franchise-cta__text">
            Join us and spread the joy of food with a new branch of EBT in your city. Proven business model, brand recognition, and full support from day one.
          </p>
          <div className="franchise-cta__actions">
            <Link to="/franchise" className="btn-primary">
              Learn More
            </Link>
            <a href="tel:+919494792191" className="btn-outline">
              📞 Call Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="page-wrapper" style={{ paddingTop: 0 }}>
      <Hero />
      <StatsBar />
      <AboutSection />
      <FeaturedMenu />
      <FeaturedBranches />
      <FranchiseCTA />
    </div>
  )
}
