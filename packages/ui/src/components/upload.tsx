'use client'
import { useState } from 'react'
import { Upload, Image } from 'antd'
import { PlusOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import type { RcFile } from 'antd/es/upload'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './upload.css'

export interface ImageUploadProps extends Omit<UploadProps, 'listType'> {
  maxCount?: number
  maxSize?: number // 单位：MB
  fileList?: UploadFile[]
  onFileListChange?: (fileList: UploadFile[]) => void
}

const SortableItem = ({
  file,
  isLast,
  hiddenCount,
  onExpand
}: {
  file: UploadFile
  isLast?: boolean
  hiddenCount?: number
  onExpand?: () => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.uid })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }
  const [isDragging, setIsDragging] = useState(false)

  // 生成预览URL
  const previewUrl = URL.createObjectURL(file.originFileObj)

  const handleClick = (e: React.MouseEvent) => {
    if (isLast && onExpand && hiddenCount && hiddenCount > 0) {
      e.stopPropagation()
      e.preventDefault()
      onExpand()
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={`upload-list-item ${isDragging ? 'dragging' : ''}`}>
      <div className="upload-list-item-info">
        <Image
          src={previewUrl || file.url || file.thumbUrl || file.preview}
          alt={file.name}
          className={`upload-list-item-image ${isLast ? 'upload-list-expand-image' : ''}`}
          preview={isLast ? false : { maskClassName: 'hidden' }}
          onClick={isLast ? handleClick : undefined}
        />
        {isLast ? (
          <div className="upload-list-expand-info ui-z-50" onClick={handleClick}>
            <div className="upload-list-expand-text">+{hiddenCount}</div>
          </div>
        ) : (
          <span className="upload-list-item-actions">
            <span
              className="upload-list-item-drag-handle"
              {...attributes}
              {...listeners}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
            >
              <HolderOutlined />
            </span>
            <DeleteOutlined
              className="upload-list-item-action"
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          </span>
        )}
      </div>
    </div>
  )
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  maxCount = 17,
  maxSize = 20,
  onChange,
  fileList,
  onFileListChange,
  ...props
}) => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))
  const [expanded, setExpanded] = useState(false)

  const handleExpand = () => {
    setExpanded(!expanded)
  }

  const visibleCount = expanded ? fileList?.length || 0 : 2 // 两行显示数量 (4 * 2)
  const displayedFiles = expanded
    ? fileList
    : fileList && fileList.length > visibleCount
      ? fileList.slice(0, visibleCount)
      : fileList
  const hiddenCount = fileList && fileList.length > visibleCount ? fileList.length - visibleCount : 0

  const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
    const updatedFileList = [...(newFileList || [])]

    if (file.status === 'uploading' && file.originFileObj) {
      const previewUrl = URL.createObjectURL(file.originFileObj)
      file.preview = previewUrl
      file.thumbUrl = previewUrl
    }

    // 更新或添加文件到列表
    const fileIndex = updatedFileList.findIndex((f) => f.uid === file.uid)
    if (fileIndex > -1) {
      updatedFileList[fileIndex] = file
    }

    onChange?.({ file, fileList: updatedFileList })
    onFileListChange?.(updatedFileList)
  }

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件！')
      return false
    }

    const isLtMaxSize = file.size / 1024 / 1024 < maxSize
    if (!isLtMaxSize) {
      message.error(`图片大小不能超过 ${maxSize}MB！`)
      return false
    }

    return true
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id && fileList) {
      const oldIndex = fileList.findIndex((file) => file.uid === active.id)
      const newIndex = fileList.findIndex((file) => file.uid === over.id)
      const newFileList = arrayMove(fileList, oldIndex, newIndex)
      onFileListChange?.(newFileList)
    }
    // 重置所有项的拖拽状态
    const items = document.querySelectorAll('.upload-list-item')
    items.forEach((item) => item.classList.remove('dragging'))
  }
  console.log(fileList)

  return (
    <div className="upload-container">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={(fileList || []).map((file) => file.uid)} strategy={rectSortingStrategy}>
          <Image.PreviewGroup
            items={(fileList || []).map((file) => ({
              src:
                (file.originFileObj && URL.createObjectURL(file.originFileObj)) ||
                file.url ||
                file.preview ||
                file.thumbUrl
            }))}
          >
            <div className="upload-list">
              {displayedFiles?.map((file, index) => (
                <SortableItem
                  key={file.uid}
                  file={file}
                  isLast={!expanded && hiddenCount > 0 && index === displayedFiles.length - 1}
                  hiddenCount={hiddenCount}
                  onExpand={handleExpand}
                />
              ))}
              {(!fileList || fileList.length < maxCount) && (
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  {...props}
                  className="upload-trigger"
                >
                  <div className="upload-trigger-content">
                    <PlusOutlined className="upload-trigger-icon" />
                    <div className="upload-trigger-text">上传</div>
                  </div>
                </Upload>
              )}
            </div>
          </Image.PreviewGroup>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default ImageUpload
