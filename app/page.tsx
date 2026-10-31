import Navbar from "@/components/public/Navbar";
import HeroSection from "@/components/public/HeroSection";
import PublicToolList from "@/components/public/PublicToolList";

/**
 * Landing Page (Home)
 * Serves as the public entry point for LendLoop with an enterprise-grade UI layout.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <div
        id="explore"
        className="py-12 bg-gray-50/50 border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Available Neighborhood Tools
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Browse items shared by people around your neighborhood.
            </p>
          </div>
          <PublicToolList />
        </div>
      </div>
    </main>
  );
}
