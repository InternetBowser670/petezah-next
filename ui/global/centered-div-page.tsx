import MarqueeBg from "@/ui/backgrounds/marquee-bg";

export default function CenteredDivPage({
  children,
  className,
  outerClassname
}: {
  children?: React.ReactNode;
  className?: string;
  outerClassname?: string;
}) {
  return (
    <>
      <div className={`flex items-center relative justify-center h-[100%] ${outerClassname}`}>
        <MarqueeBg />
        <main className={`max-w-[80%] rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37] ${className}`}>
          {children}
        </main>
      </div>
    </>
  );
}
