import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as os from 'os';

async function bootstrap() {
    console.log('Starting application...');

    const app = await NestFactory.create(AppModule);
    console.log('Nest application created successfully.');

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    console.log('CORS enabled with the following configuration:');
    console.log({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());
    console.log('ValidationPipe applied globally.');

    await app.listen(3000, '0.0.0.0');

    const interfaces = os.networkInterfaces();
    let ipAddress = 'localhost';
    for (const iface of Object.values(interfaces)) {
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                ipAddress = alias.address;
            }
        }
    }

    console.log(`Application is running on: http://${ipAddress}:3000`);
}
bootstrap();
