"use client"
import { ImageUpload } from "@repo/ui"
import { Button, Form } from "antd"
import { useState } from "react"

const UploadPage = () => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any[]>([])

  const handleChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList)
  }

  const onFinsh = (values: any) => {
    console.log("values", values)
  }
  return (
    <div>
      <Form form={form} onFinish={onFinsh}>
        <Form.Item name="img" valuePropName="fileList">
          <ImageUpload
            fileList={fileList}
            onChange={handleChange}
            onFileListChange={setFileList}
            // beforeUpload={beforeUpload}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default UploadPage
