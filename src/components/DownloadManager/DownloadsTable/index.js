import React from "react";
import PropTypes from "prop-types";
import { ITEM_STATUS } from "../../../Constants";
import "./style.css";

function DownloadsTable({downloadItems, handleRowClick}) {
    // Create a table item for each download item in the given data
    const downloadsTableItems = downloadItems.map( (item, index) => {
        const itemCheckboxId = "downloadItemCheckbox" + index;
        const itemAvailable = item.status === ITEM_STATUS.available;
        const itemSelected = item.selected ?? false;
        // TODO: should we consider using i18n here instead?
        const formattedStatus = item.status && item.status[0].toUpperCase()
            + item.status.slice(1).toLowerCase();

        return (
            <tr
                className={`downloadTableItem ${itemSelected && "selectedItem"} ${!itemAvailable && "disabledItem"}`}
                key={item.path}
                data-testid={"downloadTableRow" + item.path}
                tabIndex="0"
                role="button"
                aria-disabled={!itemAvailable}
                onClick={() => handleRowClick(index)}>
                <td className="itemCheckboxColumn">
                    <input
                        id={itemCheckboxId}
                        data-testid={"downloadTableRowCheckbox" + item.path}
                        type="checkbox"
                        checked={itemSelected}
                        disabled={!itemAvailable}
                        readOnly/>
                   <label className="hiddenAccessibilityLabel" htmlFor={itemCheckboxId}>
                       Checkbox for item {item.name} with path {item.path} on device {item.device}
                   </label>
                </td>
                <td className="itemNameColumn">
                    {item.name}
                </td>
                <td className="itemDeviceColumn">
                    {item.device}
                </td>
                <td className="itemPathColumn">
                    {item.path}
                </td>
                <td className="itemAvailabilityColumn">
                    <div className="availabilityIndicatorContainer">
                        {itemAvailable ? <div className="availabilityIndicator"/> : null}
                    </div>
                </td>
                <td className="itemStatusColumn" data-testid={"itemStatusColumn" + item.path} >
                   {formattedStatus}
                </td>
            </tr>
        )
    })


    return (
        <table className="downloadsTable">
        <thead>
            <tr>
                <th className="itemCheckboxColumn" aria-label="CheckboxColumn"></th>
                <th className="itemNameColumn">Name</th>
                <th className="itemDeviceColumn">Device</th>
                <th className="itemPathColumn">Path</th>
                <th className="itemAvailabilityColumn" aria-label="AvailabilityIndicator"></th>
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
