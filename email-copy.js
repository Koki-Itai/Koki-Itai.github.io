// Email copy functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailButton = document.getElementById('email-copy-button');
    const emailStatus = document.getElementById('email-copy-status');
    
    if (emailButton && emailStatus) {
        emailButton.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            
            if (navigator.clipboard && window.isSecureContext) {
                // Use modern clipboard API
                navigator.clipboard.writeText(email).then(function() {
                    showCopyStatus();
                }).catch(function() {
                    fallbackCopyTextToClipboard(email);
                });
            } else {
                // Fallback for older browsers
                fallbackCopyTextToClipboard(email);
            }
        });
        
        // Add keyboard support
        emailButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopyStatus();
            }
        } catch (err) {
            console.error('Fallback: Could not copy text: ', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopyStatus() {
        emailStatus.style.display = 'block';
        emailStatus.style.opacity = '1';
        
        setTimeout(function() {
            emailStatus.style.opacity = '0';
            setTimeout(function() {
                emailStatus.style.display = 'none';
            }, 200);
        }, 1500);
    }
});
