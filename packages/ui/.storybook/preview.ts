// ── Storybook preview — global decorators & parameters ──────────────
import type { Preview } from '@storybook/react';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark', value: '#333333' },
      ],
    },
    layout: 'padded',
  },

  decorators: [
    // Wrapper provides a flex container so the Timeline's fitContainer
    // (flex:1) can stretch. overflowY:auto enables vertical scrolling
    // when content is taller than 500px; overflowX:hidden keeps the
    // Timeline's date-shift horizontal scroll from conflicting.
    (Story) =>
      React.createElement('div', {
        style: {
          width: '100%',
          maxWidth: 1100,
          height: 500,
          border: '1px solid #e0e0e0',
          borderRadius: 6,
          overflowX: 'hidden',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }, React.createElement(Story)),
  ],
};

export default preview;
