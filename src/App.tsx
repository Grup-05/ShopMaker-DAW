export function App() {
  return (
    <div className="app-container">
      <header>
        <nav aria-label="Navegación principal">
          <a href="#login">Iniciar sesión</a>
          <a href="#register">Registrarse</a>
          <button type="button" aria-label="Cambiar tema">
            Cambiar tema
          </button>
        </nav>
        <h1>ShopMaker</h1>
      </header>
      <main>
        <aside aria-label="Páginas en progreso">
          <button type="button">Crear página</button>
          <p>Ninguna Web en Progreso</p>
        </aside>
        <section aria-label="Área de trabajo">
          <p>Seleccione una web para visualizar</p>
        </section>
      </main>
    </div>
  );
}

export default App;
