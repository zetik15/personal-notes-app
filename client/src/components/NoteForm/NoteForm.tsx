import { FormField } from "../FormField";
import { Button } from "../Button";
import "./NoteForm.css";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from '@tanstack/react-query';
import { createNote } from "../../api/Note";
import { queryClient } from "../../api/QueryClient";

const createNoteSchema = z.object({
  title: z.string().min(5, 'Введите заголовок не менее 5 символов'),
  text: z.string()
    .min(10, 'Введите длину текста не менее 10 символов')
    .max(300, 'Введите длину текста не более 300 символов')
})

type createNoteForm = z.infer<typeof createNoteSchema>;

export const NoteForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<createNoteForm>({
    resolver: zodResolver(createNoteSchema)
  });

  const createNoteMutation = useMutation({
    mutationFn: ({ title, text }: { title: string; text: string }) =>
      createNote(title, text),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      reset();
    },
    onError: (error) => {
      console.error('Ошибка создания заметки:', error);
    }
  });

  return (
    <form 
      className="note-form" 
      onSubmit={handleSubmit((data) => {
        createNoteMutation.mutate(data);
      })}>
      <FormField 
        label="Заголовок" 
        errorMessage={errors.title?.message}
      >
        <input 
          type="text" 
          {...register('title')}
          className={errors.title ? 'error' : ''}
        />
      </FormField>
      <FormField 
        label="Текст" 
        errorMessage={errors.text?.message}
      >
        <textarea 
          {...register('text')}
          className={errors.text ? 'error' : ''}
        />
      </FormField>
      <Button isLoading={createNoteMutation.isPending}>Сохранить</Button>
    </form>
  );
};
