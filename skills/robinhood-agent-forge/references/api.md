# Cheshire Terminal API contract

Use `https://cheshireterminal.ai/agents/forge` for the interactive chain selector. For programmatic calls, use a verified Cheshire deployment or a trusted local server. The JSON shapes below describe this release's server contract; a deployed site may lag the source release, so verify every live response and treat non-2xx status as failure even when its body is parseable.

## Capability checks

### Robinhood configuration

Call `GET /api/robinhood/agents/config` before every prepare and again immediately before broadcast.

```json
{
  "success": true,
  "standard": "ERC-8004",
  "namespace": "eip155",
  "addressPolicy": "committed-manifest-only",
  "runtimeTrustRequired": true,
  "networks": [{
    "chainId": 4663,
    "name": "Robinhood Chain",
    "explorer": "https://robinhoodchain.blockscout.com",
    "contracts": { "identity": "0x...", "reputation": "0x...", "validation": "0x..." },
    "deploymentTxs": { "identity": "0x...", "reputation": "0x...", "validation": "0x..." },
    "runtimeCodeHashes": { "identity": "0x...", "reputation": "0x...", "validation": "0x..." },
    "deploymentBlock": 14150372,
    "deployedAt": "2026-07-19T21:06:37Z",
    "deployer": "0x...",
    "manifest": "packages/robinhood-deploy/deployments/agent-registries-mainnet-4663.json",
    "runtimeVerification": {
      "chainId": 4663,
      "checkedAt": "2026-07-19T21:41:35Z",
      "trusted": true,
      "contracts": {
        "identity": {
          "role": "identity",
          "address": "0x...",
          "expectedRuntimeCodeHash": "0x...",
          "observedRuntimeCodeHash": "0x...",
          "status": "pass",
          "reason": "Runtime code hash matches the committed deployment manifest"
        }
      }
    }
  }],
  "blockscout": { "dataPlane": "...", "configured": true, "chainId": 4663, "mcp": "https://mcp.blockscout.com" }
}
```

Expect entries for chain IDs `4663` and `46630`. The `runtimeVerification.contracts` object contains the same check shape for `identity`, `reputation`, and `validation`; `status` is `pass`, `fail`, or `unavailable`, and an unavailable observation has `observedRuntimeCodeHash: null`. Require `addressPolicy === "committed-manifest-only"`, `runtimeTrustRequired === true`, and the selected network's `runtimeVerification.trusted === true`. Stop if any selected address or expected hash differs from the reviewed manifest. An address present in a manifest is not proof that a hosted deployment currently serves or trusts that configuration.

### Solana health and gate

Call `GET /api/metaplex-agents/health`. On success, expect:

```json
{
  "success": true,
  "rpcConfigured": true,
  "walletConfigured": true,
  "treasuryWalletConfigured": true,
  "treasuryWallet": "BASE58_TREASURY",
  "treasurySponsoredMintEnabled": true,
  "mintPolicy": {
    "authorizationVersion": "CLAWD_AGENT_MINT_V2",
    "authorizationMaxAgeMs": 300000,
    "authorizationMaxFutureSkewMs": 30000,
    "signature": "canonical-base64-ed25519-64-bytes",
    "replayProtection": "durable-single-use-required",
    "gate": { "token": "CLAWD", "minimumBalance": 1000000 },
    "funding": { "mode": "treasury-sponsored", "treasuryWallet": "BASE58_TREASURY", "userPaysFees": false },
    "assetAuthority": {
      "owner": "requesting-wallet",
      "updateAuthority": "treasury-wallet",
      "permanentFreezeDelegateAuthority": "none",
      "initiallyFrozen": true
    },
    "identityRegistration": { "timing": "attempted-after-core-mint", "partialSuccessStatus": 202 },
    "finality": { "sendAndConfirmCommitment": "confirmed", "hardFinalityRequiredForHighValueReliance": true },
    "fungibleAgentTokenLaunch": "production-paused"
  },
  "metadataStorageConfigured": true,
  "metadataStorage": {},
  "avatarGenerationConfigured": true,
  "rpcProxyConfigured": true,
  "freeOpenRouterConfigured": true,
  "rpcFallbacksConfigured": 2,
  "currentSlot": 123,
  "network": "mainnet-beta"
}
```

Optional features may be false. Require `success`, RPC, treasury wallet, and sponsored minting to be true. Require `treasuryWallet` to be a valid public key and to equal `mintPolicy.funding.treasuryWallet`; require the displayed payer and update authority to equal that key. Require the remaining policy values to match the action being presented. Use only the returned `network`; do not infer a cluster from an explorer link. Stop before signature if the exact treasury wallet or complete authority policy is missing. A failed health response deliberately returns `treasuryWallet: null` and is not authorization to proceed.

Call `GET /api/metaplex-agents/gate/{ownerAddress}` before signature. Expect `{ "success": true, "gate": { "mint", "balance", "minimumBalance", "eligible", "source": "helius-das" } }`. At the `2026-07-19` policy snapshot, the official CLAWD mint is `8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump` and `minimumBalance` is `1000000`; always use the live response because policy can change. Stop when `eligible` is false or the gate is unavailable.

## Robinhood registration

Call `POST /api/robinhood/agents/prepare-registration` with:

```json
{
  "chainId": 46630,
  "name": "Research Agent",
  "description": "Publishes verifiable research.",
  "image": "ipfs://bafy...",
  "services": [{
    "name": "MCP",
    "endpoint": "https://example.com/mcp",
    "version": "1",
    "skills": ["research"],
    "domains": ["example.com"]
  }],
  "supportedTrust": ["reputation", "validation"],
  "x402Support": false,
  "active": true,
  "agentURI": "ipfs://optional-prebuilt-registration-document"
}
```

`chainId` must be `4663` or `46630`. `name`, `description`, and `image` are required. Images accept `https://`, `ipfs://`, or `data:image/`. Services are limited to 20. If `agentURI` is omitted, the server returns a `data:application/json;base64,...` registration document.

Expect:

```json
{
  "success": true,
  "intent": {
    "chainId": 46630,
    "to": "0x...identity-registry",
    "data": "0x...",
    "value": "0x0",
    "agentURI": "ipfs://...",
    "registration": {}
  },
  "runtimeVerification": {
    "chainId": 46630,
    "checkedAt": "...",
    "trusted": true,
    "contracts": {}
  },
  "requiresWalletConfirmation": true,
  "warning": null
}
```

Require `runtimeVerification.trusted === true` and require every role's check to pass. A failed runtime check returns HTTP `503` with `{ "success": false, "error", "runtimeVerification" }`. Require `value === "0x0"`; require `chainId` and `to` to match the fresh configuration; and decode `data` as exactly `register(string agentURI)` with the returned URI. Simulate from the intended owner, then ask that wallet to broadcast. Mainnet returns a warning but the client must still obtain explicit mainnet confirmation.

After a successful receipt, filter logs to the trusted identity registry and require `Registered(uint256 agentId,string agentURI,address owner)`. Require the event owner and URI to match the review. Then call `GET /api/robinhood/agents/{agentId}?chainId={chainId}` and expect:

```json
{
  "success": true,
  "chainId": 46630,
  "registry": "0x...",
  "agentRegistry": "eip155:46630:0x...",
  "agentId": "1",
  "owner": "0x...",
  "agentWallet": "0x...",
  "agentURI": "ipfs://...",
  "explorerUrl": "https://..."
}
```

Require registry, owner, initial agent wallet, and URI to match. `GET /api/robinhood/agents?owner=0x...` discovers mainnet identity NFT instances through Blockscout, but direct registry reads remain canonical.

## Solana sponsored identity mint

The browser must normalize the complete mint intent before asking the owner wallet to sign. The canonical object property order is:

```json
{
  "owner": "BASE58_OWNER",
  "name": "Normalized name",
  "symbol": "AGENT",
  "description": "Description",
  "agentType": "general",
  "personality": "neutral",
  "capabilities": ["research"],
  "imageUri": "ipfs://...",
  "registrationUri": "ipfs://..."
}
```

Normalize as follows:

- Trim owner.
- Trim name, collapse whitespace, and truncate to 64 characters.
- Uppercase symbol, remove non-`A-Z0-9`, truncate to 10 characters, and default to `AGENT`.
- Default description to `{agentType} AI agent on Solana`, trim, and truncate to 600 characters.
- Default `agentType` to `general` and `personality` to `neutral`; trim each to 48 characters.
- Accept an array or comma-separated capabilities, trim and remove empty items, and keep at most 12.
- Accept image URI schemes `https://`, `ipfs://`, `ar://`, or `data:image/`; otherwise normalize to an empty string. Truncate to 2048 characters.
- Resolve registration URI from `customRegistrationUri`, then `agentRegistrationUri`, then `registrationDoc`. Preserve `https://` or `data:` documents; otherwise encode the document as a UTF-8 base64 `data:text/plain` URI.

Serialize that object with `JSON.stringify` in the property order shown and compute lowercase SHA-256 hex over its UTF-8 bytes. Construct this exact UTF-8 message with no trailing newline:

```text
CLAWD_AGENT_MINT_V2
owner:<base58 owner>
name:<encodeURIComponent(normalized name)>
timestamp:<positive integer milliseconds since Unix epoch>
intent-sha256:<64 lowercase hex characters>
```

Sign the exact message bytes with the owner's Ed25519 wallet. Encode the detached 64-byte signature as canonical base64: it must decode to 64 bytes and re-encode to the identical string. The server accepts timestamps no older than 5 minutes and no more than 30 seconds in the future. Create and sign immediately before submission. A used signature is replay-blocked; never cache, edit, or reuse it.

Call `POST /api/metaplex-agents/mint` with the same normalized source fields plus `ownerPubkey`, `walletMessage`, and `walletSignature`:

```json
{
  "ownerPubkey": "BASE58_OWNER",
  "name": "Normalized name",
  "symbol": "AGENT",
  "description": "Description",
  "agentType": "general",
  "personality": "neutral",
  "capabilities": ["research"],
  "imageUri": "ipfs://...",
  "customRegistrationUri": "ipfs://...",
  "walletMessage": "CLAWD_AGENT_MINT_V2\n...",
  "walletSignature": "CANONICAL_BASE64"
}
```

The route submits immediately after policy checks; there is no second wallet prompt. A complete result is HTTP `201`. A Core mint with failed Agent Identity registration is HTTP `202` with `partial: true`:

```json
{
  "success": true,
  "registered": true,
  "partial": false,
  "gasless": true,
  "soulbound": true,
  "platformOwned": false,
  "assetAddress": "...",
  "owner": "...",
  "payer": "...treasury...",
  "updateAuthority": "...treasury...",
  "funding": { "mode": "treasury-sponsored", "userPaysFees": false },
  "assetSignerPda": "...",
  "signature": "...",
  "mintSignature": "...",
  "registerSignature": "...",
  "registrationError": null,
  "nftUri": "...",
  "registrationUri": "..."
}
```

Surface `owner`, `payer`, `updateAuthority`, gate/funding policy, both signatures, `registered`, `partial`, and `registrationError`. Never call this an unsigned client transaction.

The service submits mint and registration with Solana commitment `confirmed`; do not relabel that as `finalized`. After the response, call `GET /api/metaplex-agents/fetch/{assetAddress}` and require the returned asset owner, update authority, permanent-freeze state, and `isRegisteredAgent`. If the result will support a high-value or irreversible action, independently wait for Solana `finalized` commitment as required by `mintPolicy.finality.hardFinalityRequiredForHighValueReliance`. If `registered` is false, preserve the successful mint and report partial success; do not offer operator-only `/register`, `/delegate`, or `/set-token` routes as user recovery.

## Production-paused fungible launch

`POST /api/metaplex-agents/launch-token` is hard-disabled in production and returns `503`. Do not invoke or advertise it. The EVM registration API likewise has no ERC-20 launch operation. Identity registration and fungible token launch are distinct capabilities.
