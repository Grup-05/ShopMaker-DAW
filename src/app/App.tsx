import { createInMemoryPageRepository } from '../features/home/infrastructure/inMemoryPageRepository';
import { startedPages } from '../features/home/infrastructure/startedPages';
import { HomePage } from '../features/home/presentation/HomePage';

export function App() {
  const repository = createInMemoryPageRepository(startedPages);

  return <HomePage pages={repository.listStartedPages()} />;
}
