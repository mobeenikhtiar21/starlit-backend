import { SupabaseAuthGuard } from './supabase-auth.guard';
import { ConfigService } from '@nestjs/config';

describe('SupabaseAuthGuard', () => {
  it('should be defined', () => {
    const mockConfigService = {} as ConfigService;
    expect(new SupabaseAuthGuard(mockConfigService)).toBeDefined();
  });
});
