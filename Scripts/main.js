
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
          return; // No change
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

  // Editor option: Indentation text
  const tabText = editor.tabText;
  // console.log(`tabLength: ${editor.tabLength}`);
  // console.log(`tabText: ${Array.from(tabText)
  //                              .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
  //                              .join('')}`);

  // Extension option: Reference Style
  const reference_style = nova.config.get('manage-footnotes.reference-style');
  if (!reference_style) {
    throw new Error("No reference style")
  }
  // What appears on each side of the placeholder for the reference
  let ref_left = '', ref_right = '';
  // What appears on each side of the placeholder for the definition
  let def_left = '', def_right = '';
  // Placeholder to display
  let display = '';
  switch (reference_style) {

    case "superscript":
      ref_left = "<sup>";
      ref_right = "</sup>";
      def_left = '';
      def_right = '.';
      display = '#';
      break;

    case "bracket":
      ref_left = '[';
      ref_right = ']';
      def_left = '[';
      def_right = ']';
      display = '#'
      break;

    case "asterisk":
      ref_left = '<sup>';
      ref_right = '</sup>';
      def_left = '';
      def_right = '';
      display = '*'
      break;

    case "dagger":
      ref_left = '<sup>';
      ref_right = '</sup>';
      def_left = '[';
      def_right = ']';
      display = '†'
      break;

    case "dingbat":
      ref_left = '<sup>';
      ref_right = "</sup>";
      def_left = '[';
      def_right = ']';
      display = '✍';
      break;

    default:
      throw new Error("Invalid Reference Style")
  }

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

  // Try to preserve the indentation of the footnotes section
  const section_indent = footnotesMatch[1];
  if (!/^\s*$/.test(section_indent)) {
    // Section tag not first text on line, so empty the section_indent string
    section_indent = "";
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

    // The footnote reference display span.
    const footnote_reference = `<span class="fn-ref">${ref_left}<a id="fn-ref-${id}"
      data-fn-id="${id}"
      data-fn-style="${reference_style}"
      href="#fn-def-${id}">${display}</a>${ref_right}</span>`;

    // The footnote definition display span
    const def_display = `<span>${def_left}<span class="fn-def-num">${display}</span>${def_right}</span>`;

    // The footnote defintion div
    const footnote_div = `<div id="fn-def-${id}" class="fn-def">
${section_indent}${tabText}${def_display} ${footnoteBody}
${section_indent}${tabText}<a href="#fn-ref-${id}"><span class="fn-ref-link">↩</span></a>
${section_indent}</div>\n
${section_indent}`;

    // console.log(`footnote_div: ${footnote_div}`);

    // Insert footnote at end of footnotes section, just before the closing tag.
    editor.edit((edit) => {
      // console.log(`insert footnote_div at ${endPos}`);
      edit.insert(endPos, footnote_div);
    });

    // Insert the footnote reference link
    editor.edit((edit) => {
      // console.log(`footnote_reference: ${footnote_reference}`)
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

