'use client'

import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import { ResumeGrid } from '@/components/custom/resume-grid'
import { createEmptyCv, deleteCv, shareCV } from '@/services/cv_data.service'
import { useRouter } from 'next/navigation'
import { CvData } from '@/schemas/cv_data_schema'
import { UserProfile } from '@/services/user-profile.service'

export default function Dashboard({cvs, user}:{cvs:CvData[], user: UserProfile}) {
  const router = useRouter()
  const handleCreateNew = () => {
    console.log('Create new resume')
    createEmptyCv().then(() =>
      router.refresh()
    )
  }

  const handleEditResume = (id: string) => {
    console.log('Edit resume:', id)
  }

  const handleShareResume = (id: string) => {
    console.log('Share resume:', id)
    shareCV(id)
  }

  const handleDuplicateResume = (id: string) => {
    console.log('Duplicate resume:', id)
  }

  const handleExportPdf = (id: string) => {
    console.log('Export PDF:', id)
  }

  const handleDeleteResume = (id: string) => {
    console.log('Delete resume:', id)
    deleteCv(id).then(() =>
      router.refresh())
  }

  const handleOpenResume = (id: string) => {
    console.log('Open resume:', id)
    router.push('/view/'+id)
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6 pb-3">
              <h1 className="text-2xl font-semibold text-foreground">
                Welcome back, {user?.name}! 👋
              </h1>
            </div>
            
            <SectionCards />
            <ResumeGrid
              resumes={Array.isArray(cvs) && cvs.map(cv => {return {
                id: cv.id!,
                title: cv.name!,
                lastEdited: cv.updated_at ?? 'never',
                previewImage: '/resume-2cols-thumbnail.svg'
              }})}
              onCreateNew={handleCreateNew}
              onEditResume={handleEditResume}
              onShareResume={handleShareResume}
              onDuplicateResume={handleDuplicateResume}
              onExportPdf={handleExportPdf}
              onDeleteResume={handleDeleteResume}
              onOpenResume={handleOpenResume}
            />
          </div>
        </div>
      </div>
    </>
  )
}
