document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const form = document.getElementById('labelForm');
    const sizeSelector = document.getElementById('sizeSelector');
    const printArea = document.getElementById('printArea');
    const label1 = document.getElementById('label1');
    const label2 = document.getElementById('label2');
    const template = document.getElementById('labelTemplate');
    const downloadBtn = document.getElementById('downloadBtn');

    // Modal Elements (Removed as Instruction Manual is now a separate page)
    // const instructionModal = document.getElementById('instructionModal');
    // const closeModalBtn = document.querySelector('.close-modal');
    // const modalOverlay = document.querySelector('.modal-overlay');

    // State
    let currentZoom = 1;

    // Initialize
    updateLabels();

    // Listeners
    form.addEventListener('input', updateLabels);
    sizeSelector.addEventListener('change', updateLayout);
    downloadBtn.addEventListener('click', downloadPDF);

    // Carton Type Logic
    const cartonTypeSelector = document.getElementById('cartonType');
    const singleSizeContainer = document.getElementById('singleSizeContainer');
    const sizeInputsGrid = document.querySelector('.size-inputs-grid');

    if (cartonTypeSelector) {
        cartonTypeSelector.addEventListener('change', () => {
            const isSingle = cartonTypeSelector.value === 'single';
            if (isSingle) {
                singleSizeContainer.classList.remove('hidden');
                sizeInputsGrid.classList.add('hidden');
            } else {
                singleSizeContainer.classList.add('hidden');
                sizeInputsGrid.classList.remove('hidden');
            }
            updateLabels(); // Re-render on change
        });
    }

    // Modal Listeners Removed

    // Zoom
    document.getElementById('zoomIn').onclick = () => setZoom(currentZoom + 0.1);
    document.getElementById('zoomOut').onclick = () => setZoom(currentZoom - 0.1);

    function setZoom(val) {
        currentZoom = Math.max(0.5, Math.min(2, val));
        printArea.style.transform = `scale(${currentZoom})`;
        document.querySelector('.zoom-controls span').textContent = `${Math.round(currentZoom * 100)}%`;
    }

    function updateLayout() {
        const size = sizeSelector.value;
        printArea.setAttribute('data-size', size);

        // Adjust CSS vars or classes if needed
        // The CSS handles [data-size="a5"] vs [data-size="custom"]
    }

    // Initial call to set layout attribute
    updateLayout();

    function updateLabels() {
        // Gather Data
        const data = {
            poNumber: document.getElementById('poNumber').value,
            styleRef: document.getElementById('styleRef').value,
            factoryName: document.getElementById('factoryName').value,
            supplierName: document.getElementById('supplierName').value,
            lineCode: document.getElementById('lineCode').value,
            packId: document.getElementById('packId').value,
            boxQty: document.getElementById('boxQty').value,
            description: document.getElementById('description').value,
            color: document.getElementById('color').value,
            // Division only for logic
            division: document.getElementById('division').value,
            cartonType: document.getElementById('cartonType') ? document.getElementById('cartonType').value : 'ratio',
            singleSizeValue: document.getElementById('singleSizeValue') ? document.getElementById('singleSizeValue').value : '',
        };

        // Gather Active Sizes and Calculate Total
        const sizeKeys = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        const activeSizes = [];
        let totalSize = 0;
        let hasSize = false;

        sizeKeys.forEach(key => {
            // value
            const valInput = document.getElementById(`size${key}`);
            const labelInput = document.getElementById(`label${key}`);

            const val = valInput ? valInput.value : '';
            const header = (labelInput && labelInput.value) ? labelInput.value : key;

            // Include if quantity is NOT empty
            if (val !== '') {
                activeSizes.push({ header: header, value: val });
                totalSize += (parseInt(val) || 0);
                hasSize = true;
            }

            // Still populate legacy data keys just in case, though usually unused with dynamic render
            data[`size${key}`] = val !== '' ? val : '-';
            data[`header${key}`] = header;
        });

        data.activeSizes = activeSizes;
        data.sizeTotal = hasSize ? totalSize : '-';

        // Render both labels
        renderLabel(label1, data);
        renderLabel(label2, data);
    }

    function renderLabel(container, data) {
        container.innerHTML = '';
        const clone = template.content.cloneNode(true);

        // Populate basic fields
        Object.keys(data).forEach(key => {
            const el = clone.querySelector(`[data-key="${key}"]`);
            if (el && key !== 'cornerBox' && key !== 'division' && key !== 'singleSizeDisplay' && key !== 'sizeTableContainer') el.textContent = data[key];
        });

        // Size Display Logic (Carton Type)
        const sizeTableContainer = clone.querySelector('[data-key="sizeTableContainer"]');
        const singleSizeDisplay = clone.querySelector('[data-key="singleSizeDisplay"]');

        if (data.cartonType === 'single') {
            if (sizeTableContainer) sizeTableContainer.classList.add('hidden');
            if (singleSizeDisplay) {
                singleSizeDisplay.classList.remove('hidden');
                singleSizeDisplay.textContent = data.singleSizeValue;
            }
        } else {
            // Ratio Mode
            if (sizeTableContainer) sizeTableContainer.classList.remove('hidden');
            if (singleSizeDisplay) singleSizeDisplay.classList.add('hidden');

            // Dynamic Table Render
            const tableHead = clone.querySelector('.size-table thead tr');
            const tableBody = clone.querySelector('.size-table tbody tr');

            if (tableHead && tableBody && data.activeSizes) {
                tableHead.innerHTML = '';
                tableBody.innerHTML = '';

                if (data.activeSizes.length > 0) {
                    data.activeSizes.forEach(size => {
                        const th = document.createElement('th');
                        th.textContent = size.header;
                        tableHead.appendChild(th);

                        const td = document.createElement('td');
                        td.textContent = size.value;
                        tableBody.appendChild(td);
                    });

                    // Add Total Column
                    const thTot = document.createElement('th');
                    thTot.textContent = 'Total';
                    tableHead.appendChild(thTot);

                    const tdTot = document.createElement('td');
                    tdTot.textContent = data.sizeTotal;
                    tdTot.classList.add('total-cell');
                    tableBody.appendChild(tdTot);
                } else {
                    // Placeholder if no sizes active
                    const th = document.createElement('th');
                    th.textContent = 'Size';
                    tableHead.appendChild(th);

                    const td = document.createElement('td');
                    td.textContent = '-';
                    tableBody.appendChild(td);
                }
            }
        }

        // Corner Box Logic
        const cornerBox = clone.querySelector('[data-key="cornerBox"]');
        const labelContent = clone.querySelector('.label-content');

        if (cornerBox) {
            // Rules: Only show if "H - Homeware" is selected.
            // Strict condition as per user request: "if select h only then the corner box will show"
            if (data.division && data.division.startsWith('H')) {
                cornerBox.textContent = 'H';
                cornerBox.classList.remove('hidden');
                if (labelContent) labelContent.classList.add('has-corner-box');
            } else {
                cornerBox.classList.add('hidden');
                if (labelContent) labelContent.classList.remove('has-corner-box');
            }
        }

        container.appendChild(clone);

        // Auto-fit Logic
        tryFitText(container);
    }

    function tryFitText(container) {
        // Reset padding before re-measuring
        container.classList.remove('tight-padding');

        const resizableKeys = ['supplierName', 'factoryName', 'description'];
        let hasOverflow = false;

        resizableKeys.forEach(key => {
            const el = container.querySelector(`[data-key="${key}"]`);
            if (el) {
                el.classList.add('line-clamp-2');

                let size = parseInt(window.getComputedStyle(el).fontSize);
                const minSize = 9;

                // Shrink until it fits in the clamp box
                while (el.scrollHeight > el.clientHeight && size > minSize) {
                    size--;
                    el.style.fontSize = size + 'px';
                }
            }
        });

        // Check if the overall content overflows the container
        const labelContent = container.querySelector('.label-content');
        if (labelContent.scrollHeight > container.clientHeight) {
            container.classList.add('tight-padding');
        }
    }

    function downloadPDF() {
        // Use html2pdf for "what you see is what you get"
        const element = printArea;
        const sizeValue = sizeSelector.value;
        const isLandscape = sizeValue === 'custom';

        // Filename construction: lineCode_packId_dimension
        // Dimension mapping: a5 -> A5, custom -> Custom
        const lineCode = document.getElementById('lineCode').value || 'Unspecified';
        const packId = document.getElementById('packId').value || 'Unspecified';
        const dimStr = sizeValue === 'a5' ? 'A5' : '25x10cm';

        // Clean filename of illegal chars just in case
        const safeFilename = `${lineCode}_${packId}_${dimStr}.pdf`.replace(/[^a-z0-9_\-\.]/gi, '_');

        // Show loading state
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Generating...';

        // CLONE STRATEGY: Create a clean copy for PDF generation to avoid screen-specific scaling/responsive issues
        const clone = element.cloneNode(true);

        // Reset transform and ensure exact dimensions on the clone
        clone.style.transform = 'none';
        clone.style.margin = '0';
        clone.style.boxShadow = 'none'; // Remove shadow for print

        // Force the clone into a container that matches simple A4/Custom dimensions context
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = isLandscape ? '297mm' : '210mm';
        container.style.height = isLandscape ? '210mm' : '297mm'; // Strict height
        container.style.overflow = 'hidden'; // Clip any potential overflow
        container.appendChild(clone);
        document.body.appendChild(container);

        // Configure options for A4 exact export
        const opt = {
            margin: 0,
            filename: safeFilename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                scrollY: 0,
                scrollX: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' }
        };

        // Execution chain: Generate -> Get PDF -> Filter Pages -> Save
        html2pdf().set(opt).from(clone).toPdf().get('pdf').then(function (pdf) {
            // Logic to remove extra pages if they were created due to sub-pixel overflow
            const totalPages = pdf.internal.getNumberOfPages();
            if (totalPages > 1) {
                // Delete all pages starting from the last one (backwards) until only 1 remains
                for (let i = totalPages; i > 1; i--) {
                    pdf.deletePage(i);
                }
            }
        }).save().then(() => {
            // Cleanup
            if (document.body.contains(container)) document.body.removeChild(container);

            // Restore UI
            downloadBtn.innerHTML = originalText;
            lucide.createIcons();
        }).catch(err => {
            console.error(err);
            if (document.body.contains(container)) document.body.removeChild(container);
            downloadBtn.innerHTML = originalText;
            lucide.createIcons();
            alert('Error generating PDF');
        });
    }
});
