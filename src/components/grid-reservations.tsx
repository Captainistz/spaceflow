import Image from 'next/image'
import Link from 'next/link'

import { format } from 'date-fns'
import { Calendar, Clock, User } from 'lucide-react'
import { Session } from 'next-auth'

import ReservationActions from '@/components/reservation-actions'
import StatusBadge from '@/components/status-badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent } from '@/components/ui/card'
import { Reservation } from '@/interfaces/reservation.interface'

const GridReservations = ({
  reservations,
  session,
}: {
  reservations: Reservation[]
  session: Session | null
}) => {
  return (
    <div className='flex flex-col gap-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {reservations.length === 0 ? (
          <div className='col-span-full p-8 text-center'>
            No reservations found.
          </div>
        ) : (
          reservations.map((reservation) => (
            <Card
              key={reservation._id}
              className='w-full rounded-lg overflow-hidden shadow-md pt-0 min-h-[24rem]'
            >
              <div className='relative bg-muted block'>
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={
                      reservation.room.image
                        ? `/spaces${reservation.room.image}`
                        : '/spaces/placehold.jpg'
                    }
                    alt='Card Image'
                    fill
                    sizes='100'
                    className='rounded-t-md object-cover'
                  />
                  <div className='absolute right-3 bottom-3'>
                    <StatusBadge
                      status={reservation.status}
                      className='w-fit font-bold text-xs'
                    />
                  </div>
                </AspectRatio>
              </div>
              <CardContent className='space-y-4'>
                <div className='flex justify-between'>
                  <Link href={`/spaces/${reservation.space._id}`}>
                    <h3 className='text-lg font-bold'>
                      {reservation.space.name}
                    </h3>
                    <p className='text-md text-muted-foreground'>
                      Room {reservation.room.roomNumber}
                    </p>
                  </Link>

                  <ReservationActions reservation={reservation} />
                </div>

                <div className='mt-4 pt-4 flex justify-between items-end'>
                  <div className='text-sm text-muted-foreground'>
                    {session?.user.role === 'admin' && (
                      <div className='flex gap-2 items-center'>
                        <User className='w-4 h-4' />
                        {reservation.user.name}
                      </div>
                    )}
                    <div className='flex gap-2 items-center'>
                      <Calendar className='w-4 h-4' />
                      {format(reservation.reservationDate, 'MMM d, yyyy')}
                    </div>
                    <div className='flex gap-2 items-center'>
                      <Clock className='w-4 h-4' />
                      {format(reservation.reservationDate, 'HH:mm')}
                    </div>
                  </div>
                  <div className='text-lg text-right'>
                    <div className='font-medium'>
                      {reservation.room.price} ฿
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default GridReservations
