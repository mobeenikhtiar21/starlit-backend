import { Injectable, OnModuleInit } from '@nestjs/common';
import { createSupabaseClient } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Stripe } from 'stripe';
import { CreateDonationDto } from 'src/types';

@Injectable()
export class DonationService implements OnModuleInit {
  private supabase = createSupabaseClient();
  private stripe: Stripe;
  private table = 'donations';

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-06-30.basil', // Specify a stable API version
    });
  }

  async onModuleInit() {
    console.log('DonationService initialized');
  }

  async createPaymentIntent(dto: CreateDonationDto) {
    try {
      const {
        amount,
        email,
        firstName,
        lastName,
        program,
        donationType,
        message,
      } = dto;

      if (!amount || !email || !firstName || !lastName || !program) {
        throw new Error('Missing required fields: ' + JSON.stringify(dto));
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Create Stripe customer
      const customer = await this.stripe.customers.create({
        email,
        name: `${firstName} ${lastName}`,
      });

      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(amount),
        currency: 'usd',
        customer: customer.id,
        metadata: {
          email,
          program,
          donationType,
          message: message || '',
        },
      };

      if (donationType === 'monthly') {
        paymentIntentParams.setup_future_usage = 'off_session';
      }

      const paymentIntent =
        await this.stripe.paymentIntents.create(paymentIntentParams);

      // Save donation record to Supabase
      const donation = {
        id: uuidv4(),
        amount: amount / 100,
        email,
        first_name: firstName,
        last_name: lastName,
        program,
        donation_type: donationType,
        message,
        payment_intent_id: paymentIntent.id,
        // payment_status: paymentIntent.status,
        date: new Date().toISOString(),
      };

      const { error, data } = await this.supabase
        .from(this.table)
        .insert([donation])
        .select();
      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(
          `Failed to save donation to Supabase: ${error.message}`,
        );
      }

      console.log('Donation saved to Supabase:', data);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Error in createPaymentIntent:', error);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  async handleWebhook(event: any) {
    try {
      console.log('Webhook received:', event.type);
      const paymentIntent = event.data?.object;
      if (event.type === 'payment_intent.succeeded') {
        const { error } = await this.supabase
          .from(this.table)
          .update({ payment_status: 'succeeded' })
          .eq('payment_intent_id', paymentIntent.id);
        if (error) {
          console.error('Supabase update error:', error);
          throw new Error(`Failed to update payment status: ${error.message}`);
        }
        console.log(
          'Payment status updated to succeeded for payment_intent_id:',
          paymentIntent.id,
        );
      }
      if (event.type === 'payment_intent.payment_failed') {
        const { error } = await this.supabase
          .from(this.table)
          .update({ payment_status: 'failed' })
          .eq('payment_intent_id', paymentIntent.id);
        if (error) {
          console.error('Supabase update error:', error);
          throw new Error(`Failed to update payment status: ${error.message}`);
        }
        console.log(
          'Payment status updated to failed for payment_intent_id:',
          paymentIntent.id,
        );
      }
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw new Error(`Webhook handling failed: ${error.message}`);
    }
  }
}
