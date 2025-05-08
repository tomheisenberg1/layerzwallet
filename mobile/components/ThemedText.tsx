import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { Typography } from '../../shared/constants/Typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'headline' | 'subHeadline' | 'paragraph';
};

export function ThemedText({ style, lightColor, darkColor, type = 'default', ...rest }: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let typographyStyle: any[] = [];
  switch (type) {
    case 'headline':
    case 'title':
      typographyStyle = [Typography.headline];
      break;
    case 'subHeadline':
    case 'subtitle':
      typographyStyle = [Typography.subHeadline];
      break;
    case 'paragraph':
    case 'default':
      typographyStyle = [Typography.paragraph];
      break;
    case 'defaultSemiBold':
      typographyStyle = [Typography.paragraph, { fontWeight: '700' }];
      break;
    case 'link':
      typographyStyle = [Typography.paragraph, { color: '#0a7ea4', lineHeight: 30 }];
      break;
    default:
      typographyStyle = [Typography.paragraph];
  }

  return <Text style={[{ color }, ...typographyStyle, style]} {...rest} />;
}
