
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient';
import * as bcrypt from 'bcryptjs';
import jwtDecode from 'jwt-decode';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'dev_secret';

@Injectable()
export class AuthService {
  async login(email: string, password: string): Promise<string | null> {
    // Query user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return null;

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return token;
  }

  async register(data: { name: string; email: string; password: string; role?: string }): Promise<string> {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ ...data, password: hashedPassword, role: data.role || 'donor' }])
      .select()
      .single();

    if (error || !user) {
      console.error('Supabase registration error:', error);
      throw new Error('Registration failed');
    }

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return token;
  }

  async getUser(email: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error || !user) return null;
    return user;
  }

  async logout() {
    // Optionally: redirect to login
  }
} 