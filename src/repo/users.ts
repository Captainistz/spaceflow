import { User, UserAuthResponse, UserRole } from '@/interfaces/user.interface'

/*  currently using mockup data
 *  TODO: Implement Backend API Usage
 */

export const authenticateUser = (email: string, password: string) => {
  return new Promise<UserAuthResponse>(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/v1/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Authentication failed')
      }

      const body = await response.json()

      resolve({
        success: true,
        data: {
          token: body.data.token,
          _id: body.data._id,
          name: body.data.name,
          email: body.data.email,
          image: body.data.image,
          phone: body.data.phone,
          role: body.data.role as UserRole,
        },
      })
    } catch (error) {
      reject(
        error instanceof Error ? error : new Error('Authentication failed'),
      )
    }
  })
}

export const updateUserProfile = (
  id: string,
  updates: Partial<User>,
  token: string,
) => {
  return new Promise<UserAuthResponse>(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/v1/users/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Update failed')
      }

      const body = await response.json()
      resolve({
        success: true,
        message: body.message,
        data: {
          token: body.data.token,
          _id: body.data._id,
          name: body.data.name,
          email: body.data.email,
          image: body.data.image,
          phone: body.data.phone,
          role: body.data.role as UserRole,
        },
      })
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Update failed'))
    }
  })
}

export const registerUser = (user: Omit<User, '_id'>) => {
  return new Promise<UserAuthResponse>(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/v1/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...user }),
        },
      )
      if (!response.ok) throw new Error('Cannot register')
      const body = await response.json()
      resolve(body)
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Register failed'))
    }
  })
}
