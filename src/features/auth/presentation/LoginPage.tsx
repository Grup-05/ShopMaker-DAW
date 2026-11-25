import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  isApiError,
  type LoginCredentialsDto,
  type UserDto,
} from '../../../domain/ports';
import { resolveSafeRedirect } from '../application/safeRedirect';
import './LoginPage.css';

export interface LoginPageProps {
  readonly login: (credentials: LoginCredentialsDto) => Promise<UserDto>;
}

type LoginField = 'email' | 'password';

type LoginErrors = Partial<Record<LoginField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ERROR_IDS: Record<LoginField, string> = {
  email: 'login-email-error',
  password: 'login-password-error',
};

function validateLoginForm(
  email: string,
  password: string,
): LoginErrors {
  const errors: LoginErrors = {};

  if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Introduce un correo electrónico válido.';
  }

  if (!password) {
    errors.password = 'Introduce tu contraseña.';
  }

  return errors;
}

export function LoginPage({ login }: LoginPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateLoginForm(email, password);

    setErrors(nextErrors);
    setFormError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
        rememberMe,
      });

      navigate(resolveSafeRedirect(searchParams.get('redirect')), {
        replace: true,
      });
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        setFormError(
          'Las credenciales no son correctas. Revisa tu correo y contraseña.',
        );
      } else if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('No se pudo iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-page__card" aria-labelledby="login-title">
        <h1 id="login-title" className="login-page__title">
          Iniciar sesión
        </h1>
        <p className="login-page__intro">
          Accede a tu panel para gestionar tus sitios web.
        </p>

        <form
          className="login-page__form"
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
          noValidate
        >
          <div className="login-page__field">
            <label className="login-page__label" htmlFor="login-email">
              Correo electrónico
            </label>
            <input
              id="login-email"
              className="login-page__input"
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              aria-required="true"
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? ERROR_IDS.email : undefined}
            />
            {errors.email && (
              <p id={ERROR_IDS.email} className="login-page__error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="login-page__field">
            <label className="login-page__label" htmlFor="login-password">
              Contraseña
            </label>
            <input
              id="login-password"
              className="login-page__input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              aria-required="true"
              aria-invalid={errors.password ? 'true' : undefined}
              aria-describedby={
                errors.password ? ERROR_IDS.password : undefined
              }
            />
            {errors.password && (
              <p id={ERROR_IDS.password} className="login-page__error">
                {errors.password}
              </p>
            )}
          </div>

          <div className="login-page__options">
            <label className="login-page__remember" htmlFor="login-remember">
              <input
                id="login-remember"
                className="login-page__checkbox"
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Recordarme
            </label>
            <Link className="login-page__recover" to="/recover">
              Recuperar contraseña
            </Link>
          </div>

          {formError && (
            <p className="login-page__alert" role="alert">
              {formError}
            </p>
          )}

          <button
            className="login-page__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </button>

          <p className="login-page__alt">
            ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
