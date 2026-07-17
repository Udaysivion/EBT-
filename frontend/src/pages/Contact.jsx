import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { dataService } from '../api/dataService'
import logo from '../assets/logo.jpg'
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validateForm = () => {
    const tempErrors = {}
    
    // 1. Name: Letters and spaces only
    const nameRegex = /^[a-zA-Z\s]+$/
    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required'
    } else if (!nameRegex.test(formData.name)) {
      tempErrors.name = 'Name must contain letters only'
    }

    // 2. Phone: Exactly 10 digits, numbers only
    const phoneRegex = /^\d{10}$/
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required'
    } else if (!phoneRegex.test(formData.phone)) {
      tempErrors.phone = 'Phone must be exactly 10 digits (numbers only)'
    }

    // 3. Email: Standard format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required'
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address'
    }

    // 4. Message content
    if (!formData.message.trim()) {
      tempErrors.message = 'Message content is required'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    let sanitizedValue = value
    let errorMsg = ''

    if (id === 'phone') {
      // Strictly allow numbers only (strip any non-digits)
      const digitsOnly = value.replace(/\D/g, '')
      // Strictly prevent entering more than 10 digits
      sanitizedValue = digitsOnly.slice(0, 10)
      
      // Real-time Phone validation
      if (!sanitizedValue) {
        errorMsg = 'Phone number is required'
      } else if (sanitizedValue.length < 10) {
        errorMsg = `Phone must be exactly 10 digits (${10 - sanitizedValue.length} digits left)`
      }
    } 
    else if (id === 'name') {
      // Filter out non-letters instantly to strictly enforce letter typing
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '')
      
      if (!sanitizedValue.trim()) {
        errorMsg = 'Name is required'
      }
    }
    else if (id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value.trim()) {
        errorMsg = 'Email address is required'
      } else if (value.includes('@') && !emailRegex.test(value)) {
        errorMsg = 'Please enter a valid email address'
      } else if (!value.includes('@')) {
        errorMsg = 'Email must include @'
      }
    }
    else if (id === 'message') {
      if (!value.trim()) {
        errorMsg = 'Message content is required'
      }
    }

    setFormData(prev => ({ ...prev, [id]: sanitizedValue }))
    setErrors(prev => ({ ...prev, [id]: errorMsg }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const result = await dataService.submitMessage(formData)
      if (result) {
        setSubmitted(true)
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('Error connecting to the server. Please try again later.')
    }
  }

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

      {/* Contact Split Section */}
      <section className="section" ref={ref}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            <span className="section-eyebrow">Reach Out</span>
            <h2 className="section-title">We're Here For You</h2>
            <p className="section-subtitle">Choose a quick channel or send a custom request below</p>
          </motion.div>

          <div className="contact-split-container">
            {/* Left Column: 2x2 Contact Cards */}
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
                  transition={{ delay: i * 0.08 }}
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

            {/* Right Column: Contact Form */}
            <motion.div
              className="contact-form-card"
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="contact-form-title">Send a Message</h3>
                    <p className="contact-form-subtitle">Have specific enquiries? Write to our team directly.</p>
                    <form className="contact-form" onSubmit={handleSubmit} noValidate>
                      <div className="form-group-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="name">Name</label>
                          <input
                            type="text"
                            id="name"
                            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                          />
                          {errors.name && <span className="form-error-msg">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="phone">Phone</label>
                          <input
                            type="tel"
                            id="phone"
                            className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="10-digit number"
                          />
                          {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="name@example.com"
                        />
                        {errors.email && <span className="form-error-msg">{errors.email}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="subject">Subject</label>
                        <input
                          type="text"
                          id="subject"
                          className="form-input"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="e.g., Franchise, Catering, Feedback"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="message">Message</label>
                        <textarea
                          id="message"
                          className={`form-textarea ${errors.message ? 'form-textarea--error' : ''}`}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Tell us what you are looking for..."
                        ></textarea>
                        {errors.message && <span className="form-error-msg">{errors.message}</span>}
                      </div>
                      <button type="submit" className="btn-primary form-submit-btn">
                        <span>Send Message</span> ➔
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    className="contact-success-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="success-icon-wrap">✓</div>
                    <h3 className="success-title">Message Sent!</h3>
                    <p className="success-text">
                      Thank you, <strong>{formData.name}</strong>. Your message has been sent successfully. We will get back to you shortly!
                    </p>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        setSubmitted(false)
                        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                      }}
                      style={{ marginTop: '12px' }}
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
              src={logo}
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
