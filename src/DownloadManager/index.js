import React, {createRef, useState} from "react";
import "./style.css";

const ITEM_STATUS = {
    available: "available",
    scheduled: "scheduled",
}

function DownloadManager({ data }) {
    // Load given download item data into a state
    const [downloadItems, setDownloadItems] = useState(data);

    const mainCheckbox = createRef();

    // Update download item's "selected" value when table item is clicked
    const handleTableRowClick = (event, index) => {
        const newDownloadItems = [...downloadItems];
        newDownloadItems[index] =
        {
            ...downloadItems[index],
            selected: !downloadItems[index].selected
        };

        setDownloadItems(newDownloadItems);
    }


    // Create table item for each download item in the data
    const downloadsTableItems = downloadItems.map( (item, index) => {
        const availability = item.status === ITEM_STATUS.available;
        const selected = item.selected ?? false;
        return (
            <tr
                className={`downloadTableItem ${selected && "availableItem"}`}
                key={item.path}
                onClick={event => handleTableRowClick(event, index)}>
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
                <div className="main">
                    <label>
                        <input ref={mainCheckbox} type="checkbox"/>
                        {
                            downloadItems.length > 0
                                ? `Selected ${downloadItems.length}` 
                                : "None Selected"
                        }
                    </label>
                </div>
                <div className="downloadButton">Download Selected</div>
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
