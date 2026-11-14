(() => {
  document.addEventListener('invalid', ({ target: field }) => {
    if (document.documentElement.lang !== 'ar') return;
    const validity = field.validity;
    if (!validity || validity.customError) return;
    const message = validity.valueMissing ? 'يرجى ملء هذا الحقل.'
      : validity.typeMismatch && field.type === 'email' ? 'يرجى إدخال عنوان بريد إلكتروني صالح.'
      : validity.rangeUnderflow ? 'يرجى إدخال قيمة لا تقل عن ' + field.min + '.'
      : validity.rangeOverflow ? 'يرجى إدخال قيمة لا تزيد على ' + field.max + '.'
      : validity.tooShort ? 'يرجى إدخال نص أطول.'
      : 'يرجى التحقق من القيمة المدخلة.';
    field.setCustomValidity(message);
    field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
    queueMicrotask(() => {
      if (field.validationMessage === message) field.setCustomValidity('');
    });
  }, true);
})();
