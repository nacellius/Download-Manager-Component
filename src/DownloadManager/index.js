import React, {createRef, useState} from "react";
import "./style.css";
import downloadIcon from "../assets/download.svg";

const ITEM_STATUS = {
    available: "available",
    scheduled: "scheduled",
}

const CHECKBOX_STATES = {
    checked: "checked",
    unchecked: "unchecked",
    indeterminate: "indeterminate",
}

function DownloadManager({ data }) {
    // Load given download item data into a state
    const [downloadItems, setDownloadItems] = useState(data);
    const [selectedNumberTotal, setselectedNumberTotal] = useState(0);
    const [mainCheckboxState, setMainCheckboxState] = useState(CHECKBOX_STATES.unchecked);

    const mainCheckbox = createRef();

    // Update download item's "selected" value when table item is clicked
    const handleTableRowClick = (index) => {
        // Disallow selecting of unavailable items
        if (downloadItems[index].status !== ITEM_STATUS.available) {
            return null;
        }

        const newDownloadItems = [...downloadItems];
        const newSelectedValue = !downloadItems[index].selected;
        newDownloadItems[index] =
        {
            ...downloadItems[index],
            selected: newSelectedValue
        };

        // Update number of total selected items
        if (newSelectedValue) {
            setselectedNumberTotal(selectedNumberTotal + 1);
        } else {
            setselectedNumberTotal(selectedNumberTotal - 1);
        }

        setDownloadItems(newDownloadItems);
    }

    // Handle downloading for the user
    const handleDownloadButtonClick = () => {
        let selectedItems = "Files selected for download: \n";
        downloadItems.forEach(item => {
            if (item.selected) {
                selectedItems = selectedItems.concat(`• Device: ${item.device}, Path: ${item.path} \n`)
            }
        });
        alert(selectedItems);
    }

    // Create a table item for each download item in the data
    const downloadsTableItems = downloadItems.map( (item, index) => {
        const availability = item.status === ITEM_STATUS.available;
        const selected = item.selected ?? false;
        return (
            <tr
                className={`downloadTableItem ${selected && "availableItem"}`}
                key={item.path}
                onClick={() => handleTableRowClick(index)}>
                <td className="itemCheckboxColumn">
                    <input type="checkbox" checked={selected} readOnly/>
                </td>
                <td className="itemNameColumn">{item.name}</td>
                <td className="itemDeviceColumn">{item.device}</td>
                <td className="itemPathColumn">
                    {item.path}
                </td>
                <td className="itemAvailabilityColumn">
                    <div className="availabilityIndicatorContainer">
                        {availability ? <div className="availabilityIndicator" /> : null}
                    </div>
                </td>
                <td className="itemStatusColumn">{item.status}</td>
            </tr>
        )
    })


    return (
        <div className="downloadManager" >
            <div className="toolBar">
                <label className="mainCheckbox">
                    <input ref={mainCheckbox} type="checkbox"/>
                    <span className="mainCheckboxText">
                        {
                            selectedNumberTotal > 0
                                ? `Selected ${selectedNumberTotal}` 
                                : "None Selected"
                        }
                    </span>
                </label>
                <div
                    className="downloadButton"
                    onClick={() => handleDownloadButtonClick()}>
                    <img className="downloadIcon" src={downloadIcon} alt="Download icon"/>
                    Download Selected
                </div>
            </div>

            <table className="downloadsTable">
                <thead className="downloadsTableHeader">
                    <tr>
                        <th className="itemCheckboxColumn"></th>
                        <th className="itemNameColumn">Name</th>
                        <th className="itemDeviceColumn">Device</th>
                        <th className="itemPathColumn">Path</th>
                        <th className="itemAvailabilityColumn"></th>
                        <th className="itemStatusColumn">Status</th>
                    </tr>
                </thead>
                <tbody className="downloadsTableBody">
                    {downloadsTableItems}
                </tbody>
            </table>
        </div>
    )
}

export default DownloadManager;
