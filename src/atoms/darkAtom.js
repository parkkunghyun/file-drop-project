import { atom } from 'recoil';

export const darkModeState = atom({
    key: 'darkModeState',
    default: false, // 기본값은 라이트모드
});

