# X3DH + Double Ratchet (Atala PRISM integration)

<!-- Mermaid (GitHub, GitLab, etc.) -->
```mermaid
flowchart LR
  %% Order markers (1)→(7) on edges
  subgraph Alice["Alice device (client)"]
    A1["Ed25519 DID keypair (sign/verify)<br/>Private stays on device"]
    A2["X25519 Identity keypair (IK_A)"]
    A3["Signed PreKey (SPK_A) + sig(Ed25519)"]
    A4["One-Time PreKeys (OPK_A[1..N])"]
    A5["libsodium: X3DH + Double Ratchet<br/>XChaCha20-Poly1305"]
    A6["Secure Keystore<br/>Browser: IndexedDB (wrapped)<br/>Mobile: Keychain/Keystore"]
  end

  subgraph PRISM["Atala PRISM"]
    P1["DID Document (verification: Ed25519 pub)"]
    P2["Service endpoint → Prekey API URL"]
  end

  subgraph PrekeyAPI["Prekey Server (public material only)"]
    K1["Prekey bundle:<br/>{ IK_A_pub, SPK_A_pub, sig_A(Ed25519), OPK ids }"]
  end

  A1 -- "(1) publish Ed25519 public" --> P1
  A3 -- "(2) SPK signed by A1 (Ed25519)" --> A1
  A1 -- "(3) update DID Doc/service" --> P2
  A2 -- "(4) upload IK_A_pub" --> K1
  A3 -- "(5) upload SPK_A_pub + signature" --> K1
  A4 -- "(6) upload OPK_A ids" --> K1
  P2 -- "(7) PRISM points clients to Prekey API" --> K1

