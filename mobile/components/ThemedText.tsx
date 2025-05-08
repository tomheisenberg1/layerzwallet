import { Text, type TextProps, type TextStyle } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { Typography } from '../../shared/constants/Typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'headline' | 'subHeadline' | 'paragraph';
};

export function ThemedText({ style, lightColor, darkColor, type = 'default', ...rest }: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Map type prop to Typography styles
  let typographyStyle: TextStyle | (TextStyle | undefined)[];
  switch (type) {
    case 'headline':
    case 'title':
      typographyStyle = { ...(Typography.headline as TextStyle) };
      break;
    case 'subHeadline':
    case 'subtitle':
      typographyStyle = { ...(Typography.subHeadline as TextStyle) };
      break;
    case 'paragraph':
    case 'default':
      typographyStyle = { ...(Typography.paragraph as TextStyle) };
      break;
    case 'defaultSemiBold':
      typographyStyle = [{ ...(Typography.paragraph as TextStyle) }, { fontWeight: '700' }];
      break;
    case 'link':
      typographyStyle = [{ ...(Typography.paragraph as TextStyle) }, { color: '#0a7ea4', lineHeight: 30 }];
      break;
    default:
      typographyStyle = { ...(Typography.paragraph as TextStyle) };
  }

  return <Text style={[{ color }, typographyStyle, style]} {...rest} />;
}
