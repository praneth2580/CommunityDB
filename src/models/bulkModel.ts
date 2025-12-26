import { supabase } from '../lib/supabase'
import type { PersonData } from './peopleModel'
import type { EventData } from './eventsModel'

export const bulkModel = {
    /**
     * Upsert or Insert multiple people records based on phone number
     */
    async bulkUpsertPeople(people: Partial<PersonData>[], allowUpdate = true) {
        let query = supabase.from('people')

        if (allowUpdate) {
            return await query.upsert(people, { onConflict: 'phone' }).select()
        } else {
            return await query.insert(people).select()
        }
    },

    /**
     * Create or Update multiple events
     */
    async bulkCreateEvents(events: Partial<EventData>[], allowUpdate = true) {
        let query = supabase.from('events')

        if (allowUpdate) {
            return await query.upsert(events, { onConflict: 'id' }).select()
        } else {
            return await query.insert(events).select()
        }
    },

    /**
     * Bulk register attendance
     */
    async bulkRecordAttendance(attendance: { event_id: string; person_id: string; role?: string; status: string }[], allowUpdate = true) {
        let query = supabase.from('event_participants')

        if (allowUpdate) {
            return await query.upsert(attendance, { onConflict: 'event_id,person_id' }).select()
        } else {
            return await query.insert(attendance).select()
        }
    },

    /**
     * Bulk update or create admin roles
     * PROTECTION: Cannot assign super_admin role or update existing super_admins
     */
    async bulkUpsertAdmins(admins: { user_id: string; role: 'super_admin' | 'admin' | 'volunteer' }[], allowUpdate = true) {
        // 1. FILTER: Never allow assigning super_admin role via bulk
        const safeAdmins = admins.filter(a => a.role !== 'super_admin')

        if (safeAdmins.length === 0) return []

        // 2. PROTECTION: If updating, skip any users who are already super_admins
        if (allowUpdate) {
            const { data: currentSuperAdmins } = await supabase
                .from('admins')
                .select('user_id')
                .eq('role', 'super_admin')

            const superAdminIds = new Set(currentSuperAdmins?.map(sa => sa.user_id) || [])
            const finalSafeAdmins = safeAdmins.filter(a => !superAdminIds.has(a.user_id))

            if (finalSafeAdmins.length === 0) return []

            return await supabase
                .from('admins')
                .upsert(finalSafeAdmins, { onConflict: 'user_id' })
                .select()
        }

        return await supabase.from('admins').insert(safeAdmins).select()
    }
}

