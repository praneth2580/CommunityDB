import { supabase } from '../lib/supabase'

export const eventsModel = {
    /**
     * Get all active upcoming events
     */
    async getUpcomingEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .neq('status', 'cancelled')
            .neq('status', 'draft')
            .gte('start_time', new Date().toISOString())
            .order('start_time', { ascending: true })

        if (error) throw error
        return data
    },

    /**
     * Get a single event by ID
     */
    async getEventDetails(eventId: string) {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single()

        if (error) throw error
        return data
    },

    /**
     * Register a person for an event
     */
    async registerForEvent(eventId: string, personId: string, role: string = 'attendee') {
        const { data, error } = await supabase
            .from('event_participants')
            .insert([{ event_id: eventId, person_id: personId, role, status: 'registered' }])
            .select()

        if (error) throw error
        return data
    }
}
