import Categories from '../components/sections/Categories'

export default function CategoriesPage({ categories, loading, error, retry, onNavigate }) {
  return <Categories categories={categories} loading={loading} error={error} onRetry={retry} onNavigate={onNavigate} />
}
