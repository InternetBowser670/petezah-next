import React, { useState } from "react";
import { SeeMoreProps } from "@/lib/types";

export default function TextWithSeeMore({
  text,
  maxLength,
  className,
}: SeeMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${className}`}>
      {text.length > maxLength ? (
        <>
          {isExpanded ? text : text.slice(0, maxLength) + "..."}
          <button className="underline pl-2!" onClick={toggleExpansion}>
            {isExpanded ? "See Less" : "See More"}
          </button>
        </>
      ) : isExpanded ? (
        text
      ) : (
        text.slice(0, maxLength)
      )}
    </div>
  );
}
