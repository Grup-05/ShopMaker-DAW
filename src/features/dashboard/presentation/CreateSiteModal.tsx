import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import type { CreateSiteDto, SiteDto } from '../../../domain/ports';
import { slugify } from '../../../shared/lib/slugify';
import './CreateSiteModal.css';

export interface CreateSiteModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (dto: CreateSiteDto) => Promise<SiteDto>;
}

const DEFAULT_SUBDOMAIN_SUFFIX = '.shopmaker.local';

export function CreateSiteModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateSiteModalProps) {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainTouched, setSubdomainTouched] = useState(false);
  const [category, setCategory] = useState('ecommerce');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Reiniciar estado y enfocar primer campo al abrir
  useEffect(() => {
    if (isOpen) {
      setName('');
      setSubdomain('');
      setSubdomainTouched(false);
      setCategory('ecommerce');
      setErrorMessage(null);
      setIsSubmitting(false);

      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Sugerencia automática de subdominio al escribir el nombre
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (errorMessage) {
      setErrorMessage(null);
    }
    if (!subdomainTouched) {
      const slug = slugify(newName);
      setSubdomain(slug ? `${slug}${DEFAULT_SUBDOMAIN_SUFFIX}` : '');
    }
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubdomainTouched(true);
    setSubdomain(e.target.value);
  };

  // Atrapado de foco y tecla Escape a nivel de ventana
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown);
    };
  }, [isOpen, onClose]);

  // Manejo de foco cíclico con Tab dentro del diálogo
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab' && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage('El nombre del sitio es obligatorio.');
      nameInputRef.current?.focus();
      return;
    }

    const finalSubdomain =
      subdomain.trim() || `${slugify(trimmedName)}${DEFAULT_SUBDOMAIN_SUFFIX}`;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmit({
        name: trimmedName,
        subdomain: finalSubdomain,
        category,
      });
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al crear el sitio web';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="create-site-modal__backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-site-modal-title"
        className="create-site-modal__dialog"
        onKeyDown={handleKeyDown}
      >
        <div className="create-site-modal__header">
          <h2 id="create-site-modal-title" className="create-site-modal__title">
            Crear Nueva Web
          </h2>
          <button
            type="button"
            className="create-site-modal__close-btn"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form className="create-site-modal__form" onSubmit={handleSubmit}>
          <div className="create-site-modal__field">
            <label
              htmlFor="create-site-name"
              className="create-site-modal__label"
            >
              Nombre de la web:
            </label>
            <input
              ref={nameInputRef}
              id="create-site-name"
              type="text"
              className="create-site-modal__input"
              value={name}
              onChange={handleNameChange}
              placeholder="Ej. Tienda Artesanal"
              aria-required="true"
              aria-invalid={errorMessage ? 'true' : undefined}
            />
          </div>

          <div className="create-site-modal__field">
            <label
              htmlFor="create-site-subdomain"
              className="create-site-modal__label"
            >
              Subdominio simulado:
            </label>
            <input
              id="create-site-subdomain"
              type="text"
              className="create-site-modal__input"
              value={subdomain}
              onChange={handleSubdomainChange}
              placeholder="ej-tienda.shopmaker.local"
            />
          </div>

          <div className="create-site-modal__field">
            <label
              htmlFor="create-site-category"
              className="create-site-modal__label"
            >
              Categoría del proyecto:
            </label>
            <select
              id="create-site-category"
              className="create-site-modal__select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="ecommerce">Tienda Online / Comercio</option>
              <option value="content">Blog / Revista digital</option>
              <option value="portfolio">Portafolio profesional</option>
              <option value="marketing">Servicios y Empresa</option>
            </select>
          </div>

          {errorMessage && (
            <p className="create-site-modal__error-msg" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="create-site-modal__actions">
            <button
              type="button"
              className="create-site-modal__cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="create-site-modal__submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear sitio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
