# Local setup checklist (robinhood-agents)

Package: **cheshire-terminal-agents** `1.48.0`  
Root: monorepo path `robinhood-agents/`

## Prerequisites

- Node.js **≥ 18.18** (verified on Node 24)
- Optional: [Foundry](https://getfoundry.sh) `forge` for Solidity tests / deploy
- Optional: Rust + cargo for `programs/zk_omni` tests

## One-shot install

```bash
cd robinhood-agents
npm install          # root deps + postinstall nested TS packages
cp -n .env.example .env   # placeholders only — never commit real keys
```

Skip nested installs: `CHESHIRE_SKIP_PACKAGE_INSTALL=1 npm install`

## Verify

```bash
npm run check        # syntax + node tests (SDK, catalog, zk-omni, deploy safety)
npm test             # node --test test/*.test.js deploy/test/*.test.cjs
forge test -vv       # ERC-8004 registries + zk-omni messenger (if forge installed)
npm run agents:list
npm run packages:list
node src/cli.js --help
```

Expected (current tree):

| Gate | Result |
|------|--------|
| `npm run check` | **81** Node tests pass |
| `forge test` | **12** Solidity tests pass |
| Catalog | **53** agents schema-valid |
| Locales | **43** agents / **757** locale files |
| Nested TS packages | `headless-agent`, `clawd-agent-tui` (npm install via postinstall) |
| Nested source packages | `layerzero-omnichain` (Foundry), `solana-agent-trust` (Anchor) — no `node_modules` required |

## Nested packages

| Package | Kind | Install |
|---------|------|---------|
| `packages/headless-agent` | TypeScript | `npm run packages:install` |
| `packages/clawd-agent-tui` | TypeScript | `npm run packages:install` |
| `packages/layerzero-omnichain` | Foundry stubs | structure only |
| `packages/solana-agent-trust` | Anchor | structure only |

```bash
npx cheshire-headless --help
npx clawd-agent-tui --oneshot help
```

## Env (deploy / relayer only)

Copy from `.env.example`. Required for **broadcast** deploys (not for dry-run reads/tests):

- `PRIVATE_KEY` — throwaway gas-only deployer
- `EXPECTED_CHAIN_ID` — `46630` testnet or `4663` mainnet
- `RH_RPC_URL` — never use public mainnet RPC for broadcast
- `DEPLOYMENT_CONFIRMATION` — exact string for the target chain

ZK omni optional vars: `ZK_OMNI_*`, `LAYERZERO_ENDPOINT_ROBINHOOD`.

## Deploy safety

- Dry-run by default; broadcasts need chain-specific confirmation
- Canonical manifests in `deployments/` block re-broadcast of existing suites
- See `deploy/scripts/deploy-agent-registries.sh` and README “Identity forge”

## Optional companion

Zero Clawd runtime is **not** a hard dependency:

```bash
npx cheshire-terminal-agents clawdbot-info
# npm i -g clawdbot-go
```
