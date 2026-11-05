# EVE Local Runtime

This package adds a local Ollama-backed EVE console for Windows/ROG Ally X.

## Requirements
- Windows PowerShell 5.1 or PowerShell 7
- Node.js 22 or newer
- Ollama for Windows with at least one model downloaded

## Start
From the repository root, run:

    powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-eve-local.ps1

The launcher checks Node, locates Ollama, starts its local server if needed, inventories installed models, and launches EVE. It does not install software, download models, or request credentials.

Alternatively:

    node .\runtime\eve-local.mjs --status
    node .\runtime\eve-local.mjs

Set EVE_OLLAMA_MODEL to choose a model explicitly. Set EVE_LOG_PATH to change the JSONL audit-log path.

## Safety boundary
The initial runtime is local inference and conversation only. It deliberately does not execute shell commands, arbitrary code, filesystem mutations, or external actions. The existing Cloudflare command queue is a separate authenticated system; this package does not claim to consume that queue or report a live cloud-worker connection.

## Logs
Local runtime events are appended to data/eve-local.jsonl. Keep this file private; conversation content is recorded there.
