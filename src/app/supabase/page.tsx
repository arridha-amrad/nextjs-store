import DeletePhotoFromStorage from "./DeletePhotoFromStorage";
import FormCategory from "./FormCategories";
import FormCategoriesWithCreatableSelect from "./FormCategoriesWithCreatableSelect";
import FormPhotos from "./FormPhotos";

export default function Page() {
  return (
    <main className="container mx-auto">
      <div>
        <h1>Supabase trial page</h1>
      </div>
      <FormCategory />
      <FormPhotos />
      <DeletePhotoFromStorage />
      <FormCategoriesWithCreatableSelect />
    </main>
  );
}
