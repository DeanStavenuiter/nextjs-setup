import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export const resetPasswordHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.status(200).json({ name: 'John Doe' })
}