import { MigrationInterface, QueryRunner } from 'typeorm';

export class Time1703295509011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `user` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `product` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `version` int NOT NULL DEFAULT "1", `id` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `price` int NOT NULL, `stock` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `account` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id` varchar(255) NOT NULL, `userId` varchar(255) NOT NULL, `balance` int NOT NULL, INDEX `Idx_userId` (`userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `order` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id` varchar(255) NOT NULL, `userId` varchar(255) NOT NULL, `totalAmount` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `order_line` (`id` int NOT NULL AUTO_INCREMENT, `productId` varchar(255) NOT NULL, `price` int NOT NULL, `quantity` int NOT NULL, `orderId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `domain_event` (`id` int NOT NULL AUTO_INCREMENT, `type` varchar(255) NOT NULL, `occurredAt` datetime NOT NULL, `data` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `order_product_log` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `orderId` varchar(255) NOT NULL, `userId` varchar(255) NOT NULL, `productId` varchar(255) NOT NULL, `quantity` int NOT NULL, `price` int NOT NULL, `occurredAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;',
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` ADD CONSTRAINT `FK_order_line_to_order` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `order_line` DROP FOREIGN KEY `FK_order_line_to_order`;');
    await queryRunner.query('DROP TABLE `order_product_log`');
    await queryRunner.query('DROP TABLE `domain_event`');
    await queryRunner.query('DROP TABLE `order_line`');
    await queryRunner.query('DROP TABLE `order`');
    await queryRunner.query('DROP TABLE `account`');
    await queryRunner.query('DROP TABLE `product`');
    await queryRunner.query('DROP TABLE `user`');
  }
}
