import Link from 'next/link';

export default function user() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">
          This is the Users Page
        </h1>
      <Link href="/" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
        Back to Homp Page
      </Link>
    </div>
  );
}