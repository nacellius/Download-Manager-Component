import React, {useState} from "react";
import "./style.css";

function DownloadManager({ data }) {

    const [downloadItems, setDownloadItems] = useState(data);

    const handleTableRowClick = (event) => {
        console.log(event);
        // TODO: handle row click selection
    }
    
    const downloadsTableItems = downloadItems.map( (item) => {
        return (
            <tr
                className="downloadTableItem"
                key={item.path}
                onClick={event => handleTableRowClick(event)}>
                <td className="itemCheckbox"><input type="checkbox" value={item.selected ?? false}/></td>
                <td className="itemName">{item.name}</td>
                <td className="itemDevice">{item.device}</td>
                <td className="itemPath">{item.path}</td>
                <td className="itemAvailabilityIndicator">
                    {
                        item.status === "available"
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
                <div className="selectedItems">
                    <label>
                        <input type="checkbox" />
                        {
                            downloadItems.length > 0
                                ? `Selected ${downloadItems.length}` 
                                : "None Selected"
                        }
                    </label>
                </div>
                <div className="downloadSelected">Download Selected</div>
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
