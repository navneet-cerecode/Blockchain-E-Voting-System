# Decentralized E-Voting System

![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black)

A fully decentralized, secure, and transparent electronic voting application built on the Ethereum blockchain. Developed as a B.Tech Major Project to solve the vulnerabilities of centralized databases in modern democratic elections.

## Overview

Traditional electronic voting machines and centralized databases are highly vulnerable to hacking, data manipulation, and authorization fraud. This project shifts the paradigm from "Trust the Administrator" to "Trust the Code" by leveraging a distributed ledger. 

Once a vote is cast via a cryptographically verified MetaMask wallet, it is permanently recorded on the Ethereum blockchain. It is mathematically impossible to alter the tally or delete a ballot, ensuring a 100% transparent and immutable election.

## Key Features

* **Immutable Ledger:** Votes are permanently written to the blockchain, ensuring zero tampering.
* **Cryptographic Security:** Requires MetaMask Web3 authentication to interact with the ballot.
* **Role-Based Access Control (RBAC):** Only the cryptographically verified `admin` wallet can register candidates or authorize voters.
* **Double-Voting Prevention:** Smart contract actively rejects multiple transactions from the same wallet address.
* **Soft-Delete Capability:** Admins can instantly disqualify candidates or revoke voter access in real-time.
* **Responsive UI:** A sleek, enterprise-grade dark/light mode Progressive Web App (PWA) built with React.

## Tech Stack

**Client-Side (Frontend):**
* React.js (Vite)
* Ethers.js (Web3 Middleware)
* CSS Module Styling

**Blockchain (Backend):**
* Solidity (v0.8.28)
* Hardhat (Development Environment & Local Node)
* MetaMask (Identity & Wallet Provider)

---

## Installation & Setup

To run this project locally, you will need to spin up the Hardhat blockchain and the React development server concurrently.

### Prerequisites
* [Node.js](https://nodejs.org/en/) installed on your machine.
* [MetaMask](https://metamask.io/) browser extension installed.
* 
### 1. Clone the Repository
```bash
git clone [https://github.com/navneet-cerecode/Blockchain-E-Voting-System.git](https://github.com/navneet-cerecode/Blockchain-E-Voting-System.git)
cd Blockchain-E-Voting-System
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Start the Local Blockchain Node
Open a terminal and start the Hardhat local testing network. Leave this terminal running.

```bash
npx hardhat node
```

### 4. Deploy the Smart Contract
Open a second terminal window and deploy the Solidity contract to your local network.

```bash
npx hardhat ignition deploy ./ignition/modules/Voting.ts --network localhost
```

*(Note: If the deployment generates a new contract address, copy it and paste it into `frontend/src/config.js` under `CONTRACT_ADDRESS`)*

### 5. Start the React Frontend
In your second terminal window, navigate to the frontend folder, install dependencies, and start the app.

```bash
cd frontend
npm install
npm run dev
```
### 6. Connect MetaMask
1. Open your browser to `http://localhost:5173`.
2. In MetaMask, add a local network manually (RPC URL: `http://127.0.0.1:8545`, Chain ID: `31337`).
3. Import the first Hardhat test account using its private key (this wallet will automatically be granted Admin privileges).

