import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthModal from "./AuthModal";

// Mock the Supabase browser client
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
    },
  }),
}));

describe("AuthModal — structure", () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockSignUp.mockReset();
  });

  it("renders sign in heading by default", () => {
    render(<AuthModal onClose={vi.fn()} onSuccess={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<AuthModal onClose={vi.fn()} onSuccess={vi.fn()} />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("renders close button", () => {
    render(<AuthModal onClose={vi.fn()} onSuccess={vi.fn()} />);
    expect(screen.getByText("×")).toBeInTheDocument();
  });

  it("calls onClose when × is clicked", () => {
    const onClose = vi.fn();
    render(<AuthModal onClose={onClose} onSuccess={vi.fn()} />);
    fireEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe("AuthModal — mode toggle", () => {
  it("switches to sign up mode", () => {
    render(<AuthModal onClose={vi.fn()} onSuccess={vi.fn()} />);
    fireEvent.click(screen.getByText("Sign up"));
    expect(screen.getByText("Create account")).toBeInTheDocument();
  });

  it("switches back to sign in mode", () => {
    render(<AuthModal onClose={vi.fn()} onSuccess={vi.fn()} />);
    fireEvent.click(screen.getByText("Sign up"));
    fireEvent.click(screen.getByText("Sign in"));
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });
});

describe("AuthModal — auth errors", () => {
  it("shows error message on sign in failure", async () => {
    mockSignIn.mockResolvedValue({ error: { message: "Invalid credentials" } });
    render(<AuthModal onClose={vi.fn()} onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("calls onClose and onSuccess on sign in success", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    render(<AuthModal onClose={onClose} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    await screen.findByText("Sign in"); // wait for async to settle
    expect(onClose).toHaveBeenCalledOnce();
    expect(onSuccess).toHaveBeenCalledOnce();
  });
});
