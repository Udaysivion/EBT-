import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './BranchCard.css'

export default function BranchCard({ branch, index }) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })
  const [isExpanded, setIsExpanded] = useState(false)

  const maxLength = 130
  const isLongDescription = branch.description.length > maxLength
  const displayText = isExpanded
    ? branch.description
    : isLongDescription
      ? `${branch.description.slice(0, maxLength)}...`
      : branch.description

  return (
    <motion.div
      ref={ref}
      className="branch-card"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="branch-card__img-wrap">
        <img
          src={branch.image}
          alt={branch.name}
          className="branch-card__img"
          loading="lazy"
        />
        <div className="branch-card__img-overlay"></div>
        <div className="branch-card__year">
          <span>Est.</span>
          <strong>{branch.year}</strong>
        </div>
        <div className="branch-card__customers">
          <span className="branch-card__customers-icon">👥</span>
          <span>{branch.customers} daily</span>
        </div>
      </div>

      <div className="branch-card__body">
        <div className="branch-card__meta">
          <span className="tag">Branch {index + 1}</span>
        </div>
        <h3 className="branch-card__name">{branch.name}</h3>
        <div className="branch-card__address">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          {branch.address}
        </div>
        <p className="branch-card__desc">
          {displayText}
          {isLongDescription && (
            <button
              className="branch-card__read-more"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? ' Read Less' : ' Read More'}
            </button>
          )}
        </p>
        <blockquote className="branch-card__quote">
          "{branch.quote}"
        </blockquote>
        <div className="branch-card__footer">
          <div className="branch-card__info">
            <div className="branch-card__info-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
              {branch.timings}
            </div>
          </div>
          <a href={`tel:${branch.phone}`} className="branch-card__call">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            Call Branch
          </a>
        </div>
      </div>
    </motion.div>
  )
}
