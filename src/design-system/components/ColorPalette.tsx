
// Color palette preview component for development
// Helps developers visualize the complete color system

import * as React from 'react';
import { colorTokens, colorCategories } from '../tokens/colors';
import { Typography } from '../atoms/Typography';
import { Stack } from '../atoms/Stack';
import { Container } from '../atoms/Container';

interface ColorSwatchProps {
  color: string;
  name: string;
  scale?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, name, scale }) => (
  <div className="flex flex-col items-center space-y-2">
    <div
      className="w-16 h-16 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700"
      style={{ backgroundColor: color }}
      title={`${name}${scale ? ` ${scale}` : ''}: ${color}`}
    />
    <div className="text-center">
      <Typography variant="small" className="font-medium">
        {name}
      </Typography>
      {scale && (
        <Typography variant="caption" color="muted">
          {scale}
        </Typography>
      )}
    </div>
  </div>
);

interface ColorCategoryProps {
  title: string;
  colors: Record<string, string | Record<string, string>>;
}

const ColorCategory: React.FC<ColorCategoryProps> = ({ title, colors }) => (
  <div className="space-y-4">
    <Typography variant="sectionHeader">{title}</Typography>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
      {Object.entries(colors).map(([key, value]) => {
        if (typeof value === 'string') {
          return (
            <ColorSwatch
              key={key}
              color={value}
              name={key}
            />
          );
        }
        
        // Handle nested color objects
        return Object.entries(value).map(([scale, colorValue]) => (
          <ColorSwatch
            key={`${key}-${scale}`}
            color={colorValue}
            name={key}
            scale={scale}
          />
        ));
      })}
    </div>
  </div>
);

export const ColorPalette: React.FC = () => {
  return (
    <Container size="full" className="py-8">
      <Stack direction="column" gap={12}>
        <div className="text-center space-y-4">
          <Typography variant="pageTitle">Design System Color Palette</Typography>
          <Typography variant="lead" color="muted">
            Low-cognitive-strain colors optimized for premium appearance
          </Typography>
        </div>

        <ColorCategory title="Base Colors" colors={colorCategories.base} />
        <ColorCategory title="Neutral Scale" colors={colorCategories.neutral} />
        <ColorCategory title="Brand Colors" colors={colorCategories.brand} />
        <ColorCategory title="Semantic Colors" colors={colorCategories.semantic} />
        <ColorCategory title="Accent Colors" colors={colorCategories.accent} />
        
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <Typography variant="subsectionHeader" className="mb-4">Theme Colors</Typography>
          <Typography variant="body" color="muted">
            Theme colors are CSS variables that automatically adapt to light/dark mode.
            They are defined in your CSS and reference the appropriate color tokens.
          </Typography>
        </div>
      </Stack>
    </Container>
  );
};

export default ColorPalette;
