let activeRow = null;

export const highlightActiveRow = (e) => {
    if(activeRow) {
        activeRow.style.backgroundColor = 'inherit'; // NOTE: Setting the style directly, because if you add a class, the internal styles of the library will override its properties.
    }

    let newActiveRow = e.target;

    while (newActiveRow && newActiveRow.tagName !== 'TR') {
        newActiveRow = newActiveRow.parentElement;
    }

    if (newActiveRow.parentElement.tagName === 'THEAD') {
        return null;
    }

    activeRow = newActiveRow;
    activeRow.style.backgroundColor = 'lightgray';
}