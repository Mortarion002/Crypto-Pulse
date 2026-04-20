# Crypto Pulse

A real-time crypto market sentiment dashboard built with Next.js 16, TypeScript, and Tailwind CSS. Pulls live price data from Binance's public API and surfaces it through a clean, dark fintech UI with sentiment analysis, interactive charts, and a persistent watchlist.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-5-orange?style=flat-square)

---

## Features

- **Live market data** — prices auto-refresh every 30 seconds via Binance public API
- **Sentiment analysis** — Bullish / Bearish / Neutral classification per coin and for the overall market
- **Interactive price charts** — Recharts AreaChart with 1H / 4H / 1D / 1W intervals
- **Persistent watchlist** — saved to `localStorage`, survives page refreshes
- **Market insights** — volatility gauge, top gainers/losers, derived market headline
- **Dashboard stats strip** — mood, volatility, watchlist count, top gainer at a glance
- **Skeleton loading states** — every page has loading and error states
- **Staggered animations** — Framer Motion entrance animations throughout

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode, zero `any`) |
| Styling | Tailwind CSS 4 (no inline styles) |
| State management | Zustand 5 |
| Charts | Recharts 3 |
| Animations | Framer Motion 12 |
| HTTP client | Axios |
| Data source | Binance public REST API |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # / — Dashboard (market overview)
│   ├── insights/
│   │   └── page.tsx                # /insights — Market intelligence
│   ├── watchlist/
│   │   └── page.tsx                # /watchlist — Saved coins
│   ├── coin/
│   │   └── [symbol]/
│   │       └── page.tsx            # /coin/BTC — Coin detail + chart
│   └── api/
│       ├── market/route.ts         # GET /api/market
│       ├── insights/route.ts       # GET /api/insights
│       └── coin/[symbol]/route.ts  # GET /api/coin/BTC?interval=1d
│
├── features/
│   ├── market/
│   │   ├── types.ts                # CoinData, KlineData, InsightsData interfaces
│   │   ├── store/marketStore.ts    # Zustand store — coins, loading, error
│   │   └── hooks/useMarketData.ts  # Fetch + cache + 30s auto-refresh
│   ├── coin/
│   │   └── hooks/useCoinDetail.ts  # Fetch kline (OHLCV) data per interval
│   ├── insights/
│   │   └── hooks/useInsights.ts    # Fetch derived market insights
│   └── watchlist/
│       ├── store/watchlistStore.ts # Zustand store — persisted to localStorage
│       └── hooks/useWatchlist.ts   # Add / remove / check watchlisted coins
│
├── shared/
│   ├── components/
│   │   ├── Card.tsx                # Dark glass card wrapper
│   │   ├── Navbar.tsx              # Top navigation with active states
│   │   ├── SkeletonLoader.tsx      # Animated loading placeholders
│   │   └── TrendBadge.tsx          # Sentiment badge
│   ├── utils/
│   │   ├── format.ts               # formatPrice(), formatChange()
│   │   ├── sentiment.ts            # getSentiment(), getMarketSentiment()
│   │   └── coinColors.ts           # Badge background color per coin symbol
│   └── theme/colors.ts             # Centralized color constants
│
└── lib/
    └── api.ts                      # Axios instance (baseURL: /api)
```

---

## How Data Flows

```
Binance Public API  (called server-side — no CORS, no key exposure)
         │
         ▼
  Next.js API Routes
  /api/market          →  fetches 6 coins, returns CoinData[]
  /api/insights        →  derives mood, volatility, top movers
  /api/coin/[symbol]   →  fetches OHLCV klines
         │
         ▼
  Axios (/lib/api.ts)  ←  client calls our own /api routes only
         │
         ▼
  Custom Hooks         ←  one hook per feature domain
  useMarketData()          polls every 30s, writes to Zustand
  useInsights()            fetches on mount
  useCoinDetail(s, i)      re-fetches when interval changes
  useWatchlist()           reads/writes Zustand, no network call
         │
         ▼
  Zustand Stores       ←  global state, no Provider needed
  marketStore              coins[], loading, error, lastUpdated
  watchlistStore           savedCoins[] → persisted to localStorage
         │
         ▼
  Page Components      ←  consume hooks, render UI
```

---

## Pages

### `/` — Dashboard
The main entry point. Shows a live market mood hero card whose gradient shifts with sentiment (green for Bullish, red for Bearish, purple for Neutral). Below it, a stats strip surfaces mood, volatility, watchlist size, and the top-gaining coin. The coin grid auto-refreshes every 30 seconds with skeleton placeholders during loads.

### `/insights`
Aggregated market intelligence:
- Overall market mood with a gainers vs losers progress bar
- Volatility gauge slider (Low → Moderate → High)
- Top 3 gainers and top 3 losers with live % changes
- Derived market insight card with headline and subtext
- Live "Updated Xs ago" timer that resets on each data refresh

### `/watchlist`
All coins the user has saved. Empty state prompts navigation to Market. When coins are present, renders a live data table (price, 24H change, remove action). Persists across refreshes via `localStorage`.

### `/coin/[symbol]`
Full detail view for any supported coin:
- Hero with live price, % change, sentiment badge, 24H high/low/volume
- Recharts AreaChart pulling real OHLCV klines from Binance
- Time range pills (1H / 4H / 1D / 1W) that re-fetch chart data on click
- Sentiment bar (bull % vs bear %) derived from price change magnitude
- Add / Remove watchlist button that syncs globally across all pages

---

## Sentiment Logic

```
Per-coin (from 24H price change %):
  > +2%   →  Bullish   #00FF85  green
  < -2%   →  Bearish   #FF4D4D  red
  between →  Neutral   #9B6DFF  purple

Overall market mood:
  gainers > losers × 2   →  Bullish
  losers  > gainers × 2  →  Bearish
  otherwise              →  Neutral

Volatility (avg |priceChange| across all tracked coins):
  < 2%   →  Low
  2–5%   →  Moderate
  > 5%   →  High
```

---

## Supported Coins

| Symbol | Name | Binance Pair |
|---|---|---|
| BTC | Bitcoin | BTCUSDT |
| ETH | Ethereum | ETHUSDT |
| SOL | Solana | SOLUSDT |
| BNB | BNB | BNBUSDT |
| ADA | Cardano | ADAUSDT |
| XRP | XRP | XRPUSDT |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Mortarion002/Crypto-Pulse.git
cd Crypto-Pulse
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No API keys required — Binance's public endpoints are called server-side with no authentication.

### Production build

```bash
npm run build
npm start
```

---

## API Routes

### `GET /api/market`
Returns live 24H ticker data for all tracked coins.

**Response:** `CoinData[]`
```json
[
  {
    "symbol": "BTCUSDT",
    "displaySymbol": "BTC",
    "name": "Bitcoin",
    "price": 67420.5,
    "priceChange": 3.24,
    "high24h": 68100,
    "low24h": 65200,
    "volume": 2100000000,
    "sentiment": "Bullish",
    "color": "#F7931A"
  }
]
```

### `GET /api/insights`
Returns derived market intelligence computed from Binance ticker data.

**Response:** `InsightsData`
```json
{
  "marketMood": "Bullish",
  "gainers": 4,
  "losers": 2,
  "gainersPercent": 67,
  "topGainers": [...],
  "topLosers": [...],
  "volatility": "Moderate",
  "insightHeadline": "4 coins surging — broad market rally",
  "insightSubtext": "BTC leading with +3.24% — altcoins following"
}
```

### `GET /api/coin/[symbol]?interval=1d`
Returns OHLCV kline data for a specific coin.

**Parameters:**
- `symbol` — coin symbol (e.g. `BTC`, `ETH`)
- `interval` — `1h` | `4h` | `1d` | `1w`

**Response:** `KlineData[]`
```json
[
  { "time": "Apr 15", "price": 65200, "high": 65800, "low": 64900, "volume": 182000 }
]
```

---

## How to Add a Coin to Watchlist

1. Go to **Market** (`/`)
2. Click any coin card
3. On the coin detail page, click **"+ Add to Watchlist"**
4. Navigate to **Watchlist** to see it there

The watchlist persists in `localStorage` — closing or refreshing the tab keeps your coins saved.

---

## Key Design Decisions

**API routes as a Binance proxy** — All Binance calls happen server-side inside Next.js Route Handlers. This eliminates CORS errors and keeps credentials (if ever needed) off the client.

**Zustand over Context** — No Provider wrapper needed. Any component subscribes to exactly the slice of state it needs. The watchlist store uses `zustand/middleware persist` to sync automatically with `localStorage`.

**Hooks own all data fetching** — Components never call Axios directly. Each feature has a dedicated hook that owns loading, error, and refresh logic. Pages stay declarative.

**Tailwind-only styling** — Zero `style={{}}` inline styles except one documented exception: the active chart interval pill uses an inline `backgroundColor` because the accent color is dynamic (changes with coin sentiment) and cannot be expressed as a static Tailwind class at build time.

**Strict TypeScript** — Strict mode, no `any` types. All Binance API responses are typed at the boundary inside route handlers before reaching client code.

---

## License

MIT
