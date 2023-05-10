/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue-demi';
  const component: DefineComponent;
  export default component;
}
