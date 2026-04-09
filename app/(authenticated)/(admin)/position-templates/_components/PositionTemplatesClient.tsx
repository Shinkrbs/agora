'use client';

import { useState, useMemo, useEffect } from 'react';
import { PositionTemplate } from '@/types/database';
import { TemplateBuilderModal } from './TemplateBuilderModal';
import { TemplateCard } from './TemplateCard';
import { TemplatesHeader } from './TemplatesHeader';
import { DeleteTemplateModal } from './DeleteTemplateModal';
import { useCurrentOrganization } from '../../_components/OrganizationContext';
import { toast } from 'sonner';
import { fetchPositionTemplatesAction } from '../_actions/fetch-position-templates-action';
import { createPositionTemplate } from '../_actions/create-position-template';
import { Button } from '@/components/ui/button';

type SortBy = 'name-asc' | 'date-desc';

export function PositionTemplatesClient() {
  const [positionTemplates, setPositionTemplates] = useState<PositionTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date-desc');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderData, setBuilderData] = useState<PositionTemplate | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string>('');
  const [deleteTemplateName, setDeleteTemplateName] = useState<string>('');
  const organization = useCurrentOrganization();

  const handleFetchPositionTemplates = async () => {
    if (!organization) {
      toast.error("No organization selected. Please select an organization to view its position templates.");
      setPositionTemplates([]);
      return;
    }

    try {
      const response = await fetchPositionTemplatesAction(organization.id);
      setPositionTemplates(response.data ?? []);
    } catch (error) {
      console.error('Error fetching position templates:', error);
      setPositionTemplates([]);
      toast.error("Failed to fetch position templates.");
    }
  };

  useEffect(() => {
    handleFetchPositionTemplates();
  }, [organization]);

  // Filter and sort logic
  const filteredAndSortedTemplates = useMemo(() => {
    let templates = [...positionTemplates];

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
  }, [positionTemplates, searchQuery, sortBy]);

  const handleAddTemplate = () => {
    setBuilderData(null);
    setIsBuilderOpen(true);
  };

  const handleEditTemplate = (template: PositionTemplate) => {
    setBuilderData(template);
    setIsBuilderOpen(true);
  };

  const handleDuplicateTemplate = async (template: PositionTemplate) => {
    try {
      const duplicateData = {
        name: `${template.name} - Copy`,
        positions: template.positions,
        organization_id: organization?.id || '',
      };

      const result = await createPositionTemplate(organization?.id || '', duplicateData);

      if (!result.success) {
        toast.error(result.error || 'Failed to duplicate template');
        return;
      }

      toast.success(`Template duplicated as "${duplicateData.name}"`);
      handleFetchPositionTemplates();
    } catch (error) {
      toast.error((error as Error).message || 'An unexpected error occurred');
    }
  };

  const handleDeleteTemplate = (template: PositionTemplate) => {
    setDeleteTemplateId(template.id);
    setDeleteTemplateName(template.name);
    setIsDeleteOpen(true);
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
              onDuplicate={handleDuplicateTemplate}
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
              <Button
                type="button"
                onClick={handleAddTemplate}
                className="text-primary hover:underline font-medium"
              >
                Create New Template
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Builder Modal */}
      <TemplateBuilderModal
        templates={positionTemplates}
        isOpen={isBuilderOpen}
        onOpenChange={handleCloseBuilder}
        initialData={builderData || undefined}
        organizationId={organization?.id || ''}
        onSave={handleFetchPositionTemplates}
      />

      {/* Delete Modal */}
      <DeleteTemplateModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        templateId={deleteTemplateId}
        templateName={deleteTemplateName}
        onDelete={handleFetchPositionTemplates}
      />
    </div>
  );
}
