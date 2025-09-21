'use client'

import React, { useState, useEffect, useRef, ReactNode } from 'react'
import { formatDate } from '@/utils/date-formatting'
import { getLinkedInUsername, getXingUsername } from '@/utils/cv-utils'
import {
  IconPhone,
  IconMail,
  IconGlobe,
  IconBrandLinkedin,
  IconBrandXing,
} from '@tabler/icons-react'
import { CvData } from '@/schemas/cv_data_schema'
import { ColorRecord } from '@/types/colorType'

// --- Layout Constants ---
const A4_PAGE_HEIGHT_PX = 1123 // Fixed height of an A4 page at 96 DPI
const PAGE_PADDING_Y_PX = 96 // p-12 top (48px) + p-12 bottom (48px)
const USABLE_PAGE_HEIGHT = A4_PAGE_HEIGHT_PX - PAGE_PADDING_Y_PX

// --- Visual Page Component ---
// This is a simple presentational component that styles each page wrapper.
function Page({ children }: { children: ReactNode }) {
  return (
    <div
      className="bg-white shadow-lg mx-auto overflow-hidden"
      style={{
        width: '794px',
        height: `${A4_PAGE_HEIGHT_PX}px`,
        padding: '48px',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      {children}
    </div>
  )
}

// --- Main Template Component with Pagination Logic ---
export default function CVATSTemplate({ cvData }: { cvData: CvData }) {
  const color = ColorRecord[cvData.layoutConfigs.colorId]
  const [accentColor, setAccentColor] = useState(color.class)
  // State to hold the final, paginated content. Each inner array is a page.
  const [paginatedPages, setPaginatedPages] = useState<ReactNode[][]>([[]])
  // Ref for the hidden container used to measure the raw content.
  const measurementContainerRef = useRef<HTMLDivElement>(null)
  // State to prevent showing the final layout until calculation is complete.
  const [isCalculating, setIsCalculating] = useState(true)

  // This effect performs the measurement and distribution logic whenever the CV data changes.
  useEffect(() => {
    setAccentColor(color.class)
    setIsCalculating(true)

    const measureAndPaginate = () => {
      const container = measurementContainerRef.current
      if (!container) return

      const contentBlocks = Array.from(container.children) as HTMLElement[]
      const newPages: ReactNode[][] = []
      let currentPageContent: ReactNode[] = []
      let currentPageHeight = 0

      const originalJsxNodes = CVContent({ cvData, accentColor })

      contentBlocks.forEach((block, index) => {
        // Correct measurement including vertical margins for accurate layout calculation.
        const style = window.getComputedStyle(block)
        const marginTop = parseInt(style.marginTop, 10) || 0
        const marginBottom = parseInt(style.marginBottom, 10) || 0
        const blockHeight = block.offsetHeight + marginTop + marginBottom

        const blockJsx = originalJsxNodes[index]

        // Widow/Orphan Control: Prevent a section title from being the last item on a page.
        const isSectionTitle = block.tagName === 'H3'
        const nextBlock = contentBlocks[index + 1]
        const nextBlockHeight = nextBlock
          ? nextBlock.offsetHeight +
            parseInt(window.getComputedStyle(nextBlock).marginBottom, 10)
          : 0

        if (
          isSectionTitle &&
          currentPageHeight + blockHeight + nextBlockHeight >
            USABLE_PAGE_HEIGHT &&
          currentPageContent.length > 0
        ) {
          newPages.push(currentPageContent)
          currentPageContent = [blockJsx]
          currentPageHeight = blockHeight
          return
        }

        // Standard pagination logic: if the block doesn't fit, create a new page.
        if (
          currentPageHeight + blockHeight > USABLE_PAGE_HEIGHT &&
          currentPageContent.length > 0
        ) {
          newPages.push(currentPageContent)
          currentPageContent = [blockJsx]
          currentPageHeight = blockHeight
        } else {
          currentPageContent.push(blockJsx)
          currentPageHeight += blockHeight
        }
      })

      if (currentPageContent.length > 0) {
        newPages.push(currentPageContent)
      }

      setPaginatedPages(newPages)
      setIsCalculating(false)
    }

    const timer = setTimeout(measureAndPaginate, 50)
    return () => clearTimeout(timer)
  }, [cvData, accentColor])

  return (
    <div>
      {/* 1. Hidden Renderer for Measurement */}
      <div
        ref={measurementContainerRef}
        className="absolute opacity-0 -z-10 w-[702px]"
      >
        {CVContent({ cvData, accentColor })}
      </div>

      {/* 2. Visible Renderer for Calculated Pages */}
      {isCalculating ? (
        <Page>
          <div>Calculating layout...</div>
        </Page>
      ) : (
        <div>
          {paginatedPages.map((pageChildren, pageIndex) => (
            <Page key={pageIndex}>{pageChildren}</Page>
          ))}
        </div>
      )}
    </div>
  )
}

// --- CV Content Component ---
// CRUCIAL REFACTOR: This function now builds and returns a FLAT ARRAY of JSX elements.
// Every logical block (headers, titles, paragraphs, list items) is a separate element in the array.
function CVContent({ cvData, accentColor }: { cvData: CvData, accentColor: string }): ReactNode[] {
  const blocks: ReactNode[] = []

  // Block 1: Header (Name & Title)
  blocks.push(
    <div key="header" className="pb-1 mb-4">
      <h1 className={`text-4xl font-bold ${accentColor} mb-2 tracking-wide`}>
        {cvData.personalInformation?.name?.toUpperCase()}{' '}
        {cvData.personalInformation?.surname?.toUpperCase()}
      </h1>
      <h2 className="text-lg font-normal text-gray-800 tracking-wide">
        {cvData.personalInformation?.professionalTitle
          ? cvData.personalInformation.professionalTitle.toUpperCase()
          : ''}
      </h2>
    </div>,
  )

  // Block 2: Contact Info (Single Line)
  blocks.push(
    <div
      key="contact-info"
      className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-700 mb-4"
    >
      {cvData.personalInformation?.phone && (
        <div className="flex items-center gap-1.5">
          <IconPhone size={14} />
          <span>{cvData.personalInformation.phone}</span>
        </div>
      )}
      {cvData.personalInformation?.email && (
        <div className="flex items-center gap-1.5">
          <IconMail size={14} />
          <span>{cvData.personalInformation.email}</span>
        </div>
      )}
      {cvData.personalInformation?.website && (
        <div className="flex items-center gap-1.5">
          <IconGlobe size={14} />
          <span>
            {cvData.personalInformation.website.replace(/https?:\/\//, '')}
          </span>
        </div>
      )}
      {cvData.personalInformation?.linkedin && (
        <div className="flex items-center gap-1.5">
          <IconBrandLinkedin size={14} />
          <span>
            {getLinkedInUsername(cvData.personalInformation.linkedin)}
          </span>
        </div>
      )}
      {cvData.personalInformation?.xing && (
        <div className="flex items-center gap-1.5">
          <IconBrandXing size={14} />
          <span>{getXingUsername(cvData.personalInformation.xing)}</span>
        </div>
      )}
    </div>,
  )

  // Block 3: Summary
  if (cvData.personalInformation?.summary) {
    blocks.push(
      <div key="summary" className="mb-8">
        <p className="text-sm text-gray-800 leading-relaxed">
          {cvData.personalInformation.summary}
        </p>
      </div>,
    )
  }

  // Experience Blocks
  if (Array.isArray(cvData.experience) && cvData.experience.length > 0) {
    blocks.push(
      <h3
        key="exp-title"
        className={`text-sm font-bold ${accentColor} tracking-wide border-b border-blue-200 pb-1 mb-4`}
      >
        EXPERIENCE
      </h3>,
    )
    cvData.experience.forEach((exp) => {
      blocks.push(
        <div
          key={`${exp.company}-${exp.role}-${exp.startDate}-header`}
          className="flex justify-between items-start mb-2"
        >
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900 mb-1">{exp.role}</h4>
            <div className="text-sm text-gray-700">{exp.company}</div>
          </div>
          <div className="text-sm text-gray-600 font-medium ml-4 text-right">
            {exp.startDate
              ? formatDate(new Date(exp.startDate), 'MMM yyyy')
              : 'N/A'}{' '}
            -{' '}
            {exp.currentlyWorkingHere
              ? 'Present'
              : exp.endDate
              ? formatDate(new Date(exp.endDate), 'MMM yyyy')
              : 'Present'}
            {exp.location && (
              <>
                <br />
                {exp.location}
              </>
            )}
          </div>
        </div>,
      )
      if (exp.description) {
        exp.description
          .split('\n')
          .filter((p) => p.trim() !== '')
          .forEach((paragraph, pIndex) => {
            blocks.push(
              <p
                key={`${exp.company}-${exp.role}-${exp.startDate}-p-${pIndex}`}
                className="text-sm text-gray-700 leading-relaxed mb-4"
              >
                {paragraph}
              </p>,
            )
          })
      }
    })
  }

  // Education Blocks
  if (Array.isArray(cvData.education) && cvData.education.length > 0) {
    blocks.push(
      <h3
        key="edu-title"
        className={`text-base font-bold ${accentColor} tracking-wide border-b border-blue-200 pb-1 mb-4`}
      >
        EDUCATION
      </h3>,
    )
    cvData.education.forEach((edu) => {
      blocks.push(
        <div key={edu.degree} className="mb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                {edu.degree}
              </h4>
              <div className="text-sm text-gray-700">{edu.institution}</div>
            </div>
            <div className="text-sm text-gray-600 font-medium ml-4 text-right">
              {edu.startDate ? formatDate(new Date(edu.startDate)) : 'N/A'} -{' '}
              {edu.currentlyStudyingHere
                ? 'Present'
                : edu.endDate
                ? formatDate(new Date(edu.endDate))
                : 'Present'}
              {edu.location && (
                <>
                  <br />
                  {edu.location}
                </>
              )}
            </div>
          </div>
        </div>,
      )
    })
  }

  // Skills Blocks
  if (Array.isArray(cvData.skillGroups) && cvData.skillGroups.length > 0) {
    blocks.push(
      <h3
        key="skills-title"
        className={`text-base font-bold ${accentColor} tracking-wide border-b border-blue-200 pb-1 mb-4`}
      >
        SKILLS
      </h3>,
    )
    cvData.skillGroups.forEach((skillGroup) => {
      blocks.push(
        <div key={skillGroup.name} className="mb-3">
          <h4 className={`text-sm font-bold ${accentColor} mb-1 tracking-wide`}>
            {(skillGroup.name ?? '').toUpperCase()}
          </h4>
          <div className="text-sm text-gray-700">
            {skillGroup.skills?.map((skill, skillIndex) => (
              <span key={skill.name}>
                {skill.name}
                {skillIndex < (skillGroup.skills?.length || 0) - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>,
      )
    })
  }

  return blocks
}
