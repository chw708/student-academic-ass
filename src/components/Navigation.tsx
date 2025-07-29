import { House, ListChecks, ChartBar, Gear } from '@phosphor-icons/react';
import { someFunction } from "../lib/utils";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'home', label: '홈', icon: House },
    { id: 'tasks', label: '할 일 입력', icon: ListChecks },
    { id: 'progress', label: '진도 현황', icon: ChartBar },
    { id: 'settings', label: '설정', icon: Gear },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
              currentPage === id
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon size={20} weight={currentPage === id ? 'fill' : 'regular'} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
