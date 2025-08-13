// Place this in your theme or custom JS file, or in a <script> tag after both forms

// Log all ACF question fields on page load in bright green
window.addEventListener("DOMContentLoaded", function() {
    var acfQuestions = document.querySelectorAll('[name^="acf_question_"]');
    var questionVals = [];
    acfQuestions.forEach(function(el) {
        questionVals.push(el.value);
    });
    if (acfQuestions.length > 0) {
        console.log(
            "%c[ACF] Found " + acfQuestions.length + " ACF question fields on page: " + questionVals.join(", "),
            "color: #00FF00; font-weight: bold; font-size: 16px; background: #222; padding: 2px 8px;"
        );
    } else {
        console.log(
            "%c[ACF] No ACF question fields found on page.",
            "color: #FF0000; font-weight: bold; font-size: 16px; background: #222; padding: 2px 8px;"
        );
    }
});

document.addEventListener("submit", function(e) {
    // Only run for Ninja Forms forms
    if (!e.target.classList.contains("ninja-forms-form")) return;

    // Find the closest .gated-lead-form-content container
    var gatedContainer = e.target.closest(".gated-lead-form-content");
    if (!gatedContainer) return;

    // Find the ACF questions form inside this container
    var acfForm = gatedContainer.querySelector("#acf-questions-form");
    if (!acfForm) return;

    // Gather answers from ACF questions
    var elements = acfForm.elements;
    var answers = [];
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        if (el.name && el.name.indexOf("acf_question_") === 0) {
            if (el.type === "checkbox") {
                if (el.checked) answers.push(el.value);
            } else if (el.type === "radio") {
                if (el.checked) answers.push(el.value);
            } else {
                if (el.value) answers.push(el.value);
            }
        }
    }

    // Combine all answers into a single string (comma separated)
    var answerString = answers.join(", ");

    // Debug: Show alert to confirm script is running and what it found
    alert("ACF Questions Submitted: " + answerString);

    // Log to console for confirmation
    console.log("ACF Questions Submitted:", answerString);

    // Remove any existing add_questions hidden field
    var existing = e.target.querySelectorAll('input[type="hidden"][name="add_questions"]');
    existing.forEach(function(node) { node.remove(); });

    // Add as a single hidden field
    if (answerString) {
        var hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "add_questions";
        hidden.value = answerString;
        e.target.appendChild(hidden);
    }
}, true);