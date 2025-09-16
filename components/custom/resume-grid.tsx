'use client'

import * as React from 'react'
import { ResumeCard } from './resume-card'

interface Resume {
  id: string
  title: string
  lastEdited: string
  previewImage?: string
}

interface ResumeGridProps {
  resumes?: Resume[] | false
  onCreateNew?: () => void
  onEditResume?: (id: string) => void
  onShareResume?: (id: string) => void
  onDuplicateResume?: (id: string) => void
  onExportPdf?: (id: string) => void
  onDeleteResume?: (id: string) => void
  onOpenResume?: (id: string) => void
}

export function ResumeGrid({
  resumes = [],
  onCreateNew,
  onEditResume,
  onShareResume,
  onDuplicateResume,
  onExportPdf,
  onDeleteResume,
  onOpenResume,
}: ResumeGridProps) {
  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Resumes</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <ResumeCard type="create" onClick={onCreateNew} />

        {resumes && resumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            type="resume"
            title={resume.title}
            lastEdited={resume.lastEdited}
            previewImage={resume.previewImage}
            onClick={() => onOpenResume?.(resume.id)}
            onEdit={() => onEditResume?.(resume.id)}
            onShare={() => onShareResume?.(resume.id)}
            onDuplicate={() => onDuplicateResume?.(resume.id)}
            onExportPdf={() => onExportPdf?.(resume.id)}
            onDelete={() => onDeleteResume?.(resume.id)}
          />
        ))}
      </div>
    </div>
  )
}
