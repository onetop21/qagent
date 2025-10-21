import MarkdownIt from 'markdown-it';

export class MarkdownParser {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });
  }

  /**
   * Parse markdown content to plain text
   * @param content - Markdown content
   * @returns Parsed plain text
   */
  parse(content: string): string {
    try {
      // Convert markdown to HTML first
      const html = this.md.render(content);

      // Strip HTML tags to get plain text
      const plainText = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return plainText;
    } catch (error) {
      throw new Error(`Failed to parse markdown: ${error.message}`);
    }
  }

  /**
   * Extract sections from markdown by headings
   * @param content - Markdown content
   * @returns Object with section titles as keys
   */
  extractSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = content.split('\n');

    let currentSection = 'introduction';
    let currentContent: string[] = [];

    for (const line of lines) {
      // Check if line is a heading
      const headingMatch = line.match(/^#{1,6}\s+(.+)/);

      if (headingMatch) {
        // Save previous section
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }

        // Start new section
        currentSection = headingMatch[1].toLowerCase().replace(/\s+/g, '-');
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }
}
