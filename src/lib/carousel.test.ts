import assert from "node:assert/strict";
import test from "node:test";
import { shouldLoadCarouselImage } from "./carousel";

test("loads only the active slide and its neighbors", () => {
  assert.deepEqual(
    Array.from({ length: 8 }, (_, index) => shouldLoadCarouselImage(index, 3, 8)),
    [false, false, true, true, true, false, false, false],
  );
});

test("wraps neighbors around the first and last slides", () => {
  assert.deepEqual(
    Array.from({ length: 5 }, (_, index) => shouldLoadCarouselImage(index, 0, 5)),
    [true, true, false, false, true],
  );
  assert.deepEqual(
    Array.from({ length: 5 }, (_, index) => shouldLoadCarouselImage(index, 4, 5)),
    [true, false, false, true, true],
  );
});

test("handles a single slide and an empty carousel", () => {
  assert.equal(shouldLoadCarouselImage(0, 0, 1), true);
  assert.equal(shouldLoadCarouselImage(0, 0, 0), false);
});
