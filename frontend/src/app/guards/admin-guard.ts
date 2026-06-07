import { CanActivateFn } from '@angular/router';
import { TokenStorageService } from '../core/token-storage';
import { inject } from '@angular/core';


export const adminGuard: CanActivateFn = (route, state) => {

  let tokenService= inject(TokenStorageService);
  let user=tokenService.getUser();
  if(!user?.is_admin) return false;
  return true;
};
