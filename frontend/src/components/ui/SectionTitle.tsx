import { Text, TextProps } from "react-native";

interface SectionTitleProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Brukes til seksjonsoverskrifter i MovieDetails-skjermen:
 * f.eks. Description, User Reviews, Similar Titles, Cast, Where to Watch.
 * Gir konsistent typografi og spacing gjennom hele appen.
 */
export function SectionTitle({ children, className, ...rest }: SectionTitleProps) {
  return (
    <Text
      {...rest}
      className={`text-xl font-bold text-gray-900 mt-6 mb-3 ${className ?? ""}`}
    >
      {children}
    </Text>
  );
}
