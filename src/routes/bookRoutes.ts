import Router from "koa-router";
import { AppDataSource } from "../data-sources/app-data-source";
import { Book } from "../entity/Book";

const bookRouter = new Router();

bookRouter.post("/book", async (ctx) => {
	await AppDataSource.transaction(async (transactionalEntityManager) => {
		console.log("newBook");
		const { title, author, content } = ctx.request.body as { title: string; author: string; content: { pageNumber: number; pageContent: string }[] };
		const bookRepository = transactionalEntityManager.getRepository(Book);
		// წიგნის სათაურის განმეორება დასაშვებია, ერთმა ავტორმაც შეიძლება რამდენიმე წიგნი დაწეროს, ამიტომ ორივეს მათგანის დამთხვევას ვამოწმებ ვალიდაციისთვის
		const existingBook = await bookRepository.findOneBy({ title, author });
		if (existingBook) {
			ctx.status = 400;
			ctx.body = { message: "წიგნი უკვე არსებობს სისტემაში" };
			return;
		}

		const newBook = bookRepository.create({
			title,
			author,
			content: content,
			last_page_read: {},
			created_at: new Date(),
			updated_at: new Date(),
		});
		console.log(newBook);
		await bookRepository.save(newBook);

		ctx.status = 201;
		ctx.body = { message: "წიგნი წარმატებით დაემატა სისტემაში", book: newBook };
	}).catch(() => {
		ctx.status = 500;
		ctx.body = { message: "სერვერზე დაფიქსირდა შეცდომა, გთხოვთ სცადოთ მოგვიანებით" };
	});
});

bookRouter.get("/books", async (ctx) => {
	try {
		const bookRepository = AppDataSource.getRepository(Book);
		let books;
		if (ctx.query.pages === "true") {
			books = await bookRepository.find();
		} else {
			books = await bookRepository.find({
				select: ["id", "title", "author", "created_at"],
			});
		}

		ctx.status = 200;
		ctx.body = {
			message: "success",
			data: books.map((book) => ({
				id: book.id,
				title: book.title,
				author: book.author,
				content: ctx.query.pages === "true" ? book.content : undefined,
				last_page_read: ctx.query.pages === "true" ? book.last_page_read : undefined,
				created_at: book.created_at,
			})),
		};
	} catch (error) {
		ctx.status = 500;
		ctx.body = { message: "სერვერზე დაფიქსირდა შეცდომა, გთხოვთ სცადოთ მოგვიანებით" };
	}
});

bookRouter.get("/book/:id", async (ctx) => {
	await AppDataSource.transaction(async (transactionalEntityManager) => {
		const bookId = parseInt(ctx.params.id);
		const userId = ctx.state.user.id;

		const bookRepository = transactionalEntityManager.getRepository(Book);
		const book = await bookRepository.findOneBy({ id: bookId });
		if (!book) {
			ctx.status = 404;
			ctx.body = { message: "წიგნი არ მოიძებნა" };
			return;
		}

		// მოკლედ, მინდოდა ერთ როუტზე ყოფილიყო უნივერსალური specific book retrieve. მაქვს 3 option
		// 1. თუ query "page" არ არსებობს ამ request-ში, ვაბრუნებ მთლიან წიგნს (ყველა გვერდს). მაგ: http://localhost:3000/book/1
		// 2. თუ query "page"-ში მოცემულია ნებისმიერი რიცხვი, ვაბრუნებ შესაბამის გვერდს და ვანახლებ მოცემული მომხმარებლის მიერ ბოლოს წაკითხულ გვერდს ბაზაში  მაგ: http://localhost:3000/book/1?page=3
		// 3. თუ query "page" უდრი "last_page_read", ვნახულობ ბაზაში არსებულ მონაცემს, და ვაბრუნებ იმ გვერდს, რომელსაც მოცემული მომხმარებელი კითხულობდა ბოლოს  მაგ: http://localhost:3000/book/1?page=last_page_read
		let pageContent;
		let lastPageRead = book.last_page_read[userId] || 1;

		const pageQuery = Array.isArray(ctx.query.page) ? ctx.query.page[0] : ctx.query.page;
		const parsedPageQuery = pageQuery && !isNaN(parseInt(pageQuery)) ? parseInt(pageQuery) : pageQuery;

		if (parsedPageQuery === "last_page_read") {
			pageContent = book.content.find((p) => p.pageNumber === lastPageRead);
		} else if (typeof parsedPageQuery === "number") {
			lastPageRead = parsedPageQuery;
			pageContent = book.content.find((p) => p.pageNumber === lastPageRead);
		} else {
			pageContent = book.content;
		}

		book.last_page_read[userId] = lastPageRead; // აქ ვანახლებ ბოლოს წაკითხულ გვერდს მოცემული მომხმარებლისთვის
		await bookRepository.save(book);

		ctx.status = 200;
		ctx.body = {
			message: "წარმატება",
			data: {
				id: book.id,
				title: book.title,
				author: book.author,
				content: pageContent,
				last_page_read: lastPageRead,
				created_at: book.created_at,
			},
		};
	}).catch(() => {
		ctx.status = 500;
		ctx.body = { message: "სერვერზე დაფიქსირდა შეცდომა, გთხოვთ სცადოთ მოგვიანებით" };
	});
});

bookRouter.put("/book/:bookId", async (ctx) => {
	await AppDataSource.transaction(async (transactionalEntityManager) => {
		const { title, author, content } = ctx.request.body as { title: string; author: string; content: { pageNumber: number; pageContent: string }[] };
		const bookId = parseInt(ctx.params.bookId);

		const bookRepository = transactionalEntityManager.getRepository(Book);
		let bookToUpdate = await bookRepository.findOneBy({ id: bookId });

		if (!bookToUpdate) {
			ctx.status = 404;
			ctx.body = { message: "Book not found" };
			return;
		}

		bookToUpdate.title = title;
		bookToUpdate.author = author;
		bookToUpdate.content = content;
		await bookRepository.save(bookToUpdate);

		ctx.status = 200;
		ctx.body = { message: "წიგნი წარმატებით განახლდა" };
	}).catch(() => {
		ctx.status = 500;
		ctx.body = { message: "სერვერზე დაფიქსირდა შეცდომა, გთხოვთ სცადოთ მოგვიანებით" };
	});
});

bookRouter.delete("/book/:id", async (ctx) => {
	await AppDataSource.transaction(async (transactionalEntityManager) => {
		const bookId = parseInt(ctx.params.id);
		const bookRepository = transactionalEntityManager.getRepository(Book);
		const bookToDelete = await bookRepository.findOneBy({ id: bookId });

		if (!bookToDelete) {
			ctx.status = 404;
			ctx.body = { message: "წიგნი არ მოიძებნა" };
			return;
		}

		await bookRepository.remove(bookToDelete);

		ctx.status = 200;
		ctx.body = { message: "წიგნი წარმატებით წაიშალა" };
	}).catch(() => {
		ctx.status = 500;
		ctx.body = { message: "სერვერზე დაფიქსირდა შეცდომა, გთხოვთ სცადოთ მოგვიანებით" };
	});
});

export default bookRouter;
