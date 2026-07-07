"use client";

import { messages, type Locale } from "@/shared/i18n/messages";

type SaveToggleButtonProps = {
  hasSaved: boolean;
  onToggle: () => void;
  isPending: boolean;
  locale: Locale;
};

export const SaveToggleButton = ({
  hasSaved,
  onToggle,
  isPending,
  locale
}: SaveToggleButtonProps) => {
  const copy = messages[locale];

  return (
    <button
      className={hasSaved ? "button-secondary button-loading button-inline" : "button button-loading button-inline"}
      disabled={isPending}
      onClick={onToggle}
    >
      {hasSaved ? copy.unsave : copy.save}
    </button>
  );
};
