import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Topbar from "./Topbar";

const mockGetUser = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChange = vi.fn(() => ({
  data: { subscription: { unsubscribe: vi.fn() } },
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
      signOut: mockSignOut,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}));

describe("Topbar — logged out", () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it("shows Sign in button", async () => {
    render(<Topbar />);
    expect(await screen.findByText("Sign in")).toBeInTheDocument();
  });

  it("does not show My trips button", async () => {
    render(<Topbar />);
    await screen.findByText("Sign in");
    expect(screen.queryByText("My trips")).not.toBeInTheDocument();
  });

  it("does not show Sign out button", async () => {
    render(<Topbar />);
    await screen.findByText("Sign in");
    expect(screen.queryByText("Sign out")).not.toBeInTheDocument();
  });

  it("shows TripAgent brand name", async () => {
    render(<Topbar />);
    expect(await screen.findByText("TripAgent")).toBeInTheDocument();
  });

  it("opens auth modal on Sign in click", async () => {
    render(<Topbar />);
    fireEvent.click(await screen.findByText("Sign in"));
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });
});

describe("Topbar — logged in", () => {
  const mockUser = { id: "user-1", email: "test@example.com" };

  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it("shows My trips button", async () => {
    render(<Topbar />);
    expect(await screen.findByText("My trips")).toBeInTheDocument();
  });

  it("shows Sign out button", async () => {
    render(<Topbar />);
    expect(await screen.findByText("Sign out")).toBeInTheDocument();
  });

  it("does not show Sign in button", async () => {
    render(<Topbar />);
    await screen.findByText("My trips");
    expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
  });

  it("calls signOut on Sign out click", async () => {
    mockSignOut.mockResolvedValue({});
    render(<Topbar />);
    fireEvent.click(await screen.findByText("Sign out"));
    expect(mockSignOut).toHaveBeenCalledOnce();
  });
});
