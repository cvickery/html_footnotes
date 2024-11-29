
#HTML Footnotes
Manage footnotes numbers and links in HTML documents.

Each footnote consists of a *footnote reference* and a *footnote body* ("definition"). The reference appears at some point in the main content part of the document, and consists of a number or symbol (`'*'`), which is a clickable link to the footnote body. The footnote bodies are gathered together in a section that is typically located at the end of the document. Each footnote body ends with a link back to the point in the document where the reference appears.

Given the text of a footnote body, this extension sets up the reference link, the return link at the end of the body, and places the body in the footnotes section of the document. When the document is rendered by a browser, a small JavaScript function handles the process of generating footnote numbers in the order of the references in the document, and arranging the order of the footnote bodys to match the numbering order.

The footnote reference style is selectable: superscripts, or enclosed in square, round, or curly brackets.

The bodies of footnotes may be supplied in either of two ways. If there is no text selected, the user is prompted to type (or paste) the body's text, and the footnote reference will be inserted at the editor's current position. However, if the current selection is not empty, that text will be used as the body's text, and the footnote reference will replace the selected text. In either case, footnote bodies are gathered into a list of `div`s in a _#footnotes_ `section`, normally located at the end of the document. A link back to the footnote reference point is automatically appended to each footnote body. 

As the HTML document is edited, all footnote references are shown as `*`s. The numbering process is deferred until the document is actually viewed (rendered by a user’s browser). At that point, a supplied JavaScript function numbers the footnotes in the order in which they are referenced in the body of the document and re-orders the footnote bodies in the _#footnotes_ `section` to match that order. Without the JavaScript code, the references will all continue to appear as asterisks, the footnote bodies will appear in the order in which they were added by the writer, and they will all appear as number "*". But the links from the references to the footnotes and back will still work.

## Features
- CSS support:
    - All footnote references are wrapped in a `span` with the class name "fn-ref"
    - All footnote bodies are wrapped in a `div` with the class name "fn-def'
    - The text for the links from the end of the footnote body to the footnote reference ('↩') are wrapped in a `span` with the class name "fn-ref-link"
- Each footnote is assigned a unique id (the millisecond timestamp when it was created).
    - ID’s are used only for matching references to definitions and vice-versa.
    - Footnote numbers shown on the web page are determined when the document is rendered. If new footnotes are added to a document, the footnote numbers will match the new reference order whenever the updated the document is viewed again.
    - Footnote numbers are always Arabic numerals (1, 2, 3, ...).  

## Configuration

### keyboard shortcut

The default keyboard shortcut for creating a new footnote is `ctrl-f`. It can be changed in Nova’s *Settings→Key Bindings* pane.

### reference style
Footnote reference numbers are superscripts by default, but may alternatively be enclosed in square, round, or curly braces. The choice can be changed in the extension’s Settings pane. The choices are shown there as `<sup>` for superscripts, and as `[...]`, `(...)`, and `{...}` for the other three options.

### use simple numbering
By default, when footnotes are numbered the footnote bodies in the `#footnotes` section are simply preceeded by the number, a period, and two spaces. In the extension’s Settings pane, there is an option to turn off this simple numbering scheme (uncheck the option). With this option off, *and if the reference style is square, round, or curly brackets,* then each footnote body will be preceded by the footnote number enclosed in the reference style brackets, followed by two spaces.

## Usage

### Create an empty `<section>` element to the HTML document you want to add footnotes to.
Make the id of the section "footnotes":

```
<section id="footnotes">
</section>
```

The section normally goes just before the `</body>` tag, but can that position is not a requirement.

### Add the supplied `footnotes.js` to the HTML documents.
Link to the `footnotes.js` file from the web page.
You can find `footnotes.js` in the following directory:

_[extension-path]_`/footnotes.js`

On macOS, the _extension-path_ is:
`~/Library/Application Support/Nova/Extensions/com.cvickery.footnote_manager/`

Copy the `footnotes.js` file into your project and reference it like this:
```html
<script src="footnotes.js"></script>
```
## Usage

To add a footnote to your document:

- Use the keyboard shortcut (default `ctrl-f`); or
- Use the *Editor → Make Footnote* menu item; or
- Open the command palette (⌘⇧P) and type `Make Footnote`



