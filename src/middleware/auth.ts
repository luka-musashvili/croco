import jwt from "jsonwebtoken";
import { Context, Next } from "koa";

export const authMiddleware = async (ctx: Context, next: Next) => {
	try {
		const authHeader = ctx.headers.authorization;
		if (!authHeader) {
			ctx.status = 401;
			ctx.body = { message: "ტოკენი არ არის მოწოდებული" };
			return;
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			ctx.status = 401;
			ctx.body = { message: "ტოკენი არ არის მოწოდებული" };
			return;
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		ctx.state.user = decoded; // ctx.state.user-ზე წვდომა ექნება ყველა დანარჩენ ctx-ს, რომელიც ამ მიდლვეარს გამოიყენებს, და რადგან jwt token user.id-ისა და user.email-ის დახმარებით შევქმენი, ახლა მათი decode და წაკითხვა შემიძლია

		await next();
	} catch (error) {
		ctx.status = 401;
		ctx.body = { message: "არასწორი ან ვადაგასული ტოკენი" };
	}
};
