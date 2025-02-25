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
        
        // Synchronize scrolling between input and preview
        markdownInput.addEventListener('scroll', function() {
            // Calculate the scroll percentage of the input
            const scrollPercentage = markdownInput.scrollTop / 
                (markdownInput.scrollHeight - markdownInput.clientHeight);
            
            // Apply the same scroll percentage to the preview
            markdownPreview.scrollTop = scrollPercentage * 
                (markdownPreview.scrollHeight - markdownPreview.clientHeight);
        });
        
        // Synchronize scrolling from preview to input
        markdownPreview.addEventListener('scroll', function() {
            // Calculate the scroll percentage of the preview
            const scrollPercentage = markdownPreview.scrollTop / 
                (markdownPreview.scrollHeight - markdownPreview.clientHeight);
            
            // Apply the same scroll percentage to the input
            markdownInput.scrollTop = scrollPercentage * 
                (markdownInput.scrollHeight - markdownInput.clientHeight);
        });
        
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

    // JSON to XML Converter
    document.getElementById('convert-json-to-xml-btn')?.addEventListener('click', function() {
        const jsonInput = document.getElementById('json-xml-input').value;
        const xmlOutput = document.getElementById('json-xml-output');
        
        try {
            // Parse JSON
            const jsonObj = JSON.parse(jsonInput);
            
            // Convert JSON to XML
            const xml = jsonToXml(jsonObj);
            
            // Format XML for readability
            const formattedXml = formatXml(xml);
            
            xmlOutput.value = formattedXml;
        } catch (e) {
            xmlOutput.value = 'Error: ' + e.message;
        }
    });
    
    // Function to convert JSON to XML
    function jsonToXml(obj, rootName = 'root') {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`;
        
        // Helper function to convert JSON object to XML
        function parseObject(obj, parentKey) {
            for (const key in obj) {
                const value = obj[key];
                
                if (Array.isArray(value)) {
                    // Handle arrays
                    for (const item of value) {
                        if (typeof item === 'object' && item !== null) {
                            xml += `<${key}>`;
                            parseObject(item, key);
                            xml += `</${key}>`;
                        } else {
                            xml += `<${key}>${escapeXml(String(item))}</${key}>`;
                        }
                    }
                } else if (typeof value === 'object' && value !== null) {
                    // Handle nested objects
                    xml += `<${key}>`;
                    parseObject(value, key);
                    xml += `</${key}>`;
                } else {
                    // Handle primitive values
                    xml += `<${key}>${escapeXml(String(value))}</${key}>`;
                }
            }
        }
        
        parseObject(obj, rootName);
        xml += `</${rootName}>`;
        
        return xml;
    }
    
    // Function to escape XML special characters
    function escapeXml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    
    // Add a fallback XML formatter in case vkbeautify is not available
    function formatXml(xml) {
        // Simple XML formatter if vkbeautify is not available
        if (typeof vkbeautify === 'undefined') {
            let formatted = '';
            let indent = '';
            const tab = '  '; // 2 spaces for indentation
            
            xml.split(/>\s*</).forEach(function(node) {
                if (node.match(/^\/\w/)) {
                    // Closing tag
                    indent = indent.substring(tab.length);
                }
                
                formatted += indent + '<' + node + '>\n';
                
                if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("?")) {
                    // Opening tag
                    indent += tab;
                }
            });
            
            return formatted.substring(1, formatted.length - 2);
        } else {
            // Use vkbeautify if available
            return vkbeautify.xml(xml);
        }
    }
    
    // JSON to Java/Python Converter
    document.getElementById('convert-json-to-code-btn')?.addEventListener('click', function() {
        const jsonInput = document.getElementById('json-code-input').value;
        const codeOutput = document.getElementById('json-code-output');
        const language = document.querySelector('input[name="code-language"]:checked').value;
        const className = document.getElementById('class-name-input').value || 'MyClass';
        const useLombok = document.getElementById('use-lombok')?.checked || false;
        
        try {
            // Parse JSON
            const jsonObj = JSON.parse(jsonInput);
            
            // Convert JSON to code
            let code;
            if (language === 'java') {
                code = jsonToJava(jsonObj, className, useLombok);
            } else {
                code = jsonToPython(jsonObj, className);
            }
            
            codeOutput.value = code;
        } catch (e) {
            codeOutput.value = 'Error: ' + e.message;
        }
    });
    
    // Toggle Lombok options based on selected language
    const languageRadios = document.querySelectorAll('input[name="code-language"]');
    const javaOptions = document.querySelector('.java-options');
    
    if (languageRadios && javaOptions) {
        languageRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'java') {
                    javaOptions.style.display = 'block';
                } else {
                    javaOptions.style.display = 'none';
                }
            });
        });
        
        // Set initial state
        if (document.querySelector('input[name="code-language"]:checked').value !== 'java') {
            javaOptions.style.display = 'none';
        }
    }
    
    // Function to convert JSON to Java class
    function jsonToJava(obj, className, useLombok = false) {
        // Store all generated classes
        const nestedClassNames = new Set();
        
        // Main function to process a JSON object into a Java class
        function processClass(obj, className, isNested = false) {
            let javaCode = '';
            
            // Add Lombok annotations if enabled
            if (useLombok) {
                javaCode += isNested ? '        @Data\n        @NoArgsConstructor\n        @AllArgsConstructor\n' : 
                                      '@Data\n@NoArgsConstructor\n@AllArgsConstructor\n';
            }
            
            // Add class declaration with proper indentation for nested classes
            javaCode += isNested ? '        public static class ' + className + ' {\n' : 
                                  'public class ' + className + ' {\n';
            
            // Add fields
            for (const key in obj) {
                const value = obj[key];
                let javaType = getJavaType(value, key);
                
                // Add field declaration with proper indentation
                javaCode += isNested ? '            private ' + javaType + ' ' + key + ';\n' : 
                                     '    private ' + javaType + ' ' + key + ';\n';
            }
            
            // If not using Lombok, add constructor and getters/setters
            if (!useLombok) {
                javaCode += '\n';
                
                // Add constructor
                javaCode += isNested ? '            public ' + className + '() {\n            }\n\n' : 
                                     '    public ' + className + '() {\n    }\n\n';
                
                // Add all-args constructor
                javaCode += isNested ? '            public ' + className + '(' : 
                                     '    public ' + className + '(';
                const params = [];
                for (const key in obj) {
                    const value = obj[key];
                    let javaType = getJavaType(value, key);
                    params.push(`${javaType} ${key}`);
                }
                javaCode += params.join(', ');
                javaCode += ') {\n';
                for (const key in obj) {
                    javaCode += isNested ? '                this.' + key + ' = ' + key + ';\n' : 
                                         '        this.' + key + ' = ' + key + ';\n';
                }
                javaCode += isNested ? '            }\n\n' : '    }\n\n';
                
                // Add getters and setters
                for (const key in obj) {
                    const value = obj[key];
                    let javaType = getJavaType(value, key);
                    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                    
                    // Add getter
                    javaCode += isNested ? '            public ' + javaType + ' get' + capitalizedKey + '() {\n' : 
                                         '    public ' + javaType + ' get' + capitalizedKey + '() {\n';
                    javaCode += isNested ? '                return ' + key + ';\n' : 
                                         '        return ' + key + ';\n';
                    javaCode += isNested ? '            }\n\n' : '    }\n\n';
                    
                    // Add setter
                    javaCode += isNested ? '            public void set' + capitalizedKey + '(' + javaType + ' ' + key + ') {\n' : 
                                         '    public void set' + capitalizedKey + '(' + javaType + ' ' + key + ') {\n';
                    javaCode += isNested ? '                this.' + key + ' = ' + key + ';\n' : 
                                         '        this.' + key + ' = ' + key + ';\n';
                    javaCode += isNested ? '            }\n\n' : '    }\n\n';
                }
            }
            
            javaCode += isNested ? '        }' : '}';
            
            return javaCode;
        }
        
        // Function to determine Java type from JSON value
        function getJavaType(value, key) {
            if (value === null) {
                return 'Object';
            }
            
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    const firstItem = value[0];
                    if (typeof firstItem === 'object' && firstItem !== null) {
                        // For arrays of objects, create a nested class
                        const itemClassName = capitalizeFirstLetter(singularize(key));
                        if (!nestedClassNames.has(itemClassName)) {
                            nestedClassNames.add(itemClassName);
                        }
                        return `List<${itemClassName}>`;
                    }
                    return `List<${getJavaType(firstItem)}>`;
                }
                return 'List<Object>';
            }
            
            if (typeof value === 'object' && value !== null) {
                // For nested objects, create a nested class
                const nestedClassName = capitalizeFirstLetter(key);
                if (!nestedClassNames.has(nestedClassName)) {
                    nestedClassNames.add(nestedClassName);
                }
                return nestedClassName;
            }
            
            switch (typeof value) {
                case 'string':
                    return 'String';
                case 'number':
                    return Number.isInteger(value) ? 'int' : 'double';
                case 'boolean':
                    return 'boolean';
                default:
                    return 'Object';
            }
        }
        
        // Helper function to capitalize first letter
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        // Helper function to convert plural to singular (simple version)
        function singularize(word) {
            if (word.endsWith('ies')) {
                return word.slice(0, -3) + 'y';
            } else if (word.endsWith('s') && !word.endsWith('ss')) {
                return word.slice(0, -1);
            }
            return word;
        }
        
        // Add imports
        let imports = '';
        if (useLombok) {
            imports += `import lombok.Data;\nimport lombok.NoArgsConstructor;\nimport lombok.AllArgsConstructor;\n`;
        }
        
        // Check if we need to import List
        let needsList = false;
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                needsList = true;
                break;
            }
        }
        
        if (needsList) {
            imports += `import java.util.List;\n`;
        }
        
        if (imports) {
            imports += '\n';
        }
        
        // Process the main class
        let mainClass = processClass(obj, className);
        
        // Generate nested classes
        let nestedClasses = '';
        
        // Process nested objects to create nested classes
        for (const key in obj) {
            const value = obj[key];
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Create nested class for object
                const nestedClassName = capitalizeFirstLetter(key);
                nestedClasses += '\n\n' + processClass(value, nestedClassName, true);
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
                // Create nested class for array items
                const itemClassName = capitalizeFirstLetter(singularize(key));
                nestedClasses += '\n\n' + processClass(value[0], itemClassName, true);
            }
        }
        
        // Insert nested classes before the closing brace of the main class
        if (nestedClasses) {
            mainClass = mainClass.replace(/}$/, `${nestedClasses}\n}`);
        }
        
        return imports + mainClass;
    }
    
    // Function to convert JSON to Python class
    function jsonToPython(obj, className) {
        // Store all generated classes
        const generatedClasses = [];
        const nestedClassNames = new Set();
        
        // Main function to process a JSON object into a Python class
        function processClass(obj, className) {
            let pythonCode = `class ${className}:\n`;
            
            // Add constructor
            pythonCode += '    def __init__(self';
            
            // Add parameters
            for (const key in obj) {
                pythonCode += `, ${key}=None`;
            }
            
            pythonCode += '):\n';
            
            // Add field assignments
            for (const key in obj) {
                pythonCode += `        self.${key} = ${key}\n`;
            }
            
            // Add string representation method
            pythonCode += '\n    def __str__(self):\n';
            pythonCode += `        return f"${className}({', '.join([f'{key}={{{key}}}' for key in obj])})"\n`;
            
            // Add property getters and setters
            for (const key in obj) {
                pythonCode += `\n    @property\n`;
                pythonCode += `    def ${key}(self):\n`;
                pythonCode += `        return self._${key}\n`;
                
                pythonCode += `\n    @${key}.setter\n`;
                pythonCode += `    def ${key}(self, value):\n`;
                pythonCode += `        self._${key} = value\n`;
            }
            
            return pythonCode;
        }
        
        // Function to determine Python type and create nested classes if needed
        function processPythonType(value, key) {
            if (value === null) {
                return;
            }
            
            if (Array.isArray(value) && value.length > 0) {
                const firstItem = value[0];
                if (typeof firstItem === 'object' && firstItem !== null) {
                    // For arrays of objects, create a nested class
                    const itemClassName = capitalizeFirstLetter(singularize(key));
                    if (!nestedClassNames.has(itemClassName)) {
                        nestedClassNames.add(itemClassName);
                        const nestedClass = processClass(firstItem, itemClassName);
                        generatedClasses.push(nestedClass);
                    }
                }
            } else if (typeof value === 'object' && value !== null) {
                // For nested objects, create a nested class
                const nestedClassName = capitalizeFirstLetter(key);
                if (!nestedClassNames.has(nestedClassName)) {
                    nestedClassNames.add(nestedClassName);
                    const nestedClass = processClass(value, nestedClassName);
                    generatedClasses.push(nestedClass);
                }
            }
        }
        
        // Helper function to capitalize first letter
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        // Helper function to convert plural to singular (simple version)
        function singularize(word) {
            if (word.endsWith('ies')) {
                return word.slice(0, -3) + 'y';
            } else if (word.endsWith('s') && !word.endsWith('ss')) {
                return word.slice(0, -1);
            }
            return word;
        }
        
        // Process all nested objects first
        for (const key in obj) {
            processPythonType(obj[key], key);
        }
        
        // Process the main class
        const mainClass = processClass(obj, className);
        
        // Combine all generated classes
        return generatedClasses.join('\n\n') + (generatedClasses.length > 0 ? '\n\n' : '') + mainClass;
    }
    
    // JSON to YAML Converter
    document.getElementById('convert-json-to-yaml-btn')?.addEventListener('click', function() {
        const jsonInput = document.getElementById('json-yaml-input').value;
        const yamlOutput = document.getElementById('json-yaml-output');
        
        try {
            // Parse JSON
            const jsonObj = JSON.parse(jsonInput);
            
            // Convert JSON to YAML
            const yaml = jsyaml.dump(jsonObj);
            
            yamlOutput.value = yaml;
        } catch (e) {
            yamlOutput.value = 'Error: ' + e.message;
        }
    });
    
    // Text Diff Tool
    document.getElementById('compare-text-btn')?.addEventListener('click', function() {
        const originalText = document.getElementById('original-text').value;
        const modifiedText = document.getElementById('modified-text').value;
        const diffOutput = document.getElementById('diff-output');
        
        // Compute the diff
        const diffResult = JsDiff.diffLines(originalText, modifiedText);
        
        // Clear previous output
        diffOutput.innerHTML = '';
        
        // Display the diff with line numbers and improved formatting
        let lineCount = 0;
        
        diffResult.forEach(part => {
            // Split the part into lines
            const lines = part.value.split('\n');
            // Remove the last empty line that comes from splitting
            if (lines[lines.length - 1] === '') lines.pop();
            
            // Process each line
            lines.forEach(line => {
                const color = part.added ? 'added' : part.removed ? 'removed' : 'unchanged';
                const span = document.createElement('span');
                span.className = color;
                span.textContent = line;
                diffOutput.appendChild(span);
            });
        });
        
        // Scroll to the top of the diff output
        diffOutput.scrollTop = 0;
    });
    
    // Swap text button
    document.getElementById('swap-text-btn')?.addEventListener('click', function() {
        const originalTextArea = document.getElementById('original-text');
        const modifiedTextArea = document.getElementById('modified-text');
        
        const temp = originalTextArea.value;
        originalTextArea.value = modifiedTextArea.value;
        modifiedTextArea.value = temp;
    });

    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    // Toggle theme when button is clicked
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        
        // Save preference to localStorage
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}); 