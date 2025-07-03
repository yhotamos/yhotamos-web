"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function TopArrowIcon() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white dark:bg-black fixed right-10 bottom-10 rounded-full">
      <button
        id="top-arrow"
        type="button"
        className="rounded-full p-1.5
        *:size-7 bg-gray-950/5 text-gray-950 hover:bg-gray-950/15 ring-2 inset-ring  ring-gray-950/10 inset-ring-white/10
        dark:bg-white/10 dark:text-white "
        aria-label="トップへ戻る"
        onClick={scrollToTop}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  );
}
