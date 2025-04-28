import { APIResponse } from '@/interfaces/interface'
import {
  Reservation,
  ReservationResponse,
} from '@/interfaces/reservation.interface'
import { sortParams } from '@/types/types'

export const fetchReservations = (
  token: string,
  sort: sortParams = 'date-desc',
) => {
  return new Promise<Reservation[]>(async (resolve, _) => {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('sort', sort)

      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/v1/reservations?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch reservations')
      }

      const body = await response.json()

      resolve(body.data as Reservation[])
    } catch (e) {
      resolve([] as Reservation[])
    }
  })
}

export const deleteReservation = (reservation: string, token: string) => {
  return new Promise<APIResponse<null>>(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/v1/reservations/${reservation}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to reserver')
      }

      const body = await response.json()
      resolve(body as APIResponse<null>)
    } catch (e) {
      reject(e instanceof Error ? e : 'Failed to reserve')
    }
  })
}

export const createReservation = (
  space: string,
  room: string,
  date: Date,
  time: string,
  token: string,
) => {
  return new Promise<APIResponse<ReservationResponse>>(
    async (resolve, reject) => {
      try {
        const hours = parseInt(time.substring(0, 2))
        const minutes = parseInt(time.substring(3, 5))

        date = new Date(date)
        date.setHours(hours)
        date.setMinutes(minutes)

        const response = await fetch(
          `${process.env.API_ENDPOINT}/api/v1/spaces/${space}/reservations`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              reservationDate: date.toISOString(),
              room: room,
            }),
            cache: 'no-store',
          },
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to reserve')
        }

        const body = await response.json()
        resolve(body as APIResponse<ReservationResponse>)
      } catch (e) {
        reject(e instanceof Error ? e : 'Failed to reserve')
      }
    },
  )
}

export const updateReservation = (
  reservation_id: string,
  date: Date,
  time: string,
  token: string,
) => {
  return new Promise<APIResponse<ReservationResponse>>(
    async (resolve, reject) => {
      try {
        const hours = parseInt(time.substring(0, 2))
        const minutes = parseInt(time.substring(3, 5))

        date = new Date(date)
        date.setHours(hours)
        date.setMinutes(minutes)

        const response = await fetch(
          `${process.env.API_ENDPOINT}/api/v1/reservations/${reservation_id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              reservationDate: date.toISOString(),
            }),
          },
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to update')
        }
        const body = await response.json()
        resolve(body as APIResponse<ReservationResponse>)
      } catch (e) {
        reject(e instanceof Error ? e : 'Failed to update')
      }
    },
  )
}
