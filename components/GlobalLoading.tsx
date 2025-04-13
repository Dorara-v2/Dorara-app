
import { View, StyleSheet, ActivityIndicator, Image, Text } from 'react-native'
import { BlurView } from 'expo-blur'
import { useLoadingStore } from '../store/loadingStore'
import { Typo } from './Typo'

const GlobalLoading = () => {
  const { isLoading, content } = useLoadingStore()

  if (!isLoading) return null

  return (
    <View className='absolute left-0 right-0 top-0 bottom-0'>
      <BlurView intensity={50} tint="dark" className='absolute left-0 bottom-0 right-0 top-0' />
      <View className='absolute left-0 bottom-0 right-0 top-0 flex flex-col items-center justify-center'>
        <Image
          source={require('../assets/catFalling.gif')}
          className='w-52 h-52 mb-2'
            resizeMode='contain'
        />
        <Typo
            className='text-2xl font-semibold'
            >
            {content}
            </Typo>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default GlobalLoading
