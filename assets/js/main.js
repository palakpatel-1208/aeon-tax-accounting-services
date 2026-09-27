(function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var label = toggle ? toggle.querySelector(".sr-only") : null;

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.classList.toggle("is-open", open);
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (label) label.textContent = open ? "Close menu" : "Open menu";
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  var chrome = document.querySelector(".chrome");
  function measureChrome() {
    if (!chrome) return;
    document.documentElement.style.setProperty("--chrome-height", chrome.offsetHeight + "px");
  }
  measureChrome();
  window.addEventListener("resize", measureChrome);

  var form = document.getElementById("contact-form");
  if (!form) return;

  var success = document.getElementById("form-success");
  var edit = document.getElementById("edit-details");
  var service = document.getElementById("service");
  var requested = new URLSearchParams(window.location.search).get("service");
  if (service && ["tax", "bookkeeping", "payroll"].indexOf(requested) !== -1) {
    service.value = requested;
  }

  var fields = ["name", "email", "phone", "service", "message"];

  function clearError(field) {
    var input = document.getElementById(field);
    var error = document.getElementById(field + "-error");
    if (input) {
      input.setAttribute("aria-invalid", "false");
      input.removeAttribute("aria-describedby");
    }
    if (error) {
      error.hidden = true;
      error.textContent = "";
    }
  }

  function showError(field, message) {
    var input = document.getElementById(field);
    var error = document.getElementById(field + "-error");
    if (input) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", field + "-error");
    }
    if (error) {
      error.hidden = false;
      error.textContent = message;
    }
  }

  function validate() {
    var errors = {};
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var selected = service.value;
    var message = document.getElementById("message").value.trim();

    if (name.length < 2) errors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
    if (phone && phone.replace(/\D/g, "").length < 7) {
      errors.phone = "Enter a phone number with at least 7 digits, or leave it blank.";
    }
    if (!selected) errors.service = "Select a service.";
    if (message.length < 2) errors.message = "Enter a message.";
    return errors;
  }

  form.addEventListener("input", function (event) {
    if (event.target && event.target.id) clearError(event.target.id);
  });
  form.addEventListener("change", function (event) {
    if (event.target && event.target.id) clearError(event.target.id);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    fields.forEach(clearError);
    var errors = validate();
    var names = Object.keys(errors);
    if (names.length) {
      names.forEach(function (field) {
        showError(field, errors[field]);
      });
      var first = fields.filter(function (field) {
        return errors[field];
      })[0];
      var node = document.getElementById(first);
      if (node) node.focus();
      return;
    }
    form.hidden = true;
    success.hidden = false;
  });

  if (edit) {
    edit.addEventListener("click", function () {
      success.hidden = true;
      form.hidden = false;
      var name = document.getElementById("name");
      if (name) name.focus();
    });
  }
})();
