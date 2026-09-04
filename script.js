// DrChem Registration Form - Google Forms Direct Integration

const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeEcQ-lrZTh-Q4lRycSJr1GjJO3kuvM92nfEJqGfQLMo-8i2g/formResponse";

const ENTRY_IDS = {
  name: "entry.893673608",
  phone: "entry.1660672584",
  email: "entry.206035276",
  institution: "entry.1342587133",
  batch: "entry.1070515274"
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('drChemForm');
  const formCard = document.getElementById('formCard');
  const confirmationCard = document.getElementById('confirmationCard');
  const summaryBox = document.getElementById('summaryBox');
  const resetBtn = document.getElementById('resetBtn');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnIcon = submitBtn.querySelector('.btn-icon');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');

  // Input Elements
  const fullNameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const institutionInput = document.getElementById('institution');
  const batchInputs = document.querySelectorAll('input[name="batch"]');

  // Liquid Progress Elements
  const liquidFluid = document.getElementById('liquidFluid');
  const progressPercent = document.getElementById('progressPercent');
  const companionText = document.getElementById('companionText');

  function toBanglaDigits(num) {
    const banglaNums = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
    return String(num).replace(/[0-9]/g, match => banglaNums[match] || match);
  }

  function updateLiquidProgress() {
    let completedCount = 0;
    if (fullNameInput.value.trim().length >= 3) completedCount++;
    if (validatePhone(phoneInput.value)) completedCount++;
    if (validateEmail(emailInput.value)) completedCount++;
    if (institutionInput.value.trim().length > 0) completedCount++;
    if (document.querySelector('input[name="batch"]:checked')) completedCount++;

    const percent = completedCount * 20; // 0, 20, 40, 60, 80, 100%
    if (liquidFluid) liquidFluid.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${toBanglaDigits(percent)}% সম্পন্ন`;
    if (companionText) companionText.textContent = `${toBanglaDigits(percent)}% পূর্ণ`;
  }

  // Phone input formatting - only allow digits
  phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
    validateField(phoneInput, validatePhone);
    updateLiquidProgress();
  });

  // Real-time input listeners
  fullNameInput.addEventListener('input', () => {
    validateField(fullNameInput, (val) => val.trim().length >= 3);
    updateLiquidProgress();
  });
  emailInput.addEventListener('input', () => {
    validateField(emailInput, validateEmail);
    updateLiquidProgress();
  });
  institutionInput.addEventListener('input', () => {
    validateField(institutionInput, (val) => val.trim().length > 0);
    updateLiquidProgress();
  });

  batchInputs.forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('group-batch').classList.remove('has-error');
      document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('selected'));
      radio.closest('.radio-card').classList.add('selected');
      updateLiquidProgress();
    });
  });

  // Validation functions
  function validatePhone(phone) {
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    return bdPhoneRegex.test(phone.trim());
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  function validateField(inputElement, validatorFn) {
    const parentGroup = inputElement.closest('.form-group');
    const isValid = validatorFn(inputElement.value);

    if (isValid) {
      parentGroup.classList.remove('has-error');
      parentGroup.classList.add('is-valid');
    } else {
      parentGroup.classList.remove('is-valid');
      if (inputElement.value.length > 0) {
        parentGroup.classList.add('has-error');
      }
    }
    return isValid;
  }

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Full Name
    if (fullNameInput.value.trim().length < 3) {
      document.getElementById('group-fullName').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('group-fullName').classList.remove('has-error');
    }

    // Validate Phone
    if (!validatePhone(phoneInput.value)) {
      document.getElementById('group-phone').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('group-phone').classList.remove('has-error');
    }

    // Validate Email
    if (!validateEmail(emailInput.value)) {
      document.getElementById('group-email').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('group-email').classList.remove('has-error');
    }

    // Validate Institution
    if (institutionInput.value.trim().length === 0) {
      document.getElementById('group-institution').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('group-institution').classList.remove('has-error');
    }

    // Validate Batch Selection
    const selectedBatch = document.querySelector('input[name="batch"]:checked');
    if (!selectedBatch) {
      document.getElementById('group-batch').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('group-batch').classList.remove('has-error');
    }

    if (!isValid) {
      const firstError = document.querySelector('.form-group.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Process submission state (Button animation)
    submitBtn.disabled = true;
    btnText.textContent = 'তথ্য জমা হচ্ছে...';
    btnIcon.classList.add('hidden');
    btnSpinner.classList.remove('hidden');

    const submissionData = {
      name: fullNameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      institution: institutionInput.value.trim(),
      batch: selectedBatch.value
    };

    // Prepare Google Forms FormData payload
    const formData = new FormData();
    formData.append(ENTRY_IDS.name, submissionData.name);
    formData.append(ENTRY_IDS.phone, submissionData.phone);
    formData.append(ENTRY_IDS.email, submissionData.email);
    formData.append(ENTRY_IDS.institution, submissionData.institution);
    formData.append(ENTRY_IDS.batch, submissionData.batch);

    try {
      // Send directly to Google Form backend
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
    } catch (err) {
      console.warn("Google Forms submission error (handled):", err);
    }

    // Populate Summary Box
    summaryBox.innerHTML = `
      <div class="summary-item">
        <span class="summary-label">শিক্ষার্থীর নাম:</span>
        <span class="summary-val">${submissionData.name}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">মোবাইল নম্বর:</span>
        <span class="summary-val">+88 ${submissionData.phone}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">ইমেইল:</span>
        <span class="summary-val">${submissionData.email}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">কলেজ/স্কুল:</span>
        <span class="summary-val">${submissionData.institution}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">টার্গেট ব্যাচ:</span>
        <span class="summary-val">${submissionData.batch}</span>
      </div>
    `;

    // Transition to confirmation screen
    formCard.classList.add('hidden');
    confirmationCard.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset button state
    submitBtn.disabled = false;
    btnText.textContent = 'সেমিনারে আসন নিশ্চিত করো';
    btnIcon.classList.remove('hidden');
    btnSpinner.classList.add('hidden');
  });

  // Reset form to submit again
  resetBtn.addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error', 'is-valid');
    });
    document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('selected'));
    updateLiquidProgress();
    
    confirmationCard.classList.add('hidden');
    formCard.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========================================================================
  // 3D Tilt & Parallax Physics Engine
  // =========================================================================
  const tiltCards = [formCard, confirmationCard];

  tiltCards.forEach(card => {
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the card
      const y = e.clientY - rect.top;  // y position within the card

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate 3D tilt angles (max +/- 6 degrees for subtle realistic feel)
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;

      // Dynamic light glare follow
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      // Smoothly reset back to flat
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });

  // 3D Parallax on background molecules based on mouse movement
  window.addEventListener('mousemove', (e) => {
    const mouseXRatio = (e.clientX / window.innerWidth) - 0.5;
    const mouseYRatio = (e.clientY / window.innerHeight) - 0.5;

    document.querySelectorAll('.molecule-3d').forEach((mol, index) => {
      const factor = (index + 1) * 15;
      const moveX = mouseXRatio * factor;
      const moveY = mouseYRatio * factor;
      mol.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });
});

