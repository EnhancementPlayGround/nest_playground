import { AfterLoad, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DomainEvent {
  @PrimaryGeneratedColumn()
  private id!: number;

  @Column()
  type!: string;

  @Column()
  private occurredAt: Date;

  @Column({ type: 'text' })
  private data!: string;

  constructor() {
    this.type = this.constructor.name;
    this.occurredAt = new Date();
  }

  @BeforeInsert()
  private serialize() {
    const { id: _, type: __, occurredAt: ___, data: ____, ...props } = this;
    this.data = JSON.stringify(props);
  }

  @AfterLoad()
  private deserialize() {
    const props = JSON.parse(this.data);
    Object.assign(this, props);
  }
}
