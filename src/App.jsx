import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [candidateName, setCandidateName] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // 'info', 'success', 'error'

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const currentAccount = accounts[0];
          setAccount(currentAccount);

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(votingContract);

          const adminAddress = await votingContract.admin();
          setIsAdmin(currentAccount.toLowerCase() === adminAddress.toLowerCase());
        } else {
          setAccount(null);
          setContract(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        checkIfWalletIsConnected();
      } catch (error) {
        console.error("Connection failed:", error);
      }
    } else {
      alert("Please install MetaMask to use this application.");
    }
  };

  const fetchCandidates = async () => {
    if (contract) {
      try {
        const count = await contract.candidatesCount();
        const tempCandidates = [];
        for (let i = 1; i <= Number(count); i++) {
          const candidate = await contract.getCandidate(i);
          tempCandidates.push({
            id: candidate[0].toString(),
            name: candidate[1],
            voteCount: candidate[2].toString()
          });
        }
        setCandidates(tempCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        checkIfWalletIsConnected(); 
      });
    }
  }, []);

  useEffect(() => {
    if (contract) {
      fetchCandidates();
    }
  }, [contract]);

  const handleAddCandidate = async () => {
    if (!candidateName) return;
    try {
      setStatusType("info");
      setStatusMessage("Processing transaction on the network...");
      const tx = await contract.addCandidate(candidateName);
      await tx.wait();
      setStatusType("success");
      setStatusMessage(`Candidate "${candidateName}" has been officially registered.`);
      setCandidateName("");
      fetchCandidates();
    } catch (error) {
      console.error(error);
      setStatusType("error");
      setStatusMessage("Transaction failed. Verification denied.");
    }
  };

  const handleRegisterVoter = async () => {
    if (!voterAddress) return;
    try {
      setStatusType("info");
      setStatusMessage("Authorizing voter credentials...");
      const tx = await contract.registerVoter(voterAddress);
      await tx.wait();
      setStatusType("success");
      setStatusMessage(`Voter wallet authorized successfully.`);
      setVoterAddress("");
    } catch (error) {
      console.error(error);
      setStatusType("error");
      setStatusMessage("Authorization failed. Address may already be registered."); 
    }
  };

  const handleVote = async (candidateId) => {
    try {
      setStatusType("info");
      setStatusMessage("Broadcasting secure vote to the blockchain...");
      const tx = await contract.vote(candidateId);
      await tx.wait();
      setStatusType("success");
      setStatusMessage("Vote recorded and verified successfully.");
      fetchCandidates();
    } catch (error) {
      console.error(error);
      setStatusType("error");
      setStatusMessage("Voting transaction rejected. Ensure you are authorized and have not yet voted.");
    }
  };

  // --- ENTERPRISE DESIGN SYSTEM ---
  const theme = {
    bg: "#F8FAFC",          // Slate 50
    card: "#FFFFFF",        // Pure White
    textMain: "#0F172A",    // Slate 900
    textMuted: "#64748B",   // Slate 500
    primary: "#2563EB",     // Trust Blue 600
    border: "#E2E8F0",      // Slate 200
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
  };

  // Helper for status bar colors
  const getStatusStyle = () => {
    if (statusType === "success") return { bg: "#ECFDF5", color: "#065F46", border: "#34D399" };
    if (statusType === "error") return { bg: "#FEF2F2", color: "#991B1B", border: "#F87171" };
    return { bg: "#EFF6FF", color: "#1E40AF", border: "#60A5FA" }; // info
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.bg, color: theme.textMain, fontFamily: "system-ui, -apple-system, sans-serif", padding: "4rem 1rem", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "850px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <header style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", margin: "0 0 8px 0", color: theme.textMain, letterSpacing: "-0.5px" }}>
            Secure E-Voting Protocol
          </h1>
          <p style={{ color: theme.textMuted, fontSize: "1rem", margin: 0 }}>
            Decentralized election infrastructure powered by Ethereum.
          </p>
        </header>
        
        {/* Connection State */}
        {!account ? (
          <div style={{ backgroundColor: theme.card, padding: "4rem 3rem", borderRadius: "12px", border: `1px solid ${theme.border}`, boxShadow: theme.shadow, textAlign: "center" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem", fontWeight: "600" }}>Authentication Required</h2>
            <p style={{ color: theme.textMuted, marginBottom: "2.5rem", maxWidth: "400px", margin: "0 auto 2.5rem auto", lineHeight: "1.5" }}>
              A secure Web3 connection is required to access the voting network. Please authenticate using your provider.
            </p>
            <button 
              onClick={connectWallet} 
              style={{ padding: "12px 24px", fontSize: "1rem", fontWeight: "500", cursor: "pointer", backgroundColor: theme.primary, color: "#fff", border: "none", borderRadius: "6px", transition: "background-color 0.2s" }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#1D4ED8"}
              onMouseOut={(e) => e.target.style.backgroundColor = theme.primary}
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            {/* Wallet Info Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.card, padding: "1rem 1.5rem", borderRadius: "8px", marginBottom: "1.5rem", border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" }}></div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: theme.textMuted, fontWeight: "600", marginBottom: "2px" }}>Connected Address</span>
                  <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.9rem", color: theme.textMain }}>
                    {account}
                  </span>
                </div>
              </div>
              {isAdmin && (
                <span style={{ backgroundColor: "#F1F5F9", color: "#475569", padding: "6px 12px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.5px", border: `1px solid ${theme.border}` }}>
                  NETWORK ADMIN
                </span>
              )}
            </div>
            
            {/* Live Status Toast */}
            {statusMessage && (
              <div style={{ padding: "1rem 1.5rem", marginBottom: "1.5rem", backgroundColor: getStatusStyle().bg, color: getStatusStyle().color, borderLeft: `4px solid ${getStatusStyle().border}`, borderRadius: "4px", fontSize: "0.9rem", fontWeight: "500" }}>
                {statusMessage}
              </div>
            )}

            {/* Admin Dashboard */}
            {isAdmin && (
              <div style={{ backgroundColor: theme.card, padding: "2rem", borderRadius: "12px", marginBottom: "2rem", border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
                <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "600", color: theme.textMain }}>
                  Administrative Controls
                </h2>
                
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                  <input 
                    type="text" 
                    placeholder="Candidate Full Name" 
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    style={{ flex: 1, padding: "10px 16px", backgroundColor: "#F8FAFC", border: `1px solid ${theme.border}`, borderRadius: "6px", outline: "none", fontSize: "0.95rem", color: theme.textMain, transition: "border-color 0.2s" }}
                    onFocus={(e) => e.target.style.borderColor = theme.primary}
                    onBlur={(e) => e.target.style.borderColor = theme.border}
                  />
                  <button 
                    onClick={handleAddCandidate} 
                    style={{ padding: "0 24px", cursor: "pointer", backgroundColor: theme.textMain, color: "#fff", fontWeight: "500", border: "none", borderRadius: "6px" }}
                  >
                    Register Candidate
                  </button>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <input 
                    type="text" 
                    placeholder="Voter Public Address (0x...)" 
                    value={voterAddress}
                    onChange={(e) => setVoterAddress(e.target.value)}
                    style={{ flex: 1, padding: "10px 16px", backgroundColor: "#F8FAFC", border: `1px solid ${theme.border}`, borderRadius: "6px", outline: "none", fontSize: "0.95rem", fontFamily: "ui-monospace, monospace", color: theme.textMain, transition: "border-color 0.2s" }}
                    onFocus={(e) => e.target.style.borderColor = theme.primary}
                    onBlur={(e) => e.target.style.borderColor = theme.border}
                  />
                  <button 
                    onClick={handleRegisterVoter} 
                    style={{ padding: "0 24px", cursor: "pointer", backgroundColor: theme.primary, color: "#fff", fontWeight: "500", border: "none", borderRadius: "6px" }}
                  >
                    Authorize Voter
                  </button>
                </div>
              </div>
            )}

            {/* Main Voting Dashboard */}
            <div style={{ backgroundColor: theme.card, padding: "2rem", borderRadius: "12px", border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600", color: theme.textMain }}>
                  Official Ballot Ledger
                </h2>
                <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>Total Candidates: {candidates.length}</span>
              </div>
              
              {candidates.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 0", color: theme.textMuted, border: `1px dashed ${theme.border}`, borderRadius: "8px" }}>
                  <p style={{ margin: 0 }}>No candidates are currently registered on the network.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                        <th style={{ padding: "12px 16px", color: theme.textMuted, fontWeight: "600", fontSize: "0.85rem", textAlign: "left", width: "10%" }}>ID</th>
                        <th style={{ padding: "12px 16px", color: theme.textMuted, fontWeight: "600", fontSize: "0.85rem", textAlign: "left", width: "50%" }}>CANDIDATE</th>
                        <th style={{ padding: "12px 16px", color: theme.textMuted, fontWeight: "600", fontSize: "0.85rem", textAlign: "left", width: "20%" }}>VERIFIED VOTES</th>
                        <th style={{ padding: "12px 16px", color: theme.textMuted, fontWeight: "600", fontSize: "0.85rem", textAlign: "right", width: "20%" }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((candidate) => (
                        <tr key={candidate.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <td style={{ padding: "16px", color: theme.textMuted, fontSize: "0.95rem" }}>{candidate.id}</td>
                          <td style={{ padding: "16px", color: theme.textMain, fontWeight: "500", fontSize: "1rem" }}>{candidate.name}</td>
                          <td style={{ padding: "16px", color: theme.textMain, fontWeight: "600", fontSize: "1rem" }}>{candidate.voteCount}</td>
                          <td style={{ padding: "16px", textAlign: "right" }}>
                            <button 
                              onClick={() => handleVote(candidate.id)}
                              style={{ padding: "8px 20px", backgroundColor: "transparent", color: theme.primary, border: `1px solid ${theme.primary}`, borderRadius: "4px", cursor: "pointer", fontWeight: "500", fontSize: "0.9rem", transition: "all 0.2s ease" }}
                              onMouseOver={(e) => { e.target.style.backgroundColor = "#EFF6FF"; }}
                              onMouseOut={(e) => { e.target.style.backgroundColor = "transparent"; }}
                            >
                              Cast Vote
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default App;