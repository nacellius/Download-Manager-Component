import React, {useEffect, useState, useRef} from "react";
import PropTypes from "prop-types";
import DownloadsTable from "./DownloadsTable";
import SelectAllCheckbox from "./SelectAllCheckbox";
import { ITEM_STATUS, CHECKBOX_STATES } from "../../Constants";
import "./style.css";
import downloadIcon from "../../assets/download.svg";

function DownloadManager({downloadData}) {
    // Initialize needed states
    const [downloadItems, setDownloadItems] = useState(downloadData);
    const [selectedTotal, setSelectedTotal] = useState(0);
    const [selectAllCheckboxState, setSelectAllCheckboxState] = useState(CHECKBOX_STATES.unchecked);
    let totalAvailable = useRef(null);

    // Initialize total number of available items
    useEffect(() => {
        totalAvailable.current = 0;
        downloadItems.forEach(item => {
            if (item.status === ITEM_STATUS.available) {
                totalAvailable.current = totalAvailable.current + 1;
            }
        });
    }, [])

    // Update the main checkbox's "checked" and "indeterminate" properties whenever
    // an item is selected/unselected
    useEffect(() => {
        if (selectedTotal === totalAvailable.current) {
            setSelectAllCheckboxState(CHECKBOX_STATES.checked);
        } else if (selectedTotal === 0) {
            setSelectAllCheckboxState(CHECKBOX_STATES.unchecked);
        } else {
            setSelectAllCheckboxState(CHECKBOX_STATES.indeterminate);
        }
    }, [selectedTotal, downloadItems]);

    // Update download item's "selected" value when a table item is clicked
    const handleRowClick = (index) => {
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
        let selectedItems = "Files selected and available for download: \n \n";

        downloadItems.forEach(item => {
            if (item.selected && item.status === ITEM_STATUS.available) {
                selectedItems =
                    selectedItems.concat(`• Device: ${item.device}, Path: ${item.path} \n`);
            }
        });

        alert(selectedItems);
    }

    // Handle main checkbox clicks
    const handleSelectAllCheckboxChange = () => {
        let newDownloadItems = [];
        let newselectedTotal = 0;

        // De-select all items if all are selected
        if (selectAllCheckboxState !== CHECKBOX_STATES.checked) {
            downloadItems.forEach(item => {
                // only select available items 
                if (item.status === ITEM_STATUS.available) {
                    newDownloadItems.push({...item, selected: true});
                    newselectedTotal++;
                } else {
                    newDownloadItems.push(item);
                }
            });

        // Select all items if none are selected, or some are selected
        } else {
            downloadItems.forEach(item => {
                newDownloadItems.push({...item, selected: false});
            });
        }

        setSelectedTotal(newselectedTotal);
        setDownloadItems(newDownloadItems);
    }


    return (
        <div className="downloadManager">
            <div className="toolBar">
                <label className="selectAllCheckboxLabel">
                    <SelectAllCheckbox
                        checkboxState={selectAllCheckboxState}
                        handleCheckboxChange={handleSelectAllCheckboxChange}/>
                    <span
                        className="selectAllCheckboxText"
                        data-testid="selectAllCheckboxText">
                        {
                            selectedTotal > 0
                                ? `Selected ${selectedTotal}` 
                                : "None Selected"
                        }
                    </span>
                </label>
                <button
                    className="downloadButton"
                    data-testid="downloadButton"
                    disabled={selectedTotal === 0}
                    onClick={() => handleDownloadButtonClick()}>
                    <img className="downloadIcon" src={downloadIcon} alt="Download icon"/>
                    Download Selected
                </button>
            </div>

            <DownloadsTable
                downloadItems={downloadItems}
                handleRowClick={handleRowClick}/>
        </div>
    )
}

DownloadManager.propTypes = {
    downloadData: PropTypes.array
}

export default DownloadManager;
