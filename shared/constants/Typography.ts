type TextStyle = {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'light' | 'normal' | 'bold' | string;
  lineHeight?: number;
  letterSpacing?: number;
};

const fontFamily = {
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
  black: 'Inter-Black',
};

export const Typography: Record<string, TextStyle> = {
  headline: {
    fontFamily: fontFamily.light,
    fontSize: 32,
    fontWeight: 'light',
    lineHeight: 40,
    letterSpacing: 0.2,
  },
  subHeadline: {
    fontFamily: fontFamily.regular,
    fontSize: 20,
    fontWeight: 'normal',
    lineHeight: 28,
    letterSpacing: 0.1,
  },
  paragraph: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    letterSpacing: 0.05,
  },
};
