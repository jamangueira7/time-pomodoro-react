import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { HandPalm, Play } from "phosphor-react";
import { CyclesContext } from "../../contexts/CyclesContext.tsx";
import {
  HomeContainer,
  StartCountdownButton, StopCountdownButton,
} from "./styles.ts";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no minimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
});

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });


  type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

  const { handleSubmit, watch, reset } = newCycleForm;

  const task = watch('task');
  const isSubmitDisable = !task;
  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={ handleSubmit(handleCreateNewCycle) } action="">
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        {
          activeCycle ? (
            <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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