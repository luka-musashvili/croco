import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Book {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "varchar", length: 255 })
	title!: string;

	@Column({ type: "varchar", length: 255 })
	author!: string;

	@Column("jsonb")
	content!: { pageNumber: number; pageContent: string }[];

	@Column("jsonb", { default: {} })
	last_page_read!: Record<number, number>;

	@CreateDateColumn({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
	updated_at!: Date;
}
