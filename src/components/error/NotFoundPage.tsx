import { ErrorPage } from './ErrorPage';
export function NotFoundPage() {
  return <ErrorPage code={404} title="Página não encontrada" message="A página que você está procurando não existe ou foi movida." />;
}
