"use strict";

function coerceCommaList(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return String(val)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

module.exports = { coerceCommaList };

