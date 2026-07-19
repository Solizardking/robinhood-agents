# Site API

Use a verified Cheshire Terminal deployment or local server.

## Platform capability checks

- Robinhood: `GET /api/robinhood/agents/config`
- Solana: `GET /api/metaplex-agents/health`

## Robinhood Chain (EVM)

Call `POST /api/robinhood/agents/prepare-registration` with `chainId`, `name`, `description`, `image`, `services`, `supportedTrust`, and optional `agentURI`. Expect an unsigned `intent` containing `chainId`, `to`, `data`, and `value`. Require `value` to equal `0x0` and decode calldata as `register(agentURI)` before wallet confirmation.

Inspect with `GET /api/robinhood/agents/:agentId?chainId=46630`. Discover mainnet agents with `GET /api/robinhood/agents`.

## Solana (SVM)

Call `POST /api/metaplex-agents/mint` to create a Metaplex Core agent asset and register its Agent Identity. Supply `ownerPubkey`, a fresh `CLAWD_AGENT_MINT_V2` `walletMessage`, its base64 `walletSignature`, and the agent fields used by the site.

Inspect with `GET /api/metaplex-agents/fetch/:assetAddress`.

The current Cheshire Solana path may be treasury-sponsored and server-submitted after wallet-authenticated authorization. The user wallet owns the Core asset, while the sponsoring treasury remains update authority and the asset is created frozen under the route's permanent-freeze policy. Present sponsorship, ownership, update authority, freeze/delegate policy, and the returned signature. Do not describe it as an unsigned client transaction. `POST /api/metaplex-agents/register`, `/delegate`, and `/set-token` are operator-only server-signer routes and must not be offered to normal users.
