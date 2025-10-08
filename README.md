# Super DeFi Bank

> A decentralized Finance (DeFi) banking platform with AI chatbot integration for web and mobile.
> Work in progress - 10 to 13 day sprint

## Table of Contents

- [Features](#features)
- [Quick Project Summary](#quick-project-summary)
- [Prioritized Checklist](#prioritized-checklist)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Screenshots & Demo](#screenshots--demo)
- [Installation](#installation)
- [Contact](#contact)

## Features

- **User Authentication:** Secure registration and login with **Wallet Connect** (Web & Mobile).  
- **ERC-20 Token:** Custom **BankToken (BKT)** for transactions.  
- **NFT Minting:** Create and manage NFTs directly from the platform.  
- **Blockchain Integration:** Backend APIs and Express server listen to smart contract events in real time.  
- **Web Dashboard:** Interactive admin and user dashboards built with React + TypeScript.  
- **Mobile App:** Native Android app built with Kotlin + Jetpack Compose.  
- **AI Chatbot:** Smart assistant powered by Python and ML models.  
- **Deployment:** Hosted on **Vercel**, **Render**, or other free-tier cloud platforms.  
- **Demo Access:** Includes sample credentials and preloaded seed data for testing.

## Quick Project Summary

**Goal:** Build a working prototype (not production) deployable to an Ethereum testnet, showcasing ERC-20 token and NFT flows, an AI chatbot that understands bank-related queries, a web dashboard with charts, and a simplified mobile app.

**Priority:** Technical completeness and demonstrable features (over publish).

## Prioritized checklist

- [ ] **Smart contracts**
  - [✔️] ERC-20 `BankToken (BKT)` with mint role
  - [ ] ERC-721 `BankNFT` with metadata support
  - [ ] Hardhat tests + deploy script to testnet
- [✔️] **Backend (Express)**
  - [✔️] ethers.js listener for Transfer / Mint events
  - [✔️] REST APIs: '/login', '/register' user.
  - [✔️] Persist events & seed/demo data to MongoDB
- [ ] **Web (React + TS)**
  - [✔️] WalletConnect integration
  - [✔️] Token balance + transfer UI
  - [ ] NFT mint UI + gallery
  - [ ] Charts (recharts/chart.js) using `/events` data
- [ ] **AI Chatbot (Python)**
  - [ ] Basic intent classifier or small LLM wrapper
  - [ ] REST `/chat` endpoint with CORS
  - [ ] Hook chat widget into dashboard
- [ ] **Mobile (Kotlin + Jetpack Compose)**
  - [✔️] WalletConnect (or wallet deep-link) support
  - [✔️] View balances + trigger at least one action
- [ ] **Deployment & demo**
  - [ ] Deploy frontend (Vercel / Netlify)
  - [ ] Deploy backend (Render / Railway / free-tier)
  - [ ] Provide demo mnemonic / test wallets + seed script
  - [ ] README demo steps + sample screenshots

## Tech Stack

### **Languages & Frameworks**
- Node.js + Express  
- React + TypeScript  
- Kotlin + Jetpack Compose  
- Solidity (ERC-20, NFT)  
- Python (AI & ML)

---

### **Architecture & Design**
- MVC (Backend)  
- MVVM + Repository Pattern (Android)  
- Component-Based Architecture (React)  
- Smart Contract Architecture (Blockchain)

---

### **Libraries & Tools**
- Hilt, Coroutines, LiveData, StateFlow, ViewModel  
- Hardhat (Blockchain)  
- Axios / Fetch (API Communication)  
- TensorFlow, scikit-learn (ML)  
- Navigation Component (Android)

---

### **DevOps & Other Tools**
- Git & GitHub  
- Firebase (Auth & Firestore)  
- MongoDB  
- Postman  
- VS Code / Android Studio  
- npm / yarn

## Prerequisites

- Node.js
- Python
- npm
- MongoDB
- Hardhat
- Andriod Studio
- Alchemy / Infura RPC key (optional for testnet interaction)

## Folder Structure

/backend  
/web  
/mobile  
/contracts  
/chatbot  
/README.md  

## API Endpoints ("/api")

> Soon updated

## Screenshots & Demo

### Screenshots

> Soon updated

### Demo

> Soon updated

## Installation

### Environment Variables (backend/.env)
> Soon updated

### Backend (run)
> Soon updated

### Web (run)
> Soon updated

### Mobile (run)
> Soon updated

### Chatbot (run)
> Soon updated

## Contact

**Author:** Vishal Chaudhary  
**Email:** [vishh8630@gmail.com](mailto:vishh8630@gmail.com)  
**GitHub:** [https://github.com/Vishal-8630](https://github.com/Vishal-8630)  
**LinkedIn:** [https://www.linkedin.com/in/vishal8630](https://www.linkedin.com/in/vishal8630)  
