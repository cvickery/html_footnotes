// If there are any footnotes in the document, number them in reference-order and arrange the notes
// in that order in the #footnotes container element, which must be a <section> element.

function organizeFootnotes() {
    // Get all reference links by data-fn attribute, in document order
    const refs = document.querySelectorAll('[data-fn-ref]');

    // Get the footnotes container
    const footnotesSection = document.getElementById('footnotes');

    // Number the references and collect their data-fn-ref values in order
    refs.forEach((ref, index) => {
      const num = index + 1;
      const fnID = ref.getAttribute('data-fn-ref');
      // Update reference number display
      ref.textContent = `${num}`;

      // Find and move the corresponding footnote paragraph to correct position
      const footnote = document.getElementById(`fn-def-${fnID}`);
      if (footnote) {
        // Update footnote number display (assuming first text node before the back-link)
        footnote.insertAdjacentText('afterbegin', `${num}. `);
        }
      // Move paragraph to correct position
      footnotesSection.appendChild(footnote);
    });
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', organizeFootnotes);
