import { describe, it, expect } from 'vitest';
import { generateEmailHtml, generatePlainTextEmail, addUnsubscribeLink } from './email-generator';

describe('Email Generator', () => {
  // Sample TipTap JSON content
  const sampleContent = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Newsletter Title' }]
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'This is a paragraph of text.' }]
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'This has ' },
          { type: 'text', marks: [{ type: 'bold' }], text: 'bold' },
          { type: 'text', text: ' and ' },
          { type: 'text', marks: [{ type: 'italic' }], text: 'italic' },
          { type: 'text', text: ' text.' }
        ]
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'List item 1' }]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'List item 2' }]
              }
            ]
          }
        ]
      },
      {
        type: 'image',
        attrs: {
          src: 'https://example.com/image.jpg',
          alt: 'Example image',
          title: 'Example image'
        }
      }
    ]
  };

  const newsletterTitle = 'Test Newsletter';
  const senderName = 'Test Sender';
  const senderEmail = 'test@example.com';

  it('should generate HTML from TipTap content', () => {
    const html = generateEmailHtml(sampleContent, newsletterTitle, senderName);
    
    // Check that the HTML contains the title
    expect(html).toContain(newsletterTitle);
    
    // Check that it contains the content elements
    expect(html).toContain('Newsletter Title');
    expect(html).toContain('This is a paragraph of text.');
    
    // Check for formatted text
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
    
    // Check for list items
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>List item 1</li>');
    expect(html).toContain('<li>List item 2</li>');
    
    // Check for image
    expect(html).toContain('<img src="https://example.com/image.jpg"');
    
    // Check for sender information
    expect(html).toContain(senderName);
    
    // Check for basic email structure
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('<body');
    expect(html).toContain('</body>');
    expect(html).toContain('</html>');
    
    // Check for responsiveness
    expect(html).toContain('@media');
  });

  it('should generate plain text version from TipTap content', () => {
    const plainText = generatePlainTextEmail(sampleContent, newsletterTitle, senderName);
    
    // Check that plain text includes content without HTML tags
    expect(plainText).toContain('Newsletter Title');
    expect(plainText).toContain('This is a paragraph of text.');
    expect(plainText).toContain('This has bold and italic text.');
    expect(plainText).toContain('* List item 1');
    expect(plainText).toContain('* List item 2');
    
    // Check that HTML is not present
    expect(plainText).not.toContain('<strong>');
    expect(plainText).not.toContain('<em>');
    expect(plainText).not.toContain('<ul>');
    
    // Check for sender information
    expect(plainText).toContain(senderName);
    
    // Check for image alt text
    expect(plainText).toContain('[Example image]');
  });

  it('should add unsubscribe link to HTML email', () => {
    const subscriberId = '12345';
    const baseUrl = 'https://newsletter.example.com';
    
    const html = generateEmailHtml(sampleContent, newsletterTitle, senderName);
    const htmlWithUnsubscribe = addUnsubscribeLink(html, subscriberId, baseUrl);
    
    // Check for unsubscribe link
    expect(htmlWithUnsubscribe).toContain(`${baseUrl}/unsubscribe?id=${subscriberId}`);
    expect(htmlWithUnsubscribe).toContain('Unsubscribe');
    
    // Make sure it's at the bottom of the email
    const footerPosition = htmlWithUnsubscribe.indexOf('Unsubscribe');
    const bodyEndPosition = htmlWithUnsubscribe.indexOf('</body>');
    
    expect(footerPosition).toBeLessThan(bodyEndPosition);
    expect(footerPosition).toBeGreaterThan(0);
  });

  it('should add unsubscribe link to plain text email', () => {
    const subscriberId = '12345';
    const baseUrl = 'https://newsletter.example.com';
    
    const plainText = generatePlainTextEmail(sampleContent, newsletterTitle, senderName);
    const plainTextWithUnsubscribe = addUnsubscribeLink(plainText, subscriberId, baseUrl, true);
    
    // Check for unsubscribe link in plain text format
    expect(plainTextWithUnsubscribe).toContain(`To unsubscribe, visit: ${baseUrl}/unsubscribe?id=${subscriberId}`);
    
    // Make sure it's at the bottom of the email
    const lastLine = plainTextWithUnsubscribe.split('\n').pop();
    expect(lastLine).toContain(baseUrl);
  });

  it('should handle empty content gracefully', () => {
    const emptyContent = { type: 'doc', content: [] };
    
    const html = generateEmailHtml(emptyContent, newsletterTitle, senderName);
    const plainText = generatePlainTextEmail(emptyContent, newsletterTitle, senderName);
    
    // Should still have basic structure
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<body');
    expect(html).toContain('</body>');
    
    // Should contain the title but no content
    expect(html).toContain(newsletterTitle);
    expect(plainText).toContain(newsletterTitle);
  });

  it('should handle links correctly in HTML output', () => {
    const contentWithLink = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Check out ' },
            {
              type: 'text',
              marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
              text: 'this website'
            },
            { type: 'text', text: '.' }
          ]
        }
      ]
    };
    
    const html = generateEmailHtml(contentWithLink, newsletterTitle, senderName);
    
    // Check for properly formatted link
    expect(html).toContain('<a href="https://example.com" target="_blank">this website</a>');
  });

  it('should handle links correctly in plain text output', () => {
    const contentWithLink = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Check out ' },
            {
              type: 'text',
              marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
              text: 'this website'
            },
            { type: 'text', text: '.' }
          ]
        }
      ]
    };
    
    const plainText = generatePlainTextEmail(contentWithLink, newsletterTitle, senderName);
    
    // Check that link is included in a readable way
    expect(plainText).toContain('Check out this website (https://example.com).');
  });
});