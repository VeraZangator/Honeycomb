import React from "react";
import ProfilePic from "./profile-pic";
import { render, fireEvent } from "@testing-library/react";

test("renders img with src set to image prop", () => {
    const { container } = render(<ProfilePic image="/dog.jpg" />);
    expect(container.querySelector("img").getAttribute("src")).toBe("/dog.jpg");
});

test("renders img with src set to /profi.jpg when no image prop is passed", () => {
    const { container } = render(<ProfilePic />);
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "/profi.jpg"
    );
});

test("renders first and last props in alt attr", () => {
    const { container } = render(<ProfilePic first="vera" last="zang" />);
    expect(container.querySelector("img").getAttribute("alt")).toBe(
        "vera zang"
    );
});

test("onClick prop gets called when img is clicked", () => {
    const toggleModal = jest.fn();
    const { container } = render(<ProfilePic toggleModal={toggleModal} />);

    fireEvent.click(container.querySelector("img"));

    fireEvent.click(container.querySelector("img"));

    fireEvent.click(container.querySelector("img"));

    expect(toggleModal.mock.calls.length).toBe(3);
});
