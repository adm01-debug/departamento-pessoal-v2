import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoizedList } from '@/components/performance/MemoizedList';
const mockItems = [{ id: '1', label: 'A' }, { id: '2', label: 'B' }];
describe('MemoizedList', () => { it('renderiza lista', () => { render(<MemoizedList items={mockItems} renderItem={(item) => <div key={item.id}>{item.label}</div>} />); expect(screen.getByText('A')).toBeInTheDocument(); }); });
