import { useMemo, useState } from 'react'
import {
  ArrowUpRight, Check, Copy, Flame, Menu, Plus, Rocket, Search,
  Sparkles, TrendingUp, Vote, Wallet, X
} from 'lucide-react'

type Meme = {
  id: number
  name: string
  ticker: string
  description: string
  emoji: string
  votes: number
  category: string
  tag: string
}

const starterMemes: Meme[] = [
  { id: 1, name: 'Pixel Pug', ticker: '$PUG', description: 'A tiny pug with oversized internet energy.', emoji: '🐶', votes: 1284, category: 'Animals', tag: 'Trending' },
  { id: 2, name: 'Moon Toast', ticker: '$TOAST', description: 'Toasting every small win on the way to the moon.', emoji: '🍞', votes: 967, category: 'Food', tag: 'Community pick' },
  { id: 3, name: 'Keyboard Cat', ticker: '$KCAT', description: 'The legendary soundtrack of the timeline.', emoji: '🐱', votes: 752, category: 'Animals', tag: 'New' },
  { id: 4, name: 'Degen Duck', ticker: '$QUACK', description: 'No roadmap. Just quack energy.', emoji: '🦆', votes: 619, category: 'Culture', tag: 'Rising' }
]

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>
    }
  }
}

export default function App() {
  const [memes, setMemes] = useState<Meme[]>(starterMemes)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [wallet, setWallet] = useState('')
  const [voted, setVoted] = useState<number[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({ name: '', ticker: '', emoji: '🚀', description: '', category: 'Community' })

  const filtered = useMemo(() => memes.filter(m =>
    (category === 'All' || m.category === category) &&
    `${m.name} ${m.ticker} ${m.description}`.toLowerCase().includes(query.toLowerCase())
  ), [memes, category, query])

  async function connectWallet() {
    if (!window.ethereum) {
      setNotice('No browser wallet detected. Open this website in MetaMask or another EVM wallet browser.')
      return
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts[0]) {
        setWallet(accounts[0])
        setNotice('Wallet connected. No transaction has been made.')
      }
    } catch {
      setNotice('Wallet connection was cancelled.')
    }
  }

  async function copyWallet() {
    try {
      await navigator.clipboard.writeText(wallet)
      setNotice('Wallet address copied.')
    } catch {
      setNotice(wallet)
    }
  }

  function submitIdea(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const ticker = form.ticker.trim().replace(/^\$/, '').toUpperCase()
    if (!form.name.trim() || !ticker) return
    const newMeme: Meme = {
      id: Date.now(),
      name: form.name.trim(),
      ticker: `$${ticker}`,
      description: form.description.trim() || 'A new idea from the MemeForge community.',
      emoji: form.emoji || '🚀',
      votes: 0,
      category: form.category,
      tag: 'Just added'
    }
    setMemes(current => [newMeme, ...current])
    setCategory('All')
    setQuery('')
    setForm({ name: '', ticker: '', emoji: '🚀', description: '', category: 'Community' })
    setModalOpen(false)
    setNotice('Your idea was added to this demo feed.')
  }

  function castVote(id: number) {
    if (voted.includes(id)) return
    setVoted(current => [...current, id])
    setMemes(current => current.map(m => m.id === id ? { ...m, votes: m.votes + 1 } : m))
  }

  const totalVotes = memes.reduce((sum, meme) => sum + meme.votes, 0)

  return (
    <div className="site-shell">
      <header className="header">
        <a className="logo" href="#" aria-label="MemeForge home">
          <span className="logo-icon">M</span><span>meme<span className="lime">forge</span></span>
        </a>
        <nav className={mobileOpen ? 'nav nav-open' : 'nav'}>
          <a href="#explore" onClick={() => setMobileOpen(false)}>Explore</a>
          <a href="#how" onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        </nav>
        <div className="header-right">
          <button className="wallet-button" onClick={wallet ? copyWallet : connectWallet}>
            {wallet ? <Copy size={16} /> : <Wallet size={16} />}
            {wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : 'Connect wallet'}
          </button>
          <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow"><span className="pulse" /> THE COMMUNITY MEME LAB</div>
            <h1>Forge the next<br /><span>big internet meme.</span></h1>
            <p className="hero-description">Discover fresh meme ideas, rally a community around your favorites, and bring your own creation to the feed.</p>
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={18} /> Create a meme <ArrowUpRight size={17} /></button>
              <a className="secondary-link" href="#explore">Explore projects <ArrowUpRight size={16} /></a>
            </div>
            <div className="stats">
              <div><strong>{memes.length}</strong><span>Ideas in the lab</span></div>
              <i />
              <div><strong>{totalVotes.toLocaleString()}</strong><span>Community votes</span></div>
              <i />
              <div><strong>24/7</strong><span>Meme energy</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="Meme mascot illustration">
            <div className="orbit orbit-a" /><div className="orbit orbit-b" />
            <div className="mascot">🐸</div>
            <div className="floating-card float-top"><span>🔥 TRENDING NOW</span><b>$PUG</b><small>Community favorite</small></div>
            <div className="floating-card float-bottom"><span>✨ FRESH IDEA</span><b>MOON TOAST 🍞</b><small>967 people voted</small></div>
            <span className="star star-one">✦</span><span className="star star-two">✧</span>
          </div>
        </section>

        <div className="ticker">
          <span><Flame size={16} /> MEME RADAR</span>
          <b>$PUG <em>▲ 18.4%</em></b><b>$TOAST <em>▲ 12.8%</em></b>
          <b>$KCAT <em>▲ 8.2%</em></b><b>$QUACK <em>▲ 5.6%</em></b>
        </div>

        <section className="section explore" id="explore">
          <div className="section-heading">
            <div><div className="eyebrow">THE COMMUNITY FEED</div><h2>Explore the <span>memeverse.</span></h2>
              <p>Find an idea you believe in. Make your voice count.</p></div>
            <button className="outline-button" onClick={() => setModalOpen(true)}><Plus size={17} /> Submit an idea</button>
          </div>
          <div className="toolbar">
            <label className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search memes or tickers..." /></label>
            <div className="categories">
              {['All', 'Animals', 'Food', 'Culture', 'Community'].map(item =>
                <button key={item} className={category === item ? 'category-active' : ''} onClick={() => setCategory(item)}>{item}</button>
              )}
            </div>
          </div>
          <div className="meme-grid">
            {filtered.map((meme, index) => (
              <article className="meme-card" key={meme.id}>
                <div className={`meme-art art-${index % 4}`}>
                  <span className="rank">#{index + 1}</span><span className="art-tag">{meme.tag}</span>
                  <span className="meme-emoji">{meme.emoji}</span>
                </div>
                <div className="meme-details">
                  <div className="meme-title"><div><h3>{meme.name}</h3><span>{meme.ticker}</span></div><TrendingUp size={18} className="trend-icon" /></div>
                  <p>{meme.description}</p>
                  <div className="card-footer">
                    <div className="vote-count"><small>Community votes</small><strong><Vote size={15} /> {meme.votes.toLocaleString()}</strong></div>
                    <button className={voted.includes(meme.id) ? 'vote-button voted' : 'vote-button'} disabled={voted.includes(meme.id)} onClick={() => castVote(meme.id)}>
                      {voted.includes(meme.id) ? <><Check size={15} /> Voted</> : <><Sparkles size={15} /> Vote</>}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && <div className="empty-state">No ideas found. Try another search or submit the first one.</div>}
          <p className="demo-caption">Demo community data — votes and new ideas are stored only in this browser session.</p>
        </section>

        <section className="section how" id="how">
          <div className="eyebrow">FROM IDEA TO COMMUNITY</div>
          <h2>Your meme. <span>Your moment.</span></h2>
          <div className="steps">
            <div className="step"><div className="step-icon"><Sparkles /></div><small>01 / CREATE</small><h3>Dream it up</h3><p>Give your meme a name, ticker, personality and a story.</p></div>
            <div className="step"><div className="step-icon"><Vote /></div><small>02 / CONNECT</small><h3>Find your people</h3><p>Share the idea and let the community vote for their favorites.</p></div>
            <div className="step"><div className="step-icon"><Rocket /></div><small>03 / BUILD</small><h3>Explore what's next</h3><p>Take the idea further after checking the network and launch requirements.</p></div>
          </div>
        </section>

        <section className="cta" id="about">
          <div><div className="eyebrow">BUILT FOR MEME CULTURE</div><h2>The next big thing<br />starts with <span>an idea.</span></h2><p>Bring your imagination. The community brings the energy.</p></div>
          <button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={18} /> Create your meme <ArrowUpRight size={17} /></button>
        </section>
      </main>

      <footer className="footer">
        <a className="logo" href="#"><span className="logo-icon">M</span><span>meme<span className="lime">forge</span></span></a>
        <span>Community ideas, forged together.</span>
        <small>Independent demo project · Not financial advice</small>
      </footer>

      {notice && <div className="toast" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}

      {modalOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModalOpen(false) }}>
        <form className="modal" onSubmit={submitIdea}>
          <button type="button" className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close"><X /></button>
          <div className="eyebrow">MAKE SOME NOISE</div><h2>Create a meme idea</h2>
          <p className="modal-intro">Add the basics and introduce your idea to the community feed.</p>
          <label>Project name<input required maxLength={32} placeholder="e.g. Cosmic Hamster" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
          <div className="form-row">
            <label>Ticker<input required maxLength={10} placeholder="HAM" value={form.ticker} onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })} /></label>
            <label>Emoji<input maxLength={4} value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} /></label>
          </div>
          <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Community</option><option>Animals</option><option>Food</option><option>Culture</option></select></label>
          <label>What's the story?<textarea maxLength={140} placeholder="Tell everyone what makes this meme special..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
          <button className="primary-button submit-button" type="submit"><Plus size={17} /> Add idea to feed</button>
          <small className="disclaimer">This is a front-end demo. It does not deploy a token or create a smart contract.</small>
        </form>
      </div>}
      <div className="integration-status"><span className="status-dot" /> Wallet demo available · Ammora on-chain actions not connected yet</div>
    </div>
  )
}