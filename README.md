# X3DH + Double Ratchet (Atala PRISM integration)

<!-- Mermaid (GitHub, GitLab, etc.) -->
```mermaid
sequenceDiagram
  autonumber
  participant Alice
  participant Bob

  Alice->>Alice: Mỗi tin nhắn: CK_send → KDF → MK_i; advance CK_send'
  Alice->>Bob: Gửi header {optional new DH_pub, PN, N} + AEAD(MK_i, AAD)
  Bob->>Bob: Nếu có new DH_pub → DH ratchet → update RootKey & CK_recv
  Bob->>Bob: CK_recv → KDF → MK_i; decrypt; advance CK_recv'

flowchart TD
  %% ===================== ACTORS =====================
  subgraph Alice["Alice device (client)"]
    A1["① Tạo Ed25519 DID keypair (ký/xác minh)\n— private ở lại thiết bị"]
    A2["② Tạo X25519 Identity Key (IK_A)"]
    A3["③ Tạo Signed PreKey (SPK_A)\n— ký bằng Ed25519"]
    A4["④ Tạo One-Time PreKeys (OPK_A[1..N])"]
    A5["libsodium: X3DH + Double Ratchet\nXChaCha20-Poly1305"]
    A6["Secure Keystore\nBrowser: IndexedDB (wrapped)\nMobile: Keychain/Keystore"]
  end

  subgraph PRISM["⑤ Cập nhật Atala PRISM (DID Document)"]
    P1["DID Document: chứa Ed25519 public (verification)"]
    P2["Service endpoint → Prekey API URL"]
  end

  subgraph PrekeyAPI["Prekey Server (public material only)"]
    K1["Prekey API: phục vụ bundle"]
    K2["Bundle:\n{ IK_A_pub, SPK_A_pub, sig_A(Ed25519), OPK ids }"]
  end

  subgraph Bob["Bob device (client)"]
    B1["⑥ Resolve did:prism:alice trên PRISM\n→ lấy Prekey API URL"]
    B2["⑦ Fetch Prekey bundle từ Prekey API"]
    B3["⑧ X3DH: tính shared secret SK\n(EK_B, IK_B ↔ IK_A, SPK_A, OPK_A)"]
    B4["⑨ Khởi tạo Double Ratchet\n(root/chain keys)"]
    B6["⑬ Trao đổi tin nhắn 2 chiều\n(Double Ratchet liên tục)"]
    B7["Secure Keystore"]
  end

  subgraph Msg["Messaging Service"]
    M1["Socket.IO / WebSocket / HTTP"]
  end

  %% ===================== SETUP / PROVISIONING =====================
  A3 -- "được ký bởi" --> A1
  A1 -- "① publish Ed25519 public" --> P1
  A1 -- "⑤ update service endpoint" --> P2
  A2 & A3 & A4 -->|"④ (Đăng) Prekey bundle"| K2
  K2 --> K1
  P2 -- "⑤ PRISM trỏ Prekey API" --> K1

  %% Keystore ties
  A1 & A2 & A3 & A4 --> A6
  B3 --> B7

  %% ===================== SESSION ESTABLISHMENT =====================
  P2 -->|"⑥ Bob resolve URL"| B1
  B1 -->|"⑦ GET /bundle"| K1
  K1 -->|"⑦ 200 + bundle"| B2
  B2 -. "consume OPK (đánh dấu đã dùng)" .-> K1

  %% Bob starts session
  B2 --> B3
  B3 --> B4

  %% First message out
  B4 -->|"⑩ Gửi tin nhắn đầu tiên (ciphertext)\nAAD = {messageId, contractId, senderDID, timestamp}"| M1

  %% Alice receives, completes X3DH side, starts ratchet
  M1 -->|"⑪ Deliver"| A5
  A5 -->|"⑫ Alice derive SK (IK_A, SPK_A, OPK_A khớp)\n→ khởi tạo Double Ratchet"| A6

  %% Ongoing messaging (both directions)
  A5 <-->|"⑬ Double Ratchet tiếp tục (encrypt/decrypt)"| B6
  B6 <--> M1
  M1 <--> A5

