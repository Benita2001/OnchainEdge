"use client";

import { useRouter } from "next/navigation";

import { CAInput } from "@/components/CAInput";

export function CAInputWrapper() {
  const router = useRouter();

  return (
    <CAInput
      loading={false}
      onAnalyze={(ca) => router.push(`/analyze/${ca}`)}
    />
  );
}
