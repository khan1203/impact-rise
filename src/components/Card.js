import Link from 'next/link';
import Image from 'next/image';

export default function Card({ item, type }) {
  const hasBanner = Boolean(item.banner_url);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl">
      <div className="relative h-56 overflow-hidden">
        {hasBanner ? (
          <Image src={item.banner_url} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-sky-100">
            <span className="px-4 text-center text-lg font-semibold text-sky-700">
              {item.title}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-sm font-semibold text-white">
          {type.toUpperCase()}
        </span>
        <h3 className="mb-2 mt-3 line-clamp-2 min-h-[3.5rem] text-xl font-bold">{item.title}</h3>
        <p className="mb-4 line-clamp-3 min-h-[4.5rem] text-gray-600">{item.short_description}</p>
        <div className="mt-auto flex gap-3">
          <Link
            href={`/${type}/${item.id}`}
            className="flex-1 rounded-full border-2 border-purple-600 px-4 py-2 text-center font-semibold text-purple-600 hover:bg-purple-50"
          >
            Details
          </Link>
          <Link
            href={`/${type}/${item.id}`}
            className="flex-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-center font-semibold text-white"
          >
            Donate
          </Link>
        </div>
      </div>
    </div>
  );
}
