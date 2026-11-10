import type { StartedPage } from '../domain/StartedPage';

export interface HomePageState {
  readonly selectedPageId: string | null;
}

export type HomePageAction = {
  readonly type: 'select';
  readonly pageId: string;
};

export const initialHomePageState: HomePageState = {
  selectedPageId: null,
};

export function homePageReducer(
  state: HomePageState,
  action: HomePageAction,
): HomePageState {
  switch (action.type) {
    case 'select':
      return { ...state, selectedPageId: action.pageId };
    default:
      return state;
  }
}

export function findSelectedPage(
  pages: readonly StartedPage[],
  state: HomePageState,
): StartedPage | undefined {
  return pages.find((page) => page.id === state.selectedPageId);
}
