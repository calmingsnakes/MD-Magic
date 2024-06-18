const MarkdownIt = require('markdown-it');
const fs = require('fs');

const md = new MarkdownIt();
const markdownContent = fs.readFileSync('example.md', 'utf8');

// Generate HTML from Markdown
const htmlContent = md.render(markdownContent);

// Generate TOC
const toc = [];
markdownContent.split('\n').forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (match) {
        const level = match[1].length;
        const text = match[2];
        const anchor = text.toLowerCase().replace(/\s+/g, '-');
        toc.push({ level, text, anchor });
    }
});

// Create TOC HTML
const tocHtml = toc.map(item => `
    <a href="#${item.anchor}" style="margin-left: ${item.level * 20}px; display: block; margin-bottom: 10px; color: ${getTocColor(item.level)}; font-size: ${getTocFontSize(item.level)};">${item.text}</a>
`).join('');

// Function to get TOC color based on hierarchy level
function getTocColor(level) {
    switch (level) {
        case 1:
            return '#0d1b2a'; // Orange
        case 2:
            return '#22577a'; // Slate blue
        case 3:
            return '#20b2aa'; // Light sea green
        case 4:
            return '#e0e1dd'; // light gray
        default:
            return '#ffffff'; // White (fallback)
    }
}

// Function to get TOC font size based on hierarchy level
function getTocFontSize(level) {
    switch (level) {
        case 1:
            return '1.0rem'; // Font size for level 1 headings
        case 2:
            return '1rem'; // Font size for level 2 headings
        case 3:
            return '0.9rem'; // Font size for level 3 headings
        case 4:
            return '0.8rem'; // Font size for level 4 headings
        default:
            return 'inherit'; // Use inherited font size for other levels
    }
}

// Create final HTML with TOC and content
const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            display: flex;
            flex-direction: column;
            background-color: #0d1b2a; /* Dark blue */
            color: #ffffff; /* White */
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        #toc {
            width: 100%;
            max-width: 300px;
            padding: 10px;
            background-color: #e0e1dd; /* light gray */
            order: 1;
        }
        #content {
            width: 100%;
            padding: 10px;
            background-color: #e0e1dd; /* Darker blue */
            color: #000814; /* black */
            order: 2;
        }
        .markdown-body {
            max-width: 100%;
            margin: 0 auto;
            padding: 10px;
            box-sizing: border-box;
        }
        a {
            color: #001d3d; /* dark blue */
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        h1 {
            color: #001d3d; /* dark blue */
        }
        h2 {
            color: #22577a; /* Slate blue */
        }
        h3 {
            color: #20b2aa; /* Light sea green */
        }
        h4 {
            color: #9932cc; /* Dark orchid */
        }

        /* Responsive adjustments */
        @media only screen and (min-width: 600px) {
            body {
                flex-direction: row;
            }
            #toc {
                max-width: 20%;
                order: 1;
            }
            #content {
                max-width: 80%;
                order: 2;
            }
            .markdown-body {
                max-width: 800px;
                margin: 0 auto;
            }
        }

        /* Font size adjustment for smaller screens */
        @media only screen and (max-width: 600px) {
            #toc a {
                font-size: 0.9rem; /* Decrease font size for TOC links on smaller screens */
            }
        }
    </style>
    <title>Markdown with TOC</title>
</head>
<body>
    <div id="toc">
        ${tocHtml}
    </div>
    <div id="content" class="markdown-body">
        ${htmlContent}
    </div>
</body>
</html>
`;

// Write final HTML to file
fs.writeFileSync('output.html', finalHtml);
