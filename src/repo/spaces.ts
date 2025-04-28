import {
  Room,
  Space,
  SpacesPagination,
  TimeSlots,
} from '@/interfaces/space.interface'

export const fetchSpaces = (page: number = 1, limit: number = 6) => {
  return new Promise<SpacesPagination>(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/v1/spaces?page=${page}&limit=${limit}`,
        { next: { revalidate: 300 } },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Fetch spaces failed')
      }

      const body = await response.json()
      resolve(body.data as SpacesPagination)
    } catch (_) {
      reject()
    }
  })
}

export const getSpaceById = (id: string) => {
  return new Promise<Space>(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/v1/spaces/${id}`,
        {
          cache: 'no-store',
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Fetch failed')
      }

      const body = await response.json()

      resolve(body.data as Space)
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Update failed'))
    }
  })
}

export const getTimeslots = (spaceId: string, roomId: string, date: string) => {
  return new Promise<TimeSlots[]>(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/v1/spaces/${spaceId}/rooms/${roomId}/reservations/timeslots?date=${date}`,
        { cache: 'no-store' },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch time slots')
      }

      const body = await response.json()
      const timeslots = body.data as TimeSlots[]
      resolve(timeslots as TimeSlots[])
      return
    } catch (e) {
      reject(e instanceof Error ? e : new Error('Failed to fetch time slots'))
    }
  })
}

export const addRoom = (
  space_id: string,
  room: Partial<Room>,
  token: string,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/v1/spaces/${space_id}/rooms`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(room),
        },
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add a room')
      }

      resolve({})
    } catch (e) {
      reject(e instanceof Error ? e : new Error('Failed to add a room'))
    }
  })
}

export const addSpace = (space: Partial<Space>, token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      space.rooms = []
      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/v1/spaces/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(space),
        },
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add a space')
      }

      resolve({})
    } catch (e) {
      reject(e instanceof Error ? e : new Error('Failed to add a space'))
    }
  })
}
