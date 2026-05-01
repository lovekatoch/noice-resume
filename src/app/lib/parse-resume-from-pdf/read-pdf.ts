// Getting pdfjs to work is tricky. The following 3 lines would make it work
// https://stackoverflow.com/a/63486898/7699841
import * as pdfjs from "pdfjs-dist";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import type { TextItem as PdfjsTextItem } from "pdfjs-dist/types/src/display/api";
import type { TextItem, TextItems } from "lib/parse-resume-from-pdf/types";

export class PdfParseError extends Error {
  constructor(
    message: string,
    public partialResult?: TextItems,
    public recoverable: boolean = false
  ) {
    super(message);
    this.name = "PdfParseError";
  }
}

/**
 * Step 1: Read pdf and output textItems by concatenating results from each page.
 *
 * To make processing easier, it returns a new TextItem type, which removes unused
 * attributes (dir, transform), adds x and y positions, and replaces loaded font
 * name with original font name.
 *
 * @example
 * const onFileChange = async (e) => {
 *     const fileUrl = URL.createObjectURL(e.target.files[0]);
 *     const textItems = await readPdf(fileUrl);
 * }
 */
export const readPdf = async (fileUrl: string): Promise<TextItems> => {
  let pdfFile;
  try {
    pdfFile = await pdfjs.getDocument(fileUrl).promise;
  } catch (err) {
    throw new PdfParseError(
      "Failed to load PDF document. The file may be corrupted or not a valid PDF.",
      undefined,
      false
    );
  }

  if (pdfFile.numPages === 0) {
    throw new PdfParseError(
      "PDF has no pages",
      [],
      false
    );
  }

  let textItems: TextItems = [];

  for (let i = 1; i <= pdfFile.numPages; i++) {
    let page;
    try {
      page = await pdfFile.getPage(i);
    } catch (err) {
      throw new PdfParseError(
        `Failed to read page ${i} of ${pdfFile.numPages}. The page may be corrupted.`,
        textItems.length > 0 ? textItems : undefined,
        textItems.length > 0
      );
    }

    let textContent;
    try {
      textContent = await page.getTextContent();
    } catch (err) {
      throw new PdfParseError(
        `Failed to extract text from page ${i}. The page content may be corrupted or use an unsupported format.`,
        textItems.length > 0 ? textItems : undefined,
        textItems.length > 0
      );
    }

    try {
      await page.getOperatorList();
      const commonObjs = page.commonObjs;

      const pageTextItems = textContent.items.map((item) => {
        const {
          str: text,
          dir,
          transform,
          fontName: pdfFontName,
          ...otherProps
        } = item as PdfjsTextItem;

        const x = transform[4];
        const y = transform[5];

        const fontObj = commonObjs.get(pdfFontName);
        const fontName = fontObj?.name || pdfFontName || "unknown";

        const newText = text.replace(/-­‐/g, "-");

        return {
          ...otherProps,
          fontName,
          text: newText,
          x,
          y,
        };
      });

      textItems.push(...pageTextItems);
    } catch (err) {
      throw new PdfParseError(
        `Failed to process fonts on page ${i}. This may indicate a corrupted or non-standard PDF.`,
        textItems.length > 0 ? textItems : undefined,
        textItems.length > 0
      );
    }
  }

  if (textItems.length === 0) {
    throw new PdfParseError(
      "PDF loaded successfully but contains no extractable text. The file may contain only images or use an unsupported encoding.",
      [],
      false
    );
  }

  const isEmptySpace = (textItem: TextItem) =>
    !textItem.hasEOL && textItem.text.trim() === "";
  textItems = textItems.filter((textItem) => !isEmptySpace(textItem));

  return textItems;
};
