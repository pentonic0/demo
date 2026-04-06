'use server';

import { supabaseAdmin } from "../lib/sbAdmin";
import { getSession, hashPassword } from "@/src/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return session;
}

// ----------------- ADMIN CREDENTIALS -----------------
export async function updateAdminCredentialsAction(data: { username: string, password?: string }) {
  const admin = await requireAdmin();
  
  const updateData: any = {
    username: data.username,
  };

  if (data.password) {
    updateData.password_hash = await hashPassword(data.password);
  }

  const { error } = await supabaseAdmin
    .from('admins')
    .update(updateData)
    .eq('id', admin.id);

  if (error) throw error;
  
  return { success: true };
}

// ----------------- SETTINGS -----------------
export async function updateSettingsAction(data: any) {
  await requireAdmin();
  // Map JS casing to DB snake_casing
  const dbData: any = {
    updated_at: new Date().toISOString(),
  };
  
  if (data.schoolName !== undefined) dbData.school_name = data.schoolName;
  if (data.schoolCode !== undefined) dbData.school_code = data.schoolCode;
  if (data.principalName !== undefined) dbData.principal_name = data.principalName;
  if (data.principalMessage !== undefined) dbData.principal_message = data.principalMessage;
  if (data.principalImage !== undefined) dbData.principal_image = data.principalImage;
  if (data.chairmanName !== undefined) dbData.chairman_name = data.chairmanName;
  if (data.chairmanMessage !== undefined) dbData.chairman_message = data.chairmanMessage;
  if (data.chairmanImage !== undefined) dbData.chairman_image = data.chairmanImage;
  if (data.contactEmail !== undefined) dbData.contact_email = data.contactEmail;
  if (data.contactPhone !== undefined) dbData.contact_phone = data.contactPhone;
  if (data.address !== undefined) dbData.address = data.address;
  if (data.establishedYear !== undefined) dbData.established_year = data.establishedYear;
  if (data.location !== undefined) dbData.location = data.location;
  if (data.googleMapsLink !== undefined) dbData.google_maps_link = data.googleMapsLink;
  if (data.facebookLink !== undefined) dbData.facebook_link = data.facebookLink;
  if (data.twitterLink !== undefined) dbData.twitter_link = data.twitterLink;
  if (data.youtubeLink !== undefined) dbData.youtube_link = data.youtubeLink;
  if (data.instagramLink !== undefined) dbData.instagram_link = data.instagramLink;
  if (data.linkedinLink !== undefined) dbData.linkedin_link = data.linkedinLink;
  if (data.schoolLogo !== undefined) dbData.school_logo = data.schoolLogo;
  if (data.maintenanceMode !== undefined) dbData.maintenance_mode = data.maintenanceMode;
  if (data.showLatestUpdate !== undefined) dbData.show_latest_update = data.showLatestUpdate;
  if (data.latestUpdates !== undefined) dbData.latest_updates = data.latestUpdates;
  if (data.showPopupBanner !== undefined) dbData.show_popup_banner = data.showPopupBanner;
  if (data.popupBannerImage !== undefined) dbData.popup_banner_image = data.popupBannerImage;
  if (data.popupBannerLink !== undefined) dbData.popup_banner_link = data.popupBannerLink;
  if (data.popupBannerId !== undefined) dbData.popup_banner_id = data.popupBannerId;
  if (data.academicSubjects !== undefined) dbData.academic_subjects = data.academicSubjects;
  if (data.academicRoutineUrl !== undefined) dbData.academic_routine_url = data.academicRoutineUrl;
  const { error } = await supabaseAdmin.from('settings').update(dbData).eq('id', 'main');
  if (error) throw error;
  return { success: true };
}

// ----------------- NOTICES -----------------
export async function createNoticeAction(data: any) {
  const admin = await requireAdmin();
  const insertData: any = {
    title: data.title,
    date: new Date(data.date).toISOString(),
    content: data.content,
    file_url: data.fileUrl,
  };

  // Only link author_id if it's not the fallback dummy ID
  if (admin.id !== '00000000-0000-0000-0000-000000000000') {
    insertData.author_id = admin.id;
  }

  const { error } = await supabaseAdmin.from('notices').insert(insertData);
  if (error) throw error;
  return { success: true };
}

export async function updateNoticeAction(id: string, data: any) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from('notices').update({
    title: data.title,
    date: new Date(data.date).toISOString(),
    content: data.content,
    file_url: data.fileUrl,
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) throw error;
  return { success: true };
}

export async function deleteNoticeAction(id: string) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from('notices').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

// ----------------- TEACHERS -----------------
export async function createTeacherAction(data: any) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from('teachers').insert({
    name: data.name,
    designation: data.designation,
    department: data.department,
    qualification: data.qualification,
    experience: data.experience,
    email: data.email,
    phone: data.phone,
    image: data.image,
    display_order: parseInt(data.order) || 0,
    facebook_link: data.facebookLink,
    about: data.about
  });
  if (error) throw error;
  return { success: true };
}

export async function updateTeacherAction(id: string, data: any) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from('teachers').update({
    name: data.name,
    designation: data.designation,
    department: data.department,
    qualification: data.qualification,
    experience: data.experience,
    email: data.email,
    phone: data.phone,
    image: data.image,
    display_order: parseInt(data.order) || 0,
    facebook_link: data.facebookLink,
    about: data.about
  }).eq('id', id);
  if (error) throw error;
  return { success: true };
}

export async function deleteTeacherAction(id: string) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from('teachers').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

// ----------------- GENERIC CRUD -----------------
// For simplicity, a generic insert/update/delete for simple tables
export async function createGenericAction(table: string, dbData: any) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from(table).insert(dbData);
  if (error) throw error;
  return { success: true };
}

export async function updateGenericAction(table: string, id: string, dbData: any) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from(table).update(dbData).eq('id', id);
  if (error) throw error;
  return { success: true };
}

export async function deleteGenericAction(table: string, id: string) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

// ----------------- MESSAGES -----------------
export async function getMessagesAction() {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}
