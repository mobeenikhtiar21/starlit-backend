import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from '../types';
import { Request } from 'express';
import { Stripe } from 'stripe';

@Controller('donation')
export class DonationController {
  private stripe: Stripe;

  constructor(private readonly donationService: DonationService) {
    this.stripe =  new Stripe(process.env.STRIPE_SECRET_KEY!,{
        apiVersion: '2025-06-30.basil', // Specify a stable API version
      });
  }

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() dto: CreateDonationDto) {
    try {
      const result = await this.donationService.createPaymentIntent(dto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Req() req: Request) {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new HttpException(
        'Webhook secret not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret,
      );
      await this.donationService.handleWebhook(event);
      return { received: true };
    } catch (error) {
      console.error('Webhook verification error:', error);
      throw new HttpException(
        `Webhook error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
