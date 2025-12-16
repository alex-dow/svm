import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";
import { authClient } from "@/lib/auth/client";
import { useSearchParams } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

// Mock window.location
const mockLocation = {
  href: "",
};
Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});


// Mock the auth client
vi.mock("@/lib/auth/client", () => ({
  authClient: {
    signIn: {
      username: vi.fn(),
    },
  },
}));



describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = "";
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn(() => null),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  describe("Login page", () => {
    it("Shows a verified message when verified query param is present", () => {
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn((key: string) => (key === "verified" ? "true" : null)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<LoginPage />);
    
      expect(
        document.getElementById("login-verified-message")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Your email has been verified. You can now login below.")
      ).toBeInTheDocument();
    });

    it("Redirects to home page after successful login", async() => {

      vi.mocked(authClient.signIn.username).mockResolvedValue({
        data: {},
        error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);


      const user = userEvent.setup();
      render(<LoginPage />);

      const usernameInput = document.getElementById("login-username") as HTMLInputElement;
      const passwordInput = document.getElementById("login-password") as HTMLInputElement;
      const loginButton = document.getElementById("login-submit") as HTMLButtonElement;

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(loginButton);

      waitFor(() => {
        expect(mockLocation.href).toBe("/");
      });
    });

    it("Shows an error message when login fails", async() => {
      vi.mocked(authClient.signIn.username).mockResolvedValue({
        data: null,
        error: { message: "Invalid username or password" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const user = userEvent.setup();
      render(<LoginPage />);

      const usernameInput = document.getElementById("login-username") as HTMLInputElement;
      const passwordInput = document.getElementById("login-password") as HTMLInputElement;
      const loginButton = document.getElementById("login-submit") as HTMLButtonElement;

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(loginButton);
      
      waitFor(() => {
        expect(
          document.getElementById("login-error-message")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Invalid username or password")
        ).toBeInTheDocument();
      });
    })
  });
});
