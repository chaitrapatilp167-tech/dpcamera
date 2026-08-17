/* Stackly form validation — all application / fill pages */
(function () {
  var NAME_RE = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  var EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;

  function host(input) {
    return input.closest('.field') || input.parentNode;
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    var wrap = host(input);
    wrap.querySelectorAll('.field-error').forEach(function (n) { n.remove(); });
  }

  function setError(input, msg) {
    clearError(input);
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    var el = document.createElement('p');
    el.className = 'field-error';
    el.textContent = msg;
    host(input).appendChild(el);
  }

  function validateName(val) {
    if (!val) return 'Please enter your name.';
    if (!NAME_RE.test(val)) return 'Please enter your name.';
    return '';
  }

  function validateEmail(val) {
    if (!val) return 'Please enter a valid email address.';
    if (!EMAIL_RE.test(val) || val.indexOf('..') !== -1 || val.indexOf('@.') !== -1) {
      return 'Please enter a valid email address.';
    }
    return '';
  }

  function validatePhone(val) {
    var digits = (val || '').replace(/\D/g, '');
    if (!digits) return 'Please enter your number.';
    if (!/^\d{10}$/.test(digits)) return 'Please enter a 10-digit number.';
    return '';
  }

  function validatePassword(val) {
    if (!val) return 'Please enter your password.';
    if (val.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(val)) return 'Password must include at least one uppercase letter.';
    if (!/[a-z]/.test(val)) return 'Password must include at least one lowercase letter.';
    if (!/\d/.test(val)) return 'Password must include at least one numeric digit.';
    if (!/[^A-Za-z0-9]/.test(val)) return 'Password must include at least one special character.';
    return '';
  }

  function validateRequired(val, emptyMsg) {
    if (!val) return emptyMsg || 'This field is required.';
    return '';
  }

  function validateField(input) {
    var type = input.getAttribute('data-validate');
    if (!type) return true;
    var val = (input.value || '').trim();
    var msg = '';
    if (type === 'name' || type === 'lastname') msg = validateName(val);
    else if (type === 'email') msg = validateEmail(val);
    else if (type === 'phone') {
      input.value = val.replace(/\D/g, '').slice(0, 10);
      msg = validatePhone(input.value);
    } else if (type === 'password') msg = validatePassword(input.value);
    else if (type === 'confirm-password') {
      var passInput = input.form ? input.form.querySelector('[data-validate="password"]') : null;
      if (!input.value) msg = 'Please confirm your password.';
      else if (passInput && input.value !== passInput.value) msg = 'Passwords do not match.';
    } else if (type === 'required') msg = validateRequired(val, input.getAttribute('data-empty') || 'This field is required.');
    if (msg) {
      setError(input, msg);
      return false;
    }
    clearError(input);
    return true;
  }

  function bindInput(input) {
    var type = input.getAttribute('data-validate');
    input.addEventListener('input', function () {
      if (type === 'name' || type === 'lastname') {
        input.value = input.value.replace(/[^A-Za-z ]/g, '');
      }
      if (type === 'phone') {
        input.value = input.value.replace(/\D/g, '').slice(0, 10);
      }
      if (input.classList.contains('is-invalid')) validateField(input);
    });
    input.addEventListener('blur', function () { validateField(input); });
  }

  function onSuccess(form) {
    if (form.id === 'login-form') {
      var role = form.querySelector('input[name="role"]:checked');
      var value = role ? role.value : 'client';
      var emailInput = form.querySelector('[data-validate="email"]');
      var email = emailInput ? emailInput.value.trim() : '';
      try {
        localStorage.setItem('stacklyEmail', email);
        localStorage.setItem('stacklyRole', value);
        sessionStorage.setItem('stacklyEmail', email);
        sessionStorage.setItem('stacklyRole', value);
      } catch (err) {}
      window.location.href = 'dashboard.html?role=' + encodeURIComponent(value) + '&email=' + encodeURIComponent(email);
      return;
    }
    if (form.id === 'signup-form') {
      var emailEl = document.getElementById('gs-email');
      var email = emailEl ? emailEl.value.trim() : '';
      try {
        localStorage.setItem('stacklyEmail', email);
        localStorage.setItem('stacklyRole', 'client');
        sessionStorage.setItem('stacklyEmail', email);
        sessionStorage.setItem('stacklyRole', 'client');
      } catch (err) {}
      window.location.href = 'login.html?email=' + encodeURIComponent(email);
      return;
    }
    var next = form.getAttribute('data-success');
    if (next) window.location.href = next;
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Password visibility toggle handler
    document.querySelectorAll('.toggle-password-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var wrap = btn.closest('.password-wrap');
        if (!wrap) return;
        var input = wrap.querySelector('input');
        if (!input) return;
        var eyeShow = btn.querySelector('.eye-show');
        var eyeHide = btn.querySelector('.eye-hide');
        if (input.type === 'password') {
          input.type = 'text';
          if (eyeShow) eyeShow.style.display = 'none';
          if (eyeHide) eyeHide.style.display = 'block';
        } else {
          input.type = 'password';
          if (eyeShow) eyeShow.style.display = 'block';
          if (eyeHide) eyeHide.style.display = 'none';
        }
      });
    });

    document.querySelectorAll('form.js-validate').forEach(function (form) {
      form.setAttribute('novalidate', 'novalidate');
      form.querySelectorAll('[data-validate]').forEach(bindInput);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        var firstBad = null;
        form.querySelectorAll('[data-validate]').forEach(function (input) {
          if (!validateField(input)) {
            ok = false;
            if (!firstBad) firstBad = input;
          }
        });
        if (!ok) {
          if (firstBad) firstBad.focus();
          return;
        }
        onSuccess(form);
      });
    });
  });
})();
