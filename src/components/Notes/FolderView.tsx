/**
 * FolderView - Component for creating and managing folders
 */

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { 
  Folder,
  BookOpen,
  Shield,
  Brain,
  Code,
  Globe,
  Lock,
  Zap,
  Heart,
  Star
} from 'lucide-react'

interface FolderViewProps {
  onSave: (name: string, color: string, icon?: string) => void
  onCancel: () => void
  folder?: {
    id: string
    name: string
    color?: string
    icon?: string
  }
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6B7280', // Gray
]

const PRESET_ICONS = [
  { name: 'Folder', icon: Folder, label: 'General' },
  { name: 'BookOpen', icon: BookOpen, label: 'Study' },
  { name: 'Shield', icon: Shield, label: 'Security' },
  { name: 'Brain', icon: Brain, label: 'AI/ML' },
  { name: 'Code', icon: Code, label: 'Programming' },
  { name: 'Globe', icon: Globe, label: 'Web' },
  { name: 'Lock', icon: Lock, label: 'Private' },
  { name: 'Zap', icon: Zap, label: 'Quick Notes' },
  { name: 'Heart', icon: Heart, label: 'Favorites' },
  { name: 'Star', icon: Star, label: 'Important' },
]

export function FolderView({ onSave, onCancel, folder }: FolderViewProps) {
  const [name, setName] = useState(folder?.name || '')
  const [selectedColor, setSelectedColor] = useState(folder?.color || '#3B82F6')
  const [selectedIcon, setSelectedIcon] = useState(folder?.icon || 'Folder')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      return
    }
    onSave(name.trim(), selectedColor, selectedIcon)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Folder Name */}
      <div className="space-y-2">
        <Label htmlFor="folder-name">Folder Name</Label>
        <Input
          id="folder-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter folder name..."
          className="w-full"
          autoFocus
        />
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <Label>Choose Color</Label>
        <div className="grid grid-cols-5 gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                selectedColor === color
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border hover:border-primary'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>

      {/* Icon Selection */}
      <div className="space-y-3">
        <Label>Choose Icon</Label>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_ICONS.map(({ name, icon: IconComponent, label }) => (
            <button
              key={name}
              type="button"
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 flex flex-col items-center gap-1 ${
                selectedIcon === name
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary'
              }`}
              onClick={() => setSelectedIcon(name)}
              title={label}
            >
              <IconComponent className="w-5 h-5" style={{ color: selectedColor }} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 rounded-lg bg-muted/50 border">
        <h4 className="text-sm font-medium mb-2">Preview</h4>
        <div className="flex items-center gap-3">
          {React.createElement(
            PRESET_ICONS.find(i => i.name === selectedIcon)?.icon || Folder,
            { 
              className: "w-5 h-5",
              style: { color: selectedColor }
            }
          )}
          <span className="font-medium">{name || 'Folder Name'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!name.trim()}
          style={{ backgroundColor: selectedColor }}
          className="text-white hover:opacity-90"
        >
          {folder ? 'Update Folder' : 'Create Folder'}
        </Button>
      </div>
    </form>
  )
}