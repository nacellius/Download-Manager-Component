import React, {createRef, useEffect} from "react";
import PropTypes from "prop-types";
import { CHECKBOX_STATES } from "../../Constants";

function Checkbox({ checkboxState, handleCheckboxChange }) {
    const checkbox = createRef();

    // Update the checkbox's "checked" and "indeterminate" properties when checkboxState is updated
    useEffect(() => {
        switch(checkboxState) {
            case CHECKBOX_STATES.checked:
                checkbox.current.checked = true;
                checkbox.current.indeterminate = false;
                return;
            case CHECKBOX_STATES.indeterminate:
                checkbox.current.checked = false;
                checkbox.current.indeterminate = true;
                return;
            case CHECKBOX_STATES.unchecked:
            default:
                checkbox.current.checked = false;
                checkbox.current.indeterminate = false;
        }
    }, [checkboxState, checkbox]);

    return (
        <>
            <input
                ref={checkbox}
                type="checkbox"
                onChange={() => handleCheckboxChange()}/>
        </>
    )
}

Checkbox.propTypes = {
    checkboxState: PropTypes.string,
    handleCheckboxChange: PropTypes.func,
}

export default Checkbox;
