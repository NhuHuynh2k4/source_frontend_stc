// src/app/auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {CookieService} from "ngx-cookie-service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);  // Inject CookieService

  // Lấy token từ cookies
  const token = cookieService.get('token');

  if (token) {
    return true; // Cho phép truy cập route nếu token có
  } else {
    // Điều hướng về trang đăng nhập nếu không có token
    router.navigate(['/login']);
    return false;
  }
};
