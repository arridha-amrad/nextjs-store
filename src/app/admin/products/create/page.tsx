import { FormCreateProduct } from "@/features";

export default function Page() {
  return (
    <main className="py-4 px-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Add Product</h1>
      </div>
      <FormCreateProduct />
    </main>
  );
}
