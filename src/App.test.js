import React from 'react';
import App from './App';
import {render, cleanup, fireEvent} from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

const renderApp = () => render(<App/>);

afterEach(() => {
    cleanup()
});

const TEST_IDS = {
    files: "files",
    inputBox: "input-box"
}

let files, getByTestId, inputBox;

beforeEach(() => {
    const App = renderApp();
    getByTestId = App.getByTestId;
    files = getByTestId(TEST_IDS.files);
    inputBox = getByTestId(TEST_IDS.inputBox);
})

it("initially should display the file folder structure according to the given initialData along with one + sign", () => {
    expect(files.children[0].children).toHaveLength(5);
    expect(files.children[0].children[0].children[0]).toHaveTextContent("node_modules");
    expect(files.children[0].children[1].children[0]).toHaveTextContent("public");
    expect(files.children[0].children[1].children[0].children[0]).toHaveTextContent("[+]");
    expect(files.children[0].children[1].children).toHaveLength(1);
    expect(files.children[0].children[2].children[0]).toHaveTextContent("src");
    expect(files.children[0].children[2].children[0].children[0]).toHaveTextContent("[-]");
    expect(files.children[0].children[2].children).toHaveLength(2);
    expect(files.children[0].children[2].children[1].children).toHaveLength(3);
    expect(files.children[0].children[2].children[1].children[0].children[0]).toHaveTextContent("App.js");
    expect(files.children[0].children[2].children[1].children[1].children[0]).toHaveTextContent("components");
    expect(files.children[0].children[2].children[1].children[1].children[0].children[0]).toHaveTextContent("[+]");
    expect(files.children[0].children[2].children[1].children[1].children).toHaveLength(1);
    expect(files.children[0].children[3].children).toHaveLength(1);
    expect(files.children[0].children[3].children[0]).toHaveTextContent("Git");
    expect(files.children[0].children[3].children[0].children[0]).toHaveTextContent("[+]");
})

it("should display a + button after end of every sub-list", () => {
    fireEvent.doubleClick(files.children[0].children[0].children[0]);
    expect(files.children[0].children[0].children[0]).toHaveTextContent("node_modules");
    expect(files.children[0].children[0].children[0].children[0]).toHaveTextContent("[+]");
    fireEvent.click(files.children[0].children[0].children[0]);
    expect(files.children[0].children[0].children[0].children[0]).toHaveTextContent("[-]");
    expect(files.children[0].children[0].children[1].children[0].children[0]).toHaveTextContent("+");
    expect(files.children[0].children[2].children[1].children[2].children[0]).toHaveTextContent("+");
    expect(files.children[0].children[3].children[0].children[0]).toHaveTextContent("[+]");
    expect(files.children[0].children[4].children[0]).toHaveTextContent("+");
})

it('should do nothing on clicking the item if it has no sub files/folders', () => {
    fireEvent.click(files.children[0].children[0].children[0]);
    expect(files.children[0].children[0].children[0]).toHaveTextContent("node_modules");
    expect(files.children[0].children[0].children).toHaveLength(1);
    expect(files.children[0].children[0].children.length).toBe(1);
})

it('should make an item a folder on double clicking it', () => {
    fireEvent.doubleClick(files.children[0].children[0].children[0]);
    expect(files.children[0].children[0].children[0]).toHaveTextContent("node_modules");
    expect(files.children[0].children[0].children[0].children[0]).toHaveTextContent("[+]");
    fireEvent.click(files.children[0].children[0].children[0]);
    expect(files.children[0].children[0].children[0].children[0]).toHaveTextContent("[-]");
    expect(files.children[0].children[0].children[1].children[0].children[0]).toHaveTextContent("+");
})

it('should toggle the expansion of a file on clicking + or - sign of item', () => {
    expect(files.children[0].children[2].children[0]).toHaveTextContent("src");
    expect(files.children[0].children[2].children[0].children[0]).toHaveTextContent("[-]");
    expect(files.children[0].children[2].children).toHaveLength(2);
    expect(files.children[0].children[2].children[1].children).toHaveLength(3);
    fireEvent.click(files.children[0].children[2].children[0]);
    expect(files.children[0].children[2].children[0].children[0]).toHaveTextContent("[+]");
    expect(files.children[0].children[2].children).toHaveLength(1);
})

it('should add the file by taking filename from input box on clicking the + button', () => {
    fireEvent.change(inputBox, {target: {value: "NewFile"}});
    fireEvent.click(files.children[0].children[4].children[0]);
    expect(files.children[0].children[4].children[0]).toHaveTextContent("NewFile");
    expect(files.children[0].children).toHaveLength(6);
});

it("should clear the input box on adding a new file", () => {
    fireEvent.change(inputBox, {target: {value: "NewFile"}});
    fireEvent.click(files.children[0].children[4].children[0]);
    expect(files.children[0].children[4].children[0]).toHaveTextContent("NewFile");
    expect(files.children[0].children).toHaveLength(6);
    expect(inputBox).toHaveValue("");
})

it("should display an alert on clicking + button is input box is empty", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation();
    fireEvent.change(inputBox, {target: {value: ""}});
    fireEvent.click(files.children[0].children[4].children[0]);
    expect(alertMock).toHaveBeenCalledWith(
        "Please enter a file name in the input box"
    );
})