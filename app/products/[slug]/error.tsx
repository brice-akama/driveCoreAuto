'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-10 text-red-600">
      <h2>Something went wrong loading this product.</h2>
      <p>{error.message}</p>
    </div>
  );
}