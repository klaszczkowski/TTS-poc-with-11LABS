import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/recording')
  getRecording(): Promise<any[]> {
    return this.appService.getRecording();
  }

  @Get('/makeRecording')
  makeRecording(): Promise<string> {
    return this.appService.makeRecording();
  }
}
