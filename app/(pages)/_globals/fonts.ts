import { Fredoka, Nunito } from 'next/font/google';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
});

const fonts = [fredoka, nunito];

const font_string = fonts.map((font) => font.variable).join(' ');
export default font_string;
