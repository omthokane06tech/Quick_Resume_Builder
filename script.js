// Initial Data Load (Optional: Pre-fill with dummy data)
document.addEventListener('DOMContentLoaded', () => {
    updatePreview();
    
    // Attach listeners to static inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Add initial dynamic fields
    addEducationField(true); 
    addProjectField(true);
});

function updatePreview() {
    // 1. Personal Info
    document.getElementById('res-name').innerText = document.getElementById('nameInput').value;
    
    const email = document.getElementById('emailInput').value;
    const linkedin = document.getElementById('linkedinInput').value;
    const github = document.getElementById('githubInput').value;
    const portfolio = document.getElementById('portfolioInput').value;
    const leetcode = document.getElementById('leetcodeInput').value;

    let linksHTML = ``;
    if(email) linksHTML += `<a href="mailto:${email}">${email}</a> | `;
    if(linkedin) linksHTML += `<a href="${linkedin}" target="_blank">LinkedIn</a> | `;
    if(leetcode) linksHTML += `<a href="${leetcode}" target="_blank">LeetCode</a> | `;
    if(github) linksHTML += `<a href="${github}" target="_blank">GitHub</a> | `;
    if(portfolio) linksHTML += `<a href="${portfolio}" target="_blank">Portfolio</a>`;
    
    // Remove trailing pipe
    if(linksHTML.endsWith(' | ')) linksHTML = linksHTML.slice(0, -3);
    document.getElementById('res-links').innerHTML = linksHTML;

    // 2. Summary (Split by new line)
    renderList('summaryInput', 'res-summary');
    renderList('skillsInput', 'res-skills');
    renderList('achievementsInput', 'res-achievements');
    renderList('extraInput', 'res-extra');

    // 3. Education (Dynamic)
    updateEducationPreview();
    
    // 4. Projects (Dynamic)
    updateProjectsPreview();
}

// Helper to render simple lists
function renderList(inputId, outputId) {
    const text = document.getElementById(inputId).value;
    const listContainer = document.getElementById(outputId);
    listContainer.innerHTML = '';
    
    if(text) {
        const lines = text.split('\n');
        lines.forEach(line => {
            if(line.trim() !== '') {
                const li = document.createElement('li');
                li.innerText = line.replace(/^[•\-\*]\s*/, ''); // Remove existing bullets if user typed them
                listContainer.appendChild(li);
            }
        });
    }
}

// --- DYNAMIC FIELDS: EDUCATION ---
function addEducationField(isFirst = false) {
    const container = document.getElementById('educationList');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.style.marginBottom = "15px";
    div.style.border = "1px dashed #ccc";
    div.style.padding = "10px";
    
    div.innerHTML = `
        <input type="text" class="edu-school-in" placeholder="Institution Name" oninput="updatePreview()">
        <input type="text" class="edu-degree-in" placeholder="Degree / Certificate" oninput="updatePreview()">
        <input type="text" class="edu-loc-in" placeholder="Location" oninput="updatePreview()">
        <input type="text" class="edu-date-in" placeholder="Date (e.g., Aug 2023 - Present)" oninput="updatePreview()">
        <input type="text" class="edu-grade-in" placeholder="Grade/CGPA" oninput="updatePreview()">
        ${!isFirst ? '<button onclick="this.parentElement.remove(); updatePreview()" style="color:red;">Remove</button>' : ''}
    `;
    container.appendChild(div);
}

function updateEducationPreview() {
    const tbody = document.getElementById('res-education');
    tbody.innerHTML = '';
    const items = document.querySelectorAll('#educationList .dynamic-item');
    
    items.forEach(item => {
        const school = item.querySelector('.edu-school-in').value;
        const degree = item.querySelector('.edu-degree-in').value;
        const loc = item.querySelector('.edu-loc-in').value;
        const date = item.querySelector('.edu-date-in').value;
        const grade = item.querySelector('.edu-grade-in').value;

        if(school || degree) {
            const row = `
                <tr>
                    <td>
                        <div class="edu-school">${school}</div>
                        <div class="edu-degree">${degree} ${grade ? `(${grade})` : ''}</div>
                    </td>
                    <td>
                        <div class="edu-loc">${loc}</div>
                        <div class="edu-date">${date}</div>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        }
    });
}

// --- DYNAMIC FIELDS: PROJECTS ---
function addProjectField(isFirst = false) {
    const container = document.getElementById('projectList');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.style.marginBottom = "15px";
    div.style.border = "1px dashed #ccc";
    div.style.padding = "10px";

    div.innerHTML = `
        <input type="text" class="proj-title-in" placeholder="Project Title" oninput="updatePreview()">
        <input type="text" class="proj-tech-in" placeholder="Tech Stack (e.g., Node.js, SQL)" oninput="updatePreview()">
        <textarea class="proj-desc-in" rows="2" placeholder="Description bullets" oninput="updatePreview()"></textarea>
        ${!isFirst ? '<button onclick="this.parentElement.remove(); updatePreview()" style="color:red;">Remove</button>' : ''}
    `;
    container.appendChild(div);
}

function updateProjectsPreview() {
    const container = document.getElementById('res-projects');
    container.innerHTML = '';
    const items = document.querySelectorAll('#projectList .dynamic-item');

    items.forEach(item => {
        const title = item.querySelector('.proj-title-in').value;
        const tech = item.querySelector('.proj-tech-in').value;
        const desc = item.querySelector('.proj-desc-in').value;

        if(title) {
            let bullets = '';
            if(desc) {
                desc.split('\n').forEach(line => {
                    if(line.trim()) bullets += `<li>${line.replace(/^[•\-\*]\s*/, '')}</li>`;
                });
            }

            const html = `
                <div class="project-item">
                    <div class="project-header">
                        <span class="project-title">${title}</span> 
                        ${tech ? `| <span class="project-tech">${tech}</span>` : ''}
                    </div>
                    <ul class="bullet-list">${bullets}</ul>
                </div>
            `;
            container.innerHTML += html;
        }
    });
}

// --- PDF DOWNLOAD FUNCTION ---
function downloadPDF() {
    const element = document.getElementById('resume-preview');
    
    // Configuration for html2pdf
    // Note: enableLinks: true is key, but HTML5 canvas often flattens text.
    // To allow true text selection, we often have to use specific settings or browser print.
    const opt = {
        margin:       0, // No margins on the PDF itself (CSS handles padding)
        filename:     'my-resume.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().set(opt).from(element).save();
}
