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



    describe("Form Input Handling", () => {
      it("submits name for new project", async () => {
        const user = userEvent.setup();
        const mockProject = { id: 1, name: "My New Project", owner_id: "user-123" };
        vi.mocked(createProjectAction).mockResolvedValue(mockProject);

        render(
          <NewProjectModal visible={true} setVisible={mockSetVisible} />
        );

        const input = document.getElementById(
          "new-project-name"
        ) as HTMLInputElement;
        const submitButton = document.getElementById('new-project-submit') as HTMLButtonElement;

        await user.type(input, "My New Project");
        await user.click(submitButton);

        await waitFor(() => {
          expect(createProjectAction).toHaveBeenCalledWith("My New Project");
        });

        await waitFor(() => {
          expect(mockShowToast).toHaveBeenCalledWith({
            severity: "success",
            summary: "Project created",
            detail: "Project created successfully",
          });
          expect(mockShowToast).toHaveBeenCalledTimes(1);
        });
      });

      it("shows error when createProjectAction throws an error", async() => {
        const error = new Error("Failed to create project");
        const user = userEvent.setup();
        vi.mocked(createProjectAction).mockRejectedValue(error);

        render(
          <NewProjectModal visible={true} setVisible={mockSetVisible} />
        );

        const input = document.getElementById(
          "new-project-name"
        ) as HTMLInputElement;
        const submitButton = document.getElementById('new-project-submit') as HTMLButtonElement;

        await user.type(input, "My New Project");
        await user.click(submitButton);

        await waitFor(() => {
          expect(mockShowToast).toHaveBeenCalledWith({
            severity: "error",
            summary: "Error",
            detail: "An error occurred while creating the project",
          });
          expect(
            screen.getByRole("dialog", { name: /create a new project/i })
          ).toBeInTheDocument();
        });


      })
    });
  });
});