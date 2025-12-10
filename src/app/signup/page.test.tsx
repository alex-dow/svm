import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupPage from "./page";
import { authClient } from "@/lib/auth/client";

// Helper to get input elements by ID
const getInputById = (id: string) =>
  document.getElementById(id) as HTMLInputElement;
// Helper to get password input elements from PrimeReact Password components
const getPasswordInput = (id: string) =>
  document.querySelector(`#${id} input[type="password"]`) as HTMLInputElement;

// Mock the auth client
vi.mock("@/lib/auth/client", () => ({
  authClient: {
    isUsernameAvailable: vi.fn(),
    signUp: {
      email: vi.fn(),
    },
  },
}));

describe("SignupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Render", () => {
    it("renders the signup form with all fields", () => {
      render(<SignupPage />);

      expect(
        screen.getByRole("heading", { name: /sign up/i })
      ).toBeInTheDocument();
      expect(getInputById("signup-username")).toBeInTheDocument();
      expect(getInputById("signup-email")).toBeInTheDocument();
      expect(getPasswordInput("signup-password")).toBeInTheDocument();
      expect(getPasswordInput("signup-confirm-password")).toBeInTheDocument();
      expect(getInputById("signup-submit")).toBeInTheDocument();
    });

    it("renders form fields with correct IDs", () => {
      render(<SignupPage />);

      expect(getInputById("signup-username")).toBeInTheDocument();
      expect(getInputById("signup-email")).toBeInTheDocument();
      expect(getPasswordInput("signup-password")).toBeInTheDocument();
      expect(getPasswordInput("signup-confirm-password")).toBeInTheDocument();
      expect(getInputById("signup-submit")).toBeInTheDocument();
    });

    it("disables submit button initially when form is invalid", () => {
      render(<SignupPage />);

      const submitButton = getInputById("signup-submit");
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Form Validation", () => {
    it("shows error when username is empty", async () => {
      const user = userEvent.setup();
      render(<SignupPage />);

      const usernameInput = getInputById("signup-username");
      await user.click(usernameInput);
      await user.tab(); // Blur the field

      await waitFor(() => {
        expect(
          document.getElementById("signup-username-error")
        ).toBeInTheDocument();
        expect(
          document.getElementById("signup-username-error")?.textContent
        ).toBe("Username is required");
      });
    });

    it("shows error when username is too short", async () => {
      const user = userEvent.setup();
      render(<SignupPage />);

      const usernameInput = getInputById("signup-username");
      await user.type(usernameInput, "ab");
      await user.tab();

      await waitFor(() => {
        expect(
          document.getElementById("signup-username-error")
        ).toBeInTheDocument();
        expect(
          document.getElementById("signup-username-error")?.textContent
        ).toBe("Username must be at least 3 characters long");
      });
    });

    it("shows error when username is too long", async () => {
      const user = userEvent.setup();
      render(<SignupPage />);

      const usernameInput = getInputById("signup-username");
      await user.type(usernameInput, "a".repeat(21));
      await user.tab();

      await waitFor(() => {
        expect(
          document.getElementById("signup-username-error")
        ).toBeInTheDocument();
        expect(
          document.getElementById("signup-username-error")?.textContent
        ).toBe("Username must be at most 20 characters long");
      });
    });

    it("shows error when username is not available", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: false },
      } as any);

      render(<SignupPage />);

      const usernameInput = getInputById("signup-username");
      await user.type(usernameInput, "takenuser");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("Username is not available")
        ).toBeInTheDocument();
      });
    });

    it("validates username availability", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);

      render(<SignupPage />);

      const usernameInput = getInputById("signup-username");
      await user.type(usernameInput, "availableuser");
      await user.tab();

      await waitFor(() => {
        expect(authClient.isUsernameAvailable).toHaveBeenCalledWith({
          username: "availableuser",
        });
      });
    });

    it("shows error when email is empty", async () => {
      const user = userEvent.setup();
      render(<SignupPage />);

      const emailInput = getInputById("signup-email");
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        expect(
          document.getElementById("signup-email-error")
        ).toBeInTheDocument();
        expect(document.getElementById("signup-email-error")?.textContent).toBe(
          "Email is required"
        );
      });
    });

    it("shows error when email format is invalid", async () => {
      const user = userEvent.setup();
      render(<SignupPage />);

      const emailInput = getInputById("signup-email");
      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(
          document.getElementById("signup-email-error")
        ).toBeInTheDocument();
        expect(document.getElementById("signup-email-error")?.textContent).toBe(
          "Invalid email address"
        );
      });
    });

    it("accepts valid email format", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);

      render(<SignupPage />);

      const emailInput = getInputById("signup-email");
      await user.type(emailInput, "test@example.com");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.queryByText("Invalid email address")
        ).not.toBeInTheDocument();
      });
    });

    it("shows error when password is empty", async () => {
      const user = userEvent.setup();
      render(<SignupPage />);

      const passwordInput = document.querySelector(
        '#signup-password input[type="password"]'
      ) as HTMLInputElement;
      await user.click(passwordInput);
      await user.tab();

      await waitFor(() => {
        expect(
          document.getElementById("signup-password-error")
        ).toBeInTheDocument();
        expect(
          document.getElementById("signup-password-error")?.textContent
        ).toBe("Password is required");
      });
    });

    it("shows error when password is too short", async () => {
      const user = userEvent.setup();
      render(<SignupPage />);

      const passwordInput = document.querySelector(
        '#signup-password input[type="password"]'
      ) as HTMLInputElement;
      await user.type(passwordInput, "short");
      await user.tab();

      await waitFor(() => {
        expect(
          document.getElementById("signup-password-error")
        ).toBeInTheDocument();
        expect(
          document.getElementById("signup-password-error")?.textContent
        ).toBe("Password must be at least 8 characters long");
      });
    });

    it("shows error when confirm password is empty", async () => {
      const user = userEvent.setup();
      render(<SignupPage />);

      const confirmPasswordInput = getPasswordInput("signup-confirm-password");
      await user.click(confirmPasswordInput);
      await user.tab();

      await waitFor(() => {
        expect(
          document.getElementById("signup-confirm-password-error")
        ).toBeInTheDocument();
        expect(
          document.getElementById("signup-confirm-password-error")?.textContent
        ).toBe("Confirm password is required");
      });
    });

    it("shows error when passwords do not match", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);

      render(<SignupPage />);

      const passwordInput = document.querySelector(
        '#signup-password input[type="password"]'
      ) as HTMLInputElement;
      const confirmPasswordInput = getPasswordInput("signup-confirm-password");

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "different123");
      await user.tab();

      await waitFor(() => {
        expect(
          document.getElementById("signup-confirm-password-error")
        ).toBeInTheDocument();
        expect(
          document.getElementById("signup-confirm-password-error")?.textContent
        ).toBe("Passwords do not match");
      });
    });

    it("enables submit button when all fields are valid", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);

      render(<SignupPage />);

      await user.type(getInputById("signup-username"), "testuser");
      await user.tab();
      await user.type(getInputById("signup-email"), "test@example.com");
      await user.tab();
      await user.type(getPasswordInput("signup-password"), "password123");
      await user.tab();
      await user.type(
        getPasswordInput("signup-confirm-password"),
        "password123"
      );
      await user.tab();

      await waitFor(() => {
        const submitButton = getInputById("signup-submit");
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("Form Submission", () => {
    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);
      vi.mocked(authClient.signUp.email).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: {}, error: null } as any), 100);
          })
      );

      render(<SignupPage />);

      // Fill form
      await user.type(getInputById("signup-username"), "testuser");
      await user.tab();
      await user.type(getInputById("signup-email"), "test@example.com");
      await user.tab();
      await user.type(getPasswordInput("signup-password"), "password123");
      await user.tab();
      await user.type(
        getPasswordInput("signup-confirm-password"),
        "password123"
      );
      await user.tab();

      await waitFor(() => {
        const submitButton = getInputById("signup-submit");
        expect(submitButton).not.toBeDisabled();
      });

      const submitButton = getInputById("signup-submit");
      await user.click(submitButton);

      await waitFor(() => {
        expect(getInputById("signup-submit").textContent).toContain(
          "Creating account"
        );
        // ProgressSpinner renders as an SVG or div with specific classes
        expect(
          document.querySelector(".p-progress-spinner")
        ).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });

    it("calls signUp.email with correct parameters on successful submission", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);
      vi.mocked(authClient.signUp.email).mockResolvedValue({
        data: {},
        error: null,
      } as any);

      render(<SignupPage />);

      // Fill form
      await user.type(getInputById("signup-username"), "testuser");
      await user.tab();
      await user.type(getInputById("signup-email"), "test@example.com");
      await user.tab();
      await user.type(getPasswordInput("signup-password"), "password123");
      await user.tab();
      await user.type(
        getPasswordInput("signup-confirm-password"),
        "password123"
      );
      await user.tab();

      await waitFor(() => {
        const submitButton = getInputById("signup-submit");
        expect(submitButton).not.toBeDisabled();
      });

      const submitButton = getInputById("signup-submit");
      await user.click(submitButton);

      await waitFor(() => {
        expect(authClient.signUp.email).toHaveBeenCalledWith({
          email: "test@example.com",
          name: "testuser",
          username: "testuser",
          password: "password123",
          callbackURL: "/login?verified=true",
        });
      });
    });

    it("shows success message after successful submission", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);
      vi.mocked(authClient.signUp.email).mockResolvedValue({
        data: {},
        error: null,
      } as any);

      render(<SignupPage />);

      // Fill form
      await user.type(getInputById("signup-username"), "testuser");
      await user.tab();
      await user.type(getInputById("signup-email"), "test@example.com");
      await user.tab();
      await user.type(getPasswordInput("signup-password"), "password123");
      await user.tab();
      await user.type(
        getPasswordInput("signup-confirm-password"),
        "password123"
      );
      await user.tab();

      await waitFor(() => {
        const submitButton = getInputById("signup-submit");
        expect(submitButton).not.toBeDisabled();
      });

      const submitButton = getInputById("signup-submit");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          document.getElementById("signup-complete-container")
        ).toBeInTheDocument();
        // Form should no longer be visible
        expect(
          document.getElementById("signup-username")
        ).not.toBeInTheDocument();
      });
    });

    it("shows error message when signup fails", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);
      vi.mocked(authClient.signUp.email).mockResolvedValue({
        data: null,
        error: { message: "Email already in use" },
      } as any);

      render(<SignupPage />);

      // Fill form
      await user.type(getInputById("signup-username"), "testuser");
      await user.tab();
      await user.type(getInputById("signup-email"), "test@example.com");
      await user.tab();
      await user.type(getPasswordInput("signup-password"), "password123");
      await user.tab();
      await user.type(
        getPasswordInput("signup-confirm-password"),
        "password123"
      );
      await user.tab();

      await waitFor(() => {
        const submitButton = getInputById("signup-submit");
        expect(submitButton).not.toBeDisabled();
      });

      const submitButton = getInputById("signup-submit");
      await user.click(submitButton);

      await waitFor(() => {
        // PrimeReact Message component renders with specific structure
        expect(screen.getByText("Email already in use")).toBeInTheDocument();
      });
    });

    it("prevents submission when passwords do not match", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);

      render(<SignupPage />);

      // Fill form with matching passwords first to make form valid
      await user.type(getInputById("signup-username"), "testuser");
      await user.tab();
      await user.type(getInputById("signup-email"), "test@example.com");
      await user.tab();
      await user.type(getPasswordInput("signup-password"), "password123");
      await user.tab();
      await user.type(
        getPasswordInput("signup-confirm-password"),
        "password123"
      );
      await user.tab();

      await waitFor(() => {
        const submitButton = getInputById("signup-submit");
        expect(submitButton).not.toBeDisabled();
      });

      // Now change confirm password to mismatch
      const confirmPasswordInput = getPasswordInput("signup-confirm-password");
      await user.clear(confirmPasswordInput);
      await user.type(confirmPasswordInput, "different123");
      await user.tab();

      // Form should become invalid and show inline error
      await waitFor(() => {
        expect(
          document.getElementById("signup-confirm-password-error")
        ).toBeInTheDocument();
        expect(
          document.getElementById("signup-confirm-password-error")?.textContent
        ).toBe("Passwords do not match");
      });

      // Submit button should be disabled when form is invalid
      const submitButton = getInputById("signup-submit");
      expect(submitButton).toBeDisabled();

      // Signup should not be called because form validation prevents submission
      expect(authClient.signUp.email).not.toHaveBeenCalled();
    });

    it("handles unexpected errors during submission", async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);
      vi.mocked(authClient.signUp.email).mockRejectedValue(
        new Error("Network error")
      );

      render(<SignupPage />);

      // Fill form
      await user.type(getInputById("signup-username"), "testuser");
      await user.tab();
      await user.type(getInputById("signup-email"), "test@example.com");
      await user.tab();
      await user.type(getPasswordInput("signup-password"), "password123");
      await user.tab();
      await user.type(
        getPasswordInput("signup-confirm-password"),
        "password123"
      );
      await user.tab();

      await waitFor(() => {
        const submitButton = getInputById("signup-submit");
        expect(submitButton).not.toBeDisabled();
      });

      const submitButton = getInputById("signup-submit");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("An error occurred while signing up")
        ).toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("SignupComplete Component", () => {
    it("displays verification message after successful signup", async () => {
      const user = userEvent.setup();
      vi.mocked(authClient.isUsernameAvailable).mockResolvedValue({
        data: { available: true },
      } as any);
      vi.mocked(authClient.signUp.email).mockResolvedValue({
        data: {},
        error: null,
      } as any);

      render(<SignupPage />);

      // Fill and submit form
      await user.type(getInputById("signup-username"), "testuser");
      await user.tab();
      await user.type(getInputById("signup-email"), "test@example.com");
      await user.tab();
      await user.type(getPasswordInput("signup-password"), "password123");
      await user.tab();
      await user.type(
        getPasswordInput("signup-confirm-password"),
        "password123"
      );
      await user.tab();

      await waitFor(() => {
        const submitButton = getInputById("signup-submit");
        expect(submitButton).not.toBeDisabled();
      });

      await user.click(getInputById("signup-submit"));

      await waitFor(() => {
        expect(
          document.getElementById("signup-complete-container")
        ).toBeInTheDocument();
        // Form should no longer be visible
        expect(
          document.getElementById("signup-username")
        ).not.toBeInTheDocument();
      });
    });
  });
});
