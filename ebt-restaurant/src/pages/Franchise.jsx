import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './Franchise.css'

const benefits = [
  {
    icon: '📋',
    title: 'Proven Business Model',
    desc: 'Benefit from our tested and refined operational system with site selection, lease negotiation, and setup support.'
  },
  {
    icon: '🎓',
    title: 'Complete Training',
    desc: 'Comprehensive training program covering cooking standards, staff management, and customer service excellence.'
  },
  {
    icon: '📣',
    title: 'Marketing Support',
    desc: 'Leverage our established brand recognition. We provide ongoing marketing materials and campaign support.'
  },
  {
    icon: '🤝',
    title: 'Operational Assistance',
    desc: 'Continuous operational support to ensure you run smoothly and consistently uphold our quality standards.'
  },
  {
    icon: '🏆',
    title: 'Brand Recognition',
    desc: 'Tap into the loyal customer base EBT has built since 2020 across multiple Hyderabad locations.'
  },
  {
    icon: '📈',
    title: 'Profitable Returns',
    desc: 'Our franchisees see strong ROI backed by high customer footfall and proven revenue models.'
  },
]

const steps = [
  { num: '01', title: 'Enquiry', desc: 'Reach out via call or WhatsApp to express your interest' },
  { num: '02', title: 'Discussion', desc: 'Meet our team to understand the franchise model and requirements' },
  { num: '03', title: 'Agreement', desc: 'Sign the franchise agreement and finalize terms' },
  { num: '04', title: 'Setup & Training', desc: 'Site setup, kitchen equipment, and full staff training' },
  { num: '05', title: 'Launch', desc: 'Grand opening with full support from the EBT team' },
]

function BenefitCard({ benefit, index }) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      className="benefit-card"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08 }}
    >
      <div className="benefit-card__icon">{benefit.icon}</div>
      <h3 className="benefit-card__title">{benefit.title}</h3>
      <p className="benefit-card__desc">{benefit.desc}</p>
    </motion.div>
  )
}

export default function Franchise() {
  const { ref: stepsRef, inView: stepsInView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero__bg" style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80)`
        }}></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-eyebrow">Partner With Us</span>
            <h1 className="page-hero__title">Own an Aatithi Bhavan<br />Franchise</h1>
            <p className="page-hero__subtitle">
              Join us and spread the joy of food with a new branch of Aatithi Bhavan in your city
            </p>
          </motion.div>
        </div>
      </div>

      {/* Intro */}
      <section className="section franchise-intro">
        <div className="container">
          <div className="franchise-intro__grid">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img
                src="https://em-babu-thinnara.firebaseapp.com/1.png"
                alt="EBT Logo"
                className="franchise-intro__logo"
              />
              <span className="section-eyebrow">Why Aatithi Bhavan?</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                Start Your Food Journey with a Trusted Brand
              </h2>
              <p className="franchise-intro__text">
                Aatithi Bhavan franchising is an excellent option for those who want to start their own business with a passion for the food sector but lack the experience or resources to build from scratch. One of the most significant advantages is our proven business model and comprehensive support system.
              </p>
              <p className="franchise-intro__text">
                Customers are more likely to visit a restaurant they recognize and trust. With EBT's established brand and loyal following across Hyderabad, you can attract and retain customers from day one.
              </p>
              <blockquote className="franchise-intro__quote">
                "Join us — let's spread the joy of food with a new branch of EBT in your city."
              </blockquote>
              <div className="franchise-intro__actions">
                <a href="tel:+919494792191" className="btn-primary">
                  📞 Call to Enquire
                </a>
                <a href="https://wa.me/919494792191" className="btn-outline" target="_blank" rel="noreferrer">
                  💬 WhatsApp
                </a>
              </div>
            </motion.div>

            <motion.div
              className="franchise-intro__stats"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {[
                { value: '3', label: 'Active Franchises', icon: '🏬' },
                { value: '₹₹', label: 'Investment Range', icon: '💰' },
                { value: '6mo', label: 'Avg. Break-even', icon: '📈' },
                { value: '24/7', label: 'Support Available', icon: '🤝' },
              ].map(s => (
                <div key={s.label} className="franchise-stat-box">
                  <span className="franchise-stat-box__icon">{s.icon}</span>
                  <span className="franchise-stat-box__value">{s.value}</span>
                  <span className="franchise-stat-box__label">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section franchise-benefits">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">What You Get</span>
            <h2 className="section-title">Franchise Benefits</h2>
            <p className="section-subtitle">Everything you need to run a successful Aatithi Bhavan restaurant</p>
          </div>
          <div className="benefits-grid">
            {benefits.map((b, i) => (
              <BenefitCard key={b.title} benefit={b} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section franchise-steps" ref={stepsRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">The Process</span>
            <h2 className="section-title">How to Get Started</h2>
          </div>
          <div className="steps-list">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="step-item"
                initial={{ opacity: 0, x: -30 }}
                animate={stepsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.12 }}
              >
                <div className="step-item__num">{step.num}</div>
                <div className="step-item__connector"></div>
                <div className="step-item__body">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="franchise-final-cta">
        <div className="franchise-final-cta__bg"></div>
        <div className="container">
          <motion.div
            className="franchise-final-cta__inner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="franchise-final-cta__title">Ready to Start?</h2>
            <p className="franchise-final-cta__text">
              Get in touch with our franchise team today. We're ready to help you build your dream restaurant.
            </p>
            <div className="franchise-final-cta__contacts">
              <a href="tel:+919999999999" className="franchise-contact-link">
                <div className="franchise-contact-link__icon">📞</div>
                <div>
                  <strong>Call Us</strong>
                  <span>+919999999999</span>
                </div>
              </a>
              <a href="https://wa.me/9999999999" className="franchise-contact-link" target="_blank" rel="noreferrer">
                <div className="franchise-contact-link__icon">💬</div>
                <div>
                  <strong>WhatsApp</strong>
                  <span>+91 99999 99999</span>
                </div>
              </a>
              <a href="mailto:aatithibhavan@gmail.com" className="franchise-contact-link">
                <div className="franchise-contact-link__icon">✉️</div>
                <div>
                  <strong>Email Us</strong>
                  <span>aatithi@gmail.com</span>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
