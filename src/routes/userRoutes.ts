import Router from "koa-router";
import { validateEmail, validatePasswordStrength, validatePasswordSimilarity } from "../validators/userValidators";
import { AppDataSource } from "../data-sources/app-data-source";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";

const userRouter = new Router();

userRouter.post("/registration", async (ctx) => {
	await AppDataSource.transaction(async (transactionalEntityManager) => {
		const { email, password } = ctx.request.body as { email: string; password: string };

		if (!validateEmail(email)) {
			ctx.status = 400;
			ctx.body = { message: "არასწორი მეილის ფორმატი, გთხოვთ დარეგისტრირდეთ ვალიდური მეილით" };
			return;
		}

		if (!validatePasswordStrength(password)) {
			ctx.status = 400;
			ctx.body = { message: "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, 1 რიცხვს, 1 დიდ და ერთ პატარა ასოს" };
			return;
		}

		if (!validatePasswordSimilarity(password, email)) {
			ctx.status = 400;
			ctx.body = { message: "პაროლი მეილის მსგავსია, გთხოვთ შეარჩიოთ უფრო რთული პაროლი უსაფრთხოების მიზნით" };
			return;
		}

		const userRepository = transactionalEntityManager.getRepository(User);
		const existingUser = await userRepository.findOneBy({ email });

		if (existingUser) {
			ctx.status = 400;
			ctx.body = { message: "მომხმარებელი ამ მეილით უკვე არსებობს" };
			return;
		}

		const newUser = new User();
		newUser.email = email;
		newUser.password = password;
		await newUser.hashPassword(); // entity-ში ვჰეშავ, scalability-ისთვის იქ ვამჯობინე ამეწყო
		await userRepository.save(newUser);

		ctx.status = 201;
		ctx.body = { message: "მომხმარებელი წარმატებით შეიქმნა" };
	}).catch(() => {
		ctx.status = 500;
		ctx.body = { message: "სერვერზე დაფიქსირდა შეცდომა, გთხოვთ სცადოთ მოგვიანებით" }; // error-ს არ ვუბრუნებ, რამე სენსიტიური რომ არ გაიპაროს
	});
});

userRouter.post("/login", async (ctx) => {
	await AppDataSource.transaction(async (transactionalEntityManager) => {
		const { email, password } = ctx.request.body as { email: string; password: string };

		const userRepository = transactionalEntityManager.getRepository(User);
		const user = await userRepository.findOneBy({ email });

		if (!user) {
			ctx.status = 404;
			ctx.body = { message: "მომხმარებელი ამ მეილით არ არსებობს" };
			return;
		}

		// entity-ში მაქვს ეს შემოწმებაც
		if (!(await user.checkIfUnencryptedPasswordIsValid(password))) {
			ctx.status = 401;
			ctx.body = { message: "პაროლი არასწორია" };
			return;
		}

		// ტოკენის ვადას ძირითადად UX-თან ვათანხმებ ხოლმე. jwt ტოკენიდან ჯერ-ჯერობით მხოლოდ მომხმარებლის ID გამომაქვს, თუმცა სამომავლოდ წესით email-იც საჭირო იქნება (შეტყობინებების სისტემა ან რამე მსგავსისთვის)
		const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });

		ctx.body = {
			message: "წარმატება",
			data: {
				id: user.id,
				email: user.email,
				token,
			},
		};
	}).catch(() => {
		ctx.status = 500;
		ctx.body = { message: "სერვერზე დაფიქსირდა შეცდომა, გთხოვთ სცადოთ მოგვიანებით" };
	});
});

userRouter.get("/users", async (ctx) => {
	// რეალურად იმდენად მარტივი როუტერია, არაა საჭირო ტრანზაქციად გატარება, თუმცა სამომავლოდ სხვა table-ის join მოგვიწევს ალბათ
	await AppDataSource.transaction(async (transactionalEntityManager) => {
		const userRepository = transactionalEntityManager.getRepository(User);
		const users = await userRepository.find({
			select: ["id", "email", "created_at"],
		});

		ctx.status = 200;
		ctx.body = {
			message: "წარმატება",
			data: users.map((user) => ({
				id: user.id,
				email: user.email,
				created_at: user.created_at,
			})),
		};
	}).catch(() => {
		ctx.status = 500;
		ctx.body = { message: "სერვერზე დაფიქსირდა შეცდომა, გთხოვთ სცადოთ მოგვიანებით" };
	});
});

userRouter.delete("/user/:id", async (ctx) => {
	await AppDataSource.transaction(async (transactionalEntityManager) => {
		const userId = parseInt(ctx.params.id); // ctx.params-ით წვდომა მაქვს დინამიურ route პარამეტრზე
		const userRepository = transactionalEntityManager.getRepository(User);
		const userToDelete = await userRepository.findOneBy({ id: userId });

		if (!userToDelete) {
			ctx.status = 404;
			ctx.body = { message: "მომხმარებელი არ მოიძებნა" };
			return;
		}

		await userRepository.remove(userToDelete);

		ctx.status = 200;
		ctx.body = { message: "მომხმარებლის მონაცემები წარმატებით წაიშალა" };
	}).catch(() => {
		ctx.status = 500;
		ctx.body = { message: "სერვერზე დაფიქსირდა შეცდომა, გთხოვთ სცადოთ მოგვიანებით" };
	});
});

export default userRouter;
