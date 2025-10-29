"use strict";

const prompts = require("prompts");

class PromptCancelledError extends Error {
  constructor(message = "Prompt cancelled") {
    super(message);
    this.name = "PromptCancelledError";
  }
}

async function ask(questions) {
  const answers = await prompts(questions, {
    onCancel: () => {
      throw new PromptCancelledError();
    },
  });
  return answers;
}

module.exports = { ask, PromptCancelledError };

