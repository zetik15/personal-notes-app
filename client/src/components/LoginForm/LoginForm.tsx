import "./LoginForm.css";
import { FormField } from "../FormField";
import { Button } from "../Button";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../api/User";
import { queryClient } from "../../api/QueryClient";
import { FormEventHandler, useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useMutation({
    mutationFn: () => loginUser(email, password),
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Неизвестная ошибка';

      setErrors({ server: errorMessage });
      setPassword('');
    },
    onSuccess: async () => {
      setErrors({});
      await queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      window.location.href = '/';
    },
  }, queryClient);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = 'Email обязателен'
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Неверный формат email';

    if (!password) newErrors.password = 'Пароль обязателен';
    else if (password.length < 8) newErrors.password = 'Минимум 8 символов';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setErrors({});
    if (validateForm()) {
      loginMutation.mutate();
    }
  }
  return (
    <form className="login-form" onSubmit={handleSubmit}>
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
          value={password}/>
      </FormField>
      <Button type="submit" isLoading={loginMutation.isPending}>Войти</Button>
      {errors.server && (
        <div className="error-message">
          {errors.server}
        </div>
      )}
    </form>
  );
};
