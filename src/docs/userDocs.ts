/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: მომხმარებლის მეილი
 *         password:
 *           type: string
 *           description: მომხმარებლის პაროლი
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: მომხმარებლის მეილი
 *         password:
 *           type: string
 *           description: მომხმარებლის პაროლი
 *     UserResponse:
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
 *               description: მომხმარებლის ID
 *             email:
 *               type: string
 *               description: მომხმარებლის მეილი
 *             token:
 *               type: string
 *               description: მომხმარებლის JWT token
 *     UsersListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserResponse'
 *
 * /registration:
 *   post:
 *     summary: მომხმარებლის რეგისტრაცია
 *     tags: [მომხმარებლები]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *           examples:
 *             bookExample:
 *               summary: მომხმარებლის მაგალითი
 *               value:
 *                 email: "test@crocobet.com"
 *                 password: "SomethingStrong1"
 *     responses:
 *       201:
 *         description: მომხმარებელი წარმატებით შეიქმნა
 *       400:
 *         description: მომხმარებელი ამ მეილით უკვე არსებობს
 *
 * /login:
 *   post:
 *     summary: მომხმარებლის შესვლა
 *     tags: [მომხმარებლები]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *           examples:
 *             bookExample:
 *               summary: მომხმარებლის მაგალითი
 *               value:
 *                 email: "test@crocobet.com"
 *                 password: "SomethingStrong1"
 *     responses:
 *       200:
 *         description: წარმატება
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: პაროლი არასწორია
 *       404:
 *         description: მომხმარებელი ამ მეილით არ არსებობს
 *
 * /users:
 *   get:
 *     summary: მომხმარებთა სია
 *     tags: [მომხმარებლები]
 *     responses:
 *       200:
 *         description: მომხმარებელთა სია
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *
 * /user/{id}:
 *   delete:
 *     summary: მომხმარებლის წაშლა
 *     tags: [მომხმარებლები]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: მომხმარებლის ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: მომხმარებლის მონაცემები წარმატებით წაიშალა
 *       404:
 *         description: მომხმარებელი არ მოიძებნა
 */
