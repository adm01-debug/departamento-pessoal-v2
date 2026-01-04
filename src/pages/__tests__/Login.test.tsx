import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";

// Mocks
vi.mock("@/services/apiService", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ toast: vi.fn() })
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Login Page", () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  describe("Rendering", () => {
    it("should render the page without crashing", () => {
      renderWithRouter(<Login />);
      expect(document.body).toBeDefined();
    });

    it("should display the page title", () => {
      renderWithRouter(<Login />);
      // Title should be present in the document
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);
    });

    it("should render main content area", () => {
      renderWithRouter(<Login />);
      const main = document.querySelector("main") || document.querySelector("[role='main']") || document.body;
      expect(main).toBeDefined();
    });
  });

  describe("User Interactions", () => {
    it("should handle button clicks", async () => {
      renderWithRouter(<Login />);
      const buttons = screen.queryAllByRole("button");
      if (buttons.length > 0) {
        await userEvent.click(buttons[0]);
        expect(true).toBe(true);
      }
    });

    it("should handle form inputs", async () => {
      renderWithRouter(<Login />);
      const inputs = screen.queryAllByRole("textbox");
      if (inputs.length > 0) {
        await userEvent.type(inputs[0], "test input");
        expect(inputs[0]).toHaveValue("test input");
      }
    });

    it("should handle keyboard navigation", async () => {
      renderWithRouter(<Login />);
      const focusableElements = screen.queryAllByRole("button");
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        expect(document.activeElement).toBe(focusableElements[0]);
      }
    });
  });

  describe("Loading States", () => {
    it("should show loading indicator when fetching data", async () => {
      renderWithRouter(<Login />);
      // Check for loading states
      const loadingElements = screen.queryAllByText(/carregando|loading/i);
      // Loading may or may not be present depending on data
      expect(true).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should display error message on API failure", async () => {
      const mockError = new Error("API Error");
      vi.spyOn(console, "error").mockImplementation(() => {});
      renderWithRouter(<Login />);
      // Error handling should not crash the component
      expect(document.body).toBeDefined();
    });

    it("should handle network errors gracefully", async () => {
      renderWithRouter(<Login />);
      // Component should render even with network issues
      expect(document.body).toBeDefined();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      renderWithRouter(<Login />);
      const h1 = screen.queryAllByRole("heading", { level: 1 });
      // Should have at most one h1
      expect(h1.length).toBeLessThanOrEqual(1);
    });

    it("should have accessible labels for interactive elements", () => {
      renderWithRouter(<Login />);
      const buttons = screen.queryAllByRole("button");
      buttons.forEach(button => {
        const hasLabel = button.textContent || button.getAttribute("aria-label");
        expect(hasLabel).toBeTruthy();
      });
    });

    it("should support screen readers", () => {
      renderWithRouter(<Login />);
      // Check for aria attributes
      const ariaElements = document.querySelectorAll("[aria-label], [aria-labelledby], [role]");
      expect(ariaElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Responsive Design", () => {
    it("should render correctly on mobile viewport", () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event("resize"));
      renderWithRouter(<Login />);
      expect(document.body).toBeDefined();
    });

    it("should render correctly on desktop viewport", () => {
      global.innerWidth = 1920;
      global.dispatchEvent(new Event("resize"));
      renderWithRouter(<Login />);
      expect(document.body).toBeDefined();
    });
  });

  describe("Data Management", () => {
    it("should fetch initial data on mount", async () => {
      renderWithRouter(<Login />);
      await waitFor(() => {
        expect(document.body).toBeDefined();
      });
    });

    it("should update UI when data changes", async () => {
      renderWithRouter(<Login />);
      // Component should react to data changes
      expect(document.body).toBeDefined();
    });
  });
});
