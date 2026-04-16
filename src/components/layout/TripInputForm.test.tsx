import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TripInputForm from "./TripInputForm";

describe("TripInputForm", () => {
  it("renders destination input", () => {
    render(<TripInputForm />);
    expect(screen.getByPlaceholderText("Tokyo, Japan")).toBeInTheDocument();
  });

  it("renders duration and budget inputs", () => {
    render(<TripInputForm />);
    expect(screen.getByText(/Duration/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget \(USD\)/i)).toBeInTheDocument();
  });

  it("renders all travel style buttons", () => {
    render(<TripInputForm />);
    expect(screen.getByRole("button", { name: /Adventure/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cultural/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Relaxation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Foodie/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Budget/i })).toBeInTheDocument();
  });

  it("renders Generate button", () => {
    render(<TripInputForm />);
    expect(screen.getByRole("button", { name: /Generate/i })).toBeInTheDocument();
  });

  it("updates destination input value", () => {
    render(<TripInputForm />);
    const input = screen.getByPlaceholderText("Tokyo, Japan");
    fireEvent.change(input, { target: { value: "Paris" } });
    expect(input).toHaveValue("Paris");
  });

  it("updates days input value", () => {
    render(<TripInputForm />);
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "7" } });
    expect(inputs[0]).toHaveValue(7);
  });

  it("updates budget input value", () => {
    render(<TripInputForm />);
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[1], { target: { value: "3000" } });
    expect(inputs[1]).toHaveValue(3000);
  });

  it("selects a travel style on button click", () => {
    render(<TripInputForm />);
    const adventureBtn = screen.getByRole("button", { name: /Adventure/i });
    fireEvent.click(adventureBtn);
    expect(adventureBtn.className).toContain("violet");
  });

  it("calls onGenerate with correct values on submit", () => {
    const onGenerate = vi.fn();
    render(<TripInputForm onGenerate={onGenerate} />);

    fireEvent.change(screen.getByPlaceholderText("Tokyo, Japan"), {
      target: { value: "Tokyo" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Generate/i }).closest("form")!);

    expect(onGenerate).toHaveBeenCalledWith({
      destination: "Tokyo",
      days: 5,
      budget: 2000,
      style: "Cultural",
    });
  });

  it("does not crash when onGenerate is not provided", () => {
    render(<TripInputForm />);
    fireEvent.change(screen.getByPlaceholderText("Tokyo, Japan"), {
      target: { value: "Tokyo" },
    });
    expect(() =>
      fireEvent.submit(screen.getByRole("button", { name: /Generate/i }).closest("form")!)
    ).not.toThrow();
  });
});
