'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Layout, Palette, Zap, Check, ArrowRight, Smartphone, Globe, Heart, Play, Camera } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartBuilding = () => {
    router.push('/builder');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans text-stone-800 selection:bg-rose-200">

      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-stone-100 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white">
              <Heart size={16} fill="currentColor" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900">wdng online</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#features" className="hover:text-stone-900 transition-colors">Features</a>
            <a href="#themes" className="hover:text-stone-900 transition-colors">Themes</a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-stone-600 hover:text-stone-900 px-4 py-2 text-sm font-medium transition-colors">
                  Log in
                </button>
              </SignInButton>
            </SignedOut>
            <button onClick={handleStartBuilding} className="bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
              Start Building <ArrowRight size={16} />
            </button>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-rose-100/50 rounded-full blur-[100px] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-amber-50/50 rounded-full blur-[100px] -z-10 opacity-60"></div>

        <div className="max-w-5xl mx-auto text-center">

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-900 leading-[1.1] mb-8 tracking-tight">
            Design your dream <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-500 to-rose-400">wedding website</span>.
          </h1>

          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional hosting, personalized subdomains, and editorial-grade themes. Build a beautiful experience for your guests in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button onClick={handleStartBuilding} className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white rounded-full font-bold text-lg hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Start Designing
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-stone-700 border border-stone-200 rounded-full font-bold text-lg hover:bg-stone-50 transition-all flex items-center justify-center gap-2">
              <Play size={18} fill="currentColor" className="text-stone-300" /> Watch Demo
            </button>
          </div>

          {/* Builder Mockup */}
          <div className="relative mx-auto max-w-6xl">
            <div className="relative rounded-2xl border border-stone-200 bg-white/50 backdrop-blur-xl p-2 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-white via-transparent to-transparent z-10 opacity-20"></div>

              {/* Fake Browser UI */}
              <div className="h-8 bg-white border-b border-stone-100 rounded-t-xl flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                </div>
                <div className="mx-auto bg-stone-50 px-32 py-1 rounded-md text-[10px] text-stone-400 font-mono">wdng.online/editor</div>
              </div>

              {/* Split Screen Mockup Content */}
              <div className="aspect-[16/9] bg-stone-100 rounded-b-xl overflow-hidden flex">
                {/* Left: Sidebar */}
                <div className="w-1/3 bg-white border-r border-stone-200 p-6 hidden md:block text-left">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <div className="h-2 w-12 bg-stone-200 rounded"></div>
                         <div className="h-10 w-full bg-stone-50 border border-stone-200 rounded-lg"></div>
                      </div>
                      <div className="space-y-2">
                         <div className="h-2 w-20 bg-stone-200 rounded"></div>
                         <div className="grid grid-cols-3 gap-2">
                            <div className="h-16 bg-amber-50 border-2 border-amber-500 rounded-lg"></div>
                            <div className="h-16 bg-stone-50 border border-stone-100 rounded-lg"></div>
                            <div className="h-16 bg-stone-50 border border-stone-100 rounded-lg"></div>
                         </div>
                      </div>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                         <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-white rounded-md shadow-sm"></div>
                            <div className="h-2 w-24 bg-stone-200 rounded"></div>
                         </div>
                         <div className="h-2 w-full bg-stone-200 rounded mb-1"></div>
                         <div className="h-2 w-2/3 bg-stone-200 rounded"></div>
                      </div>
                   </div>
                </div>
                {/* Right: Preview */}
                <div className="flex-1 bg-stone-200 p-8 flex items-center justify-center">
                   <div className="w-[80%] h-[90%] bg-white rounded-xl shadow-lg overflow-hidden relative">
                      <div className="absolute inset-0">
                         <Image src="https://images.unsplash.com/photo-1519225468359-2996bc01c326?q=80&w=2000&auto=format&fit=crop" fill className="object-cover opacity-90" alt="Preview" unoptimized />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                               <div className="text-4xl font-serif mb-2">Sara & Mladen</div>
                               <div className="text-xs uppercase tracking-widest bg-white/20 backdrop-blur-md py-1 px-3 rounded-full">May 10, 2026</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -right-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 animate-bounce hidden lg:block" style={{animationDuration: '3s'}}>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Check size={20}/></div>
                  <div>
                     <div className="text-xs font-bold text-stone-800">Layout Saved</div>
                     <div className="text-[10px] text-stone-400">Just now</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-stone-900 mb-4">Everything you need</h2>
            <p className="text-stone-500 text-lg">Powerful features wrapped in a beautiful interface.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Layout className="text-rose-500"/>}
              title="Dynamic Layouts"
              desc="Switch between 'Vogue', 'Arch', and 'Immersive' layouts instantly. Your content adapts automatically."
            />
            <FeatureCard
              icon={<Zap className="text-amber-500"/>}
              title="Real-time Editor"
              desc="See your changes as you type. Our split-screen builder makes designing intuitive and fast."
            />
            <FeatureCard
              icon={<Palette className="text-purple-500"/>}
              title="Curated Themes"
              desc="Select from our designer-crafted color palettes like 'Luxe Gold', 'Adriatic Blue', and 'Vintage Sage'."
            />
            <FeatureCard
              icon={<Smartphone className="text-blue-500"/>}
              title="Mobile First"
              desc="Your site looks perfect on every device. We prioritize the mobile experience for your guests."
            />
            <FeatureCard
              icon={<Globe className="text-emerald-500"/>}
              title="Personal Subdomain"
              desc="Get a beautiful, custom URL like ana&luka.wdng.online included with your site."
            />
            <FeatureCard
              icon={<Camera className="text-orange-500"/>}
              title="Guest Photo Upload"
              desc="Collect memories easily. Guests can upload photos directly to your shared digital album."
            />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 px-6 bg-stone-900 text-white">
         <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-center">
               <div className="md:w-1/2">
                  <h2 className="font-serif text-4xl md:text-5xl mb-6">Build in 3 simple steps.</h2>
                  <div className="space-y-8">
                     <Step number="01" title="Choose your vibe" desc="Select a layout and theme that matches your wedding style." />
                     <Step number="02" title="Add your details" desc="Fill in the date, location, and your story. Add events to the timeline." />
                     <Step number="03" title="Publish & Share" desc="Hit save and instantly get a live link to send to your guests." />
                  </div>
                  <button onClick={handleStartBuilding} className="mt-10 px-8 py-3 bg-white text-stone-900 rounded-full font-bold hover:bg-stone-100 transition-colors">
                     Start Designing Now
                  </button>
               </div>
               <div className="md:w-1/2 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-amber-500 rounded-2xl blur-3xl opacity-20"></div>
                  <div className="relative aspect-[4/3] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2000&auto=format&fit=crop"
                      alt="Process"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- THEMES PREVIEW --- */}
      <section id="themes" className="py-24 px-6 bg-[#FAFAF9] overflow-hidden">
         <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="font-serif text-4xl text-stone-900 mb-4">Themes that stun</h2>
            <p className="text-stone-500">Editorial designs usually reserved for magazines.</p>
         </div>

         <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            <ThemePreview title="Vogue" image="https://images.unsplash.com/photo-1519225468359-2996bc01c326?q=80&w=500&auto=format&fit=crop" color="bg-stone-100" />
            <ThemePreview title="Arch" image="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=500&auto=format&fit=crop" color="bg-amber-50" />
            <ThemePreview title="Immersive" image="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=500&auto=format&fit=crop" color="bg-stone-900 text-white" />
            <ThemePreview title="Classic" image="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=500&auto=format&fit=crop" color="bg-white" />
         </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 px-6 bg-white text-center" id="pricing">
         <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-5xl text-stone-900 mb-6">Simple, transparent pricing.</h2>
            <p className="text-lg text-stone-500 mb-10">
               Start with our generous free tier to design your site. Upgrade to unlock unlimited sections and remove branding.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <button onClick={handleStartBuilding} className="px-10 py-4 bg-stone-900 text-white rounded-full font-bold text-lg hover:bg-stone-800 transition-all shadow-xl">
                  Start for Free
               </button>
            </div>
            <p className="mt-6 text-xs text-stone-400 uppercase tracking-widest">
              Basic features free • One-time payment for Premium
            </p>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-stone-50 py-16 px-6 border-t border-stone-200">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-stone-900 rounded flex items-center justify-center text-white"><Heart size={12} fill="currentColor"/></div>
               <span className="font-serif font-bold text-stone-900">wdng online</span>
            </div>
            <div className="flex gap-8 text-sm text-stone-500">
               <a href="#" className="hover:text-stone-900">Templates</a>
               <a href="#" className="hover:text-stone-900">Support</a>
               <a href="#" className="hover:text-stone-900">Login</a>
            </div>
            <p className="text-stone-400 text-xs">© 2026 wdng online Inc.</p>
         </div>
      </footer>

    </div>
  );
};

// --- SUB-COMPONENTS ---

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => (
  <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-lg transition-all group">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-xl text-stone-800 mb-3">{title}</h3>
    <p className="text-stone-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

interface StepProps {
  number: string;
  title: string;
  desc: string;
}

const Step: React.FC<StepProps> = ({ number, title, desc }) => (
  <div className="flex gap-6">
    <div className="font-serif text-3xl text-stone-700 opacity-50">{number}</div>
    <div>
      <h3 className="font-bold text-xl mb-1">{title}</h3>
      <p className="text-stone-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

interface ThemePreviewProps {
  title: string;
  image: string;
  color: string;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ title, image, color }) => (
  <div className="min-w-[280px] md:min-w-[320px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer snap-center">
    <div className="h-[400px] overflow-hidden relative">
       <Image src={image} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt={title} unoptimized />
       <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
    </div>
    <div className={`p-4 ${color} flex justify-between items-center`}>
       <span className="font-serif font-bold">{title}</span>
       <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
    </div>
  </div>
);

export default LandingPage;