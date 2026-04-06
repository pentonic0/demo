import { supabaseAdmin } from '@/src/lib/sbAdmin';
import { hashPassword } from '@/src/lib/auth';

const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function ensureSettingsSeed() {
  const { error } = await supabaseAdmin
    .from('settings')
    .upsert({ id: 'main' }, { onConflict: 'id' });

  if (error) {
    throw error;
  }
}

export async function ensureAdminSeed() {
  try {
    await ensureSettingsSeed();
  } catch (error) {
    // Do not block admin login if only the optional settings bootstrap fails.
    console.warn('Settings seed skipped:', error);
  }

  if (!DEFAULT_ADMIN_USERNAME) {
    console.warn('ADMIN_USERNAME not set, skipping admin seed.');
    return null;
  }

  const { data: existingAdmin, error: lookupError } = await supabaseAdmin
    .from('admins')
    .select('id, username')
    .eq('username', DEFAULT_ADMIN_USERNAME)
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (existingAdmin) {
    return existingAdmin;
  }

  if (!DEFAULT_ADMIN_PASSWORD) {
    console.warn('ADMIN_PASSWORD not set, skipping admin creation.');
    return null;
  }
  const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
  const { data: insertedAdmin, error: insertError } = await supabaseAdmin
    .from('admins')
    .insert({
      username: DEFAULT_ADMIN_USERNAME,
      password_hash: passwordHash,
      role: 'admin',
    })
    .select('id, username')
    .single();

  if (insertError) {
    throw insertError;
  }

  return insertedAdmin;
}
