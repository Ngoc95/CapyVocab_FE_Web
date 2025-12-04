import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp,
  Star,
  Users,
  Zap,
  Award,
  ArrowRight,
  Check
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Rich Vocabulary',
    description: 'Access thousands of carefully curated English words across various topics',
    color: 'bg-blue-500',
  },
  {
    icon: Brain,
    title: 'Smart Learning',
    description: 'AI-powered spaced repetition system adapts to your learning pace',
    color: 'bg-purple-500',
  },
  {
    icon: Target,
    title: 'Track Progress',
    description: 'Monitor your improvement with detailed statistics and insights',
    color: 'bg-green-500',
  },
  {
    icon: Zap,
    title: 'Interactive Quizzes',
    description: 'Test your knowledge with engaging quizzes and flashcards',
    color: 'bg-orange-500',
  },
];

const stats = [
  { label: 'Active Learners', value: '10,000+', icon: Users },
  { label: 'Vocabulary Words', value: '50,000+', icon: BookOpen },
  { label: 'Lessons Available', value: '200+', icon: Award },
  { label: 'Success Rate', value: '94%', icon: TrendingUp },
];

const testimonials = [
  {
    name: 'Nguyen Van A',
    role: 'Student',
    content: 'CapyVocab helped me improve my English vocabulary dramatically. The spaced repetition system is brilliant!',
    rating: 5,
  },
  {
    name: 'Tran Thi B',
    role: 'Professional',
    content: 'As a working professional, I love how I can learn at my own pace. The lessons are well-structured and effective.',
    rating: 5,
  },
  {
    name: 'Le Van C',
    role: 'IELTS Candidate',
    content: 'Preparing for IELTS has never been easier. The vocabulary topics are comprehensive and practical.',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    features: [
      'Access to basic vocabulary',
      '5 lessons per month',
      'Basic flashcards',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '99,000',
    period: 'per month',
    features: [
      'Unlimited vocabulary access',
      'All lessons unlocked',
      'Advanced quizzes',
      'Personalized learning path',
      'Priority support',
      'Download certificates',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
];

export function WelcomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-2xl">🦫</span>
            </div>
            <span className="font-semibold text-xl">CapyVocab</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                🎉 Join 10,000+ learners today
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Master English Vocabulary the Smart Way
              </h1>
              <p className="text-xl text-muted-foreground">
                Learn with our AI-powered spaced repetition system. Track your progress, 
                take quizzes, and achieve fluency faster.
              </p>
              <div className="flex gap-4">
                <Link to="/register">
                  <Button size="lg" className="text-lg">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center">
                <span className="text-9xl">🦫</span>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold">487 words learned</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose CapyVocab?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the most effective way to learn English vocabulary with our innovative features
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 space-y-4">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Learners Say</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of satisfied students improving their English
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your learning goals
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`${plan.highlighted ? 'border-2 border-primary shadow-xl' : ''}`}
              >
                <CardContent className="pt-6 space-y-6">
                  {plan.highlighted && (
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}₫</span>
                      <span className="text-muted-foreground ml-2">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="block">
                    <Button 
                      className="w-full" 
                      variant={plan.highlighted ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/20">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of learners and master English vocabulary today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🦫</span>
                </div>
                <span className="font-semibold text-xl">CapyVocab</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Master English vocabulary the smart way with AI-powered learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Features</Link></li>
                <li><Link to="/" className="hover:text-foreground">Pricing</Link></li>
                <li><Link to="/" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">About</Link></li>
                <li><Link to="/" className="hover:text-foreground">Blog</Link></li>
                <li><Link to="/" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Privacy</Link></li>
                <li><Link to="/" className="hover:text-foreground">Terms</Link></li>
                <li><Link to="/" className="hover:text-foreground">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 CapyVocab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
