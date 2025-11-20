## Crime Files

Crime Files is a decentralized, skill-based competitive puzzle game that fuses investigative storytelling with on-chain finality. Players interrogate AI-powered suspects, parse hidden clues, and collaborate (or misdirect) while the smart contract settles outcomes transparently on Scroll Sepolia.

> **Better than prediction markets**  
> **Player edge: from speculation to skill-based meritocracy.**

Unlike speculative markets that reward capital and timing, Crime Files rewards the intellectual work of deduction, decryption, and narrative reasoning. Winning depends on how well you can interrogate suspects, connect evidence, and commit a verdict before rival sleuths.

## Why It’s Different

- **Skill over speculation** – Outcomes hinge on logic, not liquidity. Clever codebreakers outperform bankroll whales.
- **AI suspect interrogations** – Each suspect is an agentic character you can question in natural language to surface alibis, contradictions, or intentional misdirection.
- **Transparent payouts** – Smart-contract enforced verdicts keep winnings auditable and tamper-proof.
- **Seasonal cases** – Each case has a defined timeline, curated evidence drops, and limited verdict windows to amplify urgency.

## Smart Contract

- **Network:** Scroll Sepolia Testnet
- **Address:** [`0xE8CB9364327DeA515B6E67AdEfa5fC2489Fdc675`](https://sepolia.scrollscan.com/address/0xE8CB9364327DeA515B6E67AdEfa5fC2489Fdc675)

The contract handles case launches, player registrations, verdict recording, and transparent result reveals.

## Gameplay Loop

1. **Open the crime file** – Pay the entry transaction to register on-chain and unlock the live case dossier.
2. **Investigate interactively** – Explore evidence drops, interrogate AI suspects, and collaborate with fellow detectives.
3. **Record your verdict** – Commit your suspect choice once confident in the narrative you uncovered.
4. **Await reveal** – When the host publishes the canonical solution, the contract rewards players who solved the case.

## Running Locally

```bash
npm install
npm run dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the experience. The client uses Wagmi + Reown AppKit to connect wallets and interact with the Scroll Sepolia deployment.

## Tech Stack Highlights

- **Next.js App Router** for the immersive, multi-page investigation experience
- **Viem + Wagmi** for contract reads/writes and wallet orchestration
- **AI SDK + custom prompts** to power suspect interrogations
- **Scroll Sepolia** for low-cost, EVM-compatible settlement during testing

## Contributing

Issues, feature ideas, and PRs are welcome. Please open an issue describing the narrative addition, UX tweak, or smart-contract enhancement you’d like to contribute. Keep spoilers tagged so investigators can opt in.
