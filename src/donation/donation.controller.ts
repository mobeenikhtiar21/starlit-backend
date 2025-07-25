import { Controller, Post, Get, Body } from '@nestjs/common';
import { DonationService } from './donation.service';
import { Donation } from '../types';

class CreateDonationDto {
  amount: number;
  yourImpact?: string;
  paymentMethod: 'paypal' | 'card';
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  cardholderName?: string;
  firstName: string;
  lastName: string;
  email: string;
  message?: string;
}

@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  async createDonation(@Body() dto: CreateDonationDto): Promise<Donation> {
    return this.donationService.createDonation(dto);
  }

  @Get()
  async getAllDonations(): Promise<Donation[]> {
    return this.donationService.getAllDonations();
  }
}
