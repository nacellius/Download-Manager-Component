import { getByRole, render, screen, fireEvent } from "@testing-library/react"
import DownloadManager from "."

describe("DownloadManager component requirements", () => {
    const testData = [
        {name: 'item1', device: 'device1', path: 'path1', status: 'scheduled'},
        {name: 'item2', device: 'device2', path: 'path2', status: 'available'},
        {name: 'item3', device: 'device3', path: 'path3', status: 'scheduled'},
        {name: 'item4', device: 'device4', path: 'path4', status: 'available'},
        {name: 'item5', device: 'device5', path: 'path5', status: 'available'}
      ];

    it("DownloadManager should render", () => {
        render(<DownloadManager downloadData={[]}/>)
    });

    it("Only items that are 'available' should be able to be selected for download", () => {
        render(<DownloadManager downloadData={testData}/>)

        // check whether each row in the test data is checked or unchecked based on status 
        testData.forEach(testItem => {
            const testItemRow = screen.getByTestId("downloadTableRow" + testItem.path);
            const testItemRowCheckbox =
                screen.getByTestId("downloadTableRowCheckbox" + testItem.path);

            fireEvent.click(testItemRow);

            rowClickStatusCheck(testItem.status, testItemRow, testItemRowCheckbox);
        });
    });

    it("selectAllCheckbox should be unselected if no table items are selected", () => {
        render(<DownloadManager downloadData={testData}/>)
        const selectAllCheckbox = screen.getByTestId("selectAllCheckbox");

        // check that the default state is unchecked
        expect(selectAllCheckbox.checked).toBe(false);

        // check and then uncheck every available test data item
        testData.forEach(testItem => {
            fireEvent.click(screen.getByTestId("downloadTableRow" + testItem.path));
        });
        expect(selectAllCheckbox.checked).toBe(true);

        testData.forEach(testItem => {
            fireEvent.click(screen.getByTestId("downloadTableRow" + testItem.path));
        });

        // check that selectAllCheckbox is unchecked
        expect(selectAllCheckbox.checked).toBe(false);
        expect(selectAllCheckbox.indeterminate).toBe(false);
    });

    it("selectAllCheckbox should be selected if all table items are selected", () => {
        render(<DownloadManager downloadData={testData}/>)
        const selectAllCheckbox = screen.getByTestId("selectAllCheckbox");

        // set all available test data items as checked
        testData.forEach(testItem => {
            fireEvent.click(screen.getByTestId("downloadTableRow" + testItem.path));
        });

        // check that selectAllCheckbox is checked
        expect(selectAllCheckbox.checked).toBe(true);
        expect(selectAllCheckbox.indeterminate).toBe(false);
    });

    it("selectAllCheckbox should be indeterminate if some but not all items are selected", () => {
        render(<DownloadManager downloadData={testData}/>)
        const selectAllCheckbox = screen.getByTestId("selectAllCheckbox");

        // attempt to check just the first available test data item
        fireEvent.click(screen.getByTestId("downloadTableRow" + testData[1].path));

        // check that selectAllCheckbox is indeterminate
        expect(selectAllCheckbox.checked).toBe(false);
        expect(selectAllCheckbox.indeterminate).toBe(true);
    });

    it("selectAllCheckboxText should reflect the accurate count of selected items", () => {
        render(<DownloadManager downloadData={testData}/>)
        const selectAllCheckboxText = screen.getByTestId("selectAllCheckboxText");

        // attempt to check just two rows
        fireEvent.click(screen.getByTestId("downloadTableRow" + testData[1].path));
        fireEvent.click(screen.getByTestId("downloadTableRow" + testData[4].path));

        // check that selectAllCheckboxText shows the correct text
        expect(selectAllCheckboxText).toHaveTextContent("Selected 2");
    });

    it("selectAllCheckboxText should say 'None Selected' if no items are selected", () => {
        render(<DownloadManager downloadData={testData}/>)
        const selectAllCheckboxText = screen.getByTestId("selectAllCheckboxText");

        // check that selectAllCheckboxText shows the correct text when no items are
        // selected by default
        expect(selectAllCheckboxText).toHaveTextContent("None Selected");

        // check and then uncheck every available test data item
        testData.forEach(testItem => {
            fireEvent.click(screen.getByTestId("downloadTableRow" + testItem.path));
        });
        expect(selectAllCheckboxText).toHaveTextContent("Selected 3");

        testData.forEach(testItem => {
            fireEvent.click(screen.getByTestId("downloadTableRow" + testItem.path));
        });

        // check that selectAllCheckboxText shows the correct text when no items are selected
        expect(selectAllCheckboxText).toHaveTextContent("None Selected");
    });
    
    it("Clicking selectAllCheckbox should select all available items if none are selected", () => {
        render(<DownloadManager downloadData={testData}/>)
        const selectAllCheckbox = screen.getByTestId("selectAllCheckbox");
        const selectAllCheckboxText = screen.getByTestId("selectAllCheckboxText");

        // check that we start with none selected
        expect(selectAllCheckboxText).toHaveTextContent("None Selected");

        // attempt to check selectAllCheckbox
        fireEvent.click(selectAllCheckbox);

        // check that all items with status 'available' have been selected
        testData.forEach(testItem => {
            const testItemRow = screen.getByTestId("downloadTableRow" + testItem.path);
            const testItemRowCheckbox =
                screen.getByTestId("downloadTableRowCheckbox" + testItem.path);

            rowClickStatusCheck(testItem.status, testItemRow, testItemRowCheckbox);
        });
    });

    it("Clicking selectAllCheckbox should select all items if some are selected", () => {
        render(<DownloadManager downloadData={testData}/>)
        const selectAllCheckbox = screen.getByTestId("selectAllCheckbox");

        // attempt to select two of the three available rows
        fireEvent.click(screen.getByTestId("downloadTableRow" + testData[1].path));
        fireEvent.click(screen.getByTestId("downloadTableRow" + testData[3].path));

        // attempt to check selectAllCheckbox
        fireEvent.click(selectAllCheckbox);

        // check that the last available item number five has been checked
        const testItem5CheckBox = screen.getByTestId("downloadTableRowCheckbox" + testData[4].path);
        expect(testItem5CheckBox.checked).toBe(true);
    });

    it("Clicking selectAllCheckbox should deselect all items if all are selected", () => {
        render(<DownloadManager downloadData={testData}/>)
        const selectAllCheckbox = screen.getByTestId("selectAllCheckbox");

        // set all available test data item rows as checked
        testData.forEach(testItem => {
            fireEvent.click(screen.getByTestId("downloadTableRow" + testItem.path));
        });

        // check that selectAllCheckbox is checked
        expect(selectAllCheckbox.checked).toBe(true);
        expect(selectAllCheckbox.indeterminate).toBe(false);

        // attempt to check selectAllCheckbox
        fireEvent.click(selectAllCheckbox);

        // check that all rows are now unchecked
        testData.forEach(testItem => {
            const testItemRowCheckBox = screen.getByTestId("downloadTableRowCheckbox" + testItem.path);
            expect(testItemRowCheckBox.checked).toBe(false);
        });
    });

    it("downloadTable 'status' text should start with a capital case", () => {
        render(<DownloadManager downloadData={testData}/>)
        testData.forEach(testItem => {
            const itemStatus = screen.getByTestId("itemStatusColumn" + testItem.path);
            console.log(itemStatus)
            expect(itemStatus).toHaveTextContent(testItem.status[0].toUpperCase());
        });
    });

})

/**
 * Helper for checking if a row's status is correct based on a the respsective
 * test item's status
 * @param {string} test item status value
 * @param {object} object reference to testItemRow from a render
 * @param {object} object reference to testItemRowCheckbox from a render
 * (see https://testing-library.com/docs/queries/bytestid)
 */
function rowClickStatusCheck(testItemStatus, testItemRow, testItemRowCheckbox) {
    if (testItemStatus === "available") {
        expect(testItemRow.className.includes("selectedItem")).toBe(true);
        expect(testItemRow.className.includes("disabledItem")).toBe(false);
        expect(testItemRowCheckbox.checked).toBe(true);
    } else {
        expect(testItemRow.className.includes("selectedItem")).toBe(false);
        expect(testItemRow.className.includes("disabledItem")).toBe(true);
        expect(testItemRowCheckbox.checked).toBe(false);
    }
}
