export type SaveRecordState = {
  exists: boolean;
  isActive: boolean;
};

export type SaveDecision =
  | { kind: "noop" }
  | { kind: "create" }
  | { kind: "reactivate" }
  | { kind: "soft-delete" };

export const decideSaveAction = (
  requestedState: "saved" | "unsaved",
  current: SaveRecordState
): SaveDecision => {
  if (requestedState === "saved") {
    if (!current.exists) {
      return { kind: "create" };
    }

    if (!current.isActive) {
      return { kind: "reactivate" };
    }

    return { kind: "noop" };
  }

  if (!current.exists || !current.isActive) {
    return { kind: "noop" };
  }

  return { kind: "soft-delete" };
};

