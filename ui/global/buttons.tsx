import { clsx } from "clsx";
import { MouseEventHandler } from "react";

export interface ButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>,
    text?: string,
    className?: string
}

export interface ChildrenButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    children?: React.ReactNode,
    className?: string
}

export function PrimaryButton({ onClick, Icon, text, className }: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx("px-3! py-2! bg-black border-2 border-white rounded-2xl duration-300 hover:bg-gray-900 flex items-center justify-center gap-2", className)} 
      onClick={onClick}
    >
      {Icon && <Icon width={24} />} {text}
    </button>
  );
}

export function PrimaryButtonChildren({ children, onClick, className }: ChildrenButtonProps) {
  return (
    <button className={clsx("px-3! py-2! bg-black border-2 border-white rounded-2xl duration-300 hover:bg-gray-900 flex items-center justify-center gap-2 ", className)} onClick={onClick}>
      {children}
    </button>
  );
}

export function SecondaryButton({ onClick, Icon, text, className }: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx("px-3! py-2! bg-[#134080] border-2 border-white rounded-2xl duration-300 hover:bg-[#113a73] flex items-center justify-center gap-2", className)} 
      onClick={onClick}
    >
      {Icon && <Icon width={24} />} {text}
    </button>
  );
}

export function SecondaryButtonChildren({ children, onClick, className }: ChildrenButtonProps) {
  return (
    <button className={clsx("px-3! py-2! bg-[#134080] border-2 border-white rounded-2xl duration-300 hover:bg-[#113a73] flex items-center justify-center gap-2 ", className)} onClick={onClick}>
      {children}
    </button>
  );
}