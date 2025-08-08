// app/[slug]/not-found.tsx
export default function NotFound() {
  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-semibold">Product Not Found</h2>
      <p>The product you’re looking for doesn’t exist.</p>
    </div>
  );
}
// This component is used to show a 404 not found state when a product is not found.