'use client'

import React, { SyntheticEvent, useState } from 'react'
import { Button, Input, Textarea, Card, CardHeader, CardBody } from '@nextui-org/react'

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
    // Regular expression to match a valid number with up to 18 decimal places
    const regex = /^(\d+(\.\d{0,18})?)?$/

    // Parse the value as a float
    const floatValue = parseFloat(value)

    // Check if the value matches the regex, falls within the desired range, and does not have more than 18 decimal places
    if ((value === '' || regex.test(value)) && floatValue >= 0 && floatValue <= 1) {
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
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <CardHeader className="mb-4">
            <h2 className="text-2xl font-bold">New Bounty</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  isClearable
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <Input
                  isClearable
                  label="Reward"
                  type="text"
                  value={reward}
                  onChange={onRewardChanged}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <Textarea
                  label="Description"
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <Input
                  isClearable
                  label="Image file"
                  type="file"
                  onChange={(e) => setNewImageFile(e.target.files?.[0])}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <Button type="submit" disabled={isLoading} className="min-w-[100px]">
                  {isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
