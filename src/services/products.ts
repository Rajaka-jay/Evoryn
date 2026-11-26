import { supabase } from '@/lib/supabase';

export type ProductCategory = 'gemstone' | 'jewellery';
export interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;
  price_lkr: number;
  price_usd: number;
  stock_quantity: number;
  image_url: string;
  is_published: boolean;
  created_at?: string;
}
export type ProductInput = Omit<StoreProduct, 'id' | 'created_at'>;
const columns = 'id,slug,name,description,category,price_lkr,price_usd,stock_quantity,image_url,is_published,created_at';

export async function listProducts(admin = false): Promise<StoreProduct[]> {
  if (!supabase) return [];
  let query = supabase.from('products').select(columns).order('created_at', { ascending: false });
  if (!admin) query = query.eq('is_published', true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as StoreProduct[];
}

export async function saveProduct(input: ProductInput, id?: string): Promise<void> {
  if (!supabase) throw new Error('Connect Supabase before managing products.');
  const result = id
    ? await supabase.from('products').update(input).eq('id', id)
    : await supabase.from('products').insert(input);
  if (result.error) throw result.error;
}

export async function removeProduct(id: string): Promise<void> {
  if (!supabase) throw new Error('Connect Supabase before managing products.');
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
