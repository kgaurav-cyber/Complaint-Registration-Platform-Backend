document.getElementById('complaintForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const statusMessage = document.getElementById('statusMessage');
    
    // Reset status message
    statusMessage.className = 'status-message hidden';
    statusMessage.textContent = '';
    
    // Add loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Gather form data
    const formData = {
        name: document.getElementById('name').value,
        city: document.getElementById('city').value,
        mobile: document.getElementById('mobile').value,
        complaint: document.getElementById('complaint').value
    };
    
    try {
        const response = await fetch('http://127.0.0.1:3030/api/complaints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show success
            statusMessage.textContent = data.message || 'Complaint submitted successfully!';
            statusMessage.className = 'status-message success';
        } else {
            // Show error from backend
            statusMessage.textContent = data.error || 'Failed to submit complaint. Please try again.';
            statusMessage.className = 'status-message error';
        }
    } catch (error) {
        // Show network error
        console.error('Error submitting complaint:', error);
        statusMessage.textContent = 'Network error. Please check your connection and try again.';
        statusMessage.className = 'status-message error';
    } finally {
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});
