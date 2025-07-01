import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owrzeuwyksdlbbfqjuen.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93cnpldXd5a3NkbGJiZnFqdWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzY2MDAsImV4cCI6MjA2NTIxMjYwMH0.tPVPbXMh181afeqw6O8R4LREMn4W2eeWRbaT2vpfvU4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 