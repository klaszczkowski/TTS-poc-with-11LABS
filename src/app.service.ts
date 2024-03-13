import { Injectable } from '@nestjs/common';

const fs = require('fs');
const https = require('https');

const filePath = './test2.txt';
const content = 'Test';
const util = require('util');
import { ConfigService } from '@nestjs/config';

import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) { }

  geApiAddress(): string {
    return this.configService.get('LABSAPI');
  }
  getHello(): string {
    return 'Hello World!';
  }
  async getRecording(): Promise<any[]> {
    await fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`Plik ${filePath} został utworzony!`);
    });

    return [{
      name: "dummy"
    }]
  }
  async makeRecording(): Promise<string> {
    const CHUNK_SIZE = 1024;
    const url = this.geApiAddress();

    const headers = {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": process.env["xi-api-key"]
    };

    const data = {
      "text": `do przetłumaczenia`,
      "model_id": "eleven_monolingual_v1",
      "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.5
      }
    };

    const request = await https.request(url, {
      method: 'POST',
      headers,
      rejectUnauthorized: false
    }, async (response) => {
      console.log(`Status: ${response.statusCode}`);
      console.log(`Headers: ${JSON.stringify(response.headers)}`);
      const outputFile = await fs.createWriteStream('output-node4.mp3');
      await response.on('data', (chunk) => outputFile.write(chunk));
      await response.on('end', async () => {
        await console.log('Speech audio successfully downloaded to output.mp3');
        await outputFile.close();
      });
    });

    request.on('error', (error) => {
      console.error(error);
    });

    await request.write(JSON.stringify(data));
    return request.end()
  }
}
