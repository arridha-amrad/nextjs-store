import AppHeader from '@/components/AppHeader';
import Products from '@/components/Products';

export default async function Page() {
  return (
    <main className="pb-20">
      <AppHeader />
      <div className="mt-[150px]" />
      <Products />
    </main>
  );
}
