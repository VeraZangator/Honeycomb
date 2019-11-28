import React from "react";
import Bioedit from "./bioedit";
import { render, fireEvent, wait } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

test("When no bio is passed to it, an Add button is rendered", () => {
    const { container } = render(<Bioedit />);
    expect(container.querySelector("button").innerHTML).toBe("Add bio now!");
});

test("When a bio is passed to it, an Edit button is rendered.", () => {
    const { container } = render(<Bioedit bio="hola" />);
    expect(container.querySelector("button").innerHTML).toBe("Edit Bio");
});

test("Clicking either the Add or Edit button causes a textarea and a Save button to be rendered.", () => {
    const { container } = render(<Bioedit />);

    fireEvent.click(container.querySelector("button"));

    expect(container.querySelector(".edit").children.length).toBe(2);
});

test("Clicking the Save button causes an ajax request.", () => {
    axios.post.mockResolvedValue({ bio: "hola" });
    const { container } = render(<Bioedit />);

    fireEvent.click(container.querySelector("button"));
    fireEvent.click(container.querySelector(".save"));

    expect(axios.post).toBeCalledTimes(1);

    // await waitForElement(() => container.querySelector("p"));
});

test("When the mock request is successful, the function that was passed as a prop to the component gets called", async () => {
    axios.post.mockResolvedValue({ data: { bio: "hola" } });
    const setBio = jest.fn();
    const { container } = render(<Bioedit bio="hola" setBio={setBio} />);

    fireEvent.click(container.querySelector("button"));
    fireEvent.click(container.querySelector(".save"));
    fireEvent.click(container.querySelector(".save"));
    await wait();
    expect(setBio.mock.calls.length).toBe(2);
});
