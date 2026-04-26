import VotingABI from "./contracts/Voting.json";

// The address you just got from the deployment terminal
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// We extract just the ABI array from the massive JSON file
export const CONTRACT_ABI = VotingABI.abi;