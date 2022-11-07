import React, {createRef, useEffect, useState} from "react";
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
    // Initialize needed states
    const [downloadItems, setDownloadItems] = useState(data);
    const [selectedTotal, setSelectedTotal] = useState(0);
    const [mainCheckboxState, setMainCheckboxState] = useState(CHECKBOX_STATES.unchecked);

    const mainCheckbox = createRef();


    // Update download item's "selected" value when table item is clicked
    const handleTableRowClick = (index) => {
        // Disallow selection of non-available items
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
            setSelectedTotal(selectedTotal + 1);
        } else {
            setSelectedTotal(selectedTotal - 1);
        }

        setDownloadItems(newDownloadItems);
    }

    // Handle downloading for the user
    const handleDownloadButtonClick = () => {
        let selectedItems = "Files selected for download: \n";
        downloadItems.forEach(item => {
            if (item.selected) {
                selectedItems = selectedItems.concat(`• Device: ${item.device}, Path: ${item.path} \n`);
            }
        });
        alert(selectedItems);
    }

    const handleMainCheckboxChange = () => {
        let newDownloadItems = [];
        let newselectedTotal = 0;

        if (mainCheckboxState !== CHECKBOX_STATES.checked) {
            // De-select all items if all are selected
            downloadItems.forEach(item => {
                // only allow selecting available items 
                if (item.status === ITEM_STATUS.available) {
                    newDownloadItems.push({...item, selected: true});
                    newselectedTotal++;
                } else {
                    newDownloadItems.push(item);
                }
            });
        } else {
            // Select all items if none are selected, or some are selected
            downloadItems.forEach(item => {
                newDownloadItems.push({...item, selected: false});
            });
        }

        setSelectedTotal(newselectedTotal);
        setDownloadItems(newDownloadItems);
    }

    // Update the main checkbox's "checked" and "indeterminate" properties whenever
    // an item is selected/unselected
    useEffect(() => {
        if (selectedTotal === downloadItems.length) {
            setMainCheckboxState(CHECKBOX_STATES.checked);
            mainCheckbox.current.checked = true;
            mainCheckbox.current.indeterminate = false;
        } else if (selectedTotal === 0) {
            setMainCheckboxState(CHECKBOX_STATES.unchecked);
            mainCheckbox.current.checked = false;
            mainCheckbox.current.indeterminate = false;
        } else {
            setMainCheckboxState(CHECKBOX_STATES.indeterminate);
            mainCheckbox.current.checked = false;
            mainCheckbox.current.indeterminate = true;
        }
    }, [selectedTotal, downloadItems, mainCheckbox]);


    // Create a table item for each download item in the data
    const downloadsTableItems = downloadItems.map( (item, index) => {
        const availability = item.status === ITEM_STATUS.available;
        const selected = item.selected ?? false;
        // TODO: consider using i18n here instead
        const formattedStatus = item.status[0].toUpperCase() + item.status.slice(1).toLowerCase();
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
                <td className="itemStatusColumn">{formattedStatus}</td>
            </tr>
        )
    })


    return (
        <div className="downloadManager" >
            <div className="toolBar">
                <label className="mainCheckbox">
                    <input
                        ref={mainCheckbox}
                        type="checkbox"
                        onChange={() => handleMainCheckboxChange()}/>
                    <span className="mainCheckboxText">
                        {
                            selectedTotal > 0
                                ? `Selected ${selectedTotal}` 
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
