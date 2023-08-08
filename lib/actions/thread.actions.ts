import { revalidatePath } from 'next/cache'

import Thread from '../models/thread.model'
import User from '../models/user.model'
import { connectToDB } from '../mongoose'

interface CreateThreadParams {
  text: string
  author: string
  communityId: string | null
  path: string
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: CreateThreadParams) {
  connectToDB()

  const thread = await Thread.create({
    text,
    author,
    community: null,
  })

  await User.findByIdAndUpdate(author, {
    $push: { threads: thread._id },
  })

  revalidatePath(path)
}
