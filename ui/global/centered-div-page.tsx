import MarqueeBg from "@/ui/backgrounds/marquee-bg";

export default function CenteredDivPage({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center relative justify-center h-[100%]">
        <MarqueeBg />
        <main className="max-w-[80%] p-[50px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37]">
          {children}
        </main>
      </div>
    </>
  );
}
