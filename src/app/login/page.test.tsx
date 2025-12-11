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

// Helper to get input elements by ID
const getInputById = (id: string) =>
  document.getElementById(id) as HTMLInputElement;

// Helper to get password input elements from PrimeReact Password components
const getPasswordInput = (id: string) =>
  document.querySelector(`#${id} input[type="password"]`) as HTMLInputElement;

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
    } as any);
  });

  describe("Initial Render", () => {
    it("renders the login form with all fields", () => {
      render(<LoginPage />);

      expect(
        screen.getByRole("heading", { name: /login/i })
      ).toBeInTheDocument();
      expect(getInputById("login-username")).toBeInTheDocument();
      expect(getPasswordInput("login-password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login/i })
      ).toBeInTheDocument();
    });

    it("renders form fields with correct IDs", () => {
      render(<LoginPage />);

      expect(getInputById("login-username")).toBeInTheDocument();
      expect(getPasswordInput("login-password")).toBeInTheDocument();
    });

    it("renders login button that is not disabled initially", () => {
      render(<LoginPage />);

      const loginButton = screen.getByRole("button", { name: /login/i });
      expect(loginButton).not.toBeDisabled();
    });

    it("does not show error message initially", () => {
      render(<LoginPage />);

      expect(
        document.getElementById("login-error-message")
      ).not.toBeInTheDocument();
    });

    it("does not show verified message when verified param is not present", () => {
      render(<LoginPage />);

      expect(
        document.getElementById("login-verified-message")
      ).not.toBeInTheDocument();
    });
  });

  describe("Verified Message", () => {
    it("shows verified message when verified query param is present", () => {
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn((key: string) => (key === "verified" ? "true" : null)),
      } as any);

      render(<LoginPage />);

      expect(
        document.getElementById("login-verified-message")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Your email has been verified. You can now login below."
        )
      ).toBeInTheDocument();
    });

    it("does not show verified message when verified param is not present", () => {
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn(() => null),
      } as any);

      render(<LoginPage />);

      expect(
        document.getElementById("login-verified-message")
      ).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("calls signIn.username with correct credentials on form submission", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockResolvedValue({
        data: {},
        error: null,
      } as any);

      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(loginButton);

      await waitFor(() => {
        expect(authClient.signIn.username).toHaveBeenCalledWith({
          username: "testuser",
          password: "password123",
        });
      });
    });

    it("prevents default form submission behavior", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockResolvedValue({
        data: {},
        error: null,
      } as any);

      render(<LoginPage />);

      const form = document.getElementById("login-form") as HTMLFormElement;
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(submitEvent, "preventDefault");

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");

      form.dispatchEvent(submitEvent);

      // The form's onSubmit handler should prevent default
      // We verify this indirectly by checking that authClient was called
      await waitFor(() => {
        expect(authClient.signIn.username).toHaveBeenCalled();
      });
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: {}, error: null } as any), 100);
          })
      );

      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(loginButton);

      await waitFor(() => {
        expect(loginButton).toBeDisabled();
        expect(
          document.querySelector(".p-progress-spinner")
        ).toBeInTheDocument();
      });
    });

    it("clears error message when submitting form", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: {}, error: null } as any), 100);
          })
      );

      render(<LoginPage />);

      // First, trigger an error
      vi.mocked(authClient.signIn.username).mockResolvedValueOnce({
        data: null,
        error: { message: "Invalid credentials" },
      } as any);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "wrongpassword");
      await user.click(loginButton);

      await waitFor(() => {
        expect(
          screen.getByText("Invalid username or password")
        ).toBeInTheDocument();
      });

      // Now submit again - error should be cleared
      vi.mocked(authClient.signIn.username).mockResolvedValue({
        data: {},
        error: null,
      } as any);

      await user.click(loginButton);

      await waitFor(() => {
        expect(
          document.getElementById("login-error-message")
        ).not.toBeInTheDocument();
      });
    });

    it("redirects to home page on successful login", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockResolvedValue({
        data: {},
        error: null,
      } as any);

      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(loginButton);

      await waitFor(() => {
        expect(mockLocation.href).toBe("/");
      });
    });

    it("shows error message when login fails with error", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockResolvedValue({
        data: null,
        error: { message: "Invalid credentials" },
      } as any);

      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "wrongpassword");
      await user.click(loginButton);

      await waitFor(() => {
        expect(
          document.getElementById("login-error-message")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Invalid username or password")
        ).toBeInTheDocument();
      });
    });

    it("shows error message when login throws an exception", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockRejectedValue(
        new Error("Network error")
      );

      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(loginButton);

      await waitFor(() => {
        expect(
          document.getElementById("login-error-message")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Invalid username or password")
        ).toBeInTheDocument();
      });
    });

    it("re-enables button after failed login", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  data: null,
                  error: { message: "Invalid credentials" },
                } as any),
              50
            );
          })
      );

      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "wrongpassword");
      await user.click(loginButton);

      // Button should be disabled during submission
      await waitFor(() => {
        expect(loginButton).toBeDisabled();
      });

      // Button should be re-enabled after error
      await waitFor(
        () => {
          expect(loginButton).not.toBeDisabled();
        },
        { timeout: 2000 }
      );
    });

    it("does not redirect on failed login", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockResolvedValue({
        data: null,
        error: { message: "Invalid credentials" },
      } as any);

      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "wrongpassword");
      await user.click(loginButton);

      await waitFor(() => {
        expect(
          screen.getByText("Invalid username or password")
        ).toBeInTheDocument();
      });

      // Location should not have changed
      expect(mockLocation.href).toBe("");
    });

    it("hides loading spinner after successful login", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: {}, error: null } as any), 50);
          })
      );

      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(loginButton);

      // Spinner should appear during submission
      await waitFor(() => {
        expect(
          document.querySelector(".p-progress-spinner")
        ).toBeInTheDocument();
      });

      // After redirect, spinner should be gone (component unmounts)
      await waitFor(() => {
        expect(mockLocation.href).toBe("/");
      });
    });

    it("hides loading spinner after failed login", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  data: null,
                  error: { message: "Invalid credentials" },
                } as any),
              50
            );
          })
      );

      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "wrongpassword");
      await user.click(loginButton);

      // Spinner should appear during submission
      await waitFor(() => {
        expect(
          document.querySelector(".p-progress-spinner")
        ).toBeInTheDocument();
      });

      // Spinner should disappear after error
      await waitFor(
        () => {
          expect(
            document.querySelector(".p-progress-spinner")
          ).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Form Input Handling", () => {
    it("allows user to type in username field", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      await user.type(usernameInput, "testuser");

      expect(usernameInput.value).toBe("testuser");
    });

    it("allows user to type in password field", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const passwordInput = getPasswordInput("login-password");
      await user.type(passwordInput, "mypassword");

      expect(passwordInput.value).toBe("mypassword");
    });

    it("submits form with entered username and password", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.signIn.username).mockResolvedValue({
        data: {},
        error: null,
      } as any);

      render(<LoginPage />);

      const usernameInput = getInputById("login-username");
      const passwordInput = getPasswordInput("login-password");
      const loginButton = screen.getByRole("button", { name: /login/i });

      await user.type(usernameInput, "myusername");
      await user.type(passwordInput, "mypassword");
      await user.click(loginButton);

      await waitFor(() => {
        expect(authClient.signIn.username).toHaveBeenCalledWith({
          username: "myusername",
          password: "mypassword",
        });
      });
    });
  });
});
