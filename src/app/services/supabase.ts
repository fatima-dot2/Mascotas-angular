
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nmvbbnxforerhkncbvtr.supabase.co';
const supabaseKey = 'sb_publishable_CiPW9KCMq7ZlPqiijMjbaw_dAe4glKF';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
