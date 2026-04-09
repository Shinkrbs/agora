'use client';

import { useState, useMemo } from 'react';
import { PositionTemplate } from '@/types/database';
import { TemplateBuilderModal } from './TemplateBuilderModal';
import { TemplateCard } from './TemplateCard';
import { TemplatesHeader } from './TemplatesHeader';
import { mockPositionTemplates } from './mock-data';

type SortBy = 'name-asc' | 'date-desc';

export function PositionTemplatesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date-desc');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderData, setBuilderData] = useState<PositionTemplate | null>(null);

  // Filter and sort logic
  const filteredAndSortedTemplates = useMemo(() => {
    let templates = [...mockPositionTemplates];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter((template) =>
        template.name.toLowerCase().includes(query) ||
        template.positions.some((pos) =>
          pos.name.toLowerCase().includes(query)
        )
      );
    }

    // Sort
    if (sortBy === 'name-asc') {
      templates.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'date-desc') {
      templates.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
    }

    return templates;
  }, [searchQuery, sortBy]);

  const handleAddTemplate = () => {
    setBuilderData(null);
    setIsBuilderOpen(true);
  };

  const handleEditTemplate = (template: PositionTemplate) => {
    setBuilderData(template);
    setIsBuilderOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log(`Delete action initiated for template: ${templateId}`);
    // In a real app, this would trigger a deletion mutation
  };

  const handleCloseBuilder = (open: boolean) => {
    if (!open) {
      setBuilderData(null);
    }
    setIsBuilderOpen(open);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <TemplatesHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddTemplate={handleAddTemplate}
        />

        {/* Templates Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? 'No templates found matching your search.'
                : 'No position templates yet. Create your first one to get started.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddTemplate}
                className="text-primary hover:underline font-medium"
              >
                Create New Template
              </button>
            )}
          </div>
        )}
      </div>

      {/* Builder Modal */}
      <TemplateBuilderModal
        isOpen={isBuilderOpen}
        onOpenChange={handleCloseBuilder}
        initialData={builderData || undefined}
      />
    </div>
  );
}
