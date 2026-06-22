import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <h1 className="text-5xl font-semibold tracking-tight">404</h1>
      <p className="mt-3 text-black/50">We couldn&apos;t find that page.</p>
      <Link href="/" className="btn-grape mt-8">
        Describe a problem
      </Link>
    </main>
  );
}
