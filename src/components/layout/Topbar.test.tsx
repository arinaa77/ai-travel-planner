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

describe("Topbar — new trip confirmation", () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it("shows confirmation dialog on New trip click", async () => {
    render(<Topbar />);
    fireEvent.click(await screen.findByText("New trip ✈︎"));
    expect(screen.getByText("Start a new trip?")).toBeInTheDocument();
  });

  it("dismisses dialog on Cancel", async () => {
    render(<Topbar />);
    fireEvent.click(await screen.findByText("New trip ✈︎"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Start a new trip?")).not.toBeInTheDocument();
  });

  it("dispatches tripmind_new_trip event and closes on confirm", async () => {
    const handler = vi.fn();
    window.addEventListener("tripmind_new_trip", handler);

    render(<Topbar />);
    fireEvent.click(await screen.findByText("New trip ✈︎"));
    fireEvent.click(screen.getByText("Yes, reset"));

    expect(handler).toHaveBeenCalledOnce();
    expect(screen.queryByText("Start a new trip?")).not.toBeInTheDocument();

    window.removeEventListener("tripmind_new_trip", handler);
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

  it("opens MyTripsPanel on My trips click", async () => {
    render(<Topbar />);
    fireEvent.click(await screen.findByText("My trips"));
    expect(screen.getByRole("heading", { name: /my trips/i })).toBeInTheDocument();
  });
});

describe("Topbar — auth state change", () => {
  it("dispatches tripmind_trips_updated when auth state changes", async () => {
    type AuthCb = (event: string, session: { user: { id: string } } | null) => void;
    let authCallback: AuthCb | null = null;
    mockOnAuthStateChange.mockImplementation((...args: unknown[]) => {
      authCallback = args[0] as AuthCb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const handler = vi.fn();
    window.addEventListener("tripmind_trips_updated", handler);

    render(<Topbar />);
    authCallback!("SIGNED_IN", { user: { id: "user-2" } });

    expect(handler).toHaveBeenCalledOnce();
    window.removeEventListener("tripmind_trips_updated", handler);
  });

  it("sets user to null when session is null on auth state change", async () => {
    type AuthCb = (event: string, session: null) => void;
    let authCallback: AuthCb | null = null;
    mockOnAuthStateChange.mockImplementation((...args: unknown[]) => {
      authCallback = args[0] as AuthCb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    render(<Topbar />);
    authCallback!("SIGNED_OUT", null);

    expect(await screen.findByText("Sign in")).toBeInTheDocument();
  });
});
