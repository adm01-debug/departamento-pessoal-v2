/** Tipos de UI */

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Variant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';

export type ColorScheme = 'light' | 'dark' | 'system';

export interface Position { x: number; y: number; }

export interface Dimensions { width: number; height: number; }

export interface Rect extends Position, Dimensions {}

export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

export interface MenuItem { id: string; label: string; icon?: React.ComponentType; href?: string; onClick?: () => void; disabled?: boolean; children?: MenuItem[]; }

export interface BreadcrumbItem { label: string; href?: string; }

export interface TabItem { id: string; label: string; content: React.ReactNode; disabled?: boolean; }

export interface Column<T> { key: keyof T; header: string; width?: number | string; sortable?: boolean; render?: (value: T[keyof T], row: T) => React.ReactNode; }

export type SortDirection = 'asc' | 'desc';

export interface SortConfig { key: string; direction: SortDirection; }
