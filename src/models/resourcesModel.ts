import { supabase } from '../lib/supabase'

export interface ResourceData {
    id: string
    donor_id: string
    event_id: string
    type: 'money' | 'blood' | 'food' | 'kits' | 'other'
    quantity: number
    unit: string
    status: 'pledged' | 'collected' | 'distributed'
    collected_at: string
    donor?: {
        full_name: string
        phone?: string
        email?: string
    }
}

export const resourcesModel = {
    /**
     * Get resources for a specific event
     */
    async getResourcesByEvent(eventId: string) {
        const { data, error } = await supabase
            .from('resources')
            .select(`
                *,
                donor:people(full_name, phone, email)
            `)
            .eq('event_id', eventId)
            .order('collected_at', { ascending: false })

        if (error) throw error
        return data as ResourceData[]
    },

    /**
     * Record a new donation/resource
     */
    async addResource(resource: Omit<ResourceData, 'id' | 'collected_at' | 'donor'>) {
        const { data, error } = await supabase
            .from('resources')
            .insert([resource])
            .select()
            .single()

        if (error) throw error
        return data as ResourceData
    },

    /**
     * Update the status of a resource
     */
    async updateResourceStatus(resourceId: string, status: ResourceData['status']) {
        const { data, error } = await supabase
            .from('resources')
            .update({ status })
            .eq('id', resourceId)
            .select()
            .single()

        if (error) throw error
        return data as ResourceData
    }
}
