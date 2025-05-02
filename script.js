document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const searchSection = document.getElementById('search-section');
    const resultSection = document.getElementById('result-section');
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const printBtn = document.getElementById('print-btn');
    const downloadBtn = document.getElementById('download-btn');
    const backBtn = document.getElementById('back-btn');
    const errorBackBtn = document.getElementById('error-back-btn');
    const generationDate = document.getElementById('generation-date');
    
    // DOB Dropdown Elements
    const dobDay = document.getElementById('dob-day');
    const dobMonth = document.getElementById('dob-month');
    const dobYear = document.getElementById('dob-year');
    
    // Student Info Elements
    const studentName = document.getElementById('student-name');
    const studentRoll = document.getElementById('student-roll');
    const studentReg = document.getElementById('student-reg');
    const studentDob = document.getElementById('student-dob');
    const schoolIndex = document.getElementById('school-index');
    const marksBody = document.getElementById('marks-body');
    const totalMarks = document.getElementById('total-marks');
    const overallGrade = document.getElementById('overall-grade');
    const resultStatus = document.getElementById('result-status');
    
    // Initialize DOB dropdowns
    initializeDobDropdowns();
    
    // Subject mapping for display
    const subjectMapping = {
        'First_Language': 'First Language',
        'Second_Language': 'Second Language',
        'Mathematics': 'Mathematics',
        'Physical_Science': 'Physical Science',
        'Life_Science': 'Life Science',
        'History': 'History',
        'Geography': 'Geography',
        'Opt_Elec': 'Optional Elective'
    };
    
    // Initialize DOB dropdowns
    function initializeDobDropdowns() {
        // Add days (1-31)
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = i;
            dobDay.appendChild(option);
        }
        
        // Add months (1-12)
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = months[i - 1];
            dobMonth.appendChild(option);
        }
        
        // Add years (2000-2012)
        for (let i = 2000; i <= 2012; i++) {
            const option = document.createElement('option');
            option.value = i.toString().substring(2); // Take last 2 digits (YY format)
            option.textContent = i;
            dobYear.appendChild(option);
        }
    }
    
    // Form submission handler
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rollNo = document.getElementById('roll-no').value.trim();
        const day = dobDay.value;
        const month = dobMonth.value;
        const year = dobYear.value;
        
        // Basic validation
        if (!rollNo) {
            showError('Please enter your Roll Number.');
            return;
        }
        
        if (!day || !month || !year) {
            showError('Please select your complete Date of Birth.');
            return;
        }
        
        // Combine DOB in DDMMYY format
        const dob = day + month + year;
        
        // Show loading
        searchSection.style.display = 'none';
        loadingElement.style.display = 'flex';
        errorMessage.style.display = 'none';
        
        // Fetch result
        fetchResult(rollNo, dob);
    });
    
    // Fetch result from API
    function fetchResult(rollNo, dob) {
        fetch(`https://boardresultapi.abplive.com/wb/2025/10/${rollNo}/${dob}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Result not found');
                }
                return response.json();
            })
            .then(data => {
                displayResult(data);
            })
            .catch(error => {
                showError('No result found. Please check your Roll Number and Date of Birth.');
            })
            .finally(() => {
                loadingElement.style.display = 'none';
            });
    }
    
    // Display result data
    function displayResult(data) {
        // Fill student info
        studentName.textContent = data.Name || '-';
        studentRoll.textContent = data.Roll_No || '-';
        studentReg.textContent = data.Reg_No || '-';
        
        // Format date of birth as DD-MM-YYYY if possible
        const dob = data.Date_of_Birth || '-';
        if (dob.length === 6) {
            const day = dob.substring(0, 2);
            const month = dob.substring(2, 4);
            const year = '20' + dob.substring(4, 6); // Assuming 20xx for the year
            studentDob.textContent = `${day}-${month}-${year}`;
        } else {
            studentDob.textContent = dob;
        }
        
        schoolIndex.textContent = data.School_Index || '-';
        
        // Clear previous marks
        marksBody.innerHTML = '';
        
        // Add subject rows
        for (const subject in subjectMapping) {
            const marksKey = `${subject}_Marks`;
            const gradeKey = `${subject}_Grade`;
            
            // Only add subjects that have marks or grades
            if (data[marksKey] || data[gradeKey]) {
                const row = document.createElement('tr');
                
                const subjectCell = document.createElement('td');
                subjectCell.textContent = subjectMapping[subject];
                
                const marksCell = document.createElement('td');
                marksCell.textContent = data[marksKey] || '-';
                
                const gradeCell = document.createElement('td');
                gradeCell.textContent = data[gradeKey] || '-';
                
                row.appendChild(subjectCell);
                row.appendChild(marksCell);
                row.appendChild(gradeCell);
                
                marksBody.appendChild(row);
            }
        }
        
        // Set aggregate and overall grade
        totalMarks.textContent = data.Aggregate || '-';
        overallGrade.textContent = data.Overall_Grade || '-';
        
        // Set result status
        resultStatus.textContent = data.Remarks || '-';
        if (data.Remarks === 'PASS') {
            resultStatus.classList.add('pass');
            resultStatus.classList.remove('fail');
        } else if (data.Remarks === 'FAIL') {
            resultStatus.classList.add('fail');
            resultStatus.classList.remove('pass');
        } else {
            resultStatus.classList.remove('pass', 'fail');
        }
        
        // Set generation date
        const now = new Date();
        generationDate.textContent = now.toLocaleString();
        
        // Show result section
        resultSection.style.display = 'block';
    }
    
    // Show error message
    function showError(message) {
        document.getElementById('error-text').textContent = message;
        errorMessage.style.display = 'block';
        searchSection.style.display = 'none';
        resultSection.style.display = 'none';
        loadingElement.style.display = 'none';
    }
    
    // Print button handler
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Download PDF button handler
    downloadBtn.addEventListener('click', function() {
        // Show loading message
        const originalButtonText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        downloadBtn.disabled = true;
        
        // Use setTimeout to allow the UI to update before starting the PDF generation
        setTimeout(() => {
            generateOptimizedPDF().then(() => {
                // Reset button text
                downloadBtn.innerHTML = originalButtonText;
                downloadBtn.disabled = false;
            }).catch(error => {
                console.error('Error generating PDF:', error);
                downloadBtn.innerHTML = originalButtonText;
                downloadBtn.disabled = false;
                alert('Failed to generate PDF. Please try again.');
            });
        }, 100);
    });
    
    // Generate optimized PDF function (smaller file size)
    async function generateOptimizedPDF() {
        const { jsPDF } = window.jspdf;
        
        try {
            // Create a new PDF document with compression
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            // Get student data
            const name = studentName.textContent;
            const roll = studentRoll.textContent;
            const regNo = studentReg.textContent;
            const birthDate = studentDob.textContent;
            const school = schoolIndex.textContent;
            const aggregate = totalMarks.textContent;
            const grade = overallGrade.textContent;
            const result = resultStatus.textContent;
            
            // Set font sizes
            const titleSize = 16;
            const subtitleSize = 12;
            const normalSize = 10;
            const smallSize = 8;
            
            // Add header
            pdf.setFontSize(titleSize);
            pdf.setFont('helvetica', 'bold');
            pdf.text('West Bengal Board of Secondary Education', 105, 20, { align: 'center' });
            
            pdf.setFontSize(subtitleSize);
            pdf.text('Secondary Examination Result 2025', 105, 30, { align: 'center' });
            
            // Add student info
            pdf.setFontSize(normalSize);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Student Information', 20, 45);
            
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Name: ${name}`, 20, 55);
            pdf.text(`Roll No: ${roll}`, 20, 62);
            pdf.text(`Registration No: ${regNo}`, 20, 69);
            pdf.text(`Date of Birth: ${birthDate}`, 20, 76);
            pdf.text(`School Index: ${school}`, 20, 83);
            
            // Add marks table
            pdf.setFont('helvetica', 'bold');
            pdf.text('Subject-wise Marks', 20, 95);
            
            // Table headers
            pdf.setFillColor(240, 240, 240);
            pdf.rect(20, 100, 170, 8, 'F');
            pdf.text('Subject', 25, 106);
            pdf.text('Marks', 110, 106);
            pdf.text('Grade', 150, 106);
            
            // Table rows
            let yPos = 115;
            const rows = marksBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                pdf.setFont('helvetica', 'normal');
                pdf.text(cells[0].textContent, 25, yPos);
                pdf.text(cells[1].textContent, 110, yPos);
                pdf.text(cells[2].textContent, 150, yPos);
                yPos += 8;
            });
            
            // Add total and result
            pdf.setFillColor(240, 240, 240);
            pdf.rect(20, yPos, 170, 8, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.text('Aggregate', 25, yPos + 6);
            pdf.text(aggregate, 110, yPos + 6);
            pdf.text(grade, 150, yPos + 6);
            
            yPos += 15;
            pdf.text(`Result: ${result}`, 105, yPos, { align: 'center' });
            
            // Add footer
            yPos += 20;
            pdf.setFontSize(smallSize);
            pdf.setFont('helvetica', 'italic');
            pdf.text('This is a computer-generated result. No signature is required.', 105, yPos, { align: 'center' });
            
            yPos += 5;
            pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, yPos, { align: 'center' });
            
            // Get student name for the filename
            const studentNameText = name.trim() || 'result';
            const rollNoText = roll.trim() || '';
            
            // Generate filename
            const filename = `${studentNameText.replace(/\s+/g, '_')}_${rollNoText}_Marksheet.pdf`;
            
            // Save the PDF with compression
            pdf.save(filename);
        } catch (error) {
            console.error('Error in PDF generation:', error);
            throw error;
        }
    }
    
    // Back button handlers
    backBtn.addEventListener('click', function() {
        resultSection.style.display = 'none';
        searchSection.style.display = 'block';
    });
    
    errorBackBtn.addEventListener('click', function() {
        errorMessage.style.display = 'none';
        searchSection.style.display = 'block';
    });
});