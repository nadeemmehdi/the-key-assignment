import { describe, expect, it } from "vitest";
import { decideSaveAction } from "./save-policy";

describe("decideSaveAction", () => {
  it("creates a record when saving a post for the first time", () => {
    expect(decideSaveAction("saved", { exists: false, isActive: false })).toEqual({
      kind: "create"
    });
  });

  it("reactivates a soft-deleted record when saving again", () => {
    expect(decideSaveAction("saved", { exists: true, isActive: false })).toEqual({
      kind: "reactivate"
    });
  });

  it("does nothing when saving an already-saved post", () => {
    expect(decideSaveAction("saved", { exists: true, isActive: true })).toEqual({
      kind: "noop"
    });
  });

  it("soft-deletes an active save when unsaving", () => {
    expect(decideSaveAction("unsaved", { exists: true, isActive: true })).toEqual({
      kind: "soft-delete"
    });
  });
});

