import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // origin: 'http://192.168.0.108:5173'
  app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://192.168.0.108:5173', // 👈 mobile device access
      'https://starlit-frontend.vercel.app', // Production frontend URL
      // allow all origins for production
      '*',
    ];

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

  // Other endpoints can still use JSON
  app.use(bodyParser.json());



  app.use('/donation/webhook', bodyParser.raw({ type: 'application/json' }));
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
}
bootstrap();
