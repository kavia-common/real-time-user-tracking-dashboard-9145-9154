export const theme = {
  /** Ocean Professional design tokens (WCAG-conscious surfaces + focus rings). */
  colors: {
    primary: "#2563EB",
    primaryTextOn: "#FFFFFF",
    secondary: "#F59E0B",
    secondaryTextOn: "#111827",
    success: "#10B981",
    successTextOn: "#06281e",
    error: "#EF4444",
    errorTextOn: "#FFFFFF",

    background: "#F9FAFB",
    surface: "#FFFFFF",
    surfaceSubtle: "#F3F4F6",

    text: "#111827",
    mutedText: "#4B5563", // slightly darker than previous for better contrast on white
    border: "#E5E7EB",

    // Focus ring optimized for visibility on light surfaces
    focusRing: "rgba(37, 99, 235, 0.35)",

    // Skeleton
    skeletonBase: "rgba(17, 24, 39, 0.08)",
    skeletonShine: "rgba(17, 24, 39, 0.14)",
  },

  typography: {
    fontFamily:
      '"Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    monoFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    titleTracking: "-0.02em",
  },

  radius: {
    sm: "10px",
    md: "14px",
    pill: "999px",
  },

  shadow: {
    sm: "0 1px 2px rgba(17, 24, 39, 0.08)",
    md: "0 10px 20px rgba(17, 24, 39, 0.10)",
  },

  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "14px",
    5: "18px",
    6: "24px",
  },

  layout: {
    topNavHeight: "64px",
    sidebarWidth: "300px",
    progressWidth: "320px",
    gap: "14px",
    panelHeaderHeight: "72px",
    minMapHeightDesktop: "520px",
  },

  breakpoint: {
    tablet: "1100px",
    mobile: "820px",
  },
};

export const THEME_CSS_VARS = `
  :root {
    --color-primary: ${theme.colors.primary};
    --color-primaryTextOn: ${theme.colors.primaryTextOn};
    --color-secondary: ${theme.colors.secondary};
    --color-secondaryTextOn: ${theme.colors.secondaryTextOn};
    --color-success: ${theme.colors.success};
    --color-error: ${theme.colors.error};

    --color-bg: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-surfaceSubtle: ${theme.colors.surfaceSubtle};

    --color-text: ${theme.colors.text};
    --color-muted: ${theme.colors.mutedText};
    --color-border: ${theme.colors.border};

    --shadow-sm: ${theme.shadow.sm};
    --shadow-md: ${theme.shadow.md};

    --radius-sm: ${theme.radius.sm};
    --radius: ${theme.radius.md};

    --space-1: ${theme.spacing[1]};
    --space-2: ${theme.spacing[2]};
    --space-3: ${theme.spacing[3]};
    --space-4: ${theme.spacing[4]};
    --space-5: ${theme.spacing[5]};
    --space-6: ${theme.spacing[6]};

    --focus-ring: 0 0 0 3px ${theme.colors.focusRing};

    --layout-topNavHeight: ${theme.layout.topNavHeight};
    --layout-sidebarWidth: ${theme.layout.sidebarWidth};
    --layout-progressWidth: ${theme.layout.progressWidth};
    --layout-gap: ${theme.layout.gap};
    --layout-panelHeaderHeight: ${theme.layout.panelHeaderHeight};
    --layout-minMapHeightDesktop: ${theme.layout.minMapHeightDesktop};

    --grad-app: linear-gradient(135deg, rgba(37, 99, 235, 0.10), var(--color-bg) 55%);
  }
`;
