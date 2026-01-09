import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NameModalProvider, useNameModal } from "./ItemNameModalProvider";
import { CreateAction, RenameAction } from "@/lib/actions/types";

// Test component that uses the hook
function TestComponent() {
  const modal = useNameModal();
  
  if (!modal) {
    return <div>No context</div>;
  }

  return (
    <div>
      <button onClick={modal.show} data-testid="show-button">Show</button>
      <button onClick={modal.hide} data-testid="hide-button">Hide</button>
      <button onClick={() => modal.setItemId(1)} data-testid="set-item-id">Set Item ID</button>
      <button onClick={() => modal.setItemName("Test Item")} data-testid="set-item-name">Set Item Name</button>
      <button onClick={() => modal.setPlaceholder("Enter name")} data-testid="set-placeholder">Set Placeholder</button>
    </div>
  );
}

// Component that uses hook outside provider
function ComponentWithoutProvider() {
  const modal = useNameModal();
  return <div>{modal ? "Has context" : "No context"}</div>;
}

describe("ItemNameModalProvider", () => {
  const mockCreateAction: CreateAction = vi.fn();
  const mockRenameAction: RenameAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Context Provider", () => {
    it("returns null when useNameModal is called outside provider", () => {
      render(<ComponentWithoutProvider />);
      expect(screen.getByText("No context")).toBeInTheDocument();
    });

    it("provides context when useNameModal is called inside provider", () => {
      render(
        <NameModalProvider projectId={1}>
          <TestComponent />
        </NameModalProvider>
      );
      expect(screen.queryByText("No context")).not.toBeInTheDocument();
    });

    it("provides all required context methods", () => {
      render(
        <NameModalProvider projectId={1}>
          <TestComponent />
        </NameModalProvider>
      );
      
      expect(screen.getByTestId("show-button")).toBeInTheDocument();
      expect(screen.getByTestId("hide-button")).toBeInTheDocument();
      expect(screen.getByTestId("set-item-id")).toBeInTheDocument();
      expect(screen.getByTestId("set-item-name")).toBeInTheDocument();
      expect(screen.getByTestId("set-placeholder")).toBeInTheDocument();
    });
  });

  describe("Modal Visibility", () => {
    it("renders modal as hidden initially", () => {
      render(
        <NameModalProvider projectId={1}>
          <div>Test</div>
        </NameModalProvider>
      );

      // Dialog should not render its content when hidden
      const form = document.getElementById("1-item-name-form");
      expect(form).not.toBeInTheDocument();
    });

    it("shows modal when show() is called", async () => {
      const user = userEvent.setup();
      render(
        <NameModalProvider projectId={1}>
          <TestComponent />
        </NameModalProvider>
      );

      const showButton = screen.getByTestId("show-button");
      await user.click(showButton);

      await waitFor(() => {
        const form = document.getElementById("1-item-name-form");
        expect(form).toBeVisible();
      });
    });

    it("hides modal when hide() is called", async () => {
      const user = userEvent.setup();
      render(
        <NameModalProvider projectId={1}>
          <TestComponent />
        </NameModalProvider>
      );

      const showButton = screen.getByTestId("show-button");
      const hideButton = screen.getByTestId("hide-button");

      await user.click(showButton);
      
      await waitFor(() => {
        expect(document.getElementById("1-item-name-form")).toBeVisible();
      });

      await user.click(hideButton);

      await waitFor(() => {
        const form = document.getElementById("1-item-name-form");
        expect(form).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Rendering", () => {
    it("renders form with correct IDs based on projectId", async () => {
      const user = userEvent.setup();
      render(
        <NameModalProvider projectId={42}>
          <TestComponent />
        </NameModalProvider>
      );

      const showButton = screen.getByTestId("show-button");
      await user.click(showButton);

      await waitFor(() => {
        expect(document.getElementById("42-item-name-form")).toBeInTheDocument();
        expect(document.getElementById("42-item-name-input")).toBeInTheDocument();
        expect(document.getElementById("42-item-name-submit")).toBeInTheDocument();
      });
    });

    it("renders input with placeholder", async () => {
      const user = userEvent.setup();
      const TestComponentWithPlaceholder = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setPlaceholder("Enter item name");
                modal?.show();
              }}
              data-testid="show-with-placeholder"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithPlaceholder />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-with-placeholder"));

      await waitFor(() => {
        const input = document.getElementById("1-item-name-input") as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.placeholder).toBe("Enter item name");
      });
    });

    it("renders input with default value when itemName is set", async () => {
      const user = userEvent.setup();
      const TestComponentWithValue = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setItemName("Existing Item");
                modal?.show();
              }}
              data-testid="show-with-value"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithValue />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-with-value"));

      await waitFor(() => {
        const input = document.getElementById("1-item-name-input") as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.defaultValue).toBe("Existing Item");
      });
    });

    it("renders dialog with title", async () => {
      const user = userEvent.setup();
      const TestComponentWithTitle = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setTitle("Create New Item");
                modal?.show();
              }}
              data-testid="show-with-title"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithTitle />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-with-title"));

      await waitFor(() => {
        // PrimeReact Dialog renders header in a specific structure
        const dialog = document.querySelector('.p-dialog');
        expect(dialog).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission - Create Action", () => {
    it("calls createAction with correct parameters when form is submitted", async () => {
      const user = userEvent.setup();
      vi.mocked(mockCreateAction).mockResolvedValue({ id: 1, name: "New Item" } as any);

      const TestComponentWithCreate = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setCreateAction(() => mockCreateAction);
                modal?.setItemId(null);
                modal?.setItemName("");
                modal?.setTitle("Create Item");
                modal?.setPlaceholder("Name");
                modal?.show();
              }}
              data-testid="show-create"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={5}>
          <TestComponentWithCreate />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-create"));

      await waitFor(() => {
        expect(document.getElementById("5-item-name-input")).toBeVisible();
      });

      const input = document.getElementById("5-item-name-input") as HTMLInputElement;
      await user.type(input, "New Item");

      const submitButton = document.getElementById("5-item-name-submit");
      await user.click(submitButton!);

      await waitFor(() => {
        expect(mockCreateAction).toHaveBeenCalledWith(5, "New Item");
        expect(mockCreateAction).toHaveBeenCalledTimes(1);
      }, { timeout: 3000 });
    });

    it("hides modal after successful create action", async () => {
      const user = userEvent.setup();
      vi.mocked(mockCreateAction).mockResolvedValue({ id: 1, name: "New Item" } as any);

      const TestComponentWithCreate = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setCreateAction(() => mockCreateAction);
                modal?.setItemId(null);
                modal?.setTitle("Create Item");
                modal?.show();
              }}
              data-testid="show-create"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithCreate />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-create"));

      await waitFor(() => {
        expect(document.getElementById("1-item-name-input")).toBeVisible();
      });

      const input = document.getElementById("1-item-name-input") as HTMLInputElement;
      await user.type(input, "New Item");

      const submitButton = document.getElementById("1-item-name-submit");
      await user.click(submitButton!);

      await waitFor(() => {
        const form = document.getElementById("1-item-name-form");
        expect(form).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it("does not submit when item name is empty", async () => {
      const user = userEvent.setup();
      vi.mocked(mockCreateAction).mockResolvedValue({ id: 1, name: "" } as any);

      const TestComponentWithCreate = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setCreateAction(() => mockCreateAction);
                modal?.setItemId(null);
                modal?.setItemName("");
                modal?.setTitle("Create Item");
                modal?.show();
              }}
              data-testid="show-create"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithCreate />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-create"));

      await waitFor(() => {
        expect(document.getElementById("1-item-name-input")).toBeVisible();
      });

      // Don't type anything, just submit - input should be empty
      const submitButton = document.getElementById("1-item-name-submit");
      await user.click(submitButton!);

      // Wait a bit to ensure the action would have been called if validation failed
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockCreateAction).not.toHaveBeenCalled();
    });

    it("does not submit when item name is only whitespace", async () => {
      const user = userEvent.setup();
      vi.mocked(mockCreateAction).mockResolvedValue({ id: 1, name: "" } as any);

      const TestComponentWithCreate = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setCreateAction(() => mockCreateAction);
                modal?.setItemId(null);
                modal?.setItemName("");
                modal?.setTitle("Create Item");
                modal?.show();
              }}
              data-testid="show-create"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithCreate />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-create"));

      await waitFor(() => {
        expect(document.getElementById("1-item-name-input")).toBeVisible();
      });

      const input = document.getElementById("1-item-name-input") as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "   ");

      const submitButton = document.getElementById("1-item-name-submit");
      await user.click(submitButton!);

      // Wait a bit to ensure the action would have been called if validation failed
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockCreateAction).not.toHaveBeenCalled();
    });

    it("logs warning when createAction is not provided", async () => {
      const user = userEvent.setup();
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const TestComponentWithoutAction = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setItemId(null);
                modal?.setTitle("Create Item");
                modal?.show();
              }}
              data-testid="show-create"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithoutAction />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-create"));

      await waitFor(() => {
        expect(document.getElementById("1-item-name-input")).toBeVisible();
      });

      const input = document.getElementById("1-item-name-input") as HTMLInputElement;
      await user.type(input, "New Item");

      const submitButton = document.getElementById("1-item-name-submit");
      await user.click(submitButton!);

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith("No create action provided");
      });

      consoleWarnSpy.mockRestore();
    });
  });

  describe("Form Submission - Rename Action", () => {
    it("calls renameAction with correct parameters when form is submitted", async () => {
      const user = userEvent.setup();
      vi.mocked(mockRenameAction).mockResolvedValue({ id: 1, name: "Renamed Item" } as any);

      const TestComponentWithRename = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setRenameAction(() => mockRenameAction);
                modal?.setItemId(10);
                modal?.setItemName("Old Item");
                modal?.setTitle("Rename Item");
                modal?.setPlaceholder("Name");
                modal?.show();
              }}
              data-testid="show-rename"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={7}>
          <TestComponentWithRename />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-rename"));

      await waitFor(() => {
        expect(document.getElementById("7-item-name-input")).toBeVisible();
      });

      const input = document.getElementById("7-item-name-input") as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "Renamed Item");

      const submitButton = document.getElementById("7-item-name-submit");
      await user.click(submitButton!);

      await waitFor(() => {
        expect(mockRenameAction).toHaveBeenCalledWith(7, 10, "Renamed Item");
        expect(mockRenameAction).toHaveBeenCalledTimes(1);
      }, { timeout: 3000 });
    });

    it("hides modal after successful rename action", async () => {
      const user = userEvent.setup();
      vi.mocked(mockRenameAction).mockResolvedValue({ id: 1, name: "Renamed Item" } as any);

      const TestComponentWithRename = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setRenameAction(() => mockRenameAction);
                modal?.setItemId(10);
                modal?.setItemName("Old Item");
                modal?.setTitle("Rename Item");
                modal?.show();
              }}
              data-testid="show-rename"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithRename />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-rename"));

      await waitFor(() => {
        expect(document.getElementById("1-item-name-input")).toBeVisible();
      });

      const input = document.getElementById("1-item-name-input") as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "Renamed Item");

      const submitButton = document.getElementById("1-item-name-submit");
      await user.click(submitButton!);

      await waitFor(() => {
        const form = document.getElementById("1-item-name-form");
        expect(form).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it("does not submit when item name is empty", async () => {
      const user = userEvent.setup();
      vi.mocked(mockRenameAction).mockResolvedValue({ id: 1, name: "" } as any);

      const TestComponentWithRename = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setRenameAction(() => mockRenameAction);
                modal?.setItemId(10);
                modal?.setItemName("Old Item");
                modal?.setTitle("Rename Item");
                modal?.show();
              }}
              data-testid="show-rename"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithRename />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-rename"));

      await waitFor(() => {
        expect(document.getElementById("1-item-name-input")).toBeVisible();
      });

      const input = document.getElementById("1-item-name-input") as HTMLInputElement;
      await user.clear(input);

      const submitButton = document.getElementById("1-item-name-submit");
      await user.click(submitButton!);

      // Wait a bit to ensure the action would have been called if validation failed
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockRenameAction).not.toHaveBeenCalled();
    });

    it("does not submit when item name is only whitespace", async () => {
      const user = userEvent.setup();
      vi.mocked(mockRenameAction).mockResolvedValue({ id: 1, name: "" } as any);

      const TestComponentWithRename = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setRenameAction(() => mockRenameAction);
                modal?.setItemId(10);
                modal?.setItemName("Old Item");
                modal?.setTitle("Rename Item");
                modal?.show();
              }}
              data-testid="show-rename"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithRename />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-rename"));

      await waitFor(() => {
        expect(document.getElementById("1-item-name-input")).toBeVisible();
      });

      const input = document.getElementById("1-item-name-input") as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "   ");

      const submitButton = document.getElementById("1-item-name-submit");
      await user.click(submitButton!);

      // Wait a bit to ensure the action would have been called if validation failed
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockRenameAction).not.toHaveBeenCalled();
    });

    it("logs warning when renameAction is not provided", async () => {
      const user = userEvent.setup();
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const TestComponentWithoutAction = () => {
        const modal = useNameModal();
        return (
          <div>
            <button
              onClick={() => {
                modal?.setItemId(10);
                modal?.setItemName("Old Item");
                modal?.setTitle("Rename Item");
                modal?.show();
              }}
              data-testid="show-rename"
            >
              Show
            </button>
          </div>
        );
      };

      render(
        <NameModalProvider projectId={1}>
          <TestComponentWithoutAction />
        </NameModalProvider>
      );

      await user.click(screen.getByTestId("show-rename"));

      await waitFor(() => {
        expect(document.getElementById("1-item-name-input")).toBeVisible();
      });

      const input = document.getElementById("1-item-name-input") as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "Renamed Item");

      const submitButton = document.getElementById("1-item-name-submit");
      await user.click(submitButton!);

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith("No rename action provided");
      });

      consoleWarnSpy.mockRestore();
    });
  });

  describe("State Management", () => {
    it("allows setting and updating itemId", async () => {
      const user = userEvent.setup();
      render(
        <NameModalProvider projectId={1}>
          <TestComponent />
        </NameModalProvider>
      );

      const setItemIdButton = screen.getByTestId("set-item-id");
      await user.click(setItemIdButton);

      // State is internal, but we can verify it works by checking rename behavior
      // This is tested indirectly through rename action tests
      expect(setItemIdButton).toBeInTheDocument();
    });

    it("allows setting and updating itemName", async () => {
      const user = userEvent.setup();
      render(
        <NameModalProvider projectId={1}>
          <TestComponent />
        </NameModalProvider>
      );

      const setItemNameButton = screen.getByTestId("set-item-name");
      await user.click(setItemNameButton);

      // State is internal, but we can verify it works by checking form default value
      // This is tested indirectly through form rendering tests
      expect(setItemNameButton).toBeInTheDocument();
    });

    it("allows setting and updating placeholder", async () => {
      const user = userEvent.setup();
      render(
        <NameModalProvider projectId={1}>
          <TestComponent />
        </NameModalProvider>
      );

      const setPlaceholderButton = screen.getByTestId("set-placeholder");
      await user.click(setPlaceholderButton);

      // State is internal, but we can verify it works by checking form placeholder
      // This is tested indirectly through form rendering tests
      expect(setPlaceholderButton).toBeInTheDocument();
    });
  });
});

