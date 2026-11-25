import { Link } from 'react-router-dom';
import './RecoverPasswordPage.css';

/**
 * Página informativa de recuperación de contraseña.
 *
 * El envío real de correos queda fuera del alcance de PBI-005; esta vista
 * orienta al usuario y le permite volver al inicio de sesión.
 */
export function RecoverPasswordPage() {
  return (
    <main className="recover-page">
      <section className="recover-page__card" aria-labelledby="recover-title">
        <h1 id="recover-title" className="recover-page__title">
          Recuperar contraseña
        </h1>
        <p className="recover-page__intro">
          La recuperación automática de contraseña estará disponible
          próximamente.
        </p>
        <p className="recover-page__hint">
          Si necesitas ayuda inmediata, contacta con el equipo de soporte de
          ShopMaker.
        </p>
        <p className="recover-page__alt">
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}
