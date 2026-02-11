// KAAF Admin Dashboard JavaScript

// Add repeater row for settings (core values, process steps)
function addRepeaterRow(containerId, nameField, descField, namePlaceholder, descPlaceholder) {
    const container = document.getElementById(containerId);
    const row = document.createElement('div');
    row.className = 'repeater-row';
    row.innerHTML = `
        <input type="text" name="${nameField}" placeholder="${namePlaceholder}">
        <input type="text" name="${descField}" placeholder="${descPlaceholder}">
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">x</button>
    `;
    container.appendChild(row);
}

// Remove gallery image via AJAX
function removeGalleryImage(btn) {
    const thumb = btn.closest('.gallery-thumb');
    const projectId = thumb.dataset.projectId;
    const imageUrl = thumb.dataset.image;

    if (!confirm('Remove this image from the gallery?')) return;

    fetch(`/admin/projects/${projectId}/remove-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            thumb.remove();
        }
    })
    .catch(err => console.error('Error:', err));
}

// Mark message as read via AJAX
function markAsRead(msgId, btn) {
    fetch(`/api/messages/${msgId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const row = btn.closest('tr');
            row.classList.remove('row-unread');
            const badge = row.querySelector('.badge');
            badge.className = 'badge badge-muted';
            badge.textContent = 'Read';
            btn.remove();
        }
    })
    .catch(err => console.error('Error:', err));
}
