/**
 * @swagger
 * components:
 *   schemas:
 *     PageContent:
 *       type: object
 *       required:
 *         - pageNumber
 *         - pageContent
 *       properties:
 *         pageNumber:
 *           type: integer
 *           description: გვერდის ნომერი
 *         pageContent:
 *           type: string
 *           description: ამ გვერდის ტექსტი
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: წიგნის სათაური
 *         author:
 *           type: string
 *           description: წიგნის ავტორი
 *         content:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PageContent'
 *           description: წიგნის კონტენტი (გვერდებად დახლეჩილი)
 *     BookResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: წიგნის ID
 *             title:
 *               type: string
 *               description: წიგნის სათაური
 *             author:
 *               type: string
 *               description: წიგნის ავტორი
 *             content:
 *               type: array
 *               items:
 *                 type: string
 *               description: წიგნის კონტენტი (გვერდებად დახლეჩილი)
 *             last_page_read:
 *               type: integer
 *               description: მომხმარებლის მიერ ბოლოს წაკითხული გვერდი
 *             created_at:
 *               type: string
 *               format: date-time
 *               description: სისტემაში წიგნის დამატების თარიღი
 *     BooksListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /book:
 *   post:
 *     summary: შექმენი ახალი წიგნი
 *     tags: [წიგნები]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *           examples:
 *             bookExample:
 *               summary: წიგნის მაგალითი
 *               value:
 *                 title: "სათაური"
 *                 author: "ავტორი"
 *                 content:
 *                   - pageNumber: 1
 *                     pageContent: "პირველი გვერდი"
 *                   - pageNumber: 2
 *                     pageContent: "მეორე გვერდი"
 *     responses:
 *       201:
 *         description: წიგნი წარმატებით დაემატა სისტემაში
 *       400:
 *         description: წიგნი უკვე არსებობს
 *
 * /books:
 *   get:
 *     summary: ყველა წიგნის მიღება
 *     tags: [წიგნები]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pages
 *         required: false
 *         schema:
 *           type: string
 *         description: როცა pages=true, მიიღებთ წიგნებს თავისი ყველა გვერდით
 *     responses:
 *       200:
 *         description: წიგნების სია. როცა pages=true, მიიღებთ წიგნებს თავისი ყველა გვერდით
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BooksListResponse'
 *
 * /book/{id}:
 *   get:
 *     summary: კონკრეტული წიგნის მიღება
 *     tags: [წიგნები]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: წიგნის ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: გვერდის ნომერი (რიცხვი) ან მომხმარებლის მიერ ბოლოს წაკითხული გვერდი (last_page_read). თუ ამ query-ის არ დაურთავთ request-ს, მიიღებთ მთლიან წიგნს
 *     responses:
 *       200:
 *         description: კონკრეტული წიგნი
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookResponse'
 *       404:
 *         description: წიგნი ვერ მოიძებნა
 *   put:
 *     summary: კონკრეტული წიგნის მონაცემების განახლება
 *     tags: [წიგნები]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: განსანახლებელი წიგნის ID
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: წიგნი წარმატებით განახლდა
 *       404:
 *         description: წიგნი ვერ მოიძებნა
 *   delete:
 *     summary: წიგნის წაშლა
 *     tags: [წიგნები]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: წიგნის ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: წიგნი წარმატებით წაიშალა
 *       404:
 *         description: წიგნი არ მოიძებნა
 */
