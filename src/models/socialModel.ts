import { supabase } from '../lib/supabase'

export const socialModel = {
    /**
     * Get currated community social feed
     */
    async getSocialFeed() {
        const { data, error } = await supabase
            .from('social_posts')
            .select('*')
            .eq('is_featured', true)
            .order('published_at', { ascending: false })
            .limit(10)

        if (error) throw error
        return data
    },

    /**
     * Get partner associations
     */
    async getPartners() {
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .eq('is_displayed', true)
            .order('display_order', { ascending: true })

        if (error) throw error
        return data
    }
}
