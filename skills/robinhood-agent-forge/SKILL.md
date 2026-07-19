---
name: robinhood-agent-forge
description: Register, mint, inspect, and deploy AI agent identities and tokens on either Robinhood Chain (EVM/ERC-8004) or Solana (SVM/Metaplex) through Cheshire Terminal and the open-source robinhood-agents SDK. Use for chain selection, agent metadata, unsigned intents, wallet-confirmed registration, registry deployment, discovery, reputation, validation, or testnet-to-mainnet release workflows.
---

# Robinhood Agent Forge

Offer `Robinhood Chain` and `Solana` as explicit choices before any write. Use the shared lifecycle: prepare, review, wallet-authorize, submit, confirm, inspect.

## Choose the platform

- Choose Robinhood Chain for an EVM ERC-721 identity with ERC-8004 identity, reputation, and validation registries. Default to testnet chain `46630`; mainnet is `4663`.
- Choose Solana for a Metaplex Core agent asset and Agent Identity registration. Default to devnet for testing and mainnet-beta only after explicit confirmation.
- Do not imply that one token exists on both chains. Treat each registration as a distinct chain-scoped identity and link them in metadata only when ownership has been verified on both.

Read [references/api.md](references/api.md) for exact site endpoints and request shapes.

## Register or mint

1. Validate the selected platform and network.
2. Collect name, description, image, services, and capabilities. Prefer immutable `ipfs://` metadata in production.
3. Fetch platform capability/configuration status from the site.
4. Prepare the platform-specific action.
5. Show the user the network, target program or contract, decoded action, fees/value, and metadata URI.
6. Require explicit wallet authorization immediately before a live write.
7. Submit with the matching wallet: EVM wallet for Robinhood, Solana wallet for Solana.
8. Verify the receipt/signature against the selected chain, then inspect canonical state.

Never request, store, print, or transmit a user private key or seed phrase. Do not silently switch platforms or networks.

## Deploy infrastructure

Read [references/deployment.md](references/deployment.md). Robinhood registry deployment and end-user minting are separate operations. Simulate first, verify every deployed contract, and never invent a registry address. Solana uses the published Metaplex programs; verify program IDs and cluster before signing.

## Guardrails

- Keep RPC credentials and indexer keys server-side.
- Treat EVM ERC-721 approval as transfer-capable authority.
- Treat Solana update authority and delegates as consequential permissions.
- Use direct chain reads as canonical; Blockscout and DAS are discovery/indexing layers.
- Do not claim deployment, verification, registration, or finality without checking it.
- Explain that agent identity tokens are not promises of investment value.
