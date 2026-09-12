# 8Byte Fintech Portfolio Dashboard

A dynamic portfolio dashboard built with **Next.js, TypeScript, Tailwind CSS, and Node.js**.

The application displays portfolio holdings, retrieves market data from Yahoo Finance and Google Finance, calculates portfolio values and gain/loss, and automatically refreshes the data.

## Features

* Summary Dashboard
* Portfolio holdings table
* Sector-wise chart and overview
* Search and sector filtering
* CMP from Yahoo Finance
* P/E Ratio and Latest Earnings from Google Finance
* Dynamic Present Value and Gain/Loss calculations
* Automatic data refresh every 15 seconds
* Caching, loading, and provider error handling

## Tech Stack

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Backend:** Next.js API Routes, Node.js
* **Market Data:** Yahoo Finance, Google Finance
* **Data:** JSON

## Getting Started

### Prerequisites

* Node.js 20+
* npm

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Available Commands

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

## Application Routes

| Route            | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `/`              | Portfolio dashboard with summary and sector information |
| `/portfolio`     | Detailed portfolio holdings                             |
| `/api/portfolio` | API endpoint for portfolio and market data              |

## Data Flow

```text
Portfolio Data
      ↓
/api/portfolio
      ↓
Market Data Service
      ↓
 ┌───────────────┬───────────────┐
 ↓               ↓
Yahoo Finance   Google Finance
 ↓               ↓
CMP          P/E + Earnings
 └───────────────┬───────────────┘
                 ↓
       Portfolio Calculations
                 ↓
              Dashboard
```

The portfolio's static holding information is stored in `src/data/portfolioData.json`. Market-dependent values such as CMP, P/E Ratio, Present Value, and Gain/Loss are retrieved or calculated at runtime.

The frontend refreshes the portfolio data approximately every 15 seconds.

The refresh interval and provider request frequency are intentionally separated. A frontend refresh does not necessarily result in a new provider request when valid cached data is available.

The current cache is an in-memory cache, which is suitable for the assignment and local development.

## Project Structure

```text
src/
├── app/
│   ├── api/portfolio/
│   ├── portfolio/
│   └── page.tsx
├── components/
├── context/
├── data/
├── lib/
├── services/
│   ├── googleFinance.ts
│   ├── marketData.ts
│   └── yahooFinance.ts
└── types/
```

## Market Data

* The application uses Yahoo Finance for **CMP** and Google Finance for **P/E Ratio and Latest Earnings**.
* Both integrations use unofficial data sources, as these providers do not offer a direct public API for all the required metrics. The implementation therefore includes error handling for unavailable or changing provider data.

## Error Handling

* Yahoo Finance and Google Finance requests are handled independently.
* `Promise.allSettled()` is used for independent provider operations so that a failure for one holding or provider does not prevent the remaining portfolio data from being displayed.
* When a market-data value is unavailable, the available values are still displayed.
* Dependent calculations are not performed using invented or stale values.
* Provider errors are returned separately from the successful holdings.

## Limitations

* The market-data providers used in this assignment do not provide stable official APIs for all of the required information. Their responses and availability may change over time.
* The current implementation uses an in-memory cache, so cached data is local to the running server instance.
* The dashboard is intended as a technical assignment demonstration and should not be considered financial or investment advice.
