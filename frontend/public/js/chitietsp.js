function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(function(tab) {
        tab.style.display = 'none';
    });

    // Show the clicked tab
    document.getElementById(tabId).style.display = 'block';

    // Update active tab button
    document.querySelectorAll('.tab').forEach(function(tab) {
        tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Initialize the first tab as active
document.addEventListener('DOMContentLoaded', function() {
    showTab('mota');
});
