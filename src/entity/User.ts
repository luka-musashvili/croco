import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import bcrypt from "bcrypt";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true, type: "varchar", length: 255 })
	email!: string;

	@Column({ type: "varchar", length: 255 })
	password!: string;

	@CreateDateColumn({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
	updated_at!: Date;

	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10); // best practice-ებიდან ავიღე სტანდარტულად 10 სიმბოლოიანი salt
	}

	isSuperAdmin(): boolean {
		return this.email === "admin@croco.com"; // სატესტოდ მინდოდა super user-ის შექმნა, სტანდარტულ მომხმარებლებს მონაცემების წაშლა რომ არ შეეძლოთ, მაგრამ მგონი ვერ ვასწრებ.
	}

	async checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
		return await bcrypt.compare(unencryptedPassword, this.password); // ტოკენის სტანდარტული ვალიდაცია
	}
}
