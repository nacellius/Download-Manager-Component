import React from "react";
import PropTypes from "prop-types";
import { ITEM_STATUS } from "../../Constants";
import "./style.css";

function DownloadsTable({downloadItems, handleRowClick}) {
    // Create a table item for each download item in the given data
    const downloadsTableItems = downloadItems.map( (item, index) => {
        const availability = item.status === ITEM_STATUS.available;
        const selected = item.selected ?? false;
        // TODO: should we consider using i18n here instead?
        const formattedStatus = item.status[0].toUpperCase() + item.status.slice(1).toLowerCase();

        return (
            <tr
                className={`downloadTableItem ${selected && "selectedItem"}`}
                key={item.path}
                onClick={() => handleRowClick(index)}>
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
                        {availability ? <div className="availabilityIndicator"/> : null}
                    </div>
                </td>
                <td className="itemStatusColumn">{formattedStatus}</td>
            </tr>
        )
    })


    return (
        <table className="downloadsTable">
        <thead>
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
    );
}

DownloadsTable.propTypes = {
    downloadItems: PropTypes.array,
    handleRowClick: PropTypes.func,
}

export default DownloadsTable;
