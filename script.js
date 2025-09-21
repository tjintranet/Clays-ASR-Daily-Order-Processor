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

// Function to decode Cover Spec codes
function decodeCoverSpec(code) {
    if (!code || code.length < 6) {
        return 'Invalid cover spec code';
    }

    const upperCode = code.toUpperCase().trim();
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
    if (booksDatabase.length > 0) {
        console.log('Sample database ISBNs:', 
            booksDatabase.slice(0, 5).map(book => book.ISBN));
    }
    
    return null;
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileUpload');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const instructionsBtn = document.getElementById('instructionsBtn');

    loadBooksDatabase();

    fileInput.addEventListener('change', handleFileUpload);
    clearBtn.addEventListener('click', clearData);
    downloadBtn.addEventListener('click', downloadProcessedFile);
    instructionsBtn.addEventListener('click', showInstructions);
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
    const dataRows = rawData.slice(1);
    
    processedData = dataRows.map((row, index) => {
        const columnB = row[1] || '';
        const columnC = row[2] || '';
        const columnF = row[5] || '';
        const columnL = row[11] || '';
        const columnM = row[12] || '';
        const columnT = row[19] || '';
        
        const bookDetails = lookupBookDetailsByISBN(columnF);
        
        const processedRow = {
            'Master Ref': bookDetails ? bookDetails['Master Order ID'] || '' : '',
            'SID': columnC,
            'Title': bookDetails ? bookDetails.TITLE || '' : '',
            'ISBN': columnF,
            'Extent': bookDetails ? bookDetails.Extent || '' : '',
            'Bind Style': bookDetails ? bookDetails['Bind Style'] || '' : '',
            'Trim Height': bookDetails ? bookDetails['Trim Height'] || '' : '',
            'Trim Width': bookDetails ? bookDetails['Trim Width'] || '' : '',
            'Spine': bookDetails ? bookDetails['Cover Spine'] || '' : '',
            'Delivery Date': columnL ? formatDate(columnL) : '',
            'Quantity': columnM,
            'Cover Spec': bookDetails ? bookDetails['Cover Spec'] || '' : '',
            'Cover Spec Decoded': '',
            'Price UK': bookDetails ? bookDetails['Price UK'] || 'Unpriced' : 'Unpriced',
            'Price US': bookDetails ? bookDetails['Price US'] || 'Unpriced' : 'Unpriced',
            'Price CAN': bookDetails ? bookDetails['Price CAN'] || 'Unpriced' : 'Unpriced',
            'Paper': bookDetails ? bookDetails.Paper || '' : '',
            'GSM': bookDetails ? bookDetails.Gsm || '' : '',
            'Micron': bookDetails ? bookDetails.Micron || '' : '',
            'Packing': bookDetails ? bookDetails.Packing || '' : '',
            'Bleeds': bookDetails ? bookDetails.Bleeds || '' : '',
            'Delivery Dest': columnT,
            
            '_displayOnly': {
                'Row': index + 1,
                'Master Order ID (Column B)': columnB,
                'Customer Name': bookDetails ? bookDetails['Customer Name'] || '' : '',
                'Customer Order Ref': bookDetails ? bookDetails['Customer Order Ref'] || '' : '',
                'Database Match': bookDetails ? 'Yes' : 'No',
                'Enhanced': bookDetails ? true : false
            }
        };
        
        const coverSpec = processedRow['Cover Spec'];
        if (coverSpec) {
            processedRow['Cover Spec Decoded'] = decodeCoverSpec(coverSpec);
        }
        
        return processedRow;
    }).filter(row => row['ISBN'] || row['SID']);

    // Calculate stats AFTER filtering to ensure accurate counts
    const matchedCount = processedData.filter(row => row._displayOnly['Database Match'] === 'Yes').length;
    const notFoundCount = processedData.filter(row => row._displayOnly['Database Match'] === 'No').length;

    processedData.stats = {
        total: processedData.length,
        matched: matchedCount,
        enhanced: matchedCount,
        notFound: notFoundCount
    };

    displayResults(processedData);
}

function formatDate(dateValue) {
    try {
        if (typeof dateValue === 'number') {
            const excelEpoch = new Date(1900, 0, 1);
            const jsDate = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
            return jsDate.toLocaleDateString();
        }
        
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? dateValue : date.toLocaleDateString();
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

    const stats = data.stats || { total: data.length, matched: 0, enhanced: 0, notFound: 0 };
    const missingRecords = data.filter(row => row._displayOnly['Database Match'] === 'No');
    
    let html = '<div class="fade-in">';
    
    // Processing Summary
    html += `
        <div class="summary-card">
            <h5><i class="bi bi-clipboard-check"></i> Processing Summary</h5>
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
                    <i class="bi bi-database"></i> Using database with ${booksDatabase.length} book specifications.<br>
                    <small><strong>Upload columns:</strong> C (SID), F (ISBN), L (Delivery Date), M (Quantity), T (Delivery Dest)<br>
                    <strong>Database lookup:</strong> Uses Column F (ISBN) to find matching specifications</small>
                </div>` : 
                `<div class="alert alert-danger mt-3 mb-0">
                    <i class="bi bi-exclamation-triangle"></i> Database not available - cannot enhance records with specifications
                </div>`
            }
        </div>
    `;

    // Missing Records Section (only if there are missing records)
    if (missingRecords.length > 0) {
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
                        <table class="table table-sm" id="missingRecordsTable">
                            <thead>
                                <tr>
                                    <th>Row</th>
                                    <th>Clays Order No.</th>
                                    <th>ISBN)</th>
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
                    <td><strong>${record['SID']}</strong></td>
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
                    <small class="text-muted">These records will be included in the download but will only contain the uploaded data (columns C, F, L, M, T) without enhanced specifications from the database.</small>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="alert alert-success fade-in">
                <i class="bi bi-check-circle"></i> <strong>All records found in database!</strong><br>
                All ${stats.total} records were successfully matched and enhanced with database specifications.
            </div>
        `;
    }
    
    html += '</div>';
    
    resultsContainer.innerHTML = html;
    
    // Show action buttons and enable download
    // Show action buttons and enable download
    document.getElementById('actionButtons').style.display = 'flex';
    document.getElementById('downloadBtn').disabled = false;
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
    document.getElementById('copyResultBtn').disabled = true;
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
            
            // Convert ISBN to number if it's a valid number
            if (cleanRow.ISBN && !isNaN(cleanRow.ISBN)) {
                cleanRow.ISBN = parseInt(cleanRow.ISBN, 10);
            }
            
            return cleanRow;
        });
        
        const ws = XLSX.utils.json_to_sheet(downloadData);
        
        // Format the ISBN column as number with no decimal places
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r + 1; R <= range.e.r; R++) {
            const isbnCell = XLSX.utils.encode_cell({ r: R, c: 3 }); // ISBN is column D (index 3)
            if (ws[isbnCell] && ws[isbnCell].v) {
                ws[isbnCell].t = 'n'; // Set cell type to number
                ws[isbnCell].z = '0'; // Set number format to integer (no decimal places)
            }
        }
        
        XLSX.utils.book_append_sheet(wb, ws, "ASR Daily Order");
        
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `ASR_Daily_Order_${originalFilename}_${timestamp}.xlsx`;
        
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
    
    clipboardText += `Row\tSID (Col C)\tISBN (Col F)\tQuantity (Col M)\tDelivery Date (Col L)\n`;
    clipboardText += `---\t----------\t-----------\t---------------\t-------------------\n`;
    
    missingRecords.forEach(record => {
        clipboardText += `${record._displayOnly['Row']}\t${record['SID']}\t${record['ISBN']}\t${record['Quantity']}\t${record['Delivery Date']}\n`;
    });
    
    navigator.clipboard.writeText(clipboardText)
        .then(() => {
            // Find the button that was clicked and show success feedback
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

function showInstructions() {
    const modal = new bootstrap.Modal(document.getElementById('instructionsModal'));
    modal.show();
}