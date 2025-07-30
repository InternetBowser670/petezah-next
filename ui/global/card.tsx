import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`p-[20px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
