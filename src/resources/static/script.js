document.addEventListener('DOMContentLoaded', function () {
    // Listen for form submission
    document.getElementById('contactForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const contactId = document.getElementById('contactId').value; // Get ID
        const contact = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        };

        const method = contactId ? 'PUT' : 'POST'; // Determine if updating or adding
        const url = contactId ? `http://8.136.126.246:8080/contacts/${contactId}` : 'http://8.136.126.246:8080/contacts';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                loadContacts(); // Reload the contact list
                // Clear the input fields
                document.getElementById('contactForm').reset();
                document.getElementById('contactId').value = ''; // Clear ID
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });

    // Get contact list
    loadContacts();

    function loadContacts() {
        fetch('http://8.136.126.246:8080/contacts')
            .then(response => response.json())
            .then(data => {
                const contactList = document.getElementById('contactList');
                contactList.innerHTML = ''; // Clear the list
                data.forEach(contact => {
                    const contactItem = document.createElement('div');
                    contactItem.textContent = `${contact.name} - ${contact.phone} - ${contact.email}`;

                    // Add edit button
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('edit-button'); // Add class for edit button
                    editButton.onclick = () => editContact(contact);
                    contactItem.appendChild(editButton);

                    // Add delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-button'); // Add class for delete button
                    deleteButton.onclick = () => deleteContact(contact.id);
                    contactItem.appendChild(deleteButton);

                    contactList.appendChild(contactItem);
                });
            })
            .catch(error => {
                console.error('There was a problem fetching contacts:', error);
            });
    }

    // Edit contact
    function editContact(contact) {
        document.getElementById('contactId').value = contact.id; // Set contact ID
        document.getElementById('name').value = contact.name;
        document.getElementById('phone').value = contact.phone;
        document.getElementById('email').value = contact.email;
    }

    // Delete contact
    function deleteContact(id) {
        fetch(`http://8.136.126.246:8080/contacts/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                loadContacts(); // Reload the contact list
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
});
