'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

const GREEN = '#00FF85'
const RED = '#FF4D4D'
const PURPLE = '#9B6DFF'
const CORAL = '#FF6B4A'
const TEAL = '#4DD9C0'
const GOLD = '#F5B13D'
const BG = '#0B0B0F'
const CARD = '#111118'
const BORDER = 'rgba(255,255,255,0.07)'

type Sentiment = 'Bullish' | 'Bearish' | 'Neutral'
type CardStyle = 'rounded' | 'sharp' | 'pill'

interface Coin {
  sym: string
  name: string
  price: number
  change: number
  sent: Sentiment
}

interface MarketCoin extends Coin {
  cap: string
  vol: string
  dom: number
  badge: string
}

interface Feature {
  icon: string
  title: string
  desc: string
  accent: string
  tag?: string
}

interface Plan {
  plan: string
  price: string
  features: string[]
  highlight: boolean
}

const COINS_INIT: Coin[] = [
  { sym: 'BTC', name: 'Bitcoin', price: 96420.5, change: 2.34, sent: 'Bullish' },
  { sym: 'ETH', name: 'Ethereum', price: 3812.18, change: 1.87, sent: 'Bullish' },
  { sym: 'SOL', name: 'Solana', price: 182.44, change: -0.93, sent: 'Bearish' },
  { sym: 'BNB', name: 'BNB', price: 618.2, change: 0.61, sent: 'Neutral' },
  { sym: 'XRP', name: 'XRP', price: 0.624, change: -2.11, sent: 'Bearish' },
  { sym: 'ADA', name: 'Cardano', price: 0.481, change: 3.22, sent: 'Bullish' },
]

const MARKET_COINS: MarketCoin[] = [
  { sym: 'BTC', name: 'Bitcoin', price: 79072, cap: '1.57T', vol: '32.1B', change: 2.13, dom: 60.5, sent: 'Bullish', badge: '#F7931A' },
  { sym: 'ETH', name: 'Ethereum', price: 1812, cap: '218B', vol: '14.3B', change: -1.42, dom: 8.8, sent: 'Bearish', badge: '#627EEA' },
  { sym: 'SOL', name: 'Solana', price: 148.2, cap: '71.2B', vol: '5.8B', change: 3.67, dom: 2.9, sent: 'Bullish', badge: '#9945FF' },
  { sym: 'BNB', name: 'BNB', price: 599.4, cap: '86.4B', vol: '2.1B', change: 0.44, dom: 3.5, sent: 'Neutral', badge: '#F3BA2F' },
  { sym: 'XRP', name: 'XRP', price: 2.18, cap: '125B', vol: '8.4B', change: -0.87, dom: 5.1, sent: 'Bearish', badge: '#00AAE4' },
  { sym: 'ADA', name: 'Cardano', price: 0.38, cap: '13.5B', vol: '0.9B', change: 1.22, dom: 0.55, sent: 'Bullish', badge: '#0033AD' },
  { sym: 'AVAX', name: 'Avalanche', price: 22.4, cap: '9.4B', vol: '0.6B', change: -2.31, dom: 0.38, sent: 'Bearish', badge: '#E84142' },
  { sym: 'DOT', name: 'Polkadot', price: 4.82, cap: '7.2B', vol: '0.4B', change: 0.73, dom: 0.29, sent: 'Neutral', badge: '#E6007A' },
]

const MARKET_STATS = [
  { label: 'Total Mkt Cap', value: '$2.51T', sub: '-1.8% 24h', color: RED },
  { label: '24h Volume', value: '$163B', sub: '+11.2% vs avg', color: GREEN },
  { label: 'BTC Dominance', value: '60.5%', sub: '-0.22% today', color: '#F7931A' },
  { label: 'Fear & Greed', value: '42', sub: 'Fear', color: GOLD },
]

const FEATURES_BASE: Omit<Feature, 'accent'>[] = [
  { icon: '📡', title: 'Real-Time Signals', tag: 'Live', desc: 'Sub-second market data with WebSocket feeds. Never miss a move - prices update before you blink.' },
  { icon: '🧠', title: 'Sentiment Engine', tag: 'AI', desc: 'Our model classifies Bullish, Bearish, and Neutral states across 100+ tokens using on-chain and social signals.' },
  { icon: '📈', title: 'Momentum Charts', tag: 'New', desc: 'Sparklines, breadth bars, and volatility heatmaps. Understand the market temperature in seconds.' },
  { icon: '🔔', title: 'Smart Alerts', tag: 'Beta', desc: 'Set threshold-based price alerts and sentiment shifts. Get notified via push or webhook.' },
  { icon: '⭐', title: 'Watchlist', desc: 'Pin your favorite tokens. Sorted by momentum, color-coded by sentiment. Your personal signal dashboard.' },
  { icon: '🔍', title: 'Deep Coin Insights', desc: 'Per-coin pages with detailed sentiment breakdown, historical change data, and social volume.' },
]

const PLANS: Plan[] = [
  { plan: 'Free', price: 'Free', features: ['Top 10 coins', '15-min delayed data', 'Market mood overview', 'Watchlist (3 coins)'], highlight: false },
  { plan: 'Pro', price: '$12', features: ['100+ coins tracked', 'Real-time live data', 'AI sentiment engine', 'Unlimited watchlist', 'Price alerts'], highlight: true },
  { plan: 'Team', price: '$49', features: ['Everything in Pro', 'API access', 'Webhook alerts', 'Priority support', '5 seats included'], highlight: false },
]

const sparkPaths: Record<Sentiment, string> = {
  Bullish: 'M0 30 C18 28,30 16,45 14 S70 8,90 9 S110 5,130 6',
  Bearish: 'M0 8 C18 10,30 24,45 22 S70 30,90 28 S110 33,130 35',
  Neutral: 'M0 20 C18 18,30 22,45 20 S70 19,90 21 S110 20,130 20',
}

const sparkFill: Record<Sentiment, string> = {
  Bullish: 'rgba(0,255,133,0.10)',
  Bearish: 'rgba(255,77,77,0.10)',
  Neutral: 'rgba(155,109,255,0.10)',
}

const sparkStroke: Record<Sentiment, string> = {
  Bullish: GREEN,
  Bearish: RED,
  Neutral: PURPLE,
}

const sentimentColor: Record<Sentiment, string> = {
  Bullish: GREEN,
  Bearish: RED,
  Neutral: PURPLE,
}

const coinBadge: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#9945FF',
  BNB: '#F3BA2F',
  XRP: '#00AAE4',
  ADA: '#0033AD',
}

function randomWalk(value: number) {
  return Number((value * (1 + (Math.random() - 0.5) * 0.004)).toFixed(value > 100 ? 2 : 4))
}

function formatPrice(price: number) {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  if (price >= 1) return `$${price.toFixed(3)}`
  return `$${price.toFixed(4)}`
}

function getCardRadius(cardStyle: CardStyle) {
  if (cardStyle === 'sharp') return 4
  if (cardStyle === 'pill') return 20
  return 14
}

function getMood(coins: Coin[]): Sentiment {
  const gainers = coins.filter((coin) => coin.change > 0).length
  const losers = coins.length - gainers
  if (gainers > losers) return 'Bullish'
  if (gainers < losers) return 'Bearish'
  return 'Neutral'
}

function Dot({ color, size = 6 }: { color: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        animation: 'pulse-dot 2s infinite',
      }}
    />
  )
}

function Nav({ accent }: { accent: string }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(11,11,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent',
        transition: 'all .35s ease',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${accent} 0%, ${PURPLE} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800,
            color: '#000',
          }}
        >
          CP
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '.02em' }}>
          Crypto<span style={{ color: accent }}>Pulse</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {['Features', 'Markets', 'Pricing'].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            style={{ fontSize: 13, fontWeight: 500, color: '#8A8A9A', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = '#8A8A9A'
            }}
          >
            {label}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Link
          href="/auth/login"
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: `1px solid ${BORDER}`,
            background: 'transparent',
            color: '#8A8A9A',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all .2s',
            textDecoration: 'none',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.color = '#fff'
            event.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.color = '#8A8A9A'
            event.currentTarget.style.borderColor = BORDER
          }}
        >
          Log in
        </Link>
        <Link
          href="/auth/signup"
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: accent,
            color: '#000',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all .2s',
            textDecoration: 'none',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.opacity = '.85'
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.opacity = '1'
          }}
        >
          Get started →
        </Link>
      </div>
    </nav>
  )
}

function Ticker({ coins }: { coins: Coin[] }) {
  const items = [...coins, ...coins]
  return (
    <div style={{ overflow: 'hidden', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', animation: 'ticker 28s linear infinite' }}>
        {items.map((coin, index) => (
          <div
            key={`${coin.sym}-${index}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 32px',
              borderRight: `1px solid ${BORDER}`,
              fontSize: 12,
              fontFamily: 'var(--font-jetbrains-mono), monospace',
            }}
          >
            <span style={{ color: '#8A8A9A', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase' }}>{coin.sym}</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{formatPrice(coin.price)}</span>
            <span style={{ color: coin.change >= 0 ? GREEN : RED, fontWeight: 700 }}>
              {coin.change >= 0 ? '▲' : '▼'} {Math.abs(coin.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Spark({ sent }: { sent: Sentiment }) {
  return (
    <svg viewBox="0 0 130 40" style={{ width: '100%', height: 40 }} fill="none" aria-hidden="true">
      <path d={`${sparkPaths[sent]} L130 40 L0 40 Z`} fill={sparkFill[sent]} />
      <path d={sparkPaths[sent]} stroke={sparkStroke[sent]} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function CoinCard({ coin, cardStyle }: { coin: Coin; accent: string; cardStyle: CardStyle }) {
  const [hovered, setHovered] = useState(false)
  const radius = getCardRadius(cardStyle)
  const sentiment = sentimentColor[coin.sent]
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: CARD,
        border: `1px solid ${hovered ? `${sentiment}44` : BORDER}`,
        borderRadius: radius,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'all .22s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              color: '#fff',
              background: coinBadge[coin.sym] || '#333',
            }}
          >
            {coin.sym.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{coin.name}</div>
            <div style={{ fontSize: 10, color: '#8A8A9A', letterSpacing: '.2em', textTransform: 'uppercase' }}>{coin.sym}</div>
          </div>
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            padding: '3px 9px',
            borderRadius: 99,
            color: sentiment,
            background: `${sentiment}1A`,
            border: `1px solid ${sentiment}33`,
          }}
        >
          {coin.sent}
        </div>
      </div>
      <div style={{ borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}` }}>
        <Spark sent={coin.sent} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 22, fontWeight: 700 }}>{formatPrice(coin.price)}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: coin.change >= 0 ? GREEN : RED, marginTop: 2 }}>
          {coin.change >= 0 ? '↑' : '↓'} {coin.change >= 0 ? '+' : ''}
          {coin.change.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}

function StatCounter({ value, suffix = '', prefix = '' }: { value: string; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        let start = 0
        const end = parseFloat(value)
        const duration = 1200
        const step = 16
        const increment = end / (duration / step)
        const timer = setInterval(() => {
          start = Math.min(start + increment, end)
          setDisplay(start)
          if (start >= end) clearInterval(timer)
        }, step)
      },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {prefix}
      {value.includes('.') ? display.toFixed(1) : Math.floor(display)}
      {suffix}
    </span>
  )
}

function FeatureCard({ icon, title, desc, accent, tag, cardStyle }: Feature & { cardStyle: CardStyle }) {
  const [hovered, setHovered] = useState(false)
  const radius = getCardRadius(cardStyle)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: CARD,
        border: `1px solid ${hovered ? `${accent}33` : BORDER}`,
        borderRadius: radius,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'all .25s',
        transform: hovered ? 'translateY(-4px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            fontSize: 20,
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        {tag && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: 99,
              background: 'rgba(255,255,255,0.05)',
              color: '#8A8A9A',
              border: `1px solid ${BORDER}`,
            }}
          >
            {tag}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: '#8A8A9A', lineHeight: 1.7 }}>{desc}</div>
      </div>
    </div>
  )
}

function DashboardPreview({ accent }: { accent: string }) {
  const [coins, setCoins] = useState(COINS_INIT)

  useEffect(() => {
    const timer = setInterval(() => {
      setCoins((previous) =>
        previous.map((coin) => ({
          ...coin,
          price: randomWalk(coin.price),
          change: Number((coin.change + (Math.random() - 0.5) * 0.1).toFixed(2)),
        }))
      )
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  const gainers = coins.filter((coin) => coin.change > 0).length
  const losers = coins.filter((coin) => coin.change <= 0).length
  const mood = getMood(coins)
  const moodColor = sentimentColor[mood]
  const breadth = Math.round((gainers / coins.length) * 100)

  return (
    <div
      style={{
        background: '#0d0d14',
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: `0 40px 80px rgba(0,0,0,.7), 0 0 0 1px ${BORDER}`,
      }}
    >
      <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((color) => (
              <div key={color} style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#8A8A9A', fontWeight: 500 }}>Dashboard / Overview</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, border: `1px solid ${BORDER}`, fontSize: 11, color: '#8A8A9A' }}>
            <Dot color={accent} />
            Live
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 14px', borderBottom: `1px solid ${BORDER}` }}>
        <div
          style={{
            background: `radial-gradient(600px 200px at 0% 50%, ${moodColor}20, transparent 70%)`,
            borderRadius: 14,
            border: `1px solid ${BORDER}`,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Dot color={accent} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8A8A9A' }}>Market Mood</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, textTransform: 'uppercase', color: moodColor, letterSpacing: '-.01em' }}>{mood}</div>
            <div style={{ fontSize: 11, color: '#8A8A9A', marginTop: 2 }}>{gainers} of {coins.length} coins up</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(0,255,133,0.08)', border: `1px solid ${GREEN}22`, textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#8A8A9A', textTransform: 'uppercase', letterSpacing: '.15em' }}>Gainers</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: GREEN, marginTop: 2 }}>{gainers}</div>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,77,77,0.08)', border: `1px solid ${RED}22`, textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#8A8A9A', textTransform: 'uppercase', letterSpacing: '.15em' }}>Losers</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: RED, marginTop: 2 }}>{losers}</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${breadth}%`, background: accent, borderRadius: 4, transition: 'width .8s ease' }} />
          </div>
          <div style={{ fontSize: 10, color: '#8A8A9A', marginTop: 5 }}>{breadth}% breadth</div>
        </div>
      </div>

      <div style={{ padding: '14px 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {coins.slice(0, 3).map((coin) => (
          <div key={coin.sym} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: coinBadge[coin.sym], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                {coin.sym.charAt(0)}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#ccc' }}>{coin.sym}</span>
            </div>
            <Spark sent={coin.sent} />
            <div style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 13, fontWeight: 600, marginTop: 4 }}>{formatPrice(coin.price)}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: coin.change >= 0 ? GREEN : RED }}>
              {coin.change >= 0 ? '+' : ''}
              {coin.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px)' }} />
    </div>
  )
}

function FearGauge({ value = 42 }: { value?: number }) {
  const zones = [
    { label: 'Extreme Fear', color: RED, from: 0, to: 20 },
    { label: 'Fear', color: '#FF8C42', from: 20, to: 40 },
    { label: 'Neutral', color: GOLD, from: 40, to: 60 },
    { label: 'Greed', color: '#9BDE7E', from: 60, to: 80 },
    { label: 'Extreme Greed', color: GREEN, from: 80, to: 100 },
  ]
  const currentZone = zones.find((zone) => value >= zone.from && value <= zone.to) ?? zones[2]

  const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }
  const arc = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
    const start = polarToCartesian(cx, cy, r, startDeg)
    const end = polarToCartesian(cx, cy, r, endDeg)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
  }
  const cx = 100
  const cy = 90
  const r = 68
  const needleAngle = -90 + (value / 100) * 180
  const tip = polarToCartesian(cx, cy, r - 4, needleAngle)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg viewBox="0 0 200 110" style={{ width: 200, height: 110 }} aria-hidden="true">
        <path d={arc(cx, cy, r, -90, 90)} stroke="rgba(255,255,255,0.06)" strokeWidth={14} fill="none" strokeLinecap="round" />
        {zones.map((zone) => {
          const startDeg = -90 + (zone.from / 100) * 180
          const endDeg = -90 + (zone.to / 100) * 180
          return <path key={zone.label} d={arc(cx, cy, r, startDeg, endDeg)} stroke={zone.color} strokeWidth={14} fill="none" opacity={0.25} />
        })}
        <path d={arc(cx, cy, r, -90, -90 + (value / 100) * 180)} stroke={currentZone.color} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.9} />
        <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.9} />
        <circle cx={cx} cy={cy} r={5} fill={currentZone.color} />
        <text x={cx} y={cy + 22} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={700} fontFamily="var(--font-jetbrains-mono), monospace">{value}</text>
        <text x={cx} y={cy + 36} textAnchor="middle" fill={currentZone.color} fontSize={9} fontWeight={700} letterSpacing="1">{currentZone.label.toUpperCase()}</text>
        <text x={18} y={cy + 14} textAnchor="middle" fill="#555" fontSize={7}>0</text>
        <text x={182} y={cy + 14} textAnchor="middle" fill="#555" fontSize={7}>100</text>
      </svg>
      <div style={{ fontSize: 10, color: '#555', letterSpacing: '.1em' }}>FEAR &amp; GREED INDEX</div>
    </div>
  )
}

function MarketsSection({ accent, cardStyle }: { accent: string; cardStyle: CardStyle }) {
  const [coins, setCoins] = useState(MARKET_COINS.map((coin) => ({ ...coin })))
  const [activeTab, setActiveTab] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all')
  const radius = getCardRadius(cardStyle)

  useEffect(() => {
    const timer = setInterval(() => {
      setCoins((previous) =>
        previous.map((coin) => ({
          ...coin,
          price: randomWalk(coin.price),
          change: Number((coin.change + (Math.random() - 0.5) * 0.15).toFixed(2)),
        }))
      )
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const tabs: Array<'all' | 'bullish' | 'bearish' | 'neutral'> = ['all', 'bullish', 'bearish', 'neutral']
  const filtered = activeTab === 'all' ? coins : coins.filter((coin) => coin.sent.toLowerCase() === activeTab)
  const gainers = coins.filter((coin) => coin.change > 0).length
  const losers = coins.filter((coin) => coin.change <= 0).length
  const breadth = Math.round((gainers / coins.length) * 100)
  const mood = getMood(coins)

  return (
    <section id="markets" className="landing-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, border: `1px solid ${accent}33`, background: `${accent}0D`, fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: accent, marginBottom: 16 }}>
            <Dot color={accent} />
            May 2026 · Live
          </div>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 800, letterSpacing: '-.02em' }}>
            Market <span style={{ color: accent }}>overview.</span>
          </h2>
          <p style={{ color: '#8A8A9A', marginTop: 8, fontSize: 14, maxWidth: 480 }}>
            Real-time prices, dominance, and sentiment for top assets. <br />
            <span style={{ color: '#555', fontSize: 12 }}>Market sentiment is cautiously constructive - institutional flows steady, BTC holding $79K support.</span>
          </p>
        </div>
        <FearGauge value={42} />
      </div>

      <div className="landing-stats-grid" style={{ marginBottom: 32 }}>
        {MARKET_STATS.map((stat) => (
          <div key={stat.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: radius, padding: '16px 18px' }}>
            <div style={{ fontSize: 10, color: '#8A8A9A', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: radius, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11, color: '#8A8A9A', letterSpacing: '.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Market Breadth</div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${breadth}%`, background: GREEN, borderRadius: '4px 0 0 4px', transition: 'width .8s ease' }} />
            <div style={{ flex: 1, background: RED, borderRadius: '0 4px 4px 0' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, whiteSpace: 'nowrap' }}>
          <span style={{ color: GREEN, fontWeight: 600 }}>▲ {gainers} gainers</span>
          <span style={{ color: RED, fontWeight: 600 }}>▼ {losers} losers</span>
          <span style={{ color: sentimentColor[mood], fontWeight: 700, letterSpacing: '.05em' }}>{mood}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 16px',
              borderRadius: 99,
              border: `1px solid ${activeTab === tab ? `${accent}55` : BORDER}`,
              background: activeTab === tab ? `${accent}15` : 'transparent',
              color: activeTab === tab ? accent : '#8A8A9A',
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer',
              letterSpacing: '.04em',
              transition: 'all .18s',
            }}
          >
            {tab === 'all' ? 'All coins' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}>
          <Dot color={accent} />
          Updates every 2s
        </div>
      </div>

      <div className="landing-overflow-x">
        <div className="landing-market-table" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: radius, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.2fr 1fr 1fr 0.9fr', padding: '11px 20px', borderBottom: `1px solid ${BORDER}`, fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' }}>
            <span>Asset</span>
            <span style={{ textAlign: 'right' }}>Price</span>
            <span style={{ textAlign: 'right' }}>24h Change</span>
            <span style={{ textAlign: 'right' }}>Mkt Cap</span>
            <span style={{ textAlign: 'right' }}>Volume</span>
            <span style={{ textAlign: 'center' }}>Sentiment</span>
          </div>
          {filtered.map((coin, index) => (
            <MarketRow key={coin.sym} coin={coin} idx={index} total={filtered.length} />
          ))}
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#555', fontSize: 13 }}>No coins match this filter.</div>}
        </div>
      </div>

      <div style={{ marginTop: 20, background: CARD, border: `1px solid ${BORDER}`, borderRadius: radius, padding: '16px 20px' }}>
        <div style={{ fontSize: 10, color: '#8A8A9A', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 10 }}>Market Dominance</div>
        <div style={{ height: 10, borderRadius: 6, overflow: 'hidden', display: 'flex', gap: 1 }}>
          {[
            { sym: 'BTC', pct: 60.5, color: '#F7931A' },
            { sym: 'ETH', pct: 8.8, color: '#627EEA' },
            { sym: 'XRP', pct: 5.1, color: '#00AAE4' },
            { sym: 'BNB', pct: 3.5, color: '#F3BA2F' },
            { sym: 'SOL', pct: 2.9, color: '#9945FF' },
            { sym: 'Other', pct: 19.2, color: '#333' },
          ].map((dom) => (
            <div key={dom.sym} title={`${dom.sym}: ${dom.pct}%`} style={{ width: `${dom.pct}%`, background: dom.color, transition: 'width .6s ease' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap' }}>
          {[
            { sym: 'BTC', pct: 60.5, color: '#F7931A' },
            { sym: 'ETH', pct: 8.8, color: '#627EEA' },
            { sym: 'XRP', pct: 5.1, color: '#00AAE4' },
            { sym: 'BNB', pct: 3.5, color: '#F3BA2F' },
            { sym: 'SOL', pct: 2.9, color: '#9945FF' },
            { sym: 'Other', pct: 19.2, color: '#333' },
          ].map((dom) => (
            <div key={dom.sym} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: dom.color }} />
              <span style={{ color: '#8A8A9A' }}>{dom.sym}</span>
              <span style={{ color: '#fff', fontFamily: 'var(--font-jetbrains-mono), monospace', fontWeight: 600 }}>{dom.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MarketRow({ coin, idx, total }: { coin: MarketCoin; idx: number; total: number }) {
  const [hovered, setHovered] = useState(false)
  const sentiment = sentimentColor[coin.sent]
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.4fr 1.2fr 1fr 1fr 0.9fr',
        padding: '13px 20px',
        alignItems: 'center',
        borderBottom: idx < total - 1 ? `1px solid ${BORDER}` : 'none',
        background: hovered ? 'rgba(255,255,255,0.025)' : 'transparent',
        transition: 'background .15s',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: coin.badge, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
          {coin.sym.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{coin.name}</div>
          <div style={{ fontSize: 10, color: '#8A8A9A', letterSpacing: '.16em', textTransform: 'uppercase' }}>{coin.sym}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 13, fontWeight: 600 }}>{formatPrice(coin.price)}</div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: coin.change >= 0 ? GREEN : RED, padding: '3px 8px', borderRadius: 6, background: coin.change >= 0 ? 'rgba(0,255,133,0.08)' : 'rgba(255,77,77,0.08)' }}>
          {coin.change >= 0 ? '+' : ''}
          {coin.change.toFixed(2)}%
        </span>
      </div>
      <div style={{ textAlign: 'right', fontSize: 12, color: '#8A8A9A', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>${coin.cap}</div>
      <div style={{ textAlign: 'right', fontSize: 12, color: '#8A8A9A', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>${coin.vol}</div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 99, color: sentiment, background: `${sentiment}18`, border: `1px solid ${sentiment}33` }}>{coin.sent}</span>
      </div>
    </div>
  )
}

function PriceCard({ plan, price, features, accent, highlight, cardStyle }: Plan & { accent: string; cardStyle: CardStyle }) {
  const [hovered, setHovered] = useState(false)
  const radius = getCardRadius(cardStyle)
  const border = highlight ? `${accent}55` : hovered ? 'rgba(255,255,255,0.14)' : BORDER

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: highlight ? 'linear-gradient(145deg, #13131e, #0f1020)' : CARD,
        border: `1px solid ${border}`,
        borderRadius: radius,
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all .25s',
        transform: highlight || hovered ? 'translateY(-4px)' : 'none',
        boxShadow: highlight ? `0 0 60px ${accent}18` : 'none',
      }}
    >
      {highlight && (
        <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 9, fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 99, background: accent, color: '#000' }}>
          Popular
        </div>
      )}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#8A8A9A', marginBottom: 10 }}>{plan}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 36, fontWeight: 700 }}>{price}</span>
          {price !== 'Free' && <span style={{ color: '#8A8A9A', fontSize: 13 }}>/mo</span>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {features.map((feature) => (
          <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
            <span style={{ color: accent, fontSize: 14, fontWeight: 700 }}>✓</span>
            <span style={{ color: '#ccc' }}>{feature}</span>
          </div>
        ))}
      </div>
      <Link
        href="/auth/signup"
        style={{
          padding: '12px',
          borderRadius: radius > 10 ? 10 : 6,
          border: `1px solid ${highlight ? 'transparent' : BORDER}`,
          background: highlight ? accent : 'rgba(255,255,255,0.04)',
          color: highlight ? '#000' : '#fff',
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
          marginTop: 'auto',
          transition: 'all .2s',
          textAlign: 'center',
          textDecoration: 'none',
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.opacity = '.85'
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.opacity = '1'
        }}
      >
        {highlight ? 'Get started →' : 'Choose plan'}
      </Link>
    </div>
  )
}

export default function LandingPage() {
  const accent = GREEN
  const cardStyle: CardStyle = 'rounded'
  const [coins, setCoins] = useState(COINS_INIT)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadTimer = setTimeout(() => setLoaded(true), 100)
    const tickerTimer = setInterval(() => {
      setCoins((previous) =>
        previous.map((coin) => ({
          ...coin,
          price: randomWalk(coin.price),
          change: Number((coin.change + (Math.random() - 0.5) * 0.12).toFixed(2)),
        }))
      )
    }, 2200)
    return () => {
      clearTimeout(loadTimer)
      clearInterval(tickerTimer)
    }
  }, [])

  const features: Feature[] = FEATURES_BASE.map((feature, index) => ({
    ...feature,
    accent: [accent, PURPLE, CORAL, GOLD, TEAL, PURPLE][index],
  }))

  const fadeStyle = (delay = 0): CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'none' : 'translateY(20px)',
    transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
  })

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
      <Nav accent={accent} />

      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 64, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, borderRadius: '50%', background: `radial-gradient(ellipse, ${accent}12 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(ellipse, ${PURPLE}0A 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ marginTop: 0, ...fadeStyle(0.1) }}>
          <Ticker coins={coins} />
        </div>

        <div className="landing-section landing-hero-content" style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', paddingTop: 60, paddingBottom: 60, gap: 80, textAlign: 'left' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28, ...fadeStyle(0.15) }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', padding: '6px 14px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>
              <Dot color={accent} size={7} />
              Live Market Intelligence
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-.03em' }}>
              Read the<br />
              market&apos;s<br />
              <span
                style={{
                  background: `linear-gradient(90deg, ${accent}, ${PURPLE})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200%',
                  animation: 'gradientShift 4s ease infinite',
                }}
              >
                pulse.
              </span>
            </h1>

            <p style={{ fontSize: 16, color: '#8A8A9A', lineHeight: 1.75, maxWidth: 480 }}>
              Real-time sentiment signals for 100+ crypto assets. Know whether the market is <span style={{ color: GREEN, fontWeight: 600 }}>bullish</span>, <span style={{ color: RED, fontWeight: 600 }}>bearish</span>, or <span style={{ color: PURPLE, fontWeight: 600 }}>neutral</span> - before you trade.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <Link
                href="/auth/signup"
                style={{ padding: '14px 28px', borderRadius: 10, background: accent, color: '#000', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'all .2s', boxShadow: `0 0 30px ${accent}40`, textDecoration: 'none' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = 'scale(1.04)'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Launch dashboard →
              </Link>
              <Link
                href="/auth/signup"
                style={{ padding: '14px 28px', borderRadius: 10, border: `1px solid ${BORDER}`, background: 'transparent', color: '#ccc', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all .2s', textDecoration: 'none' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
                  event.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.borderColor = BORDER
                  event.currentTarget.style.color = '#ccc'
                }}
              >
                See how it works
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <div style={{ display: 'flex' }}>
                {['#F7931A', '#627EEA', '#9945FF', '#F3BA2F'].map((color, index) => (
                  <div key={color} style={{ width: 28, height: 28, borderRadius: '50%', background: color, border: '2px solid #0B0B0F', marginLeft: index ? -8 : 0 }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: '#8A8A9A' }}>Trusted by <span style={{ color: '#fff', fontWeight: 700 }}>2,400+</span> traders</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} style={{ color: GOLD, fontSize: 12 }}>★</span>
                ))}
                <span style={{ fontSize: 12, color: '#8A8A9A', marginLeft: 4 }}>4.9 / 5</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1.1, ...fadeStyle(0.3), animation: loaded ? 'float 6s ease-in-out infinite' : 'none' }}>
            <DashboardPreview accent={accent} />
          </div>
        </div>
      </section>

      <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.015)', padding: '40px 0' }}>
        <div className="landing-section landing-grid-4" style={{ gap: 0 }}>
          {[
            { label: 'Coins tracked', val: '100', suffix: '+' },
            { label: 'Active traders', val: '2400', suffix: '+' },
            { label: 'Data accuracy', val: '99.2', suffix: '%' },
            { label: 'Avg. update delay', val: '0.8', suffix: 's' },
          ].map((stat, index) => (
            <div key={stat.label} style={{ textAlign: 'center', padding: '0 20px', borderRight: index < 3 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 36, fontWeight: 700, color: accent }}>
                <StatCounter value={stat.val} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 12, color: '#8A8A9A', marginTop: 4, letterSpacing: '.06em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section" style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, border: `1px solid ${accent}33`, background: `${accent}0D`, fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: accent, marginBottom: 20 }}>
            <Dot color={accent} />
            Live Right Now
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, letterSpacing: '-.02em' }}>
            Markets are moving. <span style={{ color: accent }}>Are you ready?</span>
          </h2>
          <p style={{ color: '#8A8A9A', marginTop: 12, fontSize: 14 }}>Prices updating every 2 seconds. No refresh needed.</p>
        </div>
        <div className="landing-grid-3">
          {coins.map((coin) => (
            <CoinCard key={coin.sym} coin={coin} accent={accent} cardStyle={cardStyle} />
          ))}
        </div>
      </section>

      <MarketsSection accent={accent} cardStyle={cardStyle} />

      <section id="features" className="landing-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, letterSpacing: '-.02em' }}>
            Everything you need to <span style={{ color: accent }}>stay ahead.</span>
          </h2>
          <p style={{ color: '#8A8A9A', margin: '12px auto 0', fontSize: 14, maxWidth: 440 }}>From raw data to actionable signals - built for traders who move fast.</p>
        </div>
        <div className="landing-grid-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} cardStyle={cardStyle} />
          ))}
        </div>
      </section>

      <section className="landing-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, letterSpacing: '-.02em' }}>
            From signal to trade in <span style={{ color: accent }}>seconds.</span>
          </h2>
        </div>
        <div className="landing-grid-3" style={{ gap: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 28, left: '17%', right: '17%', height: 1, background: `linear-gradient(90deg, transparent, ${BORDER}, ${BORDER}, transparent)`, zIndex: 0 }} />
          {[
            { step: '01', title: 'Connect & Track', desc: 'Add coins to your watchlist. Set up in seconds - no API key needed.', color: accent },
            { step: '02', title: 'Read the Signal', desc: 'Our engine classifies sentiment in real-time. Bullish, Bearish, Neutral - always up to date.', color: PURPLE },
            { step: '03', title: 'Act with Confidence', desc: 'Set alerts for price thresholds and sentiment flips. Trade with the edge.', color: CORAL },
          ].map((step) => (
            <div key={step.step} style={{ textAlign: 'center', padding: '0 30px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px', background: `${step.color}18`, border: `2px solid ${step.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 13, fontWeight: 700, color: step.color }}>
                {step.step}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: '#8A8A9A', lineHeight: 1.7 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="landing-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, letterSpacing: '-.02em' }}>
            Simple, <span style={{ color: accent }}>honest pricing.</span>
          </h2>
          <p style={{ color: '#8A8A9A', marginTop: 12, fontSize: 14 }}>No hidden fees. Cancel anytime.</p>
        </div>
        <div className="landing-grid-3">
          {PLANS.map((plan) => (
            <PriceCard key={plan.plan} {...plan} accent={accent} cardStyle={cardStyle} />
          ))}
        </div>
      </section>

      <section className="landing-section" style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div style={{ borderRadius: 20, border: `1px solid ${accent}33`, background: `linear-gradient(135deg, ${accent}10 0%, ${PURPLE}08 100%)`, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, borderRadius: '50%', background: `radial-gradient(ellipse, ${accent}15, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, border: `1px solid ${accent}33`, background: `${accent}12`, fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: accent, marginBottom: 20 }}>
              <Dot color={accent} />
              Free forever plan available
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-.02em', marginBottom: 16 }}>Start reading the pulse today.</h2>
            <p style={{ color: '#8A8A9A', fontSize: 15, maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.7 }}>Join 2,400+ traders who use Crypto Pulse to stay ahead of the market - for free.</p>
            <Link
              href="/auth/signup"
              style={{ display: 'inline-flex', padding: '16px 36px', borderRadius: 12, background: accent, color: '#000', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', transition: 'all .2s', boxShadow: `0 0 40px ${accent}50`, textDecoration: 'none' }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = 'scale(1.04)'
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Launch dashboard - it&apos;s free →
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-section" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, fontSize: 12, fontWeight: 800, color: '#000', background: `linear-gradient(135deg, ${accent}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>CP</div>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Crypto<span style={{ color: accent }}>Pulse</span></span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Status', 'Docs'].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                style={{ fontSize: 12, color: '#8A8A9A', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = '#8A8A9A'
                }}
              >
                {label}
              </Link>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#555' }}>© 2026 CryptoPulse. Real-time data, no guarantees.</div>
        </div>
      </footer>
    </div>
  )
}
