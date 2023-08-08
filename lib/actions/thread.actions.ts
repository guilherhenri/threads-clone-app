'use server'

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
  try {
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
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`)
  }
}
