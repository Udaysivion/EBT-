import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './Contact.css'

const contacts = [
  {
    icon: '📞',
    label: 'Call Us',
    value: '+91 84998 87767',
    sub: 'Available 11 AM – 11 PM',
    href: 'tel:+918499887767',
    color: '#e85d04',
    bg: 'rgba(232,93,4,0.1)',
  },
  {
    icon: '💬',
    label: 'WhatsApp',
    value: '+91 94947 92191',
    sub: 'Quick response guaranteed',
    href: 'https://wa.me/919494792191',
    color: '#25d366',
    bg: 'rgba(37,211,102,0.1)',
  },
  {
    icon: '📸',
    label: 'Instagram',
    value: '@em_babu_thinnara_',
    sub: 'Follow our food journey',
    href: 'https://instagram.com/em_babu_thinnara_',
    color: '#e1306c',
    bg: 'rgba(225,48,108,0.1)',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'embabuthinnara@gmail.com',
    sub: 'For franchise & partnerships',
    href: 'mailto:embabuthinnara@gmail.com',
    color: '#4a90e2',
    bg: 'rgba(74,144,226,0.1)',
  },
]

const locations = [
  {
    name: 'Maisammaguda',
    address: 'Main Road, Maisammaguda, Hyderabad, Telangana',
    phone: '+91 84998 87767',
    timings: '11:00 AM – 11:00 PM',
  },
  {
    name: 'Hi-Tech City',
    address: 'Hi-Tech City, Madhapur, Hyderabad, Telangana',
    phone: '+91 84998 87767',
    timings: '11:00 AM – 11:00 PM',
  },
  {
    name: 'Gandi Maisamma',
    address: 'Gandi Maisamma, Kompally, Hyderabad, Telangana',
    phone: '+91 84998 87767',
    timings: '11:00 AM – 11:00 PM',
  },
]

export default function Contact() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero__bg" style={{
          backgroundImage: `url(https://images.pexels.com/photos/6941022/pexels-photo-6941022.jpeg?w=1400&q=80)`
        }}></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-eyebrow">Get in Touch</span>
            <h1 className="page-hero__title">Contact Us</h1>
            <p className="page-hero__subtitle">
              We'd love to hear from you — reservations, feedback, or franchise enquiries
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Cards */}
      <section className="section" ref={ref}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            <span className="section-eyebrow">Reach Out</span>
            <h2 className="section-title">We're Here For You</h2>
            <p className="section-subtitle">Choose your preferred way to reach us</p>
          </motion.div>

          <div className="contact-cards">
            {contacts.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                className="contact-card"
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                style={{ '--card-color': c.color, '--card-bg': c.bg }}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="contact-card__icon-wrap">
                  <span className="contact-card__icon">{c.icon}</span>
                </div>
                <div className="contact-card__body">
                  <span className="contact-card__label">{c.label}</span>
                  <strong className="contact-card__value">{c.value}</strong>
                  <span className="contact-card__sub">{c.sub}</span>
                </div>
                <svg className="contact-card__arrow" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="section contact-locations">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Find Us</span>
            <h2 className="section-title">Our Locations</h2>
          </div>
          <div className="locations-grid">
            {locations.map((loc, i) => (
              <motion.div
                key={loc.name}
                className="location-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="location-card__header">
                  <span className="location-card__icon">📍</span>
                  <h3 className="location-card__name">{loc.name}</h3>
                </div>
                <div className="location-card__details">
                  <div className="location-detail">
                    <span>📌</span>
                    <span>{loc.address}</span>
                  </div>
                  <div className="location-detail">
                    <span>⏰</span>
                    <span>{loc.timings}</span>
                  </div>
                  <div className="location-detail">
                    <span>📞</span>
                    <a href={`tel:${loc.phone}`}>{loc.phone}</a>
                  </div>
                </div>
                <a href={`tel:${loc.phone}`} className="location-card__cta">
                  Call This Branch
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tagline section */}
      <section className="contact-tagline">
        <div className="contact-tagline__bg"></div>
        <div className="container">
          <motion.div
            className="contact-tagline__inner"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <img
              src="https://em-babu-thinnara.firebaseapp.com/1.png"
              alt="EBT Logo"
              className="contact-tagline__logo"
            />
            <h2 className="contact-tagline__title">
              "Our Restaurant is heaven<br />to food lovers."
            </h2>
            <p className="contact-tagline__sub">— EM BABU THINNARA</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
