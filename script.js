document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const searchSection = document.getElementById('search-section');
    const resultSection = document.getElementById('result-section');
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const printBtn = document.getElementById('print-btn');
    const backBtn = document.getElementById('back-btn');
    const errorBackBtn = document.getElementById('error-back-btn');
    
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
    
    // Form submission handler
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rollNo = document.getElementById('roll-no').value.trim();
        const dob = document.getElementById('dob').value.trim();
        
        // Basic validation
        if (!rollNo || !dob) {
            showError('Please enter both Roll Number and Date of Birth.');
            return;
        }
        
        if (dob.length !== 6 || !/^\d+$/.test(dob)) {
            showError('Date of Birth should be 6 digits in DDMMYY format.');
            return;
        }
        
        // Show loading
        searchSection.style.display = 'none';
        loadingElement.style.display = 'flex';
        errorMessage.style.display = 'none';
        
        // Fetch result
        fetchResult(rollNo, dob);
    });
    
    // Fetch result from API
    function fetchResult(rollNo, dob) {
        // For demo purposes, we'll use the sample data provided
        // In a real application, you would make an actual API call
        
        // Simulate API call delay
        // setTimeout(() => {
        //     // Check if the roll number and DOB match our sample data
        //     if (rollNo === '602822N0262' && dob === '100608') {
        //         const resultData = {
        //             "First_Language_Grade": "B+",
        //             "Mathematics_Marks": "26",
        //             "Physical_Science_Grade": "B",
        //             "Geography_Marks": "52",
        //             "Second_Language_Marks": "51",
        //             "Reg_No": "5242052921",
        //             "Mathematics_Grade": "C",
        //             "Aggregate": "310",
        //             "Life_Science_Grade": "B+",
        //             "School_Index": "L4121",
        //             "Life_Science_Marks": "48",
        //             "History_Grade": "B",
        //             "Opt_Elec_Marks": "",
        //             "Geography_Grade": "B+",
        //             "Physical_Science_Marks": "42",
        //             "Remarks": "PASS",
        //             "Opt_Elec_Grade": "",
        //             "Name": "SHREYA HAZRA",
        //             "History_Marks": "40",
        //             "Date_of_Birth": "100608",
        //             "First_Language_Marks": "51",
        //             "Second_Language_Grade": "B+",
        //             "Overall_Grade": "B",
        //             "Roll_No": "602822N0262"
        //         };
        //         displayResult(resultData);
        //     } else {
        //         // Show error for non-matching data
        //         showError('No result found. Please check your Roll Number and Date of Birth.');
        //     }
            
        //     loadingElement.style.display = 'none';
        // }, 1500);
        
        // In a real application, you would use fetch API like this:
       
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