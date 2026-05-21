"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { motion, AnimatePresence } from "framer-motion";
import { questionsData, defaultOptions } from "@/data/questions";

export default function Questionario() {
  const router = useRouter();
  const totalSteps = questionsData.length;
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / totalSteps) * 100;
  
  const { answers, saveAnswer, saveResultToCloud } = useAssessmentStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setSelectedOption(answers[currentStep] ?? null);
  }, [answers, currentStep]);

  const currentQuestion = questionsData[currentStep - 1];

  if (!isMounted) {
    return <div className="min-h-screen bg-brand-light flex flex-col font-sans overflow-hidden"></div>;
  }

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    saveAnswer(currentStep, index);
    
    setTimeout(async () => {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        setSelectedOption(answers[currentStep + 1] ?? null);
      } else {
        // Chegou ao fim, vamos para os resultados
        await saveResultToCloud();
        router.push("/resultado");
      }
    }, 450); // delay suave para feedback
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setSelectedOption(answers[currentStep - 1] ?? null);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="pt-12 pb-4 px-6 flex items-center justify-between bg-brand-white rounded-b-3xl shadow-sm z-10">
        <button 
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-brand-light text-brand-graphite transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="text-sm font-semibold text-brand-graphite/70">
          Questão {currentStep} de {totalSteps}
        </span>
        <div className="w-10"></div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-brand-light">
        <div 
          className="h-full bg-brand-teal transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <main className="flex-1 px-6 pt-10 pb-8 flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1"
          >
            <h2 className="text-2xl font-bold text-brand-graphite leading-relaxed mb-10 text-center">
              {currentQuestion.pergunta}
            </h2>

            <div className="flex flex-col gap-4 mt-auto">
              {defaultOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full p-5 rounded-2xl text-left font-medium border-2 transition-all active:scale-[0.98] ${
                    selectedOption === i 
                      ? 'border-brand-teal bg-brand-teal/5 text-brand-teal shadow-md' 
                      : 'border-brand-white bg-brand-white text-brand-graphite shadow-sm'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
