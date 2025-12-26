import { supabase } from '../lib/supabase'

export interface EventData {
    id?: string
    title: string
    description?: string
    start_time: string
    end_time?: string
    type?: 'donation_drive' | 'cleanup' | 'emergency' | 'workshop' | 'other'
    status?: 'draft' | 'active' | 'completed' | 'cancelled'
    location_name?: string
    location_coordinates?: unknown
    organizer_id?: string
    created_at?: string
}

export interface EventParticipant {
    event_id: string
    person_id: string
    role: 'volunteer' | 'donor' | 'organizer' | 'attendee'
    status: 'registered' | 'confirmed' | 'attended' | 'noshow'
    person?: {
        id: string
        full_name: string
        phone?: string
        email?: string
    }
}

export interface EventFilters {
    type?: string
    status?: string
    dateRange?: 'upcoming' | 'past' | 'all'
    search?: string
}

export const eventsModel = {
    /**
     * Get all events with optional filters
     */
    async getAllEvents(filters?: any) {
        let query = supabase
            .from('events')
            .select('*')

        if (filters?.type) {
            const types = Array.isArray(filters.type) ? filters.type : [filters.type]
            if (types.length > 0) {
                // Map display names to technical types if necessary
                const technicalTypes = types.map(t => t.toLowerCase().replace(' ', '_'))
                query = query.in('type', technicalTypes)
            }
        }

        if (filters?.status) {
            const statuses = Array.isArray(filters.status) ? filters.status : [filters.status]
            if (statuses.length > 0) {
                query = query.in('status', statuses.map(s => s.toLowerCase()))
            }
        }

        if (filters?.dateRange === 'upcoming') {
            query = query.gte('start_time', new Date().toISOString())
        } else if (filters?.dateRange === 'past') {
            query = query.lt('start_time', new Date().toISOString())
        }

        if (filters?.search) {
            query = query.ilike('title', `%${filters.search}%`)
        }

        const { data, error } = await query.order('start_time', { ascending: false })
        if (error) throw error
        return data as EventData[]
    },

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
        return data as EventData[]
    },

    /**
     * Get a single event by ID
     */
    async getEventById(eventId: string) {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single()

        if (error) throw error
        return data as EventData
    },

    /**
     * Create a new event
     */
    async createEvent(event: Omit<EventData, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('events')
            .insert([event])
            .select()
            .single()

        if (error) throw error
        return data as EventData
    },

    /**
     * Update an existing event
     */
    async updateEvent(eventId: string, updates: Partial<EventData>) {
        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', eventId)
            .select()
            .single()

        if (error) throw error
        return data as EventData
    },

    /**
     * Delete an event
     */
    async deleteEvent(eventId: string) {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId)

        if (error) throw error
    },

    /**
     * Get participants for an event
     */
    async getEventParticipants(eventId: string) {
        const { data, error } = await supabase
            .from('event_participants')
            .select(`
                event_id,
                person_id,
                role,
                status,
                person:people(id, full_name, phone, email)
            `)
            .eq('event_id', eventId)

        if (error) throw error
        return (data as unknown) as EventParticipant[]
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
    },

    /**
     * Update participant status
     */
    async updateParticipantStatus(eventId: string, personId: string, status: string) {
        const { data, error } = await supabase
            .from('event_participants')
            .update({ status })
            .eq('event_id', eventId)
            .eq('person_id', personId)
            .select()

        if (error) throw error
        return data
    }
}
