import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import DownloadsTable from "./DownloadsTable";
import Checkbox from "./Checkbox";
import { ITEM_STATUS, CHECKBOX_STATES } from "../Constants";
import downloadIcon from "../assets/download.svg";
import "./style.css";

function DownloadManager({downloadData}) {
    // Initialize needed states
    const [downloadItems, setDownloadItems] = useState(downloadData);
    const [selectedTotal, setSelectedTotal] = useState(0);
    const [mainCheckboxState, setMainCheckboxState] = useState(CHECKBOX_STATES.unchecked);

    // Update download item's "selected" value when table item is clicked
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
        } else if (selectedTotal === 0) {
            setMainCheckboxState(CHECKBOX_STATES.unchecked);
        } else {
            setMainCheckboxState(CHECKBOX_STATES.indeterminate);
        }
    }, [selectedTotal, downloadItems]);


    return (
        <div className="downloadManager">
            <div className="toolBar">
                <label className="mainCheckboxLabel">
                    <Checkbox
                        checkboxState={mainCheckboxState}
                        handleCheckboxChange={handleMainCheckboxChange}/>
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
