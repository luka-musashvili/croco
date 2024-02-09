import { DataSource } from "typeorm";
import { Book } from "../entity/Book";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "5432", 10),
	username: process.env.DB_USER || "postgres",
	password: process.env.DB_PASSWORD || "12321",
	database: process.env.DB_NAME || "postgres",
	synchronize: true,
	logging: false,
	entities: [User, Book], //თავიდან ვიფიქრე lastReadPage ცალკე შემექმნა და რელაციური კავშირებით გამემართა User და Book tableებთან, თუმცა წიგნის სტრუქტურაში უნდა ყოფილიყო ეს მონაცემი დავალების აღწერილობიდან გამომდინარე
	subscribers: [],
	migrations: [],
});
