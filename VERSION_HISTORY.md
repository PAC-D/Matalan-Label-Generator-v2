# Version History

## v2.2 (Documentation & Branding Update)
**Release Date:** February 10, 2026

### � Branding Update
- **Name Change:** Updated application title to **"Matalan Shipping Label Generator"** across the interface and manual.
- **Enhanced Header:** Increased manual header logo size (60px) and added a white background for improved brand visibility on dark themes.

### 📚 Documentation (Instruction Manual)
- **Comprehensive Refactor:**
  - Expanded and restructured the manual into a clear **4-page** format to resolve overflow issues while maintaining a compact footprint.
- **New Page Structure:**
  - **Page 1:** Label Size Selection & Carton Type Options.
  - **Page 2:** Mapping Source Data (Part 1).
  - **Page 3:** Application Inputs (Part 2) with optimized image sizing (45%).
  - **Page 4:** Consolidated reference section including Special Classifications (Homeware), Final Steps, Printing Specs, and Troubleshooting.
- **Visual & Functional Updates:**
  - Updated guide images for clarity.
  - Refined layout to ensure all critical information fits perfectly on standard A4 paper.
  - **Export Logic:** Updated the PDF generation engine to robustly support the new multi-page structure.

---

## v2.1 (Previous Release)
**Release Date:** February 07, 2026

### 🚀 New Features
- **Dynamic Size Columns:** 
  - The "Size Breakdown" table now automatically adjusts the number of columns based on user input.
  - Columns for unused sizes are automatically hidden, ensuring a clean and professional label layout.
  - Table columns now auto-size proportionally instead of having fixed widths.

- **Editable Size Headers:**
  - Users can now rename standard size labels (XS, S, M, etc.) to any custom value (e.g., "Size 8", "3-4 Years") directly from the sidebar.
  - The preview table headers update immediately to reflect these custom names.

- **Carton Type Selection:**
  - Added a "Carton Type" selector with two modes:
    - **Ratio:** For cartons containing mixed sizes (Standard table view).
    - **Single:** For cartons containing only one specific size (Simplified view).

### 🛠 Improvements
- **Smart PDF Export:** 
  - Implemented a "Clone Strategy" for PDF generation to prevent screen-scaling issues.
  - Added logic to ensure exact A4/Custom dimensions regardless of the user's screen resolution or zoom level.
  - Automatic blank page removal.

- **Homeware Logic:**
  - The large Corner Box indicator ("H") now only appears specifically when the "H - Homeware" division is selected.

- **UI/UX Updates:**
  - Re-designed the "Size Breakdown" input section in the sidebar for better usability.
  - Added new grouping for size label and quantity inputs.
  - Integrated a comprehensive, multi-page **Instruction Manual** directly into the application.

---

## v1.0 (Initial Release)
- **Core Label Generation:** Basic functionality to generate standard Matalan/PacD labels.
- **Preview Engine:** Live HTML-based preview of the label.
- **Basic Export:** Simple PDF export functionality.
- **Standard Fields:** Fixed fields for PO, Style, Factory, etc.
