import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-8 w-8" fill="white" />
              <span className="text-2xl font-bold">ImpactRise</span>
            </div>
            <p className="text-gray-400">Empowering youth-focused ethical activism</p>
          </div>
          <div>
            <h3 className="mb-4 font-bold">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> info@impactrise.org
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +880 1712-345678
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Dhaka, Bangladesh
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2026 ImpactRise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
