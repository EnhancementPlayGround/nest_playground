import { MigrationInterface, QueryRunner } from 'typeorm';

export class Time1703596876346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `order` ADD `deletedAt` datetime(6) NULL;');
    await queryRunner.query('ALTER TABLE `order_line` ADD `deletedAt` datetime(6) NULL;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `order` DROP `deletedAt`;');
    await queryRunner.query('ALTER TABLE `order_line` DROP `deletedAt`;');
  }
}
