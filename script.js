document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const toolItems = document.querySelectorAll('.tool-list li');
    const toolPanels = document.querySelectorAll('.tool-panel');

    toolItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            toolItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all tool panels
            toolPanels.forEach(panel => panel.classList.remove('active'));
            // Show the corresponding tool panel
            const toolId = this.getAttribute('data-tool');
            document.getElementById(toolId).classList.add('active');
        });
    });

    // Copy button functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            // Select the text
            targetElement.select();
            targetElement.setSelectionRange(0, 99999); // For mobile devices
            
            // Copy the text
            document.execCommand('copy');
            
            // Change button text temporarily
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 1500);
        });
    });

    // Clear button functionality
    const clearButtons = document.querySelectorAll('.clear-btn');
    clearButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).value = '';
            
            // If clearing input in color converter, also clear the preview
            if (targetId === 'color-input') {
                document.querySelector('.color-preview').style.backgroundColor = '';
                document.getElementById('hex-output').value = '';
                document.getElementById('rgb-output').value = '';
                document.getElementById('hsl-output').value = '';
            }
        });
    });

    // URL Encoder/Decoder
    document.getElementById('url-encode-btn').addEventListener('click', function() {
        const input = document.getElementById('url-input').value;
        const output = encodeURIComponent(input);
        document.getElementById('url-output').value = output;
    });

    document.getElementById('url-decode-btn').addEventListener('click', function() {
        const input = document.getElementById('url-input').value;
        try {
            const output = decodeURIComponent(input);
            document.getElementById('url-output').value = output;
        } catch (e) {
            document.getElementById('url-output').value = 'Error: Invalid URL encoding';
        }
    });

    // JSON Escape/Unescape
    document.getElementById('json-escape-btn').addEventListener('click', function() {
        const input = document.getElementById('json-input').value;
        try {
            // Escape the JSON string
            const output = JSON.stringify(input);
            // Remove the surrounding quotes that JSON.stringify adds
            document.getElementById('json-output').value = output.substring(1, output.length - 1);
        } catch (e) {
            document.getElementById('json-output').value = 'Error: ' + e.message;
        }
    });

    document.getElementById('json-unescape-btn').addEventListener('click', function() {
        const input = document.getElementById('json-input').value;
        try {
            // Add quotes to make it a valid JSON string
            const jsonString = '"' + input + '"';
            const output = JSON.parse(jsonString);
            document.getElementById('json-output').value = output;
        } catch (e) {
            document.getElementById('json-output').value = 'Error: ' + e.message;
        }
    });

    // Base64 Encoder/Decoder
    document.getElementById('base64-encode-btn').addEventListener('click', function() {
        const input = document.getElementById('base64-input').value;
        try {
            const output = btoa(unescape(encodeURIComponent(input)));
            document.getElementById('base64-output').value = output;
        } catch (e) {
            document.getElementById('base64-output').value = 'Error: ' + e.message;
        }
    });

    document.getElementById('base64-decode-btn').addEventListener('click', function() {
        const input = document.getElementById('base64-input').value;
        try {
            const output = decodeURIComponent(escape(atob(input)));
            document.getElementById('base64-output').value = output;
        } catch (e) {
            document.getElementById('base64-output').value = 'Error: Invalid Base64 encoding';
        }
    });

    // HTML Encoder/Decoder
    document.getElementById('html-encode-btn').addEventListener('click', function() {
        const input = document.getElementById('html-input').value;
        const output = htmlEncode(input);
        document.getElementById('html-output').value = output;
    });

    document.getElementById('html-decode-btn').addEventListener('click', function() {
        const input = document.getElementById('html-input').value;
        const output = htmlDecode(input);
        document.getElementById('html-output').value = output;
    });

    // Helper functions for HTML encoding/decoding
    function htmlEncode(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function htmlDecode(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent;
    }

    // String Hash Generator
    document.getElementById('md5-btn').addEventListener('click', function() {
        const input = document.getElementById('hash-input').value;
        const output = CryptoJS.MD5(input).toString();
        document.getElementById('hash-output').value = output;
    });

    document.getElementById('sha1-btn').addEventListener('click', function() {
        const input = document.getElementById('hash-input').value;
        const output = CryptoJS.SHA1(input).toString();
        document.getElementById('hash-output').value = output;
    });

    document.getElementById('sha256-btn').addEventListener('click', function() {
        const input = document.getElementById('hash-input').value;
        const output = CryptoJS.SHA256(input).toString();
        document.getElementById('hash-output').value = output;
    });

    // Color Converter
    const colorInput = document.getElementById('color-input');
    const colorPicker = document.getElementById('color-picker');
    const colorPreview = document.querySelector('.color-preview');
    const hexOutput = document.getElementById('hex-output');
    const rgbOutput = document.getElementById('rgb-output');
    const hslOutput = document.getElementById('hsl-output');

    // Sync color picker with text input
    colorPicker.addEventListener('input', function() {
        colorInput.value = this.value;
        updateColorOutputs(this.value);
    });

    document.getElementById('convert-color-btn').addEventListener('click', function() {
        const input = colorInput.value.trim();
        updateColorOutputs(input);
    });

    function updateColorOutputs(color) {
        try {
            // Try to parse the color
            const div = document.createElement('div');
            div.style.color = color;
            document.body.appendChild(div);
            const computedColor = getComputedStyle(div).color;
            document.body.removeChild(div);
            
            // Extract RGB values
            const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                const r = parseInt(rgbMatch[1]);
                const g = parseInt(rgbMatch[2]);
                const b = parseInt(rgbMatch[3]);
                
                // Update preview
                colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                
                // Update outputs
                hexOutput.value = rgbToHex(r, g, b);
                rgbOutput.value = `rgb(${r}, ${g}, ${b})`;
                hslOutput.value = rgbToHsl(r, g, b);
            } else {
                throw new Error('Could not parse color');
            }
        } catch (e) {
            colorPreview.style.backgroundColor = '#fff';
            hexOutput.value = 'Invalid color';
            rgbOutput.value = 'Invalid color';
            hslOutput.value = 'Invalid color';
        }
    }

    function rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    // Text Case Converter
    document.getElementById('uppercase-btn').addEventListener('click', function() {
        const input = document.getElementById('case-input').value;
        document.getElementById('case-output').value = input.toUpperCase();
    });

    document.getElementById('lowercase-btn').addEventListener('click', function() {
        const input = document.getElementById('case-input').value;
        document.getElementById('case-output').value = input.toLowerCase();
    });

    document.getElementById('capitalize-btn').addEventListener('click', function() {
        const input = document.getElementById('case-input').value;
        document.getElementById('case-output').value = input.replace(/\b\w/g, c => c.toUpperCase());
    });

    document.getElementById('camel-case-btn').addEventListener('click', function() {
        const input = document.getElementById('case-input').value;
        document.getElementById('case-output').value = input
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
            .replace(/^[A-Z]/, c => c.toLowerCase());
    });

    document.getElementById('pascal-case-btn').addEventListener('click', function() {
        const input = document.getElementById('case-input').value;
        document.getElementById('case-output').value = input
            .replace(/\b\w/g, c => c.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '');
    });

    document.getElementById('snake-case-btn').addEventListener('click', function() {
        const input = document.getElementById('case-input').value;
        document.getElementById('case-output').value = input
            .replace(/\s+/g, '_')
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toLowerCase();
    });

    document.getElementById('kebab-case-btn').addEventListener('click', function() {
        const input = document.getElementById('case-input').value;
        document.getElementById('case-output').value = input
            .replace(/\s+/g, '-')
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase();
    });

    // JSON Formatter
    document.getElementById('format-json-btn').addEventListener('click', function() {
        const input = document.getElementById('json-format-input').value;
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 4);
            document.getElementById('json-format-output').value = formatted;
        } catch (e) {
            document.getElementById('json-format-output').value = 'Error: ' + e.message;
        }
    });

    document.getElementById('minify-json-btn').addEventListener('click', function() {
        const input = document.getElementById('json-format-input').value;
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            document.getElementById('json-format-output').value = minified;
        } catch (e) {
            document.getElementById('json-format-output').value = 'Error: ' + e.message;
        }
    });

    // Timestamp Converter
    const currentTimestampEl = document.getElementById('current-timestamp');
    const currentDatetimeEl = document.getElementById('current-datetime');
    const secondsFormatBtn = document.getElementById('seconds-format-btn');
    const millisecondsFormatBtn = document.getElementById('milliseconds-format-btn');
    
    // Default timestamp format is seconds
    let timestampFormat = 'seconds';
    
    // Toggle between seconds and milliseconds format
    secondsFormatBtn.addEventListener('click', function() {
        timestampFormat = 'seconds';
        secondsFormatBtn.classList.add('active');
        millisecondsFormatBtn.classList.remove('active');
        updateCurrentTime();
    });
    
    millisecondsFormatBtn.addEventListener('click', function() {
        timestampFormat = 'milliseconds';
        millisecondsFormatBtn.classList.add('active');
        secondsFormatBtn.classList.remove('active');
        updateCurrentTime();
    });
    
    // Update current time every second
    function updateCurrentTime() {
        const now = new Date();
        let timestamp;
        
        if (timestampFormat === 'seconds') {
            timestamp = Math.floor(now.getTime() / 1000);
        } else {
            timestamp = now.getTime();
        }
        
        currentTimestampEl.textContent = timestamp;
        currentDatetimeEl.textContent = formatDateTime(now);
        
        setTimeout(updateCurrentTime, 1000);
    }
    
    updateCurrentTime();
    
    // Format date for display
    function formatDateTime(date) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
    
    // Timestamp to date conversion
    document.getElementById('convert-timestamp-btn').addEventListener('click', function() {
        const timestampInput = document.getElementById('timestamp-input').value.trim();
        const timestampOutput = document.getElementById('timestamp-output');
        const timestampType = document.querySelector('input[name="timestamp-type"]:checked').value;
        
        if (!timestampInput) {
            timestampOutput.value = 'Please enter a timestamp';
            return;
        }
        
        try {
            const timestamp = parseInt(timestampInput);
            if (isNaN(timestamp)) {
                throw new Error('Invalid timestamp');
            }
            
            let date;
            if (timestampType === 'seconds') {
                date = new Date(timestamp * 1000); // Convert seconds to milliseconds
            } else {
                date = new Date(timestamp); // Already in milliseconds
            }
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                throw new Error('Invalid timestamp');
            }
            
            timestampOutput.value = formatDateTime(date);
        } catch (e) {
            timestampOutput.value = 'Error: ' + e.message;
        }
    });
    
    // Date to timestamp conversion
    document.getElementById('convert-date-btn').addEventListener('click', function() {
        const dateInput = document.getElementById('date-input').value;
        const dateOutputSeconds = document.getElementById('date-output-seconds');
        const dateOutputMilliseconds = document.getElementById('date-output-milliseconds');
        
        if (!dateInput) {
            dateOutputSeconds.value = 'Please select a date and time';
            dateOutputMilliseconds.value = 'Please select a date and time';
            return;
        }
        
        try {
            const date = new Date(dateInput);
            const timestampMilliseconds = date.getTime();
            const timestampSeconds = Math.floor(timestampMilliseconds / 1000);
            
            if (isNaN(timestampSeconds) || isNaN(timestampMilliseconds)) {
                throw new Error('Invalid date');
            }
            
            dateOutputSeconds.value = timestampSeconds;
            dateOutputMilliseconds.value = timestampMilliseconds;
        } catch (e) {
            dateOutputSeconds.value = 'Error: ' + e.message;
            dateOutputMilliseconds.value = 'Error: ' + e.message;
        }
    });
    
    // Set current date and time as default for date input
    const dateInput = document.getElementById('date-input');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    // Copy functionality for timestamp elements
    document.querySelectorAll('.time-display .copy-btn, .timestamp-output-item .copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const text = targetElement.tagName === 'SPAN' ? targetElement.textContent : targetElement.value;
            
            // Create a temporary textarea to copy from
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // Change button text temporarily
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 1500);
        });
    });

    // Markdown Preview
    const markdownInput = document.getElementById('markdown-input');
    const markdownPreview = document.getElementById('markdown-preview');
    
    if (markdownInput && markdownPreview) {
        // Set default options for marked
        marked.setOptions({
            breaks: true,        // Add line breaks when newlines are used
            gfm: true,           // Use GitHub Flavored Markdown
            headerIds: true,     // Add IDs to headers
            sanitize: false      // Allow HTML in the markdown
        });
        
        // Function to update the preview
        function updateMarkdownPreview() {
            const markdown = markdownInput.value;
            const html = marked.parse(markdown);
            markdownPreview.innerHTML = html;
        }
        
        // Update preview on input
        markdownInput.addEventListener('input', updateMarkdownPreview);
        
        // Copy HTML button
        document.querySelector('.preview-header .copy-btn').addEventListener('click', function() {
            const html = markdownPreview.innerHTML;
            
            // Create a temporary textarea to copy from
            const textarea = document.createElement('textarea');
            textarea.value = html;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // Change button text temporarily
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 1500);
        });
        
        // Add sample markdown when clicking on examples
        document.querySelectorAll('.markdown-example code').forEach(example => {
            example.addEventListener('click', function() {
                const currentText = markdownInput.value;
                const exampleText = this.textContent;
                
                // Add the example text with a newline if there's already content
                if (currentText) {
                    markdownInput.value = currentText + '\n\n' + exampleText;
                } else {
                    markdownInput.value = exampleText;
                }
                
                // Update the preview
                updateMarkdownPreview();
                
                // Focus back on the input
                markdownInput.focus();
            });
        });
        
        // Add some initial sample markdown
        const initialMarkdown = `# Markdown Preview Tool

This is a live preview of your Markdown text.

## Features

- Real-time preview
- GitHub Flavored Markdown support
- Copy HTML output

## Example Code

\`\`\`javascript
function hello() {
    console.log("Hello, world!");
}
\`\`\`

> Click on any example in the cheat sheet below to add it to your markdown.
`;
        
        markdownInput.value = initialMarkdown;
        updateMarkdownPreview();
    }
}); 