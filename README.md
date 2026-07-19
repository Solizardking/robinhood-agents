# Robinhood Agents: EVM + SVM Agent Forge

An MIT-licensed framework that lets users choose where to create an agent identity:

- **Robinhood Chain:** ERC-8004 identity NFT on EVM, with reputation and validation registries.
- **Solana:** Metaplex Core agent asset plus Agent Identity registration on SVM.

Both paths use the same product flow: select a chain, prepare metadata, review authority and transaction details, authorize with the matching wallet, then verify canonical chain state.

## Quick start

```bash
npm install
node src/cli.js capabilities --site http://localhost:5000
node src/cli.js prepare --platform robinhood --file examples/robinhood-agent.json --site http://localhost:5000
node src/cli.js prepare --platform solana --file examples/solana-agent.json --site http://localhost:5000
```

The SDK offers `createAgentForge({ baseUrl })`, whose `prepare({ platform, ... })` and `inspect({ platform, ... })` methods route to the correct Cheshire site APIs.

## Layout

- `src/` — chain-selectable SDK and CLI.
- `contracts/` — open-source Robinhood Chain ERC-8004 registry suite.
- `skills/robinhood-agent-forge/` — reusable agent skill.
- `examples/` — EVM and SVM registration inputs.

## Security model

The Robinhood API builds unsigned calldata and never accepts a user private key. The existing Solana site path may be treasury-sponsored; it must still authenticate wallet intent and disclose ownership, update authority, delegate/freeze policy, and the confirmed signature. Never ask for seed phrases. Default to test networks and require explicit confirmation for mainnet writes.

Identity tokens are chain-scoped. Registering on both platforms creates two distinct identities; it does not automatically bridge or merge them.

## License

MIT. See [LICENSE](LICENSE).
