import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dataService } from '../api/dataService'
import './Franchise.css'

/* ─── DATA ─────────────────────────────────────────────── */

const keys = [
  { icon: '💰', text: 'Affordable franchise fee with minimal upfront investment risk' },
  { icon: '🎓', text: 'Comprehensive pre-launch training for you and your entire team' },
  { icon: '🚚', text: 'Centralized supply chain ensuring consistent signature taste across outlets' },
  { icon: '🏆', text: 'Strong brand recognition — 5+ years of trust in Hyderabad' },
  { icon: '🤝', text: 'Dedicated franchise support team available throughout your journey' },
  { icon: '🍽️', text: 'Proven recipes and signature dishes that drive repeat customer visits' },
  { icon: '📣', text: 'Full marketing & social media support for all franchise outlets' },
  { icon: '✅', text: 'Regular quality audits to uphold EBT standards at every location' },
]

const decor = [
  {
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80',
    caption: 'Grand Dining Hall',
  },
  {
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80',
    caption: 'Warm Ambience',
  },
  {
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80',
    caption: 'Signature Spread',
  },
  {
    img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=700&q=80',
    caption: 'Kitchen Excellence',
  },
]

const processSteps = [
  { num: '01', icon: '📞', title: 'Initial Enquiry', desc: 'Reach out via call or WhatsApp to express your interest.' },
  { num: '02', icon: '🤝', title: 'Meet Our Team', desc: 'Schedule a meeting to understand the model & investment.' },
  { num: '03', icon: '📍', title: 'Site Selection', desc: 'We assist in evaluating the ideal location for your outlet.' },
  { num: '04', icon: '📝', title: 'Franchise Agreement', desc: 'Sign the agreement and officially become an EBT partner.' },
  { num: '05', icon: '🍳', title: 'Setup & Training', desc: 'Full kitchen setup, interior design & staff training by EBT.' },
  { num: '06', icon: '🎉', title: 'Grand Opening', desc: 'Launch with full marketing & operational support from us.' },
]

const financials = [
  { label: 'Franchise Fee', value: '₹ 5 Lakhs', note: 'One-time onboarding fee', icon: '🏷️' },
  { label: 'Total Setup Cost', value: '₹ 20–35 Lakhs', note: 'Varies by location & size', icon: '🏗️' },
  { label: 'Royalty Fee', value: '5% of Revenue', note: 'Monthly, on gross sales', icon: '📊' },
  { label: 'Agreement Term', value: '5 Years', note: 'Renewable on mutual terms', icon: '📅' },
  { label: 'Break-even Period', value: '8–14 Months', note: 'Typical ROI timeline', icon: '📈' },
  { label: 'Min. Area Required', value: '1000–2500 sq.ft', note: 'Dine-in + kitchen space', icon: '📐' },
]

const faqs = [
  {
    q: 'What is the total investment required to open an EBT franchise?',
    a: 'The total investment typically ranges from ₹20 to ₹35 Lakhs depending on your location, city tier, and size of the outlet. This includes the franchise fee, interior setup, kitchen equipment, and initial inventory.',
  },
  {
    q: 'Do I need prior experience in the food industry?',
    a: 'No prior experience is necessary. EBT provides complete training covering kitchen operations, staff management, customer service, hygiene standards, and business operations before your launch.',
  },
  {
    q: 'How long does it take to set up the franchise after signing the agreement?',
    a: 'Typically, it takes 45 to 90 days from the agreement date to the grand opening, depending on the availability of the site, interior work completion, and local approvals.',
  },
  {
    q: 'Does EBT provide marketing support to franchisees?',
    a: 'Yes. EBT provides branded marketing materials, social media support, and digital campaign assistance for all franchise outlets, especially during the launch phase.',
  },
  {
    q: 'What ongoing support will I receive after opening?',
    a: 'You will receive continuous support including periodic quality audits, supply chain assistance, staff re-training programs, and direct access to the EBT franchise support team.',
  },
  {
    q: 'Can I open the franchise outside Hyderabad?',
    a: 'Yes! We are actively expanding across Telangana and other states. If you have a suitable location in mind, we encourage you to get in touch and discuss the opportunity.',
  },
]

/* ─── FAQ ITEM ──────────────────────────────────────────── */
function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      className={`fp-faq-item${open ? ' fp-faq-item--open' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
    >
      <button className="fp-faq-item__question" onClick={() => setOpen(!open)}>
        <span className="fp-faq-item__q-text">{faq.q}</span>
        <span className={`fp-faq-item__arrow${open ? ' open' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="fp-faq-item__answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
export default function Franchise() {
  const [franchiseData, setFranchiseData] = useState({
    founderName: "Usha Mandra",
    founderRole: "Founder & Visionary",
    founderPhoto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    foundedYear: "2020",
    founderQuote: "Our food is our identity. Every plate we serve carries our heart and our story.",
    founderBio: "Since 2020, Usha Mandra has been the driving force behind EM BABU THINNARA — transforming Hyderabad's food landscape with authentic home-style biryani and Arabian mandi.",
    franchiseFee: "₹ 5 Lakhs",
    totalSetupCost: "₹ 20–35 Lakhs",
    liquidFunds: "₹ 10–15 Lakhs",
    royaltyFee: "5% of Revenue",
    agreementTerm: "5 Years",
    breakEven: "8–14 Months",
    minArea: "1000–2500 sq.ft",
    preferredLocation: "High footfall commercial area, ground floor, main road facing",
    parkingRequirement: "Dedicated two-wheeler and four-wheeler parking space",
    staffRequired: "8–12 members",
    utilityRequirement: "Three-phase power, continuous water supply, exhaust chimney",
    contactPhone: "+91 94947 92191",
    contactEmail: "embabuthinnara@gmail.com",
    contactWhatsapp: "919494792191"
  })

  useEffect(() => {
    dataService.getFranchise().then(data => {
      if (data) setFranchiseData(data)
    })
  }, [])

  const financials = [
    { label: 'Franchise Fee', value: franchiseData.franchiseFee, note: 'One-time onboarding fee', icon: '🏷️' },
    { label: 'Total Setup Cost', value: franchiseData.totalSetupCost, note: 'Varies by location & size', icon: '🏗️' },
    { label: 'Liquid Capital', value: franchiseData.liquidFunds, note: 'Required working capital', icon: '💰' },
    { label: 'Royalty Fee', value: franchiseData.royaltyFee, note: 'Monthly, on gross sales', icon: '📊' },
    { label: 'Agreement Term', value: franchiseData.agreementTerm, note: 'Renewable on mutual terms', icon: '📅' },
    { label: 'Break-even Period', value: franchiseData.breakEven, note: 'Typical ROI timeline', icon: '📈' },
    { label: 'Min. Area Required', value: franchiseData.minArea, note: 'Dine-in + kitchen space', icon: '📐' },
    { label: 'Preferred Location', value: franchiseData.preferredLocation, note: 'High footfall placement', icon: '📍' },
    { label: 'Parking Requirement', value: franchiseData.parkingRequirement, note: 'Customer parking space', icon: '🚗' },
    { label: 'Staff Required', value: franchiseData.staffRequired, note: 'Operational kitchen team', icon: '👨‍🍳' },
    { label: 'Utility Requirement', value: franchiseData.utilityRequirement, note: 'Power & water resources', icon: '⚡' },
  ]

  return (
    <div className="page-wrapper fp-page">

      {/* ══ HERO HEADER STRIP ══ */}
      <div className="fp-header-strip">
        <div className="fp-header-strip__bg" />
        <div className="container fp-header-strip__inner">
          <motion.div
            className="fp-header-strip__left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="fp-header-strip__badge">✦ PARTNER WITH US</span>
            <h1 className="fp-header-strip__title">
              Franchise <span className="fp-header-strip__accent">Profile</span>
            </h1>
            <p className="fp-header-strip__brand">EM BABU THINNARA</p>
            <p className="fp-header-strip__tagline">
              Bringing authentic biryani & mandi to every corner of India — one passionate franchisee at a time.
            </p>
            <div className="fp-header-strip__actions">
              <a href={`tel:${franchiseData.contactPhone}`} className="btn-primary">📞 Enquire Now</a>
              <a href={`https://wa.me/${franchiseData.contactWhatsapp}`} className="fp-wa-btn" target="_blank" rel="noreferrer">
                💬 WhatsApp
              </a>
            </div>
          </motion.div>
          <motion.div
            className="fp-header-strip__stats"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {[
              { val: '3+', label: 'Active Outlets' },
              { val: '50K+', label: 'Happy Customers' },
              { val: '5+', label: 'Years Strong' },
              { val: '100+', label: 'Menu Items' },
            ].map((s) => (
              <div key={s.label} className="fp-stat-pill">
                <span className="fp-stat-pill__val">{s.val}</span>
                <span className="fp-stat-pill__label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══ FOUNDER PROFILE ══ */}
      <section className="section fp-founder">
        <div className="container">
          <div className="fp-founder__grid">
            <motion.div
              className="fp-founder__media"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="fp-founder__photo-frame">
                <img
                  src={franchiseData.founderPhoto}
                  alt={`${franchiseData.founderName} – Founder of EM BABU THINNARA`}
                  className="fp-founder__photo"
                />
                <div className="fp-founder__photo-glow" />
              </div>
              <div className="fp-founder__name-card">
                <div className="fp-founder__name-card-inner">
                  <span className="fp-founder__name">{franchiseData.founderName.toUpperCase()}</span>
                  <span className="fp-founder__role">{franchiseData.founderRole}</span>
                  <div className="fp-founder__since">Est. {franchiseData.foundedYear}</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="fp-founder__content"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <span className="section-eyebrow">Franchise Profile</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                The Heart Behind <span style={{ color: 'var(--clr-ember)' }}>EBT</span>
              </h2>
              <p className="fp-founder__para">
                Since {franchiseData.foundedYear}, <strong>{franchiseData.founderName}</strong> has been the driving force behind EM BABU THINNARA — transforming Hyderabad's food landscape with authentic home-style biryani and Arabian mandi. Her relentless passion for quality and unwavering commitment to taste have made EBT a household name.
              </p>
              <p className="fp-founder__para">
                {franchiseData.founderBio}
              </p>

              <div className="fp-founder__highlights">
                {[
                  { icon: '📍', label: 'Hyderabad, Telangana' },
                  { icon: '📅', label: `Founded in ${franchiseData.foundedYear}` },
                  { icon: '📞', label: franchiseData.contactPhone },
                  { icon: '✉️', label: franchiseData.contactEmail },
                ].map((h) => (
                  <div key={h.label} className="fp-founder__highlight-item">
                    <span className="fp-founder__highlight-icon">{h.icon}</span>
                    <span>{h.label}</span>
                  </div>
                ))}
              </div>

              <blockquote className="fp-founder__quote">
                <span className="fp-founder__quote-mark">"</span>
                {franchiseData.founderQuote}
                <cite>— {franchiseData.founderName}, Founder</cite>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ VISION ══ */}
      <section className="fp-vision">
        <div className="fp-vision__bg" />
        <div className="fp-vision__pattern" />
        <div className="container fp-vision__inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-eyebrow" style={{ color: '#f5d9a8' }}>Our Mission</span>
            <h2 className="fp-vision__heading">VISION</h2>
            <div className="fp-vision__divider">
              <span /><span className="fp-vision__divider-gem">◆</span><span />
            </div>
            <p className="fp-vision__text">
              At EM BABU THINNARA, our vision is to become the most trusted and beloved biryani & mandi restaurant chain across India — one franchise at a time. We believe that great food should be accessible to every neighbourhood, every city, and every heart.
            </p>
            <p className="fp-vision__text">
              Through our franchise model, we aim to empower passionate entrepreneurs with a proven, profitable business — bringing the warmth of home-cooked flavours to communities everywhere. Committed to quality, consistency, and the joy of feeding people well.
            </p>
            <div className="fp-vision__pillars">
              {[
                { icon: '🌟', label: 'Quality' },
                { icon: '⚖️', label: 'Consistency' },
                { icon: '🏘️', label: 'Community' },
                { icon: '📈', label: 'Growth' },
                { icon: '❤️', label: 'Passion' },
              ].map((p) => (
                <div key={p.label} className="fp-vision__pillar">
                  <span className="fp-vision__pillar-icon">{p.icon}</span>
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ KEYS TO SUCCESS ══ */}
      <section className="section fp-keys">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">What Sets Us Apart</span>
            <h2 className="section-title">Keys to Success</h2>
            <p className="section-subtitle">The pillars that make EBT franchises consistently successful</p>
          </div>
          <div className="fp-keys__grid">
            {keys.map((key, i) => (
              <motion.div
                key={i}
                className="fp-key-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <span className="fp-key-card__icon">{key.icon}</span>
                <div className="fp-key-card__content">
                  <span className="fp-key-card__num">{String(i + 1).padStart(2, '0')}</span>
                  <p className="fp-key-card__text">{key.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DESIGN & DECOR ══ */}
      <section className="section fp-decor">
        <div className="container">
          <div className="fp-decor__layout">
            <motion.div
              className="fp-decor__text"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="section-eyebrow">Ambience & Interiors</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Design & Decor</h2>
              <p className="fp-decor__para">
                Every EBT outlet is designed to reflect warmth, culture, and a welcoming atmosphere. Our signature interiors blend traditional Indian artistry with modern comfort — creating a dining experience guests remember and return to.
              </p>
              <p className="fp-decor__para">
                From hand-crafted woodwork and warm lighting to a colour palette inspired by our saffron heritage — every detail is intentional. As a franchisee, you receive a complete interior design blueprint, vendor contacts, and setup guidance so your outlet perfectly matches the EBT brand standard.
              </p>
              <div className="fp-decor__features">
                {['Standardised Layout', 'Warm Lighting', 'Branded Signage', 'Vendor Network'].map((f) => (
                  <span key={f} className="fp-decor__tag">✓ {f}</span>
                ))}
              </div>
            </motion.div>
            <div className="fp-decor__gallery">
              {decor.map((d, i) => (
                <motion.div
                  key={i}
                  className="fp-decor__img-wrap"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <img src={d.img} alt={d.caption} loading="lazy" />
                  <span className="fp-decor__caption">{d.caption}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ BECOME A FRANCHISEE ══ */}
      <section className="fp-process">
        <div className="fp-process__header">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-eyebrow" style={{ color: '#f5d9a8' }}>Your Journey Starts Here</span>
              <h2 className="fp-process__title">
                BECOME A <span>FRANCHISEE</span>
              </h2>
            </motion.div>
          </div>
        </div>
        <div className="container fp-process__body">
          <div className="fp-process__grid">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.num}
                className="fp-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="fp-step__connector" />
                <div className="fp-step__bubble">{step.icon}</div>
                <span className="fp-step__num">{step.num}</span>
                <h4 className="fp-step__title">{step.title}</h4>
                <p className="fp-step__desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINANCIAL OVERVIEW ══ */}
      <section className="section fp-finance">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Investment Details</span>
            <h2 className="section-title">Financial Overview</h2>
            <p className="section-subtitle">Transparent numbers to help you plan with confidence</p>
          </div>
          <div className="fp-finance__grid">
            {financials.map((row, i) => (
              <motion.div
                key={row.label}
                className="fp-finance-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="fp-finance-card__top">
                  <span className="fp-finance-card__icon">{row.icon}</span>
                  <span className="fp-finance-card__idx">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="fp-finance-card__label">{row.label}</p>
                <p className="fp-finance-card__value">{row.value}</p>
                <p className="fp-finance-card__note">{row.note}</p>
              </motion.div>
            ))}
          </div>
          <p className="fp-finance__disclaimer">
            * All figures are indicative and may vary based on location, city tier, and specific requirements. Contact us for a detailed breakup.
          </p>
        </div>
      </section>

      {/* ══ APPLY CTA BANNER ══ */}
      <div className="fp-apply-banner">
        <div className="fp-apply-banner__bg" />
        <div className="container fp-apply-banner__inner">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="fp-apply-banner__eyebrow">Ready to Start?</span>
            <h2 className="fp-apply-banner__title">
              CLICK TO BECOME A <span>FRANCHISEE</span>
            </h2>
            <p className="fp-apply-banner__sub">
              Take the first step towards owning a successful food business today.
            </p>
            <div className="fp-apply-banner__actions">
              <a href={`tel:${franchiseData.contactPhone}`} className="btn-primary fp-apply-banner__cta">
                📞 {franchiseData.contactPhone}
              </a>
              <a href={`https://wa.me/${franchiseData.contactWhatsapp}`} className="fp-apply-banner__wa" target="_blank" rel="noreferrer">
                💬 Chat on WhatsApp
              </a>
              <a href={`mailto:${franchiseData.contactEmail}`} className="fp-apply-banner__mail">
                ✉️ {franchiseData.contactEmail}
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══ FAQs ══ */}
      <section className="section fp-faqs">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Got Questions?</span>
            <h2 className="section-title">FAQs</h2>
            <p className="section-subtitle">Everything you need to know before taking the leap</p>
          </div>
          <div className="fp-faqs__list">
            {faqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} />
            ))}
          </div>

          {/* Contact strip */}
          <motion.div
            className="fp-faqs__contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p>Still have questions? Our franchise team is always happy to help.</p>
            <div className="fp-faqs__contact-links">
              <a href={`tel:${franchiseData.contactPhone}`} className="fp-contact-chip">
                <span className="fp-contact-chip__icon">📞</span>
                <div>
                  <strong>Call Us</strong>
                  <span>{franchiseData.contactPhone}</span>
                </div>
              </a>
              <a href={`https://wa.me/${franchiseData.contactWhatsapp}`} className="fp-contact-chip" target="_blank" rel="noreferrer">
                <span className="fp-contact-chip__icon">💬</span>
                <div>
                  <strong>WhatsApp</strong>
                  <span>{franchiseData.contactPhone}</span>
                </div>
              </a>
              <a href={`mailto:${franchiseData.contactEmail}`} className="fp-contact-chip">
                <span className="fp-contact-chip__icon">✉️</span>
                <div>
                  <strong>Email Us</strong>
                  <span>{franchiseData.contactEmail}</span>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
