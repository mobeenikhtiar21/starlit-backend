import { Injectable } from '@nestjs/common';
import { createSupabaseClient } from '../supabaseClient';

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
}
