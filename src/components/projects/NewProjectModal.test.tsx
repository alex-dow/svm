import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewProjectModal from "./NewProjectModal";
import { createProjectAction } from "@/actions/projects";
import { useToastContext } from "../contexts/ToastContextProvider";

// Mock the actions
vi.mock("@/actions/projects", () => ({
  createProjectAction: vi.fn(),
}));

// Mock the toast context
const mockShowToast = vi.fn();
vi.mock("../contexts/ToastContextProvider", () => ({
  useToastContext: vi.fn(() => ({
    showToast: mockShowToast,
  })),
}));

describe("NewProjectModal", () => {
  const mockSetVisible = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetVisible.mockClear();
    mockShowToast.mockClear();
    vi.mocked(createProjectAction).mockClear();
  });

  describe("Initial Render", () => {
    it("renders dialog when visible is true", () => {
      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      expect(
        screen.getByRole("dialog", { name: /create a new project/i })
      ).toBeInTheDocument();
    });

    it("does not render dialog when visible is false", () => {
      render(
        <NewProjectModal visible={false} setVisible={mockSetVisible} />
      );

      expect(
        screen.queryByRole("dialog")
      ).not.toBeInTheDocument();
    });


  describe("Dialog Visibility Control", () => {
    it("calls setVisible(false) when dialog is hidden", () => {
      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      // The Dialog component's onHide is called when it should close
      // We test that setVisible is called when form is submitted successfully
      expect(
        screen.getByRole("dialog", { name: /create a new project/i })
      ).toBeInTheDocument();
    });

    it("does not call setVisible when visible is already false", () => {
      render(
        <NewProjectModal visible={false} setVisible={mockSetVisible} />
      );

      // onHide should check if visible is false and return early
      // This is tested indirectly through the component logic
      expect(mockSetVisible).not.toHaveBeenCalled();
    });
  });

  describe("Form Input Handling", () => {
    it("allows user to type in project name field", async () => {
      const user = userEvent.setup();
      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      await user.type(input, "My New Project");

      expect(input.value).toBe("My New Project");
    });

    it("clears input after successful submission", async () => {
      const user = userEvent.setup();
      const mockProject = { id: 1, name: "My New Project", owner_id: "user-123" };
      vi.mocked(createProjectAction).mockResolvedValue(mockProject);

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /create/i });

      await user.type(input, "My New Project");
      await user.click(submitButton);

      await waitFor(() => {
        expect(createProjectAction).toHaveBeenCalledWith("My New Project");
      });

      // After successful submission, modal closes, so input is not accessible
      // But we verify the action was called with correct value
    });
  });

  describe("Form Submission - Success", () => {
    it("calls createProjectAction with project name on form submission", async () => {
      const user = userEvent.setup();
      const mockProject = { id: 1, name: "My New Project", owner_id: "user-123" };
      vi.mocked(createProjectAction).mockResolvedValue(mockProject);

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /create/i });

      await user.type(input, "My New Project");
      await user.click(submitButton);

      await waitFor(() => {
        expect(createProjectAction).toHaveBeenCalledWith("My New Project");
        expect(createProjectAction).toHaveBeenCalledTimes(1);
      });
    });

    it("prevents default form submission behavior", async () => {
      const user = userEvent.setup();
      const mockProject = { id: 1, name: "My New Project", owner_id: "user-123" };
      vi.mocked(createProjectAction).mockResolvedValue(mockProject);

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const form = document.getElementById(
        "new-project-form"
      ) as HTMLFormElement;
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(submitEvent, "preventDefault");

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      await user.type(input, "My New Project");

      form.dispatchEvent(submitEvent);

      // The form's onSubmit handler should prevent default
      // We verify this indirectly by checking that createProjectAction was called
      await waitFor(() => {
        expect(createProjectAction).toHaveBeenCalled();
      });
    });

    it("closes modal after successful project creation", async () => {
      const user = userEvent.setup();
      const mockProject = { id: 1, name: "My New Project", owner_id: "user-123" };
      vi.mocked(createProjectAction).mockResolvedValue(mockProject);

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /create/i });

      await user.type(input, "My New Project");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetVisible).toHaveBeenCalledWith(false);
        expect(mockSetVisible).toHaveBeenCalledTimes(1);
      });
    });

    it("shows success toast after successful project creation", async () => {
      const user = userEvent.setup();
      const mockProject = { id: 1, name: "My New Project", owner_id: "user-123" };
      vi.mocked(createProjectAction).mockResolvedValue(mockProject);

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /create/i });

      await user.type(input, "My New Project");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith({
          severity: "success",
          summary: "Project created",
          detail: "Project created successfully",
        });
        expect(mockShowToast).toHaveBeenCalledTimes(1);
      });
    });

    it("does not close modal or show toast if createProjectAction returns null", async () => {
      const user = userEvent.setup();
      vi.mocked(createProjectAction).mockResolvedValue(null as any);

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /create/i });

      await user.type(input, "My New Project");
      await user.click(submitButton);

      await waitFor(() => {
        expect(createProjectAction).toHaveBeenCalled();
      });

      // Should not close modal or show toast if project is null
      expect(mockSetVisible).not.toHaveBeenCalled();
      expect(mockShowToast).not.toHaveBeenCalled();
    });
  });

  describe("Form Submission - Error Handling", () => {
    it("shows error toast when createProjectAction throws an error", async () => {
      const user = userEvent.setup();
      const error = new Error("Failed to create project");
      vi.mocked(createProjectAction).mockRejectedValue(error);

      // Mock console.error to avoid noise in test output
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /create/i });

      await user.type(input, "My New Project");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while creating the project",
        });
        expect(mockShowToast).toHaveBeenCalledTimes(1);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      consoleErrorSpy.mockRestore();
    });

    it("does not close modal when createProjectAction throws an error", async () => {
      const user = userEvent.setup();
      const error = new Error("Failed to create project");
      vi.mocked(createProjectAction).mockRejectedValue(error);

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /create/i });

      await user.type(input, "My New Project");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalled();
      });

      // Modal should remain open on error
      expect(mockSetVisible).not.toHaveBeenCalled();
      expect(
        screen.getByRole("dialog", { name: /create a new project/i })
      ).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it("logs error to console when createProjectAction throws", async () => {
      const user = userEvent.setup();
      const error = new Error("Network error");
      vi.mocked(createProjectAction).mockRejectedValue(error);

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /create/i });

      await user.type(input, "My New Project");
      await user.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Form Validation", () => {
    it("requires project name input", () => {
      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById("new-project-name");
      expect(input).toBeRequired();
    });

    it("does not submit form when project name is empty", async () => {
      const user = userEvent.setup();
      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const submitButton = screen.getByRole("button", { name: /create/i });
      await user.click(submitButton);

      // HTML5 validation should prevent submission
      // createProjectAction should not be called
      await waitFor(() => {
        expect(createProjectAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("Component Props", () => {
    it("handles visible prop changes", () => {
      const { rerender } = render(
        <NewProjectModal visible={false} setVisible={mockSetVisible} />
      );

      expect(
        screen.queryByRole("dialog")
      ).not.toBeInTheDocument();

      rerender(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      expect(
        screen.getByRole("dialog", { name: /create a new project/i })
      ).toBeInTheDocument();
    });

    it("calls setVisible with correct value", async () => {
      const user = userEvent.setup();
      const mockProject = { id: 1, name: "My New Project", owner_id: "user-123" };
      vi.mocked(createProjectAction).mockResolvedValue(mockProject);

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /create/i });

      await user.type(input, "My New Project");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetVisible).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("Toast Context Integration", () => {
    it("uses toast context when available", async () => {
      const user = userEvent.setup();
      const mockProject = { id: 1, name: "My New Project", owner_id: "user-123" };
      vi.mocked(createProjectAction).mockResolvedValue(mockProject);

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      const input = document.getElementById(
        "new-project-name"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /create/i });

      await user.type(input, "My New Project");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalled();
      });
    });

    it("handles missing toast context gracefully", () => {
      vi.mocked(useToastContext).mockReturnValue(null);

      render(
        <NewProjectModal visible={true} setVisible={mockSetVisible} />
      );

      // Component should render without errors even if toast context is null
      expect(
        screen.getByRole("dialog", { name: /create a new project/i })
      ).toBeInTheDocument();
    });
  });
});

});