import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

type AssessmentState = {
  answers: Record<number, number>; // questionIndex -> optionIndex
  saveAnswer: (questionIndex: number, value: number) => void;
  setAnswers: (answers: Record<number, number>) => void;
  saveResultToCloud: () => Promise<void>;
  resetAssessment: () => void;
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      answers: {},
      saveAnswer: (questionIndex: number, value: number) =>
        set((state) => ({
          answers: { ...state.answers, [questionIndex]: value },
        })),
      setAnswers: (answers: Record<number, number>) => set({ answers }),
      saveResultToCloud: async () => {
        const { answers } = get();
        if (Object.keys(answers).length === 60) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            try {
              await supabase.from('history').insert([
                {
                  user_id: session.user.id,
                  answers: answers,
                  date: new Date().toISOString()
                }
              ]);
            } catch (e) {
              console.error("Erro ao salvar histórico", e);
            }
          }
        }
      },
      resetAssessment: () => set({ answers: {} }),
    }),
    {
      name: 'neurosync-assessment-storage',
    }
  )
);
