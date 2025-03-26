async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) return;

    const formData = new FormData(event.target);
    try {
        const response = await fetch('https://passmanager.skillsative.com/submit', {
            method: 'POST',
            body: new URLSearchParams(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const html = await response.text();
        document.querySelector('.container').innerHTML = html;
        
        // Update URL without page reload
        history.pushState({}, '', '/');
    } catch (error) {
        console.error('Error:', error);
    }
}

function validateForm() {
    const sections = [
        { name: 'usage', message: 'Veuillez sélectionner au moins un usage' },
        { name: 'devices', message: 'Veuillez sélectionner au moins un appareil' },
        { name: 'budget', message: 'Veuillez sélectionner un budget' }
    ];

    for (const section of sections) {
        const inputs = document.querySelectorAll(`input[name="${section.name}"], input[name="${section.name}[]"]`);
        let isSelected = false;

        inputs.forEach(input => {
            if ((input.type === 'checkbox' || input.type === 'radio') && input.checked) {
                isSelected = true;
            }
        });

        if (!isSelected) {
            alert(section.message);
            return false;
        }
    }

    return true;
}