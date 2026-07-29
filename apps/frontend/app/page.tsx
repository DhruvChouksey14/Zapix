import MainSection from "../components/MainSection";

export default function Home() {
  return (
    <MainSection>
      <div className="flex lg:flex-row flex-col lg:gap-10 gap-8 mt-20 lg:px-48 px-10">
        <div className="basis-2/3 flex flex-col gap-5 justify-center">
          <h1 className="md:text-7xl text-4xl font-bold">
            Automate the busywork, <span className="text-[#ff4f00]">not your day.</span>
          </h1>
          <p className="text-xl font-medium text-gray-700">
            Connect the tools you already use and let Zapix handle the repetitive stuff.
            No code, no waiting on IT, no excuses.
          </p>
        </div>
        <div className="basis-1/3 flex items-center justify-center">
          <div className="w-full aspect-square bg-[#ff4f00]/5 border-2 border-dashed border-[#ff4f00] rounded-2xl flex items-center justify-center p-8">
            <span className="text-[#ff4f00] font-semibold text-center">
              Your workflow, visualized
            </span>
          </div>
        </div>
      </div>
    </MainSection>
  );
}