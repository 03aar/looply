import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sparkles,
  Zap,
  Shield,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  BarChart3
} from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>The modern alternative to Google Forms</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Forms that people
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              actually love to fill
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl animate-slide-up">
            Create beautiful, animated forms in minutes. Just like Google Forms, but way more delightful.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                Create Your First Form - It's Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                See Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-6 text-sm text-gray-500 animate-fade-in">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>

        {/* Demo Video/Image Placeholder */}
        <div className="mt-16 max-w-5xl mx-auto" id="demo">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white animate-scale-in">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-2xl font-semibold text-gray-700">Interactive Demo Coming Soon</p>
                <p className="text-gray-500 mt-2">Meanwhile, try creating a form - it takes 2 minutes!</p>
                <Link href="/dashboard">
                  <Button className="mt-6" size="lg">
                    Start Building Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need, nothing you don't</h2>
            <p className="text-xl text-gray-600">All the power of Google Forms, with a delightful twist</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Beautiful Animations</h3>
                <p className="text-gray-600">
                  Smooth transitions and delightful interactions that make filling forms actually enjoyable
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600">
                  Create forms in minutes with our intuitive drag-and-drop builder. No learning curve.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your Data, Your Control</h3>
                <p className="text-gray-600">
                  Self-hosted option available. Complete control over your data and privacy.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">14+ Field Types</h3>
                <p className="text-gray-600">
                  Text, email, multiple choice, dropdowns, file uploads, and more. Everything you need.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Anywhere</h3>
                <p className="text-gray-600">
                  Get a unique link for each form. Share via email, social media, or embed on your site.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Powerful Analytics</h3>
                <p className="text-gray-600">
                  View responses in real-time. Export to CSV for deeper analysis. All included.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">So easy, anyone can use it</h2>
            <p className="text-xl text-gray-600">Create your first form in 3 simple steps</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose a Template</h3>
              <p className="text-gray-600">
                Start with a pre-built template or create from scratch. No design skills needed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Your Questions</h3>
              <p className="text-gray-600">
                Click to add fields. Customize labels and options. It's that simple.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Collect</h3>
              <p className="text-gray-600">
                Get your unique link and start collecting responses instantly.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to create amazing forms?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've switched from boring forms to beautiful Looply forms
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6">
              Start Building Now - Free Forever
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="text-purple-100 mt-4 text-sm">
            No credit card required • Setup in 2 minutes • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">looply</h3>
              <p className="text-sm">
                Beautiful forms that people love to fill. The modern alternative to Google Forms.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="hover:text-white">Create Form</Link></li>
                <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
                <li><Link href="#" className="hover:text-white">Examples</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white">Quick Start</Link></li>
                <li><Link href="#" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">GitHub</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2024 Looply. Built with ❤️ using Next.js, Prisma, and Framer Motion.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
