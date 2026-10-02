import Hero from '../components/sections/Hero'
import Nostalgia from '../components/sections/Nostalgia'
import FeaturedProducts from '../components/sections/FeaturedProducts'

export default function HomePage({ cart, onAdd, onChangeQuantity, products, loading, error, retry }) {
  return (
    <>
      <Hero />
      <Nostalgia />
      <FeaturedProducts products={products} cart={cart} onAdd={onAdd} onChangeQuantity={onChangeQuantity} loading={loading} error={error} onRetry={retry} home limit={2} />
    </>
  )
}
