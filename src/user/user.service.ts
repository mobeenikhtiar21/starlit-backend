import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private supabase: SupabaseClient;
  private table = 'users';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    if (!supabaseUrl || !supabaseKey) {
      console.error(
        'Supabase URL or Key is missing. Please check your environment variables.',
      );
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async createUser(user: User): Promise<User> {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert([user])
      .select()
      .single();
    if (error) {
      console.error('Error creating user:', error);
      throw new Error(error.message);
    }

    return data;
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await this.supabase.from(this.table).select('*');
    if (error) {
      console.error('Error fetching all users:', error);
      throw new Error(error.message);
    }
    return data;
  }

  async getUserById(id: string): Promise<User> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error(`Error fetching user by id (${id}):`, error);
      throw new Error(error.message);
    }
    return data;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(user)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error(`Error updating user (${id}):`, error);
      throw new Error(error.message);
    }
    return data;
  }

  async deleteUser(id: string): Promise<{ id: string }> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`Error deleting user (${id}):`, error);
      throw new Error(error.message);
    }
    return { id };
  }
}
