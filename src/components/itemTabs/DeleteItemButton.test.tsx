import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteAction } from "@/lib/actions/types";

// Mock the toast context BEFORE importing the component
const mockShowToast = vi.fn();
vi.mock("../contexts/ToastContextProvider", () => ({
  useToastContext: vi.fn(() => ({
    showToast: mockShowToast,
  })),
}));

// Mock confirmPopup from PrimeReact
vi.mock("primereact/confirmpopup", () => ({
  confirmPopup: vi.fn(),
}));

import DeleteItemButton from "./DeleteItemButton";
import { confirmPopup } from "primereact/confirmpopup";

describe("DeleteItemButton", () => {
  const mockDeleteAction: DeleteAction = vi.fn();
  const mockItem = { id: 1, name: "Test Item" };
  const projectId = 5;

  beforeEach(() => {
    vi.clearAllMocks();
    mockShowToast.mockClear();
    vi.mocked(confirmPopup).mockClear();
    vi.mocked(mockDeleteAction).mockClear();
  });

  describe("Initial Render", () => {
    it("renders the delete button", () => {
      render(
        <DeleteItemButton
          deleteAction={mockDeleteAction}
          item={mockItem}
          projectId={projectId}
        />
      );

      const button = screen.getByRole("button", { name: /delete/i });
      expect(button).toBeInTheDocument();
    });

    it("renders button with correct attributes", () => {
      render(
        <DeleteItemButton
          deleteAction={mockDeleteAction}
          item={mockItem}
          projectId={projectId}
        />
      );

      const button = screen.getByRole("button", { name: /delete/i });
      expect(button).toHaveAttribute("title", "Delete");
    });
  });

  describe("Confirmation Popup", () => {
    it("shows confirmation popup when button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <DeleteItemButton
          deleteAction={mockDeleteAction}
          item={mockItem}
          projectId={projectId}
        />
      );

      const button = screen.getByRole("button", { name: /delete/i });
      await user.click(button);

      expect(confirmPopup).toHaveBeenCalledTimes(1);
      expect(confirmPopup).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Are you sure you want to delete Test Item?",
          icon: "pi pi-exclamation-triangle",
          acceptClassName: "p-button-danger",
        })
      );
    });

    it("shows confirmation popup with correct message for different item names", async () => {
      const user = userEvent.setup();
      const differentItem = { id: 2, name: "Another Item" };
      
      render(
        <DeleteItemButton
          deleteAction={mockDeleteAction}
          item={differentItem}
          projectId={projectId}
        />
      );

      const button = screen.getByRole("button", { name: /delete/i });
      await user.click(button);

      expect(confirmPopup).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Are you sure you want to delete Another Item?",
        })
      );
    });
  });

  describe("Delete Action", () => {
    it("calls deleteAction with correct parameters when confirmation is accepted", async () => {
      const user = userEvent.setup();
      vi.mocked(mockDeleteAction).mockResolvedValue(undefined);

      // Set up confirmPopup to call accept callback immediately
      vi.mocked(confirmPopup).mockImplementation((options) => {
        if (options.accept) {
          options.accept();
        }
      });

      render(
        <DeleteItemButton
          deleteAction={mockDeleteAction}
          item={mockItem}
          projectId={projectId}
        />
      );

      const button = screen.getByRole("button", { name: /delete/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockDeleteAction).toHaveBeenCalledWith(projectId, mockItem.id);
        expect(mockDeleteAction).toHaveBeenCalledTimes(1);
      });
    });

    it("shows success toast when deleteAction succeeds", async () => {
      const user = userEvent.setup();
      vi.mocked(mockDeleteAction).mockResolvedValue(undefined);

      // Set up confirmPopup to call accept callback immediately
      vi.mocked(confirmPopup).mockImplementation((options) => {
        if (options.accept) {
          options.accept();
        }
      });

      render(
        <DeleteItemButton
          deleteAction={mockDeleteAction}
          item={mockItem}
          projectId={projectId}
        />
      );

      const button = screen.getByRole("button", { name: /delete/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith({
          severity: "success",
          summary: "Deleted",
          detail: "Test Item deleted successfully",
        });
        expect(mockShowToast).toHaveBeenCalledTimes(1);
      });
    });

    it("does not call deleteAction when confirmation is rejected", async () => {
      const user = userEvent.setup();

      // Set up confirmPopup to call reject callback
      vi.mocked(confirmPopup).mockImplementation((options) => {
        if (options.reject) {
          options.reject();
        }
      });

      render(
        <DeleteItemButton
          deleteAction={mockDeleteAction}
          item={mockItem}
          projectId={projectId}
        />
      );

      const button = screen.getByRole("button", { name: /delete/i });
      await user.click(button);

      // Wait a bit to ensure deleteAction would have been called if accepted
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockDeleteAction).not.toHaveBeenCalled();
      expect(mockShowToast).not.toHaveBeenCalled();
    });

    it("shows toast with correct item name after successful deletion", async () => {
      const user = userEvent.setup();
      const customItem = { id: 10, name: "Custom Item Name" };
      vi.mocked(mockDeleteAction).mockResolvedValue(undefined);

      vi.mocked(confirmPopup).mockImplementation((options) => {
        if (options.accept) {
          options.accept();
        }
      });

      render(
        <DeleteItemButton
          deleteAction={mockDeleteAction}
          item={customItem}
          projectId={projectId}
        />
      );

      const button = screen.getByRole("button", { name: /delete/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith({
          severity: "success",
          summary: "Deleted",
          detail: "Custom Item Name deleted successfully",
        });
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles deleteAction that throws an error", async () => {
      const user = userEvent.setup();
      const error = new Error("Failed to delete item");
      vi.mocked(mockDeleteAction).mockRejectedValue(error);

      vi.mocked(confirmPopup).mockImplementation((options) => {
        if (options.accept) {
          // Call accept and catch the error to prevent unhandled rejection
          (async () => {
            try {
              await options.accept();
            } catch (e) {
              // Error is expected in this test case
            }
          })();
        }
      });

      render(
        <DeleteItemButton
          deleteAction={mockDeleteAction}
          item={mockItem}
          projectId={projectId}
        />
      );

      const button = screen.getByRole("button", { name: /delete/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockDeleteAction).toHaveBeenCalled();
      });

      // Toast should not be called if deleteAction throws
      // (the component doesn't handle errors, so the error propagates)
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(mockShowToast).not.toHaveBeenCalled();
    });

    it("works with different project IDs", async () => {
      const user = userEvent.setup();
      const differentProjectId = 99;
      vi.mocked(mockDeleteAction).mockResolvedValue(undefined);

      vi.mocked(confirmPopup).mockImplementation((options) => {
        if (options.accept) {
          options.accept();
        }
      });

      render(
        <DeleteItemButton
          deleteAction={mockDeleteAction}
          item={mockItem}
          projectId={differentProjectId}
        />
      );

      const button = screen.getByRole("button", { name: /delete/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockDeleteAction).toHaveBeenCalledWith(
          differentProjectId,
          mockItem.id
        );
      });
    });
  });
});

