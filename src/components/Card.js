import Link from 'next/link';
import Image from 'next/image';

export default function Card({ item, type }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl">
      <div className="relative h-56">
        <Image src={item.banner_url} alt={item.title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <span className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-sm font-semibold text-white">
          {type.toUpperCase()}
        </span>
        <h3 className="mb-2 mt-3 text-xl font-bold">{item.title}</h3>
        <p className="mb-4 line-clamp-2 text-gray-600">{item.short_description}</p>
        <div className="flex gap-3">
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
