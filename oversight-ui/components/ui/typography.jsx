/**
 * Reusable Typography Components
 * Using semantic font tokens for consistent typography throughout the app
 */

import { cn } from "@/lib/utils";

// Page Headlines - Use Outfit (font-display)
export const Heading = ({ children, className, level = 1, ...props }) => {
  const Component = `h${level}`;
  const baseClasses = "font-display font-semibold text-stone-900";
  
  const levelClasses = {
    1: "text-4xl sm:text-5xl",
    2: "text-2xl sm:text-3xl",
    3: "text-xl sm:text-2xl",
    4: "text-lg sm:text-xl",
    5: "text-base sm:text-lg",
    6: "text-sm sm:text-base",
  };
  
  return (
    <Component 
      className={cn(baseClasses, levelClasses[level], className)} 
      {...props}
    >
      {children}
    </Component>
  );
};

// Section Headers - Use Outfit (font-display)
export const SectionHeader = ({ children, className, ...props }) => (
  <h2 className={cn("font-display text-xl font-semibold text-stone-900", className)} {...props}>
    {children}
  </h2>
);

// Body Text - Use Inter (font-ui)
export const BodyText = ({ children, className, size = "base", ...props }) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm", 
    base: "text-base",
    lg: "text-lg",
  };
  
  return (
    <p className={cn("font-ui text-stone-700", sizeClasses[size], className)} {...props}>
      {children}
    </p>
  );
};

// Metadata / System Text - Use IBM Plex Mono (font-mono)
export const Meta = ({ children, className, ...props }) => (
  <span className={cn("font-mono text-xs text-stone-500", className)} {...props}>
    {children}
  </span>
);

// Code / Tags - Use IBM Plex Mono (font-mono)
export const Code = ({ children, className, ...props }) => (
  <code className={cn("font-mono text-sm bg-stone-100 px-2 py-1 rounded", className)} {...props}>
    {children}
  </code>
);

// Quote Text - Use Inter (font-ui) with italic
export const Quote = ({ children, className, ...props }) => (
  <blockquote className={cn("font-ui italic text-stone-600 border-l-4 border-stone-300 pl-4", className)} {...props}>
    "{children}"
  </blockquote>
);

// Button Text - Use Inter (font-ui)
export const ButtonText = ({ children, className, ...props }) => (
  <span className={cn("font-ui font-medium", className)} {...props}>
    {children}
  </span>
);

// Card Title - Use Outfit (font-display)
export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn("font-display font-semibold text-stone-900", className)} {...props}>
    {children}
  </h3>
);

// Card Description - Use Inter (font-ui)
export const CardDescription = ({ children, className, ...props }) => (
  <p className={cn("font-ui text-stone-600 text-sm", className)} {...props}>
    {children}
  </p>
);

// Label Text - Use IBM Plex Mono (font-mono)
export const Label = ({ children, className, ...props }) => (
  <label className={cn("font-mono text-xs uppercase tracking-wide text-stone-500 font-medium", className)} {...props}>
    {children}
  </label>
);