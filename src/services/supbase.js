import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hxyqwmyyudqtqdzizfmb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eq88AWmSIZoLBV01jv0k5g_0jYR6GIX';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// دالة حساب فترات صلاحية المستندات والإقامات
export const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) return { label: 'غير محدد', color: 'gray', days: null };
  const today = new Date();
  const exp = new Date(expiryDate);
  const diffTime = exp - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { label: 'منتهي', color: 'red', days: diffDays };
  if (diffDays <= 30) return { label: `ينتهي خلال ${diffDays} يوم`, color: 'orange', days: diffDays };
  return { label: 'ساري', color: 'green', days: diffDays };
};