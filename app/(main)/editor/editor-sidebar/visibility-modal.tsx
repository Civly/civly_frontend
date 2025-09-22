// components/editor/VisibilityModal.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

// --- Prop Types ---
interface VisibilityModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  visibility: 'Public' | 'Private' | 'Draft'
  password: string | null
  onVisibilityChange: (
    visibility: 'Public' | 'Private' | 'Draft',
    password?: string | null,
  ) => void
}

// --- The Component ---
export function VisibilityModal({
  isOpen,
  onOpenChange,
  visibility,
  password,
  onVisibilityChange,
}: VisibilityModalProps) {
  const { toast } = useToast()
  const [passwordInput, setPasswordInput] = useState<string>('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [localVisibility, setLocalVisibility] = useState(visibility)

  // Sync local state if the external props change
  useEffect(() => {
    setPasswordInput(password ?? '')
    setLocalVisibility(visibility)
  }, [password, visibility])

  const handleSaveChanges = () => {
    console.log('VisibilityModal - handleSaveChanges called:', {
      localVisibility,
      passwordInput,
    })

    if (localVisibility === 'Private') {
      if (!passwordInput) {
        toast.error('Password is required for private resumes.')
        return
      }
      console.log(
        'VisibilityModal - calling onVisibilityChange with Private + password',
      )
      onVisibilityChange('Private', passwordInput)
    } else {
      console.log(
        'VisibilityModal - calling onVisibilityChange with:',
        localVisibility,
      )
      onVisibilityChange(localVisibility)
    }
    onOpenChange(false)
    toast.success('Visibility settings saved')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">
            Visibility Settings
          </DialogTitle>
          <DialogDescription>
            Control who can access your online resume.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <RadioGroup
            value={localVisibility}
            onValueChange={(value: 'Draft' | 'Public' | 'Private') =>
              setLocalVisibility(value)
            }
            className="space-y-4"
          >
            {/* Draft Option */}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Draft" id="draft" />
              <div className="flex-1">
                <Label htmlFor="draft" className="font-semibold cursor-pointer">
                  Draft
                </Label>
                <p className="text-sm text-muted-foreground">
                  Not published. Only you can see this CV.
                </p>
              </div>
            </div>

            {/* Public Option */}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Public" id="public" />
              <div className="flex-1">
                <Label
                  htmlFor="public"
                  className="font-semibold cursor-pointer"
                >
                  Public
                </Label>
                <p className="text-sm text-muted-foreground">
                  Anyone on the internet with the link can view.
                </p>
              </div>
            </div>

            {/* Private Option */}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Private" id="private" />
              <div className="flex-1">
                <Label
                  htmlFor="private"
                  className="font-semibold cursor-pointer"
                >
                  Private (Password Required)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Only people with the password can view.
                </p>
              </div>
            </div>
          </RadioGroup>

          {localVisibility === 'Private' && (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-2">
              <Label htmlFor="password-input" className="font-semibold">
                Require Password
              </Label>
              <p className="text-sm text-muted-foreground">
                A password is required to view this private resume.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  id="password-input"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={passwordInput ?? ''}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter a strong password"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <IconEyeOff size={16} />
                  ) : (
                    <IconEye size={16} />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              console.log(
                'SAVE BUTTON CLICKED - about to call handleSaveChanges',
              )
              handleSaveChanges()
            }}
          >
            Save and Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
