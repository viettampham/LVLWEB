import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Quanlynhanvien } from './quanlynhanvien/quanlynhanvien';
import { CartonCounter } from './carton-counter/carton-counter';
import { Storage } from './storage/storage';
import { Photo } from './photo/photo';
import { News } from './news/news';
import { Dailycheck } from './dailycheck/dailycheck';
import { Mobilecheck } from './mobilecheck/mobilecheck';
import { Hisdaily } from './hisdaily/hisdaily';
import { Ctpatcre } from './ctpatcre/ctpatcre';
import { Dangkynghiphep } from './dangkynghiphep/dangkynghiphep';
import { Listleave } from './listleave/listleave';
import { Approveleave } from './approveleave/approveleave';
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
      },{
        path: 'quanlytintuc',
        component: News,
      },
      {
        path: 'dailycheck',
        component: Dailycheck,
      },
      {
        path: 'mobilecheck',
        component: Mobilecheck,
      },
      {
        path: 'hisdaily',
        component: Hisdaily,
      },
      {
        path: 'ctpat-criteria',
        component: Ctpatcre,
      },
      {
        path: 'dangkinghiphep',
        component: Dangkynghiphep,
      },
      {
        path: 'danhsachphieu',
        component: Listleave,
      },
      {
        path: 'pheduyetnghiphep',
        component: Approveleave,
      },
    ],
  },
  {
    path: '',
    component: Login,
  },
];
