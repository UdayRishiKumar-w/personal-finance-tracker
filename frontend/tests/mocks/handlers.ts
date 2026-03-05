import { http, HttpResponse } from "msw";

export const handlers = [
	http.get("/api/me", () => {
		return HttpResponse.json({
			id: "123",
			firstName: "John",
			lastName: "Doe",
			role: "user",
			email: "john@example.com",
		});
	}),
	http.get("/api/transactions", () => {
		return HttpResponse.json([
			{
				id: "1",
				amount: 100,
				category: "Food",
				type: "expense",
			},
		]);
	}),

	http.post("/api/transactions", async ({ request }) => {
		const body = await request.json();
		return HttpResponse.json(
			{
				id: crypto.randomUUID(),
				...(body as object),
			},
			{ status: 201 },
		);
	}),
];
