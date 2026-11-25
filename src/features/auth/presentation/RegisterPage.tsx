import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  isApiError,
  type RegisterUserDto,
  type UserDto,
} from '../../../domain/ports';
import { calculatePasswordStrength } from '../application/passwordStrength';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import './RegisterPage.css';

export interface RegisterPageProps {
  readonly register: (data: RegisterUserDto) => Promise<UserDto>;
}

type RegisterField =
  | 'name'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'acceptTerms';

type RegisterErrors = Partial<Record<RegisterField, string>>;

interface RegisterFormValues {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly acceptTerms: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const DEFAULT_REDIRECT = '/dashboard';

const ERROR_IDS: Record<RegisterField, string> = {
  name: 'register-name-error',
  email: 'register-email-error',
  password: 'register-password-error',
  confirmPassword: 'register-confirm-password-error',
  acceptTerms: 'register-terms-error',
};

function validateRegisterForm(values: RegisterFormValues): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!values.name.trim()) {
    errors.name = 'El nombre completo es obligatorio.';
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Introduce un correo electrónico válido.';
  }

  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  if (!values.acceptTerms) {
    errors.acceptTerms =
      'Debes aceptar los términos y condiciones para continuar.';
  }

  return errors;
}

function resolveRedirect(value: string | null): string {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.startsWith('/\\')
  ) {
    return DEFAULT_REDIRECT;
  }

  return value;
}

export function RegisterPage({ register }: RegisterPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateRegisterForm({
      name,
      email,
      password,
      confirmPassword,
      acceptTerms,
    });

    setErrors(nextErrors);
    setFormError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        acceptTerms,
      });

      navigate(resolveRedirect(searchParams.get('redirect')), {
        replace: true,
      });
    } catch (error) {
      if (isApiError(error) && error.status === 409) {
        setFormError('Ya existe una cuenta con este correo electrónico.');
      } else if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('No se pudo crear la cuenta. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-page__card" aria-labelledby="register-title">
        <h1 id="register-title" className="register-page__title">
          Crear cuenta
        </h1>
        <p className="register-page__intro">
          Crea tu cuenta para gestionar tus sitios web en ShopMaker.
        </p>

        <form
          className="register-page__form"
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
          noValidate
        >
          <div className="register-page__field">
            <label className="register-page__label" htmlFor="register-name">
              Nombre completo
            </label>
            <input
              id="register-name"
              className="register-page__input"
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              aria-required="true"
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? ERROR_IDS.name : undefined}
            />
            {errors.name && (
              <p id={ERROR_IDS.name} className="register-page__error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="register-page__field">
            <label className="register-page__label" htmlFor="register-email">
              Correo electrónico
            </label>
            <input
              id="register-email"
              className="register-page__input"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              aria-required="true"
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? ERROR_IDS.email : undefined}
            />
            {errors.email && (
              <p id={ERROR_IDS.email} className="register-page__error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="register-page__field">
            <label
              className="register-page__label"
              htmlFor="register-password"
            >
              Contraseña
            </label>
            <input
              id="register-password"
              className="register-page__input"
              type="password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              aria-required="true"
              aria-invalid={errors.password ? 'true' : undefined}
              aria-describedby={
                errors.password ? ERROR_IDS.password : undefined
              }
            />
            <PasswordStrengthMeter strength={strength} />
            {errors.password && (
              <p id={ERROR_IDS.password} className="register-page__error">
                {errors.password}
              </p>
            )}
          </div>

          <div className="register-page__field">
            <label
              className="register-page__label"
              htmlFor="register-confirm-password"
            >
              Confirmar contraseña
            </label>
            <input
              id="register-confirm-password"
              className="register-page__input"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              aria-required="true"
              aria-invalid={errors.confirmPassword ? 'true' : undefined}
              aria-describedby={
                errors.confirmPassword
                  ? ERROR_IDS.confirmPassword
                  : undefined
              }
            />
            {errors.confirmPassword && (
              <p
                id={ERROR_IDS.confirmPassword}
                className="register-page__error"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="register-page__terms">
            <input
              id="register-terms"
              className="register-page__checkbox"
              type="checkbox"
              name="acceptTerms"
              checked={acceptTerms}
              onChange={(event) => setAcceptTerms(event.target.checked)}
              required
              aria-required="true"
              aria-invalid={errors.acceptTerms ? 'true' : undefined}
              aria-describedby={
                errors.acceptTerms ? ERROR_IDS.acceptTerms : undefined
              }
            />
            <label className="register-page__terms-label" htmlFor="register-terms">
              Acepto los términos y condiciones
            </label>
          </div>
          {errors.acceptTerms && (
            <p id={ERROR_IDS.acceptTerms} className="register-page__error">
              {errors.acceptTerms}
            </p>
          )}

          {formError && (
            <p className="register-page__alert" role="alert">
              {formError}
            </p>
          )}

          <button
            className="register-page__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>

          <p className="register-page__alt">
            ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
