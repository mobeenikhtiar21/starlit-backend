import { Injectable } from '@nestjs/common';
import { Donation } from '../types';
import { createSupabaseClient } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DonationService {
  private supabase = createSupabaseClient();
  private table = 'donations';

  async createDonation(donation: Omit<Donation, 'id' | 'date'>): Promise<Donation> {
    const newDonation = {
      ...donation,
      id: uuidv4(),
      date: new Date().toISOString(),
    };
    const { data, error } = await this.supabase
      .from(this.table)
      .insert([newDonation])
      .select();
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }

  async getAllDonations(): Promise<Donation[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
