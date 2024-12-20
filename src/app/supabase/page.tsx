import FormCategory from "./FormCategories";
import FormPhotos from "./FormPhotos";

export default function Page() {
  return (
    <main className="container mx-auto">
      <div>
        <h1>Supabase trial page</h1>
      </div>
      <FormCategory />
      <FormPhotos />
    </main>
  );
}
