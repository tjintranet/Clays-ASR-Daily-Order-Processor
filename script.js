let processedData = [];
let originalFilename = '';
let booksDatabase = [];

// Cover specification data - from the original Clays Specification Code Decoder
const specData = {
    product: {
        'C': 'Cover',
        'W': 'Cover with Flaps', 
        'J': 'Jacket',
        'T': 'Tip-In',
        'F': 'Cover For Case'
    },
    
    colours: {
        '0': 'No Colour Print',
        '1': '1 Spot Colour',
        '2': '2 Spot Colours',
        '3': '3 Spot Colours',
        '4': '4 Process Colours',
        '5': '4 Process Colours + 1 Spot Colour',
        '6': '4 Process Colours + 2 Spot Colours',
        '7': '4 Spot Colours',
        '8': '4 Process Colours + 3 Spot Colours',
        '9': '4 Process Colours + 4 Spot Colours'
    },
    
    finish: {
        '0': 'No Finish',
        '1': 'Gloss Varnish In Line',
        '2': 'Gloss Varnish In Line + Matt Varnish Offline',
        '3': 'Gloss Varnish Off Line',
        '4': 'Matt Varnish Off Line',
        '5': 'Gloss Laminate (Standard)',
        '6': 'Matt Laminate (Standard)',
        '7': 'Matt Laminate (Standard) / Gloss Spot Varnish',
        '8': 'Silk Laminate',
        '9': 'Anti-Scuff Laminate',
        'A': 'Gloss Laminate (Standard) / Matt Spot UV (In house spot varnish route)',
        'B': 'Silk Laminate / Matt Spot UV',
        'C': 'Anti-Scuff Laminate / Gloss Spot UV',
        'D': 'Gloss Varnish Off Line + Matt Spot UV',
        'E': 'Matt Varnish In Line + Gloss Spot UV',
        'F': 'Matt Varnish In Line',
        'G': 'Matt Varnish Off Line + Gloss Spot UV',
        'H': 'Outwork Lamination',
        'J': 'Outwork Lamination / Gloss Spot UV',
        'K': 'Outwork Lamination / Matt Spot UV',
        'L': 'Gloss Spot UV',
        'M': 'Matt Spot UV',
        'N': 'Gloss Varnish In Line + Matt Spot UV',
        'Q': 'Soft Matt Lam',
        'R': 'Soft Matt Lam / Gloss Spot Varnish',
        'V': 'Recycled Matt Laminate',
        'W': 'Recycled Matt Laminate/ Gloss Spot Varnish',
        'Y': 'Recycled Gloss Laminate',
        'Z': 'Recycled Gloss Laminate/ Matt Spot UV'
    },
    
    texture: {
        'P': 'Plain',
        'G': 'Grained'
    },
    
    weight: {
        '1': '220 gsm',
        '2': '220 gsm',
        '3': '260 gsm',
        '4': '150 gsm',
        '5': '135 gsm',
        '6': '130 gsm',
        '7': '220 gsm'
    },
    
    specialInks: {
        'F': 'Fluorescent',
        'S': 'Spot Colour',
        'M': 'Non-Conventional Metallic',
        'K': 'To be used in addition to M to show a Conventional Metallic',
        'B': 'Blocked (after print, before laminate)',
        'E': 'Embossed',
        'D': 'Debossed',
        'C': 'Die-Cutting',
        'P': 'Print Over Foil',
        'L': 'Block Over Laminate',
        'U': 'Uncoated Printing',
        'PB': 'Print Black Over Foil',
        'BE': 'Block & Emboss (same pass)',
        'DE': 'Deboss & Emboss (same pass)',
        'BD': 'Block & Deboss (same pass)',
        'S1': 'Other Spot UV',
        'S2': 'Pile Spot UV',
        'S3': 'Glitter Spot UV',
        'V1': 'Glow Varnish',
        'H1': 'Holographic Lam'
    }
};

// Paper part number mapping - Part Number to Paper Code, GSM, Microns
const paperPartMapping = {
    '20234': { paper: 'DCLAY01', gsm: '52', micron: '114' },
    '20049': { paper: 'DCLAY02', gsm: '65', micron: '138' },
    '20100': { paper: 'DCLAY03', gsm: '52', micron: '81' },
    '20256': { paper: 'DCLAY03', gsm: '52', micron: '81' },
    '20351': { paper: 'DCLAY04', gsm: '60', micron: '116' },
    '20110': { paper: 'DCLAY05', gsm: '55', micron: '108' },
    '20864': { paper: 'DCLAY05', gsm: '55', micron: '108' },
    '20006': { paper: 'DAMH07', gsm: '80', micron: '98' },
    '20340': { paper: 'DHYP01', gsm: '60', micron: '108' },
    '20486': { paper: 'DAMH07', gsm: '80', micron: '98' }
};

// Function to parse part number string and extract paper specifications
function parsePartNumber(partNumberString) {
    if (!partNumberString || typeof partNumberString !== 'string') {
        return {
            paperName: '',
            gsm: '',
            micron: ''
        };
    }

    const partNumber = partNumberString.split(':')[0].trim();
    const mapping = paperPartMapping[partNumber];
    
    if (mapping) {
        return {
            paperName: mapping.paper,
            gsm: mapping.gsm,
            micron: mapping.micron
        };
    } else {
        console.log(`Unknown part number: "${partNumber}" from string: "${partNumberString}"`);
        return {
            paperName: '',
            gsm: '',
            micron: ''
        };
    }
}

// Function to decode Cover Spec codes
function decodeCoverSpec(code) {
    const codeStr = code ? String(code).trim() : '';
    
    if (!codeStr || codeStr.length < 6) {
        return 'Invalid cover spec code';
    }

    const upperCode = codeStr.toUpperCase();
    const decoded = [];

    if (specData.product[upperCode[0]]) {
        decoded.push(`Product: ${specData.product[upperCode[0]]}`);
    }

    if (specData.colours[upperCode[1]]) {
        decoded.push(`Outside: ${specData.colours[upperCode[1]]}`);
    }

    if (specData.colours[upperCode[2]]) {
        decoded.push(`Inside: ${specData.colours[upperCode[2]]}`);
    }

    if (specData.finish[upperCode[3]]) {
        decoded.push(`Finish: ${specData.finish[upperCode[3]]}`);
    }

    if (specData.texture[upperCode[4]]) {
        decoded.push(`Texture: ${specData.texture[upperCode[4]]}`);
    }

    if (specData.weight[upperCode[5]]) {
        decoded.push(`Weight: ${specData.weight[upperCode[5]]}`);
    }

    if (upperCode.length > 6) {
        const specialSection = upperCode.substring(6);
        const processBreakdown = [];
        let i = 0;
        
        while (i < specialSection.length) {
            let found = false;
            
            if (i < specialSection.length - 1) {
                const twoChar = specialSection.substring(i, i + 2);
                if (specData.specialInks[twoChar]) {
                    processBreakdown.push(specData.specialInks[twoChar]);
                    i += 2;
                    found = true;
                }
            }
            
            if (!found) {
                const singleChar = specialSection[i];
                if (specData.specialInks[singleChar]) {
                    processBreakdown.push(specData.specialInks[singleChar]);
                }
                i++;
            }
        }
        
        if (processBreakdown.length > 0) {
            decoded.push(`Special: ${processBreakdown.join(', ')}`);
        }
    }

    return decoded.length > 0 ? decoded.join(', ') : 'Could not decode';
}

// Function to lookup book details from database using ISBN
function lookupBookDetailsByISBN(isbn) {
    if (booksDatabase.length === 0 || !isbn) {
        return null;
    }
    
    const searchValue = isbn.toString().trim();
    
    let bookDetails = booksDatabase.find(book => 
        book.ISBN && book.ISBN.toString() === searchValue
    );
    
    if (bookDetails) return bookDetails;
    
    const cleanSearchValue = searchValue.replace(/[-\s]/g, '');
    bookDetails = booksDatabase.find(book => 
        book.ISBN && book.ISBN.toString().replace(/[-\s]/g, '') === cleanSearchValue
    );
    
    if (bookDetails) return bookDetails;
    
    console.log(`No match found for ISBN: "${isbn}". Database has ${booksDatabase.length} records.`);
    return null;
}

// Function to check if data has populated WiNumbers (for Job.xlsx eligibility)
function hasPopulatedWiNumbers(data) {
    return data.some(row => row['WiNumber'] && row['WiNumber'] !== '' && row['WiNumber'] !== 0);
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileUpload');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadJobBtn = document.getElementById('downloadJobBtn');

    loadBooksDatabase();

    fileInput.addEventListener('change', handleFileUpload);
    clearBtn.addEventListener('click', clearData);
    downloadBtn.addEventListener('click', downloadProcessedFile);
    downloadJobBtn.addEventListener('click', downloadJobFile);
});

// Load books database from data.json
async function loadBooksDatabase() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            console.warn('Could not load data.json - proceeding without database lookup');
            return;
        }
        booksDatabase = await response.json();
        console.log(`Loaded ${booksDatabase.length} books from database`);
    } catch (error) {
        console.warn('Error loading books database:', error);
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

async function handleFile(file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        showError('Please select a valid Excel file (.xlsx or .xls)');
        return;
    }

    originalFilename = file.name.replace(/\.[^/.]+$/, "");
    showProgress();

    try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (rawData.length === 0) {
            throw new Error('No data found in the Excel file');
        }

        processDataFromColumns(rawData);
        
    } catch (error) {
        console.error('Error processing file:', error);
        showError(`Error processing file: ${error.message}`);
    } finally {
        hideProgress();
    }
}

function processDataFromColumns(rawData) {
    // For daily order files, use row 1 as header and start data from row 2
    // For ASR files (with WiNumbers), they will have the full 23-column structure
    
    // First, let's detect if this is a daily order file or ASR file
    // Daily order files have 8 columns, ASR files have 23 columns
    const headerRow = rawData[0];
    const isDailyOrderFile = headerRow && headerRow.length <= 10; // Daily files have ~8 columns
    
    let dataRows;
    if (isDailyOrderFile) {
        // Daily order file - use row 0 as header, data starts from row 1
        dataRows = rawData.slice(1);
    } else {
        // ASR file - skip first 2 rows, use row 3 as header, data starts from row 4
        dataRows = rawData.slice(3);
    }
    
    // Check if this appears to be an ASR file with WiNumbers (Step 3 of workflow)
    const sampleRow = dataRows[0];
    // WiNumbers should be numeric values, not string codes like "TGC507"
    const hasWiNumberData = sampleRow && 
                           sampleRow[1] && 
                           sampleRow[1] !== '' && 
                           sampleRow[1] !== 0 && 
                           typeof sampleRow[1] === 'number' && 
                           !isDailyOrderFile; // Only check for WiNumbers if it's not a daily order file
    const isJobMode = hasWiNumberData;
    
    processedData = dataRows.map((row, index) => {
        let processedRow;
        
        if (isJobMode) {
            // This is an ASR file with populated data - use direct column mapping
            processedRow = {
                'Master Ref': row[0] || '',
                'WiNumber': row[1] || '',
                'OrderRef': row[2] || '',
                'Title': row[3] || '',
                'ISBN': row[4] || '',
                'Extent': row[5] || '',
                'Bind Style': row[6] || '',
                'Trim Height': row[7] || '',
                'Trim Width': row[8] || '',
                'Spine': row[9] || '',
                'Delivery Date': row[10] || '',
                'Quantity': row[11] || '',
                'Cover Spec': row[12] || '',
                'Cover Spec Decoded': row[13] || '',
                'Price UK': row[14] || '',
                'Price US': row[15] || '',
                'Price CAN': row[16] || '',
                'Paper': row[17] || '',
                'GSM': row[18] || '',
                'Micron': row[19] || '',
                'Packing': row[20] || '',
                'Bleeds': row[21] || '',
                'Delivery Dest': row[22] || '',
                
                '_displayOnly': {
                    'Row': index + 1,
                    'Master Ref (Upload)': row[0] || '',
                    'Part Number (Upload)': '',
                    'Customer Name': '',
                    'Customer Order Ref': '',
                    'Database Match': 'N/A',
                    'Enhanced': false
                }
            };
        } else {
            // This is a raw daily upload - original processing logic
            const columnA = row[0] || '';
            const columnB = row[1] || '';
            const columnC = row[2] || '';
            const columnD = row[3] || '';
            const columnE = row[4] || '';
            const columnF = row[5] || '';
            const columnG = row[6] || '';
            const columnH = row[7] || '';
            
            const bookDetails = lookupBookDetailsByISBN(columnC);
            const parsedPaper = parsePartNumber(columnG);
            
            processedRow = {
                'Master Ref': columnA || (bookDetails ? bookDetails['Master Order ID'] || '' : ''),
                'WiNumber': '',
                'OrderRef': columnB,
                'Title': bookDetails ? bookDetails.TITLE || '' : '',
                'ISBN': columnC,
                'Extent': bookDetails ? bookDetails.Extent || '' : '',
                'Bind Style': bookDetails ? bookDetails['Bind Style'] || '' : '',
                'Trim Height': bookDetails ? bookDetails['Trim Height'] || '' : '',
                'Trim Width': bookDetails ? bookDetails['Trim Width'] || '' : '',
                'Spine': bookDetails ? bookDetails['Cover Spine'] || '' : '',
                'Delivery Date': columnD ? formatDate(columnD) : '',
                'Quantity': columnE,
                'Cover Spec': columnF || (bookDetails ? bookDetails['Cover Spec'] || '' : ''),
                'Cover Spec Decoded': '',
                'Price UK': bookDetails ? bookDetails['Price UK'] || 'Unpriced' : 'Unpriced',
                'Price US': bookDetails ? bookDetails['Price US'] || 'Unpriced' : 'Unpriced',
                'Price CAN': bookDetails ? bookDetails['Price CAN'] || 'Unpriced' : 'Unpriced',
                'Paper': parsedPaper.paperName || (bookDetails ? bookDetails.Paper || '' : ''),
                'GSM': parsedPaper.gsm || (bookDetails ? bookDetails.Gsm || '' : ''),
                'Micron': parsedPaper.micron || (bookDetails ? bookDetails.Micron || '' : ''),
                'Packing': bookDetails ? bookDetails.Packing || '' : '',
                'Bleeds': bookDetails ? bookDetails.Bleeds || '' : '',
                'Delivery Dest': columnH,
                
                '_displayOnly': {
                    'Row': index + 1,
                    'Master Ref (Upload)': columnA,
                    'Part Number (Upload)': columnG,
                    'Customer Name': bookDetails ? bookDetails['Customer Name'] || '' : '',
                    'Customer Order Ref': bookDetails ? bookDetails['Customer Order Ref'] || '' : '',
                    'Database Match': bookDetails ? 'Yes' : 'No',
                    'Enhanced': bookDetails ? true : false
                }
            };
            
            const coverSpec = columnF || (bookDetails ? bookDetails['Cover Spec'] || '' : '');
            if (coverSpec) {
                processedRow['Cover Spec Decoded'] = decodeCoverSpec(coverSpec);
            }
        }
        
        return processedRow;
    }).filter(row => row['ISBN'] || row['OrderRef']);

    const matchedCount = isJobMode ? 0 : processedData.filter(row => row._displayOnly['Database Match'] === 'Yes').length;
    const notFoundCount = isJobMode ? 0 : processedData.filter(row => row._displayOnly['Database Match'] === 'No').length;

    processedData.stats = {
        total: processedData.length,
        matched: matchedCount,
        enhanced: matchedCount,
        notFound: notFoundCount,
        isJobMode: isJobMode
    };

    displayResults(processedData);
}

function formatDate(dateValue) {
    try {
        if (typeof dateValue === 'number') {
            const excelEpoch = new Date(1900, 0, 1);
            const jsDate = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
            // Format as DD/MM/YYYY
            const day = String(jsDate.getDate()).padStart(2, '0');
            const month = String(jsDate.getMonth() + 1).padStart(2, '0');
            const year = jsDate.getFullYear();
            return `${day}/${month}/${year}`;
        }
        
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return dateValue;
        
        // Format as DD/MM/YYYY
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        return dateValue;
    }
}

function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    
    if (data.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-warning no-results fade-in" role="alert">
                <i class="bi bi-exclamation-triangle"></i> <strong>No valid data found</strong><br>
                Please check your Excel file format and try again.
            </div>
        `;
        return;
    }

    const stats = data.stats || { total: data.length, matched: 0, enhanced: 0, notFound: 0, isJobMode: false };
    const missingRecords = stats.isJobMode ? [] : data.filter(row => row._displayOnly['Database Match'] === 'No');
    const hasWiNumbers = hasPopulatedWiNumbers(data);
    
    let html = '<div class="fade-in">';
    
    if (stats.isJobMode) {
        html += `
            <div class="summary-card">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0"><i class="bi bi-file-earmark-check"></i> ASR File Loaded (Job Mode)</h5>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-2"><strong>File:</strong> ${originalFilename}</p>
                        <p class="mb-2"><strong>Records Processed:</strong> ${stats.total}</p>
                        <p class="mb-2"><strong>WiNumbers Found:</strong> <span class="badge bg-success">${stats.total}</span></p>
                        <p class="mb-2"><strong>Mode:</strong> <span class="badge bg-info">Job Export Ready</span></p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-2"><strong>Date Processed:</strong> ${new Date().toLocaleDateString()}</p>
                        <p class="mb-0"><strong>Status:</strong> <span class="text-success">Ready for Job.xlsx Export</span></p>
                    </div>
                </div>
                <div class="alert alert-info mt-3 mb-0">
                    <i class="bi bi-info-circle"></i> <strong>Job Mode Detected:</strong> This appears to be an ASR file with populated WiNumbers. Database lookup has been skipped. You can now download the Job.xlsx file directly.
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="summary-card">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0"><i class="bi bi-clipboard-check"></i> Processing Summary</h5>
                    <button type="button" class="btn btn-outline-primary btn-sm hover-btn" id="copyOrderAcceptanceBtn">
                        <i class="bi bi-download"></i> Download Order Acceptance
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-2"><strong>File:</strong> ${originalFilename}</p>
                        <p class="mb-2"><strong>Records Processed:</strong> ${stats.total}</p>
                        <p class="mb-2"><strong>Database Matches:</strong> <span class="badge bg-success">${stats.matched}</span></p>
                        <p class="mb-2"><strong>Missing from Database:</strong> <span class="badge bg-warning">${stats.notFound}</span></p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-2"><strong>Date Processed:</strong> ${new Date().toLocaleDateString()}</p>
                        <p class="mb-0"><strong>Status:</strong> <span class="text-success">Ready for Download</span></p>
                    </div>
                </div>
                ${booksDatabase.length > 0 ? 
                    `<div class="alert alert-info mt-3 mb-0">
                        <i class="bi bi-database"></i> Using database with ${booksDatabase.length} book specifications.
                    </div>` : 
                    `<div class="alert alert-danger mt-3 mb-0">
                        <i class="bi bi-exclamation-triangle"></i> Database not available - cannot enhance records with specifications
                    </div>`
                }
            </div>
        `;
    }

    if (hasWiNumbers) {
        const wiNumbers = [...new Set(data.filter(row => row['WiNumber']).map(row => row['WiNumber']))];
        html += `
            <div class="job-export-card">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">
                        <i class="bi bi-file-earmark-spreadsheet"></i> Job Export Ready
                    </h5>
                    <button type="button" class="btn btn-info btn-sm hover-btn" onclick="downloadJobFile()">
                        <i class="bi bi-download"></i> Download Job.xlsx
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <p class="mb-2"><strong>Job Records:</strong> ${stats.total} records ready for export</p>
                        <p class="mb-2"><strong>Primary Keys:</strong> ${wiNumbers.length} unique WiNumber${wiNumbers.length > 1 ? 's' : ''} (${wiNumbers.join(', ')})</p>
                        <p class="mb-2"><strong>Binding Method:</strong> Converted to "Limp P/Bound" format</p>
                        <p class="mb-0"><strong>Mapping:</strong> OrderRef → poNum, Title → description, ISBN → U_LimpISBN</p>
                    </div>
                    <div class="col-md-4">
                        <div class="bg-white rounded p-3 border">
                            <h6 class="text-muted mb-2">Sample Job Record:</h6>
                            <small>
                                <strong>poNum:</strong> ${data[0]['OrderRef'] || 'N/A'}<br>
                                <strong>description:</strong> ${(data[0]['Title'] || '').toString().substring(0, 20) || 'N/A'}...<br>
                                <strong>U_BindingMethod:</strong> Limp P/Bound<br>
                                <strong>scheduledShipDate:</strong> ${data[0]['Delivery Date'] || 'N/A'}
                            </small>
                        </div>
                    </div>
                </div>
                <div class="alert alert-success mt-3 mb-0">
                    <i class="bi bi-check-circle"></i> <strong>Ready for Export:</strong> Job.xlsx file contains all required fields mapped from ASR Daily Order data.
                </div>
            </div>
        `;
    }

    if (missingRecords.length > 0 && !stats.isJobMode) {
        html += `
            <div class="order-result no-results">
                <div class="order-title d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-exclamation-triangle"></i> Missing Records (${missingRecords.length})</span>
                    <button type="button" class="btn btn-outline-warning btn-sm hover-btn" onclick="copyMissingRecords()">
                        <i class="bi bi-clipboard"></i> Copy Missing List
                    </button>
                </div>
                <div class="alert alert-warning">
                    <p class="mb-2"><strong>The following records were not found in the database:</strong></p>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Row</th>
                                    <th>Master Ref</th>
                                    <th>OrderRef</th>
                                    <th>ISBN</th>
                                    <th>Quantity</th>
                                    <th>Delivery Date</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        missingRecords.forEach(record => {
            html += `
                <tr>
                    <td>${record._displayOnly['Row']}</td>
                    <td><strong>${record._displayOnly['Master Ref (Upload)']}</strong></td>
                    <td><strong>${record['OrderRef']}</strong></td>
                    <td><strong>${record['ISBN']}</strong></td>
                    <td>${record['Quantity']}</td>
                    <td>${record['Delivery Date']}</td>
                </tr>
            `;
        });
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } else if (stats.matched > 0 && !stats.isJobMode) {
        html += `
            <div class="alert alert-success fade-in">
                <i class="bi bi-check-circle"></i> <strong>All records found in database!</strong><br>
                All ${stats.total} records were successfully matched and enhanced with database specifications.
            </div>
        `;
    }
    
    html += '</div>';
    
    resultsContainer.innerHTML = html;
    
    if (!stats.isJobMode) {
        attachOrderAcceptanceListener();
    }
    
    document.getElementById('actionButtons').style.display = 'flex';
    document.getElementById('downloadBtn').disabled = false;
    document.getElementById('downloadJobBtn').disabled = !hasWiNumbers;
}

function showProgress() {
    const progressContainer = document.querySelector('.upload-progress');
    if (progressContainer) {
        progressContainer.style.display = 'block';
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            let width = 0;
            const interval = setInterval(() => {
                width += 10;
                progressBar.style.width = width + '%';
                if (width >= 90) {
                    clearInterval(interval);
                }
            }, 100);
        }
    }
}

function hideProgress() {
    setTimeout(() => {
        const progressContainer = document.querySelector('.upload-progress');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }, 500);
}

function showError(message) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
        <div class="alert alert-danger fade-in" role="alert">
            <i class="bi bi-exclamation-circle"></i> <strong>Error:</strong> ${message}
        </div>
    `;
    document.getElementById('actionButtons').style.display = 'none';
}

function clearData() {
    document.getElementById('fileUpload').value = '';
    document.getElementById('results').innerHTML = '';
    document.getElementById('actionButtons').style.display = 'none';
    document.getElementById('downloadBtn').disabled = true;
    document.getElementById('downloadJobBtn').disabled = true;
    processedData = [];
    originalFilename = '';
}

function downloadProcessedFile() {
    if (processedData.length === 0) {
        alert('No data to download. Please upload and process a file first.');
        return;
    }

    try {
        const wb = XLSX.utils.book_new();
        
        const downloadData = processedData.map(row => {
            const cleanRow = { ...row };
            delete cleanRow._displayOnly;
            
            if (cleanRow.ISBN && !isNaN(cleanRow.ISBN)) {
                cleanRow.ISBN = parseInt(cleanRow.ISBN, 10);
            }
            
            return cleanRow;
        });
        
        const ws = XLSX.utils.json_to_sheet(downloadData);
        
        // Format the ISBN column as number with no decimal places
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r + 1; R <= range.e.r; R++) {
            const isbnCell = XLSX.utils.encode_cell({ r: R, c: 4 }); // ISBN is column E (index 4)
            if (ws[isbnCell] && ws[isbnCell].v) {
                ws[isbnCell].t = 'n';
                ws[isbnCell].z = '0';
            }
        }
        
        XLSX.utils.book_append_sheet(wb, ws, "ASR Daily Order");
        
        const now = new Date();
        const dateTime = now.toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
        const filename = `ASR_Daily_Order_${dateTime}.xlsx`;
        
        XLSX.writeFile(wb, filename);
        
        const btn = document.getElementById('downloadBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-circle"></i> Downloaded!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 3000);
        
    } catch (error) {
        console.error('Error downloading file:', error);
        alert('Error creating download file. Please try again.');
    }
}

function downloadJobFile() {
    if (processedData.length === 0) {
        alert('No data to download. Please upload and process a file first.');
        return;
    }

    if (!hasPopulatedWiNumbers(processedData)) {
        alert('Job.xlsx requires populated WiNumber values. Please upload an ASR file with WiNumber data first.');
        return;
    }

    try {
        const wb = XLSX.utils.book_new();
        
        const jobData = processedData.map(row => {
            // Helper function to check if value should be empty
            const isPriceUnpriced = (price) => {
                return !price || price.toString().toUpperCase() === 'UNPRICED';
            };
            
            // Format current date as DD/MM/YYYY
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const processedDate = `${day}/${month}/${year}`;
            
            return {
                '_ACTION_': 'U',
                'primaryKey': row['WiNumber'],
                'job': row['WiNumber'], // Set job equal to primaryKey
                'poNum': row['OrderRef'],
                'description': row['Title'],
                'U_LimpISBN': row['ISBN'],
                'U_BindingMethod': 'Limp P/Bound',
                'U_HeadTrim': '3mm',
                'description2': row['Packing'],
                'U_fileDate': '',
                'U_ProcessedDate': processedDate,
                'scheduledShipDate': row['Delivery Date'],
                'shipToJobContact': '',
                'U_CoverPrice_UK': isPriceUnpriced(row['Price UK']) ? '' : row['Price UK'],
                'U_CoverPrice_US': isPriceUnpriced(row['Price US']) ? '' : row['Price US'],
                'U_CoverPrice_CAD': isPriceUnpriced(row['Price CAN']) ? '' : row['Price CAN']
            };
        });
        
        const ws = XLSX.utils.json_to_sheet(jobData);
        
        // Format the ISBN column as number
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r + 1; R <= range.e.r; R++) {
            const isbnCell = XLSX.utils.encode_cell({ r: R, c: 5 }); // U_LimpISBN is column F
            if (ws[isbnCell] && ws[isbnCell].v) {
                ws[isbnCell].t = 'n';
                ws[isbnCell].z = '0';
            }
        }
        
        ws['!cols'] = [
            { wch: 10 }, { wch: 12 }, { wch: 8 }, { wch: 15 }, { wch: 40 }, { wch: 15 },
            { wch: 15 }, { wch: 10 }, { wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
            { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }
        ];
        
        XLSX.utils.book_append_sheet(wb, ws, "Job");
        
        const filename = `Job.xlsx`;
        
        XLSX.writeFile(wb, filename);
        
        const btn = document.getElementById('downloadJobBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-circle"></i> Downloaded!';
        btn.classList.remove('btn-info');
        btn.classList.add('btn-success');
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-info');
        }, 3000);
        
    } catch (error) {
        console.error('Error downloading Job file:', error);
        alert('Error creating Job file. Please try again.');
    }
}

function downloadOrderAcceptance() {
    if (processedData.length === 0) {
        alert('No data to download. Please upload and process a file first.');
        return;
    }

    try {
        const wb = XLSX.utils.book_new();
        
        const orderAcceptanceData = processedData.map(row => {
            return {
                'Master Ref': row['Master Ref'] || '',
                'OrderRef': row['OrderRef'] || '',
                'ISBN': row['ISBN'] || '',
                'Title': row['Title'] || '',
                'Quantity': row['Quantity'] || ''
            };
        });
        
        const ws = XLSX.utils.json_to_sheet(orderAcceptanceData);
        
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r + 1; R <= range.e.r; R++) {
            const isbnCell = XLSX.utils.encode_cell({ r: R, c: 2 });
            if (ws[isbnCell] && ws[isbnCell].v) {
                ws[isbnCell].t = 'n';
                ws[isbnCell].z = '0';
            }
        }
        
        ws['!cols'] = [
            { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 60 }, { wch: 10 }
        ];
        
        XLSX.utils.book_append_sheet(wb, ws, "Order Acceptance");
        
        const now = new Date();
        const dateTime = now.toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
        const filename = `ASR_Order_Acceptance_${dateTime}.xlsx`;
        
        XLSX.writeFile(wb, filename);
        
        const btn = document.getElementById('copyOrderAcceptanceBtn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-circle"></i> Downloaded!';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 3000);
        }
        
    } catch (error) {
        console.error('Error downloading order acceptance file:', error);
        alert('Error creating download file. Please try again.');
    }
}

function attachOrderAcceptanceListener() {
    const btn = document.getElementById('copyOrderAcceptanceBtn');
    if (btn) {
        btn.removeEventListener('click', downloadOrderAcceptance);
        btn.addEventListener('click', downloadOrderAcceptance);
    }
}

function copyMissingRecords() {
    const missingRecords = processedData.filter(row => row._displayOnly['Database Match'] === 'No');
    
    if (missingRecords.length === 0) {
        alert('No missing records to copy.');
        return;
    }
    
    let clipboardText = `Missing Records from Database\n`;
    clipboardText += `===============================\n`;
    clipboardText += `File: ${originalFilename}\n`;
    clipboardText += `Date: ${new Date().toLocaleString()}\n`;
    clipboardText += `Total Missing: ${missingRecords.length}\n\n`;
    
    missingRecords.forEach(record => {
        clipboardText += `${record._displayOnly['Row']}\t${record._displayOnly['Master Ref (Upload)']}\t${record['OrderRef']}\t${record['ISBN']}\t${record['Quantity']}\t${record['Delivery Date']}\n`;
    });
    
    navigator.clipboard.writeText(clipboardText)
        .then(() => {
            const buttons = document.querySelectorAll('button[onclick="copyMissingRecords()"]');
            if (buttons.length > 0) {
                const btn = buttons[0];
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check-circle"></i> Copied!';
                btn.classList.remove('btn-outline-warning');
                btn.classList.add('btn-success');
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-outline-warning');
                }, 2000);
            }
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        });
}