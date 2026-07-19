# Deployment and network safety

Robinhood Chain mainnet is `4663`; testnet is `46630`. Its identity, reputation, and validation contracts are per-chain singletons. Use the guarded deployment package under `packages/robinhood-deploy`, simulate before `--broadcast`, independently audit before mainnet, verify source on Blockscout, and publish exact addresses.

Solana devnet and mainnet-beta are separate clusters. Metaplex Core and Agent Registry program IDs must come from the installed official SDK/configuration for the selected cluster. Do not deploy replacement programs merely to mint an agent. Confirm the asset owner, update authority, delegates, registration PDA, and transaction signature after creation.

Cross-chain linking is metadata-level composition. Verify control of both identities before publishing reciprocal links. Never label the pair as a bridged or canonical token unless a separately audited protocol establishes that relationship.
