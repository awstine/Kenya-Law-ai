document.addEventListener('DOMContentLoaded', function() {
    loadUserTable();
    
    // Function to load user table
    function loadUserTable() {
        const container = document.getElementById('user-table-container');
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.length === 0) {
            container.innerHTML = '<div class="empty">No users have signed up yet.</div>';
            return;
        }
        
        // Create table
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Add user rows
        users.forEach((user, index) => {
            tableHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.name || '-'}</td>
                    <td>${user.username || '-'}</td>
                    <td>${user.email || '-'}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteUser('${user.email}')">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
    }
    
    // Make loadUserTable available globally
    window.loadUserTable = loadUserTable;
    
    // Delete user function
    window.deleteUser = function(userEmail) {
        // Confirm deletion
        if (!confirm(`Are you sure you want to delete user with email: ${userEmail}?`)) {
            return; // User canceled the deletion
        }
        
        // Get users from localStorage
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find the user index
        const userIndex = users.findIndex(user => user.email === userEmail);
        
        if (userIndex !== -1) {
            // Remove the user
            users.splice(userIndex, 1);
            
            // Save updated users array back to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Check if deleted user is the current user
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.email === userEmail) {
                // Also remove the current user
                localStorage.removeItem('user');
            }
            
            // Show success message
            alert('User deleted successfully');
            
            // Reload the table
            loadUserTable();
        } else {
            alert('User not found');
        }
    };
});