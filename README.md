# ASR Daily Order Processor

A web application for processing daily Excel uploads and transforming them into ASR Daily Order format with database enhancement, cover specification decoding, and Job.xlsx generation for production systems.

## Features

### Two-Stage Workflow Support
The application supports a complete two-stage workflow:
1. **Stage 1**: Process daily order uploads → Generate ASR Daily Order file (with blank WiNumbers)
2. **Stage 2**: Process ASR file with populated WiNumbers → Generate Job.xlsx for production

### File Processing
- **Excel Upload**: Handles .xlsx and .xls files with automatic structure detection
- **Smart File Detection**: Automatically detects daily order files vs ASR files
- **Flexible Structure**: Supports daily files with headers at row 0, ASR files with multi-row headers
- **Column Extraction**: Daily files use columns A-H, ASR files use full 23-column structure
- **Database Integration**: Cross-references ISBN numbers with existing book specifications
- **Cover Spec Decoding**: Automatically decodes cover specification codes into readable format

### Data Enhancement
- **ISBN Lookup**: Uses ISBN to find matching records in database
- **Complete Specifications**: Pulls title, dimensions, pricing, paper specs, and more from database
- **Master Ref Integration**: Uses Master Ref from upload or database as fallback
- **Part Number Mapping**: Maps part numbers to paper specifications (DCLAY01, DCLAY02, etc.)
- **Paper String Parsing**: Extracts paper name, GSM, and micron values from part numbers
- **WiNumber Column**: Adds blank WiNumber column in Stage 1 for work instruction numbers

### Job.xlsx Generation
- **Production Ready**: Generates Job.xlsx files formatted for production systems
- **Smart Detection**: Only available when WiNumbers are populated (Stage 2)
- **Field Mapping**: Maps ASR data to Job system requirements
- **Binding Method**: Converts all binding styles to "Limp P/Bound" format
- **Static Filename**: Downloads as "Job.xlsx" (no timestamp)

### Part Number Mapping

The application maps part numbers to paper specifications:

| Part Number | Paper Code | GSM | Micron |
|-------------|------------|-----|--------|
| 20234 | DCLAY01 | 52 | 114 |
| 20049 | DCLAY02 | 65 | 138 |
| 20100 | DCLAY03 | 52 | 81 |
| 20256 | DCLAY03 | 52 | 81 |
| 20351 | DCLAY04 | 60 | 116 |
| 20110 | DCLAY05 | 55 | 108 |
| 20864 | DCLAY05 | 55 | 108 |
| 20006 | DAMH07 | 80 | 98 |
| 20340 | DHYP01 | 60 | 108 |
| 20486 | DAMH07 | 80 | 98 |

### User Interface
- **Dual Mode Display**: Different interfaces for daily processing vs Job generation
- **Processing Summary**: Shows file statistics and database match results
- **Job Export Ready**: Displays when ASR files with WiNumbers are processed
- **Order Acceptance Export**: Generate order confirmation summaries
- **Missing Records Alert**: Displays records not found in database
- **Progress Indicators**: Visual feedback during file processing
- **Error Handling**: Clear error messages and graceful failure handling

## Complete Workflow

### Stage 1: Daily Order Processing

1. **Upload Daily File**
   - Upload Excel file with daily orders
   - File structure: Headers at row 0, data from row 1
   - Columns: A (Master Ref), B (SID), C (ISBN), D (Desp Date), E (Quantity), F (Cover Spec), G (Part Number), H (Delivery Dest)

2. **Processing**
   - System detects daily order file (≤10 columns)
   - Performs ISBN lookups in database
   - Enhances records with specifications
   - Maps part numbers to paper specs
   - Adds blank WiNumber column

3. **Download ASR File**
   - Downloads enhanced file as "ASR_Daily_Order_YYYY-MM-DD_HH-MM-SS.xlsx"
   - Contains 23 columns with complete specifications
   - WiNumber column is blank, ready for external population

### Stage 2: Job Generation

1. **WiNumber Population**
   - External system populates WiNumber values in ASR file
   - File is returned with WiNumbers filled in

2. **Upload Updated ASR File**
   - Upload the ASR file with populated WiNumbers
   - System detects Job Mode (numeric WiNumbers present)
   - Skips database lookups (uses existing data)

3. **Generate Job.xlsx**
   - Job.xlsx download button becomes available
   - Downloads as "Job.xlsx" (no timestamp)
   - Contains production-ready data with proper field mapping

## Setup

### Prerequisites
- Modern web browser with JavaScript enabled
- Web server (for local development) or hosting platform
- `data.json` file with book specifications database

### Installation

1. **Download Files**
   ```
   asr-processor/
   ├── index.html
   ├── script.js
   ├── data.json
   └── README.md
   ```

2. **Prepare Database**
   - Ensure `data.json` contains book specifications in the required format
   - Place in the same directory as `index.html`

3. **Serve Application**
   - **Local**: Use Python `python -m http.server` or Node.js live server
   - **Production**: Upload to web hosting platform

## File Structures

### Daily Order File Structure
```
Row 0: [MASTER REF, SID, ISBN, DESP DATE, QUANTITY W.I., COVER SPEC, LINE 1 ALLOC PART NO, DELIVERY DEST]
Row 1: [SCT284, TGC513, 9781847249616, 45982, 160, C400P2, 20234:52:546, HHC]
Row 2: [SCT418, TGC489, 9780755353941, 45982, 144, C406P2, 20234:52:546, HHC]
```

### ASR File Structure (23 columns)
Columns in order:
1. Master Ref - From upload or database
2. WiNumber - Blank initially, populated externally
3. OrderRef - From upload
4. Title - From database
5. ISBN - From upload
6. Extent - From database
7. Bind Style - From database
8. Trim Height - From database
9. Trim Width - From database
10. Spine - From database
11. Delivery Date - From upload
12. Quantity - From upload
13. Cover Spec - From upload or database
14. Cover Spec Decoded - Auto-generated
15. Price UK - From database
16. Price US - From database
17. Price CAN - From database
18. Paper - From part number mapping
19. GSM - From part number mapping
20. Micron - From part number mapping
21. Packing - From database
22. Bleeds - From database
23. Delivery Dest - From upload

### Job.xlsx Structure (16 columns)
Maps ASR data to production system format:

| Job Column | Source | Value/Logic |
|------------|--------|-------------|
| _ACTION_ | Static | "U" |
| primaryKey | WiNumber | From ASR file |
| job | WiNumber | Same as primaryKey |
| poNum | OrderRef | From ASR file |
| description | Title | From ASR file |
| U_LimpISBN | ISBN | From ASR file |
| U_BindingMethod | Static | "Limp P/Bound" |
| U_HeadTrim | Static | "3mm" |
| description2 | Packing | From ASR file |
| U_fileDate | Static | "" (empty) |
| U_ProcessedDate | Generated | Current date |
| scheduledShipDate | Delivery Date | From ASR file |
| shipToJobContact | Static | "" (empty) |
| U_CoverPrice_UK | Price UK | From ASR file |
| U_CoverPrice_US | Price US | From ASR file |
| U_CoverPrice_CAD | Price CAN | From ASR file |

### Database Format

Your `data.json` should contain an array of book objects:

```json
[
  {
    "ISBN": 9780755305308,
    "Master Order ID": "SA0736",
    "TITLE": "ASR GIRL IN HYACINTH BLUE",
    "Trim Height": 198,
    "Trim Width": 129,
    "Bind Style": "Limp",
    "Extent": 192,
    "Cover Spine": 12,
    "Price UK": "£6.99",
    "Price US": "$8.99", 
    "Price CAN": "CAD 11.99",
    "Paper": "DCLAY01",
    "Gsm": 52,
    "Micron": 114,
    "Cover Spec": "C406P2",
    "Packing": "Pack (104) (8) Base.",
    "Bleeds": "No"
  }
]
```

## Cover Specification Decoder

The application includes a comprehensive decoder that translates codes like "C406P2":

- **C**: Cover (Product Type)
- **4**: 4 Process Colours (Outside)
- **0**: No Colour Print (Inside)
- **6**: Matt Laminate Standard (Finish)
- **P**: Plain (Texture)
- **2**: 220 gsm (Material Weight)

### Supported Specifications

- **Product Types**: Cover, Cover with Flaps, Jacket, Tip-In, Cover For Case
- **Colors**: 0-9 color options from no color to 4 process + 4 spot colors
- **Finishes**: 26 finish types including laminates, varnishes, UV treatments
- **Textures**: Plain, Grained
- **Weights**: Various GSM options (130-260 gsm)
- **Special Processes**: Foiling, embossing, spot UV, and more

## File Naming Conventions

- **ASR Daily Order**: `ASR_Daily_Order_YYYY-MM-DD_HH-MM-SS.xlsx`
- **Order Acceptance**: `ASR_Order_Acceptance_YYYY-MM-DD_HH-MM-SS.xlsx`
- **Job File**: `Job.xlsx` (static name)

## Mode Detection

The system automatically detects file types and processing modes:

### Daily Order Mode
- **Trigger**: File has ≤10 columns
- **Processing**: Database lookups, enhancement, part number mapping
- **Output**: ASR Daily Order file with blank WiNumbers
- **UI**: Shows processing summary, missing records (if any)

### Job Mode
- **Trigger**: File has populated numeric WiNumbers in column B
- **Processing**: Direct column mapping, no database lookups
- **Output**: Job.xlsx file ready for production
- **UI**: Shows "Job Mode" interface, Job export ready

## Troubleshooting

### Common Issues

**Wrong Mode Detection**
- Daily files detected as Job Mode: Check if column B contains numeric values
- ASR files detected as Daily Mode: Ensure WiNumbers are numeric, not text

**No Database Matches**
- Verify `data.json` is in the same directory as `index.html`
- Check that ISBN numbers in your Excel match those in the database
- Ensure web server is running (required for loading JSON files)

**File Upload Errors**
- Confirm file is .xlsx or .xls format
- Check file isn't corrupted or password protected
- Verify file contains data in the expected columns

**Job.xlsx Not Available**
- Ensure WiNumber column contains numeric values (not text)
- Check that file is detected as ASR file (not daily order file)
- Verify processing completed successfully

### Browser Console

For debugging, check the browser console (F12) for:
- File type detection messages
- Mode selection logging
- WiNumber detection status
- Database loading messages
- File processing errors

## Technical Details

### Architecture
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5.3.2 with custom CSS enhancements
- **Icons**: Bootstrap Icons 1.11.1
- **Excel Processing**: SheetJS (XLSX library)
- **Data Storage**: JSON file-based (client-side only)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### File Processing Features
- Uses SheetJS for Excel parsing
- Handles Excel date serial numbers
- Formats ISBN as numbers with no decimal places
- Preserves all data types appropriately
- Smart column width adjustment for downloads

## Security Notes

- Application runs entirely client-side
- No data is transmitted to external servers
- Files are processed locally in the browser
- Database remains on your local server/hosting

## License

This project is provided for internal use. Modify and adapt as needed for your specific requirements.

## Version History

- **v1.0** - Initial release with basic functionality
- **v1.1** - Added ISBN number formatting
- **v1.2** - Fixed calculation errors in processing summary
- **v1.3** - Added missing records copy functionality
- **v1.4** - Updated column mapping for new file structure (A-H columns)
- **v1.5** - Added WiNumber blank column and renamed SID to OrderRef
- **v1.6** - Updated filename format to include date and time stamp
- **v2.0** - Major update: Added Job.xlsx generation and dual-mode processing
- **v2.1** - Implemented smart file detection and two-stage workflow support
- **v2.2** - Fixed WiNumber detection and part number mapping improvements
- **v2.3** - Updated Job.xlsx filename to static "Job.xlsx" format