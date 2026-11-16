# MemeForge — Ammora Builder demo

A responsive React + TypeScript + Vite frontend for discovering, proposing and voting on community meme ideas.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Current functionality

- Responsive meme discovery feed
- Search and category filters
- Create a meme idea (in-memory demo state)
- Vote on ideas (in-memory demo state)
- Injected EVM wallet connection, if opened inside a compatible wallet browser

## Important integration status

This repository is currently a **frontend prototype**. It does not deploy tokens, submit votes on-chain, execute swaps, or call Ammora smart contracts. No contract addresses or SDK method signatures have been guessed.

Before claiming an Ammora SDK integration, check the current official Ammora developer documentation and GIWA testnet configuration, then implement and test the documented calls. Never use mainnet funds for testing.

## Deploy

Connect the GitHub repository to Vercel or another Vite-compatible static hosting provider. Build command: `npm run build`. Output directory: `dist`.
