---
name: robinhood-agent-forge
description: Prepare, register, inspect, and safely operate chain-scoped AI agent identities on Robinhood Chain (EVM/ERC-8004-compatible) or Solana (SVM/Metaplex Core) through Cheshire Terminal and the open-source robinhood-agents SDK. Use for chain selection, deployment verification, metadata, unsigned EVM registration intents, wallet-authorized sponsored Solana identity mints, ownership and authority review, reputation, validation, or guarded infrastructure deployment.
---

# Robinhood Agent Forge

Open `https://cheshireterminal.ai/agents/forge` for the canonical interactive flow. Ask the user to choose `Robinhood Chain` or `Solana` before preparing any write. Treat the result as one chain-scoped identity; never imply that a single token exists on both chains.

## Choose one rail

- Choose Robinhood Chain for an ERC-721 identity in the deployed ERC-8004-compatible identity, reputation, and validation suite. Prefer testnet chain `46630`. Require an explicit mainnet confirmation for chain `4663` immediately before wallet submission.
- Choose Solana for a wallet-owned Metaplex Core asset plus an Agent Identity registration attempt. Use only the cluster returned by the current health response. Treat `mainnet-beta` as a live mainnet write and require explicit confirmation.
- Create a separate identity if the user later chooses the other chain. Link identities only through metadata after verifying control of both.

Read [references/api.md](references/api.md) before calling Cheshire APIs, [references/sdk.md](references/sdk.md) before using the package, and [references/deployment.md](references/deployment.md) before trusting or deploying contracts.

## Execute the lifecycle

1. Fetch the selected rail's current capability response.
2. Validate the network or cluster, trusted registry/program, signer availability, sponsorship policy, and exact owner and authority model.
3. Collect the name, description, image, services, capabilities, and intended owner. Prefer durable `ipfs://` metadata for production.
4. Normalize and prepare the complete action without receiving a private key.
5. Show the user the chain, destination contract/program, decoded action, native value or sponsorship, metadata URI, owner, payer, update authority, freeze policy, and expected finality checks.
6. Require fresh wallet authorization only after the review. Never reuse a signed Solana intent.
7. Submit through the correct signer model: the EVM owner wallet broadcasts Robinhood calldata; the Solana owner signs the complete intent and the disclosed treasury submits the sponsored transaction.
8. Verify the transaction and direct chain state. Report a Solana mint whose Agent Identity registration failed as partial success.

Never request, store, print, or transmit a private key or seed phrase. Never silently switch a platform, network, wallet, registry, program, payer, authority, or metadata URI.

## Preserve ownership semantics

- Robinhood `register(agentURI)` mints the identity ERC-721 to `msg.sender` and initializes `agentWallet` to that same address. An ERC-721 transfer clears a nonzero `agentWallet`. An approval can transfer the identity and update metadata, so describe approvals as consequential authority.
- Robinhood reputation feedback comes from non-authorized clients; an owner or approved operator cannot self-review. Validation requests require identity owner/operator authority and name a validator that alone may respond.
- The hosted Solana route makes the user wallet the Core asset owner. The sponsoring treasury pays, remains update authority, and creates the asset frozen with a permanent freeze delegate. Show the exact treasury public key and policy before signature; stop if the current surface cannot disclose them.

## Enforce the identity-token boundary

- Robinhood Agent Forge currently registers an identity ERC-721 only. It does not deploy or mint a fungible ERC-20 agent token.
- The Solana route currently mints a Core identity asset only. The separate owner-signed Genesis fungible-token builder is production-paused. Do not call or advertise `/api/metaplex-agents/launch-token` unless a later capability response and operator policy explicitly enable it.
- Do not describe an identity or token as an investment or promise value, yield, liquidity, or price appreciation.

## Deploy only for a new namespace

The canonical registry suites are already deployed on Robinhood testnet and mainnet. Do not rerun their deployer or create a competing Cheshire identity namespace. Registry deployment is an operator action; end-user `register(agentURI)` is a separate wallet action. Solana uses existing Metaplex programs and does not require a replacement program deployment for an identity mint.

## Verify before claiming completion

- On EVM, require a successful receipt from the intended identity registry, a matching `Registered` event, then matching direct `ownerOf`, `agentURI`, and `getAgentWallet` reads. A receipt alone is insufficient.
- On Solana, the hosted route waits for `confirmed` commitment for both mint and registration transactions. Then fetch the Core asset and Agent Identity state. Call the identity complete only when the canonical fetch reports registration; otherwise preserve the mint signature and report partial success.
- Treat direct chain reads as canonical. Treat Blockscout, DAS, and other indexers as discovery layers that may lag.
- Do not claim deployment, source verification, registration, token launch, or finality without checking it.
