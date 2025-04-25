'use client'
import { useMemo } from 'react'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowLeft,
  Clock,
  Coins,
  MapPin,
  Smartphone,
  Users,
} from 'lucide-react'
import { Star } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBooking } from '@/context/booking-context'
import { useEditModal } from '@/context/edited-status'
import { Reservation } from '@/interfaces/reservation.interface'
import { Review } from '@/interfaces/review.interface'
import { Space } from '@/interfaces/space.interface'

import BookingMenuSkeleton from './booking-menu-skeleton'
import CreateReview from './create-review'
import EditReview from './edit-review'
import ReviewBox from './review-box'

const BookingMenu = dynamic(() => import('@/components/booking-menu'), {
  loading: () => <BookingMenuSkeleton />,
  ssr: false,
})

const SpaceDetailClient = ({
  space,
  reservations,
  reviews,
}: {
  space: Space
  reservations: Reservation[]
  reviews: Review[]
}) => {
  const { setSelectedRoom } = useBooking()
  const { isEdit } = useEditModal()
  const { data: session } = useSession()

  const hasReservation = useMemo(() => {
    if (!session?.user._id) return false

    return reservations.some(
      (reservation) =>
        reservation.user._id === session.user._id &&
        reservation.status === 'completed' &&
        reservation.space._id === space._id,
    )
  }, [session, reservations, space._id])

  const hasReview = reviews.some(
    (review) => review.userId._id === session?.user._id,
  )

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null

  return (
    <section id='booking'>
      <Button variant='ghost' size='sm' asChild className='mb-6'>
        <Link href='/spaces'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to spaces
        </Link>
      </Button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <AspectRatio ratio={16 / 9}>
            <Image
              src={`/spaces${space.image}`}
              alt='Card Image'
              fill
              sizes='100'
              priority
              className='rounded-lg object-cover'
            />
          </AspectRatio>

          <div className='mt-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div>
                <div className='flex gap-2 items-center'>
                  <h1 className='text-3xl font-bold'>{space.name}</h1>
                </div>
                <div className='flex items-center mt-2 text-muted-foreground'>
                  <MapPin className='h-4 w-4 mr-1' />
                  <span>{`${space.address}, ${space.district}, ${space.province}`}</span>
                </div>
                <div className='flex items-center mt-2 text-muted-foreground'>
                  {averageRating && (
                    <div className='flex flex-row items-center gap-1'>
                      {averageRating}{' '}
                      <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Separator className='my-6' />
            <Tabs defaultValue='about'>
              <TabsList>
                <TabsTrigger value='about'>About</TabsTrigger>
                <TabsTrigger value='reviews'>Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value='about' className='mt-4'>
                <div className='flex flex-col gap-5 text-lg font-medium'>
                  <div className='flex gap-2 items-center'>
                    <Smartphone className='w-6 h-6' />

                    <h1>{space.tel}</h1>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <Clock className='w-6 h-6' />
                    {`${space.opentime.slice(0, 2)}:${space.opentime.slice(2)} - ${space.closetime.slice(0, 2)}:${space.closetime.slice(2)}`}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value='reviews' className='mt-4'>
                <div>
                  {hasReservation ? (
                    hasReview ? (
                      isEdit ? (
                        <>
                          <p className='text-2xl font-bold mb-4'>Your review</p>
                          <EditReview
                            space={space}
                            review={
                              reviews.find(
                                (r) => r.userId._id === session?.user._id,
                              )!
                            }
                          />
                        </>
                      ) : (
                        <>
                          <p className='text-2xl font-bold mb-4'>Your review</p>
                          <ReviewBox
                            review={
                              reviews.find(
                                (r) => r.userId._id === session?.user._id,
                              )!
                            }
                          />
                        </>
                      )
                    ) : (
                      <CreateReview space={space} />
                    )
                  ) : (
                    <p>
                      You need to completed your reservation to leave review
                    </p>
                  )}
                  <p className='text-2xl font-bold my-4'>Reviews & Rating</p>

                  <div className='grid grid-cols-1 gap-2'>
                    {reviews.length !== 0 &&
                    reviews.find((r) => r.userId._id !== session?.user._id) ? (
                      reviews
                        .filter((r) => r.userId._id !== session?.user._id)
                        .map((review) => (
                          <ReviewBox review={review} key={review._id} />
                        ))
                    ) : (
                      <div>there is no other review here</div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          {space.rooms.length !== 0 ? (
            <>
              <h2 className='text-2xl font-bold mt-10 mb-6'>Available Rooms</h2>
              <Separator className='my-6' />
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {space.rooms.map((room) => (
                  <div key={room._id}>
                    <Card
                      key={room._id}
                      className='hidden sm:flex w-full pt-0 rounded-lg'
                    >
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={
                            `/spaces${room.image}` || '/spaces/placehold.jpg'
                          }
                          alt='Card Image'
                          fill
                          sizes='100'
                          className='rounded-t-md object-cover'
                        />
                      </AspectRatio>
                      <CardContent className='space-y-2'>
                        <CardTitle className='text-xl font-bold truncate'>
                          {room.roomNumber}
                        </CardTitle>
                        <CardDescription className='text-muted-foreground space-y-1'>
                          <div className='flex gap-1 overflow-x-auto no-scrollbar'>
                            {room.facilities.length !== 0 ? (
                              room.facilities.map((item) => (
                                <Badge key={item} variant='outline'>
                                  {item}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant='outline'>No facilities</Badge>
                            )}
                          </div>
                        </CardDescription>
                      </CardContent>
                      <CardFooter className='pt-0 mt-auto flex justify-between'>
                        <div className='flex gap-5'>
                          <div className='flex gap-2 items-center'>
                            <Users className='w-4 h-4' />
                            {room.capacity}
                          </div>
                          <div className='flex gap-2 items-center'>
                            <Coins className='w-4 h-4' />
                            {room.price} ฿
                          </div>
                        </div>

                        <Button
                          size='sm'
                          className='cursor-pointer'
                          onClick={() => {
                            setSelectedRoom(room)
                            document
                              .getElementById('booking-menu')
                              ?.scrollIntoView({
                                behavior: 'smooth',
                              })
                          }}
                        >
                          Select this room
                        </Button>
                      </CardFooter>
                    </Card>
                    {/* Small card */}
                    <div
                      key={room._id + ' small'}
                      className='block sm:hidden h-[200px] rounded-xl border bg-card text-card-foreground shadow overflow-hidden'
                    >
                      <div className='h-full grid grid-cols-5 gap-2'>
                        <div className='col-span-2 relative w-full'>
                          <Image
                            src={
                              `/spaces${room.image}` || '/spaces/placehold.jpg'
                            }
                            alt='Card Image'
                            fill
                            sizes='100'
                            className='rounded-l-md object-cover'
                          />
                        </div>
                        <div className='col-span-3 flex flex-col justify-between p-4 overflow-hidden'>
                          <div className='flex flex-col gap-2'>
                            <div className='text-xl font-bold truncate'>
                              {room.roomNumber}
                            </div>
                            <div className='flex gap-1 overflow-x-auto no-scrollbar'>
                              {room.facilities.length !== 0 ? (
                                room.facilities.map((item) => (
                                  <Badge key={item} variant='outline'>
                                    {item}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant='outline'>No Facilities</Badge>
                              )}
                            </div>
                            <div className='flex gap-5'>
                              <div className='flex gap-2 items-center'>
                                <Users className='w-4 h-4' />
                                {room.capacity}
                              </div>
                              <div className='flex gap-2 items-center'>
                                <Coins className='w-4 h-4' />
                                {room.price} ฿
                              </div>
                            </div>
                          </div>
                          <div className='flex justify-end'>
                            <Button
                              size='sm'
                              className='w-32 cursor-pointer'
                              onClick={() => {
                                setSelectedRoom(room)
                                document
                                  .getElementById('booking-menu')
                                  ?.scrollIntoView({
                                    behavior: 'smooth',
                                  })
                              }}
                            >
                              Select this room
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <h2 className='text-2xl font-bold mt-10 mb-6'>No available room</h2>
          )}
        </div>
        <div id='booking-form'>
          <BookingMenu space={space} session={session} />
        </div>
      </div>
    </section>
  )
}

export default SpaceDetailClient
