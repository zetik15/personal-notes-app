import { FormField } from "../FormField";
import { Button } from "../Button";
import "./RegisterForm.css";
import { FormEventHandler, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../api/User";
import { queryClient } from "../../api/QueryClient";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({})

  const registerMutation = useMutation({
    mutationFn: () => registerUser(username, email, password),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error
      ? error.message
      : 'Неизвестная ошибка';

      setErrors(prev => ({
        ...prev,
        server: errorMessage
      }));
      setPassword('')
    },
  }, queryClient);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = 'Email обязателен';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Неверный формат email';

    if (!username) newErrors.username = 'Имя пользователя обязательно';
    else if (username.length < 5) newErrors.username = 'Минимум 5 символов';

    if (!password) newErrors.password = 'Пароль обязателен';
    else if (password.length < 8) newErrors.password = 'Минимум 8 символов';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (validateForm()) {
      registerMutation.mutate();
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <FormField 
        label="Имя"
        errorMessage={errors.username}
      >
        <input
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </FormField>
      <FormField 
        label="Email"
        errorMessage={errors.email}
      >
        <input 
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormField>
      <FormField 
        label="Пароль"
        errorMessage={errors.password}
      >
        <input 
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </FormField>
      
      <Button type="submit" isLoading={registerMutation.isPending}>Зарегистрироваться</Button>
    </form>
  );
};
