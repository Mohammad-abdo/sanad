import Swal from 'sweetalert2';

const rtlMixin = {
  customClass: {
    popup: 'font-sans text-right rounded-2xl shadow-xl',
    confirmButton: 'px-4 py-2.5 rounded-xl font-medium',
    cancelButton: 'px-4 py-2.5 rounded-xl font-medium',
  },
  buttonsStyling: true,
};

/**
 * Destructive action confirmation (RTL-friendly, matches admin theme).
 * @returns {Promise<boolean>} true if user confirmed
 */
export async function confirmDelete(options = {}) {
  const {
    title = 'تأكيد الحذف',
    text = 'لن تتمكن من التراجع عن هذا الإجراء.',
    confirmButtonText = 'نعم، احذف',
    cancelButtonText = 'إلغاء',
  } = options;

  const res = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    ...rtlMixin,
  });
  return res.isConfirmed;
}

export async function confirmAction(options = {}) {
  const {
    title = 'تأكيد',
    text = '',
    icon = 'question',
    confirmButtonText = 'تأكيد',
    cancelButtonText = 'إلغاء',
  } = options;

  const res = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#875FD8',
    cancelButtonColor: '#64748b',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    ...rtlMixin,
  });
  return res.isConfirmed;
}
