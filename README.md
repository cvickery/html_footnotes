
#HTML Footnotes
Manage footnotes in a HTML document. Footnote reference style is selectable (superscripts, or enclosed in square, round, or curly brackets). The bodies of footnotes may be supplied by typing/pasting or from currently selected text, which gets replaced by the footnote reference. Footnote bodies are gathered into a list of `div`s in a _#footnotes_ `section`, normally located at the end of the document. A link back to the footnote reference point is automatically appended to each footnote body. 

As the HTML document is edited, all footnote references are shown as `*`s. To use numbered footnotes, the numbering process is deferred until the document is actually viewed (rendered by a user’s browser). At that point, a supplied JavaScript function numbers the footnotes in the order in which they are referenced in the body of the document and re-orders the footnote bodies in the _#footnotes_ `section` to match that order. Without the JavaScript code, the references will all appear as asterisks, the footnote bodies will appear in the order in which they were added by the writer, and there will be no numbers attached to the footnote bodies. But the links from the references to the footnotes and back will still work.

## Features
- CSS support:
    - All footnote references are wrapped in a `span` with the class name "fn-ref"
    - All footnote bodies are wrapped in a `div` with the class name "fn-def'
    - The text for the links from the end of the footnote body to the footnote reference ('↩') are wrapped in a `span` with the class name "fn-ref-link"
- Each footnote is assigned a unique id (the millisecond timestamp when it was created).
    - ID’s are used only for matching references to definitions and vice-versa.
    - Footnote numbers shown on the web page are determined only when the document is rendered. If new footnotes are added to a document, the footnote numbers will match the new reference order whenever the updated the document is viewed.

## Configuration

keyboard shortcut

reference style

fix indent code

change how footnote bodies are numbered

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

_[extension-path]_`/Scripts/footnotes.js`

On macOS, the _extension-path_ is:
`~/Library/Application Support/Nova/Extensions/com.html_footnotes.cvickery/`

Copy the `footnotes.js` file into your project and reference it like this:
```html
<script src="footnotes.js"></script>
```
## Usage

To add a footnote to your document:

- Select the *Editor → HTML Footnotes* menu item; or
- Open the command palette (⌘⇧P) and type `Insert Footnote`



