#!/usr/bin/env node
"use strict";

// Entry point: defers to src/cli for parsing and flow control
try {
  const { run } = require("../src/cli");
  run();
} catch (err) {
  console.error("Ubiforge failed to start:", err?.message || err);
  process.exit(1);
}

