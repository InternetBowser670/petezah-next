import { MouseEventHandler } from "react";

export interface ButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>,
    text?: string
}

export function PrimaryButton({ onClick, Icon, text }: ButtonProps) {
  return (
    <button
      type="button"
      className="px-3! py-2! bg-black border-2 border-white rounded-2xl duration-300 hover:bg-gray-900 flex items-center justify-center gap-2"
      onClick={onClick}
    >
      {Icon && <Icon width={24} />} {text}
    </button>
  );
}
