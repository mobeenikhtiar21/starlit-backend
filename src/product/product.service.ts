import { Injectable } from '@nestjs/common';
import { createSupabaseClient } from '../supabaseClient';
import 'dotenv/config';
import { Product } from 'src/types';

@Injectable()
export class ProductService {
  private supabase = createSupabaseClient();

  async getAllProducts() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async createProduct(product: Product): Promise<Product>  {
    const { data, error } = await this.supabase
      .from('products')
      .insert([product])
      .select();
    if (error) {
      console.error('Supabase Insert Error:', error);
      throw new Error(error.message || JSON.stringify(error));
    }
    return data[0];
  }
}

