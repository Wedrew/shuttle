function submit_contact_form(event) {
    // Prevent default
    event.preventDefault();
    // Get contact form
    const contact_form = document.getElementById('contact-form');
    const form_data = new FormData(contact_form);

    // Get button
    const contact_submit_button = document.getElementById("contact-submit-button");

    if (!contact_form.checkValidity()) {
        event.stopPropagation();
        contact_form.classList.add('was-validated');
    } else {
        // Disable button and set spinner
        contact_submit_button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
        contact_submit_button.setAttribute("disabled", "true");
        // Post contact_form
        fetch('/contact/contact-form', {
            method: 'post',
            body: form_data
        })
            .then(response => response.json())
            .then(data => {
                // Remove validated
                contact_form.classList.remove('was-validated');
                // Display alert
                handle_form_response(data.status, data.message);
                // Reset form
                contact_form.reset();
                // Scroll to the top of the page
                window.scrollTo(0, 0);
                contact_submit_button.innerHTML = "Submit";
                contact_submit_button.removeAttribute("disabled");
            })
            .catch(error => console.log(error.message));
    }
}

function submit_login_form(event) {
    // Prevent default
    event.preventDefault();
    // Get login form
    const login_form = document.getElementById('login-form');
    const form_data = new FormData(login_form);

    // Get button
    const login_submit_button = document.getElementById("login-submit-button");

    if (!login_form.checkValidity()) {
        event.stopPropagation();
        login_form.classList.add('was-validated');
    } else {
        // Disable button and set spinner
        login_submit_button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
        login_submit_button.setAttribute("disabled", "true");
        // Post login_form
        fetch('/auth/login-form', {
            method: 'post',
            body: form_data
        })
            .then(response => {
                if (response.ok && response.redirected) {
                    window.location.href = response.url;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    console.log(data);
                    // Remove validated
                    login_form.classList.remove('was-validated');
                    // Display alert
                    handle_form_response(data.status, data.message);
                    // Reset form
                    login_form.reset();
                    // Scroll to the top of the page
                    window.scrollTo(0, 0);
                    login_submit_button.innerHTML = "Submit";
                    login_submit_button.removeAttribute("disabled");
                }
            })
            .catch(error => console.log(error.message));
    }
}

function submit_logout_delete(event) {
    // Prevent default
    event.preventDefault();

    fetch('auth/logout', {
        method: 'delete',
    })
        .then(response => {
            if (response.ok && response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => console.error('Error deleting item:', error));
}

function submit_article_form(event) {
    // Prevent default
    event.preventDefault();
    // Get contact form
    const contact_form = document.getElementById('new-article-form');
    const form_data = new FormData(contact_form);

    // Get button
    const new_article_submit_button = document.getElementById("new-article-submit-button");

    if (!contact_form.checkValidity()) {
        event.stopPropagation();
        contact_form.classList.add('was-validated');
    } else {
        // Disable button and set spinner
        new_article_submit_button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
        new_article_submit_button.setAttribute("disabled", "true");
        // Post contact_form
        fetch('/article/new', {
            method: 'post',
            body: form_data
        })
            .then(response => {
                if (response.ok && response.redirected) {
                    window.location.href = response.url;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    // Remove validated
                    contact_form.classList.remove('was-validated');
                    // Display alert
                    handle_form_response(data.status, data.message);
                    // Reset form
                    contact_form.reset();
                    // Scroll to the top of the page
                    window.scrollTo(0, 0);
                    new_article_submit_button.innerHTML = "Submit";
                    new_article_submit_button.removeAttribute("disabled");
                }
            })
            .catch(error => console.log(error.message));
    }
}

// status: 0 = failure, 1 = success, 2 = warning
function handle_form_response(status, message) {

    var toastEl = document.querySelector('.toast');

    // Notify the frontend
    var toast = new bootstrap.Toast(toastEl);
    var header = document.getElementById('toast-header');
    var header_text = document.getElementById("toast-header-text");
    var body = document.getElementById("toast-body-text");

    // Set toast body as message
    body.textContent = message;

    if (status == 0) {
        header_text.textContent = "Failure!";
        header.style.backgroundColor = "red";
    } else if (status == 1) {
        header_text.textContent = "Success!";
        header.style.backgroundColor = "green";
    } else if (status == 2) {
        header_text.textContent = "Warning!";
        header.style.backgroundColor = "yellow";
    } else {
        header_text.textContent = "Uh oh...";
        header.style.backgroundColor = "black";
        body.textContent = "Something went wrong.";
    }

    // Show the toast
    toast.show();
}