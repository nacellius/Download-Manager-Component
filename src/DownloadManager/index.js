import React, {useState} from "react";
import "./style.css";

const ITEM_STATUS = {
    available: "available",
    scheduled: "scheduled",
}

function DownloadManager({ data }) {
    // Load given download item data into a state
    const [downloadItems, setDownloadItems] = useState(data);

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
        return (
            <tr
                className="downloadTableItem"
                key={item.path}
                onClick={event => handleTableRowClick(event, index)}>
                <td className="itemCheckbox">
                    <input type="checkbox" checked={item.selected ?? false} readOnly/>
                </td>
                <td className="itemName">{item.name}</td>
                <td className="itemDevice">{item.device}</td>
                <td className="itemPath">{item.path}</td>
                <td className="itemAvailabilityIndicator">
                    {
                        item.status === ITEM_STATUS.available
                        ? <div className="availabilityIndicator" />
                        : null
                    }
                </td>
                <td className="itemStatus">{item.status}</td>
            </tr>
        )
    })


    return (
        <div className="downloadManager" >
            <div className="toolBar">
                <div className="main">
                    <label>
                        <input type="checkbox"/>
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
                        <th className="itemCheckbox"></th>
                        <th className="itemName">Name</th>
                        <th className="itemDevice">Device</th>
                        <th className="itemPath">Path</th>
                        <th className="itemAvailabilityIndicator"></th>
                        <th className="itemStatus">Status</th>
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
