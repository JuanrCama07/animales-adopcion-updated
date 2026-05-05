import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    this.isConfigured = Boolean(cloudName && apiKey && apiSecret);

    if (this.isConfigured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    }
  }

  async uploadBuffer(
    buffer: Buffer,
    folder = 'animales-adopcion',
  ): Promise<string> {
    if (!this.isConfigured) {
      throw new InternalServerErrorException(
        'Faltan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en .env',
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return reject(
              new BadGatewayException(
                `Cloudinary rechazo la imagen: ${error.message}`,
              ),
            );
          }

          if (!result?.secure_url) {
            return reject(
              new BadGatewayException('Cloudinary no devolvio secure_url'),
            );
          }

          return resolve(result.secure_url);
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }
}
