document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const analyzeButton = document.getElementById('analyzeButton');
    const safetyStatusDiv = document.getElementById('safetyStatus');
    const potentialThreatsDiv = document.getElementById('potentialThreats');
    const toggleHistoryButton = document.getElementById('toggleHistoryButton');
    const historyPanel = document.getElementById('historyPanel');
    const historyList = document.getElementById('historyList');
    const clearHistoryButton = document.getElementById('clearHistoryButton');

    // Load history from local storage
    let searchHistory = JSON.parse(localStorage.getItem('sentriAiHistory')) || [];

    function renderHistory() {
        historyList.innerHTML = ''; // Clear current list
        if (searchHistory.length === 0) {
            historyList.innerHTML = '<li>No search history yet.</li>';
            return;
        }
        searchHistory.forEach(item => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#'; // Or item.url if you want to make them re-clickable
            link.textContent = item.query;
            link.title = item.query; // For tooltip on hover
            
            const statusSpan = document.createElement('span');
            statusSpan.textContent = ` - ${item.status}`;
            statusSpan.style.color = item.status === 'SAFE' ? '#5cb85c' : '#d9534f'; // Green for SAFE, Red for UNSAFE

            listItem.appendChild(link);
            listItem.appendChild(statusSpan);
            historyList.prepend(listItem); // Add newest item to the top
        });
    }

    // Initial render of history
    renderHistory();

    analyzeButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query === '') {
            alert('Please enter a URL or query to analyze.');
            return;
        }

        // --- Simulate WAF analysis ---
        // In a real application, you would send this 'query' to a backend server
        // which would then perform the actual WAF analysis and return results.
        // For this frontend demo, we'll simulate a response.
        safetyStatusDiv.textContent = 'Safety Status: Analyzing...';
        potentialThreatsDiv.textContent = 'Potential Threats: Checking...';

        setTimeout(() => {
            let status, threats;
            // Simple heuristic for demonstration
            if (query.includes('malicious') || query.includes('badsite') || query.includes('phishing')) {
                status = 'UNSAFE';
                threats = 'Malware, Phishing, SQL Injection potential';
            } else if (query.includes('safe') || query.includes('google.com') || query.includes('microsoft.com')) {
                status = 'SAFE';
                threats = 'None detected';
            } else {
                status = 'PENDING';
                threats = 'Further analysis required';
            }

            safetyStatusDiv.textContent = `Safety Status: ${status}`;
            potentialThreatsDiv.textContent = `Potential Threats: ${threats}`;

            // Add to history
            searchHistory.push({ query, status, threats, timestamp: new Date().toLocaleString() });
            localStorage.setItem('sentriAiHistory', JSON.stringify(searchHistory));
            renderHistory(); // Update history panel
        }, 1500); // Simulate network delay
    });

    toggleHistoryButton.addEventListener('click', () => {
        historyPanel.classList.toggle('hidden');
    });

    clearHistoryButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your search history?')) {
            searchHistory = [];
            localStorage.removeItem('sentriAiHistory');
            renderHistory();
            historyPanel.classList.add('hidden'); // Hide after clearing
        }
    });

    // Optional: Hide history panel if clicking outside
    document.addEventListener('click', (event) => {
        if (!historyPanel.contains(event.target) && !toggleHistoryButton.contains(event.target) && !historyPanel.classList.contains('hidden')) {
            historyPanel.classList.add('hidden');
        }
    });
});
