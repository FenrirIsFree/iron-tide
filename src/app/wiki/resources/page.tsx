import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import ResourcesContent from './ResourcesContent'
import { getResources } from '@/lib/gameData'

export const metadata = {
  title: 'Resources — The Iron Tide Wiki',
  description: 'All resources in World of Sea Battle — materials, trade goods, currencies, and special items.',
}

export default function ResourcesPage() {
  const resources = getResources()

  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Resources" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">💎 Resources</h1>
        <p className="text-foreground-secondary mt-1">
          {resources.length} resources — materials, trade goods, currencies, and special items
        </p>
      </div>
      <ResourcesContent resources={resources} />
    </main>
  )
}
