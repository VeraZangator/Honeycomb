import React from "react";
import App from "./app";
import { render, waitForElement } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

test("App shows nothing at first", async () => {
    axios.get.mockResolvedValue({
        data: {
            bio: "",
            email: "hola",
            first: "Bonita",
            id: 25,
            image: "vera.jpg",
            last: "za"
        }
    });
    const { container } = render(<App />);

    expect(container.children.length).toBe(0);

    await waitForElement(() => container.querySelector("div"));

    expect(container.children.length).toBe(1);
});
