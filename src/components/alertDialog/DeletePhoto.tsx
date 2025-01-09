'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { removeProductPhoto } from '@/db/actions/product/delete'
import { useToast } from '@/hooks/use-toast'
import { Loader, Trash } from 'lucide-react'
import { useState, useTransition } from 'react'

type Props = {
  filePath: string
  productId: string
}

function AlertDialogDeletePhoto({ filePath, productId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const deletePhoto = () => {
    startTransition(async () => {
      const result = await removeProductPhoto(productId, filePath)
      if (result) {
        toast({
          description: 'Photo deleted',
        })
      }
      setOpen(false)
    })
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="destructive">
          Delete
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to delete this photo?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            current product photo
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={isPending} onClick={deletePhoto}>
            {isPending && <Loader className="animate-spin" />}
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogDeletePhoto
