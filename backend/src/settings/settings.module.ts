import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SiteSetting } from '../entities/site-setting.entity';
import { Banner } from '../entities/banner.entity';
import { Page } from '../entities/page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSetting, Banner, Page])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
