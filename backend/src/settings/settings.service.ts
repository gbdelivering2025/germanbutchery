import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from '../entities/site-setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SiteSetting)
    private settingsRepository: Repository<SiteSetting>,
  ) {}

  async findAll() {
    const settings = await this.settingsRepository.find();
    const settingsMap: Record<string, any> = {};
    settings.forEach((setting) => {
      settingsMap[setting.settingKey] = setting.settingValue;
    });
    return settingsMap;
  }

  async findOne(key: string) {
    const setting = await this.settingsRepository.findOne({
      where: { settingKey: key },
    });
    
    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
    
    return setting.settingValue;
  }

  async update(key: string, value: any) {
    let setting = await this.settingsRepository.findOne({
      where: { settingKey: key },
    });

    if (setting) {
      setting.settingValue = value;
      await this.settingsRepository.save(setting);
    } else {
      setting = this.settingsRepository.create({
        settingKey: key,
        settingValue: value,
      });
      await this.settingsRepository.save(setting);
    }

    return setting.settingValue;
  }
}
