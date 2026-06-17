import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://efinhnhkvnrtvupjglqw.supabase.co'
const supabaseAnonKey = 'sb_publishable_f8hpdVyDFikQiHHxLQYXgg_pF6Sp0RZ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)