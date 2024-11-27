
/* Nova supplied these
   -------------------
  */
exports.activate = function() {
  // Do work when the extension is activated
  // console.log("Manage Footnotes activated");
  }

exports.deactivate = function() {
  // Clean up state before the extension is deactivated
  }

// getFootnoteBody()
// ------------------------------------------------------------------------------------------------
/* If there is a non-empty selection, return it as the footnote’s body. Otherwise, prompt the user
 * to enter it.
 */
async function getFootnoteBody(editor) {
  // console.log('getFootnoteBody()');
  // Is there selected text to use as the footnote body?
  if (editor.selectedRange.empty) {
    // No: get footnote content from user
    const options = {
      label: "Footnote text:",
      placeholder: "HTML, except <section>, allowed"
      };

    return new Promise((resolve, reject) => {
      nova.workspace.showInputPanel('Make Footnote', options, (userInput) => {
        if (!userInput) {
          reject(new Error("No Change"));
          }
        resolve(userInput);
        });
      });
    }
    else {
      // Yes: use the current selection as the footnote body
      return editor.selectedText;
      }
  }

/*  If there is a range selected, use it as the text of a new footnote, replace it with a '*'
 *  reference to the footnote, wrap the footnote text in a div, and move the div to the end of the
 *  footnotes section.
 *
 *  If there is no range, prompt for the text of a new footnote, append a '*' reference to the
 *  footnote at the insertion point, and proceed as above for the footnote text.
 *
 *  The reference-style configuration parameter determines whether the '*' reference will be wrapped
 *  in <sup>...</sub> or square|round|curly braces.
 */

nova.commands.register("manage-footnotes.makeFootnote", async () => {
  const editor = nova.workspace.activeTextEditor;
  if (!editor) {
    throw new Error("No active text editor");
  }

  // Configuration option: Reference Style
  const reference_style = nova.config.get('manage-footnotes.reference-style');
  let left = "", right = "";
  switch (reference_style) {
    case "<sup>":
      left = "<sup>";
      right = "</sup>";
      break;
    default:
      // "[...]" or "(...)" or "{...}"
      left = reference_style[0];
      right = reference_style[4];
  }

  // What to use to indent the footnote div within the #footnotes section
  const tabText = editor.tabText;
  // // console.log(`tabText: ${Array.from(tabText)
  //                              .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
  //                              .join(' ')}`);

  // Where to insert the footnote reference
  const reference_range = editor.selectedRange;
  // console.log(`reference_range: ${reference_range}`);

  // Find the #footnotes section
  /* The footnotes section has to be a section element, the section tag must be the first text on a
   * line, the id must be the tag’s first attribute, and the id value has to be "footnotes".
   * Whitespace before the tag will be used to indent the footnote body and the closing section tag.
   */
  let text = editor.getTextInRange(new Range(0, editor.document.length));
  const footnotesMatch = text.match(/^(\s*)<section\s+id="footnotes"/im);

  if (!footnotesMatch) {
    throw new Error("Could not find #footnotes section element");
  }

  // console.log(`index: ${footnotesMatch.index}`);
  // console.log(`length: ${footnotesMatch[0].length}`);

  // Verify the <section> tag is the first text on the line.
  const section_indent = footnotesMatch[1];
  if (!/^\s*$/.test(section_indent)) {
    throw new Error("Section tag not first text on line");
  }

  // Find the end of the #footnotes section
  // Precondition (not checked): there must be no nested <section> elements in the footnotes
  // section.
  let startPos = footnotesMatch.index + footnotesMatch[0].length;
  // console.log(`startPos: ${startPos}`);
  text = editor.getTextInRange(new Range(startPos, editor.document.length));
  // console.log(`text: ${text}`);
  endMatch = text.match(/<\/section>/);

  if (! endMatch) {
    throw new Error("Could not find end of #footnotes section");
  }
  endPos = startPos + endMatch.index;
  // console.log(`endPos: ${endPos}`);

  // Get the footnote's body from selected text or by prompting the user.
  try {
    const footnoteBody = await getFootnoteBody(editor);
    // console.log(`footnoteBody: ${footnoteBody}`);
    // Generate the link to the footnote’s div, and the footnote div definition
    const id = `${Date.now()}`;
    const footnote_reference = `${left}<a id="fn-ref-${id}"
      data-fn-ref="${id}"
      href="#fn-def-${id}">*</a>${right}`;
    const footnotes_div = `
${section_indent}${tabText}<div id="fn-def-${id}" class="fn">
${section_indent}${tabText}${tabText}${footnoteBody}
${section_indent}${tabText}${tabText}<a href="#fn-ref-${id}"><span class="fn-ref-link">↩</span></a>
${section_indent}${tabText}</div>\n
${section_indent}`;

    // console.log(`footnotes_div: ${footnotes_div}`);

    // Insert footnote at end of footnotes section, just before the closing tag.
    editor.edit((edit) => {
      // console.log(`insert footnotes_div at ${endPos}`);
      edit.insert(endPos, footnotes_div);
    });

    // Insert the footnote reference link
    editor.edit((edit) => {
      // console.log(`insert reference at ${reference_range}`);
      edit.replace(reference_range, footnote_reference);
    });

    } catch (error) {
      console.error(error);
      nova.workspace.showErrorMessage(
        `Failed to insert footnote: ${error.message}`
      );
    }
  });

