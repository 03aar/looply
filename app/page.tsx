import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              looply
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl">
              Beautiful forms that people actually love to fill
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-xl">
              Say goodbye to boring forms. Create stunning, animated forms with an amazing user experience.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              <Link
                href="/examples"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-all transform hover:scale-105"
              >
                See Examples
              </Link>
            </div>
          </div>

          <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl">
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Animations</h3>
              <p className="text-gray-600">
                Smooth, delightful animations that make filling forms a joy
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Built for performance and scalability from the ground up
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Intuitive form builder with all the features you need
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
