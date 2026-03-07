import type { SignupReqData } from "@/types/apiTypes";
import type { TransactionData } from "@/types/globalTypes";
import { delay, http, HttpResponse } from "msw";

// Mock data
const mockUser = {
	id: "123",
	firstName: "John",
	lastName: "Doe",
	role: "user",
	email: "john@example.com",
};

const mockTransactions: TransactionData[] = [
	{
		id: 1,
		title: "Grocery Shopping",
		amount: 150.5,
		category: "Food",
		type: "EXPENSE",
		date: "2024-01-15",
		description: "Weekly groceries",
		recurring: false,
	},
	{
		id: 2,
		title: "Salary",
		amount: 5000,
		category: "Income",
		type: "INCOME",
		date: "2024-01-01",
		description: "Monthly salary",
		recurring: true,
	},
	{
		id: 3,
		title: "Electric Bill",
		amount: 85.0,
		category: "Utilities",
		type: "EXPENSE",
		date: "2024-01-10",
		description: "Monthly electricity",
		recurring: true,
	},
];

export const handlers = [
	// Auth endpoints
	http.post("*/auth/login", async ({ request }) => {
		const body = (await request.json()) as { email: string; password: string };

		// Simulate network delay
		await delay(100);

		// Invalid credentials
		if (body.email === "invalid@example.com") {
			return HttpResponse.json({ message: "Invalid email or password" }, { status: 401 });
		}

		// User not found
		if (body.email === "notfound@example.com") {
			return HttpResponse.json({ message: "User not found" }, { status: 404 });
		}

		// Network error simulation
		if (body.email === "networkerror@example.com") {
			return HttpResponse.error();
		}

		// Server error
		if (body.email === "servererror@example.com") {
			return HttpResponse.json({ message: "Internal server error" }, { status: 500 });
		}

		// Success
		return HttpResponse.json(
			{
				user: mockUser,
				message: "Login successful",
			},
			{ status: 200 },
		);
	}),

	http.post("*/auth/signup", async ({ request }) => {
		const body = (await request.json()) as SignupReqData;

		await delay(100);

		// Email already exists
		if (body.email === "existing@example.com") {
			return HttpResponse.json({ message: "Email already registered" }, { status: 409 });
		}

		// Validation error
		if (body.email === "invalid-email") {
			return HttpResponse.json({ message: "Invalid email format" }, { status: 400 });
		}

		// Success
		return HttpResponse.json(
			{
				user: {
					id: crypto.randomUUID(),
					firstName: body.firstName,
					lastName: body.lastName,
					email: body.email,
					role: "user",
				},
				message: "Account created successfully",
			},
			{ status: 201 },
		);
	}),

	http.post("*/auth/logout", async () => {
		await delay(50);
		return HttpResponse.json({ message: "Logged out successfully" }, { status: 200 });
	}),

	http.get("*/auth/me", ({ request }) => {
		// Check for authorization header or cookie
		const url = new URL(request.url);
		const unauthorized = url.searchParams.get("unauthorized");

		if (unauthorized === "true") {
			return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		return HttpResponse.json(mockUser, { status: 200 });
	}),

	http.post("*/auth/refresh", ({ request }) => {
		const url = new URL(request.url);
		const fail = url.searchParams.get("fail");

		if (fail === "true") {
			return HttpResponse.json({ message: "Refresh token expired" }, { status: 401 });
		}

		return HttpResponse.json({ message: "Token refreshed" }, { status: 200 });
	}),

	// Transaction endpoints
	http.get("*/transactions", async ({ request }) => {
		const url = new URL(request.url);
		const page = Number.parseInt(url.searchParams.get("page") || "0");
		const size = Number.parseInt(url.searchParams.get("size") || "10");
		const empty = url.searchParams.get("empty");
		const error = url.searchParams.get("error");

		await delay(100);

		if (error === "true") {
			return HttpResponse.json({ message: "Failed to fetch transactions" }, { status: 500 });
		}

		if (empty === "true") {
			return HttpResponse.json({
				content: [],
				totalElements: 0,
				totalPages: 0,
				page: 0,
				size: size,
			});
		}

		// Paginated response
		const startIndex = page * size;
		const paginatedContent = mockTransactions.slice(startIndex, startIndex + size);

		return HttpResponse.json({
			content: paginatedContent,
			totalElements: mockTransactions.length,
			totalPages: Math.ceil(mockTransactions.length / size),
			page,
			size,
		});
	}),

	http.get("*/transactions/range", async ({ request }) => {
		const url = new URL(request.url);
		const from = url.searchParams.get("from");
		const to = url.searchParams.get("to");

		await delay(50);

		if (!from || !to) {
			return HttpResponse.json({ message: "Date range required" }, { status: 400 });
		}

		return HttpResponse.json(mockTransactions, { status: 200 });
	}),

	http.post("*/transactions", async ({ request }) => {
		const body = (await request.json()) as Partial<TransactionData>;

		await delay(100);

		// Validation error
		if (!body.title || !body.amount) {
			return HttpResponse.json({ message: "Title and amount are required" }, { status: 400 });
		}

		return HttpResponse.json(
			{
				id: Math.floor(Math.random() * 1000) + 10,
				...body,
			},
			{ status: 201 },
		);
	}),

	http.put("*/transactions/:id", async ({ request, params }) => {
		const id = Number.parseInt(params.id as string);
		const body = (await request.json()) as Partial<TransactionData>;

		await delay(100);

		// Not found
		if (id === 999) {
			return HttpResponse.json({ message: "Transaction not found" }, { status: 404 });
		}

		// Validation error
		if (!body.title || body.amount === undefined) {
			return HttpResponse.json({ message: "Title and amount are required" }, { status: 400 });
		}

		return HttpResponse.json(
			{
				id,
				...body,
			},
			{ status: 200 },
		);
	}),

	http.delete("*/transactions/:id", async ({ params }) => {
		const id = Number.parseInt(params.id as string);

		await delay(100);

		// Not found
		if (id === 999) {
			return HttpResponse.json({ message: "Transaction not found" }, { status: 404 });
		}

		return HttpResponse.json({ message: "Transaction deleted" }, { status: 200 });
	}),

	// Health check
	http.get("*/actuator/health", () => {
		return HttpResponse.json({ status: "UP" }, { status: 200 });
	}),
];
