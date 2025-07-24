import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AppService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getTestTableData(): Promise<any> {
    const { data, error } = await this.supabase.from('test_table').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
