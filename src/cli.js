#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createAgentForge } from "./index.js";
const [command, ...args] = process.argv.slice(2);
const flag = (name, fallback) => { const i = args.indexOf(`--${name}`); return i < 0 ? fallback : args[i + 1]; };
const forge = createAgentForge({ baseUrl: flag("site", process.env.CHESHIRE_SITE_URL || "https://cheshireterminal.ai") });
try {
  if (command === "capabilities") console.log(JSON.stringify(await forge.capabilities(), null, 2));
  else if (command === "prepare") {
    const file = flag("file"); if (!file) throw new Error("prepare requires --file registration.json");
    const input = JSON.parse(await readFile(file, "utf8"));
    console.log(JSON.stringify(await forge.prepare({ ...input, platform: flag("platform", input.platform) }), null, 2));
  } else if (command === "inspect") console.log(JSON.stringify(await forge.inspect({ platform: flag("platform"), id: flag("id"), chainId: Number(flag("chain", "4663")) }), null, 2));
  else console.log("robinhood-agents <capabilities|prepare|inspect> --platform <robinhood|solana> [--file JSON] [--id ID] [--site URL]");
} catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
