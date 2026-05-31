import { menuCategories, branches, stats } from '../data/menuData'

const BASE_URL = '/api'

async function safeFetch(endpoint, fallbackData) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.warn(`Failed to fetch from ${endpoint}, using static fallback data.`, error)
    return fallbackData
  }
}

export const dataService = {
  getMenu: () => safeFetch('/menu', menuCategories),
  getSpecials: () => safeFetch('/specials', menuCategories.find(c => c.id === 'specials')?.items || []),
  getBranches: () => safeFetch('/branches', branches),
  getStats: () => safeFetch('/stats', stats),
  getFranchise: () => safeFetch('/franchise', {
    founderName: "Usha Mandra",
    founderRole: "Founder & Visionary",
    founderPhoto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    foundedYear: "2020",
    founderQuote: "Our food is our identity. Every plate we serve carries our heart and our story.",
    founderBio: "Since 2020, Usha Mandra has been the driving force behind EM BABU THINNARA — transforming Hyderabad's food landscape with authentic home-style biryani and Arabian mandi.",
    franchiseFee: "₹ 5 Lakhs",
    totalSetupCost: "₹ 20–35 Lakhs",
    royaltyFee: "5% of Revenue",
    agreementTerm: "5 Years",
    breakEven: "8–14 Months",
    minArea: "1000–2500 sq.ft",
    contactPhone: "+91 94947 92191",
    contactEmail: "embabuthinnara@gmail.com",
    contactWhatsapp: "919494792191"
  }),
  submitMessage: async (msgData) => {
    try {
      const res = await fetch(`${BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      return await res.json()
    } catch (error) {
      console.error('Failed to submit message to API', error)
      return null
    }
  },
  getAdminMessages: async (token) => {
    const res = await fetch(`${BASE_URL}/admin/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to fetch admin messages')
    return await res.json()
  },
  updateMessageStatus: async (token, id, status) => {
    const res = await fetch(`${BASE_URL}/admin/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })
    if (!res.ok) throw new Error('Failed to update message status')
    return await res.json()
  },
  deleteMessage: async (token, id) => {
    const res = await fetch(`${BASE_URL}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to delete message')
    return await res.json()
  }
}
