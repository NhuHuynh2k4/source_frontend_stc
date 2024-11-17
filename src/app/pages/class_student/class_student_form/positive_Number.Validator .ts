import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      // Kiểm tra nếu giá trị là số âm hoặc bằng 0
      if (value <= 0) {
        return { positiveNumber: true }; // Trả về lỗi nếu giá trị không hợp lệ
      }
      return null; // Nếu giá trị hợp lệ, không có lỗi
    };
  
  }