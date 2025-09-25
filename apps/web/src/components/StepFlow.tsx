"use client";
import { useEffect, useState } from "react";
import { useInteraction } from "../context/InteractionContext";
import { useTranslations } from "next-intl";

export function StepFlow({
  children,
}: {
  children: (step: number) => React.ReactNode;
}) {
  const { step, speak } = useInteraction();
  const [entered, setEntered] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setEntered(false);
    const id = setTimeout(() => setEntered(true), 180);
    return () => clearTimeout(id);
  }, [step]);

  useEffect(() => {
    speak(t("voice.step", { step }));
  }, [step, speak, t]);

  return (
    <div className="motion-fade" data-enter={entered}>
      {children(step)}
    </div>
  );
}
