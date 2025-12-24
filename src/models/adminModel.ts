import { supabase } from "../lib/supabase"

export const adminModel = {
    async login(email: string, _password: string) {

        const { data, error } = await supabase
            .from('admins')
            .select('*, people (*)')
            .eq('people.email', email)
            .single()
        return { data, error }
    }
} 