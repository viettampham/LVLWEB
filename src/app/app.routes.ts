import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Quanlynhanvien } from './quanlynhanvien/quanlynhanvien';
import { CartonCounter } from './carton-counter/carton-counter';
import { Storage } from './storage/storage';
import { Photo } from './photo/photo';
export const routes: Routes = [
  {
    path: 'home',
    component: Home,
    children: [
      {
        path: 'quanlynhanvien',
        component: Quanlynhanvien,
      },
      {
        path: 'demthungcarton',
        component: CartonCounter,
      },
      {
        path: 'luutruanh',
        component: Storage,
      },
      {
        path: 'takephotocont',
        component: Photo,
      },
    ],
  },
  {
    path: '',
    component: Login,
  },
];
