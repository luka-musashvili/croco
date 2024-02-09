import "dotenv/config";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { AppDataSource } from "./data-sources/app-data-source";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import { authMiddleware } from "./middleware/auth";
import { koaSwagger } from "koa2-swagger-ui";
import swaggerOptions from "./swagger";
import swaggerJsdoc from "swagger-jsdoc";

// აპლიკაციის გაშვებამდე მინდა typeorm-ის ინიციალიზაცია მოხდეს.
AppDataSource.initialize()
	.then(async () => {
		const app = new Koa();

		const swaggerSpec = swaggerJsdoc(swaggerOptions) as Record<string, unknown>; // სვაგერის კონფიგი

		app.use(cors()); // Cross-origin მონაცემთა მიმოცვლისთვის
		app.use(
			koaSwagger({
				routePrefix: "/swagger",
				swaggerOptions: { spec: swaggerSpec },
			})
		);
		app.use(bodyParser()); // ენდფოინთებზე მომხმარებელთა მიერ მოწოდებული მონაცემების მისაღებად
		app.use(async (ctx, next) => {
			// აუთენთიკაციის ენდფოინთმა მინდა იმუშაოს მხოლოდ რელევანტურ როუტერებზე, ვფიქრობ ამ 4 ენდფოითზე ღია უნდა იყოს წვდომა
			if (ctx.path !== "/registration" && ctx.path !== "/login" && ctx.path !== "/users" && ctx.path !== "/") {
				await authMiddleware(ctx, next);
			} else {
				await next();
			}
		});

		app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
		app.use(bookRoutes.routes()).use(bookRoutes.allowedMethods());

		app.use(async (ctx) => {
			if (ctx.path === "/") {
				ctx.status = 302;
				ctx.redirect("/swagger"); // ამჟამად მთელი აპლიკაცია მხოლოდ swagger-ის ფუნქციონალს შეადგენს
			}
		});

		app.listen(3000, () => {
			console.log("Server running on http://localhost:3000");
		});
	})
	.catch((error) => console.error("TypeORM connection error: ", error));
