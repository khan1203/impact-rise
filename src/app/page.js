// page.js
import Link from 'next/link';
import { Target, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section - Two Column Layout */}
      <div className="bg-sky-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            {/* Left Column - Text and CTA */}
            <div className="flex flex-col justify-center">
              <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl leading-tight">
                Empower Youth.<br />Transform Communities.
              </h1>
              <p className="mb-8 text-lg text-sky-100 md:text-xl leading-relaxed">
                ImpactRise connects socially responsible initiatives with passionate donors. Support youth-led projects that create meaningful change in society.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <Link
                  href="/campaigns"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-sky-600 font-semibold rounded-lg shadow-lg hover:bg-sky-50 hover:shadow-xl transition duration-300 transform hover:scale-105"
                >
                  Explore Initiatives
                </Link>
                <Link
                  href="/dashboard/user"
                  className="inline-flex items-center justify-center px-8 py-4 bg-sky-700 text-white font-semibold rounded-lg border border-sky-400 shadow-lg hover:bg-sky-800 hover:shadow-xl transition duration-300"
                >
                  Join as Donor
                </Link>
              </div>
            </div>

            {/* Right Column - Powerful Image */}
            <div className="flex items-center justify-center">
              <div className="relative w-full h-96 rounded-3xl shadow-2xl overflow-hidden bg-cover bg-center"
                style={{
                  backgroundImage: 'url("https://imgs.search.brave.com/Nxv21ZtnCJEeTX-4s5iT6y_vR7gpv0IeizBL0x0klGE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi95b3V0/aC1lbXBvd2VybWVu/dC1hYnN0cmFjdC1j/b25jZXB0LXZlY3Rv/ci1pbGx1c3RyYXRp/b24tY2hpbGRyZW4t/eW91bmctcGVvcGxl/LXRha2UtY2hhcmdl/LWFjdGlvbi1pbXBy/b3ZlLWxpZmUtcXVh/bGl0eS1kZW1vY3Jh/Y3ktMjM0ODgzNTQw/LmpwZw")',
                  backgroundPosition: 'center',
                }}>
                {/* Overlay with motivational quote */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <blockquote className="text-2xl font-bold leading-tight mb-3">
                    "Every youth has the power<br/>to create positive change."
                  </blockquote>
                  <p className="text-sm font-semibold text-sky-200">
                    ✨ Join the movement of young leaders making a difference
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Cards */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-4xl font-bold text-sky-600">
          Our Mission
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-sky-100 transition-shadow duration-300 hover:shadow-xl hover:border-sky-200">
            <Target className="mb-4 h-12 w-12 text-sky-600" />
            <h3 className="mb-4 text-2xl font-bold text-sky-700">
              Ethical Enrichment
            </h3>
            <p className="text-gray-600">
              Supporting platforms for ethical growth and moral responsibility
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-sky-100 transition-shadow duration-300 hover:shadow-xl hover:border-sky-200">
            <Users className="mb-4 h-12 w-12 text-sky-600" />
            <h3 className="mb-4 text-2xl font-bold text-sky-700">
              Social Responsibility
            </h3>
            <p className="text-gray-600">
              Empowering youth to address social challenges
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-sky-100 transition-shadow duration-300 hover:shadow-xl hover:border-sky-200">
            <TrendingUp className="mb-4 h-12 w-12 text-sky-600" />
            <h3 className="mb-4 text-2xl font-bold text-sky-700">
              Awareness Activism
            </h3>
            <p className="text-gray-600">
              Creating platforms for meaningful dialogue and action
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-sky-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Make an Impact?</h2>
          <p className="mb-8 text-xl text-sky-100">
            Join thousands of donors supporting youth initiatives
          </p>
          <Link
            href="/campaigns"
            className="inline-block transform rounded-lg bg-white px-8 py-4 font-semibold text-sky-600 shadow-lg transition duration-300 hover:scale-105 hover:bg-sky-50 hover:shadow-xl"
          >
            Start Supporting Today
          </Link>
        </div>
      </div>
    </div>
  );
}