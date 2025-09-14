flowchart LR
  subgraph Alice["Alice device (client)"]
    A1[Ed25519 DID keypair (sign/verify)\nPrivate stays on device]
    A2[X25519 Identity keypair (IK_A)]
    A3[Signed PreKey (SPK_A) + sig(Ed25519)]
    A4[One-Time PreKeys (OPK_A[1..N])]
    A5[libsodium: X3DH + Double Ratchet\nXChaCha20-Poly1305]
    A6[Secure Keystore\nBrowser: IndexedDB (wrapped)\nMobile: Keychain/Keystore]
  end

  subgraph PRISM["Atala PRISM"]
    P1[DID Document (verification: Ed25519 pub)]
    P2[Service endpoint → Prekey API URL]
  end

  subgraph PrekeyAPI["Prekey Server (public material only)"]
    K1[Prekey bundle:\n{ IK_A_pub, SPK_A_pub, sig_A(Ed25519), OPK ids }]
  end

  A1 -- publish Ed25519 public --> P1
  A3 -- SPK signed by --> A1
  A1 -- update DID Doc/service --> P2
  A2 & A3 & A4 --> K1
  P2 --> K1
