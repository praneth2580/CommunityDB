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
            id: string
            title: string
            start_time: string
            end_time?: string
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
    admins?: { role: 'super_admin' | 'admin' | 'volunteer' } | null
}

export interface DeletedPersonData extends PersonData {
    deleted_at: string
    deleted_by?: string
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
     * Get a single person by ID with enhanced participation data
     */
    async getPersonById(id: string) {
        // Fetch person basic info
        const { data: person, error } = await supabase
            .from('people')
            .select('*, admins(role)')
            .eq('id', id)
            .single()

        if (error) throw error

        // Fetch all participation to calculate stats
        const { data: participation } = await supabase
            .from('event_participants')
            .select(`
                status,
                event:events (
                    id,
                    title,
                    start_time,
                    end_time
                )
            `)
            .eq('person_id', id)
            .order('created_at', { foreignTable: 'events', ascending: false })

        return {
            ...person,
            participation: participation?.map(p => ({
                event: p.event,
                status: p.status
            }))
        }
    },

    /**
     * Get all volunteers (Admin only)
     */
    async getVolunteers() {
        const { data, error } = await supabase
            .from('people')
            .select('*, admins!inner(role)')
            .or('is_volunteer.eq.true')
            .or('role.eq.volunteer', { foreignTable: 'admins' })
            .order('full_name', { ascending: true })

        if (error) throw error
        return data as PersonData[]
    },

    /**
     * Get all people (Admin only)
     * Supports basic searching/filtering if needed later
     */
    async getAllPeople(filters?: Record<string, string[]>) {
        let query = supabase
            .from('people')
            .select('*, admins(role)')

        if (filters) {
            Object.entries(filters).forEach(([category, values]) => {
                if (values.length > 0) {
                    if (category === 'blood_group') {
                        query = query.in('blood_group', values)
                    } else if (category === 'is_blood_donor') {
                        const isDonor = values.map(v => v === 'Donor')
                        query = query.in('is_blood_donor', isDonor)
                    } else if (category === 'is_volunteer') {
                        const isVolunteer = values.map(v => v === 'Volunteer')
                        query = query.in('is_volunteer', isVolunteer)
                    }
                }
            })
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) throw error
        return data as PersonData[]
    },

    /**
     * Search for people by name, email, or phone
     */
    async searchPeople(query: string) {
        if (!query) return []

        const { data, error } = await supabase
            .from('people')
            .select('*, admins(role)')
            .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
            .limit(10)

        if (error) throw error
        return data as PersonData[]
    },

    /**
     * Get all deleted people (Admin only)
     */
    async getDeletedPeople() {
        const { data, error } = await supabase
            .from('deleted_people')
            .select('*')
            .order('deleted_at', { ascending: false })

        if (error) throw error
        return data as DeletedPersonData[]
    },

    /**
     * Restore a deleted person
     */
    async restorePerson(person: DeletedPersonData) {
        // 1. Insert back into people
        const { deleted_at, deleted_by, ...originalData } = person
        const { data, error: insertError } = await supabase
            .from('people')
            .insert([originalData])
            .select()
            .single()

        if (insertError) throw insertError

        // 2. Delete from deleted_people
        const { error: deleteError } = await supabase
            .from('deleted_people')
            .delete()
            .eq('id', person.id)

        if (deleteError) throw deleteError

        return data
    },

    /**
     * Delete a person (will be archived by DB trigger)
     */
    async deletePerson(id: string) {
        const { error } = await supabase
            .from('people')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    async getCurrentUserRole() {
        console.log('[Model] getCurrentUserRole: Fetching role via direct query...')

        try {
            console.log("CALLED")
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser()

            console.log('[Model] getCurrentUserRole: User:', user)

            if (!user) {
                console.log('[Model] getCurrentUserRole: No authenticated user')
                return null
            }

            console.log('[Model] getCurrentUserRole: User ID:', user.id)

            // Query admins table directly - the SELECT policy allows authenticated users to view
            const { data, error } = await supabase
                .from('admins')
                .select('role')
                .eq('user_id', user.id)
                .maybeSingle()

            if (error) {
                console.error('[Model] getCurrentUserRole: Query error:', error)
                return null
            }

            const role = data?.role || null
            console.log('[Model] getCurrentUserRole: Result:', role || 'No role found')
            return role as 'super_admin' | 'admin' | 'volunteer' | null
        } catch (err) {
            console.error('[Model] getCurrentUserRole: Exception:', err)
            return null
        }
    },
    async getCurrentUserRoleByID(id: string) {
        console.log('[Model] getCurrentUserRoleByID: Fetching role via direct query...')

        try {
            // Query admins table directly - the SELECT policy allows authenticated users to view
            const { data, error } = await supabase
                .from('admins')
                .select('role')
                .eq('user_id', id)
                .maybeSingle()

            if (error) {
                console.error('[Model] getCurrentUserRoleByID: Query error:', error)
                return null
            }

            const role = data?.role || null
            console.log('[Model] getCurrentUserRoleByID: Result:', role || 'No role found')
            return role as 'super_admin' | 'admin' | 'volunteer' | null
        } catch (err) {
            console.error('[Model] getCurrentUserRoleByID: Exception:', err)
            return null
        }
    },

    /**
     * Promote a person to an admin role
     * Note: Requires super_admin privileges at DB level
     */
    async promoteToAdmin(person_id: string, role: string) {
        const { error } = await supabase.rpc('promote_to_admin', {
            target_person_id: person_id,
            target_role: role
        })

        if (error) throw error
    }
}
