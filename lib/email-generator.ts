/**
 * Email Generator
 * Converts TipTap editor content to email-friendly HTML and plain text
 */

import { Editor } from '@tiptap/react';
import { JSONContent } from '@tiptap/core';

/**
 * Generate HTML email from TipTap content
 * @param content TipTap JSON content
 * @param newsletterTitle Title of the newsletter
 * @param senderName Name of the sender
 * @returns HTML email content
 */
export function generateEmailHtml(
  content: JSONContent,
  newsletterTitle: string,
  senderName: string
): string {
  // Create temporary editor to use TipTap's built-in HTML generation
  let htmlContent = '';
  
  // Extract HTML content safely
  try {
    // For safety, if we can't render with TipTap, use a fallback approach
    htmlContent = renderContentAsHtml(content);
  } catch (error) {
    console.error('Error generating HTML from TipTap content:', error);
    htmlContent = '<p>There was an error rendering this newsletter content.</p>';
  }

  // Build an email template with responsive design
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletterTitle}</title>
  <style>
    /* Base styles */
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    .header {
      padding-bottom: 20px;
      border-bottom: 1px solid #eaeaea;
      text-align: center;
    }
    .content {
      padding: 20px 0;
    }
    .footer {
      padding-top: 20px;
      border-top: 1px solid #eaeaea;
      font-size: 14px;
      color: #666;
      text-align: center;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
      color: #222;
      font-weight: 600;
    }
    p {
      margin-bottom: 1em;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    a {
      color: #0070f3;
      text-decoration: underline;
    }
    ul, ol {
      padding-left: 24px;
    }
    /* Responsive adjustments */
    @media only screen and (max-width: 480px) {
      .container {
        padding: 12px;
      }
      h1 {
        font-size: 22px;
      }
      body, p {
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${newsletterTitle}</h1>
    </div>
    <div class="content">
      ${htmlContent}
    </div>
    <div class="footer">
      <p>Sent by ${senderName}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email from TipTap content
 * @param content TipTap JSON content
 * @param newsletterTitle Title of the newsletter
 * @param senderName Name of the sender
 * @returns Plain text email content
 */
export function generatePlainTextEmail(
  content: JSONContent,
  newsletterTitle: string,
  senderName: string
): string {
  const plainText = renderContentAsPlainText(content);
  
  return `
${newsletterTitle}
${'='.repeat(newsletterTitle.length)}

${plainText}

--
Sent by ${senderName}
  `.trim();
}

/**
 * Add unsubscribe link to email content
 * @param emailContent HTML or plain text email content
 * @param subscriberId Subscriber ID for unsubscribe link
 * @param baseUrl Base URL for unsubscribe link
 * @param isPlainText Whether the email content is plain text
 * @returns Email content with unsubscribe link
 */
export function addUnsubscribeLink(
  emailContent: string,
  subscriberId: string,
  baseUrl: string,
  isPlainText: boolean = false
): string {
  const unsubscribeUrl = `${baseUrl}/unsubscribe?id=${subscriberId}`;
  
  if (isPlainText) {
    return `${emailContent}

---
To unsubscribe, visit: ${unsubscribeUrl}`;
  }
  
  // For HTML, insert before closing body tag
  return emailContent.replace(
    '</div>\n</body>',
    `  <div style="padding-top: 12px; margin-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #888; text-align: center;">
      <p><a href="${unsubscribeUrl}" style="color: #888;">Unsubscribe</a> from future emails.</p>
    </div>
  </div>
</body>`
  );
}

/**
 * Helper function to render TipTap content as HTML
 * @param content TipTap JSON content
 * @returns HTML string
 */
function renderContentAsHtml(content: JSONContent): string {
  if (!content.content || !Array.isArray(content.content) || content.content.length === 0) {
    return '';
  }

  return processNodes(content.content);
}

/**
 * Process TipTap nodes recursively to generate HTML
 * @param nodes Array of TipTap nodes
 * @returns HTML string
 */
function processNodes(nodes: JSONContent[]): string {
  if (!nodes || !Array.isArray(nodes)) {
    return '';
  }

  return nodes.map(node => {
    switch (node.type) {
      case 'heading':
        const level = node.attrs?.level || 1;
        return `<h${level}>${processNodes(node.content || [])}</h${level}>`;
      
      case 'paragraph':
        return `<p>${processNodes(node.content || [])}</p>`;
      
      case 'text':
        let text = node.text || '';
        
        // Apply marks
        if (node.marks) {
          node.marks.forEach(mark => {
            switch (mark.type) {
              case 'bold':
                text = `<strong>${text}</strong>`;
                break;
              case 'italic':
                text = `<em>${text}</em>`;
                break;
              case 'underline':
                text = `<u>${text}</u>`;
                break;
              case 'strike':
                text = `<s>${text}</s>`;
                break;
              case 'link':
                const href = mark.attrs?.href || '';
                const target = mark.attrs?.target || '';
                text = `<a href="${href}" ${target ? `target="${target}"` : ''}>${text}</a>`;
                break;
              case 'code':
                text = `<code>${text}</code>`;
                break;
            }
          });
        }
        
        return text;
      
      case 'bulletList':
        return `<ul>${processNodes(node.content || [])}</ul>`;
      
      case 'orderedList':
        return `<ol>${processNodes(node.content || [])}</ol>`;
      
      case 'listItem':
        return `<li>${processNodes(node.content || []).replace(/<\/?p>/g, '')}</li>`;
      
      case 'image':
        const src = node.attrs?.src || '';
        const alt = node.attrs?.alt || '';
        const title = node.attrs?.title || '';
        return `<img src="${src}" alt="${alt}" ${title ? `title="${title}"` : ''}>`;
      
      case 'blockquote':
        return `<blockquote>${processNodes(node.content || [])}</blockquote>`;
      
      case 'horizontalRule':
        return '<hr>';
      
      case 'hardBreak':
        return '<br>';
      
      case 'table':
        return `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">${processNodes(node.content || [])}</table>`;
      
      case 'tableRow':
        return `<tr>${processNodes(node.content || [])}</tr>`;
      
      case 'tableCell':
        const cellType = node.attrs?.header ? 'th' : 'td';
        return `<${cellType}>${processNodes(node.content || [])}</${cellType}>`;
      
      default:
        // Recursively process content if available
        if (node.content && Array.isArray(node.content)) {
          return processNodes(node.content);
        }
        
        return '';
    }
  }).join('');
}

/**
 * Helper function to render TipTap content as plain text
 * @param content TipTap JSON content
 * @returns Plain text string
 */
function renderContentAsPlainText(content: JSONContent): string {
  if (!content.content || !Array.isArray(content.content) || content.content.length === 0) {
    return '';
  }

  return processNodesAsPlainText(content.content, 0);
}

/**
 * Process TipTap nodes recursively to generate plain text
 * @param nodes Array of TipTap nodes
 * @param level Nesting level for indentation
 * @returns Plain text string
 */
function processNodesAsPlainText(nodes: JSONContent[], level: number = 0): string {
  if (!nodes || !Array.isArray(nodes)) {
    return '';
  }

  const indent = '  '.repeat(level);
  
  const lines: string[] = [];
  
  for (const node of nodes) {
    switch (node.type) {
      case 'heading':
        lines.push('');
        lines.push(processNodesAsPlainText(node.content || [], level));
        lines.push('');
        break;
      
      case 'paragraph':
        if (lines.length > 0) {
          lines.push('');
        }
        lines.push(processNodesAsPlainText(node.content || [], level));
        break;
      
      case 'text':
        let text = node.text || '';
        
        // Process link marks to include URL in parentheses
        if (node.marks) {
          for (const mark of node.marks) {
            if (mark.type === 'link' && mark.attrs?.href) {
              text = `${text} (${mark.attrs.href})`;
            }
          }
        }
        
        lines.push(text);
        break;
      
      case 'bulletList':
      case 'orderedList':
        lines.push('');
        const listItems = processNodesAsPlainText(node.content || [], level + 1);
        lines.push(listItems);
        lines.push('');
        break;
      
      case 'listItem':
        // Determine if this list item is part of a bullet list or ordered list
        // We can't check node.type for this (they're all 'listItem'),
        // so we'll use a simple heuristic: level + 1 for ordered lists, bullet for others
        let prefix = '* '; // Default to bullet
        
        // Parent node type isn't directly available, but we can infer from context
        if (node.attrs?.listType === 'ordered') {
          prefix = `${level + 1}. `;
        }
        
        lines.push(`${indent}${prefix}${processNodesAsPlainText(node.content || [], level + 1)}`);
        break;
      
      case 'image':
        lines.push(`[${node.attrs?.alt || 'Image'}]`);
        break;
      
      case 'blockquote':
        lines.push('');
        const quoteLines = processNodesAsPlainText(node.content || [], level).split('\n');
        lines.push(quoteLines.map(line => `> ${line}`).join('\n'));
        lines.push('');
        break;
      
      case 'horizontalRule':
        lines.push('');
        lines.push('---');
        lines.push('');
        break;
      
      case 'hardBreak':
        lines.push('\n');
        break;
      
      case 'table':
        lines.push('');
        lines.push(processNodesAsPlainText(node.content || [], level));
        lines.push('');
        break;
      
      case 'tableRow':
        lines.push(processNodesAsPlainText(node.content || [], level).split('\n').join(' | '));
        break;
      
      case 'tableCell':
        lines.push(processNodesAsPlainText(node.content || [], level));
        break;
      
      default:
        // Recursively process content if available
        if (node.content && Array.isArray(node.content)) {
          lines.push(processNodesAsPlainText(node.content, level));
        }
        break;
    }
  }
  
  return lines.join('').replace(/\n{3,}/g, '\n\n').trim();
}