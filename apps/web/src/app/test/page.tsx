import React from 'react'

const page = () => {
  return (
    <div className="flex gap-4 max-w-[60%] mx-auto h-full">
      <div className="flex-[0_0_184px] bg-red-50">123123</div>
      <div className="flex-1">
        <div className="w-full">
          我看到了在ImageUpload组件中出现的TypeError错误，这是由于fileList可能为undefined或null导致的。需要修改upload.tsx文件中的代码，在使用fileList.map之前添加空值检查，同时优化SortableContext和Image.PreviewGroup组件中对fileList的处理逻辑，确保在fileList为空时能够正常工作。这些修改将提高组件的健壮性，避免类似的运行时错误。
          添加fileList的空值检查，并优化相关逻辑以提高组件的健壮性。
        </div>
      </div>
    </div>
  )
}

export default page
