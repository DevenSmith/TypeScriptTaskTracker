import assert from "node:assert/strict";
import { test } from "node:test";

import {
  isPriority,
  isTask,
  parseTaskId,
} from "./validation.js";

test("recognizes valid priorities", () => {
  assert.equal(isPriority("low"), true);
  assert.equal(isPriority("medium"), true);
  assert.equal(isPriority("high"), true);
});

test("parses positive integer task IDs", () => {
  assert.equal(parseTaskId("5"), 5);
  assert.equal(parseTaskId("abc"), undefined);
  assert.equal(parseTaskId("-1"), undefined);
});

test("recognizes a valid task", () => {
  const task = {
    id: 1,
    title: "Learn automated testing",
    completed: false,
    priority: "high",
  };

  assert.equal(isTask(task), true);
});