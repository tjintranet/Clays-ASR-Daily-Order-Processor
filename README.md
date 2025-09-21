# ASR Daily Order Processor

A web application for processing daily Excel uploads and transforming them into ASR Daily Order format with database enhancement and cover specification decoding.

## Features

### File Processing
- **Excel Upload**: Simple file input for .xlsx and .xls files
- **Column Extraction**: Uses only specific columns (C, F, L, M, T) from uploads
- **Database Integration**: Cross-references ISBN numbers with existing book specifications
- **Cover Spec Decoding**: Automatically decodes cover specification codes into readable format

### Data Enhancement
- **ISBN Lookup**: Uses Column F (ISBN) to find matching records in database
- **Complete Specifications**: Pulls title, dimensions, pricing, paper specs, and more from database
- **Master Ref Integration**: Includes Master Order ID as Column A in output
- **Clean Export**: Downloads properly formatted Excel files

### User Interface
- **Processing Summary**: Shows file statistics and database match results
- **Missing Records Alert**: Displays records not found in database with copy functionality
- **Progress Indicators**: Visual feedback during file processing
- **Error Handling**: Clear error messages and graceful failure handling

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

## Usage

### Processing Files

1. **Upload Excel File**
   - Click "Browse Files" and select your daily Excel file
   - Only .xlsx and .xls formats are supported

2. **Review Results**
   - Check the Processing Summary for match statistics
   - Review any Missing Records that couldn't be found in database

3. **Download Output**
   - Click "Download Processed File" to get enhanced Excel file
   - File includes Master Ref as Column A plus all database specifications

### Expected Excel Structure

The application reads these columns from your upload:
- **Column C**: SID
- **Column F**: ISBN (used for database lookup)
- **Column L**: Delivery Date
- **Column M**: Quantity
- **Column T**: Delivery Destination

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

## Output Structure

The downloaded Excel file contains these columns in order:

1. **Master Ref** - From database (Master Order ID)
2. **SID** - From upload Column C
3. **Title** - From database
4. **ISBN** - From upload Column F (formatted as number)
5. **Extent** - From database
6. **Bind Style** - From database
7. **Trim Height** - From database  
8. **Trim Width** - From database
9. **Spine** - From database
10. **Delivery Date** - From upload Column L
11. **Quantity** - From upload Column M
12. **Cover Spec** - From database
13. **Cover Spec Decoded** - Automatically decoded specifications
14. **Price UK** - From database
15. **Price US** - From database
16. **Price CAN** - From database
17. **Paper** - From database
18. **GSM** - From database
19. **Micron** - From database
20. **Packing** - From database
21. **Bleeds** - From database
22. **Delivery Dest** - From upload Column T

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

## Troubleshooting

### Common Issues

**No Database Matches**
- Verify `data.json` is in the same directory as `index.html`
- Check that ISBN numbers in your Excel match those in the database
- Ensure web server is running (required for loading JSON files)

**File Upload Errors**
- Confirm file is .xlsx or .xls format
- Check file isn't corrupted or password protected
- Verify file contains data in the expected columns

**Missing Records**
- Use the "Copy Missing List" button to export problematic records
- Check if ISBNs need to be added to your database
- Verify ISBN formatting consistency between upload and database

### Browser Console

For debugging, check the browser console (F12) for:
- Database loading messages
- ISBN lookup attempts
- File processing errors

## Technical Details

### Architecture
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5.3.2 with custom CSS
- **Icons**: Bootstrap Icons 1.11.1
- **Excel Processing**: SheetJS (XLSX library)
- **Data Storage**: JSON file-based (client-side only)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### File Processing
- Uses SheetJS for Excel parsing
- Handles Excel date serial numbers
- Formats ISBN as numbers with no decimal places
- Preserves all data types appropriately

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