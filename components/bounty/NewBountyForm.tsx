'use client'

import React, { SyntheticEvent, useState } from 'react'

import { useBounty } from '@/hooks/useBounty'
import { useImageStore } from '@/hooks/useImageStore'

interface NewBountyFormProps {
  className: string
}

export const NewBountyForm = ({ className }: NewBountyFormProps) => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [reward, setReward] = useState<string>('')
  const [newImageFile, setNewImageFile] = useState<File | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const { createBounty } = useBounty()
  const { uploadImage } = useImageStore()

  const clearForm = () => {
    setTitle('')
    setDescription('')
    setReward('')
    setNewImageFile(undefined)
  }

  const onRewardChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const regex = /^(\d+(\.\d{0,2})?)?$/

    const floatValue = parseFloat(value)

    if ((value === '' || regex.test(value)) && floatValue >= 0) {
      setReward(value)
    }
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

    // if ([title, description, reward, newImageFile].includes(undefined)) {
    //   return
    // }

    setIsLoading(true)

    try {
      // const imageId = await uploadImage(newImageFile as File)
      await createBounty({ title, description, imageId: '1', reward })
    } catch (e) {
      console.error(`Unable to create the bounty: ${e}`)
    }

    clearForm()
    setIsLoading(false)
  }

  return (
    <div className={className}>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg p-6 shadow-lg">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">New Bounty</h2>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                {/* <input
                  isClearable
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                /> */}
              </div>
              <div className="mb-4">
                {/* <input
                  isClearable
                  label="Reward"
                  type="text"
                  value={reward}
                  onChange={onRewardChanged}
                  className="w-full"
                /> */}
              </div>
              <div className="mb-4">
                {/* <Textarea
                  label="Description"
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full"
                /> */}
              </div>
              <div className="mb-4">
                {/* <Input
                  isClearable
                  label="Image file"
                  type="file"
                  onChange={(e) => setNewImageFile(e.target.files?.[0])}
                  className="w-full"
                /> */}
              </div>
              <div className="flex items-center justify-between">
                {/* <Button type="submit" disabled={isLoading} className="min-w-[100px]">
                  {isLoading ? 'Loading...' : 'Submit'}
                </Button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
