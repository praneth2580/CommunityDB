import {
  Heart,
  Droplet,
  Shovel,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Users,
  Calendar,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  ThumbsUp,
  MessageCircle,
  Clock,
} from 'lucide-react'

interface LandingPageProps {
  onEnterApp: () => void
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* 🌸 NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              Community<span className="text-rose-500">DB</span>
            </span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
            <a href="#mission" className="hover:text-rose-600 transition-colors">Mission</a>
            <a href="#activities" className="hover:text-rose-600 transition-colors">Activities</a>
            <a href="#impact" className="hover:text-rose-600 transition-colors">Impact</a>
            <a href="#stories" className="hover:text-rose-600 transition-colors">Stories</a>
          </div>

          <button
            onClick={onEnterApp}
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
          >
            Join the Cause
          </button>
        </div>
      </nav>

      {/* ☀️ HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden px-4">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl mix-blend-multiply animate-blob" />
          <div className="absolute top-20 -right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            Active Drive: Blood Donation in Boston
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.1]">
            Empowering Communities,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500">
              One Act at a Time
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join hands for blood donations, cleanliness drives, and social welfare. We connect kind hearts with those in need.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onEnterApp}
              className="px-8 py-4 rounded-full bg-rose-500 text-white font-bold text-lg hover:bg-rose-600 transition-all shadow-xl shadow-rose-200 hover:shadow-2xl hover:shadow-rose-300 flex items-center gap-2 group"
            >
              Get Involved Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all hover:border-slate-300">
              View Upcoming Events
            </button>
          </div>
        </div>
      </section>

      {/* 🛠️ SERVICES GRID */}
      <section id="activities" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Initiatives</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We focus on high-impact local activities where every contribution counts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={Droplet}
              title="Blood Donation"
              description="Connecting donors with hospitals and patients in critical need."
              color="rose"
            />
            <ServiceCard
              icon={Shovel}
              title="Cleanliness Drives"
              description="Organizing community cleanup events to improve local hygiene."
              color="emerald"
            />
            <ServiceCard
              icon={HeartHandshake}
              title="Social Support"
              description="Food distribution, clothing drives, and emergency relief."
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* 📊 IMPACT STATS */}
      <section id="impact" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatCard value="25k+" label="Lives Impacted" />
            <StatCard value="1.2k" label="Active Volunteers" />
            <StatCard value="450+" label="Events Organized" />
            <StatCard value="50+" label="Cities Covered" />
          </div>
        </div>
      </section>

      {/* 🤝 PARTNERS LOGOS */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-slate-500 text-sm font-semibold uppercase tracking-wider mb-8">Trusted by Community Leaders</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-70">
            <PartnerLogo name="CityHospital" />
            <PartnerLogo name="EcoGreen" />
            <PartnerLogo name="FoodBank" />
            <PartnerLogo name="EduTech" />
            <PartnerLogo name="HelpingHands" />
          </div>
        </div>
      </section>

      {/* 🗓️ UPCOMING CALENDAR */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-start">

            {/* Featured Next Event */}
            <div className="md:w-5/12 bg-rose-500 rounded-3xl p-8 text-white shadow-2xl shadow-rose-200 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-colors" />

              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-6 backdrop-blur-sm">
                NEXT BIG EVENT
              </div>

              <div className="mb-8">
                <div className="text-6xl font-black mb-1">15</div>
                <div className="text-2xl font-medium opacity-90">December</div>
              </div>

              <h3 className="text-3xl font-bold mb-4 leading-tight">Mega Blood Donation Drive</h3>
              <p className="text-rose-100 mb-8 leading-relaxed">
                Join us at the City Community Hall to save lives. Our target is 500 units!
              </p>

              <div className="flex items-center gap-4 text-sm font-semibold">
                <div className="flex items-center gap-2 bg-rose-600/50 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4" /> 9:00 AM
                </div>
                <div className="flex items-center gap-2 bg-rose-600/50 px-3 py-1.5 rounded-lg">
                  <MapPinIcon className="w-4 h-4" /> Boston Hall
                </div>
              </div>
            </div>

            {/* Upcoming List */}
            <div className="md:w-7/12 flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Mark Your Calendar</h2>
                <a href="#/activities" className="text-rose-600 font-bold text-sm hover:underline">View All</a>
              </div>

              <div className="space-y-2">
                <EventRow
                  day="20" month="Dec"
                  title="Winter Warmth Distribution"
                  time="10:00 AM - 2:00 PM"
                  location="Central Square"
                />
                <EventRow
                  day="05" month="Jan"
                  title="Riverside Park Cleanup"
                  time="7:00 AM - 11:00 AM"
                  location="Riverside Park"
                />
                <EventRow
                  day="12" month="Jan"
                  title="Health Awareness Workshop"
                  time="5:00 PM - 7:00 PM"
                  location="Public Library"
                />
                <EventRow
                  day="18" month="Feb"
                  title="Charity Marathon 2025"
                  time="6:00 AM - 12:00 PM"
                  location="City Stadium"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📰 RECENT ACTIVITIES PREVIEW */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Latest from the Community</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12 text-left">
            <PreviewCard
              category="Drive"
              title="Mega Blood Donation Camp 2024"
              date="Dec 15, 2024"
              image="bg-rose-100"
            />
            <PreviewCard
              category="Social"
              title="Winter Warmth Distribution"
              date="Dec 20, 2024"
              image="bg-amber-100"
            />
            <PreviewCard
              category="Green"
              title="Riverside Park Cleanup"
              date="Jan 05, 2025"
              image="bg-emerald-100"
            />
          </div>

          <a href="#/activities" className="inline-flex items-center gap-2 font-bold text-slate-900 border-b-2 border-rose-500 pb-0.5 hover:text-rose-600 transition-colors">
            View All Activities <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 📱 SOCIAL MEDIA CONNECT */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
            Social Community
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
            Follow Our Journey
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
            Join 15,000+ community members online. We share daily updates, success stories, and urgent requirements here.
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-16">
            <a href="#" className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 hover:shadow-lg hover:shadow-[#1DA1F2]/10 transition-all duration-300">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-[#E1306C] hover:border-[#E1306C]/30 hover:shadow-lg hover:shadow-[#E1306C]/10 transition-all duration-300">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-[#4267B2] hover:border-[#4267B2]/30 hover:shadow-lg hover:shadow-[#4267B2]/10 transition-all duration-300">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-[#0077b5] hover:border-[#0077b5]/30 hover:shadow-lg hover:shadow-[#0077b5]/10 transition-all duration-300">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>

          {/* Social Feed Mockup */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <SocialCard
              platform="twitter"
              author="CommunityDB"
              handle="community_db"
              content="Huge shoutout to the 50 volunteers who showed up for the Riverside cleanup today! You guys are heroes. 🌿🗑️ #CleanCity #Volunteer"
              date="2h ago"
              likes="124"
              comments="12"
            />
            <SocialCard
              platform="instagram"
              author="CommunityDB"
              handle="community_db"
              content="Faces of hope! ❤️ Thank you to everyone who donated blood at the City Hall drive. We collected 450 units! 🩸"
              image="bg-rose-100"
              date="5h ago"
              likes="856"
              comments="45"
            />
            <SocialCard
              platform="twitter"
              author="CommunityDB"
              handle="community_db"
              content="Urgent: We need 2 volunteers with vehicles for food distribution in North District tomorrow morning. DM if available! 🚚"
              date="1d ago"
              likes="89"
              comments="8"
            />
          </div>
        </div>
      </section>

      {/* 🤝 JOIN THE MOVEMENT */}
      <section className="py-24 bg-rose-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <div className="inline-block px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-bold text-sm mb-6">
                Join the Family
              </div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">
                Everyone has a role to play. <br />
                <span className="text-rose-500">What's yours?</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Whether you have time to spare, resources to share, or just a willingness to help, there's a place for you here.
              </p>

              <div className="space-y-4">
                <CheckItem text="Verify volunteer hours for students" />
                <CheckItem text="Connect with like-minded locals" />
                <CheckItem text="Make a tangible difference today" />
              </div>
            </div>

            <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RoleCard
                title="Volunteer"
                icon={Users}
                desc="Lead events & coordinate."
                color="bg-sky-50 text-sky-600"
              />
              <RoleCard
                title="Donor"
                icon={Heart}
                desc="Give blood or resources."
                color="bg-rose-50 text-rose-600"
              />
              <RoleCard
                title="Partner"
                icon={HeartHandshake}
                desc="NGOs & Hospitals."
                color="bg-amber-50 text-amber-600"
              />
              <RoleCard
                title="Organizer"
                icon={Calendar}
                desc="Plan local drives."
                color="bg-emerald-50 text-emerald-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🦶 FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">CommunityDB</span>
            </div>

            <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900">Terms of Service</a>
              <a href="#" className="hover:text-slate-900">Contact Support</a>
            </div>

            <div className="flex gap-4">
              <SocialIcon />
              <SocialIcon />
              <SocialIcon />
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-slate-400">
            © 2024 CommunityDB. Built for the people, by the people.
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */

function ServiceCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: 'rose' | 'emerald' | 'amber' }) {
  const colorStyles = {
    rose: 'bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
    emerald: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    amber: 'bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
  }

  return (
    <div className="group p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200 transition-all duration-300">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${colorStyles[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}

function StatCard({ value, label }: { value: string, label: string }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
        {value}
      </div>
      <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">
        {label}
      </div>
    </div>
  )
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <span className="text-slate-700 font-medium">{text}</span>
    </div>
  )
}

function RoleCard({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: any, color: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all cursor-pointer group">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  )
}

function PreviewCard({ category, title, date, image }: { category: string, title: string, date: string, image: string }) {
  return (
    <div className="group cursor-pointer">
      <div className={`h-48 rounded-2xl ${image} mb-4 overflow-hidden relative`}>
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
        <span className="text-rose-500">{category}</span>
        <span>•</span>
        <span>{date}</span>
      </div>
      <h3 className="text-xl font-bold leading-tight group-hover:text-rose-600 transition-colors">
        {title}
      </h3>
    </div>
  )
}

function SocialCard({ platform, author, handle, content, date, likes, comments, image }: { platform: 'twitter' | 'instagram', author: string, handle: string, content: string, date: string, likes: string, comments: string, image?: string }) {
  const PlatformIcon = platform === 'twitter' ? Twitter : Instagram

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
            {author[0]}
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-none">{author}</div>
            <div className="text-xs text-slate-500">@{handle}</div>
          </div>
        </div>
        <PlatformIcon className={`w-5 h-5 ${platform === 'twitter' ? 'text-sky-500' : 'text-pink-500'}`} />
      </div>

      <p className="text-slate-700 text-sm mb-4 leading-relaxed">
        {content}
      </p>

      {image && (
        <div className={`h-48 rounded-xl ${image} mb-4 bg-cover bg-center`} />
      )}

      <div className="flex items-center justify-between text-xs text-slate-400 font-medium border-t border-slate-50 pt-3">
        <span>{date}</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer">
            <ThumbsUp className="w-3.5 h-3.5" /> {likes}
          </span>
          <span className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
            <MessageCircle className="w-3.5 h-3.5" /> {comments}
          </span>
        </div>
      </div>
    </div>
  )
}

function SocialIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer">
      <div className="w-4 h-4 bg-current rounded-sm" />
    </div>
  )
}

function EventRow({ day, month, title, time, location }: { day: string, month: string, title: string, time: string, location: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group cursor-pointer">
      <div className="flex-shrink-0 w-14 h-14 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-600 font-bold leading-tight group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
        <span className="text-xs uppercase">{month}</span>
        <span className="text-lg">{day}</span>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">{title}</h4>
        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {time}</span>
          <span className="flex items-center gap-1"><MapPinIcon className="w-3 h-3" /> {location}</span>
        </div>
      </div>
    </div>
  )
}

function PartnerLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-400 font-bold text-xl group cursor-pointer hover:text-slate-600 transition-colors">
      <div className="w-8 h-8 bg-slate-200 rounded-full group-hover:bg-rose-200 transition-colors" />
      <span>{name}</span>
    </div>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
  )
}

