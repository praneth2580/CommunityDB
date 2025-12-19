import { supabase } from '../lib/supabase'

export interface PersonData {
    id?: string // Optional for inserts
    user_id?: string
    full_name: string
    first_name?: string
    middle_name?: string
    last_name?: string
    phone: string
    email?: string
    address_line?: string
    locality_area?: string
    geo_location?: any // PostGIS point
    participation?: {
        event: {
            title: string
            start_time: string
        }
        status: string
    }[]

    // Emergency & Volunteer
    blood_group?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
    is_blood_donor?: boolean
    last_donation_date?: string
    is_volunteer?: boolean
    skills?: string[]
    availability?: any // JSONB

    // Family
    marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated'
    children_count?: number
    children_ids?: string[]

    // System
    is_blocked?: boolean
    created_at?: string
    updated_at?: string
}

export const peopleModel = {
    /**
     * Get the profile of the currently logged-in user
     */
    async getMyProfile() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data, error } = await supabase
            .from('people')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error('Error fetching profile:', error)
            throw error
        }

        return data
    },

    /**
     * Create a new person record (Census data)
     */
    async createPerson(personData: PersonData) {
        const { data, error } = await supabase
            .from('people')
            .insert([personData])
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Update a person's profile
     */
    /**
     * Update a person's profile
     */
    async updateProfile(id: string, updates: Partial<PersonData>) {
        const { data, error } = await supabase
            .from('people')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Get a single person by ID
     */
    async getPersonById(id: string) {
        // Fetch person basic info
        const { data: person, error } = await supabase
            .from('people')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        // Fetch recent participation
        const { data: participation } = await supabase
            .from('event_participants')
            .select(`
                status,
                event:events (
                    title,
                    start_time
                )
            `)
            .eq('person_id', id)
            .order('created_at', { foreignTable: 'events', ascending: false })
            .limit(5)

        return {
            ...person,
            participation: participation?.map(p => ({
                event: p.event,
                status: p.status
            }))
        }
    },

    /**
     * Get all people (Admin only)
     * Supports basic searching/filtering if needed later
     */
    async getAllPeople() {
        const { data, error } = await supabase
            .from('people')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    }
}
