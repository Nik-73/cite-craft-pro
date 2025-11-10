#!/usr/bin/env python3
"""
Convert markdown research paper to professionally formatted PDF
"""

import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
import re

def process_citations(text):
    """Convert ^X markers to proper superscript format"""
    # Replace ^123 with <sup>123</sup> HTML
    text = re.sub(r'\^(\d+)', r'<sup>\1</sup>', text)
    return text

def create_html_from_markdown(md_file, citations_file):
    """Convert markdown to HTML with proper styling"""

    # Read the main paper
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Read citations
    with open(citations_file, 'r', encoding='utf-8') as f:
        citations_content = f.read()

    # Process superscript citations before markdown conversion
    md_content = process_citations(md_content)
    citations_content = process_citations(citations_content)

    # Convert markdown to HTML
    md_converter = markdown.Markdown(extensions=['extra', 'nl2br', 'sane_lists'])
    html_body = md_converter.convert(md_content)
    citations_html = md_converter.convert(citations_content)

    # Create full HTML with CSS styling
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>The Swarm Within: Unregulated Small Language Models and the Dawn of Agentic Attacks</title>
    <style>
        @page {{
            size: letter;
            margin: 1in 1in 1in 1in;
            @bottom-center {{
                content: counter(page);
                font-size: 10pt;
                font-family: 'Times New Roman', serif;
            }}
        }}

        body {{
            font-family: 'Times New Roman', Georgia, serif;
            font-size: 12pt;
            line-height: 1.8;
            color: #000;
            text-align: justify;
            hyphens: auto;
        }}

        h1 {{
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
            margin-top: 0;
            margin-bottom: 24pt;
            page-break-after: avoid;
        }}

        h2 {{
            font-size: 14pt;
            font-weight: bold;
            margin-top: 18pt;
            margin-bottom: 12pt;
            page-break-after: avoid;
            text-transform: uppercase;
        }}

        h3 {{
            font-size: 12pt;
            font-weight: bold;
            margin-top: 14pt;
            margin-bottom: 10pt;
            page-break-after: avoid;
        }}

        h4 {{
            font-size: 12pt;
            font-weight: bold;
            font-style: italic;
            margin-top: 12pt;
            margin-bottom: 8pt;
            page-break-after: avoid;
        }}

        p {{
            margin: 0 0 12pt 0;
            text-indent: 0.5in;
            orphans: 2;
            widows: 2;
        }}

        p:first-of-type, h2 + p, h3 + p, h4 + p {{
            text-indent: 0;
        }}

        sup {{
            font-size: 9pt;
            line-height: 0;
            position: relative;
            vertical-align: baseline;
            top: -0.5em;
        }}

        ul, ol {{
            margin: 12pt 0;
            padding-left: 0.5in;
        }}

        li {{
            margin-bottom: 6pt;
        }}

        blockquote {{
            margin: 12pt 0.5in;
            padding-left: 0.5in;
            border-left: 2px solid #ccc;
            font-style: italic;
        }}

        code {{
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            background-color: #f5f5f5;
            padding: 2px 4px;
        }}

        pre {{
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            background-color: #f5f5f5;
            padding: 12pt;
            margin: 12pt 0;
            overflow-x: auto;
            white-space: pre-wrap;
        }}

        .citations {{
            page-break-before: always;
            font-size: 10pt;
            line-height: 1.5;
        }}

        .citations h2 {{
            font-size: 12pt;
            text-align: center;
            margin-bottom: 18pt;
        }}

        .citations p {{
            text-indent: -0.5in;
            padding-left: 0.5in;
            margin-bottom: 8pt;
        }}

        a {{
            color: #000;
            text-decoration: none;
        }}

        strong {{
            font-weight: bold;
        }}

        em {{
            font-style: italic;
        }}

        .page-break {{
            page-break-after: always;
        }}

        hr {{
            border: none;
            border-top: 1px solid #000;
            margin: 24pt 0;
        }}
    </style>
</head>
<body>
    {html_body}

    <div class="citations">
        {citations_html}
    </div>
</body>
</html>
    """

    return html

def main():
    print("Converting markdown to PDF...")

    # Generate HTML
    html_content = create_html_from_markdown(
        'refined_slm_research_paper.md',
        'bluebook_citations.md'
    )

    # Save HTML for debugging
    with open('paper_preview.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("Generated HTML preview: paper_preview.html")

    # Convert to PDF
    print("Generating PDF...")
    font_config = FontConfiguration()

    HTML(string=html_content).write_pdf(
        'The_Swarm_Within_SLM_Agentic_Attacks.pdf',
        font_config=font_config
    )

    print("✓ PDF generated successfully: The_Swarm_Within_SLM_Agentic_Attacks.pdf")

if __name__ == '__main__':
    main()
