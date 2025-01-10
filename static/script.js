$(document).ready(function () {
    $('#pdfForm').on('submit', function (e) {
        e.preventDefault();

        const fileInput = $('input[type="file"]')[0].files[0];
        const password = $('#password').val();

        if (!fileInput || !password) {
            alert("Please select a PDF file and enter a password.");
            return;
        }

        $('#loadingContainer').show();
        $('#loadingBar').css('width', '0%');
        $('#loadingText').text('0%');

        // Convert file to Base64 for API request
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64File = event.target.result.split(',')[1];  // Strip out base64 prefix

            const requestData = {
                "Parameters": [
                    {
                        "Name": "File",
                        "FileValue": {
                            "Name": fileInput.name,
                            "Data": base64File
                        }
                    },
                    {
                        "Name": "StoreFile",
                        "Value": true
                    },
                    {
                        "Name": "UserPassword",
                        "Value": password  // Use custom password for encryption
                    }
                ]
            };

            // API call for PDF encryption
            $.ajax({
                url: "https://v2.convertapi.com/convert/pdf/to/protect",
                type: "POST",
                headers: {
                    "Authorization": "Bearer secret_6Vx4LFHWyhqHXob0",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(requestData),
                success: function(response) {
                    $('#loadingContainer').hide();
                    $('#statusMessage').text("PDF Encrypted successfully.");
                    $('#downloadContainer').show();
                    
                    // Handle file download
                    $('#downloadButton').click(function() {
                        const fileUrl = response.Files[0].Url;
                        const fileName = "Encrypted_H56.pdf";  // Desired filename for the encrypted file

                        // Create a temporary <a> element to trigger the download
                        const link = document.createElement('a');
                        link.href = fileUrl;
                        link.download = fileName;  // Assign custom filename
                        link.click();  // Trigger the download
                    });
                },
                error: function() {
                    $('#loadingContainer').hide();
                    $('#statusMessage').text("Error encrypting PDF.");
                }
            });
        };

        reader.readAsDataURL(fileInput);
    });
});