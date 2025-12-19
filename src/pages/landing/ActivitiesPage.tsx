import { useState } from 'react'
import { Calendar, MapPin, ArrowRight, Search, Tag } from 'lucide-react'

// Mock Data for Activities
const ACTIVITIES_DATA = [
    {
        id: 1,
        title: 'Mega Blood Donation Camp 2024',
        category: 'Drive',
        date: 'Dec 15, 2024',
        location: 'City Community Hall, Boston',
        image: 'bg-rose-100', // Placeholder
        excerpt: 'Join us for our biggest annual blood donation drive. Our target is to collect 500 units to support local hospitals.',
        content: 'Full content would go here...'
    },
    {
        id: 2,
        title: 'Winter Warmth: Clothing Distribution',
        category: 'Social Service',
        date: 'Dec 20, 2024',
        location: 'Central Square',
        image: 'bg-amber-100', // Placeholder
        excerpt: 'Help us distribute warm clothes and blankets to the homeless this winter. Donations are welcome until Dec 18.',
        content: 'Full content would go here...'
    },
    {
        id: 3,
        title: 'Community Clean-up: Riverside Park',
        category: 'Environment',
        date: 'Jan 05, 2025',
        location: 'Riverside Park',
        image: 'bg-emerald-100', // Placeholder
        excerpt: 'Let’s start the new year with a green act! Join 50+ volunteers to clean up our beloved Riverside Park.',
        content: 'Full content would go here...'
    },
    {
        id: 4,
        title: 'Health Awareness Workshop',
        category: 'Education',
        date: 'Jan 12, 2025',
        location: 'Public Library Auditorium',
        image: 'bg-sky-100', // Placeholder
        excerpt: 'A free workshop on heart health and emergency first aid, conducted by leading cardiologists.',
        content: 'Full content would go here...'
    },
    {
        id: 5,
        title: 'Food Drive for Local Shelter',
        category: 'Social Service',
        date: 'Jan 20, 2025',
        location: 'Community Center',
        image: 'bg-orange-100', // Placeholder
        excerpt: 'Collecting non-perishable food items for the local shelter. Volunteers needed for packing and distribution.',
        content: 'Full content would go here...'
    }
]

const CATEGORIES = ['All', 'Drive', 'Social Service', 'Environment', 'Education']

export function ActivitiesPage() {
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredActivities = ACTIVITIES_DATA.filter(activity => {
        const matchesCategory = selectedCategory === 'All' || activity.category === selectedCategory
        const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* 📰 HERO SECTION */}
            <section className="bg-slate-900 text-white py-20 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-6 border border-rose-500/30">
                        News & Updates
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Community Happenings
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Stay updated with our latest drives, events, and success stories. See how we are making a difference together.
                    </p>
                </div>
            </section>

            {/* 🔍 FILTERS & SEARCH */}
            <section className="py-8 border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${selectedCategory === cat
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-slate-900 text-sm"
                        />
                    </div>
                </div>
            </section>

            {/* 🗞️ FEED */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {filteredActivities.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredActivities.map(activity => (
                                <ActivityCard key={activity.id} activity={activity} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            <p>No activities found matching your criteria.</p>
                            <button
                                onClick={() => { setSelectedCategory('All'); setSearchQuery('') }}
                                className="mt-4 text-rose-600 font-medium hover:underline"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* 📧 NEWSLETTER CTA */}
            <section className="py-20 bg-rose-50">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Never Miss an Update</h2>
                    <p className="text-slate-600 mb-8">
                        Subscribe to our weekly newsletter to get updates on upcoming drives and volunteering opportunities directly in your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-5 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-rose-500"
                        />
                        <button className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-white border-t border-slate-200 py-12 text-center text-sm text-slate-500">
                <div className="max-w-7xl mx-auto px-4">
                    <p>© 2024 CommunityDB. All rights reserved.</p>
                    <div className="mt-4 flex justify-center gap-6">
                        <a href="/" className="hover:text-slate-900">Home</a>
                        <a href="#" className="hover:text-slate-900">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function ActivityCard({ activity }: { activity: any }) {
    return (
        <article className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full group">
            {/* Image Placeholder */}
            <div className={`h-48 ${activity.image} relative overflow-hidden`}>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                    <Tag className="w-3 h-3" /> {activity.category}
                </div>
                {/* Abstract Pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent"></div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {activity.date}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {activity.location}
                    </span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-rose-600 transition-colors">
                    {activity.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                    {activity.excerpt}
                </p>

                <button className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-rose-600 transition-colors mt-auto group/btn">
                    Read Full Story
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </article>
    )
}
