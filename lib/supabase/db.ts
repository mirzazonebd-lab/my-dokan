import { supabaseAdmin } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';

// PRODUCTS
export async function getProductsFromDB() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createProductInDB(product: any) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert([product])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProductInDB(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProductInDB(id: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// CATEGORIES
export async function getCategoriesFromDB() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createCategoryInDB(category: any) {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert([category])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCategoryInDB(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCategoryInDB(id: string) {
  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// BRANDS
export async function getBrandsFromDB() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('featured', { ascending: false })
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createBrandInDB(brand: any) {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .insert([brand])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateBrandInDB(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteBrandInDB(id: string) {
  const { error } = await supabaseAdmin
    .from('brands')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// COUPONS
export async function getCouponsFromDB() {
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getActiveCouponsFromDB() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createCouponInDB(coupon: any) {
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .insert([coupon])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCouponInDB(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCouponInDB(id: string) {
  const { error } = await supabaseAdmin
    .from('coupons')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// SETTINGS
export async function getSettingFromDB(key: string) {
  const { data, error } = await supabase
    .from('settings')
    .select('setting_value')
    .eq('setting_key', key)
    .single();
  
  if (error) return null;
  return data?.setting_value;
}

export async function getAllSettingsFromDB() {
  const { data, error } = await supabase
    .from('settings')
    .select('*');
  
  if (error) throw error;
  return data || [];
}

export async function updateSettingInDB(key: string, value: any, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('settings')
    .upsert(
      {
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      },
      { onConflict: 'setting_key' }
    )
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
