import { createContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton, StopCountdownButton,
} from "./styles.ts";

interface Cycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date,
  interruptedDate?: Date,
  finishedDate?: Date,
}

interface CycleContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (second: number) => void;
}

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no minimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export const CyclesContext = createContext({} as CycleContextType);

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    setCycles(
      (state) => state.map(cycle => {
        if(cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date()}
        } else {
          return cycle;
        }
      }),
    );
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);
    reset();
  }

  function handleInterrupCycle() {

    setCycles(
      cycles.map(cycle => {
        if(cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date()}
        } else {
          return cycle;
        }
      }),
    );

    setActiveCycleId(null);
    document.title = `Timer`;
  }

  const task = watch('task');
  const isSubmitDisable = !task;

  return (
    <HomeContainer>
      <form onSubmit={ handleSubmit(handleCreateNewCycle) } action="">
        <CyclesContext.Provider value={{
          activeCycle,
          activeCycleId,
          amountSecondsPassed,
          markCurrentCycleAsFinished,
          setSecondsPassed,
        }}>
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>


        {
          activeCycle ? (
            <StopCountdownButton onClick={handleInterrupCycle} type="button">
              <HandPalm size={24}/>
              Interromper
            </StopCountdownButton>
          ) : (
            <StartCountdownButton disabled={isSubmitDisable} type="submit">
              <Play size={24}/>
              Começar
            </StartCountdownButton>
          )
        }

      </form>
    </HomeContainer>
  );
}