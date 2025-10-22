// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

export class PdfParser {
  /**
   * Parse PDF buffer to plain text
   * @param buffer - PDF file buffer
   * @returns Parsed plain text
   */
  async parse(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  /**
   * Get PDF metadata
   * @param buffer - PDF file buffer
   * @returns Metadata object
   */
  async getMetadata(buffer: Buffer): Promise<Record<string, any>> {
    try {
      const data = await pdfParse(buffer);
      return data.info || {};
    } catch (error) {
      throw new Error(`Failed to get PDF metadata: ${error.message}`);
    }
  }
}
