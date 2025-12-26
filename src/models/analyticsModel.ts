import { supabase } from '../lib/supabase'

export interface DashboardStats {
    totalPeople: number
    activeVolunteers: number
    urgentRequests: number
    activeDonors: number
}

export interface BloodTypeDistribution {
    group: string
    count: number
    percentage: number
}

export const analyticsModel = {
    /**
     * Get high-level summary stats for the dashboard
     */
    async getDashboardStats(): Promise<DashboardStats> {
        try {
            const [
                { count: totalPeople },
                { count: activeVolunteers },
                { count: urgentRequests },
                { count: activeDonors }
            ] = await Promise.all([
                supabase.from('people').select('*', { count: 'exact', head: true }),
                supabase.from('people').select('*', { count: 'exact', head: true }).eq('is_volunteer', true),
                supabase.from('assistance_requests').select('*', { count: 'exact', head: true }).in('urgency', ['critical', 'high']).eq('status', 'open'),
                supabase.from('people').select('*', { count: 'exact', head: true }).eq('is_blood_donor', true)
            ])

            return {
                totalPeople: totalPeople || 0,
                activeVolunteers: activeVolunteers || 0,
                urgentRequests: urgentRequests || 0,
                activeDonors: activeDonors || 0
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
            throw error
        }
    },

    /**
     * Get distribution of blood types for analytics charts
     */
    async getBloodTypeDistribution(): Promise<BloodTypeDistribution[]> {
        const { data, error } = await supabase
            .from('people')
            .select('blood_group')
            .is('is_blocked', false)

        if (error) throw error

        const counts: Record<string, number> = {}
        data.forEach(p => {
            if (p.blood_group) {
                counts[p.blood_group] = (counts[p.blood_group] || 0) + 1
            }
        })

        const total = Object.values(counts).reduce((a, b) => a + b, 0)

        return Object.entries(counts).map(([group, count]) => ({
            group,
            count,
            percentage: Math.round((count / total) * 100)
        })).sort((a, b) => b.count - a.count)
    },

    /**
     * Get monthly registration trends (last 6 months)
     */
    async getMonthlyTrends() {
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
        sixMonthsAgo.setDate(1)

        const { data, error } = await supabase
            .from('people')
            .select('created_at')
            .gte('created_at', sixMonthsAgo.toISOString())

        if (error) throw error

        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        const trends: Record<string, number> = {}

        // Initialize last 6 months
        for (let i = 0; i < 6; i++) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            trends[months[d.getMonth()]] = 0
        }

        data.forEach(p => {
            const month = months[new Date(p.created_at).getMonth()]
            if (trends[month] !== undefined) {
                trends[month]++
            }
        })

        return Object.entries(trends)
            .map(([label, value]) => ({ label, value }))
            .reverse()
    },

    /**
     * Get recent system-wide activity
     */
    async getRecentActivity(limit = 5) {
        // This is a simplified fetch from 'people', in a real app we might have a dedicated audit log
        const { data, error } = await supabase
            .from('people')
            .select('id, full_name, created_at, is_volunteer, is_blood_donor')
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data
    }
}
