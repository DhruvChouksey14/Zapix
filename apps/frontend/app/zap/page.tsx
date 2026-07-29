"use client";
import MainSection from "../../components/MainSection";
import ZapBuilder from "../../components/ZapBuilder";
import { useSearchParams } from "next/navigation";

export default function ZapPage() {
  const searchParams = useSearchParams();
  const zapId = searchParams.get("zapId");

  return (
    <MainSection>
      <div className="min-h-[92vh] relative w-full flex flex-col">
        <ZapBuilder zapId={zapId ?? ""} />
      </div>
    </MainSection>
  );
}