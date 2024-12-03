// If there are any footnotes in the document, number them in reference-order and arrange the notes
// in that order in the #footnotes container element, which must be a <section> element.

function organizeFootnotes() {
    // Get all reference links by data-fn attribute, in document order
    const fn_refs = document.querySelectorAll('[data-fn-id]');

    // How wide to make the def # field
    let def_width = undefined; // Depends on the style

    let fn_style = undefined;
    if (fn_refs.length) {
      fn_style = fn_refs[0].getAttribute('data-fn-style');
    }

    // Determine what style to use
    let stylize = function (num) {
      throw new Error(`Unsupported style: ${fn_style}`);
    };

    if (fn_style === "superscript" || fn_style === "bracket") {

      // Add width for trailing period / surrounding brackets
      def_width = fn_refs.length.toString().length; // Width of largest fn #
      def_width += ((fn_style === "superscript") ? 1 : 2); // Dot or two brackets

      // Just replace each ref/def with the ordinal position
      stylize = function (num) {
        return num.toString();
      }
    }

    if (fn_style === "asterisk") {

      //  Width for all the asterisks plus two brackets
      def_width = fn_refs.length;

      // Replace the fn-ref and fn-def with the ordinal-position # of asterisks
      stylize = function(num) {
        return '*'.repeat(num);
      }
    }

    if (fn_style === "dagger") {

      // Width for the daggers plus two brackets
      def_width = (fn_refs.length < 3) ? 3 : (fn_refs.length + 2); // [†], [‡], [††], [†††], ...

      // If there are fewer than three footnotes, replace the first def/ref with † and the second
      // with ‡. Otherwise replace def/refs with ordinal-position # of †’s.
      stylize = function(num) {
        const daggers = ['†', '‡']
        if (num < 3) {
          return daggers[num - 1];
        }
        else {
          return '†'.repeat(num - 1);
        }
      }
    }

    if (fn_style === "dingbat") {

      // “Writerly” dingbats
      const dingbats = ['✍', '✎', '✏', '✐', '✑', '✒'];

      // 2 brackets plus one dingbat ...
      def_width = 4;  // Extra char space in case .fn-def-num font-family is not (ui-)monospace

      // ... unless there are more footnotes than dingbats
      def_width += Math.floor((fn_refs.length - 1) / dingbats.length);

      // ✍, ..., ✒ (270D through 2712). If more than six footnotes, repeat cycle with each one
      // doubled (✍✍, ...)
      stylize = function(num) {
        const index = (num -1) % dingbats.length; // which dingbat
        const repeats = 1 + Math.floor((num - 1) / dingbats.length); // how many copies
        return dingbats[index].repeat(repeats);
      }
    }

    // Get the footnotes container
    const footnotesSection = document.getElementById('footnotes');
    if (! footnotesSection) {
      alert(`Missing footnotes <section>`);
      return;
    }

    // Number the references and collect their data-fn-id values in order of appearance
    fn_refs.forEach((fn_ref, index) => {
      const fnID = fn_ref.getAttribute('data-fn-id');
      const fn_num = index + 1;
      let fn_num_str = stylize(fn_num);

      // Update reference number display
      fn_ref.textContent = fn_num_str;

      // Find and move the corresponding footnote paragraph to correct position
      const footnote = document.getElementById(`fn-def-${fnID}`);
      if (footnote) {
        // Update footnote definition.
        let span_element = footnote.querySelectorAll('span.fn-def-num')[0];
        span_element.textContent = fn_num_str;
        span_element.parentElement.style.display = 'inline-block';
        span_element.parentElement.style.width = def_width + 'ch';
        span_element.parentElement.style.textAlign = 'right';
      }

      // Move paragraph to correct position
      footnotesSection.appendChild(footnote);

    });
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', organizeFootnotes);
