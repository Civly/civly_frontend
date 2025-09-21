import { CVCleanTemplate } from '../cv-templates/cv-clean-template'
import CVATSTemplate from '../cv-templates/cv-ats-template'
import { CvData } from '@/schemas/cv_data_schema'

export function ShowCVByTemplate({ cvData }: { cvData: CvData }) {
  console.log('cvData: ', cvData)
  let newCvData = {
    ...cvData,
    layoutConfigs: {
      templateId: 0,
      colorId: 0,
      fontId: 0,
      fontSizeId: 0,
    },
  }
  if(cvData.layoutConfigs){
    newCvData = cvData;
  }
  switch (newCvData.layoutConfigs?.templateId) {
    case 0: // Modern
      return (
        <>
          <CVCleanTemplate cvData={cvData} accentColor="text-blue-600" />
        </>
      )
    case 1: // Classic
      return (
        <>
          {/* TODO: insert Classic template here */}
        </>
      )
    case 2: // ATS
      return (
        <>
          <CVATSTemplate cvData={cvData} />
        </>
      )
    default:
      return (
        <>
          <CVCleanTemplate cvData={cvData} accentColor="text-blue-600" />
        </>
      )
  }
}
