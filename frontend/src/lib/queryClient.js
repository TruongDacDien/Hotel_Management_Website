import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method, url, data) {
  console.warn(`Mocking request: ${method} ${url}`);

  if (url === "/api/login") {
    return {
      json: async () => ({
        id: 1,
        name: "Guest User",
        email: "guest@example.com",
      }),
    };
  }
  if (url === "/api/register") {
    return {
      json: async () => ({ id: 2, name: data.name, email: data.email }),
    };
  }
  if (url === "/api/logout") {
    return { json: async () => ({ message: "Logged out successfully" }) };
  }

  return { json: async () => ({ message: "Mock API response" }) };
}
export const getQueryFn =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    console.warn(`Mocking API request: ${queryKey[0]}`);

    // Fake response để tránh lỗi
    if (queryKey[0] === "/user") {
      return { id: 1, name: "John Doe", email: "john@example.com" };
    }

    if (queryKey[0] === "/rooms") {
      return [
        { id: 1, name: "Deluxe Room", price: 100 },
        { id: 2, name: "Standard Room", price: 50 },
      ];
    }

    return null; // Trả về null nếu không có dữ liệu mẫu
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
