const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "croco წიგნები",
			version: "1.0.0",
			description: "დოკუმენტაცია croco წიგნები დავალებისთვის",
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "ლოკალური სერვერი",
			},
			{
				url: "https://c41f-149-3-40-100.ngrok-free.app",
				description: "ngrok სერვერი",
			},
		],
	},
	apis: ["./src/docs/*.ts"],
};

export default swaggerOptions;
