import { Suspense } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { Clock, MapPin } from 'lucide-react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Space } from '@/interfaces/space.interface'

const SpacesView = async ({ spaces }: { spaces: Space[] }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:grid-rows-2'>
      {spaces.map((space) => (
        <Card
          key={space._id}
          className='w-full rounded-lg overflow-hidden shadow-md pt-0 min-h-[30rem]'
        >
          <div className='relative bg-muted block'>
            <AspectRatio ratio={16 / 9}>
              <Suspense fallback={<div className='bg-black size-full'></div>}>
                <Image
                  key={space._id}
                  src={`/spaces${space.image}`}
                  alt='Card Image'
                  fill
                  sizes='100'
                  loading='eager'
                  className='rounded-t-md object-cover'
                />
              </Suspense>
            </AspectRatio>
          </div>
          <CardContent className='space-y-4'>
            <div className='space-y-1'>
              <CardTitle className='text-xl font-bold truncate'>
                {space.name}
              </CardTitle>
              <CardDescription className='flex gap-1 items-center text-muted-foreground'>
                <MapPin className='w-4 h-4' />
                {`${space.address}, ${space.district}, ${space.province}`}
              </CardDescription>
            </div>
          </CardContent>
          <CardFooter className='mt-auto'>
            <div className='flex flex-col justify-between items-start w-full space-y-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='text-gray-500 text-sm flex gap-1 items-center'>
                  <Clock className='w-4 h-4' />
                  {`${space.opentime.slice(0, 2)}:${space.opentime.slice(2)} - ${space.closetime.slice(0, 2)}:${space.closetime.slice(2)}`}
                </div>
                <div className='text-gray-500 text-sm flex gap-1 items-center'>
                  {space.rooms.length}{' '}
                  {space.rooms.length > 1 ? 'rooms' : 'room'} available
                </div>
              </div>
              <Button className='w-full' asChild>
                <Link href={`/spaces/${space._id}`}>Details</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default SpacesView
