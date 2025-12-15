import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('site_settings')
export class SiteSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, name: 'setting_key' })
  settingKey: string;

  @Column({ type: 'jsonb', name: 'setting_value' })
  settingValue: any;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
